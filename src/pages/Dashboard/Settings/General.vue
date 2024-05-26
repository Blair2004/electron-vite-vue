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
import Button from '@/components/ui/button/Button.vue';
import { Field as FieldInterface } from '@/interfaces/Field';

const fields: FieldInterface[]    =   [
    {
        type: "number",
        label: "Default Port",
        name: "server_port",
        description: "Port should be between 80 and 9999. For invalid port, 3236 will be used by default.",
    }, {
        type: "switch",
        label: "SSL Enabled",
        description: "While using local printing, you might want to use SSL on secured remote website.",
        name: "ssl_enabled",
        options: [
            {
                label: "Yes",
                value: "yes",
            }, {
                label: "No", 
                value: "no"
            }
        ]
    }, {
        type: "switch",
        label: "Auto Start",
        description: "When accessing the dashboard, server will automatically starts.",
        name: "autostart",
        options: [
            {
                label: "Yes",
                value: "yes",
            }, {
                label: "No", 
                value: "no"
            }
        ]
    }, {
        type: "switch",
        label: "Run On Windows Startup",
        description: "When windows starts, Nexo Print Server starts minimized.",
        name: "run_on_windows_startup",
        options: [
            {
                label: "Yes",
                value: "yes",
            }, {
                label: "No", 
                value: "no"
            }
        ]
    }, {
        type: "switch",
        label: "Cloud Print Enabled",
        description: "Nexo Print Server will connect to Nexo Platform to retreive print jobs. An internet connexion is required.",
        name: "cloud_print_enabled",
        options: [
            {
                label: "Yes",
                value: "yes",
            }, {
                label: "No", 
                value: "no"
            }
        ]
    }
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