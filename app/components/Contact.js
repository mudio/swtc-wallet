// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';

export default class Contact extends Component {
    render() {
        return (
            <div className={styles.container} data-tid="container">
                <h2>Contact</h2>
                <Link to="/counter">to Counter</Link>
            </div>
        );
    }
}
