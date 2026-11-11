// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from 'react-query';
import axios from 'axios';
import App from '../src/App';

vi.mock('axios', () => ({ default: { get: vi.fn() } }));
vi.mock('../src/components/Welcome', () => ({ default: () => null }));

const products = [
  { productId: 1, name: 'Feeder', description: 'Food', price: 19.99, discount: 0.25, imgName: 'feeder.png', sku: 'F', unit: 'each', supplierId: 1 },
  { productId: 2, name: 'Fountain', description: 'Water', price: 10, imgName: 'smart-fountain.png', sku: 'W', unit: 'each', supplierId: 1 },
];

function renderApp() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={client}><App /></QueryClientProvider>);
}

beforeEach(() => {
  localStorage.clear();
  history.replaceState({}, '', '/products');
  vi.mocked(axios.get).mockResolvedValue({ data: products });
});

afterEach(() => cleanup());

describe('shopping cart', () => {
  it('adds products, combines quantities, updates totals, persists and removes items', async () => {
    const user = userEvent.setup();
    const app = renderApp();
    await screen.findByText('Feeder');
    await user.click(screen.getByRole('button', { name: 'Increase quantity of Feeder' }));
    await user.click(screen.getByRole('button', { name: 'Add 1 Feeder to cart' }));
    await user.click(screen.getByRole('button', { name: 'Increase quantity of Feeder' }));
    await user.click(screen.getByRole('button', { name: 'Add 1 Feeder to cart' }));
    await user.click(screen.getByRole('button', { name: 'Increase quantity of Fountain' }));
    await user.click(screen.getByRole('button', { name: 'Add 1 Fountain to cart' }));
    await user.click(screen.getByRole('link', { name: 'Cart, 3 items' }));

    expect(screen.getByLabelText('Quantity of Feeder').textContent).toBe('2');
    const summary = screen.getByRole('complementary', { name: 'Order summary' });
    expect(within(summary).getByText('$49.98')).toBeTruthy();
    expect(within(summary).getByText('−$10.00')).toBeTruthy();
    expect(within(summary).getByText('$39.98')).toBeTruthy();

    await user.click(screen.getByRole('button', { name: 'Increase quantity of Feeder' }));
    expect(within(summary).getByText('$54.97')).toBeTruthy();
    app.unmount();
    renderApp();
    expect(screen.getByLabelText('Quantity of Feeder').textContent).toBe('3');
    expect(screen.getByRole('link', { name: 'Cart, 4 items' })).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Decrease quantity of Feeder' }));
    await user.click(screen.getByRole('button', { name: 'Remove Feeder' }));
    await user.click(screen.getByRole('button', { name: 'Remove Fountain' }));
    expect(screen.getByText('Your cart is empty.')).toBeTruthy();
    expect((screen.getByRole('button', { name: 'Proceed to checkout' }) as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByRole('link', { name: 'Cart, 0 items' })).toBeTruthy();
  });

  it('recovers from invalid stored cart data', () => {
    localStorage.setItem('octocat-cart', '{bad json');
    history.replaceState({}, '', '/cart');
    renderApp();
    expect(screen.getByText('Your cart is empty.')).toBeTruthy();
  });
});
