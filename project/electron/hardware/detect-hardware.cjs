const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFile } = require('child_process');

const WINDOWS_PATHS = [
  process.env.ProgramFiles,
  process.env['ProgramFiles(x86)'],
  process.env.ProgramData,
  process.env.LOCALAPPDATA,
  process.env.APPDATA,
].filter(Boolean);

const BACKEND_TARGETS = [
  {
    id: 'l_connect',
    label: 'L-Connect / Lian Li',
    processHints: ['L-Connect', 'LConnect', 'L-Connect 3', 'LConnectService'],
    folderHints: ['L-Connect', 'LConnect', 'LIAN LI', 'Lian Li'],
    controls: ['lian-li-linked-rgb', 'display-indirect'],
  },
  {
    id: 'armoury_crate',
    label: 'ASUS Armoury Crate / Aura',
    processHints: ['ArmouryCrate', 'Armoury Crate', 'LightingService', 'Aura', 'AacAmbientLighting'],
    folderHints: ['ASUS', 'Armoury Crate', 'Aura', 'LightingService'],
    controls: ['motherboard-argb-indirect', 'aura-sync-indirect'],
  },
  {
    id: 'nvidia',
    label: 'NVIDIA GPU Stack',
    processHints: ['NVIDIA', 'NVIDIA App', 'NVIDIA Container', 'nvcontainer'],
    folderHints: ['NVIDIA Corporation', 'NVIDIA App'],
    controls: ['gpu-detection-only'],
  },
];

function existsSafe(targetPath) {
  try {
    return Boolean(targetPath) && fs.existsSync(targetPath);
  } catch (_error) {
    return false;
  }
}

function findMatchingFolders(folderHints) {
  const matches = [];

  for (const root of WINDOWS_PATHS) {
    if (!existsSafe(root)) continue;

    for (const hint of folderHints) {
      const direct = path.join(root, hint);
      if (existsSafe(direct)) {
        matches.push(direct);
      }
    }
  }

  return [...new Set(matches)];
}

function listWindowsProcesses() {
  return new Promise((resolve) => {
    if (process.platform !== 'win32') {
      resolve([]);
      return;
    }

    execFile('tasklist.exe', ['/fo', 'csv', '/nh'], { windowsHide: true }, (error, stdout) => {
      if (error || !stdout) {
        resolve([]);
        return;
      }

      const processes = stdout
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => line.split(',')[0]?.replace(/^"|"$/g, ''))
        .filter(Boolean);

      resolve([...new Set(processes)]);
    });
  });
}

function matchProcesses(processes, processHints) {
  return processes.filter((processName) =>
    processHints.some((hint) => processName.toLowerCase().includes(hint.toLowerCase())),
  );
}

function confidenceFromEvidence(processMatches, folderMatches) {
  if (processMatches.length > 0 && folderMatches.length > 0) return 'high';
  if (processMatches.length > 0 || folderMatches.length > 0) return 'medium';
  return 'none';
}

function statusFromConfidence(confidence) {
  if (confidence === 'high') return 'runtime_verified';
  if (confidence === 'medium') return 'presence_only';
  return process.platform === 'win32' ? 'unavailable' : 'platform_skipped';
}

async function detectHardware() {
  const processes = await listWindowsProcesses();
  const scannedAt = new Date().toISOString();

  const backends = BACKEND_TARGETS.map((target) => {
    const processMatches = matchProcesses(processes, target.processHints);
    const folderMatches = findMatchingFolders(target.folderHints);
    const confidence = confidenceFromEvidence(processMatches, folderMatches);

    return {
      id: target.id,
      label: target.label,
      available: confidence !== 'none',
      confidence,
      verificationStatus: statusFromConfidence(confidence),
      runtimeProcesses: processMatches,
      installPaths: folderMatches,
      controls: target.controls,
      lastCheckAt: scannedAt,
      safeMode: true,
      writeAccess: false,
    };
  });

  const availableBackends = backends.filter((backend) => backend.available);

  return {
    ok: true,
    scannedAt,
    platform: process.platform,
    arch: process.arch,
    hostname: os.hostname(),
    machine: {
      cpus: os.cpus().length,
      totalMemoryGB: Number((os.totalmem() / 1024 / 1024 / 1024).toFixed(2)),
      freeMemoryGB: Number((os.freemem() / 1024 / 1024 / 1024).toFixed(2)),
    },
    summary: availableBackends.length
      ? `${availableBackends.length} hardware backend(s) detected.`
      : 'No supported RGB/display backends detected yet.',
    sync: availableBackends.length ? 'hardware-detected-safe-read-only' : 'unverified',
    backends,
    warnings: [
      'Detection is read-only.',
      'No RGB values, fan values, firmware, or device settings are changed by this scan.',
    ],
  };
}

module.exports = {
  detectHardware,
};
