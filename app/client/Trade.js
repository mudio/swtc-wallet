/**
 * @file Trade.js
 * @author 木休大人(523317421@qq.com)
 */

/* eslint compat/compat:off */

import request from 'request';

export default class Trade {
    static async getTntrusData() {
        const host = Trade.getRandomHost();

        return new Promise((resolve, reject) => request(
            `https://${host}/info/depth/SWT-CNY/more`,
            (err, res, body) => {
                if (err) {
                    reject(err);
                }

                resolve(JSON.parse(body).data);
            })
        );
    }

    static getCurrentTicker() {
        const host = Trade.getRandomHost();

        return new Promise((resolve, reject) => request(
            `https://${host}/info/ticker/SWT-CNY`,
            (err, res, body) => {
                if (err) {
                    return reject(err);
                }

                resolve(JSON.parse(body).data);
            })
        );
    }

    static getRandomHost() {
        const kHost = [
            'iac76ef1404.jccdex.cn',
            'imc76ef14ab.jccdex.cn',
            'ia111ecfd37.jccdex.cn',
            'i7d7775cabc.jccdex.cn',
            'ibm121echd69.jccdex.cn',
            'ibm1hb69gppm.jccdex.cn',
            'i876jhepoipm.jccdex.cn',
            'iujhg293cxjm.jccdex.cn',
            'iujhg293cabc.jccdex.cn',
            'iujh6753cabc.jccdex.cn',
            'ikj98kyq754c.jccdex.cn',
            'ilxx8kxy1c87.jccdex.cn',
            'icv1m969gqpx.jccdex.cn',
            'ilo8jc69gggg.jccdex.cn',
            'ilhb57hcgyxk.jccdex.cn',
            'il8hn7hcgyxk.jccdex.cn'
        ];

        const index = ~~(Math.random() * kHost.length); // eslint-disable-line

        return kHost[index];
    }
}
