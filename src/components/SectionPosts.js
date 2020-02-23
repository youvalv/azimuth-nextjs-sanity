import React from 'react';
import _ from 'lodash';
import moment from 'moment-strftime';

import { Link, markdownify, postUrl } from '../utils';


export default (props) => {
    const section = _.get(props, 'section');
    const posts = _.take(_.orderBy(_.get(props, 'posts', []), ['date'], ['desc']), 3);
    return (
        <section id={_.get(section, 'section_id')} className={'block posts-block bg-' + _.get(section, 'background') + ' outer'}>
            <div className="block-header inner-small">
                {_.get(section, 'title') &&
                <h2 className="block-title">{_.get(section, 'title')}</h2>
                }
                {_.get(section, 'subtitle') &&
                <p className="block-subtitle">
                    {_.get(section, 'subtitle')}
                </p>
                }
            </div>
            <div className="inner">
                <div className="post-feed">
                    {_.map(posts, (post, postIdx) => (
                        <article key={postIdx} className="post post-card">
                            <div className="post-card-inside">
                                {_.get(post, 'thumb_image') &&
                                <Link href={postUrl(post)} className="post-card-thumbnail">
                                    <img className="thumbnail" src={_.get(post, 'thumb_image.asset.url')} alt={_.get(post, 'title')} />
                                </Link>
                                }
                                <div className="post-card-content">
                                    <header className="post-header">
                                        <h3 className="post-title"><Link href={postUrl(post)} rel="bookmark">{_.get(post, 'title')}</Link></h3>
                                    </header>
                                    <div className="post-excerpt">
                                        {markdownify(_.get(post, 'excerpt'))}
                                    </div>
                                    <footer className="post-meta">
                                        <time className="published"
                                              dateTime={moment(_.get(post, 'date')).strftime('%Y-%m-%d %H:%M')}>{moment(_.get(post, 'date')).strftime('%B %d, %Y')}</time>
                                    </footer>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};
