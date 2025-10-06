import { find, scrollTo } from '@ember/test-helpers';

export function scrollToPercentage(selector, percentage) {
  const el = find(selector);
  const y = ((el.scrollHeight - el.clientHeight) / 100) * percentage;
  return scrollTo(el, 0, y);
}
