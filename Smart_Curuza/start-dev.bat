.@echo off
echo Starting Smart Curuza Development Environment...

echo Starting Backend...
start "Smart Curuza Backend" cmd /k "cd backend && npm run start:dev"

echo Starting Web Frontend...
start "Smart Curuza Web" cmd /k "cd web && npm run dev"

echo Done! Services are starting in separate windows.
