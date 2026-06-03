import type { Product } from './product';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AppliedCoupon {
  code: string;
  discountRate: number;
  freeShipping?: boolean;
}

export const DEFAULT_DISCOUNT_RATE = 0.05;
export const SHIPPING_FEE = 10;
