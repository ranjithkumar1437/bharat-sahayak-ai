
import { useEffect, useState } from "react";

import {
  Search,
  Sprout,
  GraduationCap,
  BriefcaseBusiness,
  HeartPulse,
  House,
  Users,
  Building2,
  IndianRupee,
  MapPin,
  ArrowRight,
  ExternalLink,
  X,
  ShieldCheck,
  FileText,
  CheckCircle,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";

import { getSchemes } from "../services/api";

import "./Schemes.css";

// ==========================================
// SCHEME ICONS
// ==========================================

const schemeIcons = {
  Agriculture: Sprout,
  Education: GraduationCap,
  Business: BriefcaseBusiness,
  Healthcare: HeartPulse,
  Housing: House,
  Women: Users,
  Employment: Building2,
};

const schemeColors = {
  Agriculture: "green",
  Education: "blue",
  Business: "orange",
  Healthcare: "red",
  Housing: "blue",
  Women: "orange",
  Employment: "green",
};

// ==========================================
// CATEGORIES
// ==========================================

const categories = [
  "All",
  "Agriculture",
  "Education",
  "Business",
  "Healthcare",
  "Housing",
  "Women",
  "Employment",
];

// ==========================================
// NORMALIZE BACKEND SCHEME DATA
// ==========================================

const normalizeScheme = (scheme) => {
  const benefits = Array.isArray(scheme.benefits)
    ? scheme.benefits
    : [];

  return {
    id: scheme.id,
    name: scheme.name || "Government Scheme",
    category: scheme.category || "Other",

    icon:
      schemeIcons[scheme.category] || ShieldCheck,

    color:
      schemeColors[scheme.category] || "green",

    description:
      scheme.description || "Scheme information is available.",

    benefit:
      scheme.benefit ||
      benefits.join(" • ") ||
      "Benefits depend on applicable government guidelines.",

    location:
      scheme.location || "India-wide scheme",

    details:
      scheme.details ||
      scheme.description ||
      "Please check the official government portal for more details.",

    eligibility: Array.isArray(scheme.eligibility)
      ? scheme.eligibility
      : [],

    documents: Array.isArray(scheme.documents)
      ? scheme.documents
      : [],

    officialWebsite:
      scheme.application_url ||
      scheme.officialWebsite ||
      "",
  };
};

// ==========================================
// MAIN SCHEMES COMPONENT
// ==========================================

function Schemes({ onNavigate }) {
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [selectedScheme, setSelectedScheme] =
    useState(null);

  const [schemes, setSchemes] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ========================================
  // FETCH SCHEMES FROM BACKEND
  // ========================================

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getSchemes(
        searchTerm,
        selectedCategory
      );

      if (response?.success && Array.isArray(response.schemes)) {
        const formattedSchemes =
          response.schemes.map(normalizeScheme);

        setSchemes(formattedSchemes);
      } else {
        setSchemes([]);
        setError("Unable to load government schemes.");
      }
    } catch (err) {
      console.error("Schemes loading error:", err);

      setSchemes([]);

      setError(
        err.message ||
          "Network Error. Please check your backend connection."
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch when search or category changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSchemes();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory]);

  // ========================================
  // OPEN OFFICIAL WEBSITE
  // ========================================

  const openOfficialWebsite = (url) => {
    if (!url) {
      window.alert(
        "The official website link is not available."
      );
      return;
    }

    try {
      const validUrl = new URL(url);

      if (
        validUrl.protocol !== "https:" &&
        validUrl.protocol !== "http:"
      ) {
        throw new Error("Invalid URL");
      }

      window.open(
        validUrl.href,
        "_blank",
        "noopener,noreferrer"
      );
    } catch {
      window.alert(
        "The official website link is invalid."
      );
    }
  };

  // ========================================
  // ELIGIBILITY NAVIGATION
  // ========================================

  const handleEligibility = () => {
    setSelectedScheme(null);

    if (typeof onNavigate === "function") {
      onNavigate("Eligibility Checker");
    } else {
      window.alert(
        "Please select Eligibility Checker from the sidebar."
      );
    }
  };

  // ========================================
  // SCHEME ICON COMPONENT
  // ========================================

  const SchemeIcon = ({ scheme }) => {
    const Icon = scheme.icon;

    return <Icon size={28} strokeWidth={2} />;
  };

  // ========================================
  // RESET FILTERS
  // ========================================

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
  };

  // ========================================
  // UI
  // ========================================

  return (
    <div className="schemes-page">

      {/* PAGE HEADING */}

      <div className="schemes-heading">
        <div>
          <span className="schemes-eyebrow">
            GOVERNMENT BENEFITS DISCOVERY
          </span>

          <h1>Find Government Schemes</h1>

          <p>
            Discover government programmes and benefits
            that may match your needs.
          </p>
        </div>

        <div className="schemes-heading-icon">
          <ShieldCheck size={32} />
        </div>
      </div>

      {/* SEARCH */}

      <div className="schemes-search">
        <Search size={21} />

        <input
          type="search"
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          placeholder="Search schemes by name, category or benefit..."
          aria-label="Search government schemes"
        />
      </div>

      {/* CATEGORY FILTERS */}

      <div className="category-list">
        {categories.map((category) => (
          <button
            type="button"
            key={category}
            className={
              selectedCategory === category
                ? "category-active"
                : ""
            }
            onClick={() =>
              setSelectedCategory(category)
            }
          >
            {category}
          </button>
        ))}
      </div>

      {/* RESULTS HEADING */}

      <div className="schemes-results">
        <div>
          <h2>Available Schemes</h2>

          <p>
            {loading
              ? "Loading schemes..."
              : `${schemes.length} schemes displayed`}
          </p>
        </div>

        <button
          type="button"
          onClick={fetchSchemes}
          title="Refresh schemes"
          aria-label="Refresh schemes"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* LOADING */}

      {loading && (
        <div className="no-schemes">
          <LoaderCircle
            size={38}
            className="animate-spin"
          />

          <h3>Loading Government Schemes</h3>

          <p>
            Connecting to Bharat Sahayak AI backend...
          </p>
        </div>
      )}

      {/* ERROR */}

      {!loading && error && (
        <div className="no-schemes">
          <ShieldCheck size={38} />

          <h3>Unable to Load Schemes</h3>

          <p>{error}</p>

          <button
            type="button"
            className="scheme-button"
            onClick={fetchSchemes}
          >
            Try Again
            <RefreshCw size={17} />
          </button>
        </div>
      )}

      {/* SCHEME CARDS */}

      {!loading && !error && schemes.length > 0 && (
        <div className="schemes-grid">
          {schemes.map((scheme) => (
            <article
              className="scheme-card"
              key={scheme.id}
            >
              <div
                className={`scheme-icon ${scheme.color}`}
              >
                <SchemeIcon scheme={scheme} />
              </div>

              <span className="scheme-category">
                {scheme.category}
              </span>

              <h3>{scheme.name}</h3>

              <p>{scheme.description}</p>

              <div className="scheme-benefit">
                <IndianRupee size={17} />

                <span>{scheme.benefit}</span>
              </div>

              <div className="scheme-location">
                <MapPin size={17} />

                <span>{scheme.location}</span>
              </div>

              <button
                type="button"
                className="scheme-button"
                onClick={() =>
                  setSelectedScheme(scheme)
                }
              >
                View Details
                <ArrowRight size={18} />
              </button>
            </article>
          ))}
        </div>
      )}

      {/* NO RESULTS */}

      {!loading &&
        !error &&
        schemes.length === 0 && (
          <div className="no-schemes">
            <Search size={35} />

            <h3>No Schemes Found</h3>

            <p>
              Try another search term or choose a
              different category.
            </p>

            <button
              type="button"
              className="scheme-button"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        )}

      {/* DISCLAIMER */}

      <div className="scheme-disclaimer">
        <ShieldCheck size={18} />

        Scheme information is provided for general
        guidance. Benefits, eligibility conditions and
        application procedures may change. Always verify
        the latest details on the official government
        portal.
      </div>

      {/* SCHEME DETAILS MODAL */}

      {selectedScheme && (
        <div
          className="scheme-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedScheme(null);
            }
          }}
        >
          <div
            className="scheme-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="scheme-modal-title"
          >
            {/* MODAL HEADER */}

            <div className="scheme-modal-header">
              <div>
                <span className="scheme-category">
                  {selectedScheme.category}
                </span>

                <h2 id="scheme-modal-title">
                  {selectedScheme.name}
                </h2>
              </div>

              <button
                type="button"
                className="scheme-modal-close"
                onClick={() =>
                  setSelectedScheme(null)
                }
                aria-label="Close scheme details"
              >
                <X size={21} />
              </button>
            </div>

            {/* DESCRIPTION */}

            <p className="scheme-modal-description">
              {selectedScheme.details}
            </p>

            {/* BENEFITS */}

            <div className="scheme-detail-section">
              <h3>
                <IndianRupee size={19} />
                Scheme Benefits
              </h3>

              <p>{selectedScheme.benefit}</p>
            </div>

            {/* ELIGIBILITY */}

            <div className="scheme-detail-section">
              <h3>
                <CheckCircle size={19} />
                General Eligibility
              </h3>

              {selectedScheme.eligibility.length > 0 ? (
                <ul>
                  {selectedScheme.eligibility.map(
                    (item, index) => (
                      <li key={index}>{item}</li>
                    )
                  )}
                </ul>
              ) : (
                <p>
                  Check the official portal for
                  eligibility conditions.
                </p>
              )}
            </div>

            {/* DOCUMENTS */}

            <div className="scheme-detail-section">
              <h3>
                <FileText size={19} />
                Documents to Prepare
              </h3>

              {selectedScheme.documents.length > 0 ? (
                <ul>
                  {selectedScheme.documents.map(
                    (item, index) => (
                      <li key={index}>{item}</li>
                    )
                  )}
                </ul>
              ) : (
                <p>
                  Required documents depend on the
                  scheme guidelines.
                </p>
              )}
            </div>

            {/* LOCATION */}

            <div className="scheme-detail-section">
              <h3>
                <MapPin size={19} />
                Availability
              </h3>

              <p>{selectedScheme.location}</p>
            </div>

            {/* ACTION BUTTONS */}

            <div className="scheme-modal-actions">
              <button
                type="button"
                className="scheme-official-link"
                onClick={() =>
                  openOfficialWebsite(
                    selectedScheme.officialWebsite
                  )
                }
              >
                Open Official Website
                <ExternalLink size={17} />
              </button>

              <button
                type="button"
                className="scheme-eligibility-button"
                onClick={handleEligibility}
              >
                Check Eligibility
                <ArrowRight size={18} />
              </button>
            </div>

            {/* NOTE */}

            <p className="scheme-modal-note">
              These details are for general information
              only. Final eligibility and benefits are
              determined by the concerned government
              department. Verify current rules on the
              official website.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Schemes;
