import { store } from "@/store";

export function confirm( title: string, message: string, onConfirm: Function ) {
    store.next({
        type: 'dialog',
        data: {
            type: 'confirm',
            title,
            message,
            onConfirm: () => {
                store.next({ type: 'dialog', data: false })
                onConfirm();
            }
        }
    });
}