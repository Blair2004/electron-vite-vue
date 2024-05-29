export interface State {
    type: 'toast' | 'server-up' | 'server-down' | 'save-options' | 'load-options' | 'store-options' | 'authentication-response' | 'dialog',
    data: any
}