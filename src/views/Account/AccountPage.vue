<template>
  <ion-page class="account-page">
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button
            defaultHref="tabs/tab4"
            mode="ios"
            text=""
          ></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center"> Cuenta </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="section">
        <div class="title">
          <h3 class="ion-text-wrap">
            Quienes pueden ver tu información personal
          </h3>
          <p class="ion-text-wrap">
            En esta sección puedes habilitar los permisos para que otras
            personas queden restringidos
          </p>
        </div>
        <div class="detail">
          <h4>Ultima conexión</h4>
          <h5>Solo yo</h5>
        </div>
        <div class="detail">
          <h4>Avatar del perfil</h4>
          <h5>Cualquiera</h5>
        </div>
        <div class="detail">
          <h4>Sobre ti</h4>
          <h5>Cualquiera</h5>
        </div>

        <div class="detail flex al-start jc-between">
          <div class="left">
            <h4>Conformación de lectura</h4>
            <h6 class="ion-text-wrap">
              Si tienes habilitada esta opción, las demás personas no podrán ver
              cuando leas sus mensajes
            </h6>
          </div>
          <ion-toggle checked mode="md"></ion-toggle>
        </div>
      </div>

      <div class="section">
        <div class="detail" @click="setOpen(true)">
          <h4>Cambiar contraseña</h4>
          <h5>*******</h5>
        </div>

        <div class="detail">
          <h4>Tiempo de inactividad</h4>
          <div class="wrapper flex al-center">
            <ion-item lines="none">
              <ion-icon src="/public/assets/imgs/icn-time.svg" slot="start" />
              <ion-select
                mode="md"
                aria-label=""
                placeholder="1 minutos -5 minutos -10 minutos -15 minutosruit"
              >
                <ion-select-option value="1 minutos"
                  >1 minutos</ion-select-option
                >
                <ion-select-option value="5 minutos"
                  >5 minutos</ion-select-option
                >
                <ion-select-option value="10 minutos"
                  >10 minutos</ion-select-option
                >
                <ion-select-option value="15 minutos"
                  >15 minutos</ion-select-option
                >
              </ion-select>
            </ion-item>
          </div>
        </div>

        <div class="detail">
          <div class="flex al-center jc-between">
            <h4>Tiempo de borrado de mensajes</h4>
            <ion-toggle mode="md"></ion-toggle>
          </div>
          <div class="wrapper flex al-center">
            <ion-item lines="none">
              <ion-icon src="/public/assets/imgs/icn-time.svg" slot="start" />
              <ion-select
                mode="md"
                aria-label=""
                placeholder="10 minutos - 1 semana"
              >
                <ion-select-option value="1 minutos"
                  >1 minutos</ion-select-option
                >
                <ion-select-option value="5 minutos"
                  >5 minutos</ion-select-option
                >
                <ion-select-option value="10 minutos"
                  >10 minutos</ion-select-option
                >
                <ion-select-option value="15 minutos"
                  >15 minutos</ion-select-option
                >
              </ion-select>
            </ion-item>
          </div>
        </div>
      </div>

      <ion-alert
        class="custom-alert2"
        mode="md"
        :is-open="isOpen"
        header="Cambiar contraseña"
        :buttons="alertButtons"
        :inputs="alertInputs"
        @didDismiss="setOpen(false)"
      ></ion-alert>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar } from "@ionic/vue";
import "./AccountPage.scss";
import { useRouter } from "vue-router";
import { ref } from "vue";

const router = useRouter();

const isOpen = ref(false);

const alertButtons = [
  {
    text: "Cambiar",
    cssClass: "alert-button-ok",
  },
];

const alertInputs = [
  {
    name: "Contraseña anterior",
    placeholder: "123",
    type: "number",
  },
  {
    name: "Nueva contraseña",
    placeholder: "123",
    type: "number",
  },
  {
    name: "Confirmar nueva contraseña",
    placeholder: "123",
    type: "number",
  },
];

const setOpen = (state: boolean) => {
  isOpen.value = state;
};
</script>
