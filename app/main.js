/* eslint global-require: 0, flowtype-errors/show-errors: 0 */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import {app, ipcMain} from 'electron';

import MenuBuilder from './main/MenuBuilder';
import WindowManager from './main/WindowManager';

if (process.env.NODE_ENV === 'production') {
    const sourceMapSupport = require('source-map-support');
    sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    require('electron-debug')();
    const path = require('path');
    const p = path.join(__dirname, '..', 'app', 'node_modules');
    require('module').globalPaths.push(p);
}

const installExtensions = async () => {
    const installer = require('electron-devtools-installer');
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = [
        'REACT_DEVELOPER_TOOLS',
        'REDUX_DEVTOOLS'
    ];

    return Promise
        .all(extensions.map(name => installer.default(installer[name], forceDownload)))
        .catch(console.log);
};

let _window = null;

const shouldQuit = app.makeSingleInstance(() => {
    if (_window) {
        if (_window.isMinimized()) {
            _window.restore();
        }

        _window.focus();
    }
});

if (shouldQuit) {
    app.quit();
}

/**
 * Add event listeners...
 */
app.on('window-all-closed', () => app.quit());

app.on('ready', async () => {
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
        await installExtensions();
    }

    // 开启登陆
    _window = WindowManager.fromLogin(`file://${__dirname}/app.html?login`);
    // 监听通知
    ipcMain.on('notify', (evt, type) => {
        if (type === 'login_success') {
            const window = WindowManager.fromApp(`file://${__dirname}/app.html#/home`);
            _window.close();
            _window = window;
        } else if (type === 'logout') {
            const window = WindowManager.fromLogin(`file://${__dirname}/app.html?login`);
            _window.close();
            _window = window;
        }

        if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
            _window.openDevTools();
        }
    });

    const menuBuilder = new MenuBuilder(_window);
    menuBuilder.buildMenu();
});
