import React from 'react';
import _ from 'lodash';
import moment from 'moment-strftime';

import { Layout } from '../components';
import { markdownify } from '../utils';


export default class Post extends React.Component {
    render() {
        const page = _.get(this.props, 'page');
        return (
            <Layout {...this.props}>
                <div className="outer">
                    <div className="inner-medium">
                        <article className="post post-full">
                            <header className="post-header">
                                <h1 className="post-title">{_.get(page, 'title')}</h1>
                            </header>
                            {_.has(page, 'image') && (
                                <div className="post-thumbnail">
                                    <img src={_.get(page, 'image')} alt={_.get(page, 'title')} />
                                </div>
                            )}
                            {_.has(page, 'subtitle') && (
                                <div className="post-subtitle">
                                    {_.get(page, 'subtitle')}
                                </div>
                            )}
                            {_.has(page, 'author') && (
                                <div className="post-meta">
                                    By {_.get(page, 'author.first_name') + ' ' + _.get(page, 'author.last_name', '')}
                                </div>
                            )}
                            {_.has(page, 'content') && (
                                <div className="post-content">
                                    {markdownify(_.get(page, 'content'))}
                                </div>
                            )}
                            <footer className="post-meta">
                                <time className="published" dateTime={moment(_.get(page, 'date')).strftime('%Y-%m-%d %H:%M')}>
                                    {moment(_.get(page, 'date')).strftime('%A, %B %e, %Y')}
                                </time>
                                {_.has(page, 'categories') && !_.isEmpty(_.get(page, 'categories')) && (
                                    <div>Categories: {_.get(page, 'categories').map(category => category.title).join(', ')}</div>
                                )}
                            </footer>
                        </article>
                    </div>
                </div>
            </Layout>
        );
    }
}
