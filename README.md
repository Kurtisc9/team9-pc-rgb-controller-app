# Team9 PC RGB Controller App

Active device-only repo for the Team9 PC RGB Controller App.

## Project Inbox

- Stabilize app launch and remove black screen causes.
- Keep Jungle Leopard and Lian Li / Universal Screen support first.
- Build diagnostics before direct RGB control.
- Do not add unsafe motherboard, fan, lighting, or device-write actions until detection is reliable.

## Active local app path

```text
C:\RGBControl\01_Active_App\PC_RGB_Controller_App\team9-pc-rgb-controller-app\team9-pc-rgb-controller-app-phase9-windows-launcher-bundle-hotfix\project
```

## Working launch flow

1. Start Vite:
   ```powershell
   npm --prefix $p run dev
   ```
2. Confirm:
   ```text
   http://localhost:5173/
   ```
3. Launch Electron from the same project path:
   ```powershell
   npm --prefix $p run start:electron
   ```

## Completion Phases

### Phase 1 — Stabilize Launch

Status: Started / core fixes pushed.

Goal: Make the app compile and open without the black screen.

Completed:
- Fixed broken renderer bridge helper syntax.
- Added missing Team9 renderer bridge/state types.
- Aligned Vite window bridge typing with the active app state.
- Cleaned duplicate CommonJS export in library handlers.

Test:
```powershell
cd C:\RGBControl\01_Active_App\PC_RGB_Controller_App\team9-pc-rgb-controller-app\team9-pc-rgb-controller-app-phase9-windows-launcher-bundle-hotfix\project
npm install
npm run build
npm run dev
npm run start:electron
```

### Phase 2 — Diagnostics Control Panel

Status: Started.

Goal: Make every existing preload diagnostics action usable from the app UI.

Completed:
- Added UI buttons for diagnostics refresh, diagnostics export, machine capture, and open diagnostics folder.
- Added clearer status messages after actions run.
- Displayed diagnostics status list in the selected display panel.

Next:
- Persist diagnostics history to disk.
- Show latest machine capture details in the UI.
- Add backend scan confidence labels.

### Phase 3 — Media Library Reliability

Status: Pending.

Goal: Make imported media survive app restart.

Tasks:
- Save library state to JSON under Documents/Team9.
- Load saved assets on app boot.
- Remove missing file references safely.
- Add thumbnail/preview support for image and video files.

### Phase 4 — Display Assignment Engine

Status: Pending.

Goal: Make selected display + selected asset assignments persistent and predictable.

Tasks:
- Save assigned asset per display.
- Save mode per display.
- Add preview panel for selected media.
- Add safe fallback when assigned media is missing.

### Phase 5 — RGB Backend Detection

Status: Pending.

Goal: Detect what can actually be controlled before attempting control.

Tasks:
- Detect L-Connect presence.
- Detect Armoury Crate / Aura presence.
- Detect known config folders and running processes.
- Mark each device as direct, indirect, standalone, unsupported, or unknown.

### Phase 6 — Safe RGB Control

Status: Pending.

Goal: Add RGB controls only where safe control paths exist.

Tasks:
- Add preset-only RGB controls first.
- Add no destructive hardware-write actions.
- Require confirmation before applying device-wide lighting sync.
- Keep unsupported devices display-only.

### Phase 7 — Production Packaging

Status: Pending.

Goal: Build a Windows-ready app package.

Tasks:
- Add electron-builder or equivalent package flow.
- Add app icon and installer metadata.
- Create signed/unsigned Windows installer option.
- Add release checklist.

## Ways to make this better

1. Add screenshots of your exact Jungle Leopard and Lian Li display setup to the repo docs.
2. Add a `docs/device-map.md` file that lists every connected RGB/display device, cable path, and control source.
