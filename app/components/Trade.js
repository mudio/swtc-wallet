// @flow
import {Tabs} from 'antd';
import React, {Component} from 'react';

import styles from './Trade.css';

import Buy from './trade/Buy';
import Trend from './trade/Trend';
import Tntrus from './trade/Tntrus';
import Entrust from './trade/Entrust';
import Statistics from './trade/Statistics';
import Transaction from './trade/Transaction';

export default class Trade extends Component {
    render() {
        return (
            <div className={styles.container} data-tid="container">
                <Statistics />
                <div className={styles.content}>
                    <Tntrus />
                    <Trend />
                </div>
                <div className={styles.trade}>
                    <Tabs defaultActiveKey="1" tabPosition="left">
                        <Tabs.TabPane tab="我要交易" key="1">
                            <Buy />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="当前委托" key="2">
                            <Entrust />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="历史交易" key="3">
                            <Transaction />
                        </Tabs.TabPane>
                    </Tabs>
                </div>
            </div>
        );
    }
}
