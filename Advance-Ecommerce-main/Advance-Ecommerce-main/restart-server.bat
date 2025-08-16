@echo off
echo Restarting Backend Server...
echo.

echo Stopping any existing server processes...
taskkill /f /im node.exe 2>nul

echo Waiting 2 seconds...
timeout /t 2 /nobreak > nul

echo Starting Backend Server...
cd Advance-Ecommerce-main\Server
npm run dev

echo.
echo Server should be running on http://localhost:5000
echo Test the server by visiting: http://localhost:5000/api/test 