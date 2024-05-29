export interface Dialog {
    type?: 'confirm' | 'alert' | 'prompt',
    title?: string,
    message?: string,
    onConfirm?: () => void,
}