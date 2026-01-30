import { settings, type Settings } from '../settings';
import { buildBionicFontCss } from './css';
import { isSiteFiltered } from './filters';
import { injectStyle } from './style';

let styleElement: HTMLStyleElement | null = null;
let applyToken = 0;

const removeStyle = () => {
  if (styleElement) {
    styleElement.remove();
    styleElement = null;
  }
};

const applySettings = async (current: Settings): Promise<void> => {
  const token = ++applyToken;
  const url = new URL(window.location.href);

  if (isSiteFiltered(current, url)) {
    removeStyle();
    return;
  }

  const css = await buildBionicFontCss(current);
  if (token !== applyToken) {
    return;
  }

  if (!css.trim()) {
    removeStyle();
    return;
  }

  removeStyle();
  styleElement = injectStyle(css);
};

export const initBionicReading = (): (() => void) => {
  if (typeof window === 'undefined') {
    return () => {};
  }

  void applySettings(settings.get());
  const unsubscribe = settings.subscribe((current) => {
    void applySettings(current);
  });

  return () => {
    unsubscribe();
    removeStyle();
  };
};
