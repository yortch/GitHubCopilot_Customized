import { Link } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';

export default function CheckoutPlaceholder() {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-24 pb-16 px-4 transition-colors duration-300`}>
      <div className={`max-w-3xl mx-auto rounded-xl border ${darkMode ? 'border-gray-700 bg-gray-900 text-light' : 'border-gray-200 bg-white text-gray-800'} p-8 shadow-lg transition-colors duration-300`}>
        <h1 className="text-3xl font-bold mb-3">Checkout</h1>
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6 transition-colors duration-300`}>
          Checkout submission is intentionally out of scope for this phase. This page is a placeholder route.
        </p>
        <Link
          to="/cart"
          className="inline-flex items-center rounded-lg bg-primary px-5 py-3 font-semibold text-white transition-colors hover:bg-accent"
        >
          Back to Cart
        </Link>
      </div>
    </div>
  );
}
