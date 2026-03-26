from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func as sa_func
import models, schemas


# ---------- Products ----------

def get_products(db: Session, category: str = None, search: str = None):
    q = db.query(models.Product)
    if category and category != "all":
        q = q.filter(models.Product.category == category)
    if search:
        q = q.filter(models.Product.name.ilike(f"%{search}%"))
    return q.all()


def seed_products(db: Session):
    """Insert default products if table is empty."""
    if db.query(models.Product).count() > 0:
        return
    defaults = [
        models.Product(id=1,  name="Wireless headphones",  price=2499, category="electronics", icon="🎧"),
        models.Product(id=2,  name="Cotton t-shirt",        price=499,  category="clothing",    icon="👕"),
        models.Product(id=3,  name="Python cookbook",       price=799,  category="books",       icon="📗"),
        models.Product(id=4,  name="Dark chocolate",        price=199,  category="food",        icon="🍫"),
        models.Product(id=5,  name="Mechanical keyboard",   price=3299, category="electronics", icon="⌨️"),
        models.Product(id=6,  name="Running shoes",         price=2199, category="clothing",    icon="👟"),
        models.Product(id=7,  name="Green tea pack",        price=349,  category="food",        icon="🍵"),
        models.Product(id=8,  name="Design thinking",       price=599,  category="books",       icon="📘"),
        models.Product(id=9,  name="USB-C hub",             price=1599, category="electronics", icon="🔌"),
        models.Product(id=10, name="Denim jacket",          price=1899, category="clothing",    icon="🧥"),
        models.Product(id=11, name="Almonds 500g",          price=449,  category="food",        icon="🥜"),
        models.Product(id=12, name="Clean code",            price=699,  category="books",       icon="📙"),
    ]
    db.bulk_save_objects(defaults)
    db.commit()


# ---------- Orders ----------

def _next_ref(db: Session) -> str:
    # Derive ref from max PK so it never collides even after failed attempts.
    # e.g. if max id = 2, next order gets #ORD-1003
    max_id = db.query(sa_func.max(models.Order.id)).scalar() or 0
    return f"#ORD-{1001 + max_id}"


def create_order(db: Session, data: schemas.OrderCreate):
    order_ref = _next_ref(db)
    order = models.Order(
        order_ref=order_ref,
        subtotal=data.subtotal,
        shipping=data.shipping,
        total=data.total,
        status="Processing",
    )
    db.add(order)
    db.flush()  # get order.id before inserting items

    for item in data.items:
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if not product:
            db.rollback()
            raise ValueError(f"Product {item.product_id} not found")
        order_item = models.OrderItem(
            order_id=order.id,
            product_id=item.product_id,
            product_name=product.name,
            price=product.price,
            quantity=item.quantity,
        )
        db.add(order_item)

    db.commit()

    # Re-query with joinedload so items are eagerly loaded before the session
    # closes — without this, lazy-loading inside Pydantic serialization raises
    # DetachedInstanceError, FastAPI returns 500, and it looks like nothing saved.
    return (
        db.query(models.Order)
        .options(joinedload(models.Order.items))
        .filter(models.Order.id == order.id)
        .first()
    )


def get_orders(db: Session):
    return (
        db.query(models.Order)
        .options(joinedload(models.Order.items))
        .order_by(models.Order.created_at.desc())
        .all()
    )


def get_order(db: Session, order_id: int):
    return (
        db.query(models.Order)
        .options(joinedload(models.Order.items))
        .filter(models.Order.id == order_id)
        .first()
    )