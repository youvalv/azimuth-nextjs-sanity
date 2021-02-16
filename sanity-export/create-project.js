const sanityClient = require('@sanity/client');
const Configstore = require('configstore');

async function createProject({ projectName, dataset }) {
    const config = new Configstore('sanity', {}, {globalConfigPath: true});
    const token = config.get('authToken')

    const client = sanityClient({
        useProjectHostname: false,
        token: token,
        useCdn: false
    });

    console.log('creating a project...');
    const project = await client.request({
        url: '/projects',
        method: 'POST',
        body: {
            displayName: projectName
        }
    });

    console.log('created a project, projectId:', project.id);

    console.log('creating a dataset...');
    const datasetRes = await client.request({
        url: `/projects/${project.id}/datasets/${dataset}`,
        method: 'PUT',
        body: {
            aclMode: 'private'
        }
    });
    console.log('created a dataset');

}

createProject({
    projectName: 'My Sanity Project',
    dataset: 'production'
}).catch((error) => {
    console.error('failed to create new project', error);
});
