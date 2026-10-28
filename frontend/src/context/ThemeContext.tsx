/* eslint-disable react-refresh/only-export-components */
import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from './themeContextUtils';

// Separate hook into its own component file to satisfy fast refresh
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Main component export
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem('theme') === 'dark';
    } catch (error) {
      console.error('Unable to restore the theme preference:', error);
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    } catch (error) {
      console.error('Unable to save the theme preference:', error);
    }
    
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}