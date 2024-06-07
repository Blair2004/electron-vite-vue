import { IpcRenderer } from "electron";
import { State } from "./interfaces/State";
import { store } from "./store";

declare const ipcRenderer: IpcRenderer;

ipcRenderer.on( 'server-down', ( event, response ) => {
    store.dispatch( ( state: any ) => {
        /**
         * if the state receives instructions to store
         * options, it will change the "options" state with the new values.
         * Typically, this instructions is send by the Main process.
         */
        if ( response.type === 'store-options' ) {
            state.options = response.data;
            (<any>window).options = response.data;
        }

        /**
         * if the server_up is not false, it will be set to false.
         * as this means an instruction was sent by the renderer process.
         */
        if ( state.server_up !== undefined ) {
            state.server_up = undefined;
            state.server_data = {};
        }
    });
});

/**
 * We're listening to the state change and 
 * perform actions based on the change.
 */
store.getState$().subscribe( async ( state: State ) => {
    if ( state.server_up !== undefined ) {
        await ipcRenderer.send( <string>state.server_up, state.server_data || {} );
    }
});

(<any>window).options = await ipcRenderer.invoke( 'load-options' );