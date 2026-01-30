import { writable } from 'svelte/store';

export type Locale = 'zh-CN' | 'en';

export const locale = writable<Locale>('en');

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

    // Settings
    'settings.title': '设置',
    'settings.language': '界面语言',
    'settings.theme': '主题',
    'settings.theme.light': '亮色',
    'settings.theme.system': '跟随系统',
    'settings.theme.dark': '暗色',
    'settings.fonts.sansSerif': '替换的非衬线体',
    'settings.fonts.serif': '替换的衬线体',
    'settings.fonts.placeholder': '输入字体名称...',
    'settings.filter.title': '过滤的网站',
    'settings.filter.blacklist': '黑名单模式',
    'settings.filter.whitelist': '白名单模式',
    'settings.filter.placeholder': '输入网址...',
    'settings.menu.floatingButton.on': '悬浮按钮：开',
    'settings.menu.floatingButton.off': '悬浮按钮：关',
    'settings.menu.reset': '恢复出厂设置',
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

    // Settings
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.theme.light': 'Light',
    'settings.theme.system': 'System',
    'settings.theme.dark': 'Dark',
    'settings.fonts.sansSerif': 'Sans-serif to Replace',
    'settings.fonts.serif': 'Serif to Replace',
    'settings.fonts.placeholder': 'Enter font name...',
    'settings.filter.title': 'Filtered Sites',
    'settings.filter.blacklist': 'Blacklist',
    'settings.filter.whitelist': 'Whitelist',
    'settings.filter.placeholder': 'Enter URL...',
    'settings.menu.floatingButton.on': 'Floating Button: On',
    'settings.menu.floatingButton.off': 'Floating Button: Off',
    'settings.menu.reset': 'Reset to Factory Defaults',
  }
};

export function t(key: string, currentLocale: Locale): string {
  return translations[currentLocale]?.[key] || key;
}
