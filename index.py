# !/usr/bin/env python3
import http.server
import socketserver
import subprocess

port = 80
Handler = http.server.SimpleHTTPRequestHandler
with socketserver.TCPServer(("", port), Handler) as server:
    print(f"服务器已启动: http://localhost:{port}")
    server.serve_forever()
