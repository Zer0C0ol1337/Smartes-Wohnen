import serial
import time
from fastapi import FastAPI
from starlette.staticfiles import StaticFiles
from starlette.requests import Request
from typing import Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Define serial port settings
SERIAL_PORT = 'COM3'
SERIAL_BAUDRATE = 9600
TIMEOUT = 1

# Initialize serial communication
try:
    ser = serial.Serial(SERIAL_PORT, SERIAL_BAUDRATE, timeout=TIMEOUT)
    logging.info('Serial connection established on %s at %s baud rate', SERIAL_PORT, SERIAL_BAUDRATE)
except serial.SerialException as e:
    logging.error('Failed to open serial port: %s', e)
    exit()

# Define functions for handling requests


def get_temperature():
    try:
        ser.write(b'Request_Temperature')
        temperature_response = ser.readline().decode().strip()

        if temperature_response.startswith('temp:'):
            temperature_value = temperature_response.split(':')[1]
            logging.info('Received temperature: %s', temperature_value)
            return temperature_value
        else:
            raise ValueError('Invalid temperature response')

    except serial.SerialException:
        logging.error('Error communicating with Arduino during temperature request')
        return None

    except ValueError:
        logging.error('Invalid temperature data received: %s', temperature_response)
        return None


app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/get_temperature")
async def get_temperature_api():
    temperature = get_temperature()
    if temperature is not None:
        return {temperature}
    else:
        return {"error": "Failed to retrieve temperature"}

# Webserver starten
if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
