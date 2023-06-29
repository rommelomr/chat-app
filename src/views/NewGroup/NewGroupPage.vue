<template>
  <ion-page class="newgroup-page">
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="newgroup1" mode="ios" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>
          Nuevo grupo
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
     <div class="top-btn">
      <div class="btn ion-activatable flex al-center jc-center ripple-parent">
        <ion-icon aria-hidden="true" :icon="camera" />
        <ion-ripple-effect type="bounded"></ion-ripple-effect>
      </div>
     </div>
     <div class="the-form">
      <div class="input-item">
        <ion-item lines="none">
          <div class="flex al-center jc-center" slot="start">
            <img src="assets/imgs/icn-group.svg" alt="">
          </div>
          <ion-input placeholder="Nombre del grupo" />
        </ion-item>
      </div>
      <div class="input-item">
        <ion-item lines="none">
          <div class="flex al-center jc-center" slot="start">
            <img src="assets/imgs/icn-des.svg" alt="">
          </div>
          <ion-input placeholder="Nombre del grupo" />
        </ion-item>
      </div>
     </div>
     <ion-fab slot="fixed" vertical="bottom" horizontal="end">
      <ion-fab-button >
        <ion-icon aria-hidden="true" :icon="arrowForward" />
      </ion-fab-button>
    </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script  setup lang="ts">
import { IonPage, IonHeader, IonToolbar } from '@ionic/vue';
import { arrowForward, camera, searchOutline, } from 'ionicons/icons';
import './NewGroupPage.scss';
import { useRouter } from 'vue-router';
import { ref } from 'vue';


const router = useRouter();

const goProfile =()  => {
     router.replace('/profile');
   }

</script>
