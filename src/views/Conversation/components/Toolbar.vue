<template>
  <ion-toolbar v-if="currentConversation">
    <ion-buttons slot="start">
      <ion-back-button defaultHref="tabs/tab1" mode="ios" text=""></ion-back-button>
    </ion-buttons>
    <ion-buttons slot="start">
      <ion-item lines="none" @click="goProfile">
        <ion-avatar slot="start">
          <img :src="currentConversation.label_image" alt="" />
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

  </ion-toolbar>
</template>

<script setup lang="ts">
import { IonPage,IonPopover, IonHeader, IonToolbar } from '@ionic/vue';
import { attachOutline, call, checkmarkDone, ellipsisVertical, mic, searchOutline, send, videocam } from 'ionicons/icons';
import { Ref, ref } from 'vue';
import { useCurrentConversation,ICurrentConversation } from '../store/current-conversation.store';
const { getCurrentConversation } = useCurrentConversation(); 
const currentConversation : Ref<ICurrentConversation|undefined> = ref();

let setCurrentConversation=()=>{
    currentConversation.value=getCurrentConversation();
}
setCurrentConversation();
</script>
