import { store } from "@/store";
import { IpcRenderer } from "electron";
import { Subscription } from "rxjs";

declare const ipcRenderer: IpcRenderer;

export class CheckCredentialsMiddleware {
    observer?: Subscription;

    handle( next: any ) {
        return new Promise( async ( resolve, reject ) => {
            if ( (<any>window).options.selected_license || (<any>window).options.app_status === 'demo' ) {
                next( '/dashboard' ); 
                return false;
            }

            if ( (<any>window).options.installed === undefined ) {
                /**
                 * We'll check if the access token is provided. If not,
                 * we'll redirect to the authentication page.
                 */
                try {
                    next();
                    return false;
                } catch( exception ) {
                    /**
                     * the credentials doesn't seem to be valid
                     * we'll clear the authentication credentials and
                     * return to the authentication page.
                     */
                    ipcRenderer.invoke( 'delete-options', [ 'client_id', 'client_secret' ] );

                    next( '/' );
                    return false;
                }
            }
        });
    }
}