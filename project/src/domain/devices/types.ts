export type DeviceCategory = 'display' | 'rgb' | 'hybrid' | 'sensor' | 'unknown';

export type BackendOwner =
  | 'l_connect'
  | 'armoury_crate'
  | 'motherboard_argb'
  | 'vendor_display'
  | 'standalone'
  | 'manual'
  | 'unknown';

export type SyncTruthStatus =
  | 'synced_true'
  | 'synced_indirect'
  | 'standalone'
  | 'available_not_linked'
  | 'unsupported'
  | 'backend_missing'
  | 'unknown';

export interface DeviceCapabilities {
  canDisplayMedia: boolean;
  canShowSensorData: boolean;
  canApplyRgbPreset: boolean;
  canParticipateInTrueSync: boolean;
  canParticipateInIndirectSync: boolean;
  hasDiagnostics: boolean;
}

export interface DeviceRecord {
  id: string;
  name: string;
  userFacingName: string;
  category: DeviceCategory;
  backendOwner: BackendOwner;
  detected: boolean;
  enabled: boolean;
  syncStatus: SyncTruthStatus;
  capabilities: DeviceCapabilities;
  notes?: string[];
  linkedGroupId?: string;
  displayState?: {
    currentMode?: 'media' | 'sensor' | 'idle' | 'unknown';
    currentAssetId?: string | null;
    sourceLabel?: string;
  };
  rgbState?: {
    presetId?: string | null;
    controlMode?: 'direct' | 'indirect' | 'external' | 'none';
    sourceLabel?: string;
  };
  diagnostics?: {
    backendDetected: boolean;
    adapterHealthy: boolean;
    rawPathLabel?: string;
    warnings?: string[];
  };
}
