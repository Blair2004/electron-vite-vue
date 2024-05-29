export interface State {
    server_up: 'save-options' | 'load-options' | 'delete-options' | false,
    server_data: any,
    dialog: any,
    toast: any,
    options: {
        [key: string]: any
    }
}