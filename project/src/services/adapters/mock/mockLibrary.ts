import type { LibraryAsset } from '@/domain/library/types';

function svgPreview(accent: string, title: string, subtitle: string): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
      <defs>
        <linearGradient id="bg" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="#08101b" />
          <stop offset="100%" stop-color="${accent}" />
        </linearGradient>
      </defs>
      <rect width="1280" height="720" fill="url(#bg)" rx="36" />
      <circle cx="1030" cy="150" r="180" fill="rgba(255,255,255,0.08)" />
      <circle cx="180" cy="620" r="200" fill="rgba(255,255,255,0.05)" />
      <text x="90" y="290" fill="#eef2ff" font-family="Inter, Arial, sans-serif" font-size="74" font-weight="700">
        ${title}
      </text>
      <text x="90" y="360" fill="#c9d5ff" font-family="Inter, Arial, sans-serif" font-size="30">
        ${subtitle}
      </text>
      <text x="90" y="600" fill="#9cb1e8" font-family="Inter, Arial, sans-serif" font-size="24">
        Team9 Local Library Sample
      </text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export const mockLibraryAssets: Record<string, LibraryAsset> = {
  'asset-rain-loop': {
    id: 'asset-rain-loop',
    name: 'Rain Loop',
    type: 'image',
    sourceLabel: 'Bundled Sample',
    previewUrl: svgPreview('#2c6fff', 'Rain Loop', 'Clean atmospheric sample for display assignment'),
    createdAt: '2026-04-03T09:00:00Z',
    lastUsedAt: '2026-04-03T09:10:00Z',
  },
  'asset-neon-grid': {
    id: 'asset-neon-grid',
    name: 'Neon Grid',
    type: 'image',
    sourceLabel: 'Bundled Sample',
    previewUrl: svgPreview('#6936ff', 'Neon Grid', 'Sharper futuristic sample for the LCD/media lane'),
    createdAt: '2026-04-03T09:00:00Z',
  },
  'asset-system-pulse': {
    id: 'asset-system-pulse',
    name: 'System Pulse',
    type: 'image',
    sourceLabel: 'Bundled Sample',
    previewUrl: svgPreview('#0099b8', 'System Pulse', 'Sensor-friendly visual placeholder'),
    createdAt: '2026-04-03T09:00:00Z',
  },
};
