async function loadEvents() {
  try {
    const response = await fetch('schedule.json');
    const events = await response.json();
    const container = document.getElementById('event-list');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    events
      .filter(e => {
        const eventDate = new Date(e.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= today;
      })
      .forEach(e => {
        const card = document.createElement('div');
        card.className = 'bg-white p-6 rounded-lg shadow';

        const title = document.createElement('h2');
        title.className = 'text-xl font-semibold';
        const formattedDate = new Date(e.date).toLocaleDateString(undefined, {
          month: 'long',
          day: 'numeric'
        });
        title.textContent = `${e.title} - ${formattedDate}`;

        const desc = document.createElement('p');
        desc.className = 'mt-2 text-gray-600';
        desc.textContent = e.description;

        const link = document.createElement('a');
        link.href = e.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.className = 'text-blue-600 underline';
        link.textContent = 'Register';

        card.appendChild(title);
        card.appendChild(desc);
        card.appendChild(link);
        container.appendChild(card);
      });
  } catch (err) {
    console.error('Failed to load events', err);
  }
}

document.addEventListener('DOMContentLoaded', loadEvents);
