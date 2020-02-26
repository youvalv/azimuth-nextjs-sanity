const withSass = require('@zeit/next-sass');
const _ = require('lodash');

const { getResolvedObjectOfUserTypes } = require('./src/utils/sanity-tools');
const reduceDataForExport = require('./src/utils/ssg-reduce-data');
const exportPages = require('./src/utils/ssg-export-pages');

module.exports = withSass({
    exportPathMap: async function(defaultPathMap, { dev, dir, outDir, distDir, buildId }) {

        // Get data from Sanity
        let data = await getResolvedObjectOfUserTypes();

        // Reduce the data to format expected by ssg-export-path-map
        data = reduceDataForExport({
            data,
            pageTypes: [
                { page: '/', path: '/{slug.current}', predicate: _.matchesProperty('_type', 'landing') },
                { page: '/', path: '/{slug.current}', predicate: _.matchesProperty('_type', 'page') },
                { page: '/', path: '/{slug.current}', predicate: _.matchesProperty('_type', 'blog') },
                { page: '/', path: '/blog/{slug.current}', predicate: _.matchesProperty('_type', 'post') }
            ],
            propsMap: {
                config: { single: true, predicate: _.matchesProperty('_type', 'site_config') },
                posts: { predicate: _.matchesProperty('_type', 'post') }
            }
        });

        // Export the data
        return exportPages({ data, defaultPathMap, dev, dir, outDir, distDir, buildId });
    }
});
