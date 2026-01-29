<script lang="ts">
  interface Option {
    value: string;
    label: string;
  }

  let {
    options = [],
    value = $bindable(''),
  }: {
    options: Option[];
    value?: string;
  } = $props();

  let containerRef: HTMLDivElement;
  let buttonRefs: HTMLButtonElement[] = [];

  $effect(() => {
    if (!value && options.length > 0) {
      value = options[0].value;
    }
  });

  const selectedIndex = $derived(
    options.findIndex(opt => opt.value === value)
  );

  function select(opt: Option) {
    value = opt.value;
  }

  const sliderStyle = $derived.by(() => {
    if (selectedIndex < 0 || !options.length) return '';
    const width = 100 / options.length;
    const left = selectedIndex * width;
    return `width: calc(${width}% - 6px); left: calc(${left}% + 3px);`;
  });
</script>

<div class="lunettes-toggle-group" bind:this={containerRef} role="radiogroup">
  <div class="lunettes-toggle-slider" style={sliderStyle}></div>
  {#each options as opt, i (opt.value)}
    <button
      bind:this={buttonRefs[i]}
      class="lunettes-toggle-option"
      class:selected={value === opt.value}
      onclick={() => select(opt)}
      type="button"
      role="radio"
      aria-checked={value === opt.value}
    >
      {opt.label}
    </button>
  {/each}
</div>

<style>
  .lunettes-toggle-group {
    position: relative;
    display: flex;
    background: var(--lunettes-component-secondary);
    border-radius: 8px;
  }

  .lunettes-toggle-slider {
    position: absolute;
    top: 3px;
    bottom: 3px;
    background: var(--lunettes-component-primary);
    border-radius: 5px;
    transition: left 0.15s ease, width 0.15s ease;
  }

  .lunettes-toggle-option {
    position: relative;
    flex: 1;
    padding: 8px;
    background: transparent;
    border: none;
    border-radius: 5px;
    color: var(--lunettes-text-secondary);
    cursor: pointer;
    transition: color 0.15s ease;
    z-index: 1;
    white-space: nowrap;
    line-height: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
  }

  .lunettes-toggle-option:hover {
    color: var(--lunettes-text-middle);
  }

  .lunettes-toggle-option.selected {
    color: var(--lunettes-text-primary);
  }

  .lunettes-toggle-option:focus {
    outline: none;
  }
</style>
