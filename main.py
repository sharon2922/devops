from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List
import models, schemas, crud
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="ShopLite API", version="1.0.0")


#     testing auto deploy






app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    """Seed products table on first run."""
    db = next(get_db())
    crud.seed_products(db)


@app.get("/")
def root():
    """Serve the frontend with no-cache headers so updates are always picked up."""
    return FileResponse(
        "index.html",
        headers={
            "Cache-Control": "no-store, no-cache, must-revalidate",
            "Pragma": "no-cache",
        },
    )


# ── Products ──────────────────────────────────────────────────────────────────

@app.get("/products", response_model=List[schemas.Product])
def list_products(
    category: str = None,
    search: str = None,
    db: Session = Depends(get_db),
):
    return crud.get_products(db, category=category, search=search)


# ── Orders ────────────────────────────────────────────────────────────────────

@app.post("/orders", response_model=schemas.OrderOut, status_code=201)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    """Place a new order. Persists to PostgreSQL."""
    try:
        return crud.create_order(db, order)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/orders", response_model=List[schemas.OrderOut])
def list_orders(db: Session = Depends(get_db)):
    """Fetch all orders, newest first."""
    return crud.get_orders(db)


@app.get("/orders/{order_id}", response_model=schemas.OrderOut)
def get_order(order_id: int, db: Session = Depends(get_db)):
    """Fetch a single order by ID."""
    order = crud.get_order(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order