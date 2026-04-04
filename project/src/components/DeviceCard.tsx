import { StatusBadge } from '@/components/StatusBadge';
import { canClaimTrueSync, getDeviceSummary } from '@/domain/devices/truthRules';
import type { DeviceRecord } from '@/domain/devices/types';
import type { LibraryAsset } from '@/domain/library/types';

interface DeviceCardProps {
  device: DeviceRecord;
  currentAsset?: LibraryAsset | null;
}

export function DeviceCard({ device, currentAsset }: DeviceCardProps) {
  const truthNote = canClaimTrueSync(device)
    ? 'Claim passes Team9 true-sync rule.'
    : getDeviceSummary(device);

  return (
    <article className="device-card">
      <div className="device-card-top">
        <div>
          <div className="device-card-name">{device.userFacingName}</div>
          <div className="device-card-meta">
            {device.category} · {device.backendOwner}
          </div>
        </div>
        <StatusBadge status={device.syncStatus} />
      </div>

      <p className="device-card-summary">{truthNote}</p>

      <dl className="device-card-grid">
        <div>
          <dt>Detected</dt>
          <dd>{device.detected ? 'Yes' : 'No'}</dd>
        </div>
        <div>
          <dt>RGB Control</dt>
          <dd>{device.capabilities.canApplyRgbPreset ? 'Eligible' : 'No'}</dd>
        </div>
        <div>
          <dt>Display</dt>
          <dd>{device.capabilities.canDisplayMedia ? 'Yes' : 'No'}</dd>
        </div>
        <div>
          <dt>Source</dt>
          <dd>{device.rgbState?.sourceLabel ?? device.displayState?.sourceLabel ?? 'Unknown'}</dd>
        </div>
      </dl>

      {device.capabilities.canDisplayMedia ? (
        <div className="device-card-footer">
          <span className="device-card-footer-label">Assigned asset</span>
          <span className="device-card-footer-value">{currentAsset?.name ?? 'None selected'}</span>
        </div>
      ) : null}
    </article>
  );
}
