// @flow
import {interval} from 'rxjs';
import {Timeline} from 'antd';
import React, {Component} from 'react';
import {date, numberFormat} from 'humanize';
import {flatMap, startWith} from 'rxjs/operators';

import {Wallet} from '../../client';
import styles from './Transaction.css';
import Link from '../common/BrowserLink';

export default class Transaction extends Component {
    constructor() {
        super();

        this.state = {transactions: []};
    }

    componentDidMount() {
        this._ticker = interval(3000)
            .pipe(
                startWith(Wallet.getTransactions()),
                flatMap(() => Wallet.getTransactions())
            )
            .subscribe(
                transactions => this.setState({transactions})
            );
    }

    componentWillUnmount() {
        this._ticker.unsubscribe();
    }

    _renderItems(item) {
        const {transactions} = this.state;

        return transactions.map(item => {
            const {type, amount, price, offertype, counterparty} = item;
            let color = 'blue';
            let label = '';

            if (type === 'offernew') {
                if (offertype === 'sell') {
                    color = 'green';
                    label = `
                        买单创建:
                        单价：${price} CNY,
                        数量：${amount} SWT,
                        总额：${numberFormat(price * amount)} CNY
                    `;
                } else if (offertype === 'buy') {
                    color = 'red';
                    label = `
                        卖单创建:
                        单价：${price} CNY,
                        数量：${amount} SWT,
                        总额：${numberFormat(price * amount)} CNY
                    `;
                }
            } else if (type === 'sent') {
                label = `转账到 ${counterparty}，${amount.value} ${amount.currency}`;
            } else {
                label = 'offereffect';
            }

            return (
                <Timeline.Item key={item.hash} color={color}>
                    <Link className={styles.link} linkTo={`http://state.jingtum.com/#!/tx/${item.hash}`}>
                        {date('Y-m-d', item.date)} - {label}
                    </Link>
                </Timeline.Item>
            );
        });
    }

    render() {
        return (
            <Timeline className={styles.container}>
                {this._renderItems()}
            </Timeline>
        );
    }
}
