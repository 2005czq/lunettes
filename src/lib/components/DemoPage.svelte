<script lang="ts">
  import { locale, t } from '../i18n';
  import Dropdown from './Dropdown.svelte';
  import ToggleGroup from './ToggleGroup.svelte';
  import EditableList from './EditableList.svelte';

  const currentLocale = $derived($locale);

  // Demo data
  let dropdownValue = $state('');
  const dropdownOptions = [
    { value: 'option1', label: '选项一 / Option 1' },
    { value: 'option2', label: '选项二 / Option 2' },
    { value: 'option3', label: '选项三 / Option 3' },
    { value: 'option4', label: '选项四 / Option 4' },
    { value: 'option5', label: '选项五 / Option 5' },
  ];

  let toggleValue = $state('daily');
  const toggleOptions = [
    { value: 'daily', label: '每日' },
    { value: 'weekly', label: '每周' },
    { value: 'monthly', label: '每月' },
  ];

  let listItems = $state(['示例条目 1', '示例条目 2', '示例条目 3']);
</script>

<div class="lunettes-demo">
  <h2 class="lunettes-demo-title">{t('demo.title', currentLocale)}</h2>

  <div class="lunettes-demo-section">
    <h3 class="lunettes-demo-section-title">{t('demo.dropdown', currentLocale)}</h3>
    <div class="lunettes-demo-content">
      <Dropdown
        options={dropdownOptions}
        defaultValue="option2"
        bind:value={dropdownValue}
      />
    </div>
  </div>

  <div class="lunettes-demo-section">
    <h3 class="lunettes-demo-section-title">{t('demo.toggleGroup', currentLocale)}</h3>
    <div class="lunettes-demo-content">
      <ToggleGroup
        options={toggleOptions}
        bind:value={toggleValue}
      />
    </div>
  </div>

  <div class="lunettes-demo-section">
    <h3 class="lunettes-demo-section-title">{t('demo.list', currentLocale)}</h3>
    <div class="lunettes-demo-content">
      <EditableList
        bind:items={listItems}
        maxHeight={200}
      />
    </div>
  </div>
</div>

<style>
  .lunettes-demo {
    display: flex;
    flex-direction: column;
    gap: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif;
  }

  .lunettes-demo-title {
    margin: 0;
    font-weight: 600;
    color: rgb(242, 242, 247);
    font-size: 25px;
  }

  .lunettes-demo-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .lunettes-demo-section-title {
    margin: 0;
    font-size: 14px;
    font-weight: 500;
    color: rgb(142, 142, 147);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .lunettes-demo-content {
    width: 100%;
  }

  @media (prefers-color-scheme: light) {
    .lunettes-demo-title {
      color: rgb(28, 28, 30);
    }
  }
</style>
