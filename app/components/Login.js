/**
 * Component - Login Component
 *
 * @file Login.js
 * @author mudio(job.mudio@gmail.com)
 */

/* eslint react/no-string-refs: 0, max-len: 0 */

import {Spin} from 'antd';
import {ipcRenderer} from 'electron';
import React, {Component} from 'react';

import styles from './Login.css';
import Button from './common/Button';
import SystemBar from './common/SystemBar';
import {Account} from '../client';
import BrowserLink from './common/BrowserLink';

const akskHelpLink = 'https://app.jingtumlab.com/#/user/register';

export default class Login extends Component {
    static propTypes = {
    };

    constructor(...args) {
        super(...args);
        this.state = {ak: '', sk: '', loading: false, msg: '请输入登录信息！'};
    }

    componentWillMount() {
        Account.dispose();
    }

    /**
     * 效验AK/SK
     *
     * @memberof Login
     */
    submit = async evt => {
        evt.preventDefault();

        const {ak, sk} = this.state;
        if (!ak || !sk) {
            this.setState({msg: '请输入登录信息！'});
            return;
        }

        try {
            this.setState({loading: true});
            const auth = await Account.validate(ak, sk);

            Account.save(auth);

            ipcRenderer.send('notify', 'login_success');
        } catch (ex) {
            this.setState({msg: ex.message, loading: false});
        }
    }

    handleInputChange = evt => {
        const {name, value} = evt.target;
        this.setState({[name]: value.trim()});
    }

    /**
     * 登陆分为几个状态：`验证AK/SK`、`设置安全码`、`验证安全码`
     *
     * @returns
     * @memberof Login
     */
    render() {
        const {loading, msg, ak, sk} = this.state;

        function loadingOrLogin() {
            if (loading) {
                return (<Spin className={styles.loading} />);
            }

            return (<Button className={styles.loginBtn} data-tip="登录" />);
        }

        return (
            <div className={styles.container}>
                <SystemBar className={styles.title} />
                <svg className={styles.logo} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 860 860">
                    <g>
                        <path fill="#0172c1" d="M125.94,125.94C-42,293.87-42,566.13,125.94,734.06s440.19,167.93,608.11,0,167.93-440.19,0-608.11S293.87-42,125.94,125.94Zm188.8,259.51L476,224.17c15.21-15.21,14.77-40.26-.43-55.46L430,123.12,384.1,169c-15.21,15.21-15.64,39.64-.43,54.85l23,23L377,276.56l-23-23c-31.58-31.58-31.15-82.66.43-114.24L430,63.72,505.29,139c31.58,31.58,32,83.28.43,114.86L344.44,415.15Zm-252.44,46,76-76a80.22,80.22,0,0,1,113.83,0L413.74,517,384,546.67,222.45,385.08a38.17,38.17,0,0,0-54.43,0L121.7,431.41,167.29,477c15.21,15.21,40.67,15.22,55.88,0l22.27-22.27,29.7,29.7-22.27,22.27c-31.58,31.58-83.69,31.56-115.28,0Zm482.25,45.25L383.68,637.54c-15.21,15.21-15.91,39.95-.71,55.15L429.29,739l46.32-46.32c15.21-15.21,14.5-39.95-.71-55.15l-22.27-22.27,29.7-29.7,22.27,22.27c31.58,31.58,32.29,83,.71,114.55l-76,76-76-76c-31.58-31.58-30.87-83,.71-114.55L514.85,447ZM797,429.29l-75.6,75.6c-31.58,31.58-83.39,31.29-115-.29L445.56,343.73l29.7-29.7L636.12,474.9c15.21,15.21,40.36,15.5,55.57.29l45.9-45.9L691.28,383a38.54,38.54,0,0,0-54.74.29L613.85,406l-29.7-29.7,22.69-22.69A80.59,80.59,0,0,1,721,353.28Z" />
                    </g>
                </svg>
                <div className={styles.tip}>
                    <span className={styles.text}>{msg}</span>
                </div>
                <form className={styles.loginform} onSubmit={this.submit}>
                    <input type="text" name="ak" value={ak} onChange={this.handleInputChange} placeholder="手机号/钱包地址" />
                    <input type="password" name="sk" value={sk} onChange={this.handleInputChange} placeholder="密码/钱包私钥" />
                    {loadingOrLogin()}
                    <BrowserLink className={styles.helplink} linkTo={akskHelpLink}>
                        注册用户
                    </BrowserLink >
                </form>
            </div>
        );
    }
}
