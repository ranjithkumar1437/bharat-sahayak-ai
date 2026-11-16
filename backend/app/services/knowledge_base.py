
import json
import re
from pathlib import Path


# Locate the project knowledge base
PROJECT_ROOT = Path(__file__).resolve().parents[3]
KNOWLEDGE_FILE = PROJECT_ROOT / "knowledge_base" / "schemes.json"


# Load government schemes from JSON
def load_schemes():
    try:
        with open(KNOWLEDGE_FILE, "r", encoding="utf-8") as file:
            schemes = json.load(file)

        if not isinstance(schemes, list):
            print("Knowledge base error: Expected a list of schemes.")
            return []

        return schemes

    except (FileNotFoundError, json.JSONDecodeError) as error:
        print("Knowledge base error:", error)
        return []

    except Exception as error:
        print("Unexpected knowledge base error:", error)
        return []


# Convert scheme details into searchable text
def get_scheme_text(scheme):
    fields = [
        scheme.get("name", ""),
        scheme.get("category", ""),
        scheme.get("description", ""),
        " ".join(scheme.get("benefits") or []),
        " ".join(scheme.get("eligibility") or []),
        " ".join(scheme.get("documents") or [])
    ]

    return " ".join(str(field) for field in fields).lower()


# Extract words from text
def tokenize(text):
    return set(re.findall(r"\w+", str(text).lower(), flags=re.UNICODE))


# Search schemes using lightweight keyword matching
def search_schemes(question: str, top_k: int = 3):

    if not question or not question.strip():
        return []

    try:
        schemes = load_schemes()

        if not schemes:
            return []

        question_words = tokenize(question)

        if not question_words:
            return []

        results = []

        for scheme in schemes:

            scheme_text = get_scheme_text(scheme)
            scheme_words = tokenize(scheme_text)

            # Calculate keyword similarity
            matched_words = question_words.intersection(scheme_words)

            score = len(matched_words) / len(question_words)

            # Keep relevant results
            if score >= 0.15:

                result = scheme.copy()

                result["similarity_score"] = round(score, 3)

                results.append(result)

        # Sort by highest similarity
        results.sort(
            key=lambda item: item["similarity_score"],
            reverse=True
        )

        return results[:max(0, top_k)]

    except Exception as error:
        print("Scheme search error:", error)
        return []


# Generate scheme information for the AI assistant
def get_scheme_context(question: str):

    matching_schemes = search_schemes(question)

    if not matching_schemes:
        return (
            "No matching scheme information found "
            "in the local knowledge base."
        )

    context = []

    for scheme in matching_schemes:

        context.append(f"""
Scheme: {scheme.get('name', 'Not available')}
Category: {scheme.get('category', 'Not available')}
Description: {scheme.get('description', 'Not available')}
Benefits: {', '.join(scheme.get('benefits') or [])}
Eligibility: {', '.join(scheme.get('eligibility') or [])}
Documents: {', '.join(scheme.get('documents') or [])}
Official Website: {scheme.get('application_url', 'Not available')}
Source: {scheme.get('source', 'Not available')}
Similarity Score: {scheme.get('similarity_score', 0)}
""")

    return "\n".join(context)
