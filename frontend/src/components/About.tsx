import { useTheme } from "../context/ThemeContext";

const values = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "AI-Powered Intelligence",
    desc: "Behavior analysis, personalization, and predictive health insights that learn and evolve with your cat.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Real-Time Health Monitoring",
    desc: "Continuous wellness tracking and smart alerts that keep you connected to your cat's health 24/7.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Multi-Cat Compatible",
    desc: "Intelligent systems that recognize and personalize experiences for every feline in your household.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Smartphone Integration",
    desc: "Detailed analytics, remote control, and real-time notifications right from your phone.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Eco-Friendly Design",
    desc: "Sustainable materials and energy-efficient technology that's better for your home and the planet.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Modern Aesthetics",
    desc: "Sleek, contemporary designs that complement any home interior while delighting your cat.",
  },
];

const About = () => {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen ${darkMode ? "bg-dark" : "bg-light"} pt-28 pb-20 transition-colors duration-500`}>
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-lavender/5 rounded-full blur-[140px]" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <p className={`font-body text-xs uppercase tracking-[0.2em] mb-4 ${darkMode ? "text-primary" : "text-mint-600"}`}>
            Our Story
          </p>
          <h1 className={`font-display text-5xl sm:text-6xl font-extrabold tracking-tight mb-8 ${darkMode ? "text-white" : "text-gray-900"}`}>
            About <span className="gradient-text">OctoCAT Supply</span>
          </h1>
          <p className={`font-body text-lg leading-relaxed max-w-3xl ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Welcome to OctoCAT Supply, your premier destination for AI-powered smart products
            designed specifically for your feline companions. Our cutting-edge cat tech innovations
            bring together the latest in artificial intelligence, sensor technology, and
            pet-friendly design to enhance the bond between you and your cat.
          </p>
        </div>

        {/* Mission & Purpose */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <div className={`rounded-2xl border p-8 transition-all duration-500 ${
            darkMode
              ? "bg-gray-900/50 border-primary/10 hover:border-primary/30"
              : "bg-white border-gray-200 hover:border-primary/30"
          }`}>
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className={`font-display text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
              Our Meow-ssion
            </h2>
            <p className={`font-body leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              To revolutionize the way cats and humans interact through thoughtfully designed,
              AI-enhanced products that improve feline happiness, health monitoring, and
              enrichment while delighting their human companions with valuable insights.
            </p>
          </div>

          <div className={`rounded-2xl border p-8 transition-all duration-500 ${
            darkMode
              ? "bg-gray-900/50 border-lavender/10 hover:border-lavender/30"
              : "bg-white border-gray-200 hover:border-lavender/30"
          }`}>
            <div className="w-12 h-12 bg-lavender/10 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-lavender" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className={`font-display text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
              Our Purr-pose
            </h2>
            <p className={`font-body leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              At OctoCAT Supply, we believe that cats deserve the same technological innovations
              that humans enjoy. Our team of feline behavior specialists, engineers, and AI experts
              work together to create products that understand, respond to, and improve your cat's
              daily life.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <p className={`font-body text-xs uppercase tracking-[0.2em] mb-4 ${darkMode ? "text-accent" : "text-coral-500"}`}>
            What Sets Us Apart
          </p>
          <h2 className={`font-display text-3xl sm:text-4xl font-extrabold tracking-tight mb-12 ${darkMode ? "text-white" : "text-gray-900"}`}>
            Key Features
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {values.map((v) => (
              <div
                key={v.title}
                className={`group rounded-2xl border p-6 transition-all duration-500 card-hover ${
                  darkMode
                    ? "bg-gray-900/30 border-white/5 hover:border-primary/20 hover:shadow-[0_4px_30px_rgba(0,245,212,0.06)]"
                    : "bg-white border-gray-200 hover:border-primary/30 hover:shadow-lg"
                }`}
              >
                <div className="text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                  {v.icon}
                </div>
                <h3 className={`font-display text-base font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                  {v.title}
                </h3>
                <p className={`font-body text-sm leading-relaxed ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quote */}
        <div className={`relative rounded-3xl overflow-hidden p-10 sm:p-14 ${
          darkMode ? "bg-gray-900/60" : "bg-gray-50"
        }`}>
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-[60px]" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/10 rounded-full blur-[50px]" />
          <div className="relative z-10">
            <svg className={`w-10 h-10 mb-6 ${darkMode ? "text-primary/30" : "text-primary/20"}`} fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151C7.563 6.068 6 8.789 6 11h4v10H0z" />
            </svg>
            <p className={`font-display text-xl sm:text-2xl font-bold leading-relaxed mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>
              Our cats tested every product in our catalog extensively. Only the ones they
              couldn't stop using made it to production.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-lavender rounded-full flex items-center justify-center text-white font-display text-sm font-bold">
                FW
              </div>
              <div>
                <div className={`font-display text-sm font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Felix Whiskerton
                </div>
                <div className={`font-body text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                  Founder & Chief Cat Officer
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;