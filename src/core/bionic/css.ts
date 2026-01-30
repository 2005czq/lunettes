import type { Settings } from '../settings';
import { getFontSourceUrl } from './fonts';

const normalizeFontName = (font: string) => font.trim();

const uniqueFonts = (fonts: string[]): string[] => {
  const seen = new Set<string>();
  return fonts
    .map(normalizeFontName)
    .filter((font) => font.length > 0)
    .filter((font) => {
      const key = font.toLowerCase();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
};

const genericFamily = (font: string): string | null => {
  const normalized = font.trim().toLowerCase();
  if (normalized === 'serif') {
    return 'serif';
  }
  if (normalized === 'sans-serif' || normalized === 'sans serif') {
    return 'sans-serif';
  }
  if (normalized === 'monospace') {
    return 'monospace';
  }
  if (normalized === 'cursive') {
    return 'cursive';
  }
  if (normalized === 'fantasy') {
    return 'fantasy';
  }
  if (normalized === 'system-ui' || normalized === 'system ui') {
    return 'system-ui';
  }
  return null;
};

const escapeFontFamily = (font: string) => font.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

const formatFontFamily = (font: string): string => {
  const generic = genericFamily(font);
  if (generic) {
    return generic;
  }
  return `'${escapeFontFamily(font)}'`;
};

const buildFontFace = (fontFamily: string, src: string): string => {
  const safeSrc = src.replace(/'/g, "\\'");
  return `@font-face {\n  font-family: ${fontFamily};\n  src: url('${safeSrc}') format('woff2');\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n}`;
};

const buildCaltRule = (): string =>
  `:where(html, body, body *) {\n  font-feature-settings: \"calt\" 1 !important;\n  font-variant-ligatures: contextual !important;\n}`;

export const buildBionicFontCss = async (settings: Settings): Promise<string> => {
  const sansFonts = uniqueFonts(settings.sansSerifFonts);
  const serifFonts = uniqueFonts(settings.serifFonts);

  const blocks: string[] = [];

  if (sansFonts.length > 0) {
    const src = await getFontSourceUrl('sans');
    const sansRules = sansFonts.map((font) => buildFontFace(formatFontFamily(font), src));
    blocks.push(sansRules.join('\n'));
  }

  if (serifFonts.length > 0) {
    const src = await getFontSourceUrl('serif');
    const serifRules = serifFonts.map((font) => buildFontFace(formatFontFamily(font), src));
    blocks.push(serifRules.join('\n'));
  }

  if (sansFonts.length > 0 || serifFonts.length > 0) {
    blocks.push(buildCaltRule());
  }

  return blocks.join('\n');
};
