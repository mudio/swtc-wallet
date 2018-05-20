// @flow
import PropTypes from 'prop-types';
import {Provider} from 'react-redux';
import React, {Component} from 'react';
import {ConnectedRouter} from 'react-router-redux';

import LoginPage from '../components/Login';
import Routes from '../routes';

export default class Root extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

    render() {
        if (location.search.startsWith('?login')) {
            return (<LoginPage />);
        }

        return (
            <Provider store={this.props.store}>
                <ConnectedRouter history={this.props.history}>
                    <Routes />
                </ConnectedRouter>
            </Provider>
        );
    }
}
