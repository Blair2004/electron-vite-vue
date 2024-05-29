import { app } from "electron";
import { Options } from "./services/Options";

export class Reset {
    static preventDashboardAccess() {
        const options = new Options;
        options.deleteKeys([
            'selected_license',
            'app_status',
            'domain',
            'allow_force_disconnect'
        ]);        
    }

    static preventLicenseSelection() {
        const options = new Options;
        options.deleteKeys([
            'access_token',
            'refresh_token',
            'expires_in',
            'token_type',
            'user_id',
            'user_email',
            'user_login'
        ]);
    }
}