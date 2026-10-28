import { useEffect, useReducer, useState, type ReactNode } from 'react';
import {
  addCartItem, applyCartCoupon, CART_STORAGE_KEY, CartValidationError, emptyCart,
  getCartTotals, readCart, removeCartItem, updateCartQuantities, writeCart, type Cart, type CartProduct,
} from '../cart/cart';
import { CartContext } from './useCart';

interface State {
  cart: Cart;
  revision: number;
  message: string;
  error: string | null;
  initialStorageError: string | null;
}

type Action =
  | { type: 'add'; product: CartProduct; quantity: number }
  | { type: 'update'; quantities: Record<number, number> }
  | { type: 'remove'; productId: number }
  | { type: 'coupon'; code: string }
  | { type: 'retry' };

function initialize(): State {
  const state: State = {
    cart: emptyCart(), revision: 0, message: '', error: null, initialStorageError: null,
  };
  try {
    const saved = window.localStorage.getItem(CART_STORAGE_KEY);
    if (saved !== null) state.cart = readCart(saved);
  } catch (error) {
    console.error('Unable to restore the shopping cart:', error);
    state.initialStorageError = 'Your saved cart could not be restored. You can shop in this tab, but previous items may be unavailable. New cart changes will attempt to replace the saved cart.';
  }
  return state;
}

function reducer(state: State, action: Action): State {
  let cart = state.cart;
  let message = '';
  try {
    switch (action.type) {
      case 'add':
        cart = addCartItem(cart, action.product, action.quantity);
        message = `Added ${action.quantity} ${action.product.name} to your cart. Cart now contains ${getCartTotals(cart).quantity} items.`;
        break;
      case 'update':
        cart = updateCartQuantities(cart, action.quantities);
        message = 'Cart quantities updated.';
        break;
      case 'remove':
        message = `${cart.items.find(item => item.productId === action.productId)?.name ?? 'Item'} removed from your cart.`;
        cart = removeCartItem(cart, action.productId);
        break;
      case 'coupon':
        message = cart.coupon === 'SAVE5'
          ? 'SAVE5 is already applied. Discounts do not stack.'
          : 'SAVE5 applied: 5% off your subtotal.';
        cart = applyCartCoupon(cart, action.code);
        break;
      case 'retry':
        break;
    }
    return { ...state, cart, revision: state.revision + 1, message, error: null };
  } catch (error) {
    if (!(error instanceof CartValidationError)) throw error;
    return { ...state, error: error.message, message: '' };
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialize);
  const [storageError, setStorageError] = useState(state.initialStorageError);

  useEffect(() => {
    // Do not overwrite unreadable storage just by visiting the storefront.
    if (state.revision === 0) return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, writeCart(state.cart));
      setStorageError(null);
    } catch (error) {
      console.error('Unable to save the shopping cart:', error);
      setStorageError('Your cart could not be saved in this browser. Changes are available in this tab only and may be lost when you reload or close it.');
    }
  }, [state.cart, state.revision]);

  return (
    <CartContext.Provider value={{
      cart: state.cart, message: state.message, error: state.error, storageError,
      addItem: (product, quantity) => dispatch({ type: 'add', product, quantity }),
      updateQuantities: quantities => dispatch({ type: 'update', quantities }),
      removeItem: productId => dispatch({ type: 'remove', productId }),
      applyCoupon: code => dispatch({ type: 'coupon', code }),
      retrySave: () => dispatch({ type: 'retry' }),
    }}>
      {children}
    </CartContext.Provider>
  );
}
