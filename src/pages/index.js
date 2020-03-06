import React from 'react';
import _ from 'lodash';

import pageLayouts from '../layouts';
import withSSGPage from '../ssg/ssg-page';


class Page extends React.Component {
    render() {
        const PageLayout = pageLayouts[_.get(this.props, 'page._type')];
        return <PageLayout {...this.props}/>;
    }
}

export default withSSGPage(Page);
