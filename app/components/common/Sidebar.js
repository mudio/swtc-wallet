/**
 * Component - common sidebar
 *
 * @file Sidebar.js
 * @author mudio(job.mudio@gmail.com)
 */

import {ipcRenderer} from 'electron';
import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';

import styles from './Sidebar.css';
import {Account} from '../../client';

export default class Sidebar extends Component {
    constructor(...args) {
        super(...args);

        const {credentials, auth = {}} = Account.fromStroage();

        this.state = {auth, credentials};
    }

    _logout() {
        ipcRenderer.send('notify', 'logout');
    }

    renderAvatar = () => {
        const {credentials, auth} = this.state;
        const {avatar, username} = auth;
        const {address} = credentials;

        return (
            <div className={styles.avatar} >
                <img alt="" src={avatar || `http://www.gbtags.com/gb/qrcode?t=${credentials.adress}`} />
                <p className={styles.username}>
                    <span>{username || address}</span>
                    <i className="fa fa-sign-out" aria-hidden="true" data-tip="登出" onClick={this._logout} />
                </p>
            </div>
        );
    }

    render() {
        return (
            <div className={styles.container}>
                {this.renderAvatar()}
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
}
