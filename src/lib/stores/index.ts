import { writable, get } from 'svelte/store';
import type { Locale } from '../i18n';

const STORAGE_KEY = 'lunettes-settings';

export type Theme = 'light' | 'system' | 'dark';
export type FilterMode = 'blacklist' | 'whitelist';

export interface Settings {
  locale: Locale;
  theme: Theme;
  showFloatingButton: boolean;
  sansSerifFonts: string[];
  serifFonts: string[];
  filterMode: FilterMode;
  blacklist: string[];
  whitelist: string[];
}

const defaultSettings: Settings = {
  locale: 'en',
  theme: 'system',
  showFloatingButton: true,
  sansSerifFonts: ['Arial', 'Helvetica', 'Calibri', 'Roboto', 'Open Sans', 'Sans-Serif'],
  serifFonts: ['Times New Roman', 'Georgia', 'Garamond', 'Baskerville', 'Palatino', 'Serif'],
  filterMode: 'blacklist',
  blacklist: [],
  whitelist: [],
};

declare function GM_getValue<T>(key: string, defaultValue?: T): T;
declare function GM_setValue(key: string, value: unknown): void;
declare function GM_addValueChangeListener(
  key: string,
  callback: (key: string, oldValue: unknown, newValue: unknown, remote: boolean) => void
): number;
declare function GM_removeValueChangeListener(listenerId: number): void;

function isUserscriptEnvironment(): boolean {
  return typeof GM_getValue === 'function' && typeof GM_setValue === 'function';
}

function createSettingsStore() {
  // Load settings from storage (GM_* or localStorage fallback)
  const loadSettings = (): Settings => {
    try {
      if (isUserscriptEnvironment()) {
        // Use Tampermonkey's GM_getValue for cross-site storage
        const stored = GM_getValue<string | undefined>(STORAGE_KEY, undefined);
        if (stored) {
          const parsed = JSON.parse(stored);
          return { ...defaultSettings, ...parsed };
        }
      } else {
        // Fallback to localStorage for development
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          return { ...defaultSettings, ...parsed };
        }
      }
    } catch (e) {
      console.warn('Failed to load lunettes settings:', e);
    }
    return defaultSettings;
  };

  // Save settings to storage (GM_* or localStorage fallback)
  const saveSettings = (settings: Settings) => {
    try {
      const value = JSON.stringify(settings);
      if (isUserscriptEnvironment()) {
        // Use Tampermonkey's GM_setValue for cross-site storage
        GM_setValue(STORAGE_KEY, value);
      } else {
        // Fallback to localStorage for development
        localStorage.setItem(STORAGE_KEY, value);
      }
    } catch (e) {
      console.warn('Failed to save lunettes settings:', e);
    }
  };

  const { subscribe, set, update } = writable<Settings>(loadSettings());

  // Listen for value changes from other tabs/sites
  if (typeof window !== 'undefined') {
    if (isUserscriptEnvironment() && typeof GM_addValueChangeListener === 'function') {
      // Use Tampermonkey's GM_addValueChangeListener for cross-site sync
      GM_addValueChangeListener(STORAGE_KEY, (_key, _oldValue, newValue, remote) => {
        if (remote && newValue) {
          try {
            const newSettings = JSON.parse(newValue as string);
            set({ ...defaultSettings, ...newSettings });
          } catch (err) {
            console.warn('Failed to parse lunettes settings from value change:', err);
          }
        }
      });
    } else {
      // Fallback to storage event for development (same origin only)
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY && e.newValue) {
          try {
            const newSettings = JSON.parse(e.newValue);
            set({ ...defaultSettings, ...newSettings });
          } catch (err) {
            console.warn('Failed to parse lunettes settings from storage event:', err);
          }
        }
      });
    }
  }

  return {
    subscribe,
    get: () => get({ subscribe }),
    set: (value: Settings) => {
      set(value);
      saveSettings(value);
    },
    update: (updater: (settings: Settings) => Settings) => {
      update((current) => {
        const updated = updater(current);
        saveSettings(updated);
        return updated;
      });
    },
    setLocale: (locale: Locale) => {
      update((s) => {
        const updated = { ...s, locale };
        saveSettings(updated);
        return updated;
      });
    },
    setTheme: (theme: Theme) => {
      update((s) => {
        const updated = { ...s, theme };
        saveSettings(updated);
        return updated;
      });
    },
    setShowFloatingButton: (show: boolean) => {
      update((s) => {
        const updated = { ...s, showFloatingButton: show };
        saveSettings(updated);
        return updated;
      });
    },
    setSansSerifFonts: (fonts: string[]) => {
      update((s) => {
        const updated = { ...s, sansSerifFonts: fonts };
        saveSettings(updated);
        return updated;
      });
    },
    setSerifFonts: (fonts: string[]) => {
      update((s) => {
        const updated = { ...s, serifFonts: fonts };
        saveSettings(updated);
        return updated;
      });
    },
    setFilterMode: (mode: FilterMode) => {
      update((s) => {
        const updated = { ...s, filterMode: mode };
        saveSettings(updated);
        return updated;
      });
    },
    setBlacklist: (sites: string[]) => {
      update((s) => {
        const updated = { ...s, blacklist: sites };
        saveSettings(updated);
        return updated;
      });
    },
    setWhitelist: (sites: string[]) => {
      update((s) => {
        const updated = { ...s, whitelist: sites };
        saveSettings(updated);
        return updated;
      });
    },
  };
}

export const settings = createSettingsStore();

// Theme management
export function initTheme(): () => void {
  const applyTheme = (theme: Theme) => {
    const root = document.documentElement;

    if (theme === 'system') {
      root.removeAttribute('data-lunettes-theme');
    } else {
      root.setAttribute('data-lunettes-theme', theme);
    }
  };

  // Apply initial theme
  const currentSettings = settings.get();
  applyTheme(currentSettings.theme);

  // Subscribe to settings changes
  const unsubscribe = settings.subscribe((s) => {
    applyTheme(s.theme);
  });

  return unsubscribe;
}

// Menu commands for userscript managers (Greasemonkey/Tampermonkey)
export function initMenuCommands(): () => void {
  // This is a placeholder for userscript menu commands
  // Can be extended to register GM_registerMenuCommand if available
  return () => {};
}
