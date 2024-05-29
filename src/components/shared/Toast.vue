<template>
    <Toaster />
</template>
<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'vue-sonner';
import { State } from '@/interfaces/State';
import { store } from "@/store";
import { onUnmounted } from 'vue';

/**
 * Methods
 * --------------
 */
function closeToast() {
    store.dispatch( ( state: any ) => {
        state.toast = {};
    });
}

const subscriber = store.select( ( state: State ) => state.toast ).subscribe( ( toastState ) => {
    if ( toastState && Object.keys( toastState ).length > 0 ) {
        console.log( JSON.stringify( toastState ) );
        switch( toastState.type ) {
            case 'error':
                toast.error( toastState.title, { ...toastState, ...{
                    onAutoClose: () => {
                        closeToast();
                    }
                }} );
                break;
            case 'success':
                toast.success( toastState.title, { ...toastState, ...{
                    onAutoClose: () => {
                        closeToast();
                    }
                }} );
                break;
            case 'warning':
                toast.warning( toastState.title, { ...toastState, ...{
                    onAutoClose: () => {
                        closeToast();
                    }
                }} );
                break;
            default:
                toast( toastState.title, { ...toastState, ...{
                    onAutoClose: () => {
                        closeToast();
                    }
                }} );
        }
    }
});

onUnmounted( () => {
    subscriber.unsubscribe();
})
</script>
    