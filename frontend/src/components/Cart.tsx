import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const { darkMode } = useTheme();

  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-24 pb-12 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className={`text-4xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-8`}>Shopping Cart</h1>
          <div className={`${darkMode ? 'bg-dark-lighter' : 'bg-white'} rounded-lg shadow-md p-8 text-center transition-colors duration-300`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`mx-auto h-24 w-24 ${darkMode ? 'text-gray-600' : 'text-gray-400'} mb-4`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className={`text-2xl font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} mb-2`}>Your cart is empty</h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>Add some amazing products to get started!</p>
            <Link 
              to="/products" 
              className="inline-block bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-24 pb-12 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-4xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>Shopping Cart</h1>
          <button
            onClick={clearCart}
            className={`${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'} font-medium text-sm transition-colors`}
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const discountedPrice = item.discount ? item.price * (1 - item.discount) : item.price;
              
              return (
                <div 
                  key={item.productId} 
                  className={`${darkMode ? 'bg-dark-lighter' : 'bg-white'} rounded-lg shadow-md p-6 transition-colors duration-300`}
                >
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={`/${item.imgName}`}
                        alt={item.name}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className={`text-xl font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                            {item.name}
                          </h3>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                            SKU: {item.sku}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className={`${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-600'} transition-colors`}
                          aria-label="Remove item"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-4 line-clamp-2`}>
                        {item.description}
                      </p>

                      <div className="flex justify-between items-center">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className={`${darkMode ? 'bg-dark hover:bg-primary' : 'bg-gray-200 hover:bg-primary'} ${darkMode ? 'text-light' : 'text-gray-800'} hover:text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors`}
                          >
                            -
                          </button>
                          <span className={`${darkMode ? 'text-light' : 'text-gray-800'} font-medium w-12 text-center`}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className={`${darkMode ? 'bg-dark hover:bg-primary' : 'bg-gray-200 hover:bg-primary'} ${darkMode ? 'text-light' : 'text-gray-800'} hover:text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors`}
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          {item.discount ? (
                            <div>
                              <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'} line-through`}>
                                ${item.price.toFixed(2)}
                              </p>
                              <p className="text-xl font-bold text-primary">
                                ${discountedPrice.toFixed(2)}
                              </p>
                              <p className="text-xs text-green-500 font-semibold">
                                {(item.discount * 100).toFixed(0)}% OFF
                              </p>
                            </div>
                          ) : (
                            <p className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                              ${item.price.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className={`${darkMode ? 'bg-dark-lighter' : 'bg-white'} rounded-lg shadow-md p-6 sticky top-24 transition-colors duration-300`}>
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-6`}>Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className={`flex justify-between ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <span>Subtotal</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className={`flex justify-between ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <span>Shipping</span>
                  <span className="text-green-500 font-semibold">FREE</span>
                </div>
                <div className={`flex justify-between ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <span>Tax</span>
                  <span>${(getTotalPrice() * 0.08).toFixed(2)}</span>
                </div>
                <hr className={`${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
                <div className={`flex justify-between text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                  <span>Total</span>
                  <span>${(getTotalPrice() * 1.08).toFixed(2)}</span>
                </div>
              </div>

              <button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors mb-3">
                Proceed to Checkout
              </button>
              
              <Link 
                to="/products" 
                className={`block w-full text-center ${darkMode ? 'text-primary hover:text-primary/80' : 'text-primary hover:text-primary/80'} font-medium py-2 transition-colors`}
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
