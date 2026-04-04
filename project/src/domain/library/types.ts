export type LibraryAssetType = 'image' | 'video' | 'gif' | 'unknown';

export interface LibraryAsset {
  id: string;
  name: string;
  type: LibraryAssetType;
  sourceLabel: string;
  previewUrl?: string;
  createdAt: string;
  lastUsedAt?: string;
  favorite?: boolean;
  sessionOnly?: boolean;
  sizeLabel?: string;
  managedFileName?: string;
  originalFileName?: string;
}

export interface RecentAction {
  id: string;
  type:
    | 'asset_imported'
    | 'asset_assigned'
    | 'asset_deleted'
    | 'display_selected'
    | 'display_mode_changed'
    | 'backend_scanned';
  label: string;
  createdAt: string;
}
