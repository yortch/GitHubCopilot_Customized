import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Welcome from './components/Welcome';
import About from './components/About';
import Footer from './components/Footer';
import Products from './components/entity/product/Products';
import Login from './components/Login';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import AdminProducts from './components/admin/AdminProducts';
import { useTheme } from './context/ThemeContext';

const ROUTE_PATHS = {
  HOME: "/",
  ABOUT: "/about",
  PRODUCTS: "/products",
  CART: "/cart",
  CHECKOUT: "/checkout",
  LOGIN: "/login",
  ADMIN_PRODUCTS: "/admin/products"
};

function ThemedApp() {
  const themeState = useTheme();
  const isDarkTheme = themeState.darkMode;
  const backgroundClass = isDarkTheme ? 'bg-dark' : 'bg-gray-100';
  
  return (
    <Router>
      <div className={`flex flex-col min-h-screen ${backgroundClass} transition-colors duration-300`}>
        <Navigation />
        <main className="flex-grow">
          <Routes>
            <Route path={ROUTE_PATHS.HOME} element={<Welcome />} />
            <Route path={ROUTE_PATHS.ABOUT} element={<About />} />
            <Route path={ROUTE_PATHS.PRODUCTS} element={<Products />} />
            <Route path={ROUTE_PATHS.CART} element={<Cart />} />
            <Route path={ROUTE_PATHS.CHECKOUT} element={<Checkout />} />
            <Route path={ROUTE_PATHS.LOGIN} element={<Login />} />
            <Route path={ROUTE_PATHS.ADMIN_PRODUCTS} element={<AdminProducts />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          <ThemedApp />
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
