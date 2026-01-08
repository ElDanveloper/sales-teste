class Category:
    def __init__(self, id: int, name: str):
        self.id = id
        self.name = name
    
    def to_dict(self):
        return {"id": self.id, "name": self.name}


class Product:
    def __init__(self, id: int, name: str, description: str = "", price: float = 0.0, 
                 brand: str = "", category_id: int = 0):
        self.id = id
        self.name = name
        self.description = description
        self.price = price
        self.brand = brand
        self.category_id = category_id
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "price": self.price,
            "brand": self.brand,
            "category_id": self.category_id
        }


class Sale:
    def __init__(self, id: int, product_id: int, quantity: int, total_price: float, date: str):
        self.id = id
        self.product_id = product_id
        self.quantity = quantity
        self.total_price = total_price
        self.date = date
    
    def to_dict(self):
        return {
            "id": self.id,
            "product_id": self.product_id,
            "quantity": self.quantity,
            "total_price": self.total_price,
            "date": self.date
        }