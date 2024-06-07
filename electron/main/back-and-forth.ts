import { app, ipcMain } from "electron";
import { Options } from "./services/Options";
import { Authentication } from "./services/Authentication";
import { Reset } from "./Reset";
import { data } from "autoprefixer";
import { PrinterService } from "./services/PrinterService";


export class BackAndForth {
    options = new Options;

    constructor( private webContents: Electron.WebContents ) {

        /**
         * When the main is instructed to store options, it stores
         * the data and instrcut therenderer to keep new options.
         */
        ipcMain.handle( 'save-options', ( event, data ) => {
            for( let key in data ) {
                this.options.set( key, data[ key ] );
            }

            this.loadAndStoreOptions();

            return {
                status: 'success',
                message: 'The options were successfully saved.'
            };
        });

        /**
         * we might be instructed to delete certain options
         * we'll perform that here
         */
        ipcMain.handle( 'delete-options', ( event, data ) => {
            for( let key of data ) {
                this.options.delete( key );
            }

            return this.loadAndStoreOptions();
        });

        /**
         * Sometime, we might want to delete all options
         * except some options
         */
        ipcMain.handle( 'delete-except', ( event, data ) => {
            this.options.deleleteAllExcept( data );
            return this.loadAndStoreOptions();
        });

        /**
         * When ther main is instructed to load options
         * Its instruct the renderer to store options
         */
        ipcMain.handle( 'load-options', ( event, data ) => {
            return this.loadAndStoreOptions();
        });

        /**
         * When the application tries to validate
         * the token provided by the user.
         */
        ipcMain.handle( 'test-credentials', async ( event, data ) => {
            const authentication = new Authentication;
            const options = this.options.getAll();

            if ( options.access_token === undefined ) {
                /**
                 * We'll request permission to get the token
                 * this should put the renderer in wait mode.
                 */
                authentication.requestToken();

                return {
                    status: 'info',
                    message: 'Awaiting permission approval.'
                };
            } else {
                try {
                    return {
                        status: 'success',
                        data: await authentication.checkAccessToken(),
                        message: 'Token is valid and working.'
                    };
                } catch( exception ) {
                    /**
                     * we're unable to validate the token
                     * we'll then try to request new token.
                     */
                    authentication.requestToken();

                    return {
                        status: 'info',
                        message: 'Awaiting permission approval.'
                    };
                }
            }            
        });

        /**
         * When we want to submit the license usage to the server
         * we'll proceed here
         */
        ipcMain.handle( 'select-license', async ( event, data ) => {
            /**
             * We'll then proceed to submit the license usage
             */
            const authentication = new Authentication;
            try {
                await authentication.verifyLicense( data.license );
                await authentication.updateLicenseStatus( data.license, 'activate' );

                this.options.set( 'selected_license', data.license );
                this.options.set( 'app_status', 'licensed' );
                this.options.set( 'server_port', 3236 );
                this.options.set( 'ssl_enabled', true );

                return {
                    status: 'success',
                    message: 'The license was successfully activated.'
                };

            } catch( exception ) {
                return {
                    status: 'error',
                    message: exception.message || 'An error occured while verifying the license.'
                };
            }
        });

        /**
         * This sections handle license disconnection
         */
        ipcMain.handle( 'disconnect-license', async ( event, data ) => {
            const authentication = new Authentication;

            try {
                const response = await authentication.disableLicense(
                    this.options.get( 'selected_license' ),
                );

                Reset.preventDashboardAccess();
                this.loadAndStoreOptions();

                return response.data;
            } catch( exception ) {

                /**
                 * we might allow the user to force disconnect the license from now.
                 * There might be an internet issue.
                 */
                this.options.set( 'allow_force_disconnect', 'yes' );
                this.loadAndStoreOptions();

                return {
                    status: 'error',
                    message: exception.message || 'An error occured while disabling the license.',
                }
            }
        });

        /**
         * When the user wants to force disconnect the license
         */
        ipcMain.handle( 'force-disconnect-license', async ( event, data ) => {
            const authentication = new Authentication;

            try {
                const response = await authentication.hardDisableLicense();
                this.loadAndStoreOptions();
                return response;
            } catch( exception ) {
                return {
                    status: 'error',
                    message: exception.message || 'An error occured while disabling the license.',
                }
            }
        });

        /**
         * We'll provide here the current app version
         * to display what version is being used to the user.
         */
        ipcMain.handle( 'get-version', async () => {
            return app.getVersion();
        });

        /**
         * If the user want to startteh demo, we'll proceed here
         */
        ipcMain.handle( 'start-demo', async( event, data ) => {
            this.options.set( 'app_status', 'demo' );
            this.options.set( 'server_port', 3236 );
            this.options.set( 'ssl_enabled', true );

            return {
                status: 'success',
                message: 'The demo was successfully started.'
            }
        });

        /**
         * Requesting the user licenses for validation purposes
         */
        ipcMain.handle( 'user-licenses', async () => {
            try {
                const licenses 	=	await (new Authentication).syncUserLicenses();
                return {
                    status: 'success',
                    message: 'The user licenses were loaded.',
                    data: licenses
                };
            } catch( exception ) {
                return {
                    status: 'error',
                    message: 'An error occured while retreiving user licenses.'
                }
            }
        });

        /**
         * We'll retreive here the user print setup
         */
        ipcMain.handle( 'get-print-setups', async () => {
            return await ( new Authentication ).getPrintSetups();
        });

        /**
         * This will provide the available printers.
         */
        ipcMain.handle( 'get-printers', async () => {
            return PrinterService.getPrinters();
        });
    }

    loadAndStoreOptions() {
        const options   =   this.options.getAll();

        this.webContents.send( 'server-down', {
            type: 'store-options',
            data: options
        });

        return options;
    }
}