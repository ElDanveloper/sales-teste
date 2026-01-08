from pydantic import BaseModel
from typing import Optional, List
from datetime import date

# categorias
class CategoryBase(BaseModel):
    name: str

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(BaseModel):
    id: int
    name: str
    
    class Config:
        from_attributes = True

# produtos
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    brand: Optional[str] = None
    category_id: int

class ProductCreate(ProductBase):
    pass

class ProductResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    price: float
    brand: Optional[str] = None
    category_id: int
    
    class Config:
        from_attributes = True

# vendas
class SaleBase(BaseModel):
    product_id: int
    quantity: int
    total_price: float
    date: str

class SaleCreate(SaleBase):
    pass

class SaleResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    total_price: float
    date: str
    
    class Config:
        from_attributes = True

# dashboard
class DashboardStats(BaseModel):
    total_sales_count: int
    total_revenue: float