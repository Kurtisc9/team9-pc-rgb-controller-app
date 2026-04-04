# Device Launch

## Active project path
C:\RGBControl\01_Active_App\PC_RGB_Controller_App\team9-pc-rgb-controller-app\team9-pc-rgb-controller-app-phase9-windows-launcher-bundle-hotfix\project

## Window 1
```powershell
$p = "C:\RGBControl\01_Active_App\PC_RGB_Controller_App\team9-pc-rgb-controller-app\team9-pc-rgb-controller-app-phase9-windows-launcher-bundle-hotfix\project"
npm --prefix $p run dev
```

## Window 2
```powershell
$p = "C:\RGBControl\01_Active_App\PC_RGB_Controller_App\team9-pc-rgb-controller-app\team9-pc-rgb-controller-app-phase9-windows-launcher-bundle-hotfix\project"
& "$p\node_modules\.bin\electron.cmd" "$p\electron\main.cjs"
```
