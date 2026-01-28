<script lang="ts">
  let {
    onclick,
  }: {
    onclick?: () => void;
  } = $props();
</script>

<button
  class="lunettes-fab"
  onclick={onclick}
  type="button"
  aria-label="Open settings"
>
  <i class="fa-solid fa-glasses lunettes-fab-icon"></i>
</button>

<style>
  .lunettes-fab {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 48px;
    height: 48px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgb(242, 242, 247);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    z-index: 9998;
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif;
  }

  .lunettes-fab:hover {
    transform: scale(1.1);
  }

  .lunettes-fab:active {
    transform: scale(0.9);
  }

  .lunettes-fab:focus {
    outline: none;
  }

  .lunettes-fab-icon {
    font-size: 20px;
    color: rgb(28, 28, 30);
  }

  @media (prefers-color-scheme: dark) {
    .lunettes-fab {
      background: rgb(28, 28, 30);
      box-shadow: 0 2px 12px rgb(0, 0, 0, 0.4);
    }

    .lunettes-fab-icon {
      color: rgb(242, 242, 247);
    }
  }
</style>
