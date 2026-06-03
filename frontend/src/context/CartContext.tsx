import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AppliedCoupon, CartItem } from '../types/cart';
import type { Product } from '../types/product';
import { DEFAULT_DISCOUNT_RATE } from '../types/cart';

interface CouponDefinition {
  code: string;
  discountRate: number;
  freeShipping?: boolean;
}

interface CouponResult {
  ok: boolean;
  message: string;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  coupon: AppliedCoupon | null;
  addItem: (product: Product, quantity: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  applyCoupon: (couponCode: string) => CouponResult;
  clearCoupon: () => void;
  persistCart: () => void;
  lastUpdatedAt: string | null;
}

interface PersistedCartState {
  items: CartItem[];
  coupon: AppliedCoupon | null;
}

const STORAGE_KEY = 'octocat-cart';

const SUPPORTED_COUPONS: Record<string, CouponDefinition> = {
  SAVE5: { code: 'SAVE5', discountRate: 0.05 },
  SAVE10: { code: 'SAVE10', discountRate: 0.1 },
  FREESHIP: { code: 'FREESHIP', discountRate: DEFAULT_DISCOUNT_RATE, freeShipping: true },
};

const CartContext = createContext<CartContextType | null>(null);

const isValidCartItem = (item: unknown): item is CartItem => {
  if (typeof item !== 'object' || item === null) {
    return false;
  }

  const maybeCartItem = item as CartItem;
  return Number.isFinite(maybeCartItem.quantity) && maybeCartItem.quantity > 0 && typeof maybeCartItem.product?.productId === 'number';
};

const readPersistedState = (): PersistedCartState => {
  if (typeof window === 'undefined') {
    return { items: [], coupon: null };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { items: [], coupon: null };
    }

    const parsed = JSON.parse(raw) as PersistedCartState;
    return {
      items: Array.isArray(parsed.items) ? parsed.items.filter(isValidCartItem) : [],
      coupon: parsed.coupon ?? null,
    };
  } catch {
    return { items: [], coupon: null };
  }
};

export function CartProvider({ children }: { children: ReactNode }) {
  const initialState = useMemo(() => readPersistedState(), []);
  const [items, setItems] = useState<CartItem[]>(initialState.items);
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(initialState.coupon);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, coupon }));
  }, [items, coupon]);

  const addItem = (product: Product, quantity: number) => {
    if (quantity <= 0) {
      return;
    }

    setItems((prev) => {
      const existing = prev.find((entry) => entry.product.productId === product.productId);
      if (!existing) {
        return [...prev, { product, quantity }];
      }

      return prev.map((entry) => {
        if (entry.product.productId !== product.productId) {
          return entry;
        }

        return { ...entry, quantity: entry.quantity + quantity };
      });
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((entry) => entry.product.productId !== productId));
      return;
    }

    setItems((prev) =>
      prev.map((entry) => {
        if (entry.product.productId !== productId) {
          return entry;
        }

        return { ...entry, quantity };
      }),
    );
  };

  const removeItem = (productId: number) => {
    setItems((prev) => prev.filter((entry) => entry.product.productId !== productId));
  };

  const applyCoupon = (couponCode: string): CouponResult => {
    const normalized = couponCode.trim().toUpperCase();

    if (!normalized) {
      return { ok: false, message: 'Enter a coupon code before applying.' };
    }

    const definition = SUPPORTED_COUPONS[normalized];
    if (!definition) {
      return { ok: false, message: 'This coupon is not recognized.' };
    }

    setCoupon({
      code: definition.code,
      discountRate: definition.discountRate,
      freeShipping: definition.freeShipping,
    });

    return { ok: true, message: `${definition.code} applied successfully.` };
  };

  const clearCoupon = () => {
    setCoupon(null);
  };

  const persistCart = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, coupon }));
    }

    setLastUpdatedAt(new Date().toLocaleTimeString());
  };

  const itemCount = items.reduce((sum, entry) => sum + entry.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        coupon,
        addItem,
        updateQuantity,
        removeItem,
        applyCoupon,
        clearCoupon,
        persistCart,
        lastUpdatedAt,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
}
