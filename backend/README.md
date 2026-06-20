# ELD Trip Planner - Backend

Django REST API for HOS-compliant trip planning.

## Setup

```bash
# 1. Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS / Linux

# 2. Install dependencies
pip install -r requirements.txt

# 3. Create .env from the example
copy .env.example .env       # Windows
# cp .env.example .env       # macOS / Linux
# Then edit .env and fill in your SECRET_KEY and OPENROUTE_API_KEY

# 4. Run the development server
python manage.py runserver
```

## Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/health/` | Health check - returns `{"status": "ok"}` |
| POST | `/api/trip/plan/` | Plan a trip and return HOS logs |

### POST `/api/trip/plan/` request body

```json
{
  "current_location": "Chicago, IL",
  "pickup_location": "St. Louis, MO",
  "dropoff_location": "Dallas, TX",
  "current_cycle_used": 20
}
```

## Running tests

```bash
python manage.py test trip.tests
```

