from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
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

# Cart endpoints (Simplified, needs auth in a real app)
@app.get("/cart", response_model=List[schemas.CartItemResponse])
def get_cart(db: Session = Depends(database.get_db)):
    # Mocking user_id = 1
    return db.query(models.CartItem).filter(models.CartItem.user_id == 1).all()

@app.post("/cart", response_model=schemas.CartItemResponse)
def add_to_cart(item: schemas.CartItemBase, db: Session = Depends(database.get_db)):
    # Mocking user_id = 1
    db_item = models.CartItem(user_id=1, product_id=item.product_id, quantity=item.quantity)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

# User endpoint
@app.get("/user/profile", response_model=schemas.UserResponse)
def get_profile(db: Session = Depends(database.get_db)):
    # Mocking user_id = 1
    user = db.query(models.User).filter(models.User.id == 1).first()
    if not user:
        # Create a mock user if not exists for demo purposes
        user = models.User(username="demo_user", email="demo@example.com", password="password")
        db.add(user)
        db.commit()
        db.refresh(user)
    return user
