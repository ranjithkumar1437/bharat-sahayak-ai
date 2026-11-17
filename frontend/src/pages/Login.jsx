
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";

import {
  ShieldCheck,
  Search,
  ArrowRight,
  LoaderCircle,
  CheckCircle2,
} from "lucide-react";

import { auth, googleProvider } from "../firebase";
import loginBg from "../assets/login-bg.png";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Firebase Google Authentication
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await signInWithPopup(
        auth,
        googleProvider
      );

      if (result.user) {
        navigate("/");
      }
    } catch (err) {
      console.error("Google Login Error:", err);

      if (err.code === "auth/popup-closed-by-user") {
        setError("Login popup was closed. Please try again.");
      } else if (err.code === "auth/unauthorized-domain") {
        setError(
          "This website domain is not authorized in Firebase."
        );
      } else if (err.code === "auth/popup-blocked") {
        setError(
          "Your browser blocked the login popup. Please allow popups."
        );
      } else if (err.code === "auth/network-request-failed") {
        setError(
          "Network error. Please check your internet connection."
        );
      } else {
        setError(
          err.message || "Unable to sign in. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">

      {/* =================================
          LEFT: INDIAN PARLIAMENT PHOTO
      ================================== */}

      <section
        className="login-visual"
        style={{
          backgroundImage: `url(${loginBg})`,
        }}
      >
        <div className="visual-overlay" />

        {/* BRAND */}
        <header className="visual-brand">
          <div className="visual-brand-icon">
            <ShieldCheck size={28} />
          </div>

          <div className="visual-brand-text">
            <h2>Bharat Sahayak AI</h2>
            <p>AI Citizen Assistant</p>
          </div>
        </header>

        {/* SMALL PHOTO CAPTION */}
        <div className="photo-caption">
          <div className="photo-caption-icon">
            <CheckCircle2 size={19} />
          </div>

          <div>
            <strong>
              Government benefits for everyone.
            </strong>

            <p>
              Empowering citizens through digital access.
            </p>
          </div>
        </div>

      </section>

      {/* =================================
          RIGHT: LOGIN PANEL
      ================================== */}

      <section className="login-panel">

        {/* TOP HEADER */}
        <div className="login-top">

          <div className="login-mobile-brand">
            <ShieldCheck size={23} />
            <span>Bharat Sahayak AI</span>
          </div>

          <span className="secure-label">
            <ShieldCheck size={16} />
            Secure Login
          </span>

        </div>

        {/* LOGIN CARD */}
        <div className="login-card">

          {/* LOGO */}
          <div className="login-logo">
            <ShieldCheck size={37} />
          </div>

          {/* HEADING */}
          <div className="login-heading">

            <span className="login-welcome">
              WELCOME TO
            </span>

            <h2>Bharat Sahayak AI</h2>

            <p>
              Your AI-powered Government Scheme Assistant
            </p>

          </div>

          {/* FEATURES */}
          <div className="login-features">

            <div className="login-feature-item">
              <Search size={17} />
              <span>Discover</span>
            </div>

            <span className="feature-dot">•</span>

            <div className="login-feature-item">
              <CheckCircle2 size={17} />
              <span>Check Eligibility</span>
            </div>

            <span className="feature-dot">•</span>

            <div className="login-feature-item">
              <ArrowRight size={17} />
              <span>Get Guidance</span>
            </div>

          </div>

          {/* DIVIDER */}
          <div className="login-divider">
            <span>Sign in to continue</span>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

          {/* GOOGLE LOGIN BUTTON */}
          <button
            type="button"
            className="google-login-button"
            onClick={handleGoogleLogin}
            disabled={loading}
          >

            {loading ? (
              <LoaderCircle
                className="login-spinner"
                size={22}
              />
            ) : (
              <span className="google-symbol">G</span>
            )}

            <span>
              {loading
                ? "Signing in..."
                : "Continue with Google"}
            </span>

            {!loading && (
              <ArrowRight size={20} />
            )}

          </button>

          {/* SECURITY MESSAGE */}
          <div className="login-security">
            <ShieldCheck size={17} />

            <span>
              Secure authentication powered by Firebase.
            </span>
          </div>

          {/* DISCLAIMER */}
          <div className="login-help">
            <p>
              By continuing, you agree to use this platform
              responsibly and verify scheme details through
              official government portals.
            </p>
          </div>

        </div>

        {/* FOOTER */}
        <footer className="login-footer">
          <span>© 2026 Bharat Sahayak AI</span>
          <span>Made for Digital India</span>
        </footer>

      </section>

    </main>
  );
}

export default Login;
