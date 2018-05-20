/**
 * Component - common sidebar
 *
 * @file Sidebar.js
 * @author mudio(job.mudio@gmail.com)
 */

import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';

import styles from './Sidebar.css';
import {Account} from '../../client';

export default class BrowserLink extends Component {
    static propTypes = {
    }

    renderApiPage({avatar, email, phone, publickey, realname, username}) {
        return (
            <div className={styles.container}>
                <div className={styles.avatar} >
                    <img alt="1" src={avatar} />
                    <p className={styles.username}>
                        {username}
                        <i className="fa fa-sign-out" aria-hidden="true" data-tip="登出" />
                    </p>
                </div>
                <div className={styles.menu}>
                    <NavLink to="/home" className={styles.item} activeClassName={styles.active}>
                        <i className="fa fa-address-book-o" aria-hidden="true" />
                        总览
                    </NavLink>
                    <NavLink to="/trade" className={styles.item} activeClassName={styles.active}>
                        <i className="fa fa-btc" aria-hidden="true" />
                        交易
                    </NavLink>
                    <NavLink to="/pay" className={styles.item} activeClassName={styles.active}>
                        <i className="fa fa-credit-card" aria-hidden="true" />
                        转账
                    </NavLink>
                    <NavLink to="/contacts" className={styles.item} activeClassName={styles.active}>
                        <i className="fa fa-vcard" aria-hidden="true" />
                        联系人
                    </NavLink>
                    <NavLink to="/security" className={styles.item} activeClassName={styles.active}>
                        <i className="fa fa-cogs" aria-hidden="true" />
                        安全设置
                    </NavLink>
                </div>
            </div>
        );
    }

    renderSDKPage() {
        return null;
    }

    render() {
        const {type, result} = Account.fromStroage();

        if (type === 'PROXY_API') {
            return this.renderApiPage(result);
        }

        return this.renderSDKPage(result);
    }
}
