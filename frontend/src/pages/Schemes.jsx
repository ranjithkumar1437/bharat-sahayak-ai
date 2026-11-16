
import { useMemo, useState } from "react";

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
  ClipboardList
} from "lucide-react";

import "./Schemes.css";

const schemes = [
  {
    id: 1,
    name: "PM-KISAN",
    category: "Agriculture",
    icon: Sprout,
    color: "green",
    description:
      "Financial support for eligible farmer families across India.",
    benefit: "Up to ₹6,000 per year, subject to eligibility",
    location: "India-wide scheme",
    details:
      "Pradhan Mantri Kisan Samman Nidhi provides income support to eligible landholding farmer families through direct benefit transfers.",
    eligibility: [
      "Eligible landholding farmer families",
      "Subject to applicable exclusion rules",
      "Aadhaar and bank details may be required"
    ],
    documents: [
      "Aadhaar card",
      "Bank account details",
      "Land ownership records"
    ],
    officialWebsite: "https://pmkisan.gov.in/"
  },
  {
    id: 2,
    name: "Post Matric Scholarship",
    category: "Education",
    icon: GraduationCap,
    color: "blue",
    description:
      "Scholarship support for eligible students pursuing post-matric studies.",
    benefit: "As per applicable scholarship rules",
    location: "Central and state scholarship programmes",
    details:
      "Post Matric Scholarship programmes support eligible students from specified categories to continue their education after matriculation.",
    eligibility: [
      "Must satisfy the relevant category requirements",
      "Must be enrolled in an eligible institution",
      "Income limits and other conditions vary by scheme"
    ],
    documents: [
      "Aadhaar card",
      "Income certificate",
      "Caste or category certificate, where applicable",
      "Previous academic marksheets",
      "Bank account details"
    ],
    officialWebsite: "https://scholarships.gov.in/"
  },
  {
    id: 3,
    name: "PM Mudra Yojana",
    category: "Business",
    icon: BriefcaseBusiness,
    color: "orange",
    description:
      "Loans through participating financial institutions for eligible small businesses.",
    benefit: "Loan support under applicable Mudra categories",
    location: "Across India",
    details:
      "Pradhan Mantri Mudra Yojana supports eligible non-corporate, non-farm small and micro enterprises through participating lending institutions.",
    eligibility: [
      "Eligible small business or micro-enterprise",
      "Applicant must satisfy lender requirements",
      "Loan approval depends on the lending institution"
    ],
    documents: [
      "Identity proof",
      "Address proof",
      "Business details",
      "Bank account details",
      "Business plan, if required"
    ],
    officialWebsite: "https://www.mudra.org.in/"
  },
  {
    id: 4,
    name: "Ayushman Bharat PM-JAY",
    category: "Healthcare",
    icon: HeartPulse,
    color: "red",
    description:
      "Health coverage for eligible families under the government health assurance scheme.",
    benefit: "Up to ₹5 lakh per eligible family per year",
    location: "Participating hospitals across India",
    details:
      "Ayushman Bharat Pradhan Mantri Jan Arogya Yojana provides cashless secondary and tertiary hospitalisation coverage to eligible beneficiary families.",
    eligibility: [
      "Eligibility is based on applicable government beneficiary records",
      "Beneficiary identification is required",
      "Coverage is subject to scheme rules"
    ],
    documents: [
      "Aadhaar card or accepted identity document",
      "Ration card or family identification details, where applicable",
      "Beneficiary identification information"
    ],
    officialWebsite: "https://pmjay.gov.in/"
  },
  {
    id: 5,
    name: "PM Awas Yojana - Urban",
    category: "Housing",
    icon: House,
    color: "blue",
    description:
      "Housing assistance for eligible urban households.",
    benefit: "Assistance as per applicable scheme guidelines",
    location: "Eligible urban areas",
    details:
      "Pradhan Mantri Awas Yojana - Urban supports eligible urban households through housing-related assistance under applicable programme components.",
    eligibility: [
      "Must meet applicable household eligibility conditions",
      "Must satisfy scheme-specific income requirements",
      "Other conditions depend on the programme component"
    ],
    documents: [
      "Aadhaar card",
      "Income proof",
      "Address proof",
      "Bank account details"
    ],
    officialWebsite: "https://pmaymis.gov.in/"
  },
  {
    id: 6,
    name: "PM Awas Yojana - Gramin",
    category: "Housing",
    icon: House,
    color: "green",
    description:
      "Housing support for eligible rural households.",
    benefit: "Financial assistance as per rural housing guidelines",
    location: "Eligible rural areas",
    details:
      "PMAY-G aims to provide assistance for pucca houses to eligible rural households identified under applicable government criteria.",
    eligibility: [
      "Eligible rural household",
      "Selection based on applicable government identification criteria",
      "Subject to programme guidelines"
    ],
    documents: [
      "Identity proof",
      "Bank account details",
      "Rural household identification details"
    ],
    officialWebsite: "https://pmayg.nic.in/"
  },
  {
    id: 7,
    name: "Mahatma Gandhi NREGA",
    category: "Employment",
    icon: Building2,
    color: "orange",
    description:
      "Wage employment opportunities for eligible rural households.",
    benefit: "Up to 100 days of guaranteed wage employment per rural household, subject to the Act",
    location: "Rural India",
    details:
      "MGNREGA provides a legal guarantee of wage employment to rural households whose adult members volunteer for unskilled manual work.",
    eligibility: [
      "Adult members of rural households",
      "Must be willing to undertake unskilled manual work",
      "Job card and local registration requirements apply"
    ],
    documents: [
      "Identity proof",
      "Residence details",
      "Household member details",
      "Bank or post office account details"
    ],
    officialWebsite: "https://nrega.nic.in/"
  },
  {
    id: 8,
    name: "e-Shram",
    category: "Employment",
    icon: Users,
    color: "blue",
    description:
      "National database and registration platform for eligible unorganised workers.",
    benefit: "Access to applicable worker-related government services",
    location: "Across India",
    details:
      "The e-Shram portal helps create a national database of unorganised workers and supports access to relevant government welfare services.",
    eligibility: [
      "Eligible unorganised workers",
      "Must satisfy current registration conditions",
      "Specific exclusions may apply"
    ],
    documents: [
      "Aadhaar number",
      "Mobile number linked to Aadhaar, where required",
      "Bank account details"
    ],
    officialWebsite: "https://eshram.gov.in/"
  },
  {
    id: 9,
    name: "National Social Assistance Programme",
    category: "Women",
    icon: Users,
    color: "red",
    description:
      "Social assistance programmes for eligible vulnerable citizens.",
    benefit: "Assistance according to applicable pension programme rules",
    location: "Across India",
    details:
      "NSAP provides social assistance through eligible pension and family benefit programmes for vulnerable sections of society.",
    eligibility: [
      "Must meet the relevant programme conditions",
      "Age and household criteria may apply",
      "State-specific implementation rules may apply"
    ],
    documents: [
      "Age proof",
      "Identity proof",
      "Income or household eligibility documents",
      "Bank account details"
    ],
    officialWebsite: "https://nsap.nic.in/"
  },
  {
    id: 10,
    name: "Beti Bachao Beti Padhao",
    category: "Women",
    icon: Users,
    color: "orange",
    description:
      "An initiative promoting the protection, education and empowerment of girls.",
    benefit: "Awareness and support initiatives under the programme",
    location: "Across India",
    details:
      "Beti Bachao Beti Padhao works to address gender discrimination and promote the education and empowerment of girls.",
    eligibility: [
      "Programme activities are implemented through designated departments",
      "Specific services depend on local programme implementation"
    ],
    documents: [
      "Documents depend on the specific service being accessed"
    ],
    officialWebsite: "https://wcd.gov.in/"
  },
  {
    id: 11,
    name: "Skill India Digital Hub",
    category: "Education",
    icon: GraduationCap,
    color: "green",
    description:
      "Discover skill development, training and learning opportunities.",
    benefit: "Training and course opportunities as listed on the portal",
    location: "Online platform",
    details:
      "Skill India Digital Hub provides access to skill development courses, training information and related learning opportunities.",
    eligibility: [
      "Course-specific eligibility conditions apply",
      "Age and education requirements vary by course"
    ],
    documents: [
      "Basic identity details",
      "Education details, if required",
      "Contact information"
    ],
    officialWebsite: "https://www.skillindiadigital.gov.in/"
  },
  {
    id: 12,
    name: "Stand-Up India",
    category: "Business",
    icon: BriefcaseBusiness,
    color: "orange",
    description:
      "Bank loan support for eligible women and SC/ST entrepreneurs.",
    benefit: "Eligible bank loans under applicable programme conditions",
    location: "Participating bank branches across India",
    details:
      "Stand-Up India facilitates bank loans for eligible SC/ST and women entrepreneurs setting up greenfield enterprises.",
    eligibility: [
      "Eligible SC/ST or woman entrepreneur",
      "Greenfield enterprise conditions apply",
      "Applicant must satisfy bank requirements"
    ],
    documents: [
      "Identity proof",
      "Address proof",
      "Business plan",
      "Category certificate, where applicable",
      "Financial documents required by the bank"
    ],
    officialWebsite: "https://www.standupmitra.in/"
  }
];

const categories = [
  "All",
  "Agriculture",
  "Education",
  "Business",
  "Healthcare",
  "Housing",
  "Women",
  "Employment"
];

function Schemes({ onNavigate }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedScheme, setSelectedScheme] = useState(null);

  const filteredSchemes = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return schemes.filter((scheme) => {
      const matchesCategory =
        selectedCategory === "All" ||
        scheme.category === selectedCategory;

      const matchesSearch =
        !search ||
        scheme.name.toLowerCase().includes(search) ||
        scheme.category.toLowerCase().includes(search) ||
        scheme.description.toLowerCase().includes(search) ||
        scheme.benefit.toLowerCase().includes(search);

      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  const openOfficialWebsite = (url) => {
    if (!url || !/^https:\/\/[a-z0-9.-]+\.[a-z]{2,}/i.test(url)) {
      window.alert("The official website link is not available.");
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleEligibility = () => {
    setSelectedScheme(null);

    if (typeof onNavigate === "function") {
      onNavigate("Eligibility Checker");
    } else {
      window.alert(
        "Navigation is unavailable. Please use Eligibility Checker from the sidebar."
      );
    }
  };

  const SchemeIcon = ({ scheme }) => {
    const Icon = scheme.icon;
    return <Icon size={28} strokeWidth={2} />;
  };

  return (
    <div className="schemes-page">

      {/* Page heading */}
      <div className="schemes-heading">

        <div>
          <span className="schemes-eyebrow">
            GOVERNMENT BENEFITS DISCOVERY
          </span>

          <h1>Find Government Schemes</h1>

          <p>
            Discover government programmes and benefits that may
            match your needs.
          </p>
        </div>

        <div className="schemes-heading-icon">
          <ShieldCheck size={32} />
        </div>

      </div>

      {/* Search */}
      <div className="schemes-search">
        <Search size={21} />

        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search schemes by name, category or benefit..."
          aria-label="Search government schemes"
        />
      </div>

      {/* Category filters */}
      <div className="category-list">
        {categories.map((category) => (
          <button
            type="button"
            key={category}
            className={
              selectedCategory === category ? "category-active" : ""
            }
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Results heading */}
      <div className="schemes-results">
        <div>
          <h2>Available Schemes</h2>

          <p>
            {filteredSchemes.length} schemes displayed
          </p>
        </div>
      </div>

      {/* Scheme cards */}
      {filteredSchemes.length > 0 ? (
        <div className="schemes-grid">

          {filteredSchemes.map((scheme) => (
            <article className="scheme-card" key={scheme.id}>

              <div className={`scheme-icon ${scheme.color}`}>
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
                onClick={() => setSelectedScheme(scheme)}
              >
                View Details
                <ArrowRight size={18} />
              </button>

            </article>
          ))}

        </div>
      ) : (
        <div className="no-schemes">
          <Search size={35} />

          <h3>No schemes found</h3>

          <p>
            Try another search term or choose a different category.
          </p>

          <button
            type="button"
            className="scheme-button"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("All");
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Disclaimer */}
      <div className="scheme-disclaimer">
        <ShieldCheck size={18} />
        Scheme information is provided for general guidance.
        Benefits, eligibility conditions and application procedures
        may change. Always verify the latest details on the official
        government portal.
      </div>

      {/* Scheme details modal */}
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
                onClick={() => setSelectedScheme(null)}
                aria-label="Close scheme details"
              >
                <X size={21} />
              </button>

            </div>

            <p className="scheme-modal-description">
              {selectedScheme.details}
            </p>

            {/* Benefit */}
            <div className="scheme-detail-section">

              <h3>
                <IndianRupee size={19} />
                Scheme Benefits
              </h3>

              <p>{selectedScheme.benefit}</p>

            </div>

            {/* Eligibility */}
            <div className="scheme-detail-section">

              <h3>
                <CheckCircle size={19} />
                General Eligibility
              </h3>

              <ul>
                {selectedScheme.eligibility.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

            </div>

            {/* Documents */}
            <div className="scheme-detail-section">

              <h3>
                <FileText size={19} />
                Documents to Prepare
              </h3>

              <ul>
                {selectedScheme.documents.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

            </div>

            {/* Location */}
            <div className="scheme-detail-section">

              <h3>
                <MapPin size={19} />
                Availability
              </h3>

              <p>{selectedScheme.location}</p>

            </div>

            {/* Actions */}
            <div className="scheme-modal-actions">

              <button
                type="button"
                className="scheme-official-link"
                onClick={() =>
                  openOfficialWebsite(selectedScheme.officialWebsite)
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

            <p className="scheme-modal-note">
              These details are for general information only.
              Final eligibility and benefits are determined by the
              concerned government department. Verify current rules
              on the official website.
            </p>

          </div>
        </div>
      )}

    </div>
  );
}

export default Schemes;
