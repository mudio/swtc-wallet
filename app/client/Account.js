/**
 * @file Account.js
 * @author 木休大人(523317421@qq.com)
 */

/* eslint compat/compat:off */

import request from 'request';
import {Wallet} from 'jingtum-lib';

export default class Account {
    constructor() {
        const {type, credentials, auth} = JSON.parse(localStorage.getItem('__AUTH'));

        this.type = type;

        this.credentials = credentials;

        this.auth = auth;
    }

    static fromStroage() {
        return new Account();
    }

    static dispose() {
        localStorage.removeItem('__AUTH');
    }

    static save(auth) {
        localStorage.setItem('__AUTH', JSON.stringify(auth));
    }

    static isValidAddress(address) {
        return Wallet.isValidAddress(address);
    }

    /**
     * 验证身份
     *
     * @static
     * @param {string} addrOrUsername
     * @param {string} secretOrPwd
     * @returns
     *
     * @memberOf Client
     */
    static validate(addrOrUsername, secretOrPwd) {
        if (Wallet.isValidAddress(addrOrUsername) && Wallet.isValidSecret(secretOrPwd)) {
            const {secret, address} = Wallet.fromSecret(secretOrPwd);

            if (address === addrOrUsername) {
                return Promise.resolve({type: 'SDK', credentials: {secret, address}});
            }

            return Promise.reject(new Error('密钥错误'));
        }


        const options = {
            url: 'https://app.jingtumlab.com/app/user/login',
            method: 'POST',
            json: {
                user_name: addrOrUsername,
                pwd: secretOrPwd
            }
        };

        return new Promise((resolve, reject) => {
            request(options, (error, response, body) => {
                const [token] = response.headers['set-cookie']
                    .filter(cookie => cookie.startsWith('sails.sid'))
                    .map(cookie => cookie.split(' ')[0]);

                if (!error && response.statusCode === 200) {
                    const {code, data, msg} = body;

                    if (code === '0') {
                        resolve({
                            type: 'PROXY_API',
                            auth: data,
                            credentials: {address: data.publickey, secret: token}
                        });
                    }

                    return reject(new Error(msg));
                }

                return reject(error);
            });
        });
    }
}
