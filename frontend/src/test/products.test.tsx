import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import type { ReactNode } from 'react';
import axios from 'axios';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import Products from '../components/entity/product/Products';
import ProductForm from '../components/entity/product/ProductForm';
import AdminProducts from '../components/admin/AdminProducts';

vi.mock('axios', () => ({ default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() } }));

const products = [
  { productId: 1, supplierId: 1, name: 'Widget', description: 'Useful item', price: 20, sku: 'W-1', unit: 'piece', imgName: 'widget.png', discount: 0.25 },
  { productId: 2, supplierId: 1, name: 'Gadget', description: 'Other item', price: 10, sku: 'G-2', unit: 'box', imgName: 'gadget.png' },
];
const suppliers = [{ supplierId: 1, name: 'Maker' }];

function renderWithProviders(children: ReactNode, initialPath = '/') {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<MemoryRouter initialEntries={[initialPath]}><AuthProvider><ThemeProvider>
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  </ThemeProvider></AuthProvider></MemoryRouter>);
}

function AdminEntry() {
  const { isAdmin, login } = useAuth();
  return isAdmin ? <AdminProducts /> : <button onClick={() => login('staff@github.com', 'password')}>Sign in as admin</button>;
}

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  vi.mocked(axios.get).mockImplementation(async (url) => ({
    data: url.endsWith('/api/suppliers') ? suppliers : url.includes('/api/suppliers/') ? suppliers[0] : products,
  }));
  vi.mocked(axios.post).mockResolvedValue({ data: products[0] });
  vi.mocked(axios.put).mockResolvedValue({ data: products[0] });
  vi.mocked(axios.delete).mockResolvedValue({ data: null });
});

describe('catalog', () => {
  it('renders both discounted and regular products in dark mode', async () => {
    localStorage.setItem('theme', 'dark');
    renderWithProviders(<Products />);
    expect(await screen.findByText('Widget')).toBeInTheDocument();
    expect(screen.getByText('$15.00')).toBeInTheDocument();
    expect(screen.getByText('$10.00')).toBeInTheDocument();
    fireEvent.click(screen.getByAltText('Gadget'));
    expect(screen.getAllByText('Other item')).toHaveLength(2);
    fireEvent.click(screen.getAllByAltText('Gadget')[1].parentElement!.parentElement!.parentElement!);
    expect(screen.getAllByText('Other item')).toHaveLength(1);
  });

  it('loads products, filters by description and clamps quantities', async () => {
    const alert = vi.spyOn(window, 'alert').mockImplementation(() => {});
    renderWithProviders(<Products />);
    expect(await screen.findByText('Widget')).toBeInTheDocument();
    fireEvent.change(screen.getByRole('textbox', { name: 'Search products' }), { target: { value: 'useful' } });
    expect(screen.queryByText('Gadget')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Decrease quantity of Widget' }));
    expect(screen.getByLabelText('Quantity of Widget')).toHaveTextContent('0');
    fireEvent.click(screen.getByRole('button', { name: 'Increase quantity of Widget' }));
    expect(screen.getByLabelText('Quantity of Widget')).toHaveTextContent('1');
    fireEvent.click(screen.getByRole('button', { name: 'Add 1 Widget to cart' }));
    expect(alert).toHaveBeenCalledWith('Added 1 items to cart');
    expect(screen.getByLabelText('Quantity of Widget')).toHaveTextContent('0');
    alert.mockRestore();
  });

  it('opens and closes product details', async () => {
    renderWithProviders(<Products />);
    const image = await screen.findByAltText('Widget');
    fireEvent.click(image);
    expect(screen.getAllByText('Useful item')).toHaveLength(2);
    fireEvent.click(screen.getAllByAltText('Widget')[1].parentElement!.parentElement!.parentElement!);
    expect(screen.getAllByText('Useful item')).toHaveLength(1);
  });

  it('shows a failure message when loading fails', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(axios.get).mockRejectedValueOnce(new Error('offline'));
    renderWithProviders(<Products />);
    expect(await screen.findByText('Failed to fetch products')).toBeInTheDocument();
    consoleError.mockRestore();
  });
});

describe('product form', () => {
  it('supports dark mode, cancellation, and clearing a discount', async () => {
    localStorage.setItem('theme', 'dark');
    const onClose = vi.fn();
    renderWithProviders(<ProductForm product={products[0]} suppliers={suppliers} onSave={vi.fn()} onClose={onClose} />);
    fireEvent.change(screen.getAllByRole('spinbutton')[1], { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: 'Update' }));
    await waitFor(() => expect(axios.put).toHaveBeenCalledWith(expect.stringContaining('/api/products/1'), expect.objectContaining({ discount: undefined })));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('creates a product with normalized price, supplier and discount', async () => {
    const onSave = vi.fn();
    const onClose = vi.fn();
    renderWithProviders(<ProductForm suppliers={suppliers} onSave={onSave} onClose={onClose} />);
    const textboxes = screen.getAllByRole('textbox');
    for (const [index, value] of ['New', 'Description', 'SKU-1', 'piece', 'new.png'].entries()) {
      fireEvent.change(textboxes[index], { target: { value } });
    }
    fireEvent.change(screen.getAllByRole('spinbutton')[0], { target: { value: '12.50' } });
    fireEvent.change(screen.getAllByRole('spinbutton')[1], { target: { value: '25' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));
    await waitFor(() => expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/api/products'), expect.objectContaining({ price: 12.5, supplierId: 1, discount: 0.25 })));
    expect(onSave).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('updates existing products and keeps the form open on failure', async () => {
    const onClose = vi.fn();
    vi.mocked(axios.put).mockRejectedValueOnce(new Error('offline'));
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    renderWithProviders(<ProductForm product={products[0]} suppliers={suppliers} onSave={vi.fn()} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: 'Update' }));
    await waitFor(() => expect(axios.put).toHaveBeenCalledOnce());
    expect(onClose).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });
});

describe('admin catalog', () => {
  it('sorts all supported columns in both directions in dark mode', async () => {
    localStorage.setItem('theme', 'dark');
    renderWithProviders(<AdminEntry />);
    fireEvent.click(screen.getByText('Sign in as admin'));
    expect(await screen.findByText('Widget')).toBeInTheDocument();
    for (const field of ['Name', 'Supplier', 'Price', 'SKU', 'Unit']) {
      fireEvent.click(screen.getByText(new RegExp(`^${field} `)));
      fireEvent.click(screen.getByText(new RegExp(`^${field} `)));
    }
    expect(screen.getAllByRole('row')).toHaveLength(3);
    expect(screen.getByText('25%')).toBeInTheDocument();
    expect(screen.queryByText('Unknown')).not.toBeInTheDocument();
  });

  it('does not delete when confirmation is declined', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    renderWithProviders(<AdminEntry />);
    fireEvent.click(screen.getByText('Sign in as admin'));
    expect(await screen.findByText('Widget')).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0]);
    expect(axios.delete).not.toHaveBeenCalled();
    vi.mocked(window.confirm).mockRestore();
  });

  it('retains the table when product or supplier requests fail', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(axios.get).mockRejectedValue(new Error('offline'));
    renderWithProviders(<AdminEntry />);
    fireEvent.click(screen.getByText('Sign in as admin'));
    expect(await screen.findByText('Product Management')).toBeInTheDocument();
    await waitFor(() => expect(consoleError).toHaveBeenCalled());
    expect(screen.getAllByRole('row')).toHaveLength(1);
    consoleError.mockRestore();
  });

  it('redirects visitors without admin access', async () => {
    renderWithProviders(<Routes><Route path="/admin/products" element={<AdminProducts />} /><Route path="/" element={<span>Home view</span>} /></Routes>, '/admin/products');
    expect(await screen.findByText('Home view')).toBeInTheDocument();
  });

  it('loads suppliers, sorts products, and deletes after confirmation', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    renderWithProviders(<AdminEntry />);
    fireEvent.click(screen.getByText('Sign in as admin'));
    expect(await screen.findByText('Widget')).toBeInTheDocument();
    expect(screen.getAllByText('Maker')).not.toHaveLength(0);
    fireEvent.click(screen.getByText(/Price/));
    const rows = screen.getAllByRole('row');
    expect(within(rows[1]).getByText('Gadget')).toBeInTheDocument();
    fireEvent.click(within(rows[1]).getByRole('button', { name: 'Delete' }));
    await waitFor(() => expect(axios.delete).toHaveBeenCalledWith(expect.stringContaining('/api/products/2')));
    vi.mocked(window.confirm).mockRestore();
  });

  it('opens edit and create forms', async () => {
    renderWithProviders(<AdminEntry />);
    fireEvent.click(screen.getByText('Sign in as admin'));
    expect(await screen.findByText('Widget')).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('button', { name: 'Edit' })[0]);
    expect(screen.getByText('Edit Product')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    fireEvent.click(screen.getByRole('button', { name: 'Add New Product' }));
    expect(screen.getByText('Add New Product', { selector: 'h2' })).toBeInTheDocument();
  });
});