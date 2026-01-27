import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

type LoginMode = 'login' | 'register' | 'reset-request' | 'reset-password';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [mode, setMode] = useState<LoginMode>('login');
  const navigate = useNavigate();
  const { login, register, requestPasswordReset, resetPassword } = useAuth();
  const { darkMode } = useTheme();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const errorMsg = searchParams.get('error');
    if (errorMsg) {
      setError(errorMsg);
    }
    
    // Check if we have a reset token in the URL
    const token = searchParams.get('resetToken');
    if (token) {
      setMode('reset-password');
      setResetToken(token);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      switch (mode) {
        case 'login':
          await login(email, password);
          navigate('/');
          break;
          
        case 'register':
          if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
          }
          if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
          }
          await register(email, password);
          navigate('/');
          break;
          
        case 'reset-request':
          await requestPasswordReset(email);
          setSuccess('If the email exists, a reset link has been sent. Check your email.');
          break;
          
        case 'reset-password':
          if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
          }
          if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
          }
          await resetPassword(resetToken, password);
          setSuccess('Password reset successful! You can now login with your new password.');
          setMode('login');
          setPassword('');
          setConfirmPassword('');
          break;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed. Please try again.');
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Login';
      case 'register': return 'Create Account';
      case 'reset-request': return 'Reset Password';
      case 'reset-password': return 'Set New Password';
    }
  };

  const getButtonText = () => {
    switch (mode) {
      case 'login': return 'Login';
      case 'register': return 'Register';
      case 'reset-request': return 'Send Reset Link';
      case 'reset-password': return 'Reset Password';
    }
  };

  return (
    <div className={`min-h-screen pt-20 ${darkMode ? 'bg-dark' : 'bg-gray-100'} flex items-center justify-center px-4 transition-colors duration-300`}>
      <div className={`max-w-md w-full ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8 transition-colors duration-300`}>
        <h2 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-6 transition-colors duration-300`}>
          {getTitle()}
        </h2>
        
        {error && (
          <div 
            className="bg-red-500/10 border border-red-500 text-red-500 rounded-md p-3 mb-4"
          >
            {error}
          </div>
        )}

        {success && (
          <div 
            className="bg-green-500/10 border border-green-500 text-green-500 rounded-md p-3 mb-4"
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode !== 'reset-password' && (
            <div>
              <label htmlFor="email" className={`block ${darkMode ? 'text-light' : 'text-gray-700'} mb-2 transition-colors duration-300`}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full ${darkMode ? 'bg-gray-700 text-light' : 'bg-gray-100 text-gray-800'} rounded px-3 py-2 transition-colors duration-300`}
                required
                autoFocus
              />
            </div>
          )}

          {(mode === 'login' || mode === 'register' || mode === 'reset-password') && (
            <>
              <div>
                <label htmlFor="password" className={`block ${darkMode ? 'text-light' : 'text-gray-700'} mb-2 transition-colors duration-300`}>
                  {mode === 'reset-password' ? 'New Password' : 'Password'}
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full ${darkMode ? 'bg-gray-700 text-light' : 'bg-gray-100 text-gray-800'} rounded px-3 py-2 transition-colors duration-300`}
                  required
                  minLength={mode !== 'login' ? 8 : undefined}
                />
              </div>

              {(mode === 'register' || mode === 'reset-password') && (
                <div>
                  <label htmlFor="confirmPassword" className={`block ${darkMode ? 'text-light' : 'text-gray-700'} mb-2 transition-colors duration-300`}>
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full ${darkMode ? 'bg-gray-700 text-light' : 'bg-gray-100 text-gray-800'} rounded px-3 py-2 transition-colors duration-300`}
                    required
                    minLength={8}
                  />
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            className="w-full bg-primary hover:bg-accent text-white py-2 px-4 rounded transition-colors"
          >
            {getButtonText()}
          </button>
        </form>

        <div className={`mt-6 text-center space-y-2 ${darkMode ? 'text-light' : 'text-gray-600'}`}>
          {mode === 'login' && (
            <>
              <button
                onClick={() => setMode('register')}
                className="block w-full text-primary hover:text-accent transition-colors"
              >
                Don't have an account? Register
              </button>
              <button
                onClick={() => setMode('reset-request')}
                className="block w-full text-primary hover:text-accent transition-colors"
              >
                Forgot your password?
              </button>
            </>
          )}
          
          {(mode === 'register' || mode === 'reset-request') && (
            <button
              onClick={() => {
                setMode('login');
                setError('');
                setSuccess('');
              }}
              className="block w-full text-primary hover:text-accent transition-colors"
            >
              Back to Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}