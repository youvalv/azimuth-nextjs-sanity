const util = require('util');
const _ = require('lodash');

module.exports = {
    reduceDataForInitPropsExport,
    reducePageTypes,
    reducePropsMap
};

function reduceDataForInitPropsExport(data, { pageTypes, propsMap }) {
    return {
        props: reducePropsMap(propsMap, data),
        pages: reducePageTypes(pageTypes, data)
    };
}

function reducePageTypes(pageTypes, data) {
    return _.reduce(pageTypes, (accum, pageTypeDef) => {
        const pages = _.filter(data, pageTypeDef.predicate);
        const pageFilePath = pageTypeDef.page || '/';
        const pathTemplate = pageTypeDef.path || '/{slug}';
        return _.reduce(pages, (accum, page) => {
            let path;
            try {
                path = interpolatePagePath(pathTemplate, page);
            } catch (e) {
                return accum;
            }
            return _.concat(accum, {
                pageFilePath: pageFilePath,
                path: path,
                data: page,
                props: reducePropsMap(pageTypeDef.propsMap, data)
            });
        }, accum)
    }, []);
}

function reducePropsMap(propsMap, data) {
    return _.reduce(propsMap, (accum, propDef, propName) => {
        if (_.get(propDef, 'single')) {
            return _.assign({}, accum,  {[propName]: _.find(data, propDef.predicate)});
        } else {
            return _.assign({}, accum,  {[propName]: _.filter(data, propDef.predicate)});
        }
    }, {});
}

function interpolatePagePath(pathTemplate, page) {
    let path = pathTemplate.replace(/{([\s\S]+?)}/g, (match, p1) => {
        const fieldValue = _.get(page, p1);
        if (!fieldValue) {
            throw new Error(`page has no value in field '${p1}', page: ${util.inspect(page, {depth: 0})}`);
        }
        return _.trim(fieldValue, '/');
    });

    if (!_.startsWith(path, '/')) {
        path = '/' + path;
    }

    return path;
}
