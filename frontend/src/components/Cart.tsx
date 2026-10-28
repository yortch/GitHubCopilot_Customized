import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { formatMoney, getCartTotals, parseQuantity } from '../cart/cart';
import { useCart } from '../context/useCart';
import CartFeedback from './CartFeedback';
import './Cart.css';

export default function Cart() {
  const { cart, updateQuantities, removeItem, applyCoupon } = useCart();
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const totals = getCartTotals(cart);
  const errors = Object.fromEntries(cart.items.map(item => [
    item.productId,
    parseQuantity(drafts[item.productId] ?? String(item.quantity)) === null
      ? 'Enter a positive whole number within the safe integer range.' : '',
  ]));

  function update(event: FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    if (Object.values(errors).some(Boolean)) return;
    updateQuantities(Object.fromEntries(cart.items.map(item => [
      item.productId, Number(drafts[item.productId] ?? item.quantity),
    ])));
  }

  function applyCouponCode(event: FormEvent) {
    event.preventDefault();
    if (couponCode !== 'SAVE5') {
      setCouponError(couponCode === '' ? 'Enter a coupon code.' : 'Unsupported coupon code. Use SAVE5 for 5% off.');
      return;
    }
    setCouponError('');
    applyCoupon(couponCode);
  }

  return (
    <div className="cart-page min-h-screen pt-6 pb-16 px-4 text-gray-800 dark:text-light">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        <CartFeedback />
        {cart.items.length === 0 ? (
          <div className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <p className="text-xl mb-4">Your cart is empty.</p>
            <Link to="/products" className="text-gray-800 dark:text-light underline decoration-primary decoration-2 underline-offset-4">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,3fr)_minmax(18rem,1fr)] gap-6 items-start">
            <section aria-label="Cart items" className="min-w-0 overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
              <form id="cart-quantities" onSubmit={update} noValidate>
                <table className="cart-table w-full text-left">
                  <caption className="sr-only">Products in your shopping cart. Update Cart applies quantity changes.</caption>
                  <thead className="bg-gray-100 dark:bg-gray-900">
                    <tr>
                      {['S. No.', 'Product Image', 'Product Name', 'Unit Price', 'Quantity', 'Total', 'Remove'].map(label => (
                        <th key={label} scope="col" className="p-3 text-sm font-semibold">{label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cart.items.map((item, index) => {
                      const error = errors[item.productId];
                      const showError = !!error && (submitted || drafts[item.productId] !== undefined);
                      return (
                        <tr key={item.productId} className="border-t border-gray-300 dark:border-gray-700">
                          <td data-label="S. No." className="p-3">{index + 1}</td>
                          <td data-label="Product Image" className="p-3">
                            <img src={`/${item.imgName}`} alt={item.name} className="w-20 h-20 object-contain" />
                          </td>
                          <th scope="row" data-label="Product Name" className="p-3 font-semibold">{item.name}</th>
                          <td data-label="Unit Price" className="p-3 whitespace-nowrap">{formatMoney(item.unitPriceCents)}</td>
                          <td data-label="Quantity" className="p-3">
                            <div>
                              <label htmlFor={`cart-qty-${item.productId}`} className="sr-only">Quantity of {item.name}</label>
                              <input
                                id={`cart-qty-${item.productId}`}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]+"
                                value={drafts[item.productId] ?? String(item.quantity)}
                                onChange={event => setDrafts(previous => ({ ...previous, [item.productId]: event.target.value }))}
                                aria-invalid={showError}
                                aria-describedby={showError ? `cart-qty-error-${item.productId}` : undefined}
                                className="w-20 rounded-lg border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-900 p-2 text-center"
                              />
                              {showError && (
                                <p id={`cart-qty-error-${item.productId}`} className="mt-2 text-sm text-red-700 dark:text-red-300" role="alert">{error}</p>
                              )}
                            </div>
                          </td>
                          <td data-label="Total" className="p-3 whitespace-nowrap">{formatMoney(item.unitPriceCents * item.quantity)}</td>
                          <td data-label="Remove" className="p-3">
                            <button
                              type="button"
                              onClick={() => {
                                removeItem(item.productId);
                                setDrafts(previous => {
                                  const next = { ...previous };
                                  delete next[item.productId];
                                  return next;
                                });
                              }}
                              aria-label={`Remove ${item.name} from cart`}
                              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-red-700 dark:hover:text-red-300"
                            >
                              <svg aria-hidden="true" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 10v7m4-7v7" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </form>
              <div className="border-t border-gray-300 dark:border-gray-700 p-4 flex flex-wrap items-start justify-between gap-4">
                <form onSubmit={applyCouponCode} noValidate className="flex-1 min-w-0">
                  <label htmlFor="cart-coupon" className="block text-sm mb-2">Coupon code</label>
                  <div className="flex flex-wrap gap-2">
                    <input
                      id="cart-coupon"
                      value={couponCode}
                      onChange={event => { setCouponCode(event.target.value); setCouponError(''); }}
                      aria-invalid={!!couponError}
                      aria-describedby={couponError ? 'cart-coupon-error' : undefined}
                      className="w-40 flex-1 min-w-0 rounded-lg border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-900 p-2"
                      placeholder="SAVE5"
                    />
                    <button type="submit" className="cart-action">Apply Coupon</button>
                  </div>
                  {couponError && <p id="cart-coupon-error" role="alert" className="mt-2 text-sm text-red-700 dark:text-red-300">{couponError}</p>}
                  {cart.coupon && <p className="mt-2 text-sm">SAVE5 active: 5% off. Discounts do not stack.</p>}
                </form>
                <div>
                  <button type="submit" form="cart-quantities" className="cart-action">Update Cart</button>
                  <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">Apply quantity edits to update totals.</p>
                </div>
              </div>
            </section>
            <aside aria-labelledby="cart-summary-heading" className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
              <h2 id="cart-summary-heading" className="text-2xl font-bold p-4 text-center">Order Summary</h2>
              <dl>
                {[
                  ['Subtotal', formatMoney(totals.subtotal)],
                  [cart.coupon ? 'Discount (5%)' : 'Discount', `-${formatMoney(totals.discount)}`],
                  ['Shipping', formatMoney(totals.shipping)],
                  ['Grand Total', formatMoney(totals.grandTotal)],
                ].map(([label, amount]) => (
                  <div key={label} className="flex justify-between gap-4 border-t border-gray-300 dark:border-gray-700 p-4 last:font-bold">
                    <dt>{label}</dt><dd>{amount}</dd>
                  </div>
                ))}
              </dl>
              <div className="p-4 border-t border-gray-300 dark:border-gray-700">
                <button type="button" disabled aria-describedby="checkout-coming-soon" className="w-full rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-4 py-3 cursor-not-allowed">
                  Proceed to Checkout
                </button>
                <p id="checkout-coming-soon" className="mt-2 text-sm text-center">Checkout coming soon.</p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
