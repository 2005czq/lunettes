<script lang="ts">
  import { locale, t } from '../i18n';

  interface Option {
    value: string;
    label: string;
  }

  let {
    options = [],
    value = $bindable(''),
    defaultValue = '',
    placeholder = '',
    maxHeight = 200,
  }: {
    options: Option[];
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    maxHeight?: number;
  } = $props();

  $effect(() => {
    if (!value && defaultValue) {
      value = defaultValue;
    }
  });

  let isOpen = $state(false);
  let dropdownRef: HTMLDivElement;
  let listRef: HTMLUListElement;

  const currentLocale = $derived($locale);
  const displayPlaceholder = $derived(placeholder || t('dropdown.placeholder', currentLocale));

  const selectedLabel = $derived(
    options.find(opt => opt.value === value)?.label || displayPlaceholder
  );

  function toggle() {
    isOpen = !isOpen;
  }

  function select(opt: Option) {
    value = opt.value;
    isOpen = false;
  }

  function handleBlur(e: FocusEvent) {
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!dropdownRef?.contains(relatedTarget)) {
      // isOpen = false;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      isOpen = false;
    }
  }

  const listHeight = $derived.by(() => {
    if (!options.length) return 72;
    const itemHeight = 36;
    const totalHeight = options.length * itemHeight;
    return Math.min(totalHeight, maxHeight);
  });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="lunettes-dropdown"
  bind:this={dropdownRef}
  onkeydown={handleKeydown}
>
  <button
    class="lunettes-dropdown-trigger"
    onclick={toggle}
    onblur={handleBlur}
    type="button"
  >
    <span class="lunettes-dropdown-value" class:placeholder={!value}>
      {selectedLabel}
    </span>
    <i class="fa-solid fa-angle-down lunettes-dropdown-arrow" class:open={isOpen}></i>
  </button>

  <ul
    class="lunettes-dropdown-list"
    class:open={isOpen}
    style="--list-height: {listHeight}px"
    bind:this={listRef}
    role="listbox"
  >
    {#if options.length === 0}
      <li class="lunettes-dropdown-empty">{t('dropdown.noOptions', currentLocale)}</li>
    {:else}
      {#each options as opt (opt.value)}
        <li>
          <button
            class="lunettes-dropdown-item"
            class:selected={value === opt.value}
            onclick={() => select(opt)}
            onblur={handleBlur}
            type="button"
            role="option"
            aria-selected={value === opt.value}
          >
            {opt.label}
          </button>
        </li>
      {/each}
    {/if}
  </ul>
</div>

<style>
  .lunettes-dropdown {
    position: relative;
    width: 100%;
  }

  .lunettes-dropdown-trigger {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 10px;
    background: rgb(44, 44, 46);
    color: rgb(242, 242, 247);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.15s ease, border-color 0.15s ease;
    line-height: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
  }

  .lunettes-dropdown-trigger:hover {
    background: rgb(58, 58, 60);
  }

  .lunettes-dropdown-trigger:focus {
    outline: none;
  }

  .lunettes-dropdown-value {
    flex: 1;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .lunettes-dropdown-value.placeholder {
    color: rgb(142, 142, 147);
  }

  .lunettes-dropdown-arrow {
    flex-shrink: 0;
    margin-left: 10px;
    transition: transform 0.15s ease;
    color: rgb(142, 142, 147);
  }

  .lunettes-dropdown-arrow.open {
    transform: rotate(180deg);
  }

  .lunettes-dropdown-list {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    right: 0;
    margin: 0;
    width: 100%;
    box-sizing: border-box;
    list-style: none;
    background: rgb(28, 28, 30);
    border: 1px solid rgb(58, 58, 60);
    border-radius: 8px;
    overflow-y: auto;
    z-index: 1000;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-height: 0;
    opacity: 0;
    transform: translateY(-8px);
    pointer-events: none;
    transition: max-height 0.15s ease, opacity 0.15s ease, transform 0.15s ease;
    padding: 0;
  }

  .lunettes-dropdown-list.open {
    max-height: var(--list-height);
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  .lunettes-dropdown-list::-webkit-scrollbar {
    width: 6px;
  }

  .lunettes-dropdown-list::-webkit-scrollbar-track {
    background: transparent;
  }

  .lunettes-dropdown-list::-webkit-scrollbar-thumb {
    background: rgb(58, 58, 60);
    border-radius: 3px;
  }

  .lunettes-dropdown-empty {
    padding: 20px;
    color: rgb(142, 142, 147);
    text-align: center;
  }

  .lunettes-dropdown-item {
    width: 100%;
    padding: 8px 10px;
    background: transparent;
    border: none;
    border-radius: 8px;
    color: rgb(242, 242, 247);
    text-align: left;
    cursor: pointer;
    transition: background 0.15s ease;
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
  }

  .lunettes-dropdown-item:hover {
    background: rgb(44, 44, 46);
  }

  .lunettes-dropdown-item.selected {
    background: rgb(58, 58, 60);
    color: rgb(242, 242, 247);
  }

  .lunettes-dropdown-item:focus {
    outline: none;
  }

  @media (prefers-color-scheme: light) {
    .lunettes-dropdown-trigger {
      background: rgb(229, 229, 234);
      color: rgb(28, 28, 30);
    }

    .lunettes-dropdown-trigger:hover {
      background: rgb(209, 209, 214);
    }

    .lunettes-dropdown-list {
      background: rgb(242, 242, 247);
      border-color: rgb(209, 209, 214);
    }

    .lunettes-dropdown-list::-webkit-scrollbar-thumb {
      background: rgb(209, 209, 214);
    }

    .lunettes-dropdown-item {
      color: rgb(28, 28, 30);
    }

    .lunettes-dropdown-item:hover {
      background: rgb(229, 229, 234);
    }

    .lunettes-dropdown-item.selected {
      background: rgb(209, 209, 214);
      color: rgb(28, 28, 30);
    }
  }
</style>
