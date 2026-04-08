# ShopLite — FastAPI + PostgreSQL Backend

## Project Structure

```
shoplite-backend/
├── main.py           # FastAPI app, routes
├── database.py       # SQLAlchemy engine + session
├── models.py         # DB table definitions
├── schemas.py        # Pydantic request/response models
├── crud.py           # DB queries & business logic
├── requirements.txt
├── .env.example
└── ecommerce_app.html  # Updated frontend (points to API)
```

## Quick Start

### 1. Create & activate a virtual environment
```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Create the PostgreSQL database
```sql
CREATE DATABASE shoplite;
```

### 4. Configure the connection
```bash
cp .env.example .env
# Edit .env — set DATABASE_URL to match your Postgres credentials
```
The app reads `DATABASE_URL` from `.env` automatically via `python-dotenv`.  
Default value if the env var is missing:
```
postgresql://postgres:password@localhost:5432/shoplite
```

### 5. Run the server
```bash
uvicorn main:app --reload
```
API will be live at **http://localhost:8000**

### 6. Open the frontend
Open `ecommerce_app.html` in your browser.  
The frontend's `const API = "http://localhost:8000"` points to your running server.

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/products` | List all products |
| GET | `/products?category=electronics` | Filter by category |
| GET | `/products?search=keyboard` | Search by name |
| POST | `/orders` | Place a new order |
| GET | `/orders` | Get all past orders (newest first) |
| GET | `/orders/{id}` | Get a single order |

Interactive API docs: **http://localhost:8000/docs**

---

## POST /orders — Request Body

```json
{
  "subtotal": 3298,
  "shipping": 0,
  "total": 3298,
  "items": [
    { "product_id": 1, "quantity": 1 },
    { "product_id": 4, "quantity": 3 }
  ]
}
```

---

## Notes
- Products are auto-seeded on first startup (no manual SQL needed).
- Order items snapshot the product name & price at the time of purchase, so historical orders stay accurate even if prices change later.
- Free shipping applies when subtotal > ₹2,000.
