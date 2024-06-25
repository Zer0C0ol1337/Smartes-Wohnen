import serial
import logging
from fastapi import FastAPI
from starlette.staticfiles import StaticFiles
from pydantic import BaseModel
import mysql.connector

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Arduino Schnittstelle
SERIAL_PORT = 'COM3'
SERIAL_BAUDRATE = 9600
TIMEOUT = 1

# Versuch der Verbindung herzustellen zum Arduino
try:
    ser = serial.Serial(SERIAL_PORT, SERIAL_BAUDRATE, timeout=TIMEOUT)
    logging.info('Serial connection established on %s at %s baud rate', SERIAL_PORT, SERIAL_BAUDRATE)
except serial.SerialException as e:
    ser = None
    logging.error('Failed to open serial port: %s', e)

# Meine Request um daten vom Arduino zu bekommen
def get_temperature():
    if ser is None:
        logging.warning('Serial connection not available')
        return {'error': 'Serial connection not available'}

    try:
        ser.write(b'Request_Temperature')
        temperature_response = ser.readline().decode().strip()
        print(f"Received from Arduino: {temperature_response}") 
        if temperature_response:
            # Split the response at the colon and take the second part
            temperature = temperature_response.split(':')[1]
            return {'temperature': temperature}
        else:
            return {'error': 'Failed to retrieve temperature'}
    except Exception as e:
        logging.error('Failed to retrieve temperature: %s', e)
        return {'error': 'Failed to retrieve temperature'}

# MySQL connection parameters
MYSQL_HOST = 'localhost'
MYSQL_USER = 'dave'
MYSQL_PASSWORD = 'topstar14'
MYSQL_DATABASE = 'smart_fridge'

# Establish a MySQL connection
def get_mysql_connection():
    try:
        cnx = mysql.connector.connect(user=MYSQL_USER, password=MYSQL_PASSWORD,
                                      host=MYSQL_HOST, database=MYSQL_DATABASE)
        return cnx
    except mysql.connector.Error as err:
        logging.error('Failed to connect to MySQL: %s', err)
        return None

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/icons", StaticFiles(directory="icons"), name="icons")

# Function to add a product to the database
def add_product_to_db(product_name, quantity):
    cnx = get_mysql_connection()
    if cnx is None:
        return False

    cursor = cnx.cursor()
    add_product_query = ("INSERT INTO ist "
                         "(product_name, quantity) "
                         "VALUES (%s, %s)")
    product_data = (product_name, quantity)

    try:
        cursor.execute(add_product_query, product_data)
        cnx.commit()
        cursor.close()
        cnx.close()
        return True
    except mysql.connector.Error as err:
        logging.error('Failed to insert product into database: %s', err)
        return False

class Product(BaseModel):
    product_name: str
    quantity: int

@app.get("/get_temperature")
async def get_temperature_api():
    temperature = get_temperature()
    if 'temperature' in temperature:
        return {"temperature": temperature['temperature']}
    else:
        return {"error": "Failed to retrieve temperature"}

@app.post("/add_product")
async def add_product(product: Product):
    success = add_product_to_db(product.product_name, product.quantity)
    if success:
        return {"status": "Product added successfully"}
    else:
        return {"error": "Failed to add product"}

@app.get("/checkIngredients/{recipe}")
async def check_ingredients(recipe: str):
    cnx = get_mysql_connection()
    if cnx is None:
        return {"error": "Failed to connect to MySQL"}

    cursor = cnx.cursor()

    if recipe == 'Spaghetti mit Tomatensoße':
        ingredients = ['Spaghetti', 'Tomatensoße']
    else:
        return {"error": "Unbekanntes Rezept"}
    
    missing_ingredients = []
    for ingredient in ingredients:
        cursor.execute('SELECT * FROM ist WHERE product_name = %s', (ingredient,))
        result = cursor.fetchone()
        if not result:
            missing_ingredients.append(ingredient)
    
    cursor.close()
    cnx.close()

    if missing_ingredients:
        return {"status": "rot", "missing_ingredients": missing_ingredients}
    else:
        return {"status": "grün"}

# Webserver starten
if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="192.168.178.22", port=8000)