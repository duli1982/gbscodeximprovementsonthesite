import { qs } from '../shared/scripts/utils/dom-helpers.js';

async function loadPartial(selector, url) {
  const container = qs(selector);
  if (!container) return;
  const response = await fetch(url);
  container.innerHTML = await response.text();
}

async function loadPartials() {
  await loadPartial('#header-placeholder', 'header.html');
  await loadPartial('#tools-placeholder', 'tools.html');
  document.dispatchEvent(new Event('partialsLoaded'));
}

loadPartials();
