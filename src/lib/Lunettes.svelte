<script lang="ts">
  import '@fortawesome/fontawesome-free/css/all.min.css';
  import { locale } from './i18n';
  import { FloatingButton, Modal, DemoPage } from './components';

  // Set default locale to Chinese
  locale.set('zh-CN');

  let isModalOpen = $state(false);

  function openModal() {
    isModalOpen = true;
  }
</script>

<FloatingButton onclick={openModal} />

<Modal bind:isOpen={isModalOpen}>
  <DemoPage />
</Modal>
