import type { CartItem } from '../types/cart';
import type { Product } from '../types/product';

export const CART_DISCOUNT_RATE = 0.05;
export const CART_SHIPPING_FEE = 10;

export const getEffectiveUnitPrice = (product: Product): number => {
  const discount = product.discount ?? 0;
  return product.price * (1 - discount);
};

export const calculateSubtotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + getEffectiveUnitPrice(item.product) * item.quantity, 0);
};

export const calculateCartSummary = (items: CartItem[]) => {
  const subtotal = calculateSubtotal(items);
  const discount = subtotal * CART_DISCOUNT_RATE;
  const shipping = CART_SHIPPING_FEE;
  const total = subtotal - discount + shipping;

  return {
    subtotal,
    discount,
    shipping,
    total,
  };
};

export const formatCurrency = (value: number): string => `$${value.toFixed(2)}`;
