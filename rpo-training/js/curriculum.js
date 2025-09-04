document.addEventListener('DOMContentLoaded', () => {
    fetch('curriculum.json')
        .then(response => response.json())
        .then(data => {
            buildTracks(data.tracks);
            buildPhases(data.phases);
        })
        .catch(error => console.error('Error loading curriculum:', error));

    function buildTracks(tracks) {
        const container = document.getElementById('tracks-container');
        if (!container) return;
        tracks.forEach(track => {
            const link = document.createElement('a');
            link.href = track.link;
            link.className = 'module-card text-center';
            link.innerHTML = `
                <p class="text-sm font-semibold text-blue-600">${track.label}</p>
                <h4 class="google-sans text-xl font-bold mt-2">${track.title}</h4>
                <p class="mt-2 text-gray-600">${track.description}</p>
            `;
            container.appendChild(link);
        });
    }

    function buildPhases(phases) {
        const phasesContainer = document.getElementById('phases-container');
        if (!phasesContainer) return;
        phases.forEach((phase, index) => {
            const section = document.createElement('section');
            section.className = 'phase-section' + (index > 0 ? ' border-t border-gray-200' : '');

            const grid = document.createElement('div');
            grid.className = 'grid md:grid-cols-2 gap-8 items-center';

            const textDiv = document.createElement('div');
            if (phase.imageFirst) textDiv.classList.add('md:order-1');
            const phaseLabel = document.createElement('span');
            phaseLabel.className = `google-sans text-sm font-bold text-${phase.color}-600`;
            phaseLabel.textContent = phase.label;
            const phaseTitle = document.createElement('h3');
            phaseTitle.className = 'google-sans text-3xl font-bold mt-2';
            phaseTitle.textContent = phase.title;
            const phaseDesc = document.createElement('p');
            phaseDesc.className = 'mt-4 text-gray-600';
            phaseDesc.textContent = phase.description;
            textDiv.appendChild(phaseLabel);
            textDiv.appendChild(phaseTitle);
            textDiv.appendChild(phaseDesc);

            const imgDiv = document.createElement('div');
            imgDiv.className = 'flex justify-center';
            if (phase.imageFirst) imgDiv.classList.add('md:order-2');
            const img = document.createElement('img');
            img.src = phase.image;
            img.alt = phase.title;
            img.className = 'rounded-lg shadow-md';
            imgDiv.appendChild(img);

            if (phase.imageFirst) {
                grid.appendChild(imgDiv);
                grid.appendChild(textDiv);
            } else {
                grid.appendChild(textDiv);
                grid.appendChild(imgDiv);
            }

            const modulesDiv = document.createElement('div');
            const cols = Math.min(phase.modules.length, 3);
            modulesDiv.className = `mt-8 grid md:grid-cols-${cols} gap-6`;

            phase.modules.forEach((mod, idx) => {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'module-card text-left';
                button.addEventListener('click', () => navigateTo(mod.id));

                const modLabel = document.createElement('p');
                modLabel.className = `text-sm font-semibold text-${phase.color}-600`;
                modLabel.textContent = `MODULE ${idx + 1}`;
                const modTitle = document.createElement('h3');
                modTitle.className = 'google-sans text-xl font-bold mt-2';
                modTitle.textContent = mod.title;
                const modDesc = document.createElement('p');
                modDesc.className = 'mt-2 text-gray-600';
                modDesc.textContent = mod.description;

                button.appendChild(modLabel);
                button.appendChild(modTitle);
                button.appendChild(modDesc);

                modulesDiv.appendChild(button);
            });

            section.appendChild(grid);
            section.appendChild(modulesDiv);
            phasesContainer.appendChild(section);
        });
    }
});
