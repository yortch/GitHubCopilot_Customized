import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const { darkMode } = useTheme();
  const [checkoutMessage, setCheckoutMessage] = useState(false);

  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
        <div className="max-w-3xl mx-auto py-12 text-center">
          <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-2`}>Your cart is empty</h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Add items from the Products page to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
            Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </h1>
          <button
            onClick={clearCart}
            className={`text-sm ${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-600'} transition-colors`}
          >
            Clear cart
          </button>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
          {items.map(item => {
            const effectivePrice = item.discount ? item.price * (1 - item.discount) : item.price;
            return (
              <div key={item.productId} className="flex items-center p-4 gap-4">
                <img
                  src={`/${item.imgName}`}
                  alt={item.name}
                  className={`h-20 w-20 object-contain rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-1 flex-shrink-0`}
                />
                <div className="flex-grow min-w-0">
                  <h3 className={`font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} truncate`}>{item.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {item.discount && (
                      <span className="text-gray-500 line-through text-sm">${item.price.toFixed(2)}</span>
                    )}
                    <span className="text-primary font-bold">${effectivePrice.toFixed(2)}</span>
                  </div>
                  <div className={`flex items-center space-x-2 mt-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg p-1 w-fit`}>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className={`w-7 h-7 flex items-center justify-center ${darkMode ? 'text-light' : 'text-gray-700'} hover:text-primary transition-colors`}
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      <span aria-hidden="true">-</span>
                    </button>
                    <span className={`${darkMode ? 'text-light' : 'text-gray-800'} min-w-[2rem] text-center`}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className={`w-7 h-7 flex items-center justify-center ${darkMode ? 'text-light' : 'text-gray-700'} hover:text-primary transition-colors`}
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      <span aria-hidden="true">+</span>
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className={`font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                    ${(effectivePrice * item.quantity).toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className={`mt-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
          <div className="flex justify-between items-center mb-4">
            <span className={`text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>Total</span>
            <span className="text-2xl font-bold text-primary">${totalPrice.toFixed(2)}</span>
          </div>
          {checkoutMessage && (
            <div className="mb-4 p-3 rounded-lg bg-primary/10 text-primary text-sm text-center">
              Checkout functionality coming soon!
            </div>
          )}
          <button
            className="w-full py-3 bg-primary hover:bg-accent text-white font-semibold rounded-lg transition-colors"
            onClick={() => setCheckoutMessage(true)}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
