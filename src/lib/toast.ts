import { State } from "@/interfaces/State";
import { store } from "@/store";
import { Toast as ToastInterface } from "@/interfaces/Toast";
import { h } from "vue";
import ToastAction from "@/components/ui/toast/ToastAction.vue";

class Toast {
    message( title: string, description: string, callback = () => {}, actionLabel?: string ) {
        const options: any =   {};

        if ( actionLabel ) {
            options.action  =   h( ToastAction, {
                altText: actionLabel
            }, {
                default: () => {
                    callback();
                }
            });
        }

        store.dispatch( ( state: State ) => {
            state.toast = <ToastInterface>{ title, description, ...options }
        });
    }

    error( title: string, description: string, callback = () => {}, actionLabel?: string ) {
        const options: any =   {
            variant: 'destructive'
        };

        if ( actionLabel ) {
            options.action  =   h( ToastAction, {
                altText: actionLabel
            }, {
                default: () => {
                    callback();
                }
            });
        }

        store.dispatch( ( state: State ) => {
            state.toast = <ToastInterface>{ title, description, ...options }
        });
    }
}

export default new Toast;