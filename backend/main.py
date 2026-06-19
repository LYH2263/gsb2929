from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import time
import models, schemas, database

# Create tables if they don't exist
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="E-commerce API")

# CORS middleware to allow the frontend to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MOCK_USER_ID = 1

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "欢迎访问 LUXE精选 API"}

# Products endpoints
@app.get("/products", response_model=List[schemas.ProductResponse])
def get_products(db: Session = Depends(database.get_db)):
    return db.query(models.Product).all()

@app.get("/products/{product_id}", response_model=schemas.ProductResponse)
def get_product(product_id: int, db: Session = Depends(database.get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

# Cart endpoints
@app.get("/cart", response_model=List[schemas.CartItemResponse])
def get_cart(db: Session = Depends(database.get_db)):
    return db.query(models.CartItem).filter(models.CartItem.user_id == MOCK_USER_ID).all()

@app.post("/cart", response_model=schemas.CartItemResponse)
def add_to_cart(item: schemas.CartItemBase, db: Session = Depends(database.get_db)):
    existing = db.query(models.CartItem).filter(
        models.CartItem.user_id == MOCK_USER_ID,
        models.CartItem.product_id == item.product_id
    ).first()
    if existing:
        existing.quantity += item.quantity
        db.commit()
        db.refresh(existing)
        return existing
    db_item = models.CartItem(user_id=MOCK_USER_ID, product_id=item.product_id, quantity=item.quantity)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.put("/cart/{item_id}", response_model=schemas.CartItemResponse)
def update_cart_item(item_id: int, item: schemas.CartItemUpdate, db: Session = Depends(database.get_db)):
    db_item = db.query(models.CartItem).filter(
        models.CartItem.id == item_id,
        models.CartItem.user_id == MOCK_USER_ID
    ).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    db_item.quantity = item.quantity
    db.commit()
    db.refresh(db_item)
    return db_item

@app.delete("/cart/{item_id}")
def delete_cart_item(item_id: int, db: Session = Depends(database.get_db)):
    db_item = db.query(models.CartItem).filter(
        models.CartItem.id == item_id,
        models.CartItem.user_id == MOCK_USER_ID
    ).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    db.delete(db_item)
    db.commit()
    return {"success": True}

@app.delete("/cart")
def clear_cart(db: Session = Depends(database.get_db)):
    db.query(models.CartItem).filter(models.CartItem.user_id == MOCK_USER_ID).delete()
    db.commit()
    return {"success": True}

# Orders endpoints
@app.get("/orders", response_model=List[schemas.OrderResponse])
def get_orders(db: Session = Depends(database.get_db)):
    return db.query(models.Order).filter(models.Order.user_id == MOCK_USER_ID).order_by(models.Order.date.desc()).all()

@app.post("/orders", response_model=schemas.OrderResponse)
def create_order(order_data: schemas.OrderCreate, db: Session = Depends(database.get_db)):
    total = 0.0
    order_items = []
    for item in order_data.items:
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        price = float(product.price)
        total += price * item.quantity
        order_items.append(models.OrderItem(
            product_id=item.product_id,
            product_name=product.name,
            product_image=product.image_url,
            product_price=price,
            quantity=item.quantity
        ))
    order_no = f"ORD{int(time.time())}"
    db_order = models.Order(
        user_id=MOCK_USER_ID,
        order_no=order_no,
        total=total,
        items=order_items
    )
    db.add(db_order)
    db.query(models.CartItem).filter(models.CartItem.user_id == MOCK_USER_ID).delete()
    db.commit()
    db.refresh(db_order)
    return db_order

# User endpoint
@app.get("/user/profile", response_model=schemas.UserResponse)
def get_profile(db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.id == MOCK_USER_ID).first()
    if not user:
        user = models.User(username="demo_user", email="demo@example.com", password="password")
        db.add(user)
        db.commit()
        db.refresh(user)
    return user
