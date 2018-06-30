// @flow
import {interval} from 'rxjs';
import classnames from 'classnames';
import {numberFormat} from 'humanize';
import React, {Component} from 'react';
import {flatMap, startWith} from 'rxjs/operators';

import styles from './Entrust.css';
import {Wallet} from '../../client';
import commonStyles from './Common.css';

export default class Entrust extends Component {
    constructor() {
        super();

        this.state = {orders: []};
    }

    componentDidMount() {
        this._tntrus = interval(3000)
            .pipe(
                startWith(Wallet.getOrderList()),
                flatMap(() => Wallet.getOrderList())
            )
            .subscribe(
                orders => this.setState({orders})
            );
    }

    componentWillUnmount() {
        this._tntrus.unsubscribe();
    }

    render() {
        const {orders} = this.state;
        const computedStyle = item => classnames({
            [commonStyles.buy]: item.type === 'buy',
            [commonStyles.sell]: item.type !== 'buy'
        });

        return (
            <div className={styles.container}>
                <table>
                    <thead>
                        <tr>
                            <td>买/卖</td>
                            <td>价格</td>
                            <td>数量</td>
                            <td>操作</td>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(item => (
                            <tr key={item.price}>
                                <td className={computedStyle(item)}>
                                    {item.type === 'buy' ? '买' : '卖'}
                                </td>
                                <td>{numberFormat(item.price, 5)} CNT</td>
                                <td>{numberFormat(item.amount, 0)} SWT</td>
                                <td><a>取消</a></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}
