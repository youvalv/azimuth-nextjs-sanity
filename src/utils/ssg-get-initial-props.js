const _ = require('lodash');

module.exports = async function getInitialProps(context) {
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
};
