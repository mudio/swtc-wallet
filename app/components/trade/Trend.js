// @flow

/* eslint no-mixed-operators:off */

import _ from 'lodash';
import {numberFormat} from 'humanize';
import React, {Component} from 'react';
import {message, Input, Timeline} from 'antd';

import styles from './Trend.css';
import {Transport, Account as AccountClient, Wallet} from '../../client';

export default class Trend extends Component {
    constructor() {
        super();

        this.state = {messages: []};
    }
    componentDidMount() {
        this._ticker = Transport.connect().subscribe(
            msg => this._appendMsg(msg)
        );
    }

    componentWillUnmount() {
        this._ticker.unsubscribe();
    }

    _handler(transaction) {
        const {TransactionType, Amount, TakerGets, TakerPays} = transaction;

        if (
            // 取消订单
            TransactionType === 'OfferCancel'
            // 转账非SWT、CNY
            || (_.isObject(Amount) && ['SWT', 'CNY'].indexOf(Amount.currency) === -1)
            // 购买非SWT、CNY
            || (_.isObject(TakerGets) && ['SWT', 'CNY'].indexOf(TakerGets.currency) === -1)
            // 出售非SWT、CNY
            || (_.isObject(TakerPays) && ['SWT', 'CNY'].indexOf(TakerPays.currency) === -1)

            // 转账额度阈值, SWT > 50w, CNY > 4w
            || (
                (Amount && _.isObject(Amount))
                    ? Amount.value < 4e4
                    : Amount < 1e6 * 50e4
            )
            // 购买额度阈值，SWT > 50w, CNY > 4w
            || (
                (TakerGets && _.isObject(TakerGets))
                    ? TakerGets.value < 4e4
                    : TakerGets < 1e6 * 50e4
            )
            // 出售额度阈值，SWT > 50w, CNY > 4w
            || (
                (TakerPays && _.isObject(TakerPays))
                    ? TakerPays.value < 4e4
                    : TakerPays < 1e6 * 50e4
            )
        ) {
            //return;
        }

        if (TransactionType === 'Payment') {
            return this._payment(transaction);
        }

        if (TransactionType === 'OfferCreate') {
            return this._offerorder(transaction);
        }

        if (TransactionType === 'Lookup') {
            return this._lookupMsg(transaction);
        }
    }

    _formatSWT(value) {
        if (value / 1e6 > 1e4) {
            return `${(value / 1e6 / 1e4).toFixed(2)}万SWT`;
        }

        return `${(value / 1e6).toFixed(2)}SWT`;
    }

    _lookup(addr) {
        const isValidAddress = AccountClient.isValidAddress(addr.trim());

        if (!isValidAddress) {
            return message.error(`无效地址：${addr}`);
        }

        return Promise.all([
            Wallet.getBalances(),
            Wallet.getOrderList()
        ]).then(
            ([balances, orders]) => this._handler({TransactionType: 'Lookup', balances, orders})
        );
    }

    _lookupMsg({balances, orders}) {
        const balanceContent = balances.map(item => `${numberFormat(item.value)}${item.currency}`);
        const orderContent = orders.map(item => (<p key={item.sequence}>{item.type}</p>));

        return (
            <Timeline.Item key={process.hrtime()[1]}>
                <p>资产：{balanceContent}</p>
                {orderContent}
            </Timeline.Item>
        );
    }

    _payment({hash, Amount, Account, Destination}) {
        const payment = _.isString(Amount)
            ? this._formatSWT(Amount)
            : `${Amount.value}${Amount.currency}`;

        return (
            <Timeline.Item key={hash}>
                <p>转账额：{payment}</p>
                <p>
                    发起方: <a onClick={() => this._lookup(Account)}>{Account}</a>
                </p>
                <p>
                    支付给: <a onClick={() => this._lookup(Destination)}>{Destination}</a>
                </p>
            </Timeline.Item>
        );
    }

    _offerorder({hash, Account, TakerGets, TakerPays}) {
        if (_.isString(TakerGets)) {
            return (
                <Timeline.Item key={hash}>
                    <p>卖单：{this._formatSWT(TakerGets)} == {TakerPays.value}{TakerPays.currency}</p>
                    <p>单价：{(1e6 * TakerPays.value / TakerGets).toFixed(5)}</p>
                    <p>
                        发起方: <a onClick={() => this._lookup(Account)}>{Account}</a>
                    </p>
                </Timeline.Item>
            );
        }

        return (
            <Timeline.Item key={hash}>
                <p>买单：{this._formatSWT(TakerPays)} === {TakerGets.value}{TakerGets.currency}</p>
                <p>单价：{(1e6 * TakerGets.value / TakerPays).toFixed(5)}</p>
                <p>
                    发起方: <a onClick={() => this._lookup(Account)}>{Account}</a>
                </p>
            </Timeline.Item>
        );
    }

    _appendMsg(msg) {
        const item = this._handler(msg);

        if (item) {
            this.setState({messages: [...this.state.messages, item]});
        }
    }

    render() {
        const {messages} = this.state;

        return (
            <div className={styles.container}>
                <Timeline className={styles.timeline}>
                    {messages.map(item => item)}
                </Timeline>
                <Input.Search
                    size="small"
                    enterButton="查询"
                    placeholder="请输入查询地址"
                    onSearch={this._lookup}
                />
            </div>
        );
    }
}
