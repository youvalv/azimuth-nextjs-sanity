import React from 'react';
import _ from 'lodash';
import moment from 'moment-strftime';

import { Layout } from '../components';
import { Link, markdownify, postUrl } from '../utils';


export default class Blog extends React.Component {
    render() {
        const posts = _.orderBy(_.get(this.props, 'posts', []), ['date'], ['desc']);
        return (
            <Layout {...this.props}>
                <div className="outer">
                    <div className="inner">
                        <div className="post-feed">
                            {_.map(posts, (post, postIdx) => (
                                <article key={postIdx} className="post post-card">
                                    <div className="post-card-inside">
                                        {_.has(post, 'thumb_image') && (
                                            <Link href={postUrl(post)} className="post-card-thumbnail">
                                                <img className="thumbnail" src={_.get(post, 'thumb_image.asset.url')} alt={_.get(post, 'title')} />
                                            </Link>
                                        )}
                                        <div className="post-card-content">
                                            <header className="post-header">
                                                <h2 className="post-title">
                                                    <Link href={postUrl(post)} rel="bookmark">{_.get(post, 'title')}</Link>
                                                </h2>
                                            </header>
                                            <div className="post-excerpt">
                                                {markdownify(_.get(post, 'excerpt'))}
                                            </div>
                                            <footer className="post-meta">
                                                <time className="published" dateTime={moment(_.get(post, 'date')).strftime('%Y-%m-%d %H:%M')}>
                                                    {moment(_.get(post, 'date')).strftime('%B %d, %Y')}
                                                </time>
                                            </footer>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }
}
