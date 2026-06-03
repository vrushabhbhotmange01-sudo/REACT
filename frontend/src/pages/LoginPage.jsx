import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUsername } from "../features/userSlice";
import { useNavigate } from "react-router-dom";
import { themes } from "../themes";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const themeName = useSelector((state) => state.user.theme) || "light";
  const currentTheme = themes[themeName];

  useEffect(() => {
    document.title = "Sign In - Employee Hub";
  }, []);

  const validateForm = () => {
    if (!email) {
      setError("Email address is required.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!password) {
      setError("Password is required.");
      return false;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters.");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/login",
        {
          email,
          password
        }
      );

      dispatch(setUsername(response.data.username));
      navigate("/form");
    } catch (err) {
      setError(
        err.response?.data?.message || 
        "Authentication failed. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const themeStyles = {
    "--theme-bg": currentTheme.background,
    "--theme-text": currentTheme.text,
    "--theme-secondary-text": currentTheme.secondaryText,
    "--theme-button": currentTheme.button,
    "--theme-button-text": currentTheme.buttonText,
    "--theme-card-bg": currentTheme.cardBackground,
    "--theme-card-border": currentTheme.cardBorder,
    "--theme-input-bg": currentTheme.inputBackground,
    "--theme-input-border": currentTheme.inputBorder,
    "--theme-input-text": currentTheme.inputText,
    "--theme-shadow": currentTheme.shadow,
    "--theme-accent": currentTheme.accent,
    "--theme-accent-light": currentTheme.accentLight,
  };

  return (
    <div className="app-layout" style={themeStyles}>
      <div 
        className="bg-gradient-mesh" 
        style={{
          "--bg-fallback": currentTheme.background, 
          "--accent-light": currentTheme.accentLight
        }} 
      />
      <div className="login-container">
        <div className="login-card animate-slide-up">
          <div className="login-header">
            <div className="login-logo">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Sign in to manage your employee portal</p>
          </div>

          <form onSubmit={handleLogin} noValidate>
            {error && (
              <div 
                className="error-text animate-fade-in" 
                style={{ 
                  backgroundColor: "rgba(239, 68, 68, 0.08)", 
                  padding: "12px 16px", 
                  borderRadius: "10px", 
                  marginBottom: "20px",
                  lineHeight: "1.4"
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  placeholder="name@company.com"
                  value={email}
                  disabled={isLoading}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="password"
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  disabled={isLoading}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isLoading}
              style={{ marginTop: "8px" }}
            >
              {isLoading ? (
                <>
                  <div className="spinner" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;