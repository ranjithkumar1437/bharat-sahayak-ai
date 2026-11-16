
import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from google import genai

from app.services.knowledge_base import search_schemes


# Load environment variables from backend/.env
BASE_DIR = Path(__file__).resolve().parents[2]
ENV_FILE = BASE_DIR / ".env"

load_dotenv(dotenv_path=ENV_FILE, override=True)


# Create API router
router = APIRouter(
    prefix="/api/assistant",
    tags=["AI Assistant"]
)


# Supported languages
SUPPORTED_LANGUAGES = [
    "English",
    "Telugu",
    "Hindi",
    "Tamil",
    "Kannada",
    "Malayalam",
    "Marathi",
    "Bengali"
]


# Request model
class ChatRequest(BaseModel):
    question: str
    language: str = "English"


# System instructions
SYSTEM_PROMPT = """
You are Bharat Sahayak AI, a helpful assistant for Indian citizens.

Your responsibilities:
1. Explain Indian government welfare schemes.
2. Explain preliminary eligibility requirements.
3. Explain commonly required documents.
4. Provide general application guidance.
5. Respond in the language requested by the user.

Important rules:
- Use simple and understandable language.
- Never guarantee scheme eligibility or approval.
- Never claim to submit an application.
- Never invent government scheme rules, benefits or deadlines.
- Use retrieved knowledge base information when relevant.
- Treat knowledge base information as reference data,
  not as proof of current official rules.
- Do not claim that a scheme is officially verified.
- If information is missing, clearly say so.
- Do not invent missing details.
- Recommend official government websites for verification.
- Do not request Aadhaar numbers, bank passwords or OTPs.
- Keep answers clear, structured and helpful.
- Keep official scheme names and website links unchanged.
"""


def build_scheme_context(schemes):
    """Build context using the retrieved scheme records."""

    if not schemes:
        return "No relevant scheme records were retrieved."

    context = []

    for scheme in schemes:
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


# AI Assistant Chat API
@router.post("/chat")
def chat_with_assistant(request: ChatRequest):

    # Step 1: Validate question
    question = request.question.strip()

    if not question:
        raise HTTPException(
            status_code=400,
            detail="Please enter your question."
        )

    # Step 2: Validate selected language
    selected_language = request.language.strip().title()

    if selected_language not in SUPPORTED_LANGUAGES:
        raise HTTPException(
            status_code=400,
            detail="Unsupported language. Please select a supported language."
        )

    # Step 3: Get Gemini API key
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="Gemini API key is missing. Check backend/.env configuration."
        )

    try:
        # Step 4: Retrieve relevant schemes using semantic search
        matching_schemes = search_schemes(question)

        scheme_context = build_scheme_context(matching_schemes)

        knowledge_base_used = len(matching_schemes) > 0

        # Step 5: Initialize Gemini
        client = genai.Client(api_key=api_key)

        # Step 6: Prepare Gemini prompt
        prompt = f"""
{SYSTEM_PROMPT}

Respond entirely in this language: {selected_language}.
Do not switch to another language.

Use numbered steps when explaining procedures.
Explain technical terms simply.

RETRIEVED GOVERNMENT SCHEME INFORMATION:

{scheme_context}

IMPORTANT INSTRUCTIONS:

1. Use retrieved scheme information when relevant.
2. Do not change scheme benefits, eligibility conditions,
   documents or official website links from the supplied data.
3. Similarity scores indicate text similarity only.
   They do not prove eligibility or factual correctness.
4. Do not assume retrieved information is complete or current.
5. If no relevant scheme records were retrieved,
   do not pretend that the knowledge base contains an answer.
6. For unrelated questions, provide appropriate general guidance.
7. Do not invent missing scheme details.
8. Recommend official government websites for verification.

CITIZEN'S QUESTION:

{question}
"""

        # Step 7: Generate Gemini response
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        answer = response.text

        if not answer or not answer.strip():
            raise HTTPException(
                status_code=502,
                detail="The AI could not generate a response. Please try again."
            )

        # Step 8: Prepare retrieved scheme details
        retrieved_schemes = [
            {
                "name": scheme.get("name"),
                "similarity_score": scheme.get("similarity_score")
            }
            for scheme in matching_schemes
        ]

        # Step 9: Return API response
        return {
            "success": True,
            "question": question,
            "language": selected_language,
            "answer": answer,
            "knowledge_base_used": knowledge_base_used,
            "retrieved_schemes": retrieved_schemes,
            "powered_by": "Google Gemini + Semantic Search + Local Knowledge Base",
            "disclaimer": (
                "This assistant provides general guidance only. "
                "It does not confirm official eligibility or guarantee "
                "scheme approval. Verify important information through "
                "official government websites."
            )
        }

    except HTTPException:
        raise

    except Exception as error:
        print("Gemini or semantic search error:", str(error))

        raise HTTPException(
            status_code=502,
            detail=(
                "AI assistant service error. Check Gemini API access, "
                "semantic search configuration and backend settings."
            )
        )
