import { writable, derived } from 'svelte/store';

export type Locale = 'zh-CN' | 'en';

export const locale = writable<Locale>('zh-CN');

const translations: Record<Locale, Record<string, string>> = {
  'zh-CN': {
    // Dropdown
    'dropdown.placeholder': '请选择',
    'dropdown.noOptions': '暂无选项',

    // Toggle Group
    'toggleGroup.label': '切换选项',

    // List
    'list.addPlaceholder': '添加新条目...',
    'list.empty': '暂无条目',

    // Demo
    'demo.title': '组件演示',
    'demo.dropdown': '下拉框',
    'demo.toggleGroup': '切换按钮组',
    'demo.list': '列表',
    'demo.close': '关闭',

    // Settings
    'settings.title': '设置',
  },
  'en': {
    // Dropdown
    'dropdown.placeholder': 'Select...',
    'dropdown.noOptions': 'No options',

    // Toggle Group
    'toggleGroup.label': 'Toggle Options',

    // List
    'list.addPlaceholder': 'Add new item...',
    'list.empty': 'No items',

    // Demo
    'demo.title': 'Component Demo',
    'demo.dropdown': 'Dropdown',
    'demo.toggleGroup': 'Toggle Group',
    'demo.list': 'List',
    'demo.close': 'Close',

    // Settings
    'settings.title': 'Settings',
  }
};

export function t(key: string, currentLocale: Locale): string {
  return translations[currentLocale]?.[key] || key;
}

export const i18n = derived(locale, ($locale) => {
  return (key: string) => t(key, $locale);
});
