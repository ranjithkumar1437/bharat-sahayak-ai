
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
  LogOut,
  CheckCheck,
  Trash2,
  Info,
  CheckCircle2,
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

const ACTIVITY_STORAGE_KEY = "bharatRecentActivities";

const activityDetails = {
  "Find Schemes": {
    icon: "🔍",
    title: "Explored Government Schemes",
    description: "Visited the government schemes section.",
  },
  "Eligibility Checker": {
    icon: "🛡️",
    title: "Opened Eligibility Checker",
    description: "Visited the scheme eligibility section.",
  },
  Documents: {
    icon: "📄",
    title: "Opened Documents",
    description: "Visited the document assistant.",
  },
  "Application Guide": {
    icon: "📋",
    title: "Viewed Application Guide",
    description: "Visited application guidance.",
  },
  "AI Assistant": {
    icon: "🤖",
    title: "Opened AI Assistant",
    description: "Visited the AI assistant.",
  },
};

function getSavedActivities() {
  try {
    const saved = localStorage.getItem(ACTIVITY_STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];

    return Array.isArray(parsed) ? parsed.slice(0, 5) : [];
  } catch (error) {
    console.error("Unable to load recent activities:", error);
    return [];
  }
}

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [activePage, setActivePage] = useState("Dashboard");
  const [selectedSchemeForEligibility, setSelectedSchemeForEligibility] =
    useState(null);

  const [language, setLanguage] = useState("English");
  const [menuOpen, setMenuOpen] = useState(false);

  // Recent Activity
  const [recentActivities, setRecentActivities] = useState(
    getSavedActivities
  );

  // Notification panel
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Initial sample notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Welcome to Bharat Sahayak AI",
      message:
        "Explore government welfare schemes and discover services available on this platform.",
      time: "Just now",
      type: "info",
      read: false,
    },
    {
      id: 2,
      title: "Check your scheme eligibility",
      message:
        "Use the Eligibility Checker to understand which schemes may be relevant to you.",
      time: "Today",
      type: "success",
      read: false,
    },
    {
      id: 3,
      title: "Keep your documents ready",
      message:
        "Visit the Documents section to review common document checklists.",
      time: "Today",
      type: "document",
      read: false,
    },
  ]);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  // Firebase authentication listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Record recent page activity
  const recordActivity = (page) => {
    const details = activityDetails[page];

    if (!details) return;

    const newActivity = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      ...details,
      createdAt: new Date().toISOString(),
    };

    setRecentActivities((previous) => {
      const updated = [newActivity, ...previous].slice(0, 5);

      try {
        localStorage.setItem(
          ACTIVITY_STORAGE_KEY,
          JSON.stringify(updated)
        );
      } catch (error) {
        console.error("Unable to save recent activity:", error);
      }

      return updated;
    });
  };

  // Clear recent activity
  const clearRecentActivities = () => {
    setRecentActivities([]);

    try {
      localStorage.removeItem(ACTIVITY_STORAGE_KEY);
    } catch (error) {
      console.error("Unable to clear recent activities:", error);
    }
  };

  // Page navigation
  const navigateTo = (page, scheme = null) => {
    recordActivity(page);

    setActivePage(page);

    setSelectedSchemeForEligibility(
      page === "Eligibility Checker" ? scheme : null
    );

    setMenuOpen(false);
    setNotificationOpen(false);

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    document.querySelector(".main-content")?.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    document.querySelector(".page-content")?.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  };

  // Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);

      setActivePage("Dashboard");
      setMenuOpen(false);
      setNotificationOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Toggle notifications
  const toggleNotifications = () => {
    setNotificationOpen((previous) => !previous);
  };

  // Mark one notification as read
  const markNotificationRead = (notificationId) => {
    setNotifications((previous) =>
      previous.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllNotificationsRead = () => {
    setNotifications((previous) =>
      previous.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Loading screen
  if (authLoading) {
    return (
      <div className="auth-loading">
        <h2>Bharat Sahayak AI</h2>
        <p>Loading your account...</p>
      </div>
    );
  }

  // Login screen
  if (!user) {
    return <Login />;
  }

  // Sidebar menu items
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Find Schemes", icon: Search },
    { name: "Eligibility Checker", icon: Shield },
    { name: "Documents", icon: FileText },
    { name: "Application Guide", icon: ClipboardList },
    { name: "AI Assistant", icon: MessageCircle },
  ];

  // Dashboard content
  const Dashboard = () => (
    <div className="dashboard-page">

      {/* Welcome Banner */}
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

      {/* Dashboard Services */}
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

            <p>
              Discover government schemes relevant to your needs.
            </p>

            <button onClick={() => navigateTo("Find Schemes")}>
              Explore schemes <ArrowRight size={16} />
            </button>
          </div>

          <div className="service-card">
            <div className="service-icon">
              <ShieldCheck size={27} />
            </div>

            <h3>Check Eligibility</h3>

            <p>
              Understand which schemes you may qualify for.
            </p>

            <button
              onClick={() => navigateTo("Eligibility Checker")}
            >
              Check eligibility <ArrowRight size={16} />
            </button>
          </div>

          <div className="service-card">
            <div className="service-icon">
              <FileText size={27} />
            </div>

            <h3>Document Assistant</h3>

            <p>
              Get a checklist of documents required for schemes.
            </p>

            <button onClick={() => navigateTo("Documents")}>
              View documents <ArrowRight size={16} />
            </button>
          </div>

          <div className="service-card">
            <div className="service-icon">
              <ClipboardList size={27} />
            </div>

            <h3>Application Guidance</h3>

            <p>
              Get simple, step-by-step application instructions.
            </p>

            <button
              onClick={() => navigateTo("Application Guide")}
            >
              Get guidance <ArrowRight size={16} />
            </button>
          </div>

        </div>
      </section>

      {/* Recent Activity */}
      <section className="recent-activity-section">
        <div className="section-heading recent-activity-heading">
          <div>
            <h2>Recent Activity</h2>
            <p>Your recently visited services.</p>
          </div>

          {recentActivities.length > 0 && (
            <button
              type="button"
              className="clear-activity-button"
              onClick={clearRecentActivities}
            >
              <Trash2 size={15} />
              Clear history
            </button>
          )}
        </div>

        <div className="recent-activity-card">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity) => (
              <div
                className="recent-activity-item"
                key={activity.id}
              >
                <div className="recent-activity-icon">
                  {activity.icon}
                </div>

                <div className="recent-activity-details">
                  <h4>{activity.title}</h4>

                  <p>{activity.description}</p>

                  <span>
                    {new Date(
                      activity.createdAt
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="recent-activity-empty">
              <span>📊</span>

              <h3>No recent activity yet</h3>

              <p>
                Your recently visited services will appear here.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* AI Agents */}
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

            <p>
              Helps identify potentially relevant government schemes.
            </p>
          </div>

          <div className="service-card">
            <div className="service-icon">
              <FileText size={27} />
            </div>

            <h3>Document Agent</h3>

            <p>
              Helps prepare scheme-specific document checklists.
            </p>
          </div>

          <div className="service-card">
            <div className="service-icon">
              <ClipboardList size={27} />
            </div>

            <h3>Application Agent</h3>

            <p>
              Guides citizens through application steps.
            </p>
          </div>

        </div>
      </section>

      {/* AI Assistant Banner */}
      <section className="dashboard-ai">
        <div>
          <h2>Need help? Ask Bharat Sahayak AI</h2>

          <p>
            Get assistance in your preferred language.
          </p>
        </div>

        <button onClick={() => navigateTo("AI Assistant")}>
          Chat with AI <ArrowRight size={17} />
        </button>
      </section>

    </div>
  );

  // Render selected page
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

      {/* Mobile Overlay */}
      {menuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}
      >
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

      {/* Main Area */}
      <main className="main-content">

        {/* Top Navigation */}
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

            {/* Language Selector */}
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

            {/* Functional Notifications */}
            <div className="notification-wrapper">
              <button
                type="button"
                className={`topbar-icon notification-bell ${
                  notificationOpen ? "notification-active" : ""
                }`}
                onClick={toggleNotifications}
                aria-label={`Notifications, ${unreadCount} unread`}
                aria-expanded={notificationOpen}
                aria-haspopup="dialog"
                title="Notifications"
              >
                <Bell size={20} />

                {unreadCount > 0 && (
                  <span className="notification-badge">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {notificationOpen && (
                <div
                  className="notification-panel"
                  role="dialog"
                  aria-label="Notifications"
                >

                  {/* Panel Header */}
                  <div className="notification-header">
                    <div>
                      <h3>Notifications</h3>

                      <p>
                        {unreadCount > 0
                          ? `${unreadCount} unread notification${
                              unreadCount === 1 ? "" : "s"
                            }`
                          : "You're all caught up"}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="notification-close"
                      onClick={() => setNotificationOpen(false)}
                      aria-label="Close notifications"
                    >
                      <X size={19} />
                    </button>
                  </div>

                  {/* Notification Actions */}
                  {notifications.length > 0 && (
                    <div className="notification-actions">

                      <button
                        type="button"
                        onClick={markAllNotificationsRead}
                        disabled={unreadCount === 0}
                      >
                        <CheckCheck size={15} />
                        Mark all read
                      </button>

                      <button
                        type="button"
                        onClick={clearAllNotifications}
                      >
                        <Trash2 size={15} />
                        Clear all
                      </button>

                    </div>
                  )}

                  {/* Notification List */}
                  <div className="notification-list">
                    {notifications.length === 0 ? (
                      <div className="notification-empty">
                        <div className="notification-empty-icon">
                          <Bell size={25} />
                        </div>

                        <h4>No notifications</h4>

                        <p>
                          New updates will appear here.
                        </p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <button
                          type="button"
                          key={notification.id}
                          className={`notification-item ${
                            notification.read
                              ? "is-read"
                              : "is-unread"
                          }`}
                          onClick={() =>
                            markNotificationRead(notification.id)
                          }
                        >
                          <span
                            className={`notification-type-icon ${notification.type}`}
                          >
                            {notification.type === "success" ? (
                              <CheckCircle2 size={19} />
                            ) : notification.type === "document" ? (
                              <FileText size={19} />
                            ) : (
                              <Info size={19} />
                            )}
                          </span>

                          <span className="notification-content">
                            <span className="notification-item-title">
                              {notification.title}
                            </span>

                            <span className="notification-message">
                              {notification.message}
                            </span>

                            <span className="notification-time">
                              {notification.time}
                            </span>
                          </span>

                          {!notification.read && (
                            <span className="notification-unread-dot" />
                          )}
                        </button>
                      ))
                    )}
                  </div>

                  <div className="notification-footer">
                    Bharat Sahayak AI · In-app updates
                  </div>

                </div>
              )}
            </div>

            {/* User Profile */}
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

            {/* Logout */}
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

        {/* Page Content */}
        <div className="page-content" key={activePage}>
          {renderPage()}
        </div>

        {/* Footer */}
        <footer className="app-footer">
          <p>
            © 2026 Bharat Sahayak AI. Built for AI for Bharat.
          </p>

          <span>Empowering Every Indian 🇮🇳</span>
        </footer>

      </main>
    </div>
  );
}

export default App;
