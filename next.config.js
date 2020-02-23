const path = require('path');
const withSass = require('@zeit/next-sass');
const fse = require('fs-extra');
const _ = require('lodash');

const { getObjectsOfUserTypes, resolveReferences } = require('./src/utils/sanity-client');

module.exports = withSass({
    exportPathMap: async function(defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
        // remove previously created init-props from public dir
        await fse.remove(path.join(dir, 'public', 'init-props'));

        const initPropsDir = path.join(outDir || path.join(dir, 'public'), 'init-props');
        console.log(`[exportPathMap] exporting path maps:\n  dev: ${dev}\n  dir: ${dir}\n  outDir: ${outDir}\n  distDir: ${distDir}\n  buildId: ${buildId}\n  initPropsDir: ${initPropsDir}`);

        let data = await getObjectsOfUserTypes();
        data = resolveReferences(data);
        data = _.reject(data, {_type: 'sanity.imageAsset'});

        const siteConfig = _.find(data, {_type: 'site_config'});
        const posts = _.filter(data, {_type: 'post'});
        const pages = _.filter(data, item => _.includes(['landing', 'page', 'blog', 'post'], item._type));

        return _.reduce(pages, (promise, page) => {
            return promise.then(async (pathMap) => {
                const pageType = _.get(page, '_type');

                let slug = _.get(page, 'slug.current');
                if (!slug) {
                    return pathMap;
                }

                if (pageType === 'post') {
                    slug = `/blog/${slug}`;
                }
                if (!_.startsWith(slug, '/')) {
                    slug = '/' + slug;
                }

                console.log(`[exportPathMap] exporting page path '${slug}' as page '/'`);

                pathMap[slug] = {
                    page: '/',
                    query: {
                        server: true,
                        path: slug,
                        page: page,
                        posts: posts,
                        siteConfig: siteConfig
                    }
                };

                const jsonFilePath = path.join(initPropsDir, _.trim(slug, '/'), 'init-props.json');
                const initPropsData = _.assign({}, pathMap[slug].query, {
                    server: false
                });
                await fse.outputFile(jsonFilePath, JSON.stringify(initPropsData));

                return pathMap;
            });
        }, Promise.resolve({}));
    }
});
