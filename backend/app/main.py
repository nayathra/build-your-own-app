import logging
import os
import time

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from google import genai
from google.genai import types

load_dotenv()

logger = logging.getLogger(__name__)

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise RuntimeError("GEMINI_API_KEY is missing from backend/.env")

client = genai.Client(api_key=API_KEY)

app = FastAPI(title="Build Your Own App API", version="0.2.0")

frontend_url = os.getenv("FRONTEND_URL", "").rstrip("/")
allowed_origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
if frontend_url:
    allowed_origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
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
    name: str
    purpose: str


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


def normalize_actual_stack(result: AppUnderstanding) -> AppUnderstanding:
    """Keep Explain/Plan aligned with the technology actually shipped by this prototype."""
    actual_data = "No persistent database in the current prototype; structured AI output and client state drive the demo."

    result.plan.frontend = "React + TypeScript + Vite"
    result.plan.backend = "FastAPI + Python"
    result.plan.data = actual_data
    result.plan.architecture = [
        PlanItem(name="React + TypeScript + Vite builder", purpose="Renders the five-stage workspace and generated prototype preview in the browser."),
        PlanItem(name="FastAPI + Pydantic API", purpose="Accepts the app idea at /api/analyze and validates the structured AI response."),
        PlanItem(name="Gemini structured generation", purpose="Converts the natural-language idea into one structured Understand, Plan, Explain and Learn blueprint."),
        PlanItem(name="Client-side prototype renderer", purpose="Uses the approved blueprint to render a topic-aware website prototype without claiming to generate a production codebase."),
    ]
    result.plan.apiEndpoints = [
        PlanItem(name="POST /api/analyze", purpose="Converts an app idea into the structured product blueprint used by all five stages."),
        PlanItem(name="GET /health", purpose="Checks that the FastAPI service is healthy."),
    ]

    result.explain.frontend = "React + TypeScript + Vite renders the builder workspace, stage navigation and topic-aware prototype preview."
    result.explain.backend = "FastAPI + Python exposes /api/analyze, validates the structured response with Pydantic and calls the Gemini API."
    result.explain.data = actual_data
    result.explain.technicalDecisions = [
        PlanItem(name="Structured Gemini output", purpose="A Pydantic schema keeps one AI response consistent across Understand, Plan, Explain and Learn."),
        PlanItem(name="FastAPI boundary", purpose="The Gemini API key stays on the backend instead of being exposed in the browser."),
        PlanItem(name="Prototype simulation", purpose="Build renders a working website-like preview from the approved blueprint instead of pretending to generate and execute a full production codebase."),
        PlanItem(name="No persistent database", purpose="The assignment prototype does not require user accounts or stored application data, so the current demo keeps state in the client."),
    ]
    result.explain.components = [
        PlanItem(name="Builder workspace", purpose="Collects the app idea and guides the user through the five stages."),
        PlanItem(name="AI analysis endpoint", purpose="Produces the structured product blueprint from the natural-language prompt."),
        PlanItem(name="PrototypeWebsite", purpose="Renders topic-aware website content and the selected visual theme."),
        PlanItem(name="Explain and Learn views", purpose="Connects the generated blueprint to technical decisions and hands-on exercises."),
    ]
    return result


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
- The shipped prototype stack is fixed: React + TypeScript + Vite frontend, FastAPI + Python backend, Google Gemini API, and no persistent database.
- Never describe this shipped prototype as using Express, Node.js, PostgreSQL, MongoDB, Firebase, Next.js, or another stack unless the user explicitly asked for a separate future architecture.
- In Explain, describe the actual shipped prototype stack, not a hypothetical production stack.
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
                        return normalize_actual_stack(result)

                if not response.text:
                    raise ValueError("Gemini returned an empty response.")

                return normalize_actual_stack(AppUnderstanding.model_validate_json(response.text))

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

    logger.exception("Gemini analysis failed after all configured model retries. Last error: %s", last_error)
    raise HTTPException(
        status_code=502,
        detail="AI analysis is temporarily unavailable.",
    )
