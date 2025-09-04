// Handle role selection and dashboard sections

document.addEventListener('DOMContentLoaded', () => {
  const selector = document.getElementById('role-selector');
  const saveBtn = document.getElementById('save-role');
  const sectionsContainer = document.getElementById('dashboard-sections');

  const roleSections = {
    rpo: [
      { title: 'RPO Training', description: 'Training curriculum for RPO teams.', url: '/rpo-training/' },
      { title: 'Sourcing Workshop', description: 'Interactive sourcing workshop.', url: '/sourcing-workshop/' }
    ],
    msp: [
      { title: 'GBS AI Workshop', description: 'AI workshop resources for MSP.', url: '/gbs-ai-workshop/' },
      { title: 'Resources', description: 'General resources and guides.', url: '/resources/' }
    ],
    admin: [
      { title: 'Feedback', description: 'View user feedback submissions.', url: '/feedback/' },
      { title: 'Knowledge Content', description: 'Manage knowledge base materials.', url: '/knowledge-content/' }
    ]
  };

  function renderSections(role) {
    if (!sectionsContainer || !roleSections[role]) return;
    sectionsContainer.innerHTML = '';
    roleSections[role].forEach(section => {
      const link = document.createElement('a');
      link.href = section.url;
      link.className = 'hub-card bg-white p-8 rounded-xl block';
      link.innerHTML = `
        <h3 class="google-sans text-2xl font-bold mb-2">${section.title}</h3>
        <p class="text-gray-600">${section.description}</p>
      `;
      sectionsContainer.appendChild(link);
    });
  }

  const storedRole = localStorage.getItem('userRole');
  if (storedRole && selector) {
    selector.value = storedRole;
    renderSections(storedRole);
  }

  if (saveBtn && selector) {
    saveBtn.addEventListener('click', () => {
      const role = selector.value;
      if (!role) return;
      localStorage.setItem('userRole', role);
      renderSections(role);
    });
  }
});
