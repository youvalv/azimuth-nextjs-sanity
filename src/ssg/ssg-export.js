const path = require('path');
const fse = require('fs-extra');
const WebSocket = require('ws');
const { EventEmitter } = require('events');
const _ = require('lodash');


const wss = new WebSocket.Server({ port: 8088 });
const eventEmitter = new EventEmitter();
const PROPS_CHANGED_EVENT = 'propsChanged';

wss.on('connection', (ws) => {
    console.log('[ssg-export] initial-props websocket connected');
    ws.on('message', (message) => {
        console.log('[ssg-export] initial-props websocket received message:', message);
    });
    ws.on('close', () => {
        console.log('[ssg-export] initial-props websocket disconnected');
    });
    eventEmitter.on(PROPS_CHANGED_EVENT, () => {
        console.log(`[ssg-export] initial-props websocket send '${PROPS_CHANGED_EVENT}'`);
        ws.send(PROPS_CHANGED_EVENT);
    });
});

module.exports = {
    exportPages,
    writeInitProps,
    generatePathMap,
    withInitPropsExport
};


async function exportPages({ data, defaultPathMap, dev, dir, outDir, distDir, buildId }) {
    const initPropsDir = await getInitialPropsDir(dir, outDir);
    console.log(`[ssg-export] exporting path maps:\n\tdev: ${dev}\n\tdir: ${dir}\n\toutDir: ${outDir}\n\tdistDir: ${distDir}\n\tbuildId: ${buildId}\n\tinitPropsDir: ${initPropsDir}`);

    return _.reduce(data.pages, (promise, page) => {
        return promise.then(async (pathMap) => {
            console.log(`[ssg-export] exporting page with url path '${page.path}' and page component at '${page.pageFilePath}'`);

            const jsonFilePath = path.join(initPropsDir, _.trim(page.path, '/'), 'init-props.json');

            pathMap[page.path] = {
                page: page.pageFilePath,
                query: _.assign({isServer: true, initPropsFilePath: jsonFilePath})
            };

            const initialProps = _.assign(
                {
                    path: page.path,
                    page: page.data
                },
                data.props,
                page.props
            );
            await fse.outputFile(jsonFilePath, JSON.stringify(initialProps));

            return pathMap;
        });
    }, Promise.resolve({})).then(pathMap => {
        eventEmitter.emit(PROPS_CHANGED_EVENT);
        return pathMap;
    });
}

async function writeInitProps({ data, initPropsDir, dev }) {
    console.log(`[ssg-export] writing init-props.json for ${_.size(data.pages)} pages...`);
    return _.reduce(data.pages, (promise, page) => {
        return promise.then(async () => {
            console.log(`[ssg-export] writing init-props.json at path '${page.path}'`);
            const jsonFilePath = path.join(initPropsDir, _.trim(page.path, '/'), 'init-props.json');
            const initialProps = _.assign(
                {
                    path: page.path,
                    page: page.data
                },
                dev ? { dev } : null,
                data.props,
                page.props
            );
            await fse.outputFile(jsonFilePath, JSON.stringify(initialProps));
        });
    }, Promise.resolve());
}

function generatePathMap({ data, initPropsDir }) {
    console.log('[ssg-export] generating path maps...');
    return _.reduce(data.pages, (pathMap, page) => {
        console.log(`[ssg-export] exporting page with url path '${page.path}' and page component at '${page.pageFilePath}'`);

        const jsonFilePath = path.join(initPropsDir, _.trim(page.path, '/'), 'init-props.json');

        pathMap[page.path] = {
            page: page.pageFilePath,
            query: _.assign({isServer: true, initPropsFilePath: jsonFilePath})
        };

        return pathMap;
    }, {});
}

async function getInitialPropsDir(dir, outDir) {
    // remove previously created init-props from public dir
    const publicInitPropsDir = path.join(dir, 'public', 'init-props');
    await fse.remove(publicInitPropsDir);

    let initPropsDir;
    if (outDir) {
        // when exporting, initial props are written to output dir
        initPropsDir = path.join(outDir, 'init-props');
    } else {
        // when developing, initial props are written to public dir
        initPropsDir = publicInitPropsDir;
    }
    return initPropsDir;
}

function withInitPropsExport(nextConfig) {
    if (_.isFunction(nextConfig.exportPathMap)) {
        throw new Error('withInitPropsExport error: exportPathMap already defined, don\'t provide exportPathMap when using withInitPropsExport');
    }

    if (!_.isFunction(nextConfig.exportInitProps)) {
        throw new Error('withInitPropsExport error: exportInitProps function must be provided when using withInitPropsExport');
    }

    const origWebpack = nextConfig.webpack;
    nextConfig.webpack = (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        if (!isServer) {
            config.plugins.push(new webpack.IgnorePlugin(/fs-extra/))
        }
        return _.isFunction(origWebpack) ? origWebpack(config) : config;
    };

    nextConfig.exportPathMap = async function(defaultPathMap, options) {
        const initPropsDir = await getInitialPropsDir(options.dir, options.outDir);
        console.log(`[ssg-export] exporting path maps:\n\tdev: ${options.dev}\n\tdir: ${options.dir}\n\toutDir: ${options.outDir}\n\tdistDir: ${options.distDir}\n\tbuildId: ${options.buildId}\n\tinitPropsDir: ${initPropsDir}`);

        async function updateInitProps(data) {
            console.log(`[ssg-export] got request to update init-props`);
            await writeInitProps({ data, initPropsDir, dev: options.dev });
            eventEmitter.emit(PROPS_CHANGED_EVENT);
        }

        const data = await nextConfig.exportInitProps({ updateInitProps, defaultPathMap, ...options });
        await writeInitProps({ data, initPropsDir, dev: options.dev });
        return generatePathMap({ data, initPropsDir });
    };

    return nextConfig;
}
