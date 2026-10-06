# Build Your Own App

An AI-guided development workspace that turns a natural-language app idea into an understandable development journey:

**Prompt → Understand → Plan → Build → Explain → Learn**

The goal is not to hide development behind one "generate" button. The prototype makes the intermediate reasoning visible so a learner can review requirements, inspect the plan, understand technical decisions, and learn how to extend the result.

## What the prototype does

1. **Understand** — Gemini converts the user's idea into an app definition with users, problem, goal and MVP features.
2. **Plan** — Gemini creates an app-specific technical blueprint covering platform, frontend, backend, data, screens, architecture and API/data contracts.
3. **Build** — the approved blueprint drives a simulated prototype-generation pipeline and preview.
4. **Explain** — the same generated plan is translated into beginner-friendly architecture, components and technical decisions.
5. **Learn** — Gemini-generated learning steps and exercises show how to modify and extend the specific app.

## Stack

- React + TypeScript + Vite
- FastAPI + Pydantic
- Google Gemini API
- lucide-react
- HTML/CSS for the workspace and prototype preview

## Project structure

```
build-your-own-app/
├── backend/
│   └── app/
│       └── main.py
├── frontend/
│   └── src/
│       ├── App.tsx
│       └── App.css
└── README.md
```

## Run locally

### 1. Backend

```bash
cd backend
python -m venv .venv
.venv\\Scripts\\activate
python -m pip install -r requirements.txt
```

Create `backend/.env`:

```env
GEMINI_API_KEY=your_key_here
```

Never commit the `.env` file or expose the API key in the frontend.

Start FastAPI:

```bash
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

## AI disclosure

This prototype uses the **Google Gemini API** for natural-language product understanding and structured development planning.

AI output is used for:
- product understanding
- MVP feature extraction
- technical planning
- architecture explanation
- app-specific learning guidance

The current **Build** stage is intentionally a prototype-generation simulation. It does not claim to generate and execute a complete production codebase from the model response.

## Security

- API keys stay in the backend `.env`.
- `.env` is excluded by the backend gitignore.
- The frontend communicates with the local FastAPI backend rather than storing the Gemini key in browser code.

## Assignment focus

The prototype is designed around the required learning-oriented workflow rather than a simple prompt-to-app generator. Each stage exposes a different part of the development process so the user can understand and continue building after the initial prototype.
