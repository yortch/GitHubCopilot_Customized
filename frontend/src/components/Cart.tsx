import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { darkMode } = useTheme();
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-8 transition-colors duration-300`}>
          Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-12 text-center shadow-lg transition-colors duration-300`}>
            <svg className="w-20 h-20 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-6`}>Your cart is empty</p>
            <Link
              to="/products"
              className="bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden transition-colors duration-300`}>
              {cartItems.map((item, index) => (
                <div
                  key={item.productId}
                  className={`flex items-center gap-4 p-4 ${index < cartItems.length - 1 ? `border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}` : ''}`}
                >
                  <img
                    src={`/${item.imgName}`}
                    alt={item.name}
                    className={`w-20 h-20 object-contain rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-1 flex-shrink-0`}
                  />
                  <div className="flex-grow min-w-0">
                    <h3 className={`font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} truncate transition-colors duration-300`}>
                      {item.name}
                    </h3>
                    <p className="text-primary font-bold">${item.price.toFixed(2)}</p>
                  </div>
                  <div className={`flex items-center space-x-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg p-1 flex-shrink-0`}>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light' : 'text-gray-700'} hover:text-primary transition-colors`}
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      <span aria-hidden="true">-</span>
                    </button>
                    <span className={`${darkMode ? 'text-light' : 'text-gray-800'} min-w-[2rem] text-center`}>
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
                  <p className={`font-bold ${darkMode ? 'text-light' : 'text-gray-800'} w-20 text-right flex-shrink-0`}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 transition-colors duration-300`}>
              <div className="flex justify-between items-center mb-6">
                <span className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>Total</span>
                <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className={`flex-1 text-center px-6 py-3 rounded-lg font-medium border transition-colors ${darkMode ? 'border-gray-600 text-light hover:border-primary hover:text-primary' : 'border-gray-300 text-gray-700 hover:border-primary hover:text-primary'}`}
                >
                  Continue Shopping
                </Link>
                <button
                  onClick={clearCart}
                  className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  Clear Cart
                </button>
                <Link
                  to="/checkout"
                  className="flex-1 text-center bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
