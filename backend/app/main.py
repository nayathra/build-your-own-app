import os
import time

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from google import genai
from google.genai import types

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise RuntimeError("GEMINI_API_KEY is missing from backend/.env")

client = genai.Client(api_key=API_KEY)

app = FastAPI(title="Build Your Own App API", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalyzeRequest(BaseModel):
    prompt: str = Field(min_length=3, max_length=4000)


class PlanItem(BaseModel):
    name: str
    purpose: str


class AppPlan(BaseModel):
    frontend: str
    backend: str
    data: str
    screens: list[PlanItem]
    architecture: list[PlanItem]
    apiEndpoints: list[PlanItem]


class ExplainData(BaseModel):
    frontend: str
    backend: str
    data: str
    technicalDecisions: list[PlanItem]
    components: list[PlanItem]


class LearningItem(BaseModel):
    title: str
    description: str


class AppLearning(BaseModel):
    path: list[LearningItem]
    exercises: list[LearningItem]


class AppUnderstanding(BaseModel):
    appName: str = Field(description="A concise product/app name")
    summary: str = Field(description="One sentence explaining what the user wants to build")
    users: str = Field(description="Primary target users")
    problem: str = Field(description="Main user problem being solved")
    goal: str = Field(description="Main product goal")
    features: list[str] = Field(description="Four to six important MVP features")
    plan: AppPlan
    explain: ExplainData
    learn: AppLearning


@app.get("/")
def root():
    return {"status": "ok", "service": "Build Your Own App API"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/api/analyze", response_model=AppUnderstanding)
def analyze(request: AnalyzeRequest):
    prompt = request.prompt.strip()
    if not prompt:
        raise HTTPException(status_code=400, detail="Please provide an app idea.")

    system_prompt = """
You are the product understanding and development planning engine for Build Your Own App.

Convert the user's natural-language app idea into one coherent MVP definition that supports this journey:
Prompt -> Understand -> Plan -> Build -> Explain -> Learn.

Rules:
- Stay faithful to the user's idea. Do not invent unrelated features.
- Infer only reasonable implementation details needed for a useful MVP.
- Return 4 to 6 high-value MVP features.
- Make the app name concise and memorable.
- Keep the plan practical for a student prototype.
- Choose a sensible frontend, backend and data approach for the selected idea.
- Screens should be concrete UI screens.
- Architecture should describe the main application layers/components.
- API endpoints should be useful planned endpoints, not imaginary existing endpoints.
- Explain technical decisions in beginner-friendly language.
- Learning steps must be specific to this app and should progress from small edits to real extensions.
- If a backend/API/database is unnecessary for the MVP, say so rather than forcing one.
"""

    full_prompt = f"""{system_prompt}

User app idea:
{prompt}"""

    # Try a small fallback chain so a temporary capacity spike does not block
    # the demo. The first available Flash model wins.
    models = [
        "gemini-3.8-flash",
        "gemini-3.7-flash",
        "gemini-3.6-flash",
        "gemini-3.5-flash-lite",
        "gemini-3.1-flash-lite",
    ]

    last_error = None

    for model_name in models:
        for attempt in range(2):
            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents=full_prompt,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        response_schema=AppUnderstanding,
                        temperature=0.3,
                    ),
                )

                if getattr(response, "parsed", None) is not None:
                    result = response.parsed
                    if isinstance(result, AppUnderstanding):
                        return result

                if not response.text:
                    raise ValueError("Gemini returned an empty response.")

                return AppUnderstanding.model_validate_json(response.text)

            except Exception as exc:
                last_error = exc
                message = str(exc).lower()
                transient = any(
                    code in message
                    for code in [
                        "503",
                        "unavailable",
                        "high demand",
                        "429",
                        "rate limit",
                        "resource exhausted",
                    ]
                )
                if transient and attempt < 1:
                    time.sleep(0.7)
                    continue
                break

    raise HTTPException(
        status_code=502,
        detail=f"Gemini analysis is temporarily unavailable. Please try again in a moment. Last error: {last_error}",
    )
