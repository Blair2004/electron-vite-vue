import { Subscription } from "rxjs";

export class AuthenticateMiddleware {
    observer?: Subscription;

    handle( next: any ) {
        return new Promise( async ( resolve, reject ) => {
            if ( (<any>window).options.access_token === undefined ) {
                next();
                resolve( false );
            } else {
                next('/select-license');
                resolve( false );
            }
        });
    }
}