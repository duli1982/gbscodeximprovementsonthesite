document.addEventListener('DOMContentLoaded', () => {
  fetch('files/manifest.json')
    .then(response => response.json())
    .then(data => {
      Object.entries(data).forEach(([category, files]) => {
        const list = document.querySelector(`ul[data-section="${category}"]`);
        if (!list) return;
        list.innerHTML = '';
        files.forEach(item => {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = `files/${item.file}`;
          a.textContent = item.name;
          a.className = 'text-blue-600 hover:underline';
          a.target = '_blank';
          li.appendChild(a);
          list.appendChild(li);
        });
      });
    })
    .catch(err => console.error('Failed to load resources manifest', err));
});
