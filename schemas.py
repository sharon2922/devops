from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


# ---------- Products ----------

class Product(BaseModel):
    id: int
    name: str
    price: int
    category: str
    icon: str

    class Config:
        from_attributes = True


# ---------- Order Items ----------

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int


class OrderItemOut(BaseModel):
    id: int
    product_id: int
    product_name: str
    price: int
    quantity: int

    class Config:
        from_attributes = True


# ---------- Orders ----------

class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    subtotal: int
    shipping: int
    total: int


class OrderOut(BaseModel):
    id: int
    order_ref: str
    subtotal: int
    shipping: int
    total: int
    status: str
    created_at: datetime
    items: List[OrderItemOut]

    class Config:
        from_attributes = True
