import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { useState } from "react";

interface CartItemDisplayProps {
  productId: number;
  name: string;
  description: string;
  price: number;
  imgName: string;
  quantity: number;
  discount?: number;
  onQuantityChange: (id: number, newQty: number) => void;
  onRemove: (id: number) => void;
  isDark: boolean;
}

function CartItemDisplay(props: CartItemDisplayProps) {
  const effectivePrice = props.discount ? props.price * (1 - props.discount) : props.price;
  const totalPrice = effectivePrice * props.quantity;

  return (
    <div className={`${props.isDark ? "bg-gray-800" : "bg-white"} rounded-lg p-6 shadow-lg transition-colors duration-300`}>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className={`w-full sm:w-32 h-32 ${props.isDark ? "bg-gradient-to-t from-gray-700 to-gray-800" : "bg-gradient-to-t from-gray-100 to-white"} rounded-lg flex items-center justify-center transition-colors duration-300`}>
          <img src={`/${props.imgName}`} alt={props.name} className="w-full h-full object-contain p-2" />
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className={`text-xl font-semibold ${props.isDark ? "text-light" : "text-gray-800"} transition-colors duration-300`}>{props.name}</h3>
              <p className={`${props.isDark ? "text-gray-400" : "text-gray-600"} text-sm transition-colors duration-300`}>{props.description}</p>
            </div>
            <button onClick={() => props.onRemove(props.productId)} className={`${props.isDark ? "text-gray-400 hover:text-red-400" : "text-gray-600 hover:text-red-600"} transition-colors`} aria-label={`Remove ${props.name} from cart`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
            <div className="flex items-center gap-4">
              <span className={`${props.isDark ? "text-gray-400" : "text-gray-600"} text-sm transition-colors duration-300`}>Price:</span>
              {props.discount ? (
                <div><span className="text-gray-500 line-through text-sm mr-2">${props.price.toFixed(2)}</span><span className="text-primary text-lg font-bold">${effectivePrice.toFixed(2)}</span></div>
              ) : (
                <span className="text-primary text-lg font-bold">${effectivePrice.toFixed(2)}</span>
              )}
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-4">
              <div className={`flex items-center space-x-3 ${props.isDark ? "bg-gray-700" : "bg-gray-200"} rounded-lg p-1 transition-colors duration-300`}>
                <button onClick={() => props.onQuantityChange(props.productId, props.quantity - 1)} className={`w-8 h-8 flex items-center justify-center ${props.isDark ? "text-light" : "text-gray-700"} hover:text-primary transition-colors duration-300`} aria-label={`Decrease quantity of ${props.name}`}><span aria-hidden="true">-</span></button>
                <span className={`${props.isDark ? "text-light" : "text-gray-800"} min-w-[2rem] text-center transition-colors duration-300`} aria-label={`Quantity of ${props.name}`}>{props.quantity}</span>
                <button onClick={() => props.onQuantityChange(props.productId, props.quantity + 1)} className={`w-8 h-8 flex items-center justify-center ${props.isDark ? "text-light" : "text-gray-700"} hover:text-primary transition-colors duration-300`} aria-label={`Increase quantity of ${props.name}`}><span aria-hidden="true">+</span></button>
              </div>
              <div className="text-right">
                <span className={`${props.isDark ? "text-gray-400" : "text-gray-600"} text-sm block transition-colors duration-300`}>Total:</span>
                <span className="text-primary text-lg font-bold">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  const { darkMode } = useTheme();
  const [isProcessing] = useState(false);

  const handleItemQuantityUpdate = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleItemRemoval = (productId: number) => {
    removeFromCart(productId);
  };

  const goToCheckout = () => {
    navigate("/checkout");
  };

  const continueBrowsing = () => {
    navigate("/products");
  };

  const pricingDetails = {
    subtotalValue: getTotalPrice(),
    taxRate: 0.08,
    shippingCostValue: 0
  };

  const taxValue = pricingDetails.subtotalValue * pricingDetails.taxRate;
  const grandTotalValue = pricingDetails.subtotalValue + taxValue + pricingDetails.shippingCostValue;

  const hasItems = cartItems && cartItems.length > 0;

  if (!hasItems) {
    return (
      <div className={`min-h-screen ${darkMode ? "bg-dark" : "bg-gray-100"} pt-20 pb-16 px-4 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto">
          <h1 className={`text-3xl font-bold ${darkMode ? "text-light" : "text-gray-800"} mb-6 transition-colors duration-300`}>Shopping Cart</h1>
          <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg p-12 text-center shadow-lg transition-colors duration-300`}>
            <svg className={`mx-auto h-24 w-24 ${darkMode ? "text-gray-600" : "text-gray-400"} mb-4 transition-colors duration-300`} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <h2 className={`text-2xl font-semibold ${darkMode ? "text-light" : "text-gray-800"} mb-2 transition-colors duration-300`}>Your cart is empty</h2>
            <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} mb-6 transition-colors duration-300`}>Add some products to get started!</p>
            <button onClick={continueBrowsing} className="bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg font-medium transition-colors">Continue Shopping</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-dark" : "bg-gray-100"} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-3xl font-bold ${darkMode ? "text-light" : "text-gray-800"} mb-6 transition-colors duration-300`}>Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <CartItemDisplay
                key={item.productId}
                productId={item.productId}
                name={item.name}
                description={item.description}
                price={item.price}
                imgName={item.imgName}
                quantity={item.quantity}
                discount={item.discount}
                onQuantityChange={handleItemQuantityUpdate}
                onRemove={handleItemRemoval}
                isDark={darkMode}
              />
            ))}
          </div>
          <div className="lg:col-span-1">
            <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg p-6 shadow-lg transition-colors duration-300 sticky top-24`}>
              <h2 className={`text-2xl font-semibold ${darkMode ? "text-light" : "text-gray-800"} mb-6 transition-colors duration-300`}>Order Summary</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className={`${darkMode ? "text-gray-400" : "text-gray-600"} transition-colors duration-300`}>Subtotal</span>
                  <span className={`${darkMode ? "text-light" : "text-gray-800"} font-medium transition-colors duration-300`}>${pricingDetails.subtotalValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className={`${darkMode ? "text-gray-400" : "text-gray-600"} transition-colors duration-300`}>Shipping</span>
                  <span className="text-primary font-medium">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span className={`${darkMode ? "text-gray-400" : "text-gray-600"} transition-colors duration-300`}>Tax (8%)</span>
                  <span className={`${darkMode ? "text-light" : "text-gray-800"} font-medium transition-colors duration-300`}>${taxValue.toFixed(2)}</span>
                </div>
                <div className={`border-t ${darkMode ? "border-gray-700" : "border-gray-200"} pt-4 transition-colors duration-300`}>
                  <div className="flex justify-between">
                    <span className={`text-xl font-semibold ${darkMode ? "text-light" : "text-gray-800"} transition-colors duration-300`}>Total</span>
                    <span className="text-xl font-bold text-primary">${grandTotalValue.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <button onClick={goToCheckout} disabled={isProcessing} className="w-full bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg font-medium transition-colors">Proceed to Checkout</button>
                <button onClick={continueBrowsing} className={`w-full ${darkMode ? "bg-gray-700 hover:bg-gray-600 text-light" : "bg-gray-200 hover:bg-gray-300 text-gray-800"} px-6 py-3 rounded-lg font-medium transition-colors duration-300`}>Continue Shopping</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
