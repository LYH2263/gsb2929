from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    image_url: str
    stock: int
    category: str

class ProductResponse(ProductBase):
    id: int
    class Config:
        from_attributes = True

class CartItemBase(BaseModel):
    product_id: int
    quantity: int

class CartItemUpdate(BaseModel):
    quantity: int

class CartItemResponse(CartItemBase):
    id: int
    product: ProductResponse
    class Config:
        from_attributes = True

class OrderItemBase(BaseModel):
    product_id: int
    quantity: int
    price: float

class OrderItemResponse(OrderItemBase):
    id: int
    product: ProductResponse
    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    items: List[CartItemBase]

class OrderResponse(BaseModel):
    id: str
    user_id: int
    total: float
    date: datetime
    status: str
    items: List[OrderItemResponse]
    class Config:
        from_attributes = True

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    class Config:
        from_attributes = True
