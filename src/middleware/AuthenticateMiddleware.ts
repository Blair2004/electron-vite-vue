import { Subscription } from "rxjs";

export class AuthenticateMiddleware {
    observer?: Subscription;

    handle( next: any ) {
        return new Promise( async ( resolve, reject ) => {
            if ( (<any>window).options.access_token === undefined ) {
                next(); // proceed as it's Authentication middleware
            } else {
                next('/select-license');
            }
        });
    }
}