const withSass = require('@zeit/next-sass');
const _ = require('lodash');

const { getObjectsOfUserTypes } = require('./src/ssg/sanity-utils');
const { reduceAndTransformData, withRemoteDataUpdates } = require('./src/ssg/ssg-utils');


module.exports = withSass(withRemoteDataUpdates({
    liveUpdateOnRemoteDataChange: true,
    fetchRemoteData: async ({ updateRemoteData }) => {
        const dataReduceOptions = {
            pageTypes: [
                { path: '/{slug}', predicate: _.matchesProperty('_type', 'landing') },
                { path: '/{slug}', predicate: _.matchesProperty('_type', 'page') },
                { path: '/{slug}', predicate: _.matchesProperty('_type', 'blog') },
                { path: '/blog/{slug}', predicate: _.matchesProperty('_type', 'post') }
            ],
            propsMap: {
                config: { single: true, predicate: _.matchesProperty('_type', 'site_config') },
                posts: { predicate: _.matchesProperty('_type', 'post') }
            }
        };

        const data = await getObjectsOfUserTypes({
            resolveReferences: true,
            overlayDrafts: true,
            removeAssets: true,
            listen: async (data) => {
                const transformedData = reduceAndTransformData(data, dataReduceOptions);
                updateRemoteData(transformedData);
            }
        });

        return reduceAndTransformData(data, dataReduceOptions);
    }
}));
