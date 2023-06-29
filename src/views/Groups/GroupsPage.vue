<template>
  <ion-page class="groups-page">
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title>
          Grupos
        </ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear">
            <ion-icon aria-hidden="true" :icon="searchOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="the-list">
        <ion-item>
          <ion-avatar slot="start">
            <img src="assets/imgs/man.png" alt="">
          </ion-avatar>
          <ion-label>
            <h3>123456 <span>5m</span></h3>
            <p>Roman : Hello</p>
          </ion-label>
          <ion-badge slot="end" class="flex al-center jc-center">
            3
          </ion-badge>
        </ion-item>
      </div>
      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button @click="goNewGroup">
          <ion-icon src="assets/imgs/icn-addperson.svg"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script  setup lang="ts">
import { IonPage, IonHeader, IonToolbar } from '@ionic/vue';
import { searchOutline, } from 'ionicons/icons';
import './GroupsPage.scss';
import { useRouter } from 'vue-router';
import { ref } from 'vue';


const router = useRouter();

const goNewGroup =()  => {
     router.replace('/newgroup1');
   }

</script>
