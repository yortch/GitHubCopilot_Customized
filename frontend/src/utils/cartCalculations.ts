import type { CartItem } from '../types/cart';
import { SHIPPING_FEE } from '../types/cart';

const roundToCents = (value: number): number => Math.round(value * 100) / 100;

export const getUnitPrice = (price: number, discount?: number): number => {
  const safeDiscount = discount ?? 0;
  return roundToCents(price * (1 - safeDiscount));
};

export const getLineTotal = (item: CartItem): number => {
  const unitPrice = getUnitPrice(item.product.price, item.product.discount);
  return roundToCents(unitPrice * item.quantity);
};

export const getCartSubtotal = (items: CartItem[]): number => {
  return roundToCents(items.reduce((sum, item) => sum + getLineTotal(item), 0));
};

export const getDiscountAmount = (subtotal: number, discountRate: number): number => {
  return roundToCents(subtotal * discountRate);
};

export const getShippingAmount = (subtotal: number, freeShipping = false): number => {
  if (subtotal <= 0) {
    return 0;
  }

  return freeShipping ? 0 : SHIPPING_FEE;
};

export const getGrandTotal = (subtotal: number, discountAmount: number, shipping: number): number => {
  return roundToCents(Math.max(0, subtotal - discountAmount + shipping));
};
