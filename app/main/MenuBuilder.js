// @flow
import {
    app,
    Menu,
    shell
} from 'electron';

export default class MenuBuilder {
    constructor(mainWindow) {
        this.mainWindow = mainWindow;
    }

    buildMenu() {
        if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
            this.setupDevelopmentEnvironment();
        }

        const template = process.platform === 'darwin' ?
            this.buildDarwinTemplate() :
            this.buildDefaultTemplate();

        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);

        return menu;
    }

    setupDevelopmentEnvironment() {
        this.mainWindow.openDevTools();
        this.mainWindow.webContents.on('context-menu', (e, props) => {
            const {
                x,
                y
            } = props;

            Menu
                .buildFromTemplate([{
                    label: 'Inspect element',
                    click: () => {
                        this.mainWindow.inspectElement(x, y);
                    }
                }])
                .popup(this.mainWindow);
        });
    }

    buildDarwinTemplate() {
        const subMenuAbout = {
            label: 'SwtcWallet',
            submenu: [
                {
                    label: 'About Wallet',
                    selector: 'orderFrontStandardAboutPanel:'
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Services',
                    submenu: []
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Hide',
                    accelerator: 'Command+H',
                    selector: 'hide:'
                },
                {
                    label: 'Hide Others',
                    accelerator: 'Command+Shift+H',
                    selector: 'hideOtherApplications:'
                },
                {
                    label: 'Show All',
                    selector: 'unhideAllApplications:'
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Quit',
                    accelerator: 'Command+Q',
                    click: () => {
                        app.quit();
                    }
                }
            ]
        };
        const subMenuEdit = {
            label: '编辑',
            submenu: [
                {
                    label: 'Undo',
                    accelerator: 'Command+Z',
                    selector: 'undo:'
                },
                {
                    label: 'Redo',
                    accelerator: 'Shift+Command+Z',
                    selector: 'redo:'
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Cut',
                    accelerator: 'Command+X',
                    selector: 'cut:'
                },
                {
                    label: 'Copy',
                    accelerator: 'Command+C',
                    selector: 'copy:'
                },
                {
                    label: 'Paste',
                    accelerator: 'Command+V',
                    selector: 'paste:'
                },
                {
                    label: 'Select All',
                    accelerator: 'Command+A',
                    selector: 'selectAll:'
                }
            ]
        };
        const subMenuViewDev = {
            label: 'View',
            submenu: [
                {
                    label: 'Reload',
                    accelerator: 'Command+R',
                    click: () => {
                        this.mainWindow.webContents.reload();
                    }
                },
                {
                    label: 'Toggle Full Screen',
                    accelerator: 'Ctrl+Command+F',
                    click: () => {
                        this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
                    }
                },
                {
                    label: 'Toggle Developer Tools',
                    accelerator: 'Alt+Command+I',
                    click: () => {
                        this.mainWindow.toggleDevTools();
                    }
                }
            ]
        };
        const subMenuViewProd = {
            label: '视图',
            submenu: [
                {
                    label: '全屏切换',
                    accelerator: 'Ctrl+Command+F',
                    click: () => {
                        this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
                    }
                }
            ]
        };
        const subMenuWindow = {
            label: '窗口',
            submenu: [
                {
                    label: '最小化',
                    accelerator: 'Command+M',
                    selector: 'performMiniaturize:'
                },
                {
                    label: '关闭',
                    accelerator: 'Command+W',
                    selector: 'performClose:'
                },
                {
                    type: 'separator'
                },
                {
                    label: '窗口前置',
                    selector: 'arrangeInFront:'
                }
            ]
        };
        const subMenuHelp = {
            label: '关于',
            submenu: [
                {
                    label: 'SWTC Web',
                    click() {
                        shell.openExternal('https://app.jingtumlab.com');
                    }
                },
                {
                    label: '社区',
                    click() {
                        shell.openExternal('http://bbswtc.com');
                    }
                },
                {
                    label: '问题反馈',
                    click() {
                        shell.openExternal('https://github.com/mudio/swtc-wallet/issues');
                    }
                }
            ]
        };

        const subMenuView = process.env.NODE_ENV === 'development' ?
            subMenuViewDev :
            subMenuViewProd;

        return [
            subMenuAbout,
            subMenuEdit,
            subMenuView,
            subMenuWindow,
            subMenuHelp
        ];
    }

    buildDefaultTemplate() {
        const templateDefault = [{
            label: '&File',
            submenu: [{
                label: '&Open',
                accelerator: 'Ctrl+O'
            }, {
                label: '&Close',
                accelerator: 'Ctrl+W',
                click: () => {
                    this.mainWindow.close();
                }
            }]
        }, {
            label: '&View',
            submenu: (process.env.NODE_ENV === 'development') ? [{
                label: '&Reload',
                accelerator: 'Ctrl+R',
                click: () => {
                    this.mainWindow.webContents.reload();
                }
            }, {
                label: 'Toggle &Full Screen',
                accelerator: 'F11',
                click: () => {
                    this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
                }
            }, {
                label: 'Toggle &Developer Tools',
                accelerator: 'Alt+Ctrl+I',
                click: () => {
                    this.mainWindow.toggleDevTools();
                }
            }] : [{
                label: 'Toggle &Full Screen',
                accelerator: 'F11',
                click: () => {
                    this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
                }
            }]
        }, {
            label: 'Help',
            submenu: [{
                label: 'Learn More',
                click() {
                    shell.openExternal('http://electron.atom.io');
                }
            }, {
                label: 'Documentation',
                click() {
                    shell.openExternal('https://github.com/atom/electron/tree/master/docs#readme');
                }
            }, {
                label: 'Community Discussions',
                click() {
                    shell.openExternal('https://discuss.atom.io/c/electron');
                }
            }, {
                label: 'Search Issues',
                click() {
                    shell.openExternal('https://github.com/atom/electron/issues');
                }
            }]
        }];

        return templateDefault;
    }
}
