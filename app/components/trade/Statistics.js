// @flow
import {interval} from 'rxjs';
import {numberFormat} from 'humanize';
import React, {Component} from 'react';
import {flatMap, startWith} from 'rxjs/operators';

import styles from './Statistics.css';
import commonStyles from './Common.css';
import {TradeClient} from '../../client';

export default class Statistics extends Component {
    constructor() {
        super();

        this.state = {ticker: []};
    }

    componentDidMount() {
        this._ticker = interval(3000)
            .pipe(
                startWith(TradeClient.getCurrentTicker()),
                flatMap(() => TradeClient.getCurrentTicker())
            )
            .subscribe(
                ticker => this.setState({ticker})
            );
    }

    componentWillUnmount() {
        this._ticker.unsubscribe();
    }

    render() {
        const [time, price = 0, fluctuate = 0, max = 0, min = 0, ignore, total = 0] = this.state.ticker;

        return (
            <div className={styles.container}>
                <span className={commonStyles.buy}>当前价格：{numberFormat(price, 4)}</span>
                <span>日涨跌：{numberFormat(fluctuate, 2)}%</span>
                <span>最高价：{numberFormat(max, 4)}</span>
                <span>最低价：{numberFormat(min, 4)}</span>
                <span>24小时成交：{numberFormat(total)}</span>
            </div>
        );
    }
}
