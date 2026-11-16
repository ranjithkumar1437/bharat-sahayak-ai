
def check_eligibility(
    age: int,
    state: str,
    occupation: str,
    annual_income: float,
    category: str,
    owns_cultivable_land=None,
    institutional_landholder=None,
    constitutional_post_holder=None,
    elected_representative=None,
    government_employee=None,
    government_employee_exempt_category=None,
    monthly_pension_10000_or_more=None,
    income_taxpayer=None,
    registered_professional_practicing=None,
    land_acquired_after_cutoff=None
):
    occupation_text = (occupation or "").strip().lower()

    assessments = []
    recommendations = []

    citizen_details = {
        "age": age,
        "state": state,
        "occupation": occupation,
        "annual_income": annual_income,
        "category": category
    }

    # PM-KISAN: Farmer assessment
    if "farmer" in occupation_text or "agricultur" in occupation_text:
        reasons = []
        missing_details = []

        if owns_cultivable_land is None:
            missing_details.append("Land ownership information is missing.")
        elif owns_cultivable_land is False:
            reasons.append("Cultivable land ownership condition is not met.")

        exclusion_checks = [
            (institutional_landholder, "Institutional landholder exclusion."),
            (constitutional_post_holder, "Constitutional post-holder exclusion."),
            (elected_representative, "Elected representative exclusion."),
            (monthly_pension_10000_or_more, "Monthly pension exclusion."),
            (income_taxpayer, "Income-taxpayer exclusion."),
            (registered_professional_practicing, "Practicing registered professional exclusion.")
        ]

        for answer, message in exclusion_checks:
            if answer is None:
                missing_details.append(message + " Needs verification.")
            elif answer is True:
                reasons.append(message)

        if government_employee is None:
            missing_details.append("Government employment status is unknown.")
        elif government_employee is True:
            if government_employee_exempt_category is None:
                missing_details.append("Government employee exemption status needs verification.")
            elif government_employee_exempt_category is False:
                reasons.append("Government employee exclusion may apply.")

        if land_acquired_after_cutoff is None:
            missing_details.append("Land acquisition date needs verification.")
        elif land_acquired_after_cutoff is True:
            missing_details.append("Land acquired after the applicable cutoff requires official verification.")

        if reasons:
            status = "not_eligible_under_reported_rules"
        elif missing_details:
            status = "manual_verification_required"
        else:
            status = "potentially_eligible"

        assessments.append({
            "scheme": "PM-KISAN",
            "status": status,
            "reasons": reasons,
            "missing_details": missing_details,
            "benefit": "Up to Rs. 6,000 per year, subject to official rules.",
            "official_website": "https://pmkisan.gov.in/"
        })

        if status == "potentially_eligible":
            recommendations.append({
                "scheme": "PM-KISAN",
                "reason": "Reported details passed the preliminary checks.",
                "status": status,
                "official_website": "https://pmkisan.gov.in/"
            })

    # Post Matric Scholarship
    if "student" in occupation_text:
        assessments.append({
            "scheme": "Post Matric Scholarship",
            "status": "potential_match",
            "reasons": [
                "Occupation is reported as student.",
                "Category, income, course and state conditions need verification."
            ]
        })

        recommendations.append({
            "scheme": "Post Matric Scholarship",
            "reason": "Potential student scholarship match.",
            "status": "potential_match",
            "official_website": "https://scholarships.gov.in/"
        })

    # PM Mudra Yojana
    if any(word in occupation_text for word in [
        "business", "self-employed", "entrepreneur", "shopkeeper"
    ]):
        assessments.append({
            "scheme": "PM Mudra Yojana",
            "status": "potential_match",
            "reasons": [
                "Occupation may match a business-related scheme.",
                "Loan approval depends on lender assessment."
            ]
        })

        recommendations.append({
            "scheme": "PM Mudra Yojana",
            "reason": "Potential business loan scheme match.",
            "status": "potential_match",
            "official_website": "https://www.mudra.org.in/"
        })

    return {
        "success": True,
        "citizen_details": citizen_details,
        "scheme_assessments": assessments,
        "recommended_schemes": recommendations,
        "total_matches": len(recommendations),
        "disclaimer": (
            "This is a preliminary AI assessment, not an official "
            "eligibility decision. Verify all conditions with the "
            "official government scheme portal."
        )
    }
