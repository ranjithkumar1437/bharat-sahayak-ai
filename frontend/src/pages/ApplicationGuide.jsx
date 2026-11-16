
import { useState } from "react";
import {
  FileText,
  ExternalLink,
  CheckCircle2,
  ClipboardList,
  ShieldCheck
} from "lucide-react";

import "./ApplicationGuide.css";

const applicationSteps = {
  "PM-KISAN": [
    "Visit the official PM-KISAN website.",
    "Open the Farmers Corner section.",
    "Select New Farmer Registration.",
    "Enter the required details and submit.",
    "Follow the official instructions to complete verification."
  ],

  "Post Matric Scholarship": [
    "Visit the National Scholarship Portal.",
    "Create an account or log in.",
    "Select the relevant scholarship.",
    "Fill in the application form.",
    "Upload the required documents and submit."
  ],

  "PM Mudra Yojana": [
    "Visit an eligible bank or lending institution.",
    "Ask about the appropriate Mudra loan category.",
    "Collect the application form.",
    "Prepare the required business and identity documents.",
    "Submit the application to the lending institution."
  ],

  "Ayushman Bharat PM-JAY": [
    "Visit the official PM-JAY website.",
    "Use the beneficiary identification option.",
    "Check whether your family is listed.",
    "Follow the official instructions for verification.",
    "Contact an authorized helpdesk if assistance is needed."
  ]
};

const officialLinks = {
  "PM-KISAN": "https://pmkisan.gov.in/",
  "Post Matric Scholarship": "https://scholarships.gov.in/",
  "PM Mudra Yojana": "https://www.mudra.org.in/",
  "Ayushman Bharat PM-JAY": "https://pmjay.gov.in/"
};

function ApplicationGuide() {
  const [selectedScheme, setSelectedScheme] = useState("PM-KISAN");

  const steps = applicationSteps[selectedScheme];

  return (
    <main className="application-guide-page">

      {/* PAGE HEADER */}
      <section className="application-guide-heading">

        <div className="application-guide-badge">
          <ClipboardList size={15} />
          CITIZEN APPLICATION SUPPORT
        </div>

        <h1>Application Guide</h1>

        <p>
          Follow simple steps to understand how to apply
          for government schemes.
        </p>

      </section>

      {/* GUIDE CARD */}
      <section className="application-guide-card">

        {/* SCHEME SELECTION */}
        <div className="application-scheme-selector">

          <label htmlFor="scheme-select">
            <FileText size={19} />
            Select Government Scheme
          </label>

          <select
            id="scheme-select"
            value={selectedScheme}
            onChange={(e) => setSelectedScheme(e.target.value)}
          >
            {Object.keys(applicationSteps).map((scheme) => (
              <option key={scheme} value={scheme}>
                {scheme}
              </option>
            ))}
          </select>

        </div>

        {/* STEPS HEADING */}
        <div className="application-steps-heading">
          <div className="application-steps-icon">
            <ClipboardList size={21} />
          </div>

          <div>
            <h2>Steps to Apply</h2>
            <p>Follow these steps to understand the application process.</p>
          </div>
        </div>

        {/* APPLICATION STEPS */}
        <ol className="application-steps">

          {steps.map((step, index) => (
            <li key={`${selectedScheme}-${index}`}>

              <span className="application-step-number">
                {index + 1}
              </span>

              <span className="application-step-text">
                {step}
              </span>

              <CheckCircle2
                className="application-step-check"
                size={19}
              />

            </li>
          ))}

        </ol>

        {/* OFFICIAL WEBSITE BUTTON */}
        <div className="application-official-section">

          <a
            href={officialLinks[selectedScheme]}
            target="_blank"
            rel="noopener noreferrer"
            className="application-official-button"
          >
            <ExternalLink size={18} />
            Visit Official Website
          </a>

        </div>

        {/* DISCLAIMER */}
        <div className="application-guide-note">

          <ShieldCheck size={20} />

          <p>
            <strong>Important Note:</strong> These are general demo
            instructions. Check the official website for current
            eligibility, documents and application procedures.
          </p>

        </div>

      </section>

      {/* BOTTOM INFORMATION */}
      <p className="application-guide-footer">
        Bharat Sahayak AI – Helping citizens access government information.
      </p>

    </main>
  );
}

export default ApplicationGuide;
