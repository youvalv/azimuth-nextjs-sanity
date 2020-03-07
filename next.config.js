const withSass = require('@zeit/next-sass');
const _ = require('lodash');

const { getObjectsOfUserTypes } = require('./src/ssg/sanity-client');
const { reduceDataForInitPropsExport } = require('./src/ssg/ssg-utils');
const { withInitPropsExport } = require('./src/ssg/ssg-export');

module.exports = withSass(withInitPropsExport({
    exportInitProps: async function({ updateInitProps }) {

        // Options to reduce the data to the format expected by exportSSGData
        const dataReduceOptions = {
            pageTypes: [
                { page: '/', path: '/{slug}', predicate: _.matchesProperty('_type', 'landing') },
                { page: '/', path: '/{slug}', predicate: _.matchesProperty('_type', 'page') },
                { page: '/', path: '/{slug}', predicate: _.matchesProperty('_type', 'blog') },
                { page: '/', path: '/blog/{slug}', predicate: _.matchesProperty('_type', 'post') }
            ],
            propsMap: {
                config: { single: true, predicate: _.matchesProperty('_type', 'site_config') },
                posts: { predicate: _.matchesProperty('_type', 'post') }
            }
        };

        // Get all user defined content from Sanity
        // and continue listening for content as they change
        const data = await getObjectsOfUserTypes({
            resolveReferences: true,
            overlayDrafts: true,
            removeAssets: true,
            listen: (data) => {
                data = reduceDataForInitPropsExport(data, dataReduceOptions);
                updateInitProps(data);
            }
        });

        return reduceDataForInitPropsExport(data, dataReduceOptions);
    }
}));
