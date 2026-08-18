@echo off
echo Starting Apostello Detailing website server...
echo Open your browser to: http://localhost:3060/
echo.
echo Press Ctrl+C to stop the server.
echo.
cd /d "%~dp0"
node serve.mjs
pause
