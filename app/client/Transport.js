/**
 * 交易趋势
 *
 * @file trend.js
 * @author zhanghao25@baidu.com
 */

/* eslint no-mixed-operators:0 */

import {Observable} from 'rxjs';
import {Remote} from 'jingtum-lib';

import {logger} from '../utils';

export default class Transport {
    static connect() {
        const _client = new Remote({server: 'wss://hc.jingtum.com:5020'});

        return Observable.create(observer => {
            _client.connect((err) => {
                if (err) {
                    logger.error(err);
                    return;
                }

                _client.on('transactions', ({transaction}) => observer.next(transaction));
            });

            return () => _client.disconnect();
        });
    }
}
