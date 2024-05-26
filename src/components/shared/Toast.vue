<template>
    <Toaster />
</template>
<script setup lang="ts">
import Toaster from '@/components/ui/toast/Toaster.vue';
import { useToast } from '@/components/ui/toast/use-toast';
import { State } from '@/interfaces/State';
import { store } from "@/store";
import { ref, onUnmounted } from 'vue';

const { toast }     =   useToast();

const subscriber    =   store.observable.subscribe( ( value: State ) => {
    if ( value.type === 'toast' ) {
        toast( value.data );
    }
});

onUnmounted( () => {
    subscriber.unsubscribe();
})
</script>
    