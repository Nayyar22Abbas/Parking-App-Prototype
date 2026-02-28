@echo off
title Parking App - Setup and Run
color 0A

echo.
echo =========================================
echo   Parking App - Setup and Run
echo =========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo [ERROR] Node.js is not installed!
    echo.
    echo Please install Node.js:
    echo 1. Visit: https://nodejs.org/
    echo 2. Download the LTS version
    echo 3. Run the installer
    echo 4. Restart your computer
    echo 5. Run this script again
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js is installed
node --version
echo.

REM Check if node_modules folder exists
if not exist "node_modules" (
    echo [*] Installing dependencies...
    echo This may take a few minutes. Please wait...
    echo.
    call npm install
    
    if errorlevel 1 (
        echo.
        echo [ERROR] Failed to install dependencies
        echo Please check your internet connection and try again
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed!
) else (
    echo [OK] Dependencies already installed
)

echo.
echo =========================================
echo   STARTING THE APP
echo =========================================
echo.
echo The app will start in a moment...
echo When it starts, you will see a QR CODE
echo.
echo TO USE THE APP:
echo 1. Install "Expo Go" on your phone
echo 2. When the QR code appears, open Expo Go
echo 3. Tap "Scan" and scan the QR code
echo 4. Your app will load on your phone!
echo.
echo Press Ctrl + C to stop the server
echo.
echo Starting...
timeout /t 2 /nobreak

npm start

echo.
echo.
echo =========================================
echo   Server Stopped
echo =========================================
echo.
pause
exit /b 0
