from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload
from datetime import datetime
from typing import List
import models, schemas, database

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="E-commerce API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MOCK_USER_ID = 1

def _ensure_demo_user(db: Session):
    user = db.query(models.User).filter(models.User.id == MOCK_USER_ID).first()
    if not user:
        user = models.User(id=MOCK_USER_ID, username="demo_user", email="demo@example.com", password="password")
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

@app.get("/")
def read_root():
    return {"message": "欢迎访问 LUXE精选 API"}

@app.get("/products", response_model=List[schemas.ProductResponse])
def get_products(db: Session = Depends(database.get_db)):
    return db.query(models.Product).all()

@app.get("/products/{product_id}", response_model=schemas.ProductResponse)
def get_product(product_id: int, db: Session = Depends(database.get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.get("/cart", response_model=List[schemas.CartItemResponse])
def get_cart(db: Session = Depends(database.get_db)):
    _ensure_demo_user(db)
    items = (
        db.query(models.CartItem)
        .options(joinedload(models.CartItem.product))
        .filter(models.CartItem.user_id == MOCK_USER_ID)
        .all()
    )
    return items

@app.post("/cart", response_model=schemas.CartItemResponse)
def add_to_cart(item: schemas.CartItemBase, db: Session = Depends(database.get_db)):
    _ensure_demo_user(db)
    existing = (
        db.query(models.CartItem)
        .filter(
            models.CartItem.user_id == MOCK_USER_ID,
            models.CartItem.product_id == item.product_id,
        )
        .first()
    )
    if existing:
        existing.quantity += item.quantity
        db.commit()
        db.refresh(existing)
        db_item = existing
    else:
        db_item = models.CartItem(user_id=MOCK_USER_ID, product_id=item.product_id, quantity=item.quantity)
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
    db_item = (
        db.query(models.CartItem)
        .options(joinedload(models.CartItem.product))
        .filter(models.CartItem.id == db_item.id)
        .first()
    )
    return db_item

@app.put("/cart/{item_id}", response_model=schemas.CartItemResponse)
def update_cart_item(item_id: int, payload: schemas.CartItemUpdate, db: Session = Depends(database.get_db)):
    cart_item = (
        db.query(models.CartItem)
        .options(joinedload(models.CartItem.product))
        .filter(models.CartItem.id == item_id, models.CartItem.user_id == MOCK_USER_ID)
        .first()
    )
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    if payload.quantity <= 0:
        db.delete(cart_item)
        db.commit()
        raise HTTPException(status_code=404, detail="Cart item removed")
    cart_item.quantity = payload.quantity
    db.commit()
    db.refresh(cart_item)
    return cart_item

@app.delete("/cart/{item_id}")
def remove_cart_item(item_id: int, db: Session = Depends(database.get_db)):
    cart_item = (
        db.query(models.CartItem)
        .filter(models.CartItem.id == item_id, models.CartItem.user_id == MOCK_USER_ID)
        .first()
    )
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    db.delete(cart_item)
    db.commit()
    return {"success": True}

@app.delete("/cart")
def clear_cart(db: Session = Depends(database.get_db)):
    (
        db.query(models.CartItem)
        .filter(models.CartItem.user_id == MOCK_USER_ID)
        .delete(synchronize_session=False)
    )
    db.commit()
    return {"success": True}

@app.post("/orders", response_model=schemas.OrderCreateResponse)
def create_order(db: Session = Depends(database.get_db)):
    _ensure_demo_user(db)
    cart_items = (
        db.query(models.CartItem)
        .options(joinedload(models.CartItem.product))
        .filter(models.CartItem.user_id == MOCK_USER_ID)
        .all()
    )
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")
    total = 0.0
    for ci in cart_items:
        total += float(ci.product.price) * ci.quantity
    order = models.Order(
        user_id=MOCK_USER_ID,
        total=total,
        status="paid",
        created_at=datetime.now(),
    )
    db.add(order)
    db.flush()
    for ci in cart_items:
        oi = models.OrderItem(
            order_id=order.id,
            product_id=ci.product_id,
            product_name=ci.product.name,
            product_image=ci.product.image_url,
            product_category=ci.product.category,
            quantity=ci.quantity,
            price=float(ci.product.price),
        )
        db.add(oi)
    db.query(models.CartItem).filter(models.CartItem.user_id == MOCK_USER_ID).delete(synchronize_session=False)
    db.commit()
    return {"order_id": order.id, "total": total, "status": order.status}

@app.get("/orders", response_model=List[schemas.OrderResponse])
def get_orders(db: Session = Depends(database.get_db)):
    _ensure_demo_user(db)
    orders = (
        db.query(models.Order)
        .options(joinedload(models.Order.items))
        .filter(models.Order.user_id == MOCK_USER_ID)
        .order_by(models.Order.id.desc())
        .all()
    )
    return orders

@app.get("/user/profile", response_model=schemas.UserResponse)
def get_profile(db: Session = Depends(database.get_db)):
    return _ensure_demo_user(db)
