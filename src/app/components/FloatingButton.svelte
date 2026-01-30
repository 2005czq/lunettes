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
    background: var(--lunettes-component-primary);
    box-shadow: 0 2px 12px var(--lunettes-button-shadow);
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    z-index: 9998;
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
    color: var(--lunettes-component-inverted);
  }
</style>
