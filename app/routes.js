/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';

import App from './containers/App';
import HomePage from './containers/HomePage';
import ContactPage from './containers/ContactPage';
import SecurityPage from './containers/SecurityPage';
import PayPage from './containers/PayPage';
import TradePage from './containers/TradePage';

export default () => (
    <App>
        <Switch>
            <Route path="/trade" component={TradePage} />
            <Route path="/pay" component={PayPage} />
            <Route path="/contacts" component={ContactPage} />
            <Route path="/security" component={SecurityPage} />
            <Route path="/home" component={HomePage} />
            <Route path="/" component={HomePage} />
        </Switch>
    </App>
);
