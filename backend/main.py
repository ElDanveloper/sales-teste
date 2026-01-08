from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import router

app = FastAPI(
    title="SmartMart Solutions API",
    description="API para gestão de vendas e produtos",
    version="1.0.0"
)

origins = [
    "http://localhost:5173", 
    "http://localhost:3000",  
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# rotas
app.include_router(router)

@app.get("/")
def read_root():
    return {"status": "online", "docs": "/docs", "data_storage": "JSON in memory"}