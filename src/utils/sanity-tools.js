const sanityClient = require('@sanity/client');
const _ = require('lodash');

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET;
const token = process.env.SANITY_TOKEN;

module.exports = {
    getObjectsOfTypes,
    getObjectsOfUserTypes,
    getResolvedObjectOfUserTypes,
    resolveReferences
};

function getSanityClient() {
    return sanityClient({
        projectId: projectId,
        dataset: dataset,
        token: token,
        useCdn: false
    });
}

function getObjectsOfTypes(types) {
    const client = getSanityClient();
    return client.fetch('*[_type in $types]', {types: types});
}

function getObjectsOfUserTypes() {
    const client = getSanityClient();
    return client.fetch('*[!(_id in path("_.**"))]');
}

function getResolvedObjectOfUserTypes() {
    return getObjectsOfUserTypes().then(data => {
        data = resolveReferences(data);
        return _.reject(data, {_type: 'sanity.imageAsset'});
    });
}

function resolveReferences(data) {
    const objectsById = _.keyBy(data, '_id');
    const cache = {};

    function resolve(item, idStack = []) {
        const id = _.get(item, '_id');
        if (_.has(cache, id)) {
            return cache[id];
        }
        idStack = _.concat(idStack, id);
        const result = _.cloneDeepWith(item, (value) => {
            const refId = _.get(value, '_ref');
            if (refId && _.has(objectsById, refId) && !_.includes(idStack, refId)) {
                return resolve(_.get(objectsById, refId), idStack);
            }
        });
        cache[id] = result;
        return result;
    }

    return _.map(data, item => {
        return resolve(item);
    });
}
