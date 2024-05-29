import axios from "axios";
import { BrowserWindow, ipcMain, shell } from "electron";
import { Options } from "./Options";
// import printer from "@thiagoelg/node-printer";
import { v4 as uuidv4 } from "uuid";
import { Reset } from "../Reset";

import pkg from 'node-machine-id';
const { machineIdSync } = pkg;

export class Authentication 
{
    private state;

    requestToken() {
        const options       =   new Options;
        const client_id     =   options.get( 'client_id' );
        const client_secret =   options.get( 'client_secret' );
        this.state          =   this.randomString(20);

        const params        =   { 
            client_id: client_id,
            redirect_uri: 'https://my.nexopos.com/nps',
            response_type: 'code',
            scope: 'manage-printers read-profile read-licenses update-licenses', 
            state: this.state
        };

        shell.openExternal( `https://my.nexopos.com/oauth/authorize?${new URLSearchParams( params )}` )
    }

    randomString(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
    }

    async saveCode( fullURL ) {
        let url;

        try {
            url = new URL( fullURL );
        } catch( exception ) {
            return;
        }

        const options           =   new Options;
        const code              =   url.searchParams.get( 'code' );
        const client_id         =   options.get( 'client_id' );
        const client_secret     =   options.get( 'client_secret' );
        const axiosInstance     =   axios.create({
            baseURL: 'https://my.nexopos.com/',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });

        /**
         * We're trying here to authenticate the
         * credenetials that was provided on the auth code.
         */
        try {
            let response = await axiosInstance.post( 'oauth/token', {
                grant_type : 'authorization_code',
                redirect_uri : 'https://my.nexopos.com/nps',
                client_id,
                client_secret,
                code,
            });

            /**
             * We first need to store those information
             * to be able to pull user data.
             */
            options.saveFromObject( response.data );
                
            const userResult    =   await this.saveUser();
            const userData      =   {
                user_id: userResult[ 'ID' ],
                user_email: userResult[ 'user_email' ],
                user_login: userResult[ 'user_login' ]
            };

            options.saveFromObject( userData );

            return {
                status: 'success',
                message: 'The authentication is successful'
            };
        } catch( exception ) {
            return {
                status: 'error',
                message: 'The authentication failed',
                data: {exception}
            };
        }
    }

    /**
     * Will force disconnection when it's proven
     * the domain attached to the license, doesn't match the domain
     * stored on the application settings.
     */
    hardDisableLicense() {
        
        Reset.preventDashboardAccess();

        return {
            status: 'success',
            message: 'The license is disabled.'
        }
    }

    async disableLicense( license_id ) {
        const domain = machineIdSync();
        return await this.http().post( `/api/user/licenses/${license_id}/deactivate`, { domain });
    }

    /**
     * @deprecated
     */
    disableLicenseRemotely({ resolve, selected_license, options, domain, status }) {
        this.http().post( `/api/user/licenses/${selected_license}/${status}`, { domain })
            .then( result => {
                
                if ( status === 'activate' ) {
                    options.set( 'domain', domain );
                    options.set( 'free_version', false );
                    options.set( 'selected_license', selected_license );
                    options.delete( 'show_invalid_license' );
                } else {
                    options.set( 'show_license', true );
                    options.set( 'show_home', false );
                    options.delete( 'selected_license' );
                    options.delete( 'domain' );
                    options.delete( 'free_version' );
                }

                resolve( result.data );
            })
            .catch( error => {
                if ( error.response.data.status === undefined ) {
                    return resolve({
                        status: 'error',
                        message: `Unable to disable the license.`
                    })
                }

                if ( error.response.data.message ) {
                    error.response.data.status  =   'error';
                }

                resolve( error.response !== undefined ? error.response.data : {
                    status: 'error',
                    message: 'Unable to reach the remote server.'
                });
            })
    }

    saveUser() {
        return new Promise( ( resolve, reject ) => {
            this.http().get( 'api/user' )
                .then( result => resolve( result.data ) )
                .catch( result => reject( result.response.data ) );
        })
    }

    private http() {
        const optionService     =   new Options;
        const options           =   optionService.getAll();

        return axios.create({
            baseURL: 'https://my.nexopos.com/',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${options[ 'access_token' ] }`
            }
        });
    }

    syncPrinters() {
        return new Promise ( ( resolve, reject ) => {
            const printers          =   printer.getPrinters();
            const optionService     =   new Options;
            const options           =   optionService.getAll();
            const axiosInstance     =   axios.create({
                baseURL: 'https://my.nexopos.com/',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${options[ 'access_token' ] }`
                }
            });

            axiosInstance.post( 'api/user/sync-printers', {
                    setup: options[ 'setup_hash' ],
                    printers: options[ 'printers' ]
                })
                .then( result => resolve( result.data ) )
                .catch( error => {
                    reject( error.response.data );
                });
        })
    }

    async checkAccessToken() {
        const optionsService = new Options;
        const options = optionsService.getAll();

        if (options['access_token']) {
            return Promise.resolve(options['access_token']);
        } else if (options['refresh_token']) {
            return this.requestAndStoreAccessToken(options['refresh_token']);
        } else {
            return Promise.reject('No access token or refresh token found');
        }
    }

    async verifyToken( accessToken ) {
        try {
            const result    =   await this.http().get( 'api/user' );

            return {
                status: 'success',
                message: 'The access token is valid.'
            }
        } catch( exception ) {
            return {
                status: 'error',
                code: 'invalid_token',
                message: 'The access token is invalid.'
            }
        }
    }

    requestAndStoreAccessToken(refreshToken) {
        return new Promise((resolve, reject) => {
            const optionsService = new Options;
            const clientId = optionsService.get('client_id');
            const clientSecret = optionsService.get('client_secret');
            
            axios.post('oauth/token', {
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                client_id: clientId,
                client_secret: clientSecret,
            })
            .then(response => {
                optionsService.set('access_token', response.data.access_token);
                resolve(response.data.access_token);
            })
            .catch(error => {
                reject(error);
            });
        });
    }

    updateLicenseStatus( license_id, status: 'activate' | 'deactivate' ) {
        return new Promise( ( resolve, reject ) => {
            this.http().post( `api/user/licenses/${license_id}/${status}`, {
                domain: machineIdSync()
                })
                .then( result => resolve( result.data ) )
                .catch( error => reject( error.response.data ) );
        })
    }

    verifyLicense( license ) {
        return new Promise( ( resolve, reject ) => {            
            this.http().get( `api/user/licenses/${license}` )
                .then( async (result) => {
                    resolve({
                        status: 'success',
                        message: 'The license is valid.',
                        code: 'connection_successful',
                        data: result.data
                    });                    
                }).catch( error => {
                    console.log( error );
                    reject({
                        status: 'error',
                        message: error.response.data,
                    });
                })
        })
    }

    syncUserLicenses() {
        return new Promise <any[]>( ( resolve, reject ) => {
            const domain = machineIdSync();
            this.http().get( `api/user/available-licenses/21867974?domain=${domain}` )
                .then( result => {
                    resolve( result.data );
                })
                .catch( error => {
                    reject( error.response !== undefined ? error.response.data : {
                        status: 'error',
                        message: 'Unable to reach the remote server.'
                    });
                });
        })
    }
}