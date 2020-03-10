const path = require('path');
const fse = require('fs-extra');
const _ = require('lodash');


const FILE_CACHE_PATH = path.join(process.cwd(), '.remoteDataCache', 'data.json');

class RemoteDataClient {

    constructor() {
        console.log('RemoteDataClient.constructor');
    }

    async getData() {
        console.log('RemoteDataClient.getData');
        // For now, we are reading the changes from filesystem until re-import
        // of this module will be fixed: https://github.com/zeit/next.js/issues/10933
        return fse.readJson(FILE_CACHE_PATH);
    }

    async getStaticPaths() {
        console.log('RemoteDataClient.getStaticPaths');
        const data = await this.getData();
        return this.getPathsFromCMSData(data);
    }

    async getStaticPropsForPageAtPath(pagePath) {
        console.log('RemoteDataClient.getStaticPropsForPath');
        const data = await this.getData();
        return this.getPropsFromCMSDataForPagePath(data, pagePath);
    }

    getPathsFromCMSData(data) {
        const pages = _.reject(data.pages, _.matchesProperty('path', '/'));
        return _.map(pages, (page) => page.path);
    }

    getPropsFromCMSDataForPagePath(data, pagePath) {
        const page = _.find(data.pages, {path: pagePath});
        return _.assign(
            {
                path: page.path,
                page: page.data
            },
            data.props,
            page.props
        );
    }
}

module.exports = new RemoteDataClient();
