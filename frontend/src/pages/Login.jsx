
import React, { useState } from "react";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from "firebase/auth";

import { auth, googleProvider } from "../firebase";
import { useNavigate } from "react-router-dom";

import {
  Landmark,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  LoaderCircle
} from "lucide-react";

import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  // EMAIL AND PASSWORD LOGIN / REGISTRATION
  const handleEmailLogin = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!email.trim() || !password) {
      setError("Please enter your email address and password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      if (isRegister) {
        await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );
      } else {
        await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );
      }

      navigate("/", { replace: true });

    } catch (err) {
      console.error("Email authentication error:", err);

      const errorMessages = {
        "auth/invalid-email": "Please enter a valid email address.",
        "auth/user-not-found": "No account found with this email.",
        "auth/wrong-password": "Incorrect password. Please try again.",
        "auth/invalid-credential": "Invalid email or password.",
        "auth/email-already-in-use": "This email is already registered.",
        "auth/weak-password": "Please choose a stronger password.",
        "auth/too-many-requests": "Too many attempts. Please try again later.",
        "auth/network-request-failed": "Network error. Check your internet connection.",
        "auth/operation-not-allowed": "Enable Email/Password sign-in in Firebase Authentication."
      };

      setError(
        errorMessages[err.code] ||
        err.message ||
        "Authentication failed. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  // GOOGLE LOGIN
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const result = await signInWithPopup(auth, googleProvider);

      console.log("Logged in user:", result.user.email);

      navigate("/", { replace: true });

    } catch (err) {
      console.error("Google login error:", err);

      setError(
        err.message || "Google login failed. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  // FORGOT PASSWORD
  const handleForgotPassword = async () => {
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email address first.");
      return;
    }

    try {
      setLoading(true);

      await sendPasswordResetEmail(auth, email.trim());

      setMessage("Password reset link sent. Please check your email.");

    } catch (err) {
      console.error("Password reset error:", err);

      const resetErrors = {
        "auth/invalid-email": "Please enter a valid email address.",
        "auth/user-not-found": "No account found with this email.",
        "auth/too-many-requests": "Too many attempts. Try again later."
      };

      setError(
        resetErrors[err.code] ||
        err.message ||
        "Unable to send password reset email."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* GREEN HEADER */}
      <header className="login-header">

        <div className="login-header-brand">
          <Landmark size={30} />
          <span>Bharat Sahayak AI</span>
        </div>

        <h1>Your Digital Citizen Assistant</h1>

        <p>
          One platform. Smarter access to government services.
        </p>

      </header>

      {/* LOGIN CONTENT */}
      <main className="login-content">

        <section className="login-card">

          {/* WELCOME */}
          <h2>
            {isRegister ? "Create Your Account!" : "Welcome Back!"}
          </h2>

          <p className="login-subtitle">
            {isRegister
              ? "Register to access your digital citizen assistant."
              : "Sign in to continue to your account."}
          </p>

          {/* EMAIL LOGIN FORM */}
          <form
            className="login-form"
            onSubmit={handleEmailLogin}
          >

            {/* EMAIL */}
            <div className="login-input-group">

              <label htmlFor="login-email">
                Email address
              </label>

              <div className="login-input-wrapper">
                <Mail size={20} />

                <input
                  id="login-email"
                  className="login-input"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

            </div>

            {/* PASSWORD */}
            <div className="login-input-group">

              <label htmlFor="login-password">
                Password
              </label>

              <div className="login-input-wrapper">
                <Lock size={20} />

                <input
                  id="login-password"
                  className="login-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={
                    isRegister ? "new-password" : "current-password"
                  }
                  required
                />

                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>

              </div>

            </div>

            {/* FORGOT PASSWORD */}
            {!isRegister && (
              <button
                type="button"
                className="login-forgot-password"
                onClick={handleForgotPassword}
                disabled={loading}
              >
                Forgot password?
              </button>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="login-submit-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoaderCircle className="login-spinner" size={20} />
                  Please wait...
                </>
              ) : (
                isRegister ? "Create Account" : "Sign In"
              )}
            </button>

          </form>

          {/* SWITCH LOGIN / REGISTER */}
          <div className="login-register-switch">
            {isRegister
              ? "Already have an account?"
              : "Don't have an account?"}

            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
                setMessage("");
                setPassword("");
              }}
              disabled={loading}
            >
              {isRegister ? "Sign In" : "Create Account"}
            </button>
          </div>

          {/* ERROR */}
          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

          {/* SUCCESS MESSAGE */}
          {message && (
            <div className="login-success" role="status">
              {message}
            </div>
          )}

          {/* DIVIDER */}
          <div className="login-divider"></div>

          {/* GOOGLE LOGIN */}
          <button
            type="button"
            className="google-login-button"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            {loading ? (
              <LoaderCircle className="login-spinner" size={20} />
            ) : (
              <>
                <span className="google-icon">G</span>
                Continue with Google
              </>
            )}
          </button>

          {/* SECURITY */}
          <p className="login-footer">
            <ShieldCheck
              size={16}
              style={{ verticalAlign: "middle", marginRight: "6px" }}
            />
            Secure authentication powered by Firebase
          </p>

        </section>

      </main>

    </div>
  );
}
