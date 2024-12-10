export interface State {
    server_up: 'save-options' | 'load-options' | 'delete-options' | false,
    server_data: any,
    dialog: any,
    toast: any,
    type: string,
    data: any,
    options: {
        [key: string]: any
    }
}