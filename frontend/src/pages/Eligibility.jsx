
import { useState } from "react";
import { checkEligibility } from "../services/api";
import {
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Loader2,
  Sprout
} from "lucide-react";
import "./Eligibility.css";

const initialForm = {
  age: 22,
  state: "Andhra Pradesh",
  occupation: "farmer",
  annual_income: 150000,
  category: "general",
  owns_cultivable_land: null,
  institutional_landholder: null,
  constitutional_post_holder: null,
  elected_representative: null,
  government_employee: null,
  government_employee_exempt_category: null,
  monthly_pension_10000_or_more: null,
  income_taxpayer: null,
  registered_professional_practicing: null,
  land_acquired_after_cutoff: null,
};

const farmerQuestions = [
  {
    name: "owns_cultivable_land",
    label: "Do you own cultivable agricultural land?",
  },
  {
    name: "institutional_landholder",
    label: "Are you an institutional landholder?",
  },
  {
    name: "constitutional_post_holder",
    label: "Are you a constitutional post holder?",
  },
  {
    name: "elected_representative",
    label: "Are you an elected representative?",
  },
  {
    name: "government_employee",
    label: "Are you a government employee?",
  },
  {
    name: "monthly_pension_10000_or_more",
    label: "Do you receive a monthly pension of ₹10,000 or more?",
  },
  {
    name: "income_taxpayer",
    label: "Are you an income-tax payer?",
  },
  {
    name: "registered_professional_practicing",
    label: "Are you a practicing registered professional?",
  },
  {
    name: "land_acquired_after_cutoff",
    label: "Was your land acquired after the applicable cutoff date?",
  },
];

function isValidHttpUrl(value) {
  if (typeof value !== "string") return false;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function Eligibility() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const isFarmer =
    form.occupation.toLowerCase().includes("farmer") ||
    form.occupation.toLowerCase().includes("agricultur");

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedValue = value;

    if (name === "age" || name === "annual_income") {
      updatedValue = value === "" ? "" : Number(value);
    }

    if (value === "true") updatedValue = true;
    if (value === "false") updatedValue = false;
    if (value === "unknown") updatedValue = null;

    setForm((previous) => ({
      ...previous,
      [name]: updatedValue,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!form.age || form.age < 1 || form.age > 120) {
      setError("Please enter a valid age between 1 and 120.");
      return;
    }

    if (form.annual_income === "" || form.annual_income < 0) {
      setError("Please enter a valid annual family income.");
      return;
    }

    if (!form.state.trim()) {
      setError("Please enter your state.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const payload = {
        ...form,
        age: Number(form.age),
        annual_income: Number(form.annual_income),
      };

      const data = await checkEligibility(payload);
      setResult(data);
    } catch (err) {
      console.error("Eligibility check failed:", err);

      setError(
        err.response?.data?.detail ||
        err.message ||
        "Unable to check eligibility. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderStatus = (status) => {
    if (!status) return "Not specified";

    return String(status)
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  return (
    <div className="eligibility-page">
      <div className="eligibility-heading">
        <span className="eligibility-badge">
          <ShieldCheck size={16} />
          SMART SCHEME ASSESSMENT
        </span>

        <h1>Eligibility Checker</h1>

        <p>
          Enter your details to discover potentially relevant
          government schemes.
        </p>
      </div>

      <form
        className="eligibility-form"
        onSubmit={handleSubmit}
      >
        <div className="eligibility-form-heading">
          <div className="eligibility-form-icon">
            <ShieldCheck size={24} />
          </div>

          <div>
            <h2>Your Personal Details</h2>
            <p>Provide accurate information for a preliminary assessment.</p>
          </div>
        </div>

        <div className="eligibility-fields">
          <div className="eligibility-field">
            <label htmlFor="age">Age</label>
            <input
              id="age"
              type="number"
              name="age"
              min="1"
              max="120"
              value={form.age}
              onChange={handleChange}
              required
            />
          </div>

          <div className="eligibility-field">
            <label htmlFor="state">State</label>
            <input
              id="state"
              type="text"
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="Enter your state"
              required
            />
          </div>

          <div className="eligibility-field">
            <label htmlFor="occupation">Occupation</label>
            <select
              id="occupation"
              name="occupation"
              value={form.occupation}
              onChange={handleChange}
            >
              <option value="farmer">Farmer</option>
              <option value="student">Student</option>
              <option value="self-employed">Self-employed</option>
              <option value="business">Business owner</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="eligibility-field">
            <label htmlFor="annual_income">
              Annual Family Income (₹)
            </label>
            <input
              id="annual_income"
              type="number"
              name="annual_income"
              min="0"
              value={form.annual_income}
              onChange={handleChange}
              placeholder="Enter annual income"
              required
            />
          </div>

          <div className="eligibility-field">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option value="general">General</option>
              <option value="obc">OBC</option>
              <option value="sc">SC</option>
              <option value="st">ST</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {isFarmer && (
          <section className="farmer-questions">
            <div className="farmer-heading">
              <div className="farmer-icon">
                <Sprout size={23} />
              </div>

              <div>
                <h2>PM-KISAN Assessment Questions</h2>
                <p>
                  Answer these questions to help perform preliminary
                  scheme checks.
                </p>
              </div>
            </div>

            <div className="farmer-question-list">
              {farmerQuestions.map((question) => (
                <div
                  className="eligibility-question"
                  key={question.name}
                >
                  <label htmlFor={question.name}>
                    {question.label}
                  </label>

                  <select
                    id={question.name}
                    name={question.name}
                    value={
                      form[question.name] === null
                        ? "unknown"
                        : String(form[question.name])
                    }
                    onChange={handleChange}
                  >
                    <option value="unknown">Not sure / Unknown</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              ))}

              {form.government_employee === true && (
                <div className="eligibility-question">
                  <label htmlFor="government_employee_exempt_category">
                    Does your government employment fall under an exempt
                    category?
                  </label>

                  <select
                    id="government_employee_exempt_category"
                    name="government_employee_exempt_category"
                    value={
                      form.government_employee_exempt_category === null
                        ? "unknown"
                        : String(form.government_employee_exempt_category)
                    }
                    onChange={handleChange}
                  >
                    <option value="unknown">Not sure / Unknown</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              )}
            </div>
          </section>
        )}

        {error && (
          <div className="eligibility-error" role="alert">
            <AlertCircle size={19} />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          className="eligibility-submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="eligibility-spinner" size={20} />
              Checking Eligibility...
            </>
          ) : (
            <>
              <ShieldCheck size={20} />
              Check Eligibility
            </>
          )}
        </button>

        <p className="eligibility-form-note">
          Your details are used to perform preliminary scheme checks.
        </p>
      </form>

      {result && (
        <section className="eligibility-result">
          <div className="result-heading">
            <CheckCircle size={25} />
            <div>
              <h2>Eligibility Assessment Results</h2>
              <p>
                Total recommended schemes:{" "}
                <strong>{result.total_matches ?? 0}</strong>
              </p>
            </div>
          </div>

          {result.scheme_assessments?.length > 0 && (
            <div className="assessment-list">
              <h3>Scheme Assessments</h3>

              {result.scheme_assessments.map((assessment, index) => (
                <article className="scheme-result" key={index}>
                  <h4>{assessment.scheme}</h4>

                  <p>
                    <strong>Status:</strong>{" "}
                    {renderStatus(assessment.status)}
                  </p>

                  {assessment.reasons?.map((reason, i) => (
                    <p key={`reason-${i}`}>{reason}</p>
                  ))}

                  {assessment.missing_details?.map((detail, i) => (
                    <p key={`missing-${i}`}>{detail}</p>
                  ))}

                  {assessment.benefit && (
                    <p>
                      <strong>Benefit:</strong> {assessment.benefit}
                    </p>
                  )}

                  {isValidHttpUrl(assessment.official_website) && (
                    <a
                      href={assessment.official_website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit Official Website
                      <ExternalLink size={16} />
                    </a>
                  )}
                </article>
              ))}
            </div>
          )}

          <div className="recommended-list">
            <h3>Recommended Schemes</h3>

            {result.recommended_schemes?.length > 0 ? (
              result.recommended_schemes.map((scheme, index) => (
                <article className="scheme-result" key={index}>
                  <h4>{scheme.scheme}</h4>
                  <p>{scheme.reason}</p>

                  {isValidHttpUrl(scheme.official_website) && (
                    <a
                      href={scheme.official_website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit Official Website
                      <ExternalLink size={16} />
                    </a>
                  )}
                </article>
              ))
            ) : (
              <p className="no-matches">
                No confirmed preliminary matches. Check the assessment
                details and verify with the official scheme portal.
              </p>
            )}
          </div>

          <div className="eligibility-disclaimer">
            <ShieldCheck size={18} />
            <p>
              {result.disclaimer ||
                "This is a preliminary assessment only. Final eligibility is determined by the relevant government department."}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}

export default Eligibility;
