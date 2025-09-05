document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('content.json');
    const data = await response.json();
    renderSection(
      'contract-essentials',
      data.contractEssentials,
      'Contract Essentials',
      'Review fundamental elements of staffing agreements.'
    );
    renderSection(
      'customization-review',
      data.customizationReview,
      'Customization & Review',
      'Tailor templates and validate terms.'
    );
  } catch (error) {
    console.error('Error loading contract content:', error);
  }
});

function renderSection(id, content, title, description) {
  const section = document.getElementById(id);
  if (!section) return;
  section.innerHTML = `
    <h2 class="google-sans text-2xl font-bold mb-2">${title}</h2>
    <p class="mb-4">${description}</p>
    ${renderList('Lesson Structure', content.lessons)}
    ${renderList('Exercises', content.exercises)}
    ${renderResources('Resources', content.resources)}
  `;
}

function renderList(heading, items) {
  const lis = items.map(item => `<li>${item}</li>`).join('');
  return `
    <h3 class="font-semibold mb-2">${heading}</h3>
    <ul class="list-disc list-inside mb-4">${lis}</ul>
  `;
}

function renderResources(heading, items) {
  const lis = items
    .map(r => `<li><a href="${r.url}" class="text-blue-600 hover:underline">${r.text}</a></li>`)
    .join('');
  return `
    <h3 class="font-semibold mb-2">${heading}</h3>
    <ul class="list-disc list-inside">${lis}</ul>
  `;
}
