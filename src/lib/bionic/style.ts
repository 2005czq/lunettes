declare function GM_addStyle(css: string): HTMLStyleElement;

export const injectStyle = (css: string): HTMLStyleElement => {
  if (typeof GM_addStyle === 'function') {
    return GM_addStyle(css);
  }

  const style = document.createElement('style');
  style.textContent = css;
  (document.head || document.documentElement).appendChild(style);
  return style;
};
