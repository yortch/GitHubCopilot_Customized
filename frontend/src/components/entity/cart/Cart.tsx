import { useState } from 'react';
import { useCart } from '../../../context/CartContext';
import { useTheme } from '../../../context/ThemeContext';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { darkMode } = useTheme();
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  const subtotal = getCartTotal();
  const discountAmount = subtotal * appliedDiscount;
  const shipping = items.length > 0 ? 10 : 0;
  const grandTotal = subtotal - discountAmount + shipping;

  const handleApplyCoupon = () => {
    // Simple coupon logic - 5% discount for any valid coupon
    if (couponCode.trim()) {
      setAppliedDiscount(0.05);
    }
  };

  const handleUpdateCart = () => {
    // Refresh cart - in real app this might sync with server
    alert('Cart updated successfully!');
  };

  const handleProceedToCheckout = () => {
    // Navigate to checkout - placeholder for now
    alert('Proceeding to checkout...');
  };

  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-8 transition-colors duration-300`}>
            Shopping Cart
          </h1>
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-8 text-center shadow-lg transition-colors duration-300`}>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-lg`}>
              Your cart is empty
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-8 transition-colors duration-300`}>
          Shopping Cart
        </h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items Table */}
          <div className="flex-grow">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg overflow-hidden shadow-lg transition-colors duration-300`}>
              <table className="w-full">
                <thead>
                  <tr className={`${darkMode ? 'bg-gray-900 text-light' : 'bg-gray-100 text-gray-800'} transition-colors duration-300`}>
                    <th className="px-4 py-3 text-left">S. No</th>
                    <th className="px-4 py-3 text-left">Product Image</th>
                    <th className="px-4 py-3 text-left">Product Name</th>
                    <th className="px-4 py-3 text-center">Unit Price</th>
                    <th className="px-4 py-3 text-center">Quantity</th>
                    <th className="px-4 py-3 text-center">Total</th>
                    <th className="px-4 py-3 text-center">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => {
                    const itemPrice = item.discount
                      ? item.price * (1 - item.discount)
                      : item.price;
                    const itemTotal = itemPrice * item.quantity;
                    
                    return (
                      <tr 
                        key={item.productId} 
                        className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-t transition-colors duration-300`}
                      >
                        <td className={`px-4 py-4 ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                          {index + 1}
                        </td>
                        <td className="px-4 py-4">
                          <div className={`w-24 h-24 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg overflow-hidden transition-colors duration-300`}>
                            <img
                              src={`/${item.imgName}`}
                              alt={item.name}
                              className="w-full h-full object-contain p-2"
                            />
                          </div>
                        </td>
                        <td className={`px-4 py-4 ${darkMode ? 'text-light' : 'text-gray-800'} font-medium`}>
                          {item.name}
                        </td>
                        <td className={`px-4 py-4 text-center ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                          ${itemPrice.toFixed(2)}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                              className={`w-16 px-2 py-1 text-center ${darkMode ? 'bg-gray-700 text-light border-gray-600' : 'bg-white text-gray-800 border-gray-300'} border rounded transition-colors duration-300`}
                            />
                          </div>
                        </td>
                        <td className={`px-4 py-4 text-center ${darkMode ? 'text-light' : 'text-gray-800'} font-medium`}>
                          ${itemTotal.toFixed(2)}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            aria-label={`Remove ${item.name} from cart`}
                          >
                            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              {/* Coupon and Update Cart Section */}
              <div className={`px-4 py-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors duration-300`}>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className={`flex-grow sm:flex-grow-0 px-4 py-2 ${darkMode ? 'bg-gray-800 text-light border-gray-700 placeholder-gray-500' : 'bg-white text-gray-800 border-gray-300 placeholder-gray-400'} border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors duration-300`}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-6 py-2 bg-primary hover:bg-accent text-white rounded-lg font-medium transition-colors whitespace-nowrap"
                  >
                    Apply Coupon
                  </button>
                </div>
                <button
                  onClick={handleUpdateCart}
                  className="w-full sm:w-auto px-6 py-2 bg-primary hover:bg-accent text-white rounded-lg font-medium transition-colors"
                >
                  Update Cart
                </button>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="w-full lg:w-80">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 transition-colors duration-300`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-6 text-center border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} pb-4 transition-colors duration-300`}>
                Order Summary
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Subtotal</span>
                  <span className={`${darkMode ? 'text-light' : 'text-gray-800'} font-medium`}>${subtotal.toFixed(2)}</span>
                </div>
                
                {appliedDiscount > 0 && (
                  <div className="flex justify-between">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Discount({Math.round(appliedDiscount * 100)}%)</span>
                    <span className="text-red-500 font-medium">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Shipping</span>
                  <span className={`${darkMode ? 'text-light' : 'text-gray-800'} font-medium`}>${shipping.toFixed(2)}</span>
                </div>
                
                <div className={`flex justify-between pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <span className={`${darkMode ? 'text-light' : 'text-gray-800'} font-bold`}>Grand Total</span>
                  <span className={`${darkMode ? 'text-light' : 'text-gray-800'} font-bold`}>${grandTotal.toFixed(2)}</span>
                </div>
              </div>
              
              <button
                onClick={handleProceedToCheckout}
                className="w-full mt-6 px-6 py-3 bg-primary hover:bg-accent text-white rounded-lg font-medium transition-colors"
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
