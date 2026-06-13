# Team9 PC RGB Controller — Windows Release Checklist

## Phase 7 — Windows Packaging

Status: Started

## Build commands

Run from the `project` folder:

```powershell
npm install
npm run build
npm run package:dir
npm run package:win
```

## Output

Packaged files are written to:

```text
project/release
```

## Required validation

1. App opens without a black screen.
2. Refresh Diagnostics completes.
3. Machine Capture completes.
4. Export Report creates a JSON file under Documents/Team9/Diagnostics.
5. Open Diagnostics Folder opens the folder.
6. Import Media opens a file picker.
7. Display selection updates without crashing.
8. Display mode changes update state without crashing.
9. Safe preview actions remain non-destructive.
10. Installer opens and installs on Windows.

## Release rules

- Do not ship direct hardware-write behavior yet.
- Keep hardware detection read-only unless a backend integration is fully proven.
- Keep unsupported devices visible but read-only.
- Save every release build under a versioned folder.

## Next recommended phase

Phase 8 should add persistence:

1. Save media library to disk.
2. Save selected display to disk.
3. Save mode per display to disk.
4. Save diagnostic scan history to disk.
