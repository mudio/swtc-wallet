// @flow
import {interval} from 'rxjs';
import {numberFormat} from 'humanize';
import React, {Component} from 'react';
import {flatMap, startWith} from 'rxjs/operators';

import styles from './Tntrus.css';
import commonStyles from './Common.css';
import {TradeClient} from '../../client';

export default class Tntrus extends Component {
    constructor() {
        super();

        this.state = {asks: [], bids: []};
    }

    componentDidMount() {
        this._tntrus = interval(3000)
            .pipe(
                startWith(TradeClient.getTntrusData()),
                flatMap(() => TradeClient.getTntrusData())
            )
            .subscribe(
                ({asks, bids}) => this.setState({asks, bids})
            );
    }

    componentWillUnmount() {
        this._tntrus.unsubscribe();
    }

    render() {
        const {asks, bids} = this.state;

        return (
            <div className={styles.container}>
                <div className={commonStyles.buy}>
                    <table>
                        <thead>
                            <tr>
                                <td>买/卖</td>
                                <td>价格</td>
                                <td>数量</td>
                            </tr>
                        </thead>
                        <tbody>
                            {bids.map(item => (
                                <tr key={item.price}>
                                    <td>买</td>
                                    <td>{numberFormat(item.price, 5)}</td>
                                    <td>{numberFormat(item.amount, 0)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className={commonStyles.sell}>
                    <table>
                        <thead>
                            <tr>
                                <td>买/卖</td>
                                <td>价格</td>
                                <td>数量</td>
                            </tr>
                        </thead>
                        <tbody>
                            {asks.map(item => (
                                <tr key={item.price}>
                                    <td>卖</td>
                                    <td>{numberFormat(item.price, 5)}</td>
                                    <td>{numberFormat(item.amount, 0)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}
