
import json
from pathlib import Path
from functools import lru_cache

import numpy as np
from sentence_transformers import SentenceTransformer


PROJECT_ROOT = Path(__file__).resolve().parents[3]
KNOWLEDGE_FILE = PROJECT_ROOT / "knowledge_base" / "schemes.json"

# Multilingual embedding model
MODEL_NAME = "paraphrase-multilingual-MiniLM-L12-v2"


@lru_cache(maxsize=1)
def get_model():
    print("Loading multilingual semantic search model...")
    return SentenceTransformer(MODEL_NAME)


def load_schemes():
    try:
        with open(KNOWLEDGE_FILE, "r", encoding="utf-8") as file:
            schemes = json.load(file)

        return schemes

    except (FileNotFoundError, json.JSONDecodeError) as error:
        print("Knowledge base error:", error)
        return []


def get_scheme_text(scheme):
    return " ".join([
        scheme.get("name", ""),
        scheme.get("category", ""),
        scheme.get("description", ""),
        " ".join(scheme.get("benefits", [])),
        " ".join(scheme.get("eligibility", [])),
        " ".join(scheme.get("documents", []))
    ])


@lru_cache(maxsize=1)
def get_scheme_embeddings():
    schemes = load_schemes()

    if not schemes:
        return [], None

    model = get_model()

    texts = [
        get_scheme_text(scheme)
        for scheme in schemes
    ]

    embeddings = model.encode(
        texts,
        convert_to_numpy=True,
        normalize_embeddings=True
    )

    return schemes, embeddings


def search_schemes(question: str, top_k: int = 3):
    if not question or not question.strip():
        return []

    try:
        schemes, scheme_embeddings = get_scheme_embeddings()

        if scheme_embeddings is None:
            return []

        model = get_model()

        question_embedding = model.encode(
            [question],
            convert_to_numpy=True,
            normalize_embeddings=True
        )[0]

        scores = np.dot(
            scheme_embeddings,
            question_embedding
        )

        ranked_indices = np.argsort(scores)[::-1]

        results = []

        for index in ranked_indices[:top_k]:
            score = float(scores[index])

            if score >= 0.25:
                scheme = schemes[index].copy()

                scheme["similarity_score"] = round(
                    score, 3
                )

                results.append(scheme)

        return results

    except Exception as error:
        print("Multilingual semantic search error:", error)
        return []


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
Scheme: {scheme.get('name')}
Category: {scheme.get('category')}
Description: {scheme.get('description')}
Benefits: {', '.join(scheme.get('benefits', []))}
Eligibility: {', '.join(scheme.get('eligibility', []))}
Documents: {', '.join(scheme.get('documents', []))}
Official Website: {scheme.get('application_url')}
Source: {scheme.get('source')}
Similarity Score: {scheme.get('similarity_score')}
""")

    return "\n".join(context)
