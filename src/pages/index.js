import React from 'react';
import _ from 'lodash';

import pageLayouts from '../layouts';
import getInitialProps from '../utils/ssg-get-initial-props';


class Page extends React.Component {
    render() {
        const PageLayout = pageLayouts[_.get(this.props, 'page._type')];
        return <PageLayout {...this.props}/>;
    }
}

Page.getInitialProps = getInitialProps;

export default Page;
