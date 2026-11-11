/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';

export interface CartProduct {
  productId: number;
  name: string;
  price: number;
  imgName: string;
  discount?: number;
}

export interface CartItem extends CartProduct {
  quantity: number;
}

const storageKey = 'octocat-cart';

function readCart(): CartItem[] {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (!Array.isArray(stored)) return [];
    return stored.filter((item): item is CartItem =>
      item && Number.isSafeInteger(item.productId) &&
      typeof item.name === 'string' && typeof item.imgName === 'string' &&
      typeof item.price === 'number' && Number.isFinite(item.price) && item.price >= 0 &&
      (item.discount === undefined || (typeof item.discount === 'number' && item.discount >= 0 && item.discount <= 1)) &&
      Number.isSafeInteger(item.quantity) && item.quantity > 0
    );
  } catch {
    return [];
  }
}

export function unitPriceCents(item: CartProduct) {
  return Math.round(item.price * (1 - (item.discount || 0)) * 100);
}

interface CartContextValue {
  items: CartItem[];
  addItem: (product: CartProduct, quantity: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readCart);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {
      // The cart remains usable for this session if storage is unavailable.
    }
  }, [items]);

  const addItem = (product: CartProduct, quantity: number) => {
    if (!Number.isSafeInteger(quantity) || quantity <= 0) return;
    setItems(current => {
      const existing = current.find(item => item.productId === product.productId);
      if (existing) {
        const nextQuantity = existing.quantity + quantity;
        if (!Number.isSafeInteger(nextQuantity)) return current;
        return current.map(item => item.productId === product.productId ? { ...product, quantity: nextQuantity } : item);
      }
      return [...current, { ...product, quantity }];
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (!Number.isSafeInteger(quantity) || quantity <= 0) return;
    setItems(current => current.map(item => item.productId === productId ? { ...item, quantity } : item));
  };

  const removeItem = (productId: number) => setItems(current => current.filter(item => item.productId !== productId));

  return <CartContext.Provider value={{ items, addItem, updateQuantity, removeItem }}>{children}</CartContext.Provider>;
}
