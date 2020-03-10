const util = require('util');
const path = require('path');
const fse = require('fs-extra');
const WebSocket = require('ws');
const { EventEmitter } = require('events');
const _ = require('lodash');


module.exports = {
    reduceAndTransformData,
    reducePageTypes,
    reducePropsMap,
    withRemoteDataUpdates
};

function reduceAndTransformData(data, { pageTypes, propsMap }) {
    return {
        props: reducePropsMap(propsMap, data),
        pages: reducePageTypes(pageTypes, data)
    };
}

function reducePageTypes(pageTypes, data) {
    return _.reduce(pageTypes, (accum, pageTypeDef) => {
        const pages = _.filter(data, pageTypeDef.predicate);
        const pathTemplate = pageTypeDef.path || '/{slug}';
        return _.reduce(pages, (accum, page) => {
            let path;
            try {
                path = interpolatePagePath(pathTemplate, page);
            } catch (e) {
                return accum;
            }
            return _.concat(accum, {
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

const eventEmitter = new EventEmitter();
const PROPS_CHANGED_EVENT = 'propsChanged';

function startStaticPropsWatcher({ wsPort }) {
    const wss = new WebSocket.Server({ port: wsPort });

    wss.on('connection', (ws) => {
        console.log('[data-listener] websocket connected');
        ws.on('message', (message) => {
            console.log('[data-listener] websocket received message:', message);
        });
        ws.on('close', () => {
            console.log('[data-listener] websocket disconnected');
        });
        eventEmitter.on(PROPS_CHANGED_EVENT, () => {
            console.log(`[data-listener] websocket send '${PROPS_CHANGED_EVENT}'`);
            ws.send(PROPS_CHANGED_EVENT);
        });
    });
}

function withRemoteDataUpdates(nextConfig) {
    if (!_.isFunction(nextConfig.fetchRemoteData)) {
        throw new Error('withStaticPropsUpdates error: fetchInitialData function must be provided when using withStaticPropsUpdates');
    }

    const cacheFilePath = _.get(nextConfig, 'cacheFilePath', path.join(process.cwd(), '.remoteDataCache', 'data.json'));
    const wsPort = _.get(nextConfig, 'liveUpdateWsPort', 8088);
    const liveUpdate = _.get(nextConfig, 'liveUpdateOnRemoteDataChange', false);

    if (liveUpdate) {
        startStaticPropsWatcher({ wsPort: wsPort });
    }

    async function updateRemoteData(data) {
        console.log(`[ssg-utils] update static props`);
        if (liveUpdate) {
            _.set(data, 'props.liveUpdateOnRemoteDataChange', true);
            _.set(data, 'props.liveUpdateWsPort', wsPort);
        }
        await fse.ensureFile(cacheFilePath);
        await fse.writeJson(cacheFilePath, data);
        eventEmitter.emit(PROPS_CHANGED_EVENT);
    }

    nextConfig.fetchRemoteData({ updateRemoteData }).then(async (data) => {
        // first time the data is fetched, clean the .cache folder
        await fse.remove(path.dirname(cacheFilePath));
        await updateRemoteData(data);
    });

    return nextConfig;
}
