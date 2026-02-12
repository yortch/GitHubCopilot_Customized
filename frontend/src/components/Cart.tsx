import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const SHIPPING_COST = 10;
const COUPON_CODES: Record<string, number> = {
  OCTOCAT10: 0.1,
  MEOW20: 0.2,
  COPILOT5: 0.05,
};

export default function Cart() {
  const { darkMode } = useTheme();
  const { items, removeFromCart, updateQuantity, subtotal, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; rate: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = () => {
    const rate = COUPON_CODES[couponCode.toUpperCase()];
    if (rate) {
      setAppliedCoupon({ code: couponCode.toUpperCase(), rate });
      setCouponError('');
    } else {
      setAppliedCoupon(null);
      setCouponError('Invalid coupon code');
    }
  };

  const discountAmount = appliedCoupon ? subtotal * appliedCoupon.rate : 0;
  const grandTotal = subtotal - discountAmount + (items.length > 0 ? SHIPPING_COST : 0);

  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto text-center py-20">
          <svg className={`mx-auto h-24 w-24 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          <h2 className={`mt-6 text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>Your cart is empty</h2>
          <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Looks like you haven't added any items yet.</p>
          <Link
            to="/products"
            className="mt-6 inline-block bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-6`}>Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items Table */}
          <div className="lg:w-2/3">
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border overflow-hidden`}>
              {/* Table Header */}
              <div className={`hidden md:grid grid-cols-12 gap-4 px-6 py-3 ${darkMode ? 'bg-gray-900 text-gray-400' : 'bg-gray-50 text-gray-500'} text-sm font-medium`}>
                <div className="col-span-1">S. No.</div>
                <div className="col-span-2">Product Image</div>
                <div className="col-span-3">Product Name</div>
                <div className="col-span-2">Unit Price</div>
                <div className="col-span-1">Quantity</div>
                <div className="col-span-2">Total</div>
                <div className="col-span-1">Remove</div>
              </div>

              {/* Cart Items */}
              {items.map((item, index) => {
                const effectivePrice = item.discount
                  ? item.price * (1 - item.discount)
                  : item.price;
                const lineTotal = effectivePrice * item.quantity;

                return (
                  <div
                    key={item.productId}
                    className={`grid grid-cols-12 gap-4 px-6 py-4 items-center ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-t`}
                  >
                    <div className={`col-span-1 ${darkMode ? 'text-light' : 'text-gray-800'} font-medium`}>
                      {index + 1}
                    </div>
                    <div className="col-span-2">
                      <div className={`w-20 h-20 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg overflow-hidden`}>
                        <img
                          src={`/${item.imgName}`}
                          alt={item.name}
                          className="w-full h-full object-contain p-1"
                        />
                      </div>
                    </div>
                    <div className={`col-span-3 ${darkMode ? 'text-light' : 'text-gray-800'} font-medium`}>
                      {item.name}
                    </div>
                    <div className={`col-span-2 ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                      {item.discount ? (
                        <div>
                          <span className="text-gray-500 line-through text-sm mr-1">${item.price.toFixed(2)}</span>
                          <span className="text-primary">${effectivePrice.toFixed(2)}</span>
                        </div>
                      ) : (
                        <span>${effectivePrice.toFixed(2)}</span>
                      )}
                    </div>
                    <div className="col-span-1">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                        className={`w-16 px-2 py-1 text-center rounded border ${darkMode ? 'bg-gray-700 border-gray-600 text-light' : 'bg-white border-gray-300 text-gray-800'} focus:border-primary focus:outline-none`}
                        aria-label={`Quantity of ${item.name}`}
                      />
                    </div>
                    <div className={`col-span-2 ${darkMode ? 'text-light' : 'text-gray-800'} font-semibold`}>
                      ${lineTotal.toFixed(2)}
                    </div>
                    <div className="col-span-1">
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-red-500 hover:text-red-700 transition-colors p-1"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Bottom Actions */}
              <div className={`flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-t`}>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className={`px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-light placeholder-gray-500' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'} focus:border-primary focus:outline-none`}
                    aria-label="Coupon code"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="bg-primary hover:bg-accent text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Apply Coupon
                  </button>
                </div>
                {couponError && <span className="text-red-500 text-sm">{couponError}</span>}
                {appliedCoupon && (
                  <span className="text-primary text-sm font-medium">
                    Coupon {appliedCoupon.code} applied ({Math.round(appliedCoupon.rate * 100)}% off)
                  </span>
                )}
                <button
                  onClick={clearCart}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-light' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6 sticky top-24`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4`}>Order Summary</h2>

              <div className="space-y-3">
                <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span>Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-primary">
                    <span>Discount ({Math.round(appliedCoupon.rate * 100)}%)</span>
                    <span className="font-medium">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span>Shipping</span>
                  <span className="font-medium">${SHIPPING_COST.toFixed(2)}</span>
                </div>

                <div className={`flex justify-between pt-3 border-t ${darkMode ? 'border-gray-700 text-light' : 'border-gray-200 text-gray-800'} text-lg font-bold`}>
                  <span>Grand Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button className="w-full mt-6 bg-primary hover:bg-accent text-white py-3 rounded-lg font-semibold transition-colors text-lg">
                Proceed To Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
