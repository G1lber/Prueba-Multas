import requests

# Consulta vía A2A 
resp = requests.post(
    "http://localhost:8000/consulta",
    json={
        "pregunta": "quiero ver mis multas",
        "cedula": "CC123456"
    }
)

print(resp.json())