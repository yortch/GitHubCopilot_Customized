import { useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { api } from "../../../api/config";
import { useTheme } from "../../../context/ThemeContext";

interface Product {
  productId: number;
  name: string;
  description: string;
  price: number;
  imgName: string;
  sku: string;
  unit: string;
  supplierId: number;
  discount?: number;
}

const fetchProducts = async (): Promise<Product[]> => {
  const { data } = await axios.get(`${api.baseURL}${api.endpoints.products}`);
  return data;
};

export default function Products() {
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { data: products, isLoading, error } = useQuery("products", fetchProducts);
  const { darkMode } = useTheme();

  const filteredProducts = products?.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleQuantityChange = (productId: number, change: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) + change),
    }));
  };

  const handleAddToCart = (productId: number) => {
    const quantity = quantities[productId] || 0;
    if (quantity > 0) {
      alert(`Added ${quantity} items to cart`);
      setQuantities((prev) => ({ ...prev, [productId]: 0 }));
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen ${darkMode ? "bg-dark" : "bg-light"} pt-28 px-6 transition-colors duration-500`}>
        <div className="max-w-7xl mx-auto flex justify-center items-center h-64">
          <div className="relative">
            <div className="w-16 h-16 border-2 border-primary/30 rounded-full animate-spin" />
            <div className="absolute inset-0 w-16 h-16 border-t-2 border-primary rounded-full animate-spin" style={{ animationDuration: "0.8s" }} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${darkMode ? "bg-dark" : "bg-light"} pt-28 px-6 transition-colors duration-500`}>
        <div className="max-w-7xl mx-auto">
          <div className={`text-center py-12 rounded-2xl border ${darkMode ? "border-coral-400/20 bg-coral-900/10" : "border-coral-200 bg-coral-50"}`}>
            <p className="text-accent font-display text-lg font-bold">Failed to fetch products</p>
            <p className={`font-body text-sm mt-2 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Please try again later</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-dark" : "bg-light"} pt-28 pb-20 transition-colors duration-500`}>
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 -left-40 w-[400px] h-[400px] bg-lavender/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <p className={`font-body text-xs uppercase tracking-[0.2em] mb-3 ${darkMode ? "text-primary" : "text-mint-600"}`}>
            Our Collection
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <h1 className={`font-display text-4xl sm:text-5xl font-extrabold tracking-tight ${darkMode ? "text-white" : "text-gray-900"}`}>
              Products
            </h1>

            {/* Search */}
            <div className="relative max-w-md w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full px-5 py-3 pl-12 font-body text-sm rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                  darkMode
                    ? "bg-gray-900/50 text-white border-white/10 placeholder-gray-600 focus:border-primary/50"
                    : "bg-white text-gray-900 border-gray-200 placeholder-gray-400 focus:border-primary/50"
                }`}
                aria-label="Search products"
              />
              <svg
                className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? "text-gray-600" : "text-gray-400"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
          {filteredProducts?.map((product) => (
            <div
              key={product.productId}
              className={`group relative rounded-2xl overflow-hidden border transition-all duration-500 card-hover flex flex-col ${
                darkMode
                  ? "bg-gray-900/60 border-white/5 hover:border-primary/30 hover:shadow-[0_8px_40px_rgba(0,245,212,0.1)]"
                  : "bg-white border-gray-200 hover:border-primary/30 hover:shadow-[0_8px_40px_rgba(0,245,212,0.08)]"
              }`}
            >
              {/* Image */}
              <div
                className={`relative h-56 overflow-hidden cursor-pointer ${
                  darkMode
                    ? "bg-gradient-to-b from-gray-800/50 to-gray-900/50"
                    : "bg-gradient-to-b from-gray-50 to-white"
                }`}
                onClick={() => handleProductClick(product)}
              >
                <img
                  src={`/${product.imgName}`}
                  alt={product.name}
                  className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {product.discount && (
                  <div className="absolute top-4 left-4">
                    <span className="font-display text-[10px] font-bold uppercase tracking-wider bg-accent text-white px-3 py-1.5 rounded-lg shadow-lg shadow-accent/30">
                      {Math.round(product.discount * 100)}% Off
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-grow">
                <h3
                  className={`font-display text-lg font-bold mb-2 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {product.name}
                </h3>
                <p
                  className={`font-body text-sm leading-relaxed mb-4 flex-grow ${
                    darkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  {product.description}
                </p>

                {/* Price */}
                <div className="mb-4">
                  {product.discount ? (
                    <div className="flex items-baseline gap-2">
                      <span className={`font-body text-sm line-through ${darkMode ? "text-gray-600" : "text-gray-300"}`}>
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="font-display text-2xl font-bold text-primary">
                        ${(product.price * (1 - product.discount)).toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <span className="font-display text-2xl font-bold text-primary">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Quantity + Add to Cart */}
                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center rounded-xl border ${
                      darkMode ? "border-white/10 bg-gray-800/50" : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <button
                      onClick={() => handleQuantityChange(product.productId, -1)}
                      className={`w-9 h-9 flex items-center justify-center font-body text-lg transition-colors ${
                        darkMode ? "text-gray-400 hover:text-primary" : "text-gray-500 hover:text-primary"
                      }`}
                      aria-label={`Decrease quantity of ${product.name}`}
                      id={`decrease-qty-${product.productId}`}
                    >
                      -
                    </button>
                    <span
                      className={`w-8 text-center font-display text-sm font-bold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                      aria-label={`Quantity of ${product.name}`}
                      id={`qty-${product.productId}`}
                    >
                      {quantities[product.productId] || 0}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(product.productId, 1)}
                      className={`w-9 h-9 flex items-center justify-center font-body text-lg transition-colors ${
                        darkMode ? "text-gray-400 hover:text-primary" : "text-gray-500 hover:text-primary"
                      }`}
                      aria-label={`Increase quantity of ${product.name}`}
                      id={`increase-qty-${product.productId}`}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product.productId)}
                    className={`flex-1 py-2.5 rounded-xl font-display text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                      quantities[product.productId]
                        ? "bg-primary text-dark hover:shadow-lg hover:shadow-primary/30 btn-lift"
                        : darkMode
                        ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                        : "bg-gray-100 text-gray-300 cursor-not-allowed"
                    }`}
                    disabled={!quantities[product.productId]}
                    aria-label={`Add ${quantities[product.productId] || 0} ${product.name} to cart`}
                    id={`add-to-cart-${product.productId}`}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ Product Modal ═══ */}
      {showModal && selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          {/* Backdrop */}
          <div className={`absolute inset-0 ${darkMode ? "bg-dark/80" : "bg-gray-900/40"} backdrop-blur-sm`} />

          {/* Modal */}
          <div
            className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border shadow-2xl ${
              darkMode
                ? "bg-gray-900 border-white/10 shadow-primary/5"
                : "bg-white border-gray-200"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setShowModal(false)}
              className={`absolute top-5 right-5 z-10 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                darkMode
                  ? "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image */}
            <div
              className={`p-8 ${
                darkMode
                  ? "bg-gradient-to-b from-gray-800/50 to-gray-900/50"
                  : "bg-gradient-to-b from-gray-50 to-white"
              }`}
            >
              <img
                src={`/${selectedProduct.imgName}`}
                alt={selectedProduct.name}
                className="w-full h-auto object-contain max-h-[400px]"
              />
            </div>

            {/* Content */}
            <div className="p-8">
              <h2 className={`font-display text-3xl font-extrabold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                {selectedProduct.name}
              </h2>
              <p className={`font-body text-base leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                {selectedProduct.description}
              </p>
              <div className="mt-6 flex items-baseline gap-3">
                {selectedProduct.discount ? (
                  <>
                    <span className={`font-body text-lg line-through ${darkMode ? "text-gray-600" : "text-gray-300"}`}>
                      ${selectedProduct.price.toFixed(2)}
                    </span>
                    <span className="font-display text-3xl font-bold text-primary">
                      ${(selectedProduct.price * (1 - selectedProduct.discount)).toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="font-display text-3xl font-bold text-primary">
                    ${selectedProduct.price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}