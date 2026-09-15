@echo off
echo ================================
echo Iniciando Backend e Frontend
echo ================================

REM Inicia Backend
start cmd /k "cd backend && node server.js"

REM Aguarda alguns segundos
timeout /t 5

REM Inicia Frontend
start cmd /k "ng serve --open"

echo ================================
echo Sistema iniciado com sucesso!
echo ================================
