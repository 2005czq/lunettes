<script lang="ts">
  import '@fortawesome/fontawesome-free/css/all.min.css';
  import './styles/theme.css';
  import { locale } from './i18n';
  import { FloatingButton, Modal, SettingsPage } from './components';
  import { settings, initTheme, initMenuCommands } from './stores';
  import { onMount } from 'svelte';

  let isModalOpen = $state(false);
  const showFloatingButton = $derived($settings.showFloatingButton);

  // Initialize theme, locale, and menu commands
  onMount(() => {
    const currentSettings = settings.get();
    locale.set(currentSettings.locale);

    const cleanupTheme = initTheme();
    const cleanupMenu = initMenuCommands();

    return () => {
      cleanupTheme();
      cleanupMenu();
    };
  });

  function openModal() {
    isModalOpen = true;
  }
</script>

{#if showFloatingButton}
  <FloatingButton onclick={openModal} />
{/if}

<Modal bind:isOpen={isModalOpen}>
  <SettingsPage />
</Modal>
