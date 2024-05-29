<template>
    <DialogHeader>
        <DialogTitle>{{ dialog.title }}</DialogTitle>
        <DialogDescription>
            {{ dialog.message }}
        </DialogDescription>
    </DialogHeader>
    <DialogFooter>
        <div class="flex -mx-2 justify-end">
            <div class="flex px-2">
                <Button variant="secondary"ype="submit" @click="dialog.onConfirm()">
                    Confirm
                </Button>
            </div>
            <div class="flex px-2">
                <Button variant="destructive" type="submit" @click="closeDialog()">
                    Cancel
                </Button>
            </div>
        </div>
    </DialogFooter>
</template>
<script setup lang="ts">
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { store } from '@/store';
import { State } from '@/interfaces/State';
import { Dialog as DialogInterface } from "@/interfaces/Dialog";
defineProps<{
    dialog: DialogInterface
}>();

function closeDialog() {
    store.dispatch( ( state: State ) => {
        state.dialog = {};
    });
}
</script>