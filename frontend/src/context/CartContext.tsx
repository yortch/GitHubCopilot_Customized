import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { addItem, CART_KEY, readCart, updateItems, type CartItem, type CartProduct } from './cart';

interface CartContextValue {
  items: CartItem[];
  add: (product: CartProduct, quantity: number) => void;
  update: (quantities: Record<number, number>) => void;
  remove: (productId: number) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState(readCart);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
      // Browsers may block storage; the cart remains usable for this session.
    }
  }, [items]);

  const add = (product: CartProduct, quantity: number) =>
    setItems(current => addItem(current, product, quantity));
  const update = (quantities: Record<number, number>) =>
    setItems(current => updateItems(current, quantities));
  const remove = (productId: number) =>
    setItems(current => current.filter(item => item.productId !== productId));

  return <CartContext.Provider value={{ items, add, update, remove }}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
