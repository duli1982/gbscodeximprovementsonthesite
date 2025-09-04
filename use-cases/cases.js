// Helper: show/hide demo
function showDemo(demoType) {
    const demoSection = document.getElementById('demo-section');
    const demoContent = document.getElementById('demo-content');
    let content = '';

    if (demoType === 'sourcing-demo') {
        content = `
            <h3 class="text-xl font-bold mb-4">Boolean Search Generator Demo</h3>
            <div class="mb-4">
                <label class="block text-sm font-semibold mb-2">Job Title:</label>
                <input type="text" id="jobTitle" class="w-full p-3 border rounded-lg" placeholder="e.g., Senior Java Developer">
            </div>
            <div class="mb-4">
                <label class="block text-sm font-semibold mb-2">Required Skills (comma separated):</label>
                <input type="text" id="skills" class="w-full p-3 border rounded-lg" placeholder="e.g., microservices, Spring Boot, AWS">
            </div>
            <div class="flex gap-2">
                <button id="generateSearchBtn" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Generate Boolean Search</button>
                <button id="copySearchBtn" class="bg-gray-100 px-4 py-2 rounded-lg">Copy</button>
            </div>
            <div id="searchResult" class="mt-4 p-4 bg-gray-50 rounded-lg hidden">
                <h4 class="font-semibold mb-2">Generated Search String:</h4>
                <pre id="searchStringOutput" class="bg-white p-3 rounded border font-mono text-sm whitespace-pre-wrap"></pre>
            </div>
        `;
    } else if (demoType === 'content-demo') {
        content = `
            <h3 class="text-xl font-bold mb-4">Job Description Generator Demo</h3>
            <div class="mb-4">
                <label class="block text-sm font-semibold mb-2">Position:</label>
                <input type="text" id="position" class="w-full p-3 border rounded-lg" placeholder="e.g., Senior Software Engineer">
            </div>
            <div class="mb-4">
                <label class="block text-sm font-semibold mb-2">Company Type:</label>
                <select id="companyType" class="w-full p-3 border rounded-lg">
                    <option>Tech Startup</option>
                    <option>Enterprise</option>
                    <option>Consulting</option>
                    <option>Financial Services</option>
                </select>
            </div>
            <div class="flex gap-2">
                <button id="generateJDBtn" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Generate Job Description</button>
                <button id="copyJDBtn" class="bg-gray-100 px-4 py-2 rounded-lg">Copy</button>
            </div>
            <div id="jdResult" class="mt-4 p-4 bg-gray-50 rounded-lg hidden">
                <h4 class="font-semibold mb-2">Generated Job Description Preview:</h4>
                <div id="jdOutput" class="bg-white p-4 rounded border text-sm whitespace-pre-wrap"></div>
            </div>
        `;
    } else {
        content = `
            <h3 class="text-xl font-bold mb-4">Interactive Demo</h3>
            <p class="text-gray-600 mb-4">This demo shows how AI can streamline your workflow. Try the inputs above to see real-time results.</p>
            <div class="bg-blue-50 p-4 rounded-lg">
                <p class="text-blue-800">💡 <strong>Pro Tip:</strong> The more specific your input, the better the AI-generated output will be!</p>
            </div>
        `;
    }

    demoContent.innerHTML = content;
    demoSection.classList.remove('hidden');
    demoSection.scrollIntoView({ behavior: 'smooth' });

    const genSearchBtn = document.getElementById('generateSearchBtn');
    if (genSearchBtn) genSearchBtn.addEventListener('click', generateSearch);

    const copySearchBtn = document.getElementById('copySearchBtn');
    if (copySearchBtn) copySearchBtn.addEventListener('click', () => {
        const out = document.getElementById('searchStringOutput').textContent;
        if (out) navigator.clipboard?.writeText(out);
    });

    const genJDBtn = document.getElementById('generateJDBtn');
    if (genJDBtn) genJDBtn.addEventListener('click', generateJD);

    const copyJDBtn = document.getElementById('copyJDBtn');
    if (copyJDBtn) copyJDBtn.addEventListener('click', () => {
        const out = document.getElementById('jdOutput').textContent;
        if (out) navigator.clipboard?.writeText(out);
    });
}

function hideDemo() {
    document.getElementById('demo-section').classList.add('hidden');
    document.getElementById('demo-content').innerHTML = '';
}

// Boolean search generator
function generateSearch() {
    const jobTitleEl = document.getElementById('jobTitle');
    if (!jobTitleEl) return;
    const jobTitle = jobTitleEl.value.trim();
    const skills = (document.getElementById('skills')?.value || '').trim();

    if (!jobTitle) return;

    const tokens = jobTitle.split(/\s+/).filter(Boolean);
    const phrase = `"${jobTitle}"`;
    const tokenOr = tokens.map(t => `"${t}"`).join(' OR ');
    let searchString = `(${phrase}${tokenOr ? ' OR ' + tokenOr : ''})`;

    if (skills) {
        const skillArray = skills.split(',')
            .map(s => s.trim())
            .filter(Boolean)
            .map(s => `"${s}"`);
        if (skillArray.length) {
            searchString += ` AND (${skillArray.join(' OR ')})`;
        }
    }

    searchString += ' -junior -intern';

    const result = document.getElementById('searchResult');
    const output = document.getElementById('searchStringOutput');
    if (output) output.textContent = searchString;
    if (result) result.classList.remove('hidden');
}

// Simple JD generator
function generateJD() {
    const position = (document.getElementById('position')?.value || '').trim();
    const companyType = (document.getElementById('companyType')?.value || '').trim();

    if (!position) return;

    const jdText = `
${position}

We are a leading ${companyType.toLowerCase()} looking for a talented ${position} to join our dynamic team.

Key Responsibilities:
• Lead technical initiatives and drive innovation
• Collaborate with cross-functional teams
• Mentor junior team members

Requirements:
• 5+ years of relevant experience
• Strong technical and communication skills
• Bachelor's degree in related field
    `.trim();

    const result = document.getElementById('jdResult');
    const out = document.getElementById('jdOutput');
    if (out) out.textContent = jdText;
    if (result) result.classList.remove('hidden');
}

// Filter functionality (no inline 'event' usage)
function filterCases(filter, targetButton) {
    const cases = document.querySelectorAll('.case-item');
    const filters = document.querySelectorAll('.category-filter');

    filters.forEach(f => f.classList.remove('active'));
    if (targetButton) targetButton.classList.add('active');

    cases.forEach(c => {
        if (
            filter === 'all' ||
            c.dataset.category === filter ||
            c.dataset.unit === filter
        ) {
            c.style.display = '';
        } else {
            c.style.display = 'none';
        }
    });
}

async function loadCases() {
    const res = await fetch('cases.json');
    const data = await res.json();
    const categoriesMap = {};
    data.categories.forEach(c => { categoriesMap[c.id] = c.label; });
    const unitsMap = {};
    data.businessUnits.forEach(u => { unitsMap[u.id] = u.label; });

    const filtersEl = document.getElementById('filters');
    const allBtn = document.createElement('button');
    allBtn.dataset.filter = 'all';
    allBtn.className = 'category-filter active px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200';
    allBtn.textContent = 'All Stories';
    filtersEl.appendChild(allBtn);

    data.categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.dataset.filter = cat.id;
        btn.className = 'category-filter px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200';
        btn.textContent = cat.label;
        filtersEl.appendChild(btn);
    });

    data.businessUnits.forEach(unit => {
        const btn = document.createElement('button');
        btn.dataset.filter = unit.id;
        btn.className = 'category-filter px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200';
        btn.textContent = unit.label;
        filtersEl.appendChild(btn);
    });

    const container = document.getElementById('cases-container');
    data.cases.forEach(c => container.appendChild(buildCaseCard(c, categoriesMap, unitsMap)));

    const filterButtons = document.querySelectorAll('#filters .category-filter');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const f = btn.dataset.filter || 'all';
            filterCases(f, btn);
        });
    });

    const demoButtons = document.querySelectorAll('.demo-btn');
    demoButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const demoType = btn.dataset.demo;
            showDemo(demoType);
        });
    });
}

function buildCaseCard(data, categoriesMap, unitsMap) {
    const card = document.createElement('div');
    card.className = 'use-case-card p-8 rounded-xl case-item';
    card.dataset.category = data.category;
    card.dataset.unit = data.businessUnit;

    const top = document.createElement('div');
    top.className = 'flex items-center justify-between mb-4';

    const badges = document.createElement('div');
    badges.className = 'flex gap-2';

    const catBadge = document.createElement('span');
    catBadge.className = 'category-badge px-3 py-1 rounded-full text-xs font-semibold';
    catBadge.textContent = categoriesMap[data.category] || data.category;

    const unitBadge = document.createElement('span');
    unitBadge.className = 'category-badge px-3 py-1 rounded-full text-xs font-semibold';
    unitBadge.textContent = unitsMap[data.businessUnit] || data.businessUnit;

    badges.append(catBadge, unitBadge);

    const impact = document.createElement('span');
    impact.className = 'text-green-600 font-semibold';
    impact.textContent = data.impact;

    top.append(badges, impact);
    card.appendChild(top);

    const title = document.createElement('h3');
    title.className = 'google-sans text-xl font-bold text-gray-900 mb-3';
    title.textContent = data.title;
    card.appendChild(title);

    const beforeAfter = document.createElement('div');
    beforeAfter.className = 'before-after p-4 rounded-lg mb-4';
    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-1 md:grid-cols-2 gap-4';

    const beforeCol = document.createElement('div');
    const beforeHead = document.createElement('h4');
    beforeHead.className = 'font-semibold text-red-700 mb-2';
    beforeHead.textContent = '❌ Before AI';
    const beforeUl = document.createElement('ul');
    beforeUl.className = 'text-sm text-gray-600 space-y-1';
    data.before.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `• ${item}`;
        beforeUl.appendChild(li);
    });
    beforeCol.append(beforeHead, beforeUl);

    const afterCol = document.createElement('div');
    const afterHead = document.createElement('h4');
    afterHead.className = 'font-semibold text-green-700 mb-2';
    afterHead.textContent = '✅ After AI';
    const afterUl = document.createElement('ul');
    afterUl.className = 'text-sm text-gray-600 space-y-1';
    data.after.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `• ${item}`;
        afterUl.appendChild(li);
    });
    afterCol.append(afterHead, afterUl);

    grid.append(beforeCol, afterCol);
    beforeAfter.appendChild(grid);
    card.appendChild(beforeAfter);

    if (data.example) {
        const exDiv = document.createElement('div');
        exDiv.className = 'mb-4';
        const exHead = document.createElement('h4');
        exHead.className = 'font-semibold text-gray-900 mb-2';
        exHead.textContent = data.example.heading;
        const exBox = document.createElement('div');
        exBox.className = 'bg-gray-50 p-3 rounded text-sm';
        exBox.innerHTML = `<strong>Input:</strong> "${data.example.input}"<br><strong>AI Output:</strong> ${data.example.output}`;
        exDiv.append(exHead, exBox);
        card.appendChild(exDiv);
    } else if (data.stats) {
        const statDiv = document.createElement('div');
        statDiv.className = 'mb-4';
        const statHead = document.createElement('h4');
        statHead.className = 'font-semibold text-gray-900 mb-2';
        statHead.textContent = 'Success Metrics:';
        const statGrid = document.createElement('div');
        statGrid.className = 'grid grid-cols-2 gap-4 text-center';
        data.stats.forEach(s => {
            const cell = document.createElement('div');
            cell.className = `bg-${s.color}-50 p-3 rounded`;
            const val = document.createElement('div');
            val.className = `text-2xl font-bold text-${s.color}-600`;
            val.textContent = s.value;
            const lbl = document.createElement('div');
            lbl.className = 'text-xs text-gray-600';
            lbl.textContent = s.label;
            cell.append(val, lbl);
            statGrid.appendChild(cell);
        });
        statDiv.append(statHead, statGrid);
        card.appendChild(statDiv);
    } else if (data.badges) {
        const badgeDiv = document.createElement('div');
        badgeDiv.className = 'mb-4';
        const badgeHead = document.createElement('h4');
        badgeHead.className = 'font-semibold text-gray-900 mb-2';
        badgeHead.textContent = data.badges.heading;
        const badgeBox = document.createElement('div');
        badgeBox.className = 'flex flex-wrap gap-2';
        data.badges.items.forEach(b => {
            const span = document.createElement('span');
            span.className = `bg-${b.color}-100 text-${b.color}-800 px-2 py-1 rounded text-xs`;
            span.textContent = b.text;
            badgeBox.appendChild(span);
        });
        badgeDiv.append(badgeHead, badgeBox);
        card.appendChild(badgeDiv);
    } else if (data.list) {
        const listDiv = document.createElement('div');
        listDiv.className = 'mb-4';
        const listHead = document.createElement('h4');
        listHead.className = 'font-semibold text-gray-900 mb-2';
        listHead.textContent = data.list.heading;
        const listGrid = document.createElement('div');
        listGrid.className = 'grid grid-cols-2 gap-2 text-sm';
        data.list.items.forEach(item => {
            const div = document.createElement('div');
            div.textContent = `• ${item}`;
            listGrid.appendChild(div);
        });
        listDiv.append(listHead, listGrid);
        card.appendChild(listDiv);
    }

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'demo-btn w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200';
    button.dataset.demo = data.demo;
    button.textContent = 'Try This Use Case';
    card.appendChild(button);

    return card;
}

document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .category-filter { background: #f1f3f4; color: #5f6368; }
        .category-filter.active { background: #1967d2; color: white; }
        .category-filter:hover { background: #e8f0fe; color: #1967d2; }
        .category-filter.active:hover { background: #1557b0; color: white; }
    `;
    document.head.appendChild(style);

    loadCases();

    const demoClose = document.getElementById('demo-close');
    if (demoClose) demoClose.addEventListener('click', hideDemo);
});
