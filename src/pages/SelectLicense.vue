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

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { InfoCircledIcon, ReloadIcon } from "@radix-icons/vue";
import { Input } from '@/components/ui/input';
import { useRouter } from 'vue-router';
import { Ref, onMounted, ref } from 'vue';
import { PieChartIcon } from "@radix-icons/vue";
import { IpcRenderer } from 'electron';
import { AsyncResponse } from '@/interfaces/AsyncResponse';
import toast from '@/lib/toast';
import Alert from '@/components/ui/alert/Alert.vue';
import AlertTitle from '@/components/ui/alert/AlertTitle.vue';
import AlertDescription from '@/components/ui/alert/AlertDescription.vue';

declare const ipcRenderer: IpcRenderer;

const router    =   useRouter();
const hasLoadedLicenses     =   ref( false );
const licenses  =   ref([]);
const isLoadingLicense = ref( false );
const isAssigingLicense = ref( false );
const selectedLicenseId: Ref<string | null> = ref( null );

async function assignLicense() {

    if ( selectedLicenseId.value === null ) {
        return toast.error( 'No License Selected', 'Please select a license to continue.' );
    }

    isAssigingLicense.value = true;
    const response: AsyncResponse  =   await ipcRenderer.invoke( 'select-license', { license: selectedLicenseId.value } );

    /**
     * We need to reload the options as this will be used
     * on the next middleware
     */
    await ipcRenderer.invoke( 'load-options' );

    /**
     * We're stopping the spinner
     */
    isAssigingLicense.value = false;

    if ( response.status === 'error' ) {
        return toast.error( 'An Error Occured', response.message );
    } else {
        /**
         * All's good we might navigate to the dashboard
         */
        return router.push( '/dashboard' );
    }
}

async function enableDemo() {
    /**
     * no response is expected. We do use await to make sure
     * the option "app_status" is set to demo.
     */
    await ipcRenderer.invoke( 'start-demo' );

    return router.push( '/dashboard' );
}

async function loadLicenses() {
    isLoadingLicense.value = true;
    const response = (<AsyncResponse>await ipcRenderer.invoke('user-licenses'));
    isLoadingLicense.value = false;

    if ( response.status === 'error' ) {
        toast.error( 'An Error Occured', 'We\'re unable to fetch your licenses. If the issue persist contact the support.' );
        return;
    }

    if ( response.status === 'success' && response.data.length === 0 ) {
        toast.message( 'No License Found', 'You can start using the free version of Nexo Print Server right away.' );
    }

    hasLoadedLicenses.value = true;
    licenses.value = response.data;
}

onMounted( async() => {
    loadLicenses();
});

</script>
<template>
    <div class="w-full p-4 flex flex-col items-center bg-background">
        <div class="mx-auto w-56 flex items-center justify-center">
            <img src="@/assets/images/logo.png" alt="Nexo Print Server" class="p-10">
        </div>
        <Card class="w-full md:w-2/3">
            <CardHeader>
                <CardTitle>Activate Your License</CardTitle>
                <CardDescription>assign a valid license to this installation.</CardDescription>
            </CardHeader>
            <CardContent>
                <div class="text-sm text-justify">
                    Now that we're able to connect to your account, you need to assign the license that you want to use with Nexo Print Server.
                </div>
                <br>
                <Alert v-if="licenses.length == 0 && hasLoadedLicenses">
                    <InfoCircledIcon class="h-4 w-4" />
                    <AlertTitle>No License Were Found!</AlertTitle>
                    <AlertDescription>
                    It appears that you don't have any license available on your account. You can start using the free version of Nexo Print Server right away. 
                    <br>
                    <br>
                    If you believe there is a mistake, please contact the support.
                    </AlertDescription>
                </Alert>
                <div>
                    <div class="mb-2">
                        <Select v-model="selectedLicenseId" v-if="licenses.length > 0 && hasLoadedLicenses">
                            <SelectTrigger>
                                <SelectValue placeholder="Assign A License" />
                                </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Assign A License</SelectLabel>
                                    <SelectItem v-for="license of licenses" :value="license.id.toString()">
                                    {{ license.name }} ({{ license.supported_until }})<br>
                                    <small>{{ license.license }}</small>
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <br>
                        <div class="flex">
                            <Button v-if="licenses.length > 0 && hasLoadedLicenses" @click="assignLicense()" class="mr-2">
                                <PieChartIcon v-if="isAssigingLicense" class="animate-spin mr-2"/>
                                Select License
                            </Button>
                            <Button @click="enableDemo()" class="mr-2">
                                Start Demo
                            </Button>                        
                            <Button @click="loadLicenses()" class="mr-2">
                                <ReloadIcon :class="isLoadingLicense ? 'animate-spin' : ''" class="mr-2"/> Reload
                            </Button>                        
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
</template>