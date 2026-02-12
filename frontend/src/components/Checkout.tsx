import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Checkout() {
  const cartData = useCart();
  const theme = useTheme();
  const nav = useNavigate();
  const [orderPlaced, setOrderPlaced] = useState(false);

  const isDark = theme.darkMode;
  const cartItems = cartData.items;
  const total = cartData.totalPrice;

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    setTimeout(() => {
      cartData.clearCart();
      nav("/");
    }, 2000);
  };

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className={`min-h-screen pt-20 px-4 ${isDark ? "bg-dark" : "bg-gray-100"}`}>
        <div className="max-w-4xl mx-auto">
          <h1 className={`text-3xl font-bold mb-8 ${isDark ? "text-light" : "text-gray-800"}`}>Checkout</h1>
          <div className={`rounded-lg p-8 text-center ${isDark ? "bg-gray-800 text-light" : "bg-white text-gray-800"}`}>
            <p className="text-xl mb-4">Your cart is empty</p>
            <button onClick={() => nav("/products")} className="bg-primary text-white px-6 py-2 rounded hover:bg-accent">
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className={`min-h-screen pt-20 px-4 ${isDark ? "bg-dark" : "bg-gray-100"}`}>
        <div className="max-w-4xl mx-auto">
          <div className={`rounded-lg p-8 text-center ${isDark ? "bg-gray-800 text-light" : "bg-white text-gray-800"}`}>
            <div className="text-primary text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
            <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>Thank you for your order. Redirecting to home...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-20 pb-16 px-4 ${isDark ? "bg-dark" : "bg-gray-100"}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-3xl font-bold mb-8 ${isDark ? "text-light" : "text-gray-800"}`}>Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-light" : "text-gray-800"}`}>Order Summary</h2>
            <div className={`rounded-lg p-4 ${isDark ? "bg-gray-800" : "bg-white"}`}>
              {cartItems.map(item => {
                const finalPrice = item.discount ? item.price * (1 - item.discount) : item.price;
                const lineTotal = finalPrice * item.quantity;
                
                return (
                  <div key={item.productId} className={`flex justify-between py-2 border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                    <div>
                      <div className={`${isDark ? "text-light" : "text-gray-800"}`}>{item.name}</div>
                      <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Qty: {item.quantity}</div>
                    </div>
                    <div className={`font-semibold ${isDark ? "text-light" : "text-gray-800"}`}>${lineTotal.toFixed(2)}</div>
                  </div>
                );
              })}
              <div className={`flex justify-between pt-4 mt-4 border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                <span className={`text-lg font-bold ${isDark ? "text-light" : "text-gray-800"}`}>Total</span>
                <span className="text-lg font-bold text-primary">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-light" : "text-gray-800"}`}>Shipping Information</h2>
            <div className={`rounded-lg p-4 ${isDark ? "bg-gray-800" : "bg-white"}`}>
              <p className={`mb-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                This is a demo checkout page. No actual payment will be processed.
              </p>
              <button onClick={handlePlaceOrder} className="w-full bg-primary hover:bg-accent text-white px-6 py-3 rounded font-semibold">
                Place Order
              </button>
              <button onClick={() => nav("/cart")} className={`w-full mt-3 px-6 py-3 rounded ${isDark ? "bg-gray-700 hover:bg-gray-600 text-light" : "bg-gray-200 hover:bg-gray-300 text-gray-800"}`}>
                Back to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
