import type { Team9Device, Team9SafePreset } from '../types/team9';

const safePresetOptions: Team9SafePreset[] = [
  'off',
  'static-white',
  'static-red',
  'static-green',
  'static-blue',
  'rainbow-preview',
];

interface SafePresetControlsProps {
  device: Team9Device;
  busy: string | null;
  onStagePreset: (deviceId: string, presetId: Team9SafePreset) => void;
}

export function SafePresetControls({ device, busy, onStagePreset }: SafePresetControlsProps) {
  return (
    <div style={styles.safeBlock}>
      <div style={styles.subtle}>Safe preset preview</div>
      <div style={styles.modeRow}>
        {safePresetOptions.map((preset) => (
          <button
            key={preset}
            onClick={() => onStagePreset(device.id, preset)}
            disabled={busy !== null}
            style={styles.chip}
          >
            {preset}
          </button>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  safeBlock: {
    marginTop: 16,
    paddingTop: 14,
    borderTop: '1px solid #293241',
  },
  subtle: {
    color: '#95a4b8',
    fontSize: 13,
  },
  modeRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 14,
  },
  chip: {
    background: '#121922',
    color: '#d5dfeb',
    border: '1px solid #2b3645',
    borderRadius: 999,
    padding: '8px 12px',
    cursor: 'pointer',
  },
};
