import React from "react";
import { useTheme } from "../context/ThemeContext";

const footerLinks = {
  account: [
    { label: "My Cart", href: "#" },
    { label: "Checkout", href: "#" },
    { label: "Order History", href: "#" },
    { label: "Help Center", href: "#" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Products", href: "/products" },
    { label: "Careers", href: "#" },
    { label: "Press Kit", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Settings", href: "#" },
  ],
};

const Footer: React.FC = () => {
  const { darkMode } = useTheme();

  return (
    <footer
      className={`relative overflow-hidden ${
        darkMode ? "bg-gray-950" : "bg-gray-50"
      } transition-colors duration-500`}
    >
      {/* Top gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-2 mb-6">
              <span className="font-display text-xl font-bold tracking-tight">
                <span className={darkMode ? "text-white" : "text-gray-900"}>
                  OctoCAT
                </span>
                <span className="text-primary ml-1">Supply</span>
              </span>
            </div>
            <p
              className={`font-body text-sm leading-relaxed max-w-sm mb-6 ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`}
            >
              The leading provider of AI-powered smart products for your feline
              companions. Enhancing your cat's wellbeing through intelligent
              technology.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              {["X", "GH", "LI", "IG"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-display text-xs font-bold transition-all duration-300 ${
                    darkMode
                      ? "bg-white/5 text-gray-500 hover:bg-primary/10 hover:text-primary"
                      : "bg-gray-200 text-gray-400 hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="md:col-span-2">
              <h3
                className={`font-display text-xs font-bold uppercase tracking-[0.15em] mb-5 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className={`font-body text-sm transition-colors duration-200 ${
                        darkMode
                          ? "text-gray-600 hover:text-primary"
                          : "text-gray-400 hover:text-primary"
                      }`}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="md:col-span-2">
            <h3
              className={`font-display text-xs font-bold uppercase tracking-[0.15em] mb-5 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Stay Updated
            </h3>
            <p
              className={`font-body text-sm mb-4 ${
                darkMode ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Get the latest on new products & AI cat tech.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email"
                className={`flex-1 min-w-0 px-3 py-2 font-body text-sm rounded-lg border transition-colors focus:outline-none focus:ring-1 focus:ring-primary/30 ${
                  darkMode
                    ? "bg-white/5 border-white/10 text-white placeholder-gray-600"
                    : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"
                }`}
              />
              <button className="bg-primary text-dark font-display text-xs font-bold px-3 py-2 rounded-lg btn-lift flex-shrink-0">
                Go
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          className={`mt-14 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${
            darkMode ? "border-white/5" : "border-gray-200"
          }`}
        >
          <p
            className={`font-body text-xs ${
              darkMode ? "text-gray-700" : "text-gray-300"
            }`}
          >
            &copy; 2026 OctoCAT Supply. All Rights Reserved.
          </p>
          <p
            className={`font-body text-xs ${
              darkMode ? "text-gray-700" : "text-gray-300"
            }`}
          >
            Built with{" "}
            <span className="text-primary">&hearts;</span> for cats everywhere
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;