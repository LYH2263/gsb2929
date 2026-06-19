from sqlalchemy import Column, Integer, String, Text, DECIMAL, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    password = Column(String(255))
    email = Column(String(100), unique=True, index=True)

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    description = Column(Text)
    price = Column(DECIMAL(10, 2))
    image_url = Column(String(255))
    stock = Column(Integer, default=0)
    category = Column(String(50))
    cart_items = relationship("CartItem", back_populates="product")

class CartItem(Base):
    __tablename__ = "cart_items"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer, default=1)
    product = relationship("Product", back_populates="cart_items")

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    total = Column(DECIMAL(10, 2), default=0)
    created_at = Column(DateTime, server_default=func.now())
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer, default=1)
    price = Column(DECIMAL(10, 2), default=0)
    order = relationship("Order", back_populates="items")
    product = relationship("Product")
