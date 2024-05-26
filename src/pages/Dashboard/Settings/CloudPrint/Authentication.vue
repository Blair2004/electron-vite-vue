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

const fields: FieldInterface[]    =   [
    {
        type: "text",
        label: "App Key",
        name: "app_key",
        description: "provide your My NexoPOS App key.",
    }, {
        type: "password",
        label: "App Secret",
        name: "app_secret",
        description: "provide your My NexoPOS App secret.",
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
    // loops fields, and for switch field with no "value"
    // attribute, we'll set the value to "false" which means disabled
    fields.forEach( field => {
        if ( field.type === "switch" && field.value === undefined ) {
            field.value = false;
        }
    });

    console.log( fields );
}
</script>