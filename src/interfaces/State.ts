export interface State {
    type: 'toast' | 'server-up' | 'server-down',
    data: any
}