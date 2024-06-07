import { IpcRenderer } from "electron";
import { Subscription } from "rxjs";

declare const ipcRenderer: IpcRenderer;

export class CanAccessDashboardMiddleware {
    observer?: Subscription;

    handle( next: any ) {
        return new Promise( async ( resolve, reject ) => {
            console.log( (<any>window).options.app_status );
            if ( (<any>window).options.app_status === undefined ) {
                /**
                 * for some reason, the app doesn't have the "app_status" 
                 * option defined. We should restart the settings.
                 */
                await ipcRenderer.invoke( 'delete-options', [ 'selected_license' ]);
                next('/select-license');
                resolve( false );
            } else {
                next();
                resolve( false );
            }
        });
    }
}