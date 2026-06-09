import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, getSubTotal, getDiscount, getShipping, getGrandTotal } = useCart();
  const { darkMode } = useTheme();
  const [couponCode, setCouponCode] = useState('');

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity >= 0) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleApplyCoupon = () => {
    // TODO: Implement coupon code functionality
    alert(`Coupon code "${couponCode}" - functionality coming soon!`);
  };

  const handleProceedToCheckout = () => {
    // TODO: Implement checkout functionality
    alert('Checkout functionality coming soon!');
  };

  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto py-16">
          <div className="text-center">
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4`}>
              Your Cart is Empty
            </h1>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8`}>
              Add some products to get started!
            </p>
            <Link
              to="/products"
              className="inline-block bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg font-medium transition-colors"
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
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-8`}>
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Table */}
          <div className="lg:col-span-2">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <tr>
                      <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        S. No.
                      </th>
                      <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        Product Image
                      </th>
                      <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        Product Name
                      </th>
                      <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        Unit Price
                      </th>
                      <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        Quantity
                      </th>
                      <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        Total
                      </th>
                      <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        Remove
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                    {items.map((item, index) => (
                      <tr key={item.productId} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                        <td className={`px-4 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-light' : 'text-gray-900'}`}>
                          {index + 1}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <img
                            src={`/${item.imgName}`}
                            alt={item.name}
                            className="h-16 w-16 object-cover rounded"
                          />
                        </td>
                        <td className={`px-4 py-4 text-sm ${darkMode ? 'text-light' : 'text-gray-900'}`}>
                          {item.name}
                        </td>
                        <td className={`px-4 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-light' : 'text-gray-900'}`}>
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value) || 0)}
                            className={`w-20 px-2 py-1 border ${darkMode ? 'bg-gray-700 text-light border-gray-600' : 'bg-white text-gray-900 border-gray-300'} rounded focus:outline-none focus:ring-1 focus:ring-primary`}
                          />
                        </td>
                        <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${darkMode ? 'text-light' : 'text-gray-900'}`}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            aria-label="Remove item"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Coupon and Update Cart */}
              <div className={`px-4 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex flex-col sm:flex-row justify-between items-center gap-4`}>
                <div className="flex gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className={`flex-1 sm:w-48 px-4 py-2 border ${darkMode ? 'bg-gray-700 text-light border-gray-600' : 'bg-white text-gray-900 border-gray-300'} rounded-lg focus:outline-none focus:ring-1 focus:ring-primary`}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="bg-primary hover:bg-accent text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Apply Coupon
                  </button>
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full sm:w-auto bg-primary hover:bg-accent text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Update Cart
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-6`}>
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Subtotal</span>
                  <span className={`font-medium ${darkMode ? 'text-light' : 'text-gray-900'}`}>
                    ${getSubTotal().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Discount(5%)</span>
                  <span className={`font-medium ${darkMode ? 'text-light' : 'text-gray-900'}`}>
                    -${getDiscount().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Shipping</span>
                  <span className={`font-medium ${darkMode ? 'text-light' : 'text-gray-900'}`}>
                    ${getShipping().toFixed(2)}
                  </span>
                </div>
                <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-4`}>
                  <div className="flex justify-between">
                    <span className={`text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-900'}`}>
                      Grand Total
                    </span>
                    <span className={`text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-900'}`}>
                      ${getGrandTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Proceed To Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
