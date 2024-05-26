/**
 * let's register some menus
 */

import { BrowserWindow, Menu, app, shell } from "electron";
import { join, dirname } from "node:path";
import { fileURLToPath } from 'node:url'

globalThis.__filename = fileURLToPath(import.meta.url)
globalThis.__dirname = dirname(__filename)

process.env.DIST_ELECTRON = join(__dirname, '../')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
	? join(process.env.DIST_ELECTRON, '../public')
	: process.env.DIST

export default class About {
    constructor({ preload, win, indexHtml, url }) {
        const aboutWindow = new BrowserWindow({
            width: 400,
            height: 300,
            icon: join(process.env.PUBLIC, 'favicon.ico'),
            webPreferences: {
                preload,
                nodeIntegration: true,
                contextIsolation: true,
                devTools: process.env.VITE_DEV_SERVER_URL ? true : false,
            },
            minimizable: false,
            maximizable: false,
            parent: win,
            modal: true,
            resizable: false,
            autoHideMenuBar: true,
        });

        if ( process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
            aboutWindow.loadURL(`${url}?goto=about`);
            // Open devTool if the app is not packaged
            aboutWindow.webContents.openDevTools()
        } else {
            aboutWindow.loadURL(`file://${indexHtml}?goto=about`);
        }
    }
}
