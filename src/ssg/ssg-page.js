const React = require('react');
const _ = require('lodash');
const { withRouter } = require('next/router');

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
        const { pathname, asPath, query, err } = context;
        // console.log(`getInitialProps, pathname: ${pathname}, asPath: ${asPath}, query:`, query);

        const isServer = _.get(query, 'isServer');
        if (isServer) {
            // we are on server, read initialProps from file
            const jsonFilePath = _.get(query, 'initPropsFilePath');
            const fse = require('fs-extra');
            return fse.readJson(jsonFilePath);
        } else {
            // we are on client, request the data from /...asPath.../init-props.json
            let url = asPath;
            const queryIndex = url.indexOf('?');
            if (queryIndex >= 0) {
                url = url.substring(0, queryIndex);
            }
            const hashIndex = url.indexOf('#');
            if (hashIndex >= 0) {
                url = url.substring(0, hashIndex);
            }
            url = '/init-props' + _.trimEnd(url, '/') + '/init-props.json';
            // console.log('init props url', url);
            return fetch(url).then(response => {
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
