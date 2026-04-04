import type { LibraryAsset } from '@/domain/library/types';

interface MediaPreviewProps {
  asset?: LibraryAsset | null;
  className?: string;
}

export function MediaPreview({ asset, className }: MediaPreviewProps) {
  if (!asset?.previewUrl) {
    return (
      <div className={className ? `media-preview media-preview-empty ${className}` : 'media-preview media-preview-empty'}>
        <div className="media-preview-empty-title">No preview available</div>
        <div className="media-preview-empty-copy">
          This asset does not currently expose a local preview path.
        </div>
      </div>
    );
  }

  if (asset.type === 'video') {
    return (
      <video className={className ? `media-preview ${className}` : 'media-preview'} controls muted src={asset.previewUrl}>
        Your browser does not support video preview.
      </video>
    );
  }

  return (
    <img
      className={className ? `media-preview ${className}` : 'media-preview'}
      src={asset.previewUrl}
      alt={asset.name}
    />
  );
}
