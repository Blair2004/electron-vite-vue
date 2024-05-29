<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useRouter } from 'vue-router';

import { onUnmounted, ref } from 'vue';
import { Label } from '@/components/ui/label';
import toast from '@/lib/toast';
import { store } from '@/store';
import { State } from '@/interfaces/State';
import { PieChartIcon } from "@radix-icons/vue";
import { IpcRenderer } from 'electron';

declare const ipcRenderer: IpcRenderer;

const router = useRouter();
const client_id = ref('');
const client_secret = ref('');
const isLoading = ref( false );
let authenticationTimeout: any;

const verifyToken = async () => {
    if ( client_id.value == '' || client_secret.value == '' ) {
        return toast.error( 'Invalid Form', 'Please provide a valid App ID and App Key to proceed.' );
    }

    store.next( <State>{
        type: 'save-options',
        data: { client_id: client_id.value, client_secret: client_secret.value }
    });
    
    isLoading.value = true;
    const response  =   await ipcRenderer.invoke( 'test-credentials', { client_id: client_id.value, client_secret: client_secret.value } );

    if ( response.status === 'info' ) {
        toast.message( 'Authentication Ongoing', response.message );
    }

    /**
     * We'll stop the loading after 60 seconds
     */
    authenticationTimeout = setTimeout(() => {
        isLoading.value = false;
        toast.error( 'Authentication Timeout', 'The authentication process took too long to complete. Please try again.' );
    }, 10000 );
};

const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        const contents = e.target.result;
        try {
            const jsonData = JSON.parse(contents);

            if ( jsonData.redirect !== 'https://my.nexopos.com/nps' ) {
                return toast.error( 'Invalid Redirect', 'The provided files contains an invalid redirect value. Make sure while creating your client it redirect to "https://my.nexopos.com/nps".' );
            }

            if ( ! jsonData.client_id || ! jsonData.client_secret ) {
                return toast.error( 'Invalid File Provided', 'The provided file doesn\'t contain valid credentials.' );
            }

            client_id.value = jsonData.client_id;
            client_secret.value = jsonData.client_secret;

        } catch (error) {
            const fileField: any = document.querySelector( '#token-file' );
            fileField.value = '';
            return toast.error( 'Invalid JSON File', 'The provided file is not a valid .json file.' );
        }
    };

    reader.readAsText(file);
};

/**
 * Observable Section
 * --------------------------------------------------------
 * Subscriber to listen to options change
 * this will determine if we can go to the next page or not
 */
const subscription  =   store.observable.subscribe( async ( state: State ) => {
    /**
     * When the renderer is instructed
     * to store the options.
     */
    if ( state.type === 'store-options' ) {
        if ( state.data.access_token ) {
            router.push('/select-license');
        }
    }

    /**
     * Here we're listening to the main process response
     * We'll make sure to display just a notification
     * regarding the authentication process
     */
    if ( state.type === 'authentication-response' ) {
        if ( state.data.type === 'error' ) {
            toast.error( 'Authentication Response', state.data.message );
        } else {
            /**
             * Since the authentication is successful,
             * we'll request the main to update the options and then the above snippet
             * will execute and perform a redirection.
             */
            await ipcRenderer.invoke( 'load-options' );
            toast.message( 'Authentication Response', state.data.message );
        }
    }
});

/**
 * We're moving to the next page
 * we'll therefore unsubscribe to the store
 */
onUnmounted(() => {
    subscription.unsubscribe();
    clearTimeout( authenticationTimeout );
});

</script>
<template>
    <div class="w-full p-4 flex flex-col items-center bg-background">
        <div class="mx-auto w-56 flex items-center justify-center">
            <div class="h-32">LOGO</div>
        </div>
        <Card class="w-full md:w-2/3">
            <CardHeader>
                <CardTitle>Authenticate</CardTitle>
                <CardDescription>with my.nexopos.com</CardDescription>
            </CardHeader>
            <CardContent>
                <div class="text-sm text-center">
                    Thank you for using Nexo Print Server. In order to use the application, you need to create a Client and provide the created client credentials.
                </div>
                <br>
                <div class="text-sm text-center">
                    While creating the client, make sure the Redirect URL is "https://my.nexopos.com/nps"
                </div>
                <br>
                <div>
                    <div class="mb-2">
                        <Input v-model="client_id" placeholder="App ID" />
                    </div>
                    <div class="mb-2">
                        <Input v-model="client_secret" placeholder="Secret Secret" />
                    </div>
                </div>
                <div class="flex justify-center border-t-4 relative my-4"><span class="bg-white px-4 font-bold -top-4 absolute">OR</span></div>
                <div>
                    <div class="mb-2">
                        <div class="grid w-full items-center gap-1.5">
                            <Label for="token-file">Token File</Label>
                            <Input @change="handleFileChange( $event )" id="token-file" type="file" />
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter class="flex justify-between">
                <Button @click="verifyToken()">
                    <PieChartIcon v-if="isLoading" class="animate-spin mr-2"/> Authenticate
                </Button>
            </CardFooter>
        </Card>
    </div>
</template>