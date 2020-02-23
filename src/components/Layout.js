import React from 'react';
import Head from 'next/head';
import _ from 'lodash';

import '../sass/main.scss';
import Header from './Header';
import Footer from './Footer';


export default class Body extends React.Component {
    render() {
        const page = _.get(this.props, 'page');
        const title = (_.has(page, 'title') ? _.get(page, 'title') + ' - ' : '') + _.get(this.props, 'config.title');
        return (
            <React.Fragment>
                <Head>
                    <title>{title}</title>
                    <meta charSet="utf-8"/>
                    <meta name="viewport" content="width=device-width, initialScale=1.0" />
                    <meta name="google" content="notranslate" />
                    <link href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,400i,700,700i" rel="stylesheet"/>
                </Head>
                <div id="page" className={'site palette-' + _.get(this.props, 'config.palette')}>
                    <Header {...this.props} />
                    <main id="content" className="site-content">
                        {this.props.children}
                    </main>
                    <Footer {...this.props} />
                </div>
            </React.Fragment>
        );
    }
}
