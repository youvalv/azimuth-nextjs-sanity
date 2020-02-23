import React from 'react';
import _ from 'lodash';

import { Link, safePrefix } from '../utils';
import Action from './Action';


export default class Header extends React.Component {
    render() {
        return (
            <header id="masthead" className="site-header outer">
                <div className="inner">
                    <div className="site-header-inside">
                        <div className="site-branding">
                            {_.get(this.props, 'config.header.logo_img') &&
                            <p className="site-logo">
                                <Link href={safePrefix('/')}>
                                    <img src={_.get(this.props, 'config.header.logo_img.asset.url')} alt="Logo" />
                                </Link>
                            </p>
                            }
                            {((_.get(this.props, 'page._type') === 'landing') || (_.get(this.props, 'page._type') === 'blog')) ?
                                <h1 className="site-title"><Link href={safePrefix('/')}>{_.get(this.props, 'config.header.title')}</Link></h1>
                                :
                                <p className="site-title"><Link href={safePrefix('/')}>{_.get(this.props, 'config.header.title')}</Link></p>
                            }
                        </div>
                        {(_.get(this.props, 'config.header.nav_links') && _.get(this.props, 'config.header.has_nav')) && (
                            <React.Fragment>
                                <nav id="main-navigation" className="site-navigation" aria-label="Main Navigation">
                                    <div className="site-nav-inside">
                                        <button id="menu-close" className="menu-toggle">
                                            <span className="screen-reader-text">Open Menu</span>
                                            <span className="icon-close" aria-hidden="true" />
                                        </button>
                                        <ul className="menu">
                                            {_.map(_.get(this.props, 'config.header.nav_links'), (action, actionIdx) => (
                                                <li key={actionIdx} className={'menu-item' + ((_.trim(_.get(this.props, 'path'), '/') === _.trim(_.get(action, 'url'), '/')) ? ' current-menu-item' : '') + (_.get(action, 'primary') ? ' menu-button' : '')}>
                                                    <Action action={action} className={(_.get(action, 'primary') ? 'button' : '')}/>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </nav>
                                <button id="menu-open" className="menu-toggle">
                                    <span className="screen-reader-text">Close Menu</span>
                                    <span className="icon-menu" aria-hidden="true" />
                                </button>
                            </React.Fragment>
                        )}
                    </div>
                </div>
            </header>
        );
    }
}
