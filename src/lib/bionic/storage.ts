declare function GM_getValue<T>(key: string, defaultValue?: T): T;
declare function GM_setValue(key: string, value: unknown): void;

const canUseGMStorage = () => typeof GM_getValue === 'function' && typeof GM_setValue === 'function';

export const getStoredValue = (key: string): string | undefined => {
  try {
    if (canUseGMStorage()) {
      return GM_getValue<string | undefined>(key, undefined);
    }
    const stored = localStorage.getItem(key);
    return stored ?? undefined;
  } catch {
    return undefined;
  }
};

export const setStoredValue = (key: string, value: string): boolean => {
  try {
    if (canUseGMStorage()) {
      GM_setValue(key, value);
      return true;
    }
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};
