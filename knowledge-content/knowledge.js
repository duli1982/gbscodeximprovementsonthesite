async function loadKnowledgeContent() {
  try {
    const response = await fetch('data.json');
    const data = await response.json();

    const chevron = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 chevron" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>';

    const videoContainer = document.getElementById('video-accordion');
    data.trainingVideos.forEach(video => {
      const details = document.createElement('details');
      details.className = 'group';

      const summary = document.createElement('summary');
      summary.className = 'flex items-center justify-between p-3 font-semibold text-gray-700 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors';
      summary.innerHTML = `<span>${video.title} <span class="text-sm font-medium text-gray-500">(${video.duration})</span></span>${chevron}`;

      const content = document.createElement('div');
      content.className = 'p-4 mt-2';
      content.innerHTML = `<div class="iframe-container rounded-lg"><iframe src="${video.src}" allow="autoplay"></iframe></div>`;

      details.appendChild(summary);
      details.appendChild(content);
      videoContainer.appendChild(details);
    });

    const roleContainer = document.getElementById('role-accordion');
    data.rolePrompts.forEach(group => {
      const details = document.createElement('details');
      details.className = 'group';

      const summary = document.createElement('summary');
      summary.className = 'flex items-center justify-between p-3 font-semibold text-gray-700 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors';
      summary.innerHTML = `${group.title}${chevron}`;

      const list = document.createElement('div');
      list.className = 'p-4 space-y-2 border-l-2 border-indigo-200 ml-3';
      group.links.forEach(link => {
        const a = document.createElement('a');
        a.href = link.url;
        a.textContent = link.label;
        a.className = 'block text-indigo-700 hover:underline';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        list.appendChild(a);
      });

      details.appendChild(summary);
      details.appendChild(list);
      roleContainer.appendChild(details);
    });
  } catch (err) {
    console.error('Failed to load knowledge content', err);
  }
}

document.addEventListener('DOMContentLoaded', loadKnowledgeContent);
