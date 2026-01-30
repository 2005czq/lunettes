import { writable, get } from 'svelte/store';
import { locale, t, type Locale } from '../i18n';
import { getStoredValue, isUserscriptStorageAvailable, setStoredValue } from '../storage';

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
  serifFonts: ['Times New Roman', 'Georgia', 'Palatino', 'Serif'],
  filterMode: 'blacklist',
  blacklist: ['*://chatgpt.com/*', '*://gemini.google.com/*'],
  whitelist: ['*://www.cnn.com/*', '*://www.bbc.com/*'],
};

const getDefaultSettings = (): Settings => ({
  ...defaultSettings,
  sansSerifFonts: [...defaultSettings.sansSerifFonts],
  serifFonts: [...defaultSettings.serifFonts],
  blacklist: [...defaultSettings.blacklist],
  whitelist: [...defaultSettings.whitelist],
});

const mergeSettings = (partial: Partial<Settings>): Settings => ({
  ...getDefaultSettings(),
  ...partial,
});

const loadSettings = (): Settings => {
  const stored = getStoredValue(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as Partial<Settings>;
      return mergeSettings(parsed);
    } catch (e) {
      console.warn('Failed to load lunettes settings:', e);
    }
  }
  return getDefaultSettings();
};

const saveSettings = (settings: Settings) => {
  try {
    const value = JSON.stringify(settings);
    if (!setStoredValue(STORAGE_KEY, value)) {
      console.warn('Failed to save lunettes settings.');
    }
  } catch (e) {
    console.warn('Failed to save lunettes settings:', e);
  }
};

function createSettingsStore() {
  const { subscribe, set: setStore, update: updateStore } = writable<Settings>(loadSettings());

  if (typeof window !== 'undefined') {
    if (isUserscriptStorageAvailable() && typeof GM_addValueChangeListener === 'function') {
      GM_addValueChangeListener(STORAGE_KEY, (_key, _oldValue, newValue, remote) => {
        if (remote && newValue) {
          try {
            const parsed = JSON.parse(newValue as string) as Partial<Settings>;
            setStore(mergeSettings(parsed));
          } catch (err) {
            console.warn('Failed to parse lunettes settings from value change:', err);
          }
        }
      });
    } else {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue) as Partial<Settings>;
            setStore(mergeSettings(parsed));
          } catch (err) {
            console.warn('Failed to parse lunettes settings from storage event:', err);
          }
        }
      });
    }
  }

  const commit = (updater: (settings: Settings) => Settings) => {
    updateStore((current) => {
      const updated = updater(current);
      saveSettings(updated);
      return updated;
    });
  };

  return {
    subscribe,
    get: () => get({ subscribe }),
    set: (value: Settings) => {
      setStore(value);
      saveSettings(value);
    },
    update: commit,
    setLocale: (nextLocale: Locale) => {
      commit((s) => ({ ...s, locale: nextLocale }));
    },
    setTheme: (theme: Theme) => {
      commit((s) => ({ ...s, theme }));
    },
    setShowFloatingButton: (show: boolean) => {
      commit((s) => ({ ...s, showFloatingButton: show }));
    },
    setSansSerifFonts: (fonts: string[]) => {
      commit((s) => ({ ...s, sansSerifFonts: fonts }));
    },
    setSerifFonts: (fonts: string[]) => {
      commit((s) => ({ ...s, serifFonts: fonts }));
    },
    setFilterMode: (mode: FilterMode) => {
      commit((s) => ({ ...s, filterMode: mode }));
    },
    setBlacklist: (sites: string[]) => {
      commit((s) => ({ ...s, blacklist: sites }));
    },
    setWhitelist: (sites: string[]) => {
      commit((s) => ({ ...s, whitelist: sites }));
    },
  };
}

export const settings = createSettingsStore();

export function initTheme(): () => void {
  const applyTheme = (theme: Theme) => {
    const root = document.documentElement;

    if (theme === 'system') {
      root.removeAttribute('data-lunettes-theme');
    } else {
      root.setAttribute('data-lunettes-theme', theme);
    }
  };

  const currentSettings = settings.get();
  applyTheme(currentSettings.theme);

  const unsubscribe = settings.subscribe((s) => {
    applyTheme(s.theme);
  });

  return unsubscribe;
}

export function initMenuCommands(): () => void {
  if (!isUserscriptStorageAvailable() || typeof GM_registerMenuCommand !== 'function') {
    return () => {};
  }

  type MenuId = ReturnType<typeof GM_registerMenuCommand>;
  let menuIds: MenuId[] = [];

  const registerMenu = (s: Settings) => {
    if (typeof GM_unregisterMenuCommand === 'function') {
      menuIds.forEach((id) => GM_unregisterMenuCommand(id));
    }
    menuIds = [];

    const toggleLabel = s.showFloatingButton
      ? t('settings.menu.floatingButton.on', s.locale)
      : t('settings.menu.floatingButton.off', s.locale);
    const toggleId = GM_registerMenuCommand(toggleLabel, () => {
      const current = settings.get().showFloatingButton;
      settings.setShowFloatingButton(!current);
    });
    menuIds.push(toggleId);

    const resetId = GM_registerMenuCommand(t('settings.menu.reset', s.locale), () => {
      const defaults = getDefaultSettings();
      settings.set(defaults);
      locale.set(defaults.locale);
    });
    menuIds.push(resetId);
  };

  const unsubscribe = settings.subscribe((s) => {
    registerMenu(s);
  });

  registerMenu(settings.get());

  return () => {
    unsubscribe();
    if (typeof GM_unregisterMenuCommand === 'function') {
      menuIds.forEach((id) => GM_unregisterMenuCommand(id));
    }
    menuIds = [];
  };
}
