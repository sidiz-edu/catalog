@echo off
setlocal enabledelayedexpansion
title Catalog Local Server

for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr "IPv4"') do (
    if "!IP!"=="" (
        set RAWIP=%%a
        set IP=!RAWIP: =!
    )
)

cls
echo.
echo  =========================================
echo   Catalog Local Server - Running  [Port 8082]
echo  =========================================
echo.
echo   [My PC]       http://localhost:8082
echo   [Colleague]   http://%IP%:8082
echo.
echo   * Same network required for colleague access
echo   * DO NOT close this window while in use!
echo   * Press Ctrl+C to stop the server
echo.
echo  -----------------------------------------
echo   Access Log
echo  -----------------------------------------
echo.

cd /d "%~dp0"
start "" http://localhost:8082
python -m http.server 8082
if %errorlevel% neq 0 (
    echo  Python not found. Please install from https://www.python.org
    pause
)
