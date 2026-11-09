import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const getUnitPrice = (price: number, discount?: number) =>
  Math.round(price * (1 - (discount || 0)) * 100) / 100;
const formatPrice = (price: number) => `$${price.toFixed(2)}`;

export default function Cart() {
  const { items, updateQuantities, removeFromCart } = useCart();
  const { darkMode } = useTheme();
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [cartMessage, setCartMessage] = useState('');
  const [couponMessage, setCouponMessage] = useState('');

  useEffect(() => {
    setQuantities(Object.fromEntries(items.map(({ product, quantity }) => [product.productId, quantity])));
  }, [items]);

  const subtotal = Math.round(items.reduce((total, { product }) =>
    total + getUnitPrice(product.price, product.discount) * (quantities[product.productId] || 0), 0) * 100) / 100;

  const handleUpdateCart = () => {
    updateQuantities(quantities);
    setCartMessage('Your cart has been updated.');
  };

  const handleApplyCoupon = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCouponMessage('Coupon codes are not available yet. No discount was applied.');
  };

  const textColor = darkMode ? 'text-light' : 'text-gray-800';
  const mutedTextColor = darkMode ? 'text-gray-400' : 'text-gray-600';
  const panelColor = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} px-4 pb-16 pt-24 transition-colors duration-300`}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className={`text-3xl font-bold ${textColor}`}>Your Cart</h1>
          <Link to="/products" className="font-medium text-primary hover:text-accent">
            Continue shopping
          </Link>
        </div>

        {items.length === 0 ? (
          <section className={`rounded-lg border p-10 text-center shadow ${panelColor}`}>
            <h2 className={`mb-2 text-2xl font-semibold ${textColor}`}>Your cart is empty</h2>
            <p className={`mb-6 ${mutedTextColor}`}>Browse OctoCAT Supply products and add something your cat will love.</p>
            <Link to="/products" className="inline-block rounded-lg bg-primary px-6 py-3 font-medium text-white hover:bg-accent">
              Browse products
            </Link>
          </section>
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-3">
            <section className={`overflow-hidden rounded-lg border shadow lg:col-span-2 ${panelColor}`}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] border-collapse text-left">
                  <thead>
                    <tr className={`${darkMode ? 'bg-gray-900' : 'bg-gray-50'} ${textColor}`}>
                      <th scope="col" className="border-b border-gray-700/30 px-4 py-4">S. No.</th>
                      <th scope="col" className="border-b border-gray-700/30 px-4 py-4">Product Image</th>
                      <th scope="col" className="border-b border-gray-700/30 px-4 py-4">Product Name</th>
                      <th scope="col" className="border-b border-gray-700/30 px-4 py-4">Unit Price</th>
                      <th scope="col" className="border-b border-gray-700/30 px-4 py-4">Quantity</th>
                      <th scope="col" className="border-b border-gray-700/30 px-4 py-4">Total</th>
                      <th scope="col" className="border-b border-gray-700/30 px-4 py-4">Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(({ product }, index) => {
                      const unitPrice = getUnitPrice(product.price, product.discount);
                      return (
                        <tr key={product.productId} className={`${textColor} border-b border-gray-700/20`}>
                          <td className="px-4 py-4">{index + 1}</td>
                          <td className="px-4 py-3">
                            <img src={`/${product.imgName}`} alt={product.name} className="mx-auto h-16 w-20 object-contain" />
                          </td>
                          <td className="px-4 py-4 font-medium">{product.name}</td>
                          <td className="px-4 py-4">{formatPrice(unitPrice)}</td>
                          <td className="px-4 py-4">
                            <input
                              aria-label={`Quantity of ${product.name}`}
                              className={`w-20 rounded-md border px-2 py-2 text-center ${darkMode ? 'border-gray-600 bg-gray-900' : 'border-gray-300 bg-white'}`}
                              min="1"
                              onChange={event => {
                                const value = Math.max(1, Math.floor(Number(event.target.value) || 1));
                                setQuantities(current => ({ ...current, [product.productId]: value }));
                                setCartMessage('');
                              }}
                              type="number"
                              value={quantities[product.productId] ?? 1}
                            />
                          </td>
                          <td className="px-4 py-4 font-semibold">
                            {formatPrice(unitPrice * (quantities[product.productId] || 0))}
                          </td>
                          <td className="px-4 py-4 text-center">
                            <button
                              aria-label={`Remove ${product.name} from cart`}
                              className="rounded p-2 text-red-500 hover:bg-red-500/10 focus:outline-none focus:ring-2 focus:ring-red-500"
                              onClick={() => removeFromCart(product.productId)}
                              type="button"
                            >
                              <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M6 7h12m-10 0 .7 13h6.6L16 7m-7 0V4h6v3m-5 3v7m4-7v7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className={`flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                <form onSubmit={handleApplyCoupon} className="flex min-w-0 flex-1">
                  <label className="sr-only" htmlFor="coupon-code">Coupon code</label>
                  <input
                    className={`min-w-0 flex-1 rounded-l-full border px-4 py-3 ${darkMode ? 'border-gray-700 bg-gray-800 text-light' : 'border-gray-300 bg-white text-gray-800'}`}
                    id="coupon-code"
                    placeholder="Coupon code"
                    type="text"
                  />
                  <button className="rounded-r-full bg-primary px-4 py-3 font-medium text-white hover:bg-accent" type="submit">
                    Apply Coupon
                  </button>
                </form>
                <button className="rounded-full bg-primary px-8 py-3 font-medium text-white hover:bg-accent" onClick={handleUpdateCart} type="button">
                  Update Cart
                </button>
              </div>
              <div className="px-4 pb-4" aria-live="polite">
                {couponMessage && <p className={`text-sm ${mutedTextColor}`}>{couponMessage}</p>}
                {cartMessage && <p className={`text-sm ${mutedTextColor}`}>{cartMessage}</p>}
              </div>
            </section>

            <aside className={`rounded-lg border p-5 shadow ${panelColor}`}>
              <h2 className={`mb-4 text-2xl font-bold ${textColor}`}>Order Summary</h2>
              <dl className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'} ${textColor}`}>
                <div className="flex justify-between gap-4 py-3">
                  <dt>Subtotal</dt>
                  <dd>{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between gap-4 py-3">
                  <dt>Discount</dt>
                  <dd>{formatPrice(0)}</dd>
                </div>
                <div className="flex justify-between gap-4 py-3">
                  <dt>Shipping</dt>
                  <dd className="text-right">Calculated at checkout</dd>
                </div>
                <div className="flex justify-between gap-4 py-4 text-lg font-bold">
                  <dt>Grand Total</dt>
                  <dd>{formatPrice(subtotal)}</dd>
                </div>
              </dl>
              <p className={`mb-5 text-sm ${mutedTextColor}`}>
                No coupon discount or shipping charge is included in this total.
              </p>
              <button
                className="w-full cursor-not-allowed rounded-full bg-gray-500 px-4 py-3 font-semibold text-white"
                disabled
                title="Checkout is not available yet"
                type="button"
              >
                Proceed to Checkout
              </button>
              <p className={`mt-3 text-center text-sm ${mutedTextColor}`}>Checkout is not available yet.</p>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
