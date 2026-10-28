import { describe, expect, it } from 'vitest';
import {
  addCartItem, applyCartCoupon, emptyCart, formatMoney, getCartTotals,
  getUnitPriceCents, parseQuantity, readCart, removeCartItem, updateCartQuantities, writeCart,
} from '../src/cart/cart';

const product = { productId: 1, name: 'Smart Collar', imgName: 'smart-collar.png', price: 89 };

describe('cart operations and pricing', () => {
  it('adds selected quantities and merges repeated products without mutating state', () => {
    const first = addCartItem(emptyCart(), product, 2);
    const merged = addCartItem(first, product, 3);
    expect(merged.items).toHaveLength(1);
    expect(merged.items[0].quantity).toBe(5);
    expect(first.items[0].quantity).toBe(2);
    expect(getCartTotals(merged).quantity).toBe(5);
  });

  it('rounds discounted unit prices before calculating line totals', () => {
    const cart = addCartItem(emptyCart(), { ...product, price: 19.99, discount: 0.15 }, 3);
    expect(cart.items[0].unitPriceCents).toBe(1699);
    expect(getCartTotals(cart).subtotal).toBe(5097);
    expect(getUnitPriceCents({ price: 1.005 })).toBe(101);
    expect(getUnitPriceCents({ price: 1, discount: 1 })).toBe(0);
    expect(formatMoney(5097)).toBe('$50.97');
  });

  it('updates quantities atomically and removes products without charging empty-cart shipping', () => {
    const cart = addCartItem(emptyCart(), product, 1);
    expect(updateCartQuantities(cart, { 1: 4 }).items[0].quantity).toBe(4);
    expect(() => updateCartQuantities(cart, { 1: 0 })).toThrow(/positive whole/);
    expect(cart.items[0].quantity).toBe(1);
    const removed = removeCartItem(applyCartCoupon(cart, 'SAVE5'), 1);
    expect(removed).toEqual(emptyCart());
    expect(getCartTotals(removed)).toEqual({ subtotal: 0, discount: 0, shipping: 0, grandTotal: 0, quantity: 0 });
  });

  it.each([0, -1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1])('rejects invalid quantity %s', quantity => {
    expect(() => addCartItem(emptyCart(), product, quantity)).toThrow();
    expect(() => updateCartQuantities(addCartItem(emptyCart(), product, 1), { 1: quantity })).toThrow();
  });

  it.each(['', ' ', '0', '-1', '1.1', '1e2', '+2', 'Infinity', '9007199254740992'])('rejects invalid quantity text "%s"', value => {
    expect(parseQuantity(value)).toBeNull();
  });

  it('rejects unsafe monetary totals and merged quantities', () => {
    expect(() => addCartItem(emptyCart(), product, Number.MAX_SAFE_INTEGER)).toThrow(/too large/);
    const free = { ...product, price: 0 };
    const cart = addCartItem(emptyCart(), free, Number.MAX_SAFE_INTEGER);
    expect(() => addCartItem(cart, free, 1)).toThrow(/too large/);
    expect(() => addCartItem(cart, { ...free, productId: 2 }, 1)).toThrow(/too large/);
  });

  it.each([-1, NaN, Infinity])('rejects invalid price %s', price => {
    expect(() => addCartItem(emptyCart(), { ...product, price }, 1)).toThrow(/invalid price/);
  });

  it('matches the $89 x 3 acceptance example and never stacks SAVE5', () => {
    let cart = emptyCart();
    for (let id = 1; id <= 3; id++) cart = addCartItem(cart, { ...product, productId: id }, 1);
    cart = applyCartCoupon(cart, 'SAVE5');
    expect(getCartTotals(cart)).toEqual({
      subtotal: 26700, discount: 1335, shipping: 1000, grandTotal: 26365, quantity: 3,
    });
    expect(getCartTotals(applyCartCoupon(cart, 'SAVE5'))).toEqual(getCartTotals(cart));
    expect(getCartTotals(updateCartQuantities(cart, { 1: 2, 2: 1, 3: 1 })).discount).toBe(1780);
  });

  it.each(['', 'save5', 'SAVE5 ', ' SAVE5', 'SAVE10'])('rejects coupon "%s"', coupon => {
    expect(() => applyCartCoupon(emptyCart(), coupon)).toThrow(/coupon/);
  });

  it('rounds fractional coupon cents consistently', () => {
    const cart = applyCartCoupon(addCartItem(emptyCart(), { ...product, price: 0.10 }, 1), 'SAVE5');
    expect(getCartTotals(cart)).toMatchObject({ subtotal: 10, discount: 1, grandTotal: 1009 });
  });
});

describe('saved cart validation', () => {
  it('round trips the items, prices, quantities and coupon', () => {
    const cart = applyCartCoupon(addCartItem(emptyCart(), product, 2), 'SAVE5');
    expect(readCart(writeCart(cart))).toEqual(cart);
  });

  it.each(['{', 'null', '{}', '{"version":2,"items":[],"coupon":null}'])('rejects malformed or unsupported storage: %s', saved => {
    expect(() => readCart(saved)).toThrow();
  });

  it('rejects corrupt quantities, prices, duplicate rows and unsupported coupons', () => {
    const cart = addCartItem(emptyCart(), product, 1);
    const item = cart.items[0];
    for (const items of [
      [{ ...item, quantity: -1 }],
      [{ ...item, quantity: 1.5 }],
      [{ ...item, unitPriceCents: -1 }],
      [{ ...item, unitPriceCents: 1.1 }],
      [{ ...item, quantity: Number.MAX_SAFE_INTEGER }],
      [{ ...item, name: '' }],
      [item, item],
    ]) {
      expect(() => readCart(JSON.stringify({ version: 1, items, coupon: null }))).toThrow();
    }
    expect(() => readCart(JSON.stringify({ version: 1, items: [], coupon: 'SAVE10' }))).toThrow();
  });
});
