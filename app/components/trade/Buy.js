// @flow
import {interval} from 'rxjs';
import {Input, Slider, Button} from 'antd';
import {numberFormat} from 'humanize';
import React, {Component} from 'react';
import {flatMap, startWith} from 'rxjs/operators';

import styles from './Buy.css';
import {Wallet} from '../../client';

export default class Buy extends Component {
    constructor() {
        super();

        this.state = {balances: {SWT: 0, CNY: 0}, per: 0, price: 0, amount: 0};
    }

    componentDidMount() {
        this._tntrus = interval(3000)
            .pipe(
                startWith(Wallet.getBalances()),
                flatMap(() => Wallet.getBalances())
            )
            .subscribe(
                data => {
                    const balances = data.reduce((c, i) => {
                        c[i.currency] = i.value - i.freezed;
                        return c;
                    }, {});

                    this.setState({balances});
                }
            );
    }

    componentWillUnmount() {
        this._tntrus.unsubscribe();
    }

    _onSliderChange = per => this.setState({per, amount: per * this.state.balances.SWT / 100});

    _onPriceChange = ({target}) => this.setState({price: target.value});

    _onAmountChange = ({target}) => {
        const per = +numberFormat(target.value / this.state.balances.SWT * 100, 2);
        this.setState({amount: target.value, per});
    }

    render() {
        const {balances, per, price, amount} = this.state;

        return (
            <div className={styles.container}>
                <div className={styles.item}>
                    可用：
                    <span className={styles.balances} >
                        {numberFormat(balances.SWT)} SWT----{numberFormat(balances.CNY)} CNY
                    </span>
                </div>
                <div className={styles.item}>
                    <Input
                        size="small"
                        placeholder="输入交易价格"
                        addonBefore="交易价："
                        onChange={this._onPriceChange}
                        value={price}
                    />
                </div>
                <div className={styles.item}>
                    <Input
                        size="small"
                        placeholder="输入交易SWT个数"
                        addonBefore="交易量："
                        onChange={this._onAmountChange}
                        value={numberFormat(amount, 0, '.', '')}
                    />
                </div>
                <div>
                    <Slider tipFormatter={v => `${v}%`} onChange={this._onSliderChange} value={per} />
                </div>
                <div>
                    <Button type="buy">买入</Button>
                    <Button type="sell">卖出</Button>
                </div>
            </div>
        );
    }
}
