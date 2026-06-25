import { find, scrollTo } from '@ember/test-helpers';

export function scrollToPercentage(selector, percentage, axis = 'vertical') {
  const el = find(selector);

  if (axis === 'horizontal') {
    const x = ((el.scrollWidth - el.clientWidth) / 100) * percentage;
    return scrollTo(el, x, 0);
  }

  const y = ((el.scrollHeight - el.clientHeight) / 100) * percentage;
  return scrollTo(el, 0, y);
}
