import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const cartData = useCart();
  const theme = useTheme();
  const nav = useNavigate();

  const isDark = theme.darkMode;
  const cartItems = cartData.items;
  const total = cartData.totalPrice;

  const handleRemove = (id: number) => {
    cartData.removeFromCart(id);
  };

  const handleUpdateQty = (id: number, qty: number) => {
    cartData.updateQuantity(id, qty);
  };

  const handleClearAll = () => {
    cartData.clearCart();
  };

  if (cartItems.length === 0) {
    return (
      <div className={`min-h-screen pt-20 px-4 ${isDark ? "bg-dark" : "bg-gray-100"}`}>
        <div className="max-w-4xl mx-auto">
          <h1 className={`text-3xl font-bold mb-8 ${isDark ? "text-light" : "text-gray-800"}`}>Shopping Cart</h1>
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

  return (
    <div className={`min-h-screen pt-20 pb-16 px-4 ${isDark ? "bg-dark" : "bg-gray-100"}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold ${isDark ? "text-light" : "text-gray-800"}`}>Shopping Cart</h1>
          <button onClick={handleClearAll} className={`${isDark ? "text-gray-400 hover:text-red-400" : "text-gray-600 hover:text-red-600"}`}>
            Clear All
          </button>
        </div>

        <div className="space-y-4 mb-8">
          {cartItems.map(product => {
            const finalPrice = product.discount ? product.price * (1 - product.discount) : product.price;
            const lineTotal = finalPrice * product.quantity;

            return (
              <div key={product.productId} className={`rounded-lg p-4 shadow ${isDark ? "bg-gray-800" : "bg-white"}`}>
                <div className="flex items-center gap-4">
                  <img src={`/${product.imgName}`} alt={product.name} className={`w-20 h-20 object-contain rounded ${isDark ? "bg-gray-700" : "bg-gray-100"}`} />
                  
                  <div className="flex-grow">
                    <h3 className={`font-semibold ${isDark ? "text-light" : "text-gray-800"}`}>{product.name}</h3>
                    <div className="mt-1">
                      {product.discount ? (
                        <div>
                          <span className="text-gray-500 line-through text-sm mr-2">${product.price.toFixed(2)}</span>
                          <span className="text-primary font-bold">${finalPrice.toFixed(2)}</span>
                        </div>
                      ) : (
                        <span className="text-primary font-bold">${product.price.toFixed(2)}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-2 rounded px-2 py-1 ${isDark ? "bg-gray-700" : "bg-gray-200"}`}>
                      <button onClick={() => handleUpdateQty(product.productId, product.quantity - 1)} className="w-7 h-7 hover:text-primary">-</button>
                      <span className="min-w-[30px] text-center">{product.quantity}</span>
                      <button onClick={() => handleUpdateQty(product.productId, product.quantity + 1)} className="w-7 h-7 hover:text-primary">+</button>
                    </div>
                    
                    <div className="min-w-[70px] text-right">
                      <span className={`font-semibold ${isDark ? "text-light" : "text-gray-800"}`}>${lineTotal.toFixed(2)}</span>
                    </div>

                    <button onClick={() => handleRemove(product.productId)} className={`${isDark ? "text-gray-400 hover:text-red-400" : "text-gray-600 hover:text-red-600"}`}>
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className={`rounded-lg p-6 shadow ${isDark ? "bg-gray-800" : "bg-white"}`}>
          <div className="flex justify-between mb-4">
            <span className={`text-xl font-semibold ${isDark ? "text-light" : "text-gray-800"}`}>Total</span>
            <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
          </div>
          <div className="flex gap-4">
            <button onClick={() => nav("/products")} className={`flex-1 px-6 py-3 rounded ${isDark ? "bg-gray-700 hover:bg-gray-600 text-light" : "bg-gray-200 hover:bg-gray-300 text-gray-800"}`}>
              Continue Shopping
            </button>
            <button onClick={() => nav("/checkout")} className="flex-1 bg-primary hover:bg-accent text-white px-6 py-3 rounded">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
