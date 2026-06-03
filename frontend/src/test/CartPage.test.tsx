import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, beforeEach } from 'vitest';
import CartPage from '../components/cart/CartPage';
import { CartProvider } from '../context/CartContext';
import { ThemeProvider } from '../context/ThemeContext';

const CART_STORAGE_KEY = 'octocat-cart';

const seedCart = () => {
  localStorage.setItem(
    CART_STORAGE_KEY,
    JSON.stringify({
      items: [
        {
          product: {
            productId: 1,
            name: 'Solar Panel',
            description: 'Portable panel',
            price: 100,
            imgName: 'smart-fountain.png',
            sku: 'SOL-001',
            unit: 'each',
            supplierId: 2,
          },
          quantity: 2,
        },
      ],
      coupon: null,
    }),
  );
};

const renderCartPage = () => {
  return render(
    <CartProvider>
      <ThemeProvider>
        <CartPage />
      </ThemeProvider>
    </CartProvider>,
  );
};

const getSummaryValue = (label: string | RegExp): string | null => {
  const summary = screen.getByLabelText('Order summary');
  const row = within(summary).getByText(label).parentElement;
  return row?.lastElementChild?.textContent?.replace(/\s+/g, '') ?? null;
};

describe('CartPage', () => {
  beforeEach(() => {
    localStorage.clear();
    seedCart();
  });

  it('shows default order summary values from cart state', () => {
    renderCartPage();

    expect(getSummaryValue('Subtotal')).toBe('$200.00');
    expect(getSummaryValue('Discount (5%)')).toBe('-$10.00');
    expect(getSummaryValue('Shipping')).toBe('$10.00');
    expect(getSummaryValue('Grand Total')).toBe('$200.00');
  });

  it('recomputes totals when quantity changes', async () => {
    renderCartPage();

    const user = userEvent.setup();
    const quantityInput = screen.getByLabelText('Quantity for Solar Panel');
    await user.click(quantityInput);
    await user.keyboard('{Control>}a{/Control}3');

    expect(getSummaryValue('Subtotal')).toBe('$300.00');
    expect(getSummaryValue('Discount (5%)')).toBe('-$15.00');
    expect(getSummaryValue('Grand Total')).toBe('$295.00');
  });

  it('applies coupon and updates discount percentage', async () => {
    renderCartPage();

    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Coupon code'), 'SAVE10');
    await user.click(screen.getByRole('button', { name: 'Apply Coupon' }));

    expect(getSummaryValue('Discount (10%)')).toBe('-$20.00');
    expect(getSummaryValue('Grand Total')).toBe('$190.00');
  });

  it('removes items and updates totals immediately', async () => {
    renderCartPage();

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Remove Solar Panel from cart' }));

    expect(screen.getByText('Your cart is empty. Add products to continue.')).toBeTruthy();
    expect(getSummaryValue('Subtotal')).toBe('$0.00');
    expect(getSummaryValue('Grand Total')).toBe('$0.00');
  });
});
