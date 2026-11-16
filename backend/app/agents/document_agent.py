
import re


def analyze_document(text: str):
    if not text or not text.strip():
        return {
            "success": False,
            "document_type": "Unknown",
            "checks": {},
            "missing_items": [],
            "message": "No document text found."
        }

    content = text.lower()

    # Identify document type using specific document phrases
    if "income certificate" in content:
        document_type = "Income Certificate"

    elif "caste certificate" in content:
        document_type = "Caste Certificate"

    elif "pm-kisan" in content or "farmer" in content:
        document_type = "Farmer / PM-KISAN Document"

    elif "aadhaar card" in content or "uidai" in content:
        document_type = "Aadhaar Card"

    elif "bank statement" in content:
        document_type = "Bank Document"

    else:
        document_type = "General Document"

    # Basic text checks
    checks = {
        "Name mentioned": bool(
            re.search(r"\bname\b", content)
        ),
        "Date mentioned": bool(
            re.search(r"\bdate\b", content)
        ),
        "Document purpose mentioned": bool(
            re.search(r"\bpurpose\b", content)
        )
    }

    missing_items = [
        item
        for item, found in checks.items()
        if not found
    ]

    return {
        "success": True,
        "document_type": document_type,
        "checks": checks,
        "missing_items": missing_items,
        "message": "Demo document analysis completed.",
        "disclaimer": (
            "This is a basic rule-based demo, "
            "not official document verification."
        )
    }
