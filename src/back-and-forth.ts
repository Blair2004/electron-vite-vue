import { IpcRenderer } from "electron";
import { State } from "./interfaces/State";
import { store } from "./store";
import { Outgoing } from "./interfaces/Outgoing";

declare const ipcRenderer: IpcRenderer;

store.observable.subscribe( (value: State ) => {
    if ( value.type ==  'server-up' ) {
        const message: Outgoing    =   value.data;
        ipcRenderer.emit( message.type, message.data );
    }
});

ipcRenderer.on( 'server-down', ( event, data ) => {
    store.next( data );
});