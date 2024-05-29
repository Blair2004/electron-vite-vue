<template>
    <Dialog :open="shouldOpenDialog()">
        <DialogContent @pointer-down-outside="closePopup()" class="sm:max-w-[425px]">
            <Confirm v-if="dialog.type === 'confirm'" :dialog="dialog"/>
        </DialogContent>
    </Dialog>    
</template>
<script setup lang="ts">
import {
    Dialog,
    DialogContent,
} from '@/components/ui/dialog';
import { State } from '@/interfaces/State';
import { store } from '@/store';
import { Ref, onUnmounted, ref } from 'vue';
import { Dialog as DialogInterface } from "@/interfaces/Dialog";
import Confirm from './Confirm.vue';

const dialog: Ref<DialogInterface> = ref({});

const subscription = store.observable.subscribe( ( state: State ) => {
    if ( state.type === 'dialog' ) {
        dialog.value = <DialogInterface>state.data;
    }
});

/**
 * Methods Section
 * ----------------
 */
function shouldOpenDialog(): boolean {
    return dialog.value.type !== undefined;
} 

function closePopup() {
    store.next({
        type: 'dialog',
        data: false
    });
}

/**
 * Hook Section
 * ----------------
 */
onUnmounted( () => {
    subscription.unsubscribe();
});
</script>