<template>
    <h2 class="font-bold text-xl">Nexo Print Server</h2>
    <p class="mb-2">
        You're using a full version Nexo Print Server <strong>{{version}}</strong>, a printing software designed by Nexo Solutions LLC for NexoPOS.
    </p>
    <div class="flex -mx-2">
        <div class="px-2">
            <Button @click="disconnectLicense()">Disconnect License</Button>
        </div>
        <div class="px-2" v-if="options.allow_force_disconnect">
            <Button variant="destructive" @click="forceDisconnect()">Force Disconnect</Button>
        </div>
    </div>
</template>
<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import { State } from '@/interfaces/State';
import { confirm } from '@/lib/confirm';
import toast from '@/lib/toast';
import { store } from '@/store';
import { IpcRenderer } from 'electron';
import { Ref, onMounted, onUnmounted, ref } from 'vue';
import { Options } from '@/interfaces/Options';
import { useRouter } from 'vue-router';

declare const ipcRenderer: IpcRenderer

const version = ref('');
const options: Ref<Options> = ref({});
const router = useRouter();

const subscription = store.getState$().subscribe( (state: State) => {
    options.value = state.options;
});

/**
 * Method Section
 * ---------------
 */
function disconnectLicense() {
    return confirm(
        'Confirm Your Action',
        'Do you want to disconnect your license ?',
        async () => {
            try {
                const response = await ipcRenderer.invoke( 'disconnect-license' );
                if ( response.status === 'success' ) {
                    /**
                     * This will be triggered after all store.dispatch call.
                     */
                    toast.message( 'License disconnected', response.message );
                    
                    router.push('/');

                    return;
                } else {
                    toast.error( 'An error occured', response.message );
                }
                
            } catch( exception ) {
                toast.error( 'An error occured', exception.toString() );
            }
        }
    )
}

function forceDisconnect() {
    return confirm(
        'Attention Required',
        'If you force-disconnect a license, it will remain active and you won\'t be able to use it until it\'s manually disabled by us. Are you sure you want to proceed ?',
        async () => {
            try {
                const response = await ipcRenderer.invoke( 'force-disconnect-license' );

                if ( response.status === 'success' ) {
                    toast.message( 'License disconnected', 'Your license has been successfully disconnected' );
                    router.push('/');
                    return;
                } else {
                    toast.error( 'An error occured', response.message );
                }
                
            } catch( exception ) {
                toast.error( 'An error occured', exception.toString() );
            }
        }
    )
}

/**
 * Hooks Sections
 * ----------------
 */

onMounted(() => {
    ipcRenderer.invoke('get-version').then((v) => {
        version.value = v;
    })
}); 

onUnmounted(() => {
    subscription.unsubscribe();
});

</script>