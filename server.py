from http.server import BaseHTTPRequestHandler, HTTPServer
import serial
import time

# COM-Port festlegen (COM3 in diesem Fall)
ser = serial.Serial('COM3', 9600, timeout=1)

# Warten, um sicherzustellen, dass die Verbindung hergestellt wird
time.sleep(2)

# Klasse für den Webserver
class RequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            
            # Lese den Inhalt der index.html-Datei
            with open('index.html', 'rb') as file:
                html_content = file.read()
                
            # Sende den Inhalt der index.html-Datei als Antwort
            self.wfile.write(html_content)
        elif self.path == '/get_temperature':
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            
            # Befehl zum Anfordern der Temperatur vom Arduino senden
            ser.write(b'Request_Temperature')

            # Antwort vom Arduino lesen
            temperature = ser.readline().decode().strip()

            # Überprüfen, ob eine gültige Temperatur erhalten wurde
            if temperature.startswith('temp:'):
                temperature_value = temperature.split(':')[1]
                self.wfile.write(temperature_value.encode())
            else:
                self.wfile.write(b'--')
        elif self.path == '/styles.css':
            self.send_response(200)
            self.send_header('Content-type', 'text/css')
            self.end_headers()
            
            # Lese den Inhalt der styles.css-Datei
            with open('styles.css', 'rb') as file:
                css_content = file.read()
                
            # Sende den Inhalt der styles.css-Datei als Antwort
            self.wfile.write(css_content)
        elif self.path == '/script.js':
            self.send_response(200)
            self.send_header('Content-type', 'application/javascript')
            self.end_headers()
            
            # Lese den Inhalt der script.js-Datei
            with open('script.js', 'rb') as file:
                js_content = file.read()
                
            # Sende den Inhalt der script.js-Datei als Antwort
            self.wfile.write(js_content)
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b'404 Not Found')

# Webserver starten
def webserver():
    print('Starting server...')
    server_address = ('', 8000)
    httpd = HTTPServer(server_address, RequestHandler)
    print('Server running on port 8000...')
    httpd.serve_forever()

# Starten des Webservers
webserver()
