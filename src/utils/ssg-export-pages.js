const path = require('path');
const fse = require('fs-extra');
const _ = require('lodash');

module.exports = async function exportPages({ data, defaultPathMap, dev, dir, outDir, distDir, buildId }) {
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

    return _.reduce(data.pages, (promise, page) => {
        return promise.then(async (pathMap) => {
            console.log(`[exportPathMap] exporting page path '${page.path}' for '${page.pageFilePath}'`);

            const query = _.assign({
                path: page.path,
                page: page.data
            }, data.props, page.props);

            pathMap[page.path] = {
                page: page.pageFilePath,
                query: _.assign({server: true}, query)
            };

            const jsonFilePath = path.join(initPropsDir, _.trim(page.path, '/'), 'init-props.json');
            const clientInitProps = _.assign({server: false}, query);
            await fse.outputFile(jsonFilePath, JSON.stringify(clientInitProps));

            return pathMap;
        });
    }, Promise.resolve({}));
};
