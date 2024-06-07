<template>
    <div class="-mx-2 flex flex-col md:flex-row">
        <div class="px-2" v-for="sectionFields of totalParts">
            <Field :field="field" v-for="field of sectionFields"/>
        </div>
    </div>
    <div class="flex justify-end">
        <Button @click="saveSettings()">Save Settings</Button>
    </div>
</template>
<script setup lang="ts">
import Field from '@/components/Field.vue';
import { Button } from '@/components/ui/button';
import { Field as FieldInterface } from '@/interfaces/Field';
import { Options } from '@/interfaces/Options';
import { State } from '@/interfaces/State';
import toast from '@/lib/toast';
import Toast from "@/lib/toast";
import { extractFields } from '@/lib/utils';
import { store } from '@/store';
import { IpcRenderer } from 'electron';
import { Ref, onMounted, onUnmounted, ref } from 'vue';

declare const ipcRenderer: IpcRenderer;

const fields: Ref<FieldInterface[]>    =   ref([
    {
        type: "select",
        label: "Cloud Print Setup",
        name: "cloud_print_setup",
        options: [],
        description: "Define the monitored cloud print setup.",
    }, 
]);

const subscriber = store.select( ( state: State ) => state.options ).subscribe( ( options: Options) => {
    fields.value.forEach( field => field.value = (<any>options)[field.name] );
});

const totalParts     =   sliceArray( fields.value, 2 );

/**
 * Methods:
 * --------------------
 */
function sliceArray( array: any[], numSlices: number ) {
    const sliceSize = Math.ceil(array.length / numSlices);
    const slices = [];

    for (let i = 0; i < array.length; i += sliceSize) {
        slices.push(array.slice(i, i + sliceSize));
    }

    return slices;
}

async function saveSettings() {
    fields.value.forEach( field => {
        if ( field.type === "switch" && field.value === undefined ) {
            field.value = false;
        }
    });

    Toast.message( 'Operation Successful', 'The settings were saved!' );

    const form  =   extractFields( fields.value );

    await ipcRenderer.invoke( 'save-options', form );
}

/**
 * Hooks:
 * --------------------
 */
onMounted( async () => {
    try {
        const printSetups   =   await ipcRenderer.invoke( 'get-print-setups' );
        fields.value[0].options = printSetups.map( (setup: any) => ({ label: setup.name, value: setup.id.toString() }) );
    } catch (error: any) {
        toast.error( 'An Error Occured', error.message );
    }   
});

onUnmounted( () => {
    subscriber.unsubscribe();
});
</script>