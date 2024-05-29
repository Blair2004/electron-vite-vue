<template>
    <Dialog :open="shouldOpenDialog()">
        <DialogContent @pointer-down-outside="closePopup()" @escape-key-down="closePopup()" class="sm:max-w-[425px]">
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

const subscriber = store.select( ( state: State ) => state.dialog ).subscribe( ( dialogState ) => {
    dialog.value   =   dialogState;
});


/**
 * Methods Section
 * ----------------
 */
function shouldOpenDialog(): boolean {
    return dialog.value && dialog.value.type !== undefined;
} 

function closePopup() {
    store.dispatch( ( state: any ) => {
        state.dialog = {};
    });
}

/**
 * Hook Section
 * ----------------
 */
onUnmounted( () => {
    subscriber.unsubscribe();
});
</script>