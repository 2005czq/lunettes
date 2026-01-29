<script lang="ts">
  import { locale, t, type Locale } from '../i18n';
  import { settings, type Theme, type FilterMode } from '../stores';
  import Dropdown from './Dropdown.svelte';
  import EditableList from './EditableList.svelte';
  import ToggleGroup from './ToggleGroup.svelte';

  const currentLocale = $derived($locale);
  const currentSettings = $derived($settings);

  // Language options
  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'zh-CN', label: '简体中文' },
  ];

  // Theme options with i18n
  const themeOptions = $derived([
    { value: 'light', label: t('settings.theme.light', currentLocale) },
    { value: 'system', label: t('settings.theme.system', currentLocale) },
    { value: 'dark', label: t('settings.theme.dark', currentLocale) },
  ]);

  // Filter mode options with i18n
  const filterModeOptions = $derived([
    { value: 'blacklist', label: t('settings.filter.blacklist', currentLocale) },
    { value: 'whitelist', label: t('settings.filter.whitelist', currentLocale) },
  ]);

  // Local state bound to components - initialized from store
  let selectedLanguage = $state($settings.locale);
  let selectedTheme = $state($settings.theme);
  let sansSerifFonts = $state([...$settings.sansSerifFonts]);
  let serifFonts = $state([...$settings.serifFonts]);
  let filterMode = $state($settings.filterMode);
  let blacklist = $state([...$settings.blacklist]);
  let whitelist = $state([...$settings.whitelist]);

  // Sync with store changes (e.g., from other tabs)
  $effect(() => {
    selectedLanguage = $settings.locale;
    selectedTheme = $settings.theme;
    sansSerifFonts = [...$settings.sansSerifFonts];
    serifFonts = [...$settings.serifFonts];
    filterMode = $settings.filterMode;
    blacklist = [...$settings.blacklist];
    whitelist = [...$settings.whitelist];
  });

  // Handle language change
  $effect(() => {
    if (selectedLanguage && selectedLanguage !== $settings.locale) {
      settings.setLocale(selectedLanguage as Locale);
      locale.set(selectedLanguage as Locale);
    }
  });

  // Handle theme change
  $effect(() => {
    if (selectedTheme && selectedTheme !== $settings.theme) {
      settings.setTheme(selectedTheme as Theme);
    }
  });

  // Handle sans-serif fonts change
  $effect(() => {
    if (JSON.stringify(sansSerifFonts) !== JSON.stringify($settings.sansSerifFonts)) {
      settings.setSansSerifFonts(sansSerifFonts);
    }
  });

  // Handle serif fonts change
  $effect(() => {
    if (JSON.stringify(serifFonts) !== JSON.stringify($settings.serifFonts)) {
      settings.setSerifFonts(serifFonts);
    }
  });

  // Handle filter mode change
  $effect(() => {
    if (filterMode && filterMode !== $settings.filterMode) {
      settings.setFilterMode(filterMode as FilterMode);
    }
  });

  // Handle blacklist change
  $effect(() => {
    if (JSON.stringify(blacklist) !== JSON.stringify($settings.blacklist)) {
      settings.setBlacklist(blacklist);
    }
  });

  // Handle whitelist change
  $effect(() => {
    if (JSON.stringify(whitelist) !== JSON.stringify($settings.whitelist)) {
      settings.setWhitelist(whitelist);
    }
  });

  const githubUrl = 'https://github.com/2005czq/lunettes';
</script>

<div class="lunettes-settings">
  <!-- Logo Section -->
  <div class="lunettes-settings-logo">
    <a href={githubUrl} target="_blank" rel="noopener noreferrer" class="lunettes-settings-logo-icon" aria-label="Lunettes on GitHub">
      <i class="fa-solid fa-glasses"></i>
    </a>
    <a href={githubUrl} target="_blank" rel="noopener noreferrer" class="lunettes-settings-logo-title">
      lunettes
    </a>
  </div>

  <div class="lunettes-settings-section">
    <div class="lunettes-settings-row">
      <span class="lunettes-settings-label">{t('settings.language', currentLocale)}</span>
      <div class="lunettes-settings-control">
        <Dropdown
          options={languageOptions}
          bind:value={selectedLanguage}
          defaultValue={currentSettings.locale}
        />
      </div>
    </div>
  </div>

  <div class="lunettes-settings-section">
    <div class="lunettes-settings-row">
      <span class="lunettes-settings-label">{t('settings.theme', currentLocale)}</span>
      <div class="lunettes-settings-control">
        <ToggleGroup
          options={themeOptions}
          bind:value={selectedTheme}
        />
      </div>
    </div>
  </div>

  <!-- Font Replacement Section -->
  <div class="lunettes-settings-section">
    <div class="lunettes-settings-columns">
      <div class="lunettes-settings-column">
        <span class="lunettes-settings-column-label">{t('settings.fonts.sansSerif', currentLocale)}</span>
        <EditableList
          bind:items={sansSerifFonts}
          placeholder={t('settings.fonts.placeholder', currentLocale)}
        />
      </div>
      <div class="lunettes-settings-column">
        <span class="lunettes-settings-column-label">{t('settings.fonts.serif', currentLocale)}</span>
        <EditableList
          bind:items={serifFonts}
          placeholder={t('settings.fonts.placeholder', currentLocale)}
        />
      </div>
    </div>
  </div>

  <!-- Site Filter Section -->
  <div class="lunettes-settings-section">
    <div class="lunettes-settings-row">
      <span class="lunettes-settings-label">{t('settings.filter.title', currentLocale)}</span>
      <div class="lunettes-settings-control">
        <ToggleGroup
          options={filterModeOptions}
          bind:value={filterMode}
        />
      </div>
    </div>
    <div class="lunettes-settings-filter-list">
      {#if filterMode === 'blacklist'}
        <EditableList
          bind:items={blacklist}
          placeholder={t('settings.filter.placeholder', currentLocale)}
        />
      {:else}
        <EditableList
          bind:items={whitelist}
          placeholder={t('settings.filter.placeholder', currentLocale)}
        />
      {/if}
    </div>
  </div>
</div>

<style>
  .lunettes-settings {
    display: flex;
    flex-direction: column;
    gap: 16px;
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif;
  }

  /* Logo Section */
  .lunettes-settings-logo {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 32px 0;
  }

  .lunettes-settings-logo-icon {
    font-size: 48px;
    color: var(--lunettes-text-primary);
    text-decoration: none;
    transition: color 0.15s ease, transform 0.15s ease;
  }

  .lunettes-settings-logo-title {
    font-size: 24px;
    font-weight: 600;
    color: var(--lunettes-text-primary);
    text-decoration: none;
    transition: color 0.15s ease;
  }

  /* Settings Section */
  .lunettes-settings-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .lunettes-settings-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    /* gap: 16px; */
  }

  .lunettes-settings-label {
    font-size: 14px;
    font-weight: 500;
    color: var(--lunettes-text-secondary);
    letter-spacing: 0.5px;
    white-space: nowrap;
    text-transform: uppercase;
  }

  .lunettes-settings-control {
    flex: 0.5;
    width: auto;
  }

  /* Two-column layout for fonts section */
  .lunettes-settings-columns {
    display: flex;
    gap: 16px;
  }

  .lunettes-settings-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .lunettes-settings-column-label {
    font-size: 14px;
    font-weight: 500;
    color: var(--lunettes-text-secondary);
    letter-spacing: 0.5px;
    text-align: center;
    text-transform: uppercase;
  }

  /* Filter list section */
  .lunettes-settings-filter-list {
    margin-top: 8px;
  }
</style>
