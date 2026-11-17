
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import API routers
from app.routers.documents import router as documents_router
from app.routers.eligibility import router as eligibility_router
from app.routers.assistant import router as assistant_router

# Create FastAPI application
app = FastAPI(
    title="Bharat Sahayak AI",
    description="Multilingual AI-Powered Government Welfare Scheme Assistant",
    version="1.0.0"
)

# CORS configuration
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://bharat-sahayak-ai-rwyy.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Register API routers
app.include_router(documents_router)
app.include_router(eligibility_router)
app.include_router(assistant_router)


# Home endpoint
@app.get("/")
def home():
    return {
        "message": "Welcome to Bharat Sahayak AI Backend",
        "project": "Bharat Sahayak AI",
        "status": "Running",
        "version": "1.0.0"
    }


# Health check endpoint
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "project": "Bharat Sahayak AI",
        "powered_by": "Gemini AI",
        "agents": [
            "Document Agent",
            "Eligibility Agent",
            "Application Guide",
            "AI Assistant"
        ]
    }


# API status endpoint
@app.get("/api/status")
def api_status():
    return {
        "success": True,
        "message": "Bharat Sahayak AI API is running",
        "services": {
            "documents": "registered",
            "eligibility": "registered",
            "assistant": "registered",
            "schemes": "not yet implemented"
        }
    }
