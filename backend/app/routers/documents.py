
from fastapi import APIRouter, UploadFile, File, HTTPException
from pypdf import PdfReader
from pdf2image import convert_from_bytes
from PIL import Image
from pytesseract import image_to_string
from io import BytesIO
import pytesseract

from app.agents.document_agent import analyze_document

router = APIRouter(
    prefix="/api/documents",
    tags=["Document Agent"]
)

MAX_FILE_SIZE = 10 * 1024 * 1024

ALLOWED_TYPES = {
    "application/pdf",
    "image/jpeg",
    "image/png"
}

# Windows OCR application paths
pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)

POPPLER_PATH = (
    r"C:\Users\D Ranjith kumar\Downloads"
    r"\Release-26.09.0-0\poppler-26.09.0"
    r"\Library\bin"
)


def extract_pdf_text(content):
    extracted_text = ""

    # First try normal PDF text extraction
    try:
        pdf = PdfReader(BytesIO(content))
        extracted_text = "\n".join(
            page.extract_text() or ""
            for page in pdf.pages
        )
    except Exception:
        extracted_text = ""

    # If PDF is scanned, use OCR
    if not extracted_text.strip():
        pages = convert_from_bytes(
            content,
            poppler_path=POPPLER_PATH
        )

        extracted_text = "\n".join(
            image_to_string(page)
            for page in pages
        )

    return extracted_text


def extract_image_text(content):
    image = Image.open(BytesIO(content))
    return image_to_string(image)


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    try:
        if file.content_type not in ALLOWED_TYPES:
            raise HTTPException(
                status_code=400,
                detail="Only PDF, JPG and PNG files are allowed."
            )

        content = await file.read(MAX_FILE_SIZE + 1)

        if not content:
            raise HTTPException(
                status_code=400,
                detail="The uploaded file is empty."
            )

        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail="File size must not exceed 10 MB."
            )

        try:
            if file.content_type == "application/pdf":
                extracted_text = extract_pdf_text(content)

            else:
                extracted_text = extract_image_text(content)

        except Exception as error:
            print("OCR error:", str(error))

            raise HTTPException(
                status_code=400,
                detail=(
                    "Unable to extract text. "
                    "Check the uploaded file and OCR configuration."
                )
            )

        analysis = analyze_document(extracted_text)

        return {
            "success": True,
            "message": "Document processed successfully",
            "filename": file.filename,
            "size_bytes": len(content),
            "content_type": file.content_type,
            "status": (
                "text_extracted"
                if extracted_text.strip()
                else "no_text_found"
            ),
            "extracted_text": extracted_text,
            "analysis": analysis,
            "ocr_enabled": True,
            "storage": "temporary_memory_only"
        }

    finally:
        await file.close()
