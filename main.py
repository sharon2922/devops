from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator
from sqlalchemy.orm import Session
from typing import List
import models, schemas, crud
from database import engine, get_db
from fastapi import UploadFile, File
from s3 import upload_image_to_s3
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="ShopLite API", version="1.0.0")
Instrumentator().instrument(app).expose(app)
# updated deployment flow 
# updated deployment flow 2
# updated deployment flow 3
#4
#5
#6
#7
#9
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

#testing for the flow
@app.on_event("startup")
def startup():
    """Seed products table on first run."""
    db = next(get_db())
    crud.seed_products(db)

'''
@app.get("/")
def root():
    """Serve the frontend with no-cache headers so updates are always picked up."""
    return FileResponse(
        "index.html",
        headers={
            "Cache-Control": "no-store, no-cache, must-revalidate",
            "Pragma": "no-cache",
        },
    )'''


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



@app.post("/products/{product_id}/image")
def upload_product_image(
    product_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    filename = f"products/{product_id}-{file.filename}"
    url = upload_image_to_s3(file.file, filename)
    
    product.image_url = url
    db.commit()
    
    return {"image_url": url}