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

export async function getStaticProps({ params }) {
    console.log('Page [index] getStaticProps, params: ', params);
    const props = await cmsClient.getStaticPropsForPageAtPath('/');
    return { props: props };
}

export default Page;
