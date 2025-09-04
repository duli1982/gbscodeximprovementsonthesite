document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('terms.json');
    const data = await response.json();

    const nav = document.getElementById('alphabet-nav');
    const main = document.getElementById('glossary-content');

    const letters = Object.keys(data).sort();

    letters.forEach(letter => {
      const link = document.createElement('a');
      link.href = `#${letter}`;
      link.textContent = letter;
      link.className = 'text-blue-600 hover:underline';
      nav.appendChild(link);
    });

    letters.forEach(letter => {
      const section = document.createElement('section');
      section.id = letter;

      const heading = document.createElement('h2');
      heading.className = 'google-sans text-2xl font-semibold mb-4';
      heading.textContent = letter;
      section.appendChild(heading);

      const dl = document.createElement('dl');
      data[letter].forEach(item => {
        const div = document.createElement('div');
        div.className = 'mb-4';

        const dt = document.createElement('dt');
        dt.className = 'font-bold';
        dt.textContent = item.term;
        div.appendChild(dt);

        const dd = document.createElement('dd');
        dd.className = 'text-gray-700';
        dd.textContent = item.definition;
        div.appendChild(dd);

        dl.appendChild(div);
      });
      section.appendChild(dl);
      main.appendChild(section);
    });
  } catch (e) {
    console.error('Failed to load glossary terms', e);
  }
});
