<template>
  <ion-page class="newgroup-page">
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/chat" mode="ios" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>
          NewGroupList
        </ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear">
            <ion-icon aria-hidden="true" :icon="searchOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
    </ion-content>
  </ion-page>
</template>

<script  setup lang="ts">
import { IonPage, IonHeader, IonToolbar } from '@ionic/vue';
import { searchOutline, } from 'ionicons/icons';
import './NewGroupListPage.scss';
import { useRouter } from 'vue-router';
import { ref } from 'vue';


const router = useRouter();

const goProfile =()  => {
     router.replace('/profile');
   }

</script>
