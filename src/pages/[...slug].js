import React from 'react';
import _ from 'lodash';

import pageLayouts from '../layouts';
import removeDataClient from '../ssg/remote-data-client';
import { withRemoteDataUpdates } from '../ssg/with-remote-data-updates';


class Page extends React.Component {
    render() {
        // every page can have different layout, pick the layout based
        // on the model of the page (_type in Sanity CMS)
        const PageLayout = pageLayouts[_.get(this.props, 'page._type')];
        return <PageLayout {...this.props}/>;
    }
}

export async function getStaticPaths() {
    console.log('Page [...slug].js getStaticPaths');
    const paths = await removeDataClient.getStaticPaths();
    return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
    console.log('Page [...slug].js getStaticProps, params: ', params);
    const pagePath = '/' + params.slug.join('/');
    const props = await removeDataClient.getStaticPropsForPageAtPath(pagePath);
    return { props };
}

export default withRemoteDataUpdates(Page);
