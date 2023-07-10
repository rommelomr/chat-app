<template>
  <ion-page class="profile-page">
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button
            defaultHref="/tabs/tab4"
            mode="ios"
            text=""
          ></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center"> Perfíl </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="dp-holder ion-text-center">
        <ion-avatar>
          <img :src="`/public/assets/imgs/avatar/${1}.png`" alt="" />
        </ion-avatar>
        <div
          class="btn ion-activatable flex al-center jc-center ripple-parent"
          @click="openModal"
        >
          <ion-icon src="/public/assets/imgs/icn-edit.svg"></ion-icon>
          <ion-ripple-effect type="bounded"></ion-ripple-effect>
        </div>
      </div>

      <div class="detail-holder">
        <div class="detail">
          <ion-row>
            <ion-col size="2" class="flex al-start jc-start">
              <ion-icon src="/public/assets/imgs/icn-person.svg"></ion-icon>
            </ion-col>
            <ion-col size="9" class="col">
              <p>Nombre</p>
              <h3>Pedro Gutierrez</h3>
              <h6>
                Este no es tu usuario o código, este es el nombre que verán
                visible tus contactos
              </h6>
            </ion-col>
            <ion-col size="1" class="col">
              <div
                class="btn ion-activatable flex al-center jc-center ripple-parent"
                @click="openModal"
              >
                <ion-icon src="/public/assets/imgs/icn-edit.svg"></ion-icon>
                <ion-ripple-effect type="bounded"></ion-ripple-effect>
              </div>
            </ion-col>
          </ion-row>
        </div>
        <div class="detail">
          <ion-row>
            <ion-col size="2" class="flex al-start jc-start">
              <ion-icon src="/public/assets/imgs/icn-hint.svg"></ion-icon>
            </ion-col>
            <ion-col size="9" class="col">
              <p>Sobre ti</p>
              <h6>Estoy usando esta aplicación</h6>
            </ion-col>
            <ion-col size="1" class="col">
              <div
                class="btn ion-activatable flex al-center jc-center ripple-parent"
                @click="openModal1"
              >
                <ion-icon src="/public/assets/imgs/icn-edit.svg"></ion-icon>
                <ion-ripple-effect type="bounded"></ion-ripple-effect>
              </div>
            </ion-col>
          </ion-row>
        </div>
        <div class="detail">
          <ion-row>
            <ion-col size="2" class="flex al-start jc-start">
              <ion-icon src="/public/assets/imgs/icn-group.svg"></ion-icon>
            </ion-col>
            <ion-col size="9" class="col">
              <p>Codigo</p>
              <h6>123456</h6>
            </ion-col>
          </ion-row>
        </div>
      </div>
      <ion-modal
        class="ion-modall"
        :is-open="isModalOpen"
        @dismiss="dismissModal"
      >
        <ion-content class="modall ion-padding">
          <div class="holder">
            <div class="section">
              <h3>Ingrese su nombre</h3>
              <ion-item>
                <ion-input value="Pedro guitierrez" />
              </ion-item>
              <div class="btns-holder flex al-center jc-end">
                <ion-button fill="clear" @click="dismissModal"
                  >Cancelar</ion-button
                >
                <ion-button fill="clear">Guardar</ion-button>
              </div>
            </div>
          </div>
        </ion-content>
      </ion-modal>
      <ion-modal
        class="ion-modall"
        :is-open="isModalOpen1"
        @dismiss="dismissModal1"
      >
        <ion-content class="modall ion-padding">
          <div class="holder">
            <div class="section">
              <h3>Sobre ti</h3>
              <ion-item>
                <ion-input
                  value="La vida es una sola por eso debemos compartir"
                />
              </ion-item>
              <div class="btns-holder flex al-center jc-end">
                <ion-button fill="clear" @click="dismissModal1"
                  >Cancelar</ion-button
                >
                <ion-button fill="clear">Guardar</ion-button>
              </div>
            </div>
          </div>
        </ion-content>
      </ion-modal>
    </ion-content>
    <ImageSelector />
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar } from "@ionic/vue";
import { call, camera, ellipsisVertical, send, videocam } from "ionicons/icons";
import "./ProfilePage.scss";
import { useRouter } from "vue-router";
import ImageSelector from "../Profile/AvatarSelector/index.vue";
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth.store";
let userAuth = useAuthStore().getUser();

const router = useRouter();

const isModalOpen = ref(false);
const isModalOpen1 = ref(false);

const openModal = () => {
  isModalOpen.value = true;
};

const openModal1 = () => {
  isModalOpen1.value = true;
};

const dismissModal = () => {
  isModalOpen.value = false;
};

const dismissModal1 = () => {
  isModalOpen1.value = false;
};
</script>
