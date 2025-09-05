document.addEventListener('DOMContentLoaded', () => {
    fetch('updates.json')
        .then(res => res.json())
        .then(items => {
            items.sort((a, b) => new Date(b.date) - new Date(a.date));
            const container = document.getElementById('updates-container');
            items.forEach(({ date, title, url }) => {
                const li = document.createElement('li');
                li.className = 'border border-gray-200 rounded-lg p-4 bg-white';

                const link = document.createElement('a');
                link.href = '../' + url;
                link.textContent = title;
                link.className = 'text-blue-600 hover:underline font-medium';

                const span = document.createElement('span');
                span.textContent = ` - ${date}`;
                span.className = 'text-sm text-gray-500';

                li.appendChild(link);
                li.appendChild(span);
                container.appendChild(li);
            });
        })
        .catch(err => console.error('Failed to load updates:', err));
});
