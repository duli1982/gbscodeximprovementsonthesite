import { qs } from '../shared/scripts/utils/dom-helpers.js';

async function loadPartial(selector, url) {
  const container = qs(selector);
  if (!container) return;
  const response = await fetch(url);
  container.innerHTML = await response.text();
}

async function loadPartials() {
  const baseUrl = new URL('.', import.meta.url);
  await loadPartial('#header-placeholder', new URL('header.html', baseUrl));
  await loadPartial('#tools-placeholder', new URL('tools.html', baseUrl));
  document.dispatchEvent(new Event('partialsLoaded'));
}

loadPartials();
