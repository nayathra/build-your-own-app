# Build Your Own App — Backend

FastAPI backend for the Gemini-powered app-understanding stage.

## Run

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
python -m pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Create `backend/.env` with your Gemini key. Never commit `.env`.
