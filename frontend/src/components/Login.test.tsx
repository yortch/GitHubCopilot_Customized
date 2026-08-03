import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Login from './Login';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';

describe('Login', () => {
  it('renders URL error messages as inert text', () => {
    const payload = '<script>alert(1)</script>';

    render(
      <MemoryRouter initialEntries={[`/login?error=${encodeURIComponent(payload)}`]}>
        <AuthProvider>
          <ThemeProvider>
            <Login />
          </ThemeProvider>
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText(payload).textContent).toBe(payload);
    expect(document.querySelector('script')).toBeNull();
  });
});
