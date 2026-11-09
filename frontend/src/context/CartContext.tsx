/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

export interface Product {
  productId: number;
  name: string;
  description: string;
  price: number;
  imgName: string;
  sku: string;
  unit: string;
  supplierId: number;
  discount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  updateQuantities: (quantities: Record<number, number>) => void;
  removeFromCart: (productId: number) => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = 'octocat-cart';

const readCart = (): CartItem[] => {
  try {
    const storedItems: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(storedItems)) return [];

    return storedItems.filter((item): item is CartItem =>
      Number.isInteger(item?.product?.productId) &&
      typeof item.product.name === 'string' &&
      typeof item.product.imgName === 'string' &&
      Number.isFinite(item.product.price) &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0
    );
  } catch {
    return [];
  }
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity: number) => {
    if (!Number.isInteger(quantity) || quantity <= 0) return;
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.product.productId === product.productId);
      if (existingItem) {
        return currentItems.map(item => item.product.productId === product.productId
          ? { ...item, product, quantity: item.quantity + quantity }
          : item);
      }
      return [...currentItems, { product, quantity }];
    });
  };

  const updateQuantities = (quantities: Record<number, number>) => {
    setItems(currentItems => currentItems.flatMap(item => {
      const quantity = quantities[item.product.productId];
      return Number.isInteger(quantity) && quantity > 0 ? [{ ...item, quantity }] : [];
    }));
  };

  const removeFromCart = (productId: number) => {
    setItems(currentItems => currentItems.filter(item => item.product.productId !== productId));
  };

  return (
    <CartContext.Provider value={{ items, addToCart, updateQuantities, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
