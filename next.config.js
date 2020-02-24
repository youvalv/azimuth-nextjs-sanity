const path = require('path');
const withSass = require('@zeit/next-sass');
const fse = require('fs-extra');
const _ = require('lodash');

const { getResolvedObjectOfUserTypes } = require('./src/utils/sanity-tools');
const sanityFetchData = require('./src/utils/sanity-fetch-data');

module.exports = withSass({
    exportPathMap: async function(defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
        // remove previously created init-props from public dir
        const publicInitPropsDir = path.join(dir, 'public', 'init-props');
        await fse.remove(publicInitPropsDir);

        let initPropsDir;
        if (outDir) {
            initPropsDir = path.join(outDir, 'init-props');
        } else {
            initPropsDir = publicInitPropsDir;
        }
        console.log(`[exportPathMap] exporting path maps:\n\tdev: ${dev}\n\tdir: ${dir}\n\toutDir: ${outDir}\n\tdistDir: ${distDir}\n\tbuildId: ${buildId}\n\tinitPropsDir: ${initPropsDir}`);

        const data = await sanityFetchData();

        return _.reduce(data.pages, (promise, page) => {
            return promise.then(async (pathMap) => {
                console.log(`[exportPathMap] exporting page path '${page.slug}' as page '/'`);

                pathMap[page.slug] = {
                    page: '/',
                    query: {
                        server: true,
                        path: page.slug,
                        page: page.data,
                        posts: data.posts,
                        config: data.config
                    }
                };

                const jsonFilePath = path.join(initPropsDir, _.trim(page.slug, '/'), 'init-props.json');
                const initPropsData = _.assign({}, pathMap[page.slug].query, { server: false });
                await fse.outputFile(jsonFilePath, JSON.stringify(initPropsData));

                return pathMap;
            });
        }, Promise.resolve({}));
    }
});
