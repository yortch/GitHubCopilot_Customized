import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const partners = [
  "Whiskers Cafe",
  "PawTech Solutions",
  "Feline Innovations",
  "CatHealth AI",
  "PurrTech Labs",
  "WhiskerWare Systems",
  "MeowMetrics",
  "FelineFuture Co.",
];

const categories = [
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <path d="M24 4v6M24 38v6M4 24h6M38 24h6M8.93 8.93l4.24 4.24M34.83 34.83l4.24 4.24M39.07 8.93l-4.24 4.24M13.17 34.83l-4.24 4.24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="24" cy="24" r="8" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="24" cy="24" r="3" fill="currentColor" />
      </svg>
    ),
    title: "Smart Monitoring",
    desc: "AI-powered health tracking and behavior analysis that learns your cat's unique patterns and provides real-time wellness insights.",
    color: "from-primary/20 to-primary/5",
    accent: "text-primary",
    border: "border-primary/20 hover:border-primary/50",
    glow: "group-hover:shadow-[0_8px_40px_rgba(0,245,212,0.15)]",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <path d="M16 18l7 5-7 5V18z" fill="currentColor" />
        <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2.5" />
        <path d="M30 16c3 2 5 5 5 8s-2 6-5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Interactive Play",
    desc: "Adaptive entertainment systems that respond to your cat's mood, energy level, and play preferences for endless engagement.",
    color: "from-lavender/20 to-lavender/5",
    accent: "text-lavender",
    border: "border-lavender/20 hover:border-lavender/50",
    glow: "group-hover:shadow-[0_8px_40px_rgba(123,97,255,0.15)]",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <path d="M24 8c-8 0-14 6-14 14v10c0 2 2 4 4 4h20c2 0 4-2 4-4V22c0-8-6-14-14-14z" stroke="currentColor" strokeWidth="2.5" />
        <path d="M18 30c0-3 3-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="19" cy="22" r="2" fill="currentColor" />
        <circle cx="29" cy="22" r="2" fill="currentColor" />
        <path d="M10 14l-4-6M38 14l4-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Comfort & Wellness",
    desc: "Smart beds, precision feeders, and grooming tools designed with biometric sensors to maximize your feline's comfort.",
    color: "from-accent/20 to-accent/5",
    accent: "text-accent",
    border: "border-accent/20 hover:border-accent/50",
    glow: "group-hover:shadow-[0_8px_40px_rgba(255,107,107,0.15)]",
  },
];

export default function Welcome() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  return (
    <div className={`relative overflow-hidden ${darkMode ? "bg-dark" : "bg-light"} transition-colors duration-500`}>
      {/* ═══════ HERO ═══════ */}
      <section className="relative min-h-screen flex items-center">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-blob" />
          <div className="absolute top-1/2 -left-32 w-[500px] h-[500px] bg-lavender/10 rounded-full blur-[100px] animate-blob" style={{ animationDelay: "2s" }} />
          <div className="absolute -bottom-40 right-1/3 w-[400px] h-[400px] bg-accent/8 rounded-full blur-[100px] animate-blob" style={{ animationDelay: "4s" }} />
          {/* Grid pattern */}
          <div
            className={`absolute inset-0 ${darkMode ? "opacity-[0.03]" : "opacity-[0.04]"}`}
            style={{
              backgroundImage: `linear-gradient(${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"} 1px, transparent 1px), linear-gradient(90deg, ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"} 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="opacity-0 animate-fade-up">
                <span
                  className={`inline-flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-[0.2em] px-4 py-2 rounded-full border ${
                    darkMode
                      ? "text-primary border-primary/20 bg-primary/5"
                      : "text-mint-700 border-mint-200 bg-mint-50"
                  }`}
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                  Powered by Advanced AI
                </span>
              </div>

              {/* Headline */}
              <div className="opacity-0 animate-fade-up-delayed">
                <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight">
                  <span className={darkMode ? "text-white" : "text-gray-900"}>
                    Smart Cat Tech.
                  </span>
                  <br />
                  <span className="gradient-text">Purrsonalized.</span>
                </h1>
              </div>

              {/* Description */}
              <p
                className={`opacity-0 animate-fade-up-delayed-2 font-body text-lg leading-relaxed max-w-lg ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                OctoCAT Supply brings cutting-edge AI technology to enhance your
                cat's life. Our premium smart products learn from your feline
                friend's behavior to provide personalized experiences, health
                insights, and next-level entertainment.
              </p>

              {/* CTA Buttons */}
              <div className="opacity-0 animate-fade-up-delayed-3 flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/products")}
                  className="group relative font-display text-sm font-bold uppercase tracking-wider bg-primary text-dark px-8 py-4 rounded-xl btn-lift overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Explore Products
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-mint-300 to-primary bg-[length:200%_100%] opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-shift" />
                </button>

                <button
                  onClick={() => navigate("/about")}
                  className={`font-display text-sm font-bold uppercase tracking-wider px-8 py-4 rounded-xl border-2 btn-lift transition-all duration-300 ${
                    darkMode
                      ? "border-white/10 text-white hover:border-primary/50 hover:text-primary"
                      : "border-gray-200 text-gray-700 hover:border-primary/50 hover:text-primary"
                  }`}
                >
                  Our Story
                </button>
              </div>

              {/* Stats */}
              <div className="opacity-0 animate-fade-up-delayed-3 pt-4">
                <div
                  className={`grid grid-cols-3 gap-8 border-t pt-8 ${
                    darkMode ? "border-white/5" : "border-gray-200"
                  }`}
                >
                  {[
                    { value: "50K+", label: "Happy Cats" },
                    { value: "4.9", label: "Avg Rating" },
                    { value: "99%", label: "Purr Rate" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div className="font-display text-2xl sm:text-3xl font-bold text-primary">
                        {stat.value}
                      </div>
                      <div
                        className={`font-body text-xs uppercase tracking-widest mt-1 ${
                          darkMode ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Hero Image */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative">
                {/* Glow behind image */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-lavender/10 to-accent/10 rounded-3xl blur-[60px] scale-110" />
                {/* Image container */}
                <div
                  className={`relative rounded-3xl overflow-hidden border ${
                    darkMode ? "border-white/5" : "border-gray-200"
                  } animate-float`}
                >
                  <img
                    src="/hero.png"
                    alt="Smart Cat Products powered by AI"
                    className="w-full max-w-lg h-auto object-contain"
                  />
                  {/* Overlay gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${
                      darkMode
                        ? "from-dark/40 via-transparent"
                        : "from-light/30 via-transparent"
                    }`}
                  />
                </div>
                {/* Floating accent element */}
                <div className="absolute -bottom-6 -left-6 animate-float-delayed">
                  <div
                    className={`${
                      darkMode ? "glass" : "glass-light"
                    } rounded-2xl p-4 glow-primary`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <div
                          className={`font-display text-sm font-bold ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          AI-Powered
                        </div>
                        <div
                          className={`font-body text-xs ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Learns your cat's habits
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Top-right floating badge */}
                <div className="absolute -top-4 -right-4 animate-float-slow">
                  <div className="bg-accent text-white font-display text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full shadow-lg shadow-accent/30">
                    New 2.0
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ PARTNERS MARQUEE ═══════ */}
      <section
        className={`relative py-12 border-y ${
          darkMode ? "border-white/5" : "border-gray-200/60"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-8">
          <p
            className={`font-body text-xs uppercase tracking-[0.2em] ${
              darkMode ? "text-gray-600" : "text-gray-400"
            }`}
          >
            Trusted by innovators worldwide
          </p>
        </div>
        <div className="overflow-hidden">
          <div className="marquee-track">
            {[...partners, ...partners].map((name, i) => (
              <div
                key={i}
                className={`flex-shrink-0 px-12 font-display text-xl font-bold tracking-tight ${
                  darkMode
                    ? "text-gray-700 hover:text-primary"
                    : "text-gray-300 hover:text-primary"
                } transition-colors duration-300 cursor-default select-none`}
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CATEGORIES ═══════ */}
      <section className="relative py-24 lg:py-32">
        {/* Background pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section header */}
          <div className="max-w-2xl mb-16">
            <p
              className={`font-body text-xs uppercase tracking-[0.2em] mb-4 ${
                darkMode ? "text-primary" : "text-mint-600"
              }`}
            >
              What We Offer
            </p>
            <h2
              className={`font-display text-4xl sm:text-5xl font-extrabold tracking-tight ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Smart Solutions for{" "}
              <span className="gradient-text">Modern Cats</span>
            </h2>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-6 stagger-children">
            {categories.map((cat) => (
              <div
                key={cat.title}
                className={`group relative rounded-2xl border p-8 transition-all duration-500 card-hover ${
                  darkMode
                    ? `bg-gray-900/50 ${cat.border} ${cat.glow}`
                    : `bg-white ${cat.border} ${cat.glow}`
                }`}
              >
                {/* Gradient corner */}
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${cat.color} rounded-bl-[100px] rounded-tr-2xl opacity-60`}
                />

                <div className="relative z-10">
                  <div className={`${cat.accent} mb-6`}>{cat.icon}</div>
                  <h3
                    className={`font-display text-xl font-bold mb-3 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {cat.title}
                  </h3>
                  <p
                    className={`font-body text-sm leading-relaxed ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {cat.desc}
                  </p>
                </div>

                {/* Arrow indicator */}
                <div
                  className={`mt-8 flex items-center gap-2 font-body text-sm font-medium ${cat.accent} opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300`}
                >
                  Learn more
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA BANNER ═══════ */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div
            className={`relative rounded-3xl overflow-hidden p-12 sm:p-16 ${
              darkMode ? "bg-gray-900/80" : "bg-gray-50"
            }`}
          >
            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-lavender/10 rounded-full blur-[60px]" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
              <div className="flex-1">
                <h2
                  className={`font-display text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Ready to upgrade your cat's life?
                </h2>
                <p
                  className={`font-body text-lg max-w-lg ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Join 50,000+ cat owners who have transformed their feline
                  companion's daily experience with our AI-powered products.
                </p>
              </div>
              <button
                onClick={() => navigate("/products")}
                className="group flex-shrink-0 font-display text-sm font-bold uppercase tracking-wider bg-primary text-dark px-10 py-5 rounded-xl btn-lift relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Shop Now
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-mint-300 to-primary bg-[length:200%_100%] opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-shift" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}