<template>
  <ion-toolbar v-if="currentConversation">
    <ion-buttons slot="start">
      <ion-back-button defaultHref="/tabs/tab2" mode="ios" text=""></ion-back-button>
    </ion-buttons>
    <ion-buttons slot="start">
      <ion-item lines="none" @click="open_modal = true">
        <ion-avatar slot="start" >
         <img :src="`/public/assets/imgs/avatar/${currentConversation.label_image??1}.png`"/>
        </ion-avatar>
        <ion-label>
          <h3>{{ currentConversation.label }}</h3>
          <p>Online</p>
        </ion-label>
      </ion-item>
    </ion-buttons>
    <ion-buttons slot="end">
      <ion-button id="end-btn">
        <ion-icon aria-hidden="true" :icon="call" />
      </ion-button>
    </ion-buttons>
    <ion-buttons slot="end">
      <ion-button id="end-btn">
        <ion-icon aria-hidden="true" :icon="videocam" />
      </ion-button>
    </ion-buttons>
     
  
    <ModalGeneric :show="open_modal" :title="currentConversation.label??''" @onClose="open_modal = false">
      <Details />
    </ModalGeneric>
  </ion-toolbar>
</template>

<script setup lang="ts">
import { IonPage,IonPopover,IonButtons, IonButton, IonModal, IonHeader, IonContent, IonToolbar, IonTitle } from '@ionic/vue';
import { attachOutline, call, checkmarkDone, ellipsisVertical, mic, searchOutline, send, videocam } from 'ionicons/icons';
import { Ref, ref } from 'vue';
import { useCurrentConversation,ICurrentConversation } from '../store/current-conversation.store';
import ModalGeneric from '@/components/ModalGeneric.vue'
import Details from './Details.vue'
const { getCurrentConversation } = useCurrentConversation(); 
const currentConversation : Ref<ICurrentConversation|undefined> = ref();
const modalRef = ref(null);
let open_modal = ref(false)
let onButtonPress=()=>{
  alert("hola")
}
const isOpen = ref(true);

const openModal = () => {
  //@ts-ignore
  modalRef.value.present();
};

const closeModal = () => {
  //@ts-ignore
  modalRef.value.present();
};

let setCurrentConversation=()=>{
    currentConversation.value=getCurrentConversation();
}
setCurrentConversation();
</script>
