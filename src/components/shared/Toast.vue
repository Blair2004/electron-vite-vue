<template>
    <Toaster />
</template>
<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'vue-sonner';
import { State } from '@/interfaces/State';
import { store } from "@/store";
import { onUnmounted } from 'vue';

const subscriber    =   store.observable.subscribe( ( value: State ) => {
    if ( value.type === 'toast' ) {
        switch( value.data.type ) {
            case 'error':
                toast.error( value.data.title, value.data );
                break;
            case 'success':
                toast.success( value.data.title, value.data );
                break;
            case 'warning':
                toast.warning( value.data.title, value.data );
                break;
            default:
                toast( value.data.title, value.data );
        }
    }
});

onUnmounted( () => {
    subscriber.unsubscribe();
})
</script>
    