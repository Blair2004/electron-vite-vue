export interface AsyncResponse {
    status: 'success' | 'error' | 'info',
    message: string,
    data: any
}