import os

class Settings:
    PROJECT_NAME: str = "TrustLayer Prototype"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./trustlayer.db")
    AMOY_RPC_URL: str = os.getenv("AMOY_RPC_URL", "https://rpc-amoy.polygon.technology")
    WALLET_PRIVATE_KEY: str = os.getenv("WALLET_PRIVATE_KEY", "")
    CONTRACT_ADDRESS: str = os.getenv("CONTRACT_ADDRESS", "")

settings = Settings()
