import { Link } from 'react-router-dom';
import { unitPriceCents, useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;

export default function Cart() {
  const { items, updateQuantity, removeItem } = useCart();
  const { darkMode } = useTheme();
  const subtotal = items.reduce((sum, item) => sum + Math.round(item.price * 100) * item.quantity, 0);
  const total = items.reduce((sum, item) => sum + unitPriceCents(item) * item.quantity, 0);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const panel = darkMode ? 'bg-gray-800 border-gray-700 text-light' : 'bg-white border-gray-200 text-gray-800';

  return (
    <div className={`min-h-screen pt-24 pb-16 px-4 ${darkMode ? 'bg-dark text-light' : 'bg-gray-100 text-gray-800'}`}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart <span className="text-lg font-normal">({count} items)</span></h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <section aria-label="Cart items" className={`lg:col-span-2 rounded-lg border overflow-hidden ${panel}`}>
            {items.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-lg mb-4">Your cart is empty.</p>
                <Link to="/products" className="text-primary font-semibold hover:underline">Continue shopping</Link>
              </div>
            ) : (
              <>
                <div className="hidden md:grid grid-cols-[2fr_1fr_1.4fr_1fr_auto] gap-4 px-4 py-4 border-b border-gray-500/30 font-semibold">
                  <span>Product</span><span>Unit price</span><span>Quantity</span><span>Total</span><span>Remove</span>
                </div>
                {items.map(item => (
                  <div key={item.productId} className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1.4fr_1fr_auto] gap-4 items-center p-4 border-b border-gray-500/30 last:border-b-0">
                    <div className="flex items-center gap-4">
                      <img src={`/${item.imgName}`} alt={item.name} className="w-20 h-20 object-contain" />
                      <span className="font-semibold">{item.name}</span>
                    </div>
                    <div><span className="md:hidden font-semibold">Unit price: </span>{money(unitPriceCents(item))}{item.discount ? <span className="block text-sm opacity-70 line-through">{money(Math.round(item.price * 100))}</span> : null}</div>
                    <div className="flex items-center gap-3">
                      <span className="md:hidden font-semibold">Quantity:</span>
                      <button type="button" className="w-9 h-9 rounded border border-gray-500 hover:text-primary disabled:opacity-40" aria-label={`Decrease quantity of ${item.name}`} disabled={item.quantity <= 1} onClick={() => updateQuantity(item.productId, item.quantity - 1)}>−</button>
                      <span aria-label={`Quantity of ${item.name}`}>{item.quantity}</span>
                      <button type="button" className="w-9 h-9 rounded border border-gray-500 hover:text-primary" aria-label={`Increase quantity of ${item.name}`} onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
                    </div>
                    <div className="font-semibold"><span className="md:hidden">Total: </span>{money(unitPriceCents(item) * item.quantity)}</div>
                    <button type="button" className="text-primary font-semibold hover:underline text-left" aria-label={`Remove ${item.name}`} onClick={() => removeItem(item.productId)}>Remove</button>
                  </div>
                ))}
              </>
            )}
          </section>
          <aside className={`rounded-lg border overflow-hidden ${panel}`} aria-label="Order summary">
            <h2 className="text-2xl font-bold text-center p-5 border-b border-gray-500/30">Order Summary</h2>
            <dl className="p-5 space-y-3">
              <div className="flex justify-between gap-4"><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div>
              <div className="flex justify-between gap-4"><dt>Product discounts</dt><dd>−{money(subtotal - total)}</dd></div>
              <div className="flex justify-between gap-4 font-bold border-t border-gray-500/30 pt-3"><dt>Grand total</dt><dd>{money(total)}</dd></div>
            </dl>
            <div className="px-5 pb-5">
              <button type="button" disabled className="w-full rounded-full bg-primary text-white px-4 py-3 opacity-60 cursor-not-allowed">Proceed to checkout</button>
              <p className="text-sm text-center mt-2">Checkout is not available yet.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
