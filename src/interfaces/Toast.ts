export interface Toast {
    title: string,
    description: string,
    variant: 'destructive' | undefined,
    action?: any
}