# ai-service/app.py
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from voice_utils import process_command

app = FastAPI()

# Allow frontend access (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "AI Service is running ✅"}

@app.post("/process")
async def process_text(request: Request):
    data = await request.json()
    text = data.get("text", "")
    response = process_command(text)
    return {"response": response}
