import { createContext, useContext } from 'react';
import type { Cart, CartProduct } from '../cart/cart';

export interface CartContextValue {
  cart: Cart;
  message: string;
  error: string | null;
  storageError: string | null;
  addItem: (product: CartProduct, quantity: number) => void;
  updateQuantities: (quantities: Record<number, number>) => void;
  removeItem: (productId: number) => void;
  applyCoupon: (code: string) => void;
  retrySave: () => void;
}

export const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
