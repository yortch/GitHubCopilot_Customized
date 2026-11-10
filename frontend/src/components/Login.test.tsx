import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Login from './Login';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';

describe('Login', () => {
  it('renders URL error messages as text', async () => {
    const errorMessage = '<img src=x onerror=alert(1)>';

    render(
      <AuthProvider>
        <ThemeProvider>
          <MemoryRouter initialEntries={[`/login?error=${encodeURIComponent(errorMessage)}`]}>
            <Login />
          </MemoryRouter>
        </ThemeProvider>
      </AuthProvider>,
    );

    const alert = await screen.findByText(errorMessage);

    expect(alert.textContent).toBe(errorMessage);
    expect(alert.querySelector('img')).toBeNull();
  });
});
