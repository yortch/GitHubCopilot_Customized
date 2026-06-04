import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useTheme } from '../../../context/ThemeContext';
import { calculateCartSummary, formatCurrency, getEffectiveUnitPrice } from '../../../utils/cartPricing';

export default function Cart() {
  const { items, couponCode, applyCoupon, updateQuantity, removeFromCart, clearCart } = useCart();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState(couponCode);
  const [updateMessage, setUpdateMessage] = useState('');
  const [draftQuantities, setDraftQuantities] = useState<Record<number, number>>(() =>
    items.reduce(
      (acc, item) => {
        acc[item.product.productId] = item.quantity;
        return acc;
      },
      {} as Record<number, number>,
    ),
  );

  const summary = useMemo(() => calculateCartSummary(items), [items]);

  useEffect(() => {
    const nextDraft = items.reduce(
      (acc, item) => {
        acc[item.product.productId] = item.quantity;
        return acc;
      },
      {} as Record<number, number>,
    );
    setDraftQuantities(nextDraft);
  }, [items]);

  const handleApplyCoupon = () => {
    applyCoupon(couponInput);
    setUpdateMessage(couponInput.trim() ? 'Coupon applied.' : 'Coupon cleared.');
  };

  const handleUpdateCart = () => {
    items.forEach((item) => {
      const nextQuantity = Math.max(0, Math.floor(draftQuantities[item.product.productId] ?? item.quantity));
      updateQuantity(item.product.productId, nextQuantity);
    });
    setUpdateMessage('Cart updated.');
  };

  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-24 pb-16 px-4 transition-colors duration-300`}>
        <div className={`max-w-4xl mx-auto rounded-xl border ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'} p-8 text-center shadow-lg transition-colors duration-300`}>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4 transition-colors duration-300`}>
            Your cart is empty
          </h1>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6 transition-colors duration-300`}>
            Add items from the product catalog to start your order.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-accent"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-24 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <section className={`xl:col-span-9 rounded-xl border ${darkMode ? 'border-gray-700 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900' : 'border-gray-200 bg-white'} shadow-xl overflow-hidden transition-colors duration-300`}>
            <div className="overflow-x-auto hidden md:block">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`${darkMode ? 'text-light bg-black/20' : 'text-gray-700 bg-gray-100'} transition-colors duration-300`}>
                    <th className="px-4 py-4 border-b border-gray-700/40">S. No.</th>
                    <th className="px-4 py-4 border-b border-gray-700/40">Product Image</th>
                    <th className="px-4 py-4 border-b border-gray-700/40">Product Name</th>
                    <th className="px-4 py-4 border-b border-gray-700/40">Unit Price</th>
                    <th className="px-4 py-4 border-b border-gray-700/40">Quantity</th>
                    <th className="px-4 py-4 border-b border-gray-700/40">Total</th>
                    <th className="px-4 py-4 border-b border-gray-700/40">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => {
                    const unitPrice = getEffectiveUnitPrice(item.product);
                    const lineTotal = unitPrice * item.quantity;
                    return (
                      <tr key={item.product.productId} className={`border-b ${darkMode ? 'border-gray-700/40 text-light' : 'border-gray-200 text-gray-800'} transition-colors duration-300`}>
                        <td className="px-4 py-4 font-bold">{index + 1}</td>
                        <td className="px-4 py-4">
                          <img
                            src={`/${item.product.imgName}`}
                            alt={item.product.name}
                            className="h-20 w-20 object-contain"
                          />
                        </td>
                        <td className="px-4 py-4 font-semibold">{item.product.name}</td>
                        <td className="px-4 py-4 font-semibold">{formatCurrency(unitPrice)}</td>
                        <td className="px-4 py-4">
                          <input
                            type="number"
                            min={0}
                            value={draftQuantities[item.product.productId] ?? item.quantity}
                            onChange={(event) => {
                              const nextValue = Number(event.target.value);
                              setDraftQuantities((prev) => ({
                                ...prev,
                                [item.product.productId]: Number.isFinite(nextValue) ? nextValue : item.quantity,
                              }));
                            }}
                            className={`w-16 rounded-lg border px-2 py-2 text-center ${darkMode ? 'border-gray-600 bg-gray-800 text-light' : 'border-gray-300 bg-white text-gray-800'} transition-colors duration-300`}
                            aria-label={`Quantity for ${item.product.name}`}
                          />
                        </td>
                        <td className="px-4 py-4 font-bold">{formatCurrency(lineTotal)}</td>
                        <td className="px-4 py-4">
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product.productId)}
                            className="text-primary hover:text-accent transition-colors"
                            aria-label={`Remove ${item.product.name} from cart`}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                              <path d="M3 6h18" />
                              <path d="M8 6V4h8v2" />
                              <path d="M19 6l-1 14H6L5 6" />
                              <path d="M10 11v6" />
                              <path d="M14 11v6" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="md:hidden space-y-4 p-4">
              {items.map((item, index) => {
                const unitPrice = getEffectiveUnitPrice(item.product);
                const lineTotal = unitPrice * item.quantity;
                return (
                  <article
                    key={item.product.productId}
                    className={`rounded-xl border ${darkMode ? 'border-gray-700 bg-black/20' : 'border-gray-200 bg-gray-50'} p-4 transition-colors duration-300`}
                  >
                    <div className="flex gap-4">
                      <img src={`/${item.product.imgName}`} alt={item.product.name} className="h-20 w-20 object-contain" />
                      <div className="flex-1">
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Item #{index + 1}</p>
                        <h2 className={`font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                          {item.product.name}
                        </h2>
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
                          Unit: {formatCurrency(unitPrice)}
                        </p>
                        <p className={`font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                          Total: {formatCurrency(lineTotal)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <input
                        type="number"
                        min={0}
                        value={draftQuantities[item.product.productId] ?? item.quantity}
                        onChange={(event) => {
                          const nextValue = Number(event.target.value);
                          setDraftQuantities((prev) => ({
                            ...prev,
                            [item.product.productId]: Number.isFinite(nextValue) ? nextValue : item.quantity,
                          }));
                        }}
                        className={`w-20 rounded-lg border px-3 py-2 text-center ${darkMode ? 'border-gray-600 bg-gray-800 text-light' : 'border-gray-300 bg-white text-gray-800'} transition-colors duration-300`}
                        aria-label={`Quantity for ${item.product.name}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.productId)}
                        className="rounded-lg border border-primary px-3 py-2 text-primary hover:bg-primary hover:text-white transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className={`border-t ${darkMode ? 'border-gray-700/40' : 'border-gray-200'} p-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between transition-colors duration-300`}>
              <div className="flex flex-1 max-w-xl">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(event) => setCouponInput(event.target.value)}
                  placeholder="Coupon Code"
                  className={`flex-1 rounded-l-full border px-4 py-3 ${darkMode ? 'border-gray-600 bg-gray-800 text-light placeholder:text-gray-500' : 'border-gray-300 bg-white text-gray-800'} transition-colors duration-300`}
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="rounded-r-full bg-primary px-5 py-3 font-semibold text-white transition-colors hover:bg-accent"
                >
                  Apply Coupon
                </button>
              </div>
              <button
                type="button"
                onClick={handleUpdateCart}
                className="rounded-full bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-accent"
              >
                Update Cart
              </button>
            </div>
          </section>

          <aside className={`xl:col-span-3 rounded-xl border ${darkMode ? 'border-gray-700 bg-gradient-to-b from-gray-900 to-gray-800' : 'border-gray-200 bg-white'} shadow-xl overflow-hidden h-fit transition-colors duration-300`}>
            <h2 className={`px-6 py-5 text-4xl md:text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} border-b ${darkMode ? 'border-gray-700/40' : 'border-gray-200'} transition-colors duration-300`}>
              Order Summary
            </h2>
            <div className={`divide-y ${darkMode ? 'divide-gray-700/40' : 'divide-gray-200'} transition-colors duration-300`}>
              <div className="flex items-center justify-between px-6 py-4">
                <span className={`${darkMode ? 'text-light' : 'text-gray-700'} font-semibold transition-colors duration-300`}>Subtotal</span>
                <span className={`${darkMode ? 'text-light' : 'text-gray-900'} font-semibold transition-colors duration-300`}>{formatCurrency(summary.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between px-6 py-4">
                <span className={`${darkMode ? 'text-light' : 'text-gray-700'} font-semibold transition-colors duration-300`}>Discount(5%)</span>
                <span className={`${darkMode ? 'text-light' : 'text-gray-900'} font-semibold transition-colors duration-300`}>-{formatCurrency(summary.discount)}</span>
              </div>
              <div className="flex items-center justify-between px-6 py-4">
                <span className={`${darkMode ? 'text-light' : 'text-gray-700'} font-semibold transition-colors duration-300`}>Shipping</span>
                <span className={`${darkMode ? 'text-light' : 'text-gray-900'} font-semibold transition-colors duration-300`}>{formatCurrency(summary.shipping)}</span>
              </div>
              <div className="flex items-center justify-between px-6 py-4">
                <span className={`${darkMode ? 'text-light' : 'text-gray-700'} text-xl font-bold transition-colors duration-300`}>Grand Total</span>
                <span className={`${darkMode ? 'text-light' : 'text-gray-900'} text-xl font-bold transition-colors duration-300`}>{formatCurrency(summary.total)}</span>
              </div>
            </div>

            <div className="p-6 space-y-3">
              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="w-full rounded-full bg-primary px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-accent"
              >
                Proceed To Checkout
              </button>
              <button
                type="button"
                onClick={clearCart}
                className={`w-full rounded-full border px-6 py-3 font-semibold ${darkMode ? 'border-gray-500 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'} transition-colors duration-300`}
              >
                Clear Cart
              </button>
              {updateMessage && (
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm transition-colors duration-300`}>{updateMessage}</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
