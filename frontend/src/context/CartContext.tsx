/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { CartItem, CartState } from '../types/cart';
import type { Product } from '../types/product';

interface CartContextValue {
  items: CartItem[];
  couponCode: string;
  itemCount: number;
  addToCart: (product: Product, quantity: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  applyCoupon: (couponCode: string) => void;
}

const CART_STORAGE_KEY = 'octocat.cart.v1';

const CartContext = createContext<CartContextValue | undefined>(undefined);

const readStoredCart = (): CartState => {
  const fallbackState: CartState = { items: [], couponCode: '' };

  if (typeof window === 'undefined') {
    return fallbackState;
  }

  try {
    const storedState = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!storedState) {
      return fallbackState;
    }

    const parsedState = JSON.parse(storedState) as Partial<CartState>;
    return {
      items: Array.isArray(parsedState.items) ? parsedState.items : [],
      couponCode: typeof parsedState.couponCode === 'string' ? parsedState.couponCode : '',
    };
  } catch {
    return fallbackState;
  }
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartState, setCartState] = useState<CartState>(readStoredCart);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState));
  }, [cartState]);

  const addToCart = (product: Product, quantity: number) => {
    if (quantity <= 0) {
      return;
    }

    setCartState((prevState) => {
      const existingItem = prevState.items.find((item) => item.product.productId === product.productId);

      if (existingItem) {
        return {
          ...prevState,
          items: prevState.items.map((item) =>
            item.product.productId === product.productId
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          ),
        };
      }

      return {
        ...prevState,
        items: [...prevState.items, { product, quantity }],
      };
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    setCartState((prevState) => {
      if (quantity <= 0) {
        return {
          ...prevState,
          items: prevState.items.filter((item) => item.product.productId !== productId),
        };
      }

      return {
        ...prevState,
        items: prevState.items.map((item) =>
          item.product.productId === productId ? { ...item, quantity } : item,
        ),
      };
    });
  };

  const removeFromCart = (productId: number) => {
    setCartState((prevState) => ({
      ...prevState,
      items: prevState.items.filter((item) => item.product.productId !== productId),
    }));
  };

  const clearCart = () => {
    setCartState((prevState) => ({
      ...prevState,
      items: [],
      couponCode: '',
    }));
  };

  const applyCoupon = (couponCode: string) => {
    setCartState((prevState) => ({
      ...prevState,
      couponCode: couponCode.trim(),
    }));
  };

  const itemCount = useMemo(
    () => cartState.items.reduce((sum, item) => sum + item.quantity, 0),
    [cartState.items],
  );

  const contextValue: CartContextValue = {
    items: cartState.items,
    couponCode: cartState.couponCode,
    itemCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
  };

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
