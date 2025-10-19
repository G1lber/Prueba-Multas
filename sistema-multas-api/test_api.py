import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    """Test de salud de la API"""
    response = requests.get(f"{BASE_URL}/health")
    print("Health Check:", response.json())

def test_camaras():
    """Test de consulta de cámaras"""
    response = requests.get(f"{BASE_URL}/camaras")
    print("\nCámaras:", json.dumps(response.json(), indent=2))

def test_multas():
    """Test de consulta de multas"""
    data = {"cedula": "CC123456"}
    response = requests.post(f"{BASE_URL}/multas/consultar", json=data)
    print("\nMultas:", json.dumps(response.json(), indent=2))

def test_consulta_agente():
    """Test del sistema de agentes"""
    data = {
        "pregunta": "¿Cómo puedo pagar mis multas?",
        "cedula": "CC123456"
    }
    response = requests.post(f"{BASE_URL}/consulta", json=data)
    print("\nRespuesta del Agente:", json.dumps(response.json(), indent=2))

def test_descuento():
    """Test de cálculo de descuento"""
    data = {"monto": 250000, "dias": 5}
    response = requests.post(f"{BASE_URL}/multas/calcular-descuento", json=data)
    print("\nDescuento:", json.dumps(response.json(), indent=2))

if __name__ == "__main__":
    print("🧪 Probando API de Multas...\n")
    test_health()
    test_camaras()
    test_multas()
    test_consulta_agente()
    test_descuento()
    print("\n✅ Todos los tests completados")