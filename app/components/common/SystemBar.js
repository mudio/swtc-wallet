/**
 * Component - SystemBar Component
 *
 * @file SystemBar.js
 * @author mudio(job.mudio@gmail.com)
 */

import electron from 'electron';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import React, {Component} from 'react';

import styles from './SystemBar.css';
import {isOSX} from '../../utils';

const browserWindow = electron.remote.getCurrentWindow();

export default class SystemBar extends Component {
    static propTypes = {
        resizable: PropTypes.bool,
        className: PropTypes.string
    }

    static defaultProps = {
        resizable: false,
        className: ''
    }

    close = () => {
        browserWindow.close();
    }

    toggleMaximize = () => {
        if (browserWindow.isMaximized()) {
            browserWindow.unmaximize();
        } else {
            browserWindow.maximize();
        }
    }

    minimize = () => {
        browserWindow.minimize();
    }

    render() {
        if (isOSX) {
            return null;
        }
        const {resizable, className} = this.props;

        if (resizable) {
            return (
                <div className={classnames(styles.container, className)}>
                    <div className={styles.title} >
                        {electron.remote.app.getName()}-{electron.remote.app.getVersion()}
                    </div>
                    <div className={`fa fa-minus ${styles.min}`} onClick={this.minimize} />
                    <div className={`fa fa-expand ${styles.max}`} onClick={this.toggleMaximize} />
                    <div className={`fa fa-times ${styles.exit}`} onClick={this.close} />
                </div>
            );
        }

        return (
            <div className={classnames(styles.container, className)}>
                <div className={`fa fa-times ${styles.exit}`} onClick={this.close} />
            </div>
        );
    }
}
