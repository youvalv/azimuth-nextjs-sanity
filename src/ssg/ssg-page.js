const React = require('react');
const _ = require('lodash');
const { withRouter } = require('next/router');

let initPropsDir = null;

module.exports = function withSSGPage(WrappedComponent, { wsPort = '8088' } = {}) {

    class Component extends React.Component {

        componentDidMount() {
            // console.log('withSSGPage componentDidMount', this.props);
            if (!this.props.dev) {
                return;
            }
            this.ws = new WebSocket('ws://localhost:' + wsPort);
            this.ws.addEventListener('open', (event) => {
                // console.log('initial-props websocket opened');
            });
            this.ws.addEventListener('message', (event) => {
                // console.log('initial-props websocket received message:', event);
                if (event.data === 'propsChanged') {
                    this.props.router.replace(this.props.router.pathname, this.props.router.asPath);
                }
            });
            this.ws.addEventListener('close', (event) => {
                // console.log('initial-props websocket closed', event);
            });
            this.ws.addEventListener('error', (event) => {
                // console.log('initial-props websocket received an error', event);
            });
        }

        componentWillUnmount() {
            // console.log('withSSGPage componentWillUnmount');
            if (!this.props.dev) {
                return;
            }
            if (this.ws) {
                this.ws.close();
            }
        }

        render() {
            // console.log('withSSGPage render', this.props);
            return <WrappedComponent {...this.props} />;
        }
    }

    Component.getInitialProps = async function getInitialProps(context) {
        const { pathname, asPath, query, req } = context;
        // console.log(`getInitialProps, pathname: '${pathname}', asPath: '${asPath}', query:`, query);

        let urlPath = asPath;
        // remove query
        const queryIndex = urlPath.indexOf('?');
        if (queryIndex >= 0) {
            urlPath = urlPath.substring(0, queryIndex);
        }
        // remove hash
        const hashIndex = urlPath.indexOf('#');
        if (hashIndex >= 0) {
            urlPath = urlPath.substring(0, hashIndex);
        }
        urlPath = _.trimEnd(urlPath, '/') + '/init-props.json';
        // console.log(`getInitialProps, urlPath: '${urlPath}'`);

        if (req) {
            // We are on server, read initialProps from file /.../nextjs-project/public/init-props/...asPath.../init-props.json
            // Pages exported from next.config.js via 'exportPathMap' when dev server starts
            // have 'initPropsDir' property. These pages will be rendered by page component
            // specified in the exported path map (e.g.: '/' => 'pages/index.js').
            // Pages created after dev server has been started will not have 'initPropsDir' property as they
            // weren't exported via 'exportPathMap'. These pages will be rendered by a page component
            // matched by Dynamic Routes (e.g.: 'pages/[...slug].js').
            // Therefore, first time this function runs, 'initPropsDir' is stored globally, to allow dynamically
            // rendered pages access the 'initPropsDir'.
            // Of course, it requires that at least one exported page will be requested first.
            initPropsDir = initPropsDir || _.get(query, 'initPropsDir');
            const jsonFilePath = initPropsDir + urlPath;
            // This will not work for pages created after dev server has been started.
            // const jsonFilePath = _.get(query, 'initPropsFilePath');
            const fse = require('fs-extra');
            return fse.readJson(jsonFilePath);
        } else {
            // We are on client, request the data from /init-props/...asPath.../init-props.json
            return fetch('/init-props' + urlPath).then(response => {
                return response.json();
            }).then(props => {
                return props;
            });
        }
    };

    function getDisplayName(WrappedComponent) {
        return WrappedComponent.displayName || WrappedComponent.name || 'Component';
    }

    Component.displayName = `WithSSGPage(${getDisplayName(WrappedComponent)})`;

    return withRouter(Component);
};
