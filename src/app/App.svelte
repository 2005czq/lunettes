<script lang="ts">
  import '@fortawesome/fontawesome-free/css/all.min.css';
  import './styles/theme.css';
  import { locale } from '../core/i18n';
  import { FloatingButton, Modal } from './components';
  import SettingsPage from './pages/SettingsPage.svelte';
  import { settings, initTheme, initMenuCommands } from '../core/settings';
  import { onMount } from 'svelte';

  let isModalOpen = $state(false);
  const showFloatingButton = $derived($settings.showFloatingButton);

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

<div class="lunettes-root">
  {#if showFloatingButton}
    <FloatingButton onclick={openModal} />
  {/if}

  <Modal bind:isOpen={isModalOpen}>
    <SettingsPage />
  </Modal>
</div>
