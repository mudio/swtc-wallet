/**
 * @file Wallet.js
 * @author 木休大人(523317421@qq.com)
 */

/* eslint compat/compat:off */

import Account from './Account';

export default class Wallet {
    constructor() {
        const {type, token, result} = Account.fromStroage();

        this.type = type;
        this.token = token;
        this.address = result.publickey;
    }

    static getBalances() {
        const {address} = new Wallet();

        return fetch(`https://api.jingtum.com/v2/accounts/${address}/balances`)
            .then(res => res.json())
            .then(x => x.balances);
    }
}
