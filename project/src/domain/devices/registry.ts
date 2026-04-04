export const LOCKED_PAGE_HIERARCHY = [
  'Home',
  'LCD / Media',
  'Library',
  'RGB (Advanced)',
  'Settings',
] as const;

export const LOCKED_PRIMARY_RULES = {
  lcdMediaPrimary: true,
  rgbSecondary: true,
  presetsAffectRgbOnly: true,
  technicalClutterHiddenFromMainUi: true,
} as const;
