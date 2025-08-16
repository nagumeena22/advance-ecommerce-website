@echo off
echo Starting E-commerce Project Servers...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd Advance-Ecommerce-main\Server && npm run dev"

echo Waiting 3 seconds...
timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd Advance-Ecommerce-main\Client && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window...
pause > nul 