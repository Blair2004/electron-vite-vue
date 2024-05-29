import { IpcRenderer } from "electron";
import { State } from "./interfaces/State";
import { store } from "./store";
import { Outgoing } from "./interfaces/Outgoing";

declare const ipcRenderer: IpcRenderer;

store.observable.subscribe( async (value: State ) => {
    /**
     * if the state receives instructions to save options,
     * it will send the options to the Main process.
     */
    if ( [ 'save-options' ].includes( value.type ) ) {
        const message: Outgoing    =   value.data;
        ipcRenderer.send( value.type, message );
    }

    /**
     * if the state receives instructions to store
     * options, it will change the "options" state with the new values.
     * Typically, this instructions is send by the Main process.
     */
    if ( value.type === 'store-options' ) {
        (<any>window).options  =   value.data;
    }
});

ipcRenderer.on( 'server-down', ( event, data ) => {
    store.next( data );
});

(<any>window).options = await ipcRenderer.invoke( 'load-options' );