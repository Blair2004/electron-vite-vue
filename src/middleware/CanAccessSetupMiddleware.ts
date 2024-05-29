import { State } from "@/interfaces/State";
import { store } from "@/store";
import { IpcRenderer } from "electron";
import { Subscription } from "rxjs";

declare const ipcRenderer: IpcRenderer;

export class CanAccessSetupMiddleware {
    observer?: Subscription;

    handle( next: any ) {
        return new Promise( async ( resolve, reject ) => {
            /**
             * The app should be in valid state before proceeding
             * If that's the case, we'll redirect to the dashboard.
             */
            if ( [ 'demo', 'licensed' ].includes( (<any>window).options.app_status ) ) {
                next( '/dashboard' );
                return resolve( false );
            } 

            /**
             * for some reason, the app is not in a valid state
             * we'll just make sure to clear the information that allow dashboard access
             */
            store.dispatch( ( state: State ) => {
                state.server_up = 'delete-options';
                state.server_data = [ 
                    'app_status',
                    'selected_license',
                    'allow_force_disconnect'
                ];
            });

            next();
            resolve( false );
        });
    }
}