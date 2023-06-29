<template>
  <ion-page class="chat-page">
    <ion-header class="ion-no-border">
      <ion-toolbar >
          <ion-buttons slot="start">
          <ion-back-button defaultHref="tabs/tab4" mode="ios" text=""></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">Chat</ion-title>
        <ion-buttons slot="end">
          <ion-button solt="icon-only">
            <ion-icon aria-hidden="true" :icon="searchOutline" />
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button solt="icon-only">
            <ion-icon aria-hidden="true" :icon="personAddOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="the-list">
        <ion-item @click="goConversation">
          <ion-avatar slot="start">
            <img src="assets/imgs/user.png" alt="">
          </ion-avatar>
          <ion-label>
            <h3>123456 <span>5m</span></h3>
            <p>Hola como estas</p>
          </ion-label>
          <ion-badge slot="end" class="flex al-center jc-center">
            3
          </ion-badge>
        </ion-item>
        <ion-item @click="goConversation">
          <ion-avatar slot="start">
            <img src="assets/imgs/user.png" alt="">
          </ion-avatar>
          <ion-label>
            <h3>123456 <span>5m</span></h3>
           <div class="flex al-center">
            <img src="assets/imgs/icn-attachment.svg" alt="">
            <p>Hola como estas</p>
           </div>
          </ion-label>
          <ion-badge slot="end" class="flex al-center jc-center">
            3
          </ion-badge>
        </ion-item>
        <ion-item >
          <ion-avatar slot="start">
            <img src="assets/imgs/user.png" alt="">
          </ion-avatar>
          <ion-label>
            <h3>123456 <span>5m</span></h3>
            <p>Hola como estas</p>
          </ion-label>
          <ion-badge slot="end" class="flex al-center jc-center">
            3
          </ion-badge>
        </ion-item>
        <ion-item >
          <ion-avatar slot="start">
            <img src="assets/imgs/user.png" alt="">
          </ion-avatar>
          <ion-label>
            <h3>123456 <span>5m</span></h3>
           <div class="flex al-center">
            <img src="assets/imgs/icn-attachment.svg" alt="">
            <p>Hola como estas</p>
           </div>
          </ion-label>
          <ion-badge slot="end" class="flex al-center jc-center">
            3
          </ion-badge>
        </ion-item>
        <ion-item >
          <ion-avatar slot="start">
            <img src="assets/imgs/user.png" alt="">
          </ion-avatar>
          <ion-label>
            <h3>123456 <span>5m</span></h3>
            <p>Hola como estas</p>
          </ion-label>
          <ion-badge slot="end" class="flex al-center jc-center">
            3
          </ion-badge>
        </ion-item>
        <ion-item >
          <ion-avatar slot="start">
            <img src="assets/imgs/user.png" alt="">
          </ion-avatar>
          <ion-label>
            <h3>123456 <span>5m</span></h3>
           <div class="flex al-center">
            <img src="assets/imgs/icn-attachment.svg" alt="">
            <p>Hola como estas</p>
           </div>
          </ion-label>
          <ion-badge slot="end" class="flex al-center jc-center">
            3
          </ion-badge>
        </ion-item>
      </div>

      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button>
          <ion-icon src="assets/imgs/icn-chat.svg"></ion-icon>
        </ion-fab-button>

      </ion-fab>
  
      
    </ion-content>
    
  </ion-page>
</template>

<script setup  lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import './ChatPage.scss';
import { personAddOutline, searchOutline } from 'ionicons/icons';
import { useRouter } from 'vue-router';

const router = useRouter();

const goConversation =()  => {
     router.replace('/conversation');
   }

</script>
