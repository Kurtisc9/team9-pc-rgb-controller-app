@echo off
set "P=C:\RGBControl\01_Active_App\PC_RGB_Controller_App\team9-pc-rgb-controller-app\team9-pc-rgb-controller-app-phase9-windows-launcher-bundle-hotfix\project"
start "Team9 Vite" powershell -NoExit -Command "npm --prefix '%P%' run dev"
timeout /t 6 >nul
start "Team9 Electron" powershell -NoExit -Command "& '%P%\node_modules\.bin\electron.cmd' '%P%\electron\main.cjs'"
