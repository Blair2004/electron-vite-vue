import { app } from "electron";
import { Options } from "./services/Options";

export class Reset {
    static preventDashboardAccess() {
        const options = new Options;
        options.deleleteAllExcept([
            'client_id',
            'client_secret',
            'token_type',
            'expires_in',
            'access_token',
            'refresh_token',
            'user_id',
            'user_email',
            'user_login',
        ]);        
    }

    static preventLicenseSelection() {
        const options = new Options;
        options.deleteAll();
    }
}