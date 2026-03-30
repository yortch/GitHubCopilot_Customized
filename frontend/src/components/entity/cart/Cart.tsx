import { Link } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { useCart, CartItem } from '../../../context/CartContext';

export default function Cart() {
  const { darkMode } = useTheme();
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
        <div className="max-w-3xl mx-auto">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-8 transition-colors duration-300`}>
            Your Cart
          </h1>
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-12 flex flex-col items-center space-y-4 transition-colors duration-300`}>
            <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
              Your cart is empty
            </p>
            <Link
              to="/products"
              className="bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
            Your Cart
          </h1>
          <button
            onClick={clearCart}
            className={`text-sm ${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'} transition-colors`}
          >
            Clear cart
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item: CartItem) => {
            const effectivePrice = item.discount ? item.price * (1 - item.discount) : item.price;
            return (
              <div
                key={item.productId}
                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-4 flex items-center space-x-4 transition-colors duration-300`}
              >
                <img
                  src={`/${item.imgName}`}
                  alt={item.name}
                  className="w-20 h-20 object-contain flex-shrink-0"
                />
                <div className="flex-grow min-w-0">
                  <h3 className={`font-semibold text-lg ${darkMode ? 'text-light' : 'text-gray-800'} truncate transition-colors duration-300`}>
                    {item.name}
                  </h3>
                  <p className="text-primary font-bold">
                    ${effectivePrice.toFixed(2)}
                    {item.discount && (
                      <span className={`ml-2 text-sm line-through ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        ${item.price.toFixed(2)}
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <div className={`flex items-center space-x-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-1 transition-colors duration-300`}>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light' : 'text-gray-700'} hover:text-primary transition-colors`}
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      <span aria-hidden="true">-</span>
                    </button>
                    <span
                      className={`${darkMode ? 'text-light' : 'text-gray-800'} min-w-[2rem] text-center`}
                      aria-label={`Quantity of ${item.name}`}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light' : 'text-gray-700'} hover:text-primary transition-colors`}
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      <span aria-hidden="true">+</span>
                    </button>
                  </div>
                  <p className={`w-20 text-right font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                    ${(effectivePrice * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className={`ml-2 p-1 ${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-400 hover:text-red-500'} transition-colors`}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6 mt-6 transition-colors duration-300`}>
          <h2 className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4 transition-colors duration-300`}>
            Order Summary
          </h2>
          <div className={`flex justify-between text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'} pt-4 transition-colors duration-300`}>
            <span>Total</span>
            <span className="text-primary">${totalPrice.toFixed(2)}</span>
          </div>
          <button
            className="mt-6 w-full bg-primary hover:bg-accent text-white py-3 rounded-lg font-semibold transition-colors"
          >
            Proceed to Checkout
          </button>
          <Link
            to="/products"
            className={`mt-3 block text-center text-sm ${darkMode ? 'text-gray-400 hover:text-primary' : 'text-gray-500 hover:text-primary'} transition-colors`}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
