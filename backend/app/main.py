from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import analysis

app = FastAPI(title="AI Portfolio Doctor")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analysis.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "AI Portfolio Doctor API is running"}

# Graceful shutdown hook to log shutdown events
@app.on_event("shutdown")
def shutdown_event():
    print("Shutting down AI Portfolio Doctor backend...")
