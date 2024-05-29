export interface Options {
    client_id?: string
    client_secret?: string
    token_type?: string
    expires_in?: number
    access_token?: string
    refresh_token?: string
    user_id?: number
    user_email?: string
    user_login?: string
    app_status?: string
    selected_license?: string
    allow_force_disconnect?: 'yes' | 'no'
}