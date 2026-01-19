@echo off
echo Starting Typespire...

:: Start Backend
echo Starting Backend...
start "Typespire Backend" cmd /k "cd backend && npm run start:dev"

:: Start Frontend
echo Starting Frontend...
start "Typespire Frontend" cmd /k "cd frontend && npm run dev"

echo Typespire services are starting in new windows.
pause
