// @flow
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import Sidebar from '../components/common/Sidebar';
import SystemBar from '../components/common/SystemBar';

export default class App extends Component {
    static propTypes = {
        children: PropTypes.node.isRequired
    };

    render() {
        return (
            <div className="app">
                <SystemBar resizable />
                <div className="content">
                    <Sidebar />
                    {this.props.children}
                </div>
            </div>
        );
    }
}
