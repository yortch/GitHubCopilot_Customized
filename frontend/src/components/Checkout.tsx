import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";

// NOTE: This is a demo checkout form. In production, NEVER handle raw payment card data on the frontend.
// Use a PCI-DSS compliant payment gateway (Stripe, PayPal, etc.) with proper tokenization.
interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { darkMode } = useTheme();

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: ""
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleInputChange = (fieldName: keyof CheckoutFormData, value: string) => {
    setFormData(prevData => ({
      ...prevData,
      [fieldName]: value
    }));
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    setShowSuccessModal(true);
    
    setTimeout(() => {
      clearCart();
      setShowSuccessModal(false);
      navigate("/products");
    }, 3000);
  };

  const calculatePricing = () => {
    const subtotalAmount = getTotalPrice();
    const taxAmount = subtotalAmount * 0.08;
    const shippingAmount = 0;
    const totalAmount = subtotalAmount + taxAmount + shippingAmount;
    
    return { subtotalAmount, taxAmount, shippingAmount, totalAmount };
  };

  const pricing = calculatePricing();

  const inputBaseClasses = `w-full px-4 py-2 ${
    darkMode ? "bg-gray-800 text-light border-gray-700" : "bg-white text-gray-800 border-gray-300"
  } rounded-lg border focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors duration-300`;

  const labelClasses = `block ${darkMode ? "text-light" : "text-gray-800"} font-medium mb-2 transition-colors duration-300`;

  return (
    <div className={`min-h-screen ${darkMode ? "bg-dark" : "bg-gray-100"} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-3xl font-bold ${darkMode ? "text-light" : "text-gray-800"} mb-6 transition-colors duration-300`}>Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <form onSubmit={handleFormSubmit} className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg p-6 shadow-lg transition-colors duration-300`}>
              <h2 className={`text-2xl font-semibold ${darkMode ? "text-light" : "text-gray-800"} mb-6 transition-colors duration-300`}>Billing Information</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fullName" className={labelClasses}>Full Name</label>
                    <input
                      type="text"
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className={inputBaseClasses}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className={labelClasses}>Email</label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={inputBaseClasses}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className={labelClasses}>Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={inputBaseClasses}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="address" className={labelClasses}>Address</label>
                  <input
                    type="text"
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className={inputBaseClasses}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className={labelClasses}>City</label>
                    <input
                      type="text"
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className={inputBaseClasses}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className={labelClasses}>State</label>
                    <input
                      type="text"
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      className={inputBaseClasses}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="zipCode" className={labelClasses}>Zip Code</label>
                    <input
                      type="text"
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange("zipCode", e.target.value)}
                      className={inputBaseClasses}
                      required
                    />
                  </div>
                </div>

                <hr className={`${darkMode ? "border-gray-700" : "border-gray-200"} my-6 transition-colors duration-300`} />

                <h2 className={`text-2xl font-semibold ${darkMode ? "text-light" : "text-gray-800"} mb-6 transition-colors duration-300`}>Payment Information</h2>

                <div>
                  <label htmlFor="cardNumber" className={labelClasses}>Card Number</label>
                  <input
                    type="text"
                    id="cardNumber"
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                    className={inputBaseClasses}
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiryDate" className={labelClasses}>Expiry Date</label>
                    <input
                      type="text"
                      id="expiryDate"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                      className={inputBaseClasses}
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="cvv" className={labelClasses}>CVV</label>
                    <input
                      type="text"
                      id="cvv"
                      value={formData.cvv}
                      onChange={(e) => handleInputChange("cvv", e.target.value)}
                      className={inputBaseClasses}
                      placeholder="123"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg font-medium transition-colors mt-6"
                >
                  Place Order
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg p-6 shadow-lg transition-colors duration-300 sticky top-24`}>
              <h2 className={`text-2xl font-semibold ${darkMode ? "text-light" : "text-gray-800"} mb-6 transition-colors duration-300`}>Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="max-h-64 overflow-y-auto space-y-3">
                  {cartItems.map((item) => {
                    const effectivePrice = item.discount ? item.price * (1 - item.discount) : item.price;
                    return (
                      <div key={item.productId} className="flex items-center gap-3">
                        <div className={`w-16 h-16 ${darkMode ? "bg-gradient-to-t from-gray-700 to-gray-800" : "bg-gradient-to-t from-gray-100 to-white"} rounded flex items-center justify-center transition-colors duration-300`}>
                          <img src={`/${item.imgName}`} alt={item.name} className="w-full h-full object-contain p-1" />
                        </div>
                        <div className="flex-grow">
                          <h4 className={`text-sm font-medium ${darkMode ? "text-light" : "text-gray-800"} transition-colors duration-300`}>{item.name}</h4>
                          <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"} transition-colors duration-300`}>Qty: {item.quantity}</p>
                        </div>
                        <span className="text-primary font-bold">${(effectivePrice * item.quantity).toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>

                <hr className={`${darkMode ? "border-gray-700" : "border-gray-200"} transition-colors duration-300`} />

                <div className="flex justify-between">
                  <span className={`${darkMode ? "text-gray-400" : "text-gray-600"} transition-colors duration-300`}>Subtotal</span>
                  <span className={`${darkMode ? "text-light" : "text-gray-800"} font-medium transition-colors duration-300`}>${pricing.subtotalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className={`${darkMode ? "text-gray-400" : "text-gray-600"} transition-colors duration-300`}>Shipping</span>
                  <span className="text-primary font-medium">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span className={`${darkMode ? "text-gray-400" : "text-gray-600"} transition-colors duration-300`}>Tax (8%)</span>
                  <span className={`${darkMode ? "text-light" : "text-gray-800"} font-medium transition-colors duration-300`}>${pricing.taxAmount.toFixed(2)}</span>
                </div>
                <div className={`border-t ${darkMode ? "border-gray-700" : "border-gray-200"} pt-4 transition-colors duration-300`}>
                  <div className="flex justify-between">
                    <span className={`text-xl font-semibold ${darkMode ? "text-light" : "text-gray-800"} transition-colors duration-300`}>Total</span>
                    <span className="text-xl font-bold text-primary">${pricing.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg p-8 max-w-md w-full text-center shadow-xl transition-colors duration-300`}>
            <div className="flex justify-center mb-4">
              <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className={`text-2xl font-bold ${darkMode ? "text-light" : "text-gray-800"} mb-2 transition-colors duration-300`}>Order Placed Successfully!</h2>
            <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} mb-4 transition-colors duration-300`}>Thank you for your purchase. Redirecting to products...</p>
          </div>
        </div>
      )}
    </div>
  );
}
