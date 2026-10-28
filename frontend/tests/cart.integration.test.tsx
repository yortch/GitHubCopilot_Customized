import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from 'react-query';
import axios from 'axios';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import App from '../src/App';
import { CartProvider } from '../src/context/CartContext';
import CartFeedback from '../src/components/CartFeedback';
import { useCart } from '../src/context/useCart';
import { addCartItem, CART_STORAGE_KEY, emptyCart, readCart, writeCart } from '../src/cart/cart';

vi.mock('axios');

const products = [
  { productId: 1, name: 'Smart Collar', imgName: 'smart-collar.png', price: 89, description: 'GPS collar', sku: 'CAT-1', unit: 'each', supplierId: 1 },
  { productId: 2, name: 'Smart Feeder', imgName: 'feeder.png', price: 89, description: 'Automatic feeder', sku: 'CAT-2', unit: 'each', supplierId: 1 },
  { productId: 3, name: 'Scratch Pad', imgName: 'scratch-pad.png', price: 89, description: 'Interactive pad', sku: 'CAT-3', unit: 'each', supplierId: 1 },
];

function renderApp(path = '/cart') {
  window.history.replaceState({}, '', path);
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, cacheTime: 0 } } });
  return render(<QueryClientProvider client={client}><App /></QueryClientProvider>);
}

function seedCart() {
  let cart = emptyCart();
  for (const product of products) cart = addCartItem(cart, product, 1);
  localStorage.setItem(CART_STORAGE_KEY, writeCart(cart));
}

function summaryValue(label: string) {
  const summary = screen.getByRole('complementary', { name: 'Order Summary' });
  return within(summary).getByText(label).nextElementSibling?.textContent;
}

beforeEach(() => {
  localStorage.clear();
  vi.mocked(axios.get).mockResolvedValue({ data: products });
});

afterEach(() => vi.restoreAllMocks());

describe('storefront cart integration', () => {
  it('adds selected quantities, merges rows, updates navigation and persists through navigation/restart', async () => {
    const user = userEvent.setup();
    const app = renderApp('/products');
    await screen.findByRole('heading', { name: 'Smart Collar' });
    await user.click(screen.getByRole('button', { name: 'Increase quantity of Smart Collar' }));
    await user.click(screen.getByRole('button', { name: 'Increase quantity of Smart Collar' }));
    await user.click(screen.getByRole('button', { name: 'Add 2 Smart Collar to cart' }));
    expect(screen.getByRole('status')).toHaveTextContent('Added 2 Smart Collar');
    await user.click(screen.getByRole('button', { name: 'Increase quantity of Smart Collar' }));
    await user.click(screen.getByRole('button', { name: 'Add 1 Smart Collar to cart' }));
    await user.click(screen.getByRole('link', { name: 'Shopping cart, 3 items' }));
    expect(screen.getByRole('textbox', { name: 'Quantity of Smart Collar' })).toHaveValue('3');
    expect(screen.getAllByRole('rowheader', { name: 'Smart Collar' })).toHaveLength(1);
    expect(summaryValue('Subtotal')).toBe('$267.00');
    await waitFor(() => expect(readCart(localStorage.getItem(CART_STORAGE_KEY)!).items[0].quantity).toBe(3));
    app.unmount();
    renderApp();
    expect(screen.getByRole('textbox', { name: 'Quantity of Smart Collar' })).toHaveValue('3');
    expect(screen.getByRole('link', { name: 'Shopping cart, 3 items' })).toBeInTheDocument();
  });

  it('uses the same discounted unit price on Products and in the cart', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: [{ ...products[0], price: 19.99, discount: 0.15 }] });
    const user = userEvent.setup();
    renderApp('/products');
    expect(await screen.findByText('$16.99')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Increase quantity of Smart Collar' }));
    await user.click(screen.getByRole('button', { name: 'Add 1 Smart Collar to cart' }));
    await user.click(screen.getByRole('link', { name: 'Shopping cart, 1 items' }));
    expect(summaryValue('Subtotal')).toBe('$16.99');
  });

  it('stages quantity changes until Update Cart and rejects invalid edits atomically', async () => {
    seedCart();
    const user = userEvent.setup();
    renderApp();
    const quantity = screen.getByRole('textbox', { name: 'Quantity of Smart Collar' });
    await user.clear(quantity);
    await user.type(quantity, '2');
    expect(summaryValue('Subtotal')).toBe('$267.00');
    await user.click(screen.getByRole('button', { name: 'Update Cart' }));
    expect(summaryValue('Subtotal')).toBe('$356.00');
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    for (const value of ['', '0', '-1', '1.5', 'abc', '1e2', '9007199254740992']) {
      fireEvent.change(quantity, { target: { value } });
      await user.click(screen.getByRole('button', { name: 'Update Cart' }));
      expect(quantity).toHaveAttribute('aria-invalid', 'true');
      expect(quantity).toHaveAccessibleDescription(/positive whole number/);
      expect(summaryValue('Subtotal')).toBe('$356.00');
      expect(localStorage.getItem(CART_STORAGE_KEY)).toBe(saved);
    }
    fireEvent.change(quantity, { target: { value: '9007199254740991' } });
    await user.click(screen.getByRole('button', { name: 'Update Cart' }));
    expect(screen.getByRole('alert')).toHaveTextContent(/too large/);
    expect(summaryValue('Subtotal')).toBe('$356.00');
    expect(localStorage.getItem(CART_STORAGE_KEY)).toBe(saved);
  });

  it('validates coupons, calculates the reference totals, persists and never stacks discounts', async () => {
    seedCart();
    const user = userEvent.setup();
    const app = renderApp();
    const code = screen.getByRole('textbox', { name: 'Coupon code' });
    await user.click(screen.getByRole('button', { name: 'Apply Coupon' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a coupon code.');
    await user.type(code, 'save5');
    await user.click(screen.getByRole('button', { name: 'Apply Coupon' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Unsupported coupon code.');
    expect(summaryValue('Discount')).toBe('-$0.00');
    await user.clear(code);
    await user.type(code, 'SAVE5');
    await user.click(screen.getByRole('button', { name: 'Apply Coupon' }));
    expect(summaryValue('Subtotal')).toBe('$267.00');
    expect(summaryValue('Discount (5%)')).toBe('-$13.35');
    expect(summaryValue('Shipping')).toBe('$10.00');
    expect(summaryValue('Grand Total')).toBe('$263.65');
    await user.click(screen.getByRole('button', { name: 'Apply Coupon' }));
    expect(summaryValue('Grand Total')).toBe('$263.65');
    expect(screen.getByRole('button', { name: 'Proceed to Checkout' })).toBeDisabled();
    expect(screen.getByText('Checkout coming soon.')).toBeVisible();
    app.unmount();
    renderApp();
    expect(summaryValue('Grand Total')).toBe('$263.65');
  });

  it('removes items and shows an empty state linked to Products without shipping', async () => {
    seedCart();
    const user = userEvent.setup();
    renderApp();
    expect(screen.getByRole('link', { name: 'My Cart' })).toHaveAttribute('href', '/cart');
    await user.click(screen.getByRole('button', { name: 'Remove Smart Collar from cart' }));
    expect(summaryValue('Subtotal')).toBe('$178.00');
    expect(screen.getByRole('link', { name: 'Shopping cart, 2 items' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Remove Smart Feeder from cart' }));
    await user.click(screen.getByRole('button', { name: 'Remove Scratch Pad from cart' }));
    expect(screen.getByText('Your cart is empty.')).toBeVisible();
    expect(screen.getByRole('link', { name: 'Browse Products' })).toHaveAttribute('href', '/products');
    expect(screen.queryByText('Shipping')).not.toBeInTheDocument();
    expect(readCart(localStorage.getItem(CART_STORAGE_KEY)!)).toEqual(emptyCart());
  });

  it('exposes mobile Products navigation and preserves light/dark theme behavior', async () => {
    seedCart();
    const user = userEvent.setup();
    renderApp();
    expect(document.documentElement).toHaveClass('light');
    await user.click(screen.getByRole('button', { name: 'Toggle dark/light mode' }));
    expect(document.documentElement).toHaveClass('dark');
    const menu = screen.getByRole('button', { name: 'Menu' });
    await user.click(menu);
    expect(menu).toHaveAttribute('aria-expanded', 'true');
    const mobileNav = document.getElementById('storefront-mobile-nav')!;
    await user.click(within(mobileNav).getByRole('link', { name: 'Products' }));
    expect(await screen.findByRole('heading', { name: 'Products' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Shopping cart, 3 items' })).toBeInTheDocument();
    expect(menu).toHaveAttribute('aria-expanded', 'false');
  });
});

function StorageHarness() {
  const { addItem, cart } = useCart();
  return (
    <>
      <CartFeedback />
      <p>Rows: {cart.items.length}</p>
      <button onClick={() => addItem(products[0], 1)}>Add item</button>
    </>
  );
}

describe('storage failures', () => {
  it('warns about malformed storage and does not overwrite it before an explicit cart change', async () => {
    localStorage.setItem(CART_STORAGE_KEY, '{broken');
    const logged = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<CartProvider><StorageHarness /></CartProvider>);
    expect(screen.getByRole('alert')).toHaveTextContent('could not be restored');
    expect(localStorage.getItem(CART_STORAGE_KEY)).toBe('{broken');
    await userEvent.click(screen.getByRole('button', { name: 'Add item' }));
    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument());
    expect(readCart(localStorage.getItem(CART_STORAGE_KEY)!).items).toHaveLength(1);
    expect(logged).toHaveBeenCalled();
  });

  it('keeps the storefront usable when storage access is denied and reports the failure', async () => {
    const logged = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new DOMException('Denied', 'SecurityError'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('Denied', 'SecurityError'); });
    renderApp('/products');
    await screen.findByRole('heading', { name: 'Smart Collar' });
    expect(screen.getByRole('alert')).toHaveTextContent('could not be restored');
    await userEvent.click(screen.getByRole('button', { name: 'Increase quantity of Smart Collar' }));
    await userEvent.click(screen.getByRole('button', { name: 'Add 1 Smart Collar to cart' }));
    expect(screen.getByRole('link', { name: 'Shopping cart, 1 items' })).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('could not be saved');
    expect(logged).toHaveBeenCalled();
  });

  it('warns on quota/write failures, retains items in memory and can retry saving', async () => {
    const logged = vi.spyOn(console, 'error').mockImplementation(() => {});
    const write = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('Full', 'QuotaExceededError'); });
    render(<CartProvider><StorageHarness /></CartProvider>);
    await userEvent.click(screen.getByRole('button', { name: 'Add item' }));
    expect(screen.getByText('Rows: 1')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('could not be saved');
    expect(logged).toHaveBeenCalled();
    write.mockRestore();
    await userEvent.click(screen.getByRole('button', { name: 'Retry saving cart' }));
    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument());
    expect(readCart(localStorage.getItem(CART_STORAGE_KEY)!).items[0].quantity).toBe(1);
  });
});
