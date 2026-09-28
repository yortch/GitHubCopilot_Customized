import { beforeEach, describe, expect, it } from 'vitest';
import { addItem, CART_KEY, cartTotals, readCart, unitCents, updateItems, type CartProduct } from './cart';

const product: CartProduct = { productId: 1, name: 'Collar', imgName: 'smart-collar.png', price: 19.99, discount: 0.2 };

describe('shopping cart', () => {
  beforeEach(() => localStorage.clear());

  it('merges repeated additions and applies product discounts before a coupon', () => {
    const items = addItem(addItem([], product, 2), product, 1);
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(3);
    expect(unitCents(product)).toBe(1599);
    expect(cartTotals(items, true)).toEqual({ subtotal: 4797, discount: 240, shipping: 1000, total: 5557 });
  });

  it('updates quantities and removes zero-quantity lines without shipping an empty cart', () => {
    const items = addItem([], product, 2);
    expect(updateItems(items, { 1: 4 })[0].quantity).toBe(4);
    expect(updateItems(items, { 1: 0 })).toEqual([]);
    expect(cartTotals([], true)).toEqual({ subtotal: 0, discount: 0, shipping: 0, total: 0 });
  });

  it('restores valid items and tolerates invalid browser storage', () => {
    localStorage.setItem(CART_KEY, JSON.stringify([ { ...product, quantity: 2 }, { ...product, quantity: 1 }, { ...product, quantity: -1 } ]));
    expect(readCart()[0].quantity).toBe(3);
    localStorage.setItem(CART_KEY, '{invalid');
    expect(readCart()).toEqual([]);
  });
});
