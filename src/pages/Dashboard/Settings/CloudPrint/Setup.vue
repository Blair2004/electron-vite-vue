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
import Toast from "@/lib/toast";

const fields: FieldInterface[]    =   [
    {
        type: "select",
        label: "Cloud Print Setup",
        name: "cloud_print_setup",
        options: [],
        description: "Define the monitored cloud print setup.",
    }, 
]

const totalParts     =   sliceArray( fields, 2 );

/**
 * create two slices of the array
 * fields
 */

function sliceArray( array: any[], numSlices: number ) {
    const sliceSize = Math.ceil(array.length / numSlices);
    const slices = [];

    for (let i = 0; i < array.length; i += sliceSize) {
        slices.push(array.slice(i, i + sliceSize));
    }

    return slices;
}

function saveSettings() {
    fields.forEach( field => {
        if ( field.type === "switch" && field.value === undefined ) {
            field.value = false;
        }
    });

    Toast.message( 'Operation Successful', 'The settings were saved!' );
}
</script>