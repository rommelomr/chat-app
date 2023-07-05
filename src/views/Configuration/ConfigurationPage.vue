<template>
  <ion-page class="configuration-page">
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button
            defaultHref="chat"
            mode="ios"
            text=""
          ></ion-back-button>
        </ion-buttons>
        <ion-title> Configuración </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding-top">
      <div class="profile-holder">
        <ion-item lines="none" @click="goProfile">
          <ion-avatar slot="start">
            <img src="public/assets/imgs/man.png" alt="" />
          </ion-avatar>
          <ion-label>
            <h3>123456</h3>
            <p class="ion-text-wrap">
              La vida es mas que buena y aparte de eso tenemos cosas en común
            </p>
          </ion-label>
        </ion-item>
      </div>

      <div class="the-list">
        <div class="section">
          <ion-item lines="none" @click="goAccount">
            <ion-icon src="public/assets/imgs/icn-key.svg" slot="start" />
            <ion-label>
              <h3>Cuenta</h3>
              <p class="ion-text-wrap">Configura la cuenta de tu cuenta</p>
            </ion-label>
          </ion-item>
          <ion-item lines="none">
            <ion-icon
              src="public/assets/imgs/icn-notification.svg"
              slot="start"
            />
            <ion-label>
              <h3>Notificaciones</h3>
              <p class="ion-text-wrap">Configura las notificaciones del chat</p>
            </ion-label>
          </ion-item>
        </div>
        <ion-item lines="none">
          <ion-icon src="public/assets/imgs/icn-group.svg" slot="start" />
          <ion-label>
            <h3>Invitar a un amigo</h3>
          </ion-label>
        </ion-item>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar } from "@ionic/vue";
import "./ConfigurationPage.scss";
import { useRouter } from "vue-router";
import { ref } from "vue";

const router = useRouter();

const goProfile = () => {
  router.replace("/profile");
};

const goAccount = () => {
  router.replace("/Account");
};
</script>
