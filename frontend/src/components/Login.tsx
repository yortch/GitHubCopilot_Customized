import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const { darkMode } = useTheme();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const errorMsg = searchParams.get("error");
    if (errorMsg) {
      setError(errorMsg);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className={`min-h-screen pt-24 ${darkMode ? "bg-dark" : "bg-light"} flex items-center justify-center px-4 transition-colors duration-300 relative overflow-hidden`}>
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl ${darkMode ? "bg-primary/10" : "bg-primary/5"} animate-blob`} />
        <div className={`absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl ${darkMode ? "bg-lavender/10" : "bg-lavender/5"} animate-blob`} style={{ animationDelay: "2s" }} />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl ${darkMode ? "bg-accent/5" : "bg-accent/3"} animate-blob`} style={{ animationDelay: "4s" }} />
      </div>

      <div className="relative z-10 max-w-md w-full animate-fade-up">
        {/* Card */}
        <div className={`${darkMode ? "glass" : "glass-light"} rounded-3xl p-8 md:p-10 border ${darkMode ? "border-white/10" : "border-gray-200"}`}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
              </svg>
            </div>
            <h2 className={`font-display text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"} mb-2`}>Welcome back</h2>
            <p className={`font-body ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Sign in to your OctoCAT Supply account</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-accent/10 border border-accent/30 text-accent rounded-xl p-3 mb-6 text-sm font-body"
              dangerouslySetInnerHTML={{ __html: error }}
            />
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className={`block font-body text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"} mb-2`}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full font-body rounded-xl px-4 py-3 transition-all duration-300 outline-none
                  ${darkMode
                    ? "bg-white/5 text-white border border-white/10 focus:border-primary/50 focus:bg-white/10"
                    : "bg-gray-50 text-gray-900 border border-gray-200 focus:border-primary/50 focus:bg-white"}
                  focus:ring-2 focus:ring-primary/20`}
                placeholder="you@example.com"
                required
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="password" className={`block font-body text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"} mb-2`}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full font-body rounded-xl px-4 py-3 transition-all duration-300 outline-none
                  ${darkMode
                    ? "bg-white/5 text-white border border-white/10 focus:border-primary/50 focus:bg-white/10"
                    : "bg-gray-50 text-gray-900 border border-gray-200 focus:border-primary/50 focus:bg-white"}
                  focus:ring-2 focus:ring-primary/20`}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full font-display font-semibold text-sm uppercase tracking-wider bg-primary hover:bg-primary/90 text-dark py-3.5 px-6 rounded-xl transition-all duration-300 btn-lift glow-primary"
            >
              Sign In
            </button>
          </form>

          {/* Footer link */}
          <p className={`mt-6 text-center text-sm font-body ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
            Don&apos;t have an account?{" "}
            <span className="text-primary hover:text-primary/80 cursor-pointer transition-colors">Sign up</span>
          </p>
        </div>
      </div>
    </div>
  );
}