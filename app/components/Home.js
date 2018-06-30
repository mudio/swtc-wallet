/**
 * @file Home.js
 * @author 木休大人(523317421@qq.com)
 */

import * as Rx from 'rxjs';
import React, {Component} from 'react';
import {Card, Col, Row, Table} from 'antd';
import {flatMap, map, startWith} from 'rxjs/operators';

import {Wallet, Account} from '../client';
import styles from './Home.css';

const columns = [
    {title: '资产名称', dataIndex: 'currency', key: 'currency'},
    {title: '总额', dataIndex: 'value', key: 'value'},
    {title: '冻结', dataIndex: 'freezed', key: 'freezed'}
];

export default class Home extends Component {
    constructor(...args) {
        super(...args);

        const {credentials, auth} = Account.fromStroage();

        this.state = {balances: [], loading: true, auth, credentials};
    }

    componentDidMount() {
        this._interval = Rx.interval(3000)
            .pipe(
                startWith(Wallet.getBalances()),
                flatMap(() => Wallet.getBalances()),
                map(
                    x => x.map((item, key) => Object.assign(item, {key}))
                )
            )
            .subscribe(balances => this.setState({balances, loading: false}));
    }

    componentWillUnmount() {
        this._interval.unsubscribe();
    }

    renderAuthRow() {
        if (this.state.auth) {
            const {username, realname, phone, verified, avatar} = this.state.auth;

            return (
                <Row gutter={8}>
                    <Col>
                        <Card hoverable>
                            <div className={styles.summary}>
                                <img src={avatar} alt="" />
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>姓名：</td>
                                            <td>{realname}</td>
                                            <td>认证信息：</td>
                                            <td>{verified}</td>

                                        </tr>
                                        <tr>
                                            <td>用户名：</td>
                                            <td>{username}</td>
                                            <td>联系方式：</td>
                                            <td>{phone}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </Col>
                </Row>
            );
        }

        return null;
    }

    render() {
        const {credentials, balances, loading} = this.state;

        return (
            <div className={styles.container} data-tid="container">
                {this.renderAuthRow()}
                <Row gutter={8}>
                    <Col>
                        <Card hoverable>
                            <Card.Meta
                                title="钱包地址"
                                description={credentials.address}
                                avatar={<img alt="" src={`http://www.gbtags.com/gb/qrcode?t=${credentials.adress}`} />}
                            />
                        </Card>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={24}>
                        <Card hoverable>
                            <Table
                                size="small"
                                columns={columns}
                                pagination={false}
                                loading={loading}
                                dataSource={balances}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}
