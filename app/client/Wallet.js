/**
 * @file Wallet.js
 * @author 木休大人(523317421@qq.com)
 */

/* eslint compat/compat:off */

import Account from './Account';

export default class Wallet {
    constructor() {
        const {type, credentials} = Account.fromStroage();

        this.type = type;

        this.address = credentials.address;
    }

    static getBalances() {
        const {address} = new Wallet();

        return fetch(`https://api.jingtum.com/v2/accounts/${address}/balances`)
            .then(res => res.json())
            .then(x => x.balances);
    }

    static getOrderList() {
        const {address} = new Wallet();

        return fetch(`https://api.jingtum.com/v2/accounts/${address}/orders`)
            .then(res => res.json())
            .then(x => x.orders);
    }

    static getTransactions() {
        const {address} = new Wallet();

        return fetch(`https://api.jingtum.com/v2/accounts/${address}/transactions`)
            .then(res => res.json())
            .then(x => x.transactions);
    }
}
