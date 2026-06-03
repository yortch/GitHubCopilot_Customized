import { describe, expect, it } from 'vitest';
import type { CartItem } from '../types/cart';
import {
  getCartSubtotal,
  getDiscountAmount,
  getGrandTotal,
  getLineTotal,
  getShippingAmount,
  getUnitPrice,
} from '../utils/cartCalculations';

const cartItem: CartItem = {
  product: {
    productId: 10,
    name: 'Smart Feeder',
    description: 'Automated feeding system',
    price: 100,
    imgName: 'feeder.png',
    sku: 'FEED-001',
    unit: 'each',
    supplierId: 1,
    discount: 0.1,
  },
  quantity: 2,
};

describe('cart calculations', () => {
  it('calculates discounted unit and line totals', () => {
    expect(getUnitPrice(cartItem.product.price, cartItem.product.discount)).toBe(90);
    expect(getLineTotal(cartItem)).toBe(180);
  });

  it('calculates subtotal, discount, shipping and grand total', () => {
    const subtotal = getCartSubtotal([cartItem]);
    const discount = getDiscountAmount(subtotal, 0.05);
    const shipping = getShippingAmount(subtotal, false);

    expect(subtotal).toBe(180);
    expect(discount).toBe(9);
    expect(shipping).toBe(10);
    expect(getGrandTotal(subtotal, discount, shipping)).toBe(181);
  });

  it('returns free shipping when coupon enables it', () => {
    expect(getShippingAmount(250, true)).toBe(0);
    expect(getShippingAmount(0, false)).toBe(0);
  });
});
