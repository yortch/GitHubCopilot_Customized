import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import Login from '../components/Login';

function AuthControls() {
  const { isLoggedIn, isAdmin, login, logout } = useAuth();
  return <div>
    <span>{isLoggedIn ? 'logged in' : 'logged out'}</span>
    <span>{isAdmin ? 'admin' : 'customer'}</span>
    <button onClick={() => login('staff@github.com', 'password')}>Admin login</button>
    <button onClick={() => login('customer@example.com', 'password')}>Customer login</button>
    <button onClick={() => login('', '')}>Empty login</button>
    <button onClick={logout}>Logout</button>
  </div>;
}

function ThemeControls() {
  const { darkMode, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>{darkMode ? 'dark' : 'light'}</button>;
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.className = '';
});

describe('providers and login', () => {
  it('keeps login state, current admin classification and logout isolated', async () => {
    render(<AuthProvider><AuthControls /></AuthProvider>);
    fireEvent.click(screen.getByText('Empty login'));
    expect(screen.getByText('logged out')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Admin login'));
    await waitFor(() => expect(screen.getByText('admin')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Customer login'));
    expect(screen.getByText('customer')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Logout'));
    expect(screen.getByText('logged out')).toBeInTheDocument();
  });

  it('requires AuthProvider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<AuthControls />)).toThrow('useAuth must be used within an AuthProvider');
    consoleError.mockRestore();
  });

  it('persists and restores the selected theme', () => {
    localStorage.setItem('theme', 'dark');
    const view = render(<ThemeProvider><ThemeControls /></ThemeProvider>);
    expect(screen.getByText('dark')).toBeInTheDocument();
    expect(document.documentElement).toHaveClass('dark');
    fireEvent.click(screen.getByText('dark'));
    expect(localStorage.getItem('theme')).toBe('light');
    expect(document.documentElement).toHaveClass('light');
    view.unmount();
    render(<ThemeProvider><ThemeControls /></ThemeProvider>);
    expect(screen.getByText('light')).toBeInTheDocument();
  });

  it('defaults to light theme when storage is empty', () => {
    render(<ThemeProvider><ThemeControls /></ThemeProvider>);
    expect(screen.getByText('light')).toBeInTheDocument();
  });

  it('submits login and navigates home', async () => {
    render(<MemoryRouter initialEntries={['/login']}><AuthProvider><ThemeProvider>
      <Routes><Route path="/login" element={<Login />} /><Route path="/" element={<span>Home reached</span>} /></Routes>
    </ThemeProvider></AuthProvider></MemoryRouter>);
    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'staff@github.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));
    expect(await screen.findByText('Home reached')).toBeInTheDocument();
  });

  it('shows the error query parameter on the login page', () => {
    render(<MemoryRouter initialEntries={['/login?error=Access%20denied']}><AuthProvider><ThemeProvider><Login /></ThemeProvider></AuthProvider></MemoryRouter>);
    expect(screen.getByText('Access denied')).toBeInTheDocument();
  });

  it('renders the login page in dark mode', () => {
    localStorage.setItem('theme', 'dark');
    render(<MemoryRouter><AuthProvider><ThemeProvider><Login /></ThemeProvider></AuthProvider></MemoryRouter>);
    expect(screen.getByText('Login', { selector: 'h2' })).toBeInTheDocument();
  });
});

describe('API URL selection', () => {
  it('uses runtime config when supplied', async () => {
    vi.resetModules();
    window.RUNTIME_CONFIG = { API_URL: 'https://api.example.test' };
    const { API_BASE_URL } = await import('../api/config');
    expect(API_BASE_URL).toBe('https://api.example.test');
    delete window.RUNTIME_CONFIG;
  });

  it('falls back to local development URL', async () => {
    vi.resetModules();
    delete window.RUNTIME_CONFIG;
    const { api } = await import('../api/config');
    expect(api.baseURL).toBe('http://localhost:3000');
    expect(api.endpoints.products).toBe('/api/products');
  });
});