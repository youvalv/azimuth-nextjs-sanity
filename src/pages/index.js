import React from 'react';
import _ from 'lodash';

import layouts from '../layouts';

export default class Page extends React.Component {

    static async getInitialProps(context) {
        const { pathname, asPath, query, err } = context;
        // console.log(`getInitialProps, pathname: ${pathname}, asPath: ${asPath}, query: ${query}`);

        const server = _.get(query, 'server');
        if (server) {
            // we are on server, return query data as is
            return query;
        } else {
            // we are on client, request the data from init-props.json
            let url = asPath;
            const queryIndex = url.indexOf('?');
            if (queryIndex >= 0) {
                url = _.trimEnd(url.substring(0, queryIndex), '/') + '/init-props.json' + url.substring(queryIndex);
            } else {
                url = _.trimEnd(url, '/') + '/init-props.json';
            }
            url = '/init-props' + url;
            // console.log('init props url', url);
            return fetch(url).then(response => {
                return response.json();
            }).then(response => {
                return response;
            });
        }
    }

    render() {
        const config = _.get(this.props, 'siteConfig');
        const page = _.get(this.props, 'page');
        const posts = _.get(this.props, 'posts');
        const path = _.get(this.props, 'path');
        const PageLayout = layouts[page._type];
        return (
            <PageLayout page={page} posts={posts} config={config} path={path}/>
        );
    }
}
