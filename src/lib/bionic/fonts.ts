import { getStoredValue, setStoredValue } from './storage';

const FONT_SOURCES = {
  sans: {
    cacheKey: 'lunettes-font-cache:v1:sans',
    cdnUrl: 'https://cdn.jsdelivr.net/gh/2005czq/lunettes@main/public/fonts/Inter-Bionic.woff2',
  },
  serif: {
    cacheKey: 'lunettes-font-cache:v1:serif',
    cdnUrl: 'https://cdn.jsdelivr.net/gh/2005czq/lunettes@main/public/fonts/SourceSerif4-Bionic.woff2',
  },
} as const;

export type FontCategory = keyof typeof FONT_SOURCES;

const sourceCache = new Map<FontCategory, string>();
const pendingCache = new Map<FontCategory, Promise<string>>();

const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

const fetchFontBase64 = async (url: string): Promise<string> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch font (${response.status})`);
  }
  const buffer = await response.arrayBuffer();
  return arrayBufferToBase64(buffer);
};

const toDataUrl = (base64: string) => `data:font/woff2;base64,${base64}`;

export const getFontSourceUrl = async (category: FontCategory): Promise<string> => {
  const cachedSource = sourceCache.get(category);
  if (cachedSource) {
    return cachedSource;
  }

  const { cacheKey, cdnUrl } = FONT_SOURCES[category];
  const cachedData = getStoredValue(cacheKey);
  if (cachedData) {
    const dataUrl = toDataUrl(cachedData);
    sourceCache.set(category, dataUrl);
    return dataUrl;
  }

  const pending = pendingCache.get(category);
  if (pending) {
    return pending;
  }

  const loader = (async () => {
    try {
      const base64 = await fetchFontBase64(cdnUrl);
      const saved = setStoredValue(cacheKey, base64);
      if (saved) {
        return toDataUrl(base64);
      }
    } catch (error) {
      console.warn('[lunettes] Failed to cache font, fallback to CDN:', error);
    }
    return cdnUrl;
  })();

  pendingCache.set(category, loader);
  const resolved = await loader;
  pendingCache.delete(category);
  sourceCache.set(category, resolved);
  return resolved;
};
