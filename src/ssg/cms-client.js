import _ from 'lodash';

const { getObjectsOfUserTypes } = require('./sanity-utils');
const { reduceAndTransformData } = require('./ssg-utils');


class CMSClient {

    constructor() {
        console.log('Client constructor');
        this.data = null;
    }

    async getData() {
        if (this.data) {
            console.log('Client getData, has cached data, return it');
            return this.data;
        }
        console.log('Client getData, has no cached data, fetch data from CMS');
        this.data = await this.fetchDataFromCMS();
        return this.data;
    }

    async getStaticPaths() {
        console.log('Client getStaticPaths');
        const data = await this.getData();
        return this.getPathsFromCMSData(data);
    }

    async getStaticPropsForPageAtPath(pagePath) {
        console.log('Client getStaticPropsForPath');
        const data = await this.getData();
        return this.getPropsFromCMSDataForPagePath(data, pagePath);
    }

    async fetchDataFromCMS() {
        const data = await getObjectsOfUserTypes({
            resolveReferences: true,
            overlayDrafts: true,
            removeAssets: true
        });

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

        return reduceAndTransformData(data, dataReduceOptions);
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

module.exports = new CMSClient();
