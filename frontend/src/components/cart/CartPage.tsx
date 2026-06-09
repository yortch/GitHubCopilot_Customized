import { useMemo, useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { DEFAULT_DISCOUNT_RATE } from '../../types/cart';
import {
  getCartSubtotal,
  getDiscountAmount,
  getGrandTotal,
  getLineTotal,
  getShippingAmount,
  getUnitPrice,
} from '../../utils/cartCalculations';

const formatCurrency = (value: number): string => {
  return `$${value.toFixed(2)}`;
};

export default function CartPage() {
  const { darkMode } = useTheme();
  const { items, coupon, updateQuantity, removeItem, applyCoupon, clearCoupon, persistCart, lastUpdatedAt } = useCart();
  const [couponInput, setCouponInput] = useState(coupon?.code ?? '');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const summary = useMemo(() => {
    const subtotal = getCartSubtotal(items);
    const discountRate = coupon?.discountRate ?? DEFAULT_DISCOUNT_RATE;
    const discount = getDiscountAmount(subtotal, discountRate);
    const shipping = getShippingAmount(subtotal, Boolean(coupon?.freeShipping));
    const grandTotal = getGrandTotal(subtotal, discount, shipping);

    return {
      subtotal,
      discountRate,
      discount,
      shipping,
      grandTotal,
    };
  }, [items, coupon]);

  const handleApplyCoupon = () => {
    const result = applyCoupon(couponInput);
    setStatusMessage(result.message);
  };

  const handleUpdateCart = () => {
    persistCart();
    setStatusMessage('Cart updated.');
  };

  const discountLabel = `Discount (${Math.round(summary.discountRate * 100)}%)`;

  return (
    <div className={`min-h-screen pt-20 pb-16 px-3 md:px-6 ${darkMode ? 'bg-dark' : 'bg-gray-100'} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 xl:grid-cols-[2.7fr_1fr] gap-6">
          <section className={`rounded-xl border ${darkMode ? 'border-gray-700 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'border-gray-300 bg-white'} overflow-hidden`} aria-label="Cart table">
            {items.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[780px] border-collapse">
                    <thead>
                      <tr className={`${darkMode ? 'bg-gray-900/70 text-light' : 'bg-gray-100 text-gray-700'} text-left`}>
                        <th className="px-4 py-4 font-semibold border-b border-gray-700/30">S. No.</th>
                        <th className="px-4 py-4 font-semibold border-b border-gray-700/30">Product Image</th>
                        <th className="px-4 py-4 font-semibold border-b border-gray-700/30">Product Name</th>
                        <th className="px-4 py-4 font-semibold border-b border-gray-700/30">Unit Price</th>
                        <th className="px-4 py-4 font-semibold border-b border-gray-700/30">Quantity</th>
                        <th className="px-4 py-4 font-semibold border-b border-gray-700/30">Total</th>
                        <th className="px-4 py-4 font-semibold border-b border-gray-700/30">Remove</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => {
                        const unitPrice = getUnitPrice(item.product.price, item.product.discount);
                        const lineTotal = getLineTotal(item);

                        return (
                          <tr key={item.product.productId} className={`${darkMode ? 'text-light hover:bg-gray-900/40' : 'text-gray-800 hover:bg-gray-50'} transition-colors`}>
                            <td className="px-4 py-4 border-b border-gray-700/20 text-center font-semibold">{index + 1}</td>
                            <td className="px-4 py-4 border-b border-gray-700/20">
                              <img
                                src={`/${item.product.imgName}`}
                                alt={item.product.name}
                                className="h-16 w-16 object-contain rounded-md"
                              />
                            </td>
                            <td className="px-4 py-4 border-b border-gray-700/20 font-semibold">{item.product.name}</td>
                            <td className="px-4 py-4 border-b border-gray-700/20 font-semibold">{formatCurrency(unitPrice)}</td>
                            <td className="px-4 py-4 border-b border-gray-700/20">
                              <input
                                type="number"
                                min={0}
                                value={item.quantity}
                                onChange={(event) => {
                                  const value = Number.parseInt(event.target.value, 10);
                                  if (Number.isNaN(value)) {
                                    return;
                                  }

                                  updateQuantity(item.product.productId, value);
                                }}
                                className={`w-20 rounded-lg border px-3 py-2 text-center ${
                                  darkMode
                                    ? 'bg-gray-900 border-gray-700 text-light focus:border-primary'
                                    : 'bg-white border-gray-300 text-gray-700 focus:border-primary'
                                } focus:outline-none focus:ring-1 focus:ring-primary`}
                                aria-label={`Quantity for ${item.product.name}`}
                              />
                            </td>
                            <td className="px-4 py-4 border-b border-gray-700/20 font-bold">{formatCurrency(lineTotal)}</td>
                            <td className="px-4 py-4 border-b border-gray-700/20 text-center">
                              <button
                                type="button"
                                onClick={() => removeItem(item.product.productId)}
                                className="h-10 w-10 rounded-full border border-primary/50 text-primary hover:bg-primary hover:text-white transition-colors"
                                aria-label={`Remove ${item.product.name} from cart`}
                              >
                                <span aria-hidden="true">X</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className={`p-4 border-t ${darkMode ? 'border-gray-700/40' : 'border-gray-200'} flex flex-col gap-3 md:flex-row md:items-center md:justify-between`}>
                  <div className="flex-1 flex flex-col sm:flex-row gap-3">
                    <label htmlFor="coupon-code" className="sr-only">Coupon code</label>
                    <input
                      id="coupon-code"
                      type="text"
                      placeholder="Coupon Code"
                      value={couponInput}
                      onChange={(event) => setCouponInput(event.target.value)}
                      className={`w-full sm:max-w-xs rounded-full border px-4 py-3 ${
                        darkMode
                          ? 'bg-gray-900 border-gray-700 text-light placeholder:text-gray-400'
                          : 'bg-white border-gray-300 text-gray-700 placeholder:text-gray-500'
                      } focus:outline-none focus:ring-2 focus:ring-primary`}
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={couponInput.trim().length === 0 || items.length === 0}
                      className="rounded-full bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Apply Coupon
                    </button>
                    {coupon && (
                      <button
                        type="button"
                        onClick={() => {
                          clearCoupon();
                          setCouponInput('');
                          setStatusMessage('Coupon removed.');
                        }}
                        className={`rounded-full px-5 py-3 font-semibold ${
                          darkMode
                            ? 'bg-gray-800 text-light hover:bg-gray-700'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        } transition-colors`}
                      >
                        Clear Coupon
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleUpdateCart}
                    disabled={items.length === 0}
                    className="rounded-full bg-primary px-8 py-3 font-semibold text-white transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Update Cart
                  </button>
                </div>
              </>
            ) : (
              <div className="p-12 text-center">
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-lg`}>Your cart is empty. Add products to continue.</p>
              </div>
            )}
          </section>

          <aside className={`rounded-xl border ${darkMode ? 'border-gray-700 bg-gradient-to-b from-gray-900 to-gray-800 text-light' : 'border-gray-300 bg-white text-gray-800'} h-fit overflow-hidden`} aria-label="Order summary">
            <h2 className="px-6 py-5 text-3xl font-bold border-b border-gray-700/30">Order Summary</h2>
            <div className="px-6 py-3 space-y-2">
              <div className="flex items-center justify-between py-3 border-b border-gray-700/20">
                <span className="font-semibold">Subtotal</span>
                <span className="font-semibold">{formatCurrency(summary.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-700/20">
                <span className="font-semibold">{discountLabel}</span>
                <span className="font-semibold">-{formatCurrency(summary.discount)}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-700/20">
                <span className="font-semibold">Shipping</span>
                <span className="font-semibold">{formatCurrency(summary.shipping)}</span>
              </div>
              <div className="flex items-center justify-between py-3 text-xl">
                <span className="font-bold">Grand Total</span>
                <span className="font-bold">{formatCurrency(summary.grandTotal)}</span>
              </div>
            </div>
            <div className="p-6 border-t border-gray-700/30">
              <button
                type="button"
                className="w-full rounded-full bg-primary px-6 py-3 text-lg font-semibold text-white hover:bg-accent transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                disabled={items.length === 0}
              >
                Proceed To Checkout
              </button>
            </div>
          </aside>
        </div>

        {statusMessage && (
          <p className={`mt-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} role="status">
            {statusMessage}
          </p>
        )}
        {lastUpdatedAt && (
          <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Last updated at {lastUpdatedAt}
          </p>
        )}
      </div>
    </div>
  );
}
