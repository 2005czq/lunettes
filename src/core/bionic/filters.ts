import type { Settings } from '../settings';

const escapeRegex = (value: string) => value.replace(/[.+?^${}()|[\]\\]/g, '\\$&');

const wildcardMatch = (target: string, pattern: string): boolean => {
  const escaped = escapeRegex(pattern).replace(/\*/g, '.*');
  const regex = new RegExp(`^${escaped}$`, 'i');
  return regex.test(target);
};

const matchesPattern = (url: URL, pattern: string): boolean => {
  const trimmed = pattern.trim();
  if (!trimmed) {
    return false;
  }

  if (trimmed.includes('://')) {
    return wildcardMatch(url.href, trimmed);
  }

  if (trimmed.includes('/')) {
    const hostAndPath = `${url.host}${url.pathname}${url.search}${url.hash}`;
    return wildcardMatch(hostAndPath, trimmed);
  }

  return wildcardMatch(url.host, trimmed) || wildcardMatch(url.hostname, trimmed);
};

export const isSiteFiltered = (settings: Settings, url: URL): boolean => {
  const filterList = settings.filterMode === 'blacklist' ? settings.blacklist : settings.whitelist;
  const hasMatch = filterList.some((pattern) => matchesPattern(url, pattern));

  if (settings.filterMode === 'blacklist') {
    return hasMatch;
  }

  return !hasMatch;
};
