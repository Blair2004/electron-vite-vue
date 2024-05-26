import { Menu, shell } from "electron";
import About from "./About";

export default class AppMenu {
    constructor({ preload, win, indexHtml, url }) {
        // Create menu from template
        const menu  =   Menu.buildFromTemplate([{
            label: 'Help',
            submenu: [{
                label: 'About',
                click: () => {
                    new About({ preload, win, indexHtml, url });                    
                }
            }, {
                label: 'Documentation',
                click: () => shell.openExternal('https://my.nexopos.com/en/marketplace/item/nexo-print-server?utm_source=toolbar&utm_medium=nexo-print-server&utm_campaign=help&utm_content=docs')
            }]
        }]);

        win.setMenu(menu);
    }
}