import type { BackendOwner } from '@/domain/devices/types';

export type BackendVerificationStatus =
  | 'pending'
  | 'presence_only'
  | 'device_evidence'
  | 'runtime_verified'
  | 'platform_skipped'
  | 'unavailable';

export interface BackendHealthRecord {
  backendOwner: BackendOwner;
  available: boolean;
  versionLabel?: string;
  verificationStatus?: BackendVerificationStatus;
  confidenceLabel?: 'none' | 'low' | 'medium' | 'high';
  detectionSummary?: string;
  recommendedAction?: string;
  runtimeProcess?: string | null;
  evidenceSources?: string[];
  observedTargets?: string[];
  verifiedFeatures?: string[];
  installPaths?: string[];
  stateRoots?: string[];
  scanSource?: string;
  lastCheckAt?: string;
  warnings?: string[];
}
