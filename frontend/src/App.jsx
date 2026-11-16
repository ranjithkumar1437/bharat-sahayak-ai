
import { useState, useEffect } from "react";

import {
  ShieldCheck,
  LayoutDashboard,
  Search,
  Shield,
  FileText,
  ClipboardList,
  MessageCircle,
  Menu,
  X,
  Bell,
  User,
  Languages,
  ArrowRight,
  Sparkles,
  LogOut
} from "lucide-react";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";

import Schemes from "./pages/Schemes";
import Eligibility from "./pages/Eligibility";
import Documents from "./pages/Documents";
import ApplicationGuide from "./pages/ApplicationGuide";
import AIAssistant from "./pages/AIAssistant";
import Login from "./pages/Login";

import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [activePage, setActivePage] = useState("Dashboard");
  const [selectedSchemeForEligibility, setSelectedSchemeForEligibility] =
    useState(null);

  const [language, setLanguage] = useState("English");
  const [menuOpen, setMenuOpen] = useState(false);

  // Firebase authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Navigate between pages
  const navigateTo = (page, scheme = null) => {
    setActivePage(page);

    if (page === "Eligibility Checker") {
      setSelectedSchemeForEligibility(scheme);
    } else {
      setSelectedSchemeForEligibility(null);
    }

    setMenuOpen(false);

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant"
    });

    document.querySelector(".main-content")?.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant"
    });

    document.querySelector(".page-content")?.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant"
    });
  };

  // Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setActivePage("Dashboard");
      setSelectedSchemeForEligibility(null);
      setMenuOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Authentication loading
  if (authLoading) {
    return (
      <div className="auth-loading">
        <h2>Bharat Sahayak AI</h2>
        <p>Loading your account...</p>
      </div>
    );
  }

  // Login
  if (!user) {
    return <Login />;
  }

  // Sidebar menu
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Find Schemes", icon: Search },
    { name: "Eligibility Checker", icon: Shield },
    { name: "Documents", icon: FileText },
    { name: "Application Guide", icon: ClipboardList },
    { name: "AI Assistant", icon: MessageCircle }
  ];

  // Dashboard
  const Dashboard = () => (
    <div className="dashboard-page">
      <section className="welcome-banner">
        <div className="welcome-content">
          <div className="welcome-label">
            <Sparkles size={16} />
            YOUR DIGITAL CITIZEN ASSISTANT
          </div>

          <h1>Welcome to Bharat Sahayak AI</h1>

          <p>
            Government assistance made simple, accessible and
            multilingual.
          </p>

          <button
            className="welcome-button"
            onClick={() => navigateTo("Find Schemes")}
          >
            Explore Government Schemes
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="welcome-emblem">
          <ShieldCheck size={65} />
          <span>AI for Every Indian</span>
        </div>
      </section>

      <section className="dashboard-services">
        <div className="section-heading">
          <h2>How can we help you?</h2>
          <p>Choose a service to get started.</p>
        </div>

        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">
              <Search size={27} />
            </div>
            <h3>Find Government Schemes</h3>
            <p>Discover government schemes relevant to your needs.</p>
            <button onClick={() => navigateTo("Find Schemes")}>
              Explore schemes <ArrowRight size={16} />
            </button>
          </div>

          <div className="service-card">
            <div className="service-icon">
              <ShieldCheck size={27} />
            </div>
            <h3>Check Eligibility</h3>
            <p>Understand which schemes you may qualify for.</p>
            <button onClick={() => navigateTo("Eligibility Checker")}>
              Check eligibility <ArrowRight size={16} />
            </button>
          </div>

          <div className="service-card">
            <div className="service-icon">
              <FileText size={27} />
            </div>
            <h3>Document Assistant</h3>
            <p>Get a checklist of documents required for schemes.</p>
            <button onClick={() => navigateTo("Documents")}>
              View documents <ArrowRight size={16} />
            </button>
          </div>

          <div className="service-card">
            <div className="service-icon">
              <ClipboardList size={27} />
            </div>
            <h3>Application Guidance</h3>
            <p>Get simple, step-by-step application instructions.</p>
            <button onClick={() => navigateTo("Application Guide")}>
              Get guidance <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      <section className="dashboard-agents">
        <div className="section-heading">
          <h2>Meet Your AI Assistants</h2>
          <p>Three intelligent agents working together.</p>
        </div>

        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">
              <ShieldCheck size={27} />
            </div>
            <h3>Eligibility Agent</h3>
            <p>Helps identify potentially relevant government schemes.</p>
          </div>

          <div className="service-card">
            <div className="service-icon">
              <FileText size={27} />
            </div>
            <h3>Document Agent</h3>
            <p>Helps prepare scheme-specific document checklists.</p>
          </div>

          <div className="service-card">
            <div className="service-icon">
              <ClipboardList size={27} />
            </div>
            <h3>Application Agent</h3>
            <p>Guides citizens through application steps.</p>
          </div>
        </div>
      </section>

      <section className="dashboard-ai">
        <div>
          <h2>Need help? Ask Bharat Sahayak AI</h2>
          <p>Get assistance in your preferred language.</p>
        </div>

        <button onClick={() => navigateTo("AI Assistant")}>
          Chat with AI <ArrowRight size={17} />
        </button>
      </section>
    </div>
  );

  // Render pages
  const renderPage = () => {
    switch (activePage) {
      case "Dashboard":
        return <Dashboard />;

      case "Find Schemes":
        return (
          <Schemes
            onNavigate={navigateTo}
            onCheckEligibility={(scheme) =>
              navigateTo("Eligibility Checker", scheme)
            }
          />
        );

      case "Eligibility Checker":
        return (
          <Eligibility
            onNavigate={navigateTo}
            selectedScheme={selectedSchemeForEligibility}
          />
        );

      case "Documents":
        return <Documents />;

      case "Application Guide":
        return <ApplicationGuide />;

      case "AI Assistant":
        return <AIAssistant />;

      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      {menuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <div className="brand-logo">
            <ShieldCheck size={29} />
          </div>

          <div className="brand-details">
            <h2>Bharat Sahayak</h2>
            <span>AI Citizen Assistant</span>
          </div>

          <button
            className="mobile-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <div className="sidebar-label">MAIN MENU</div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                type="button"
                key={item.name}
                className={`nav-item ${
                  activePage === item.name ? "active" : ""
                }`}
                onClick={() => navigateTo(item.name)}
                aria-current={
                  activePage === item.name ? "page" : undefined
                }
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <button
            type="button"
            className="sidebar-help"
            onClick={() => navigateTo("AI Assistant")}
          >
            <Sparkles size={19} />
            <div>
              <strong>Need assistance?</strong>
              <span>Ask our AI assistant.</span>
            </div>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="menu-toggle"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={23} />
            </button>

            <div className="breadcrumb">
              <span>Home</span>
              <span>/</span>
              <strong>{activePage}</strong>
            </div>
          </div>

          <div className="topbar-actions">
            <div className="language-selector">
              <Languages size={18} />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                aria-label="Select language"
              >
                <option value="English">English</option>
                <option value="Telugu">తెలుగు</option>
                <option value="Hindi">हिन्दी</option>
              </select>
            </div>

            <button
              type="button"
              className="topbar-icon"
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell size={20} />
            </button>

            <div className="user-profile">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="user-avatar"
                />
              ) : (
                <div className="user-avatar-fallback">
                  <User size={20} />
                </div>
              )}

              <span className="user-email">
                {user.displayName || user.email}
              </span>
            </div>

            <button
              type="button"
              className="topbar-icon"
              onClick={handleLogout}
              aria-label="Logout"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <div className="page-content" key={activePage}>
          {renderPage()}
        </div>

        <footer className="app-footer">
          <p>© 2026 Bharat Sahayak AI. Built for AI for Bharat.</p>
          <span>Empowering Every Indian 🇮🇳</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
