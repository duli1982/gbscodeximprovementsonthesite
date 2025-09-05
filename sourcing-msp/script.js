document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('content.json');
    const data = await response.json();
    renderSection(
      'msp-fundamentals',
      data.mspFundamentals,
      'MSP Fundamentals',
      'Understand the structure and goals of the MSP program.'
    );
    renderSection(
      'supplier-collaboration',
      data.supplierCollaboration,
      'Supplier Collaboration',
      'Learn how to work effectively with staffing suppliers in an MSP environment.'
    );
  } catch (error) {
    console.error('Error loading MSP content:', error);
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
