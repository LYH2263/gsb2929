from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

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

class CartItemResponse(CartItemBase):
    id: int
    product: ProductResponse
    class Config:
        from_attributes = True

class CartItemUpdate(BaseModel):
    quantity: int

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    class Config:
        from_attributes = True

class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    price: float
    product: ProductResponse
    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: int
    total: float
    created_at: datetime
    items: List[OrderItemResponse]
    class Config:
        from_attributes = True
