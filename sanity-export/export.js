const path = require('path');
const sanityClient = require('@sanity/client');
const exportDataset = require('@sanity/export');
const Configstore = require('configstore');

const config = new Configstore('sanity', {}, {globalConfigPath: true});
const token = config.get('authToken');
const projectId = process.argv[2];

const client = sanityClient({
    projectId: process.env.SANITY_PROJECT_ID || projectId,
    dataset: process.env.SANITY_DATASET || 'production',
    token: process.env.SANITY_TOKEN || token,
    useCdn: false
});

let currentStep = null;
const options = {
    client: client,
    dataset: 'production',
    outputPath: path.join(__dirname, 'export.json'),

    compress: false,
    drafts: true,
    assets: true,
    raw: false,
    assetConcurrency: 5,
    // types: '',

    onProgress: ({ step, current, total, update }) => {
        if (currentStep !== step) {
            if (currentStep) {
                return;
            }
            currentStep = step;
            console.log(step);
        }
    }
};

console.log('Start Sanity export');
exportDataset(options).then(() => {
    console.log('Start export finished');
});
