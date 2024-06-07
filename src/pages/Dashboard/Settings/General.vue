<template>
    <div class="-mx-2 flex flex-col md:flex-row">
        <div class="px-2" v-for="sectionFields of totalParts">
            <Field :field="field" v-for="field of filterFields( sectionFields )"/>
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
import { Options } from '@/interfaces/Options';
import { State } from '@/interfaces/State';
import toast from '@/lib/toast';
import { store } from '@/store';
import { IpcRenderer, ipcMain } from 'electron';
import { Ref, onUnmounted, ref } from 'vue';

declare const ipcRenderer: IpcRenderer;

const options: Ref<Options>     =   ref({});
const subscription = store.select( ( state:State ) => state.options ).subscribe( ( storeOptions: Options ) => {
    options.value = storeOptions;
});

const fields: Ref<FieldInterface[]>    =   ref([
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
                value: true,
            }, {
                label: "No", 
                value: false
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
                value: true,
            }, {
                label: "No", 
                value: false
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
                value: true,
            }, {
                label: "No", 
                value: false
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
                value: true,
            }, {
                label: "No", 
                value: false
            }
        ]
    }
]);

const totalParts     =   sliceArray( fields.value, 2 );

/**
 * Methods
 * --------------
 */
function sliceArray( array: any[], numSlices: number ) {
    const sliceSize = Math.ceil(array.length / numSlices);
    const slices = [];

    for (let i = 0; i < array.length; i += sliceSize) {
        slices.push(array.slice(i, i + sliceSize));
    }

    return slices;
}

function filterFields( fields: FieldInterface[] ) {
    return fields.map( field => {
        if ( options.value.app_status === 'demo' && [ 
            'run_on_windows_startup',
            'cloud_print_enabled',
            'autostart'
        ].includes( field.name ) ) {
            field.disabled = true;
        }

        field.value = (<any>options.value)[field.name];

        return field;
    });
}

async function saveSettings() {
    // loops fields, and for switch field with no "value"
    // attribute, we'll set the value to "false" which means disabled
    fields.value.forEach( field => {
        if ( field.type === "switch" && field.value === undefined ) {
            field.value = false;
        }
    });

    const data: {[key: string]: any}  =   {}
    
    fields.value.forEach( field => {
        data[field.name] = field.value;
    });

    try {
        const response = await ipcRenderer.invoke( 'save-options', data );
        toast.message( 'Operation Successful', response.message );
    } catch( exception ) {
        toast.error( 'Operation Failed', 'Unable to save the settings. If the issue persist, please contact the support.' );
    }
}

/**
 * Hooks
 * --------------------
 */
onUnmounted( () => {
    subscription.unsubscribe();
});
</script>