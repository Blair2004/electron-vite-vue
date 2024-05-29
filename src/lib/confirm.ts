import { State } from "@/interfaces/State";
import { store } from "@/store";

export function confirm( title: string, message: string, onConfirm: Function ) {
    store.dispatch( ( state: State ) => {
        state.dialog = {
            type: 'confirm',
            title,
            message,
            onConfirm: () => {
                store.dispatch( ( state: State ) => {
                    state.dialog    =   {};
                });
                
                onConfirm();
            }
        }
    });
}