/**
 * @file Account.js
 * @author 木休大人(523317421@qq.com)
 */

/* eslint compat/compat:off */

export default class Account {
    constructor() {
        const {type, token, result} = JSON.parse(localStorage.getItem('__AUTH'));

        this.type = type;

        this.token = token;

        this.address = result.publickey;

        this.authInfo = result;
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
}
