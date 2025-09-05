document.addEventListener('DOMContentLoaded', () => {
    fetch('updates/updates.json')
        .then(res => res.json())
        .then(items => {
            items.sort((a, b) => new Date(b.date) - new Date(a.date));
            const list = document.getElementById('latest-updates-list');
            const top = items.slice(0, 3);
            top.forEach(({ date, title, url }) => {
                const li = document.createElement('li');
                const link = document.createElement('a');
                link.href = url;
                link.textContent = title;
                link.className = 'text-blue-600 hover:underline';

                const span = document.createElement('span');
                span.textContent = ` - ${date}`;
                span.className = 'text-sm text-gray-500';

                li.appendChild(link);
                li.appendChild(span);
                list.appendChild(li);
            });
        })
        .catch(err => console.error('Failed to load latest updates:', err));
});
