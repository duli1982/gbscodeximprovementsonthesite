const fs = require('fs');
const path = require('path');

// Define paths relative to the project root
const projectRoot = path.join(__dirname, '..');
const paths = {
    gbsPrompts: path.join(projectRoot, 'scripts/prompts.json'),
    dailyFocus: path.join(projectRoot, 'daily-focus/focus.json'),
    dailyFocusPrompts: path.join(projectRoot, 'daily-focus/prompts.json'),
    outputDir: path.join(projectRoot, 'shared'),
    outputFile: path.join(projectRoot, 'shared/search-index.json')
};

function processGbsPrompts() {
    const rawData = fs.readFileSync(paths.gbsPrompts, 'utf-8');
    const jsonData = JSON.parse(rawData);
    const prompts = [];

    for (const category in jsonData.promptData) {
        for (const subcategory in jsonData.promptData[category]) {
            jsonData.promptData[category][subcategory].forEach(prompt => {
                prompts.push({
                    id: prompt.id,
                    title: prompt.title,
                    description: prompt.description || '',
                    content: prompt.content,
                    url: `gbs-prompts/index.html?showPrompt=${prompt.id}`,
                    category: category,
                    subcategory: subcategory,
                    type: 'Prompt'
                });
            });
        }
    }
    return prompts;
}

function processDailyFocus() {
    const rawData = fs.readFileSync(paths.dailyFocus, 'utf-8');
    const jsonData = JSON.parse(rawData);
    const focusPoints = [];

    jsonData.forEach((item, index) => {
        const id = `daily-focus-${index + 1}`;
        focusPoints.push({
            id: id,
            title: item.title,
            description: item.quote,
            content: `${item.quote} ${item.actions.join(' ')}`,
            url: `daily-focus/index.html?focusId=${id}`,
            category: item.category,
            type: 'Focus Point'
        });
    });
    return focusPoints;
}

function processDailyFocusPrompts() {
    const rawData = fs.readFileSync(paths.dailyFocusPrompts, 'utf-8');
    const jsonData = JSON.parse(rawData);
    const prompts = [];

    for (const category in jsonData.promptData) {
        for (const subcategory in jsonData.promptData[category]) {
            jsonData.promptData[category][subcategory].forEach(prompt => {
                prompts.push({
                    id: prompt.id,
                    title: prompt.title,
                    description: prompt.description || '',
                    content: prompt.content,
                    url: `daily-focus/index.html?showPrompt=${prompt.id}`,
                    category: category,
                    subcategory: subcategory,
                    type: 'Daily Focus Prompt'
                });
            });
        }
    }
    return prompts;
}

function buildIndex() {
    try {
        console.log('Starting search index build...');

        const gbsPrompts = processGbsPrompts();
        const dailyFocusPoints = processDailyFocus();
        const dailyFocusPrompts = processDailyFocusPrompts();

        const combinedIndex = [...gbsPrompts, ...dailyFocusPoints, ...dailyFocusPrompts];

        // Ensure the output directory exists
        if (!fs.existsSync(paths.outputDir)) {
            fs.mkdirSync(paths.outputDir, { recursive: true });
        }

        fs.writeFileSync(paths.outputFile, JSON.stringify(combinedIndex, null, 2));

        console.log(`Successfully built search index with ${combinedIndex.length} items.`);
        console.log(`Index file created at: ${paths.outputFile}`);

    } catch (error) {
        console.error('Error building search index:', error);
        process.exit(1);
    }
}

buildIndex();
