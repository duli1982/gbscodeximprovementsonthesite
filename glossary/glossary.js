document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('terms.json');
    const data = await response.json();
    const grid = document.getElementById('glossary-grid');
    grid.className = 'grid gap-6 md:grid-cols-2';
    data.forEach(item => {
      const card = document.createElement('div');
      card.className = 'bg-white p-6 rounded-lg shadow';

      const title = document.createElement('h3');
      title.className = 'google-sans text-xl font-semibold mb-2';
      title.textContent = item.term;
      card.appendChild(title);

      const desc = document.createElement('p');
      desc.className = 'text-gray-700';
      desc.textContent = item.definition;
      card.appendChild(desc);

      grid.appendChild(card);
    });
  } catch (e) {
    console.error('Failed to load glossary terms', e);
  }
});
