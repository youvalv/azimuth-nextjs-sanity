import React from 'react';
import _ from 'lodash';

import pageLayouts from '../layouts';
import cmsClient from '../ssg/cms-client';


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
    const paths = await cmsClient.getStaticPaths();
    return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
    console.log('Page [...slug].js getStaticProps, params: ', params);
    const pagePath = '/' + params.slug.join('/');
    const props = await cmsClient.getStaticPropsForPageAtPath(pagePath);
    // If not using JSON.parse(JSON.stringify(props)), next.js throws following error when running "next build"
    // Error occurred prerendering page "/blog/design-team-collaborates". Read more: https://err.sh/next.js/prerender-error:
    // Error: Error serializing `.posts[4]` returned from `getStaticProps` in "/[...slug]".
    // Reason: Circular references cannot be expressed in JSON.
    return { props: JSON.parse(JSON.stringify(props)) };
}

export default Page;
