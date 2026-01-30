<script lang="ts">
  import { locale, t } from '../../core/i18n';
  import { tick } from 'svelte';

  let {
    items = $bindable<string[]>([]),
    maxHeight = 200,
    placeholder = '',
  }: {
    items?: string[];
    maxHeight?: number;
    placeholder?: string;
  } = $props();

  const currentLocale = $derived($locale);
  const displayPlaceholder = $derived(placeholder || t('list.addPlaceholder', currentLocale));

  let newItemValue = $state('');
  let editingIndex = $state<number | null>(null);
  let editingValue = $state('');
  let removingIndices = $state<Set<number>>(new Set());
  let addingIndices = $state<Set<number>>(new Set());
  let editInputRef = $state<HTMLInputElement | null>(null);

  function isDuplicate(value: string): boolean {
    return items.some(item => item === value);
  }

  function addItem() {
    const trimmed = newItemValue.trim();
    if (trimmed && !isDuplicate(trimmed)) {
      const newIndex = items.length;
      addingIndices = new Set([...addingIndices, newIndex]);
      items = [...items, trimmed];
      newItemValue = '';

      // Remove adding state after animation completes
      setTimeout(() => {
        addingIndices = new Set([...addingIndices].filter(i => i !== newIndex));
      }, 200);
    }
  }

  function handleNewItemKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = newItemValue.trim();
      // Only add if not a duplicate
      if (trimmed && !isDuplicate(trimmed)) {
        addItem();
      }
      // If duplicate, do nothing (no response on Enter)
    }
  }

  function handleNewItemBlur() {
    const trimmed = newItemValue.trim();
    // On blur, if duplicate, clear the input instead of adding
    if (trimmed && isDuplicate(trimmed)) {
      newItemValue = '';
    } else {
      addItem();
    }
  }

  async function startEditing(index: number) {
    editingIndex = index;
    editingValue = items[index];
    await tick();
    editInputRef?.focus();
  }

  function saveEdit() {
    if (editingIndex === null) return;

    const trimmed = editingValue.trim();
    if (trimmed) {
      items = items.map((item, i) => i === editingIndex ? trimmed : item);
    } else {
      removeItem(editingIndex);
    }
    editingIndex = null;
    editingValue = '';
  }

  function handleEditKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveEdit();
    } else if (e.key === 'Escape') {
      editingIndex = null;
      editingValue = '';
    }
  }

  function removeItem(index: number) {
    removingIndices = new Set([...removingIndices, index]);

    setTimeout(() => {
      items = items.filter((_, i) => i !== index);
      removingIndices = new Set([...removingIndices].filter(i => i !== index));

      // Adjust editing index if needed
      if (editingIndex !== null && editingIndex > index) {
        editingIndex--;
      } else if (editingIndex === index) {
        editingIndex = null;
      }
    }, 200);
  }
</script>

<div class="lunettes-list" style="--max-height: {maxHeight}px">
  <div class="lunettes-list-content">
    {#each items as item, index (item + '-' + index)}
      <div
        class="lunettes-list-item"
        class:removing={removingIndices.has(index)}
        class:adding={addingIndices.has(index)}
      >
        {#if editingIndex === index}
          <input
            type="text"
            class="lunettes-list-input"
            bind:this={editInputRef}
            bind:value={editingValue}
            onkeydown={handleEditKeydown}
            onblur={saveEdit}
          />
        {:else}
          <button
            class="lunettes-list-item-content"
            onclick={() => startEditing(index)}
            type="button"
          >
            {item}
          </button>
          <button
            class="lunettes-list-delete"
            onclick={() => removeItem(index)}
            type="button"
            aria-label="Delete"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        {/if}
      </div>
    {/each}

    <!-- New item input -->
    <div class="lunettes-list-item lunettes-list-new">
      <input
        type="text"
        class="lunettes-list-input"
        placeholder={displayPlaceholder}
        bind:value={newItemValue}
        onkeydown={handleNewItemKeydown}
        onblur={handleNewItemBlur}
      />
    </div>
  </div>
</div>

<style>
  .lunettes-list {
    width: 100%;
    max-height: var(--max-height);
    overflow-y: auto;
    background: var(--lunettes-component-secondary);
    border-radius: 8px;
  }

  .lunettes-list::-webkit-scrollbar {
    width: 6px;
  }

  .lunettes-list::-webkit-scrollbar-track {
    background: transparent;
  }

  .lunettes-list::-webkit-scrollbar-thumb {
    background: var(--lunettes-misc);
    border-radius: 3px;
  }

  .lunettes-list-content {
    display: flex;
    flex-direction: column;
  }

  .lunettes-list-item {
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--lunettes-misc);
    overflow: hidden;
    transition: opacity 0.15s ease, max-height 0.15s ease, padding 0.15s ease, border-bottom-width 0.15s ease;
    max-height: 36px;
    opacity: 1;
  }

  .lunettes-list-item:last-child {
    border-bottom: none;
  }

  .lunettes-list-item.removing {
    max-height: 0;
    opacity: 0;
  }

  .lunettes-list-item.adding {
    animation: itemSlideIn 0.15s ease-out;
  }

  @keyframes itemSlideIn {
    from {
      max-height: 0;
      opacity: 0;
    }
    to {
      max-height: 36px;
      opacity: 1;
    }
  }

  .lunettes-list-item-content {
    flex: 1;
    padding: 8px 10px;
    background: transparent;
    border: none;
    border-radius: 8px;
    color: var(--lunettes-text-primary);
    text-align: left;
    cursor: text;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 20px;
    height: 36px;
    margin: 0;
  }

  .lunettes-list-item-content:focus {
    outline: none;
  }

  .lunettes-list-delete {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 10px;
    background: transparent;
    border: none;
    border-radius: 8px;
    color: var(--lunettes-text-gray);
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.15s ease, color 0.15s ease;
    flex-shrink: 0;
  }

  .lunettes-list-item:hover .lunettes-list-delete {
    opacity: 1;
  }

  .lunettes-list-delete:hover {
    color: var(--lunettes-text-secondary);
  }

  .lunettes-list-delete:focus {
    outline: none;
    opacity: 1;
  }

  .lunettes-list-input {
    flex: 1;
    padding: 8px 10px;
    background: transparent;
    border: none;
    border-radius: 8px;
    color: var(--lunettes-text-primary);
    text-align: left;
    cursor: text;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 20px;
    height: 36px;
    margin: 0;
  }

  .lunettes-list-input:focus {
    outline: none;
  }

  .lunettes-list-input::placeholder {
    color: var(--lunettes-text-secondary);
  }

  .lunettes-list-new {
    background: transparent;
  }
</style>
