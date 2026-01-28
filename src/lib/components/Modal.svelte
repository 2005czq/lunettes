<script lang="ts">
  import { locale, t } from '../i18n';

  let {
    isOpen = $bindable(false),
    children,
  }: {
    isOpen?: boolean;
    children?: any;
  } = $props();

  const currentLocale = $derived($locale);

  let isVisible = $state(false);
  let isClosing = $state(false);

  $effect(() => {
    if (isOpen) {
      isVisible = true;
      isClosing = false;
    }
  });

  function handleClose() {
    isClosing = true;
    setTimeout(() => {
      isOpen = false;
      isVisible = false;
      isClosing = false;
    }, 150);
  }

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      handleClose();
    }
  }

  function close() {
    handleClose();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isVisible}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_interactive_supports_focus -->
  <div
    class="lunettes-modal-backdrop"
    class:open={isOpen}
    class:closing={isClosing}
    onclick={handleBackdropClick}
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    <div class="lunettes-modal">
      <button
        class="lunettes-modal-close"
        onclick={close}
        type="button"
        aria-label={t('demo.close', currentLocale)}
      >
        <i class="fa-solid fa-xmark"></i>
      </button>

      <div class="lunettes-modal-content">
        {@render children?.()}
      </div>
    </div>
  </div>
{/if}

<style>
  .lunettes-modal-backdrop {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    z-index: 9999;
    padding: 24px;

    animation: fadeIn 0.15s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  .lunettes-modal-backdrop.closing {
    animation: fadeOut 0.15s ease-out forwards;
  }

  .lunettes-modal-backdrop.closing .lunettes-modal {
    animation: slideDown 0.15s ease-out forwards;
  }

  .lunettes-modal {
    position: relative;
    width: 100%;
    max-width: 500px;
    max-height: calc(100vh - 48px);
    padding: 24px;
    background: rgb(28, 28, 30);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgb(58, 58, 60);
    border-radius: 14px;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
    animation: slideUp 0.15s ease-out;
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(16px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes slideDown {
    from {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    to {
      opacity: 0;
      transform: translateY(16px) scale(0.98);
    }
  }

  .lunettes-modal::-webkit-scrollbar {
    width: 6px;
  }

  .lunettes-modal::-webkit-scrollbar-track {
    background: transparent;
  }

  .lunettes-modal::-webkit-scrollbar-thumb {
    background: rgb(58, 58, 60);
    border-radius: 3px;
  }

  .lunettes-modal-close {
    position: absolute;
    top: 14px;
    right: 14px;
    width: 26px;
    height: 26px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgb(44, 44, 46);
    border: none;
    border-radius: 50%;
    color: rgb(142, 142, 147);
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease;
  }

  .lunettes-modal-close:hover {
    background: rgb(58, 58, 60);
    color: rgb(174, 174, 178);
  }

  .lunettes-modal-close:focus {
    outline: none;
  }

  .lunettes-modal-content {
    width: 100%;
  }

  @media (prefers-color-scheme: light) {

    .lunettes-modal {
      background: rgb(242, 242, 247);
      border-color: rgb(209, 209, 214);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .lunettes-modal::-webkit-scrollbar-thumb {
      background: rgb(209, 209, 214);
    }

    .lunettes-modal-close {
      background: rgb(229, 229, 234);
    }

    .lunettes-modal-close:hover {
      background: rgb(209, 209, 214);
      color: rgb(99, 99, 102);
    }
  }
</style>
