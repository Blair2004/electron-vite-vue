<template>
    <h3 class="font-bold text-lg">Nexo Print Server v{{ version }}</h3>
    <p class="py-2 text-sm">
        You're using a free version of Nexo Print Server. This software is a trademark developped and maintained by Nexo Solution LLC.
    </p>
    <p class="py-2 text-sm">
        Unlock the full version of Nexo Print Server to enjoy a full experience of printing using NexoPOS:
    </p>
    <ul>
        <li class="flex"><ArrowRightIcon class="mr-1"/> Fast Cloud Printing</li>
        <li class="flex"><ArrowRightIcon class="mr-1"/> Start With Windows</li>
        <li class="flex"><ArrowRightIcon class="mr-1"/> Auto Start</li>
        <li class="flex"><ArrowRightIcon class="mr-1"/> Premium Support</li>
    </ul>
    <div class="flex justify-end">
        <Button @click="upgrade()">Upgrade</Button>
    </div>
</template>
<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import { confirm } from '@/lib/confirm';
import toast from '@/lib/toast';
import { IpcRenderer } from 'electron';
import { ArrowRightIcon } from 'lucide-vue-next';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

declare const ipcRenderer: IpcRenderer;

const version = ref<string | null>(null);
const router = useRouter();

function upgrade() {
    return confirm(
        'Confirm Your Action',
        'By upgrading, the demo mode will be disabled. Proceed ?',
        async () => {
            try {
                const response = await ipcRenderer.invoke( 'force-disconnect-license' );
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
                
            } catch( exception: any ) {
                toast.error( 'An error occured', exception.toString() );
            }
        }
    )
}

onMounted( async () => {
    version.value = await ipcRenderer.invoke('get-version');
});
</script>