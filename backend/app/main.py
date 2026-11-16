
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import API routers
from app.routers.documents import router as documents_router
from app.routers.eligibility import router as eligibility_router
from app.routers.assistant import router as assistant_router


# Create FastAPI application
app = FastAPI(
    title="Bharat Sahayak AI",
    description="AI-powered Government Scheme Assistance Platform",
    version="1.0.0"
)


# Enable frontend-backend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# Register AI agent routers
app.include_router(documents_router)
app.include_router(eligibility_router)
app.include_router(assistant_router)


# Home endpoint
@app.get("/")
def home():
    return {
        "message": "Welcome to Bharat Sahayak AI Backend",
        "status": "Running"
    }


# Health check endpoint
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "project": "Bharat Sahayak AI",
        "agents": [
            "Document Agent",
            "Eligibility Agent",
            "Application Guide",
            "AI Assistant"
        ]
    }
