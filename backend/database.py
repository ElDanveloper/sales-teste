import json
import os
from typing import Dict, List, Any
from datetime import datetime

DATA_FILE = "/app/data/data.json"

DEFAULT_DATA = {
    "categories": [],
    "products": [],
    "sales": []
}

class DataManager:
    _instance = None
    _data: Dict[str, List[Any]] = DEFAULT_DATA.copy()
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._load_data()
        return cls._instance
    
    def _load_data(self):
        try:
            if os.path.exists(DATA_FILE):
                with open(DATA_FILE, 'r', encoding='utf-8') as f:
                    content = f.read().strip()
                    if content:
                        self._data = json.loads(content)
                    else:
                        self._data = DEFAULT_DATA.copy()
                        self._save_data()
            else:
                self._data = DEFAULT_DATA.copy()
                self._save_data()
        except (json.JSONDecodeError, ValueError):
            print(f"Erro ao carregar dados: arquivo JSON inválido ou vazio")
            self._data = DEFAULT_DATA.copy()
            self._save_data()
        except Exception as e:
            print(f"Erro ao carregar dados: {e}")
            self._data = DEFAULT_DATA.copy()
    
    def _save_data(self):
        try:
            os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
            with open(DATA_FILE, 'w', encoding='utf-8') as f:
                json.dump(self._data, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"Erro ao salvar dados: {e}")
    
    def get_categories(self) -> List[Dict]:
        return self._data.get("categories", [])
    
    def get_products(self) -> List[Dict]:
        return self._data.get("products", [])
    
    def get_sales(self) -> List[Dict]:
        return self._data.get("sales", [])
    
    def add_category(self, category: Dict) -> Dict:
        categories = self._data.get("categories", [])
        categories.append(category)
        self._data["categories"] = categories
        self._save_data()
        return category
    
    def add_product(self, product: Dict) -> Dict:
        products = self._data.get("products", [])
        products.append(product)
        self._data["products"] = products
        self._save_data()
        return product
    
    def add_sale(self, sale: Dict) -> Dict:
        sales = self._data.get("sales", [])
        sales.append(sale)
        self._data["sales"] = sales
        self._save_data()
        return sale
    
    def add_categories_bulk(self, categories: List[Dict]) -> int:
        # Evita duplicatas
        existing_ids = {c.get("id") for c in self._data.get("categories", [])}
        new_cats = [c for c in categories if c.get("id") not in existing_ids]
        self._data["categories"].extend(new_cats)
        self._save_data()
        return len(new_cats)
    
    def add_products_bulk(self, products: List[Dict]) -> int:
        # Evita duplicatas
        existing_ids = {p.get("id") for p in self._data.get("products", [])}
        new_prods = [p for p in products if p.get("id") not in existing_ids]
        self._data["products"].extend(new_prods)
        self._save_data()
        return len(new_prods)
    
    def add_sales_bulk(self, sales: List[Dict]) -> int:
        # Evita duplicatas
        existing_ids = {s.get("id") for s in self._data.get("sales", [])}
        new_sales = [s for s in sales if s.get("id") not in existing_ids]
        self._data["sales"].extend(new_sales)
        self._save_data()
        return len(new_sales)
    
    def delete_product(self, product_id: int):
        products = self._data.get("products", [])
        self._data["products"] = [p for p in products if p.get("id") != product_id]
        self._save_data()
    
    def update_sale(self, sale_id: int, updated_sale: Dict) -> Dict:
        sales = self._data.get("sales", [])
        for i, sale in enumerate(sales):
            if sale.get("id") == sale_id:
                # Preserva o product_id original
                updated = {**sale, **updated_sale}
                updated['product_id'] = sale.get('product_id')
                sales[i] = updated
                self._data["sales"] = sales
                self._save_data()
                return sales[i]
        return None
    
    def update_product(self, product_id: int, updated_product: Dict) -> Dict:
        products = self._data.get("products", [])
        for i, product in enumerate(products):
            if product.get("id") == product_id:
                products[i] = {**product, **updated_product}
                self._data["products"] = products
                self._save_data()
                return products[i]
        return None
    
    def update_category(self, category_id: int, updated_category: Dict) -> Dict:
        categories = self._data.get("categories", [])
        for i, category in enumerate(categories):
            if category.get("id") == category_id:
                categories[i] = {**category, **updated_category}
                self._data["categories"] = categories
                self._save_data()
                return categories[i]
        return None
    
    def get_dashboard_stats(self) -> Dict:
        sales = self._data.get("sales", [])
        total_sales = len(sales)
        total_revenue = sum(s.get("total_price", 0) for s in sales)
        return {
            "total_sales_count": total_sales,
            "total_revenue": total_revenue
        }

# Singleton
db = DataManager()

def get_db():
    return db