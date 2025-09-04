const fs = require('fs');
const path = require('path');

const filesDir = path.join(__dirname, '..', 'resources', 'files');

const categoryMap = [
  { key: 'sourcing', name: 'Sourcing Scripts' },
  { key: 'policy', name: 'Policy Checklists' }
];

const manifest = {};

fs.readdirSync(filesDir).forEach(file => {
  const ext = path.extname(file).toLowerCase();
  if (ext !== '.pdf') return;
  const categoryEntry = categoryMap.find(c => file.includes(c.key)) || { name: 'Other Resources' };
  const category = categoryEntry.name;
  manifest[category] = manifest[category] || [];

  const title = file
    .replace(/-/g, ' ')
    .replace(ext, '')
    .replace(/\b\w/g, c => c.toUpperCase());

  manifest[category].push({
    file,
    name: `${title} (${ext.toUpperCase().slice(1)})`
  });
});

fs.writeFileSync(path.join(filesDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log('Manifest generated.');
