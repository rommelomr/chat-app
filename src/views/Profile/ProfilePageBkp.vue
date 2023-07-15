<template>
  <ion-page class="profile-page">
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button
            defaultHref="/tabs/tab1"
            mode="ios"
            text=""
          ></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center"> Perfíl </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="dp-holder ion-text-center">
        <ion-avatar v-if="profile && profile.photo">
          <img
            :src="`/public/assets/imgs/avatar/${profile.photo}.png`"
            alt=""
          />
        </ion-avatar>
        <div
          class="btn ion-activatable flex al-center jc-center ripple-parent"
          @click="toggleModal"
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

    <Modal :show="recording" :uri="uri" @onCloseModal="toggleModal" />
  </ion-page>
</template>

<script setup lang="ts">
import Modal from "./AvatarSelector/ModalAvatar.vue";
import { IonPage, IonHeader, IonToolbar } from "@ionic/vue";
import {
  call,
  camera,
  ellipsisVertical,
  send,
  videocam,
  close,
} from "ionicons/icons";
import "./ProfilePage.scss";
import { useRouter } from "vue-router";
import { Ref, onMounted, ref } from "vue";
import { useAuthStore } from "@/stores/auth.store";

import { supabase } from "@/utils/SupabaseClient";

import { useAppStore } from "@/stores/app-store";
const app_store = useAppStore();

let userAuth = useAuthStore().getUser();
let auth = useAuthStore();
let profile: any = ref({
  created_at: "",
  last_name: null,
  auth_id: "",
  name: "",
  deleted_at: "",
  photo: "1",
  aux_photo: 1,
});
const recording = ref(false);
const uri: Ref<string> = ref("");
const toggleModal = (e: any) => {
  console.log(e);
  recording.value = !recording.value;
  changeAvatar(e.id.id);
};
const router = useRouter();

const changeAvatar = async (id: number) => {
  app_store.setAppIsLoading(true);
  let { data, error } = await supabase
    .from("people")
    .update({
      photo: id,
    })
    .eq("auth_id", userAuth.id)
    .select("*");
  app_store.setAppIsLoading(false);
  profile.value = await auth.getProfile();
};

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
onMounted(async () => {
  profile.value = await auth.getProfile();
});
</script>
<style>
ion-modal {
  --height: 90%;
  --border-radius: 16px;
  --box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -4px rgb(0 0 0 / 0.1);
}

ion-modal::part(backdrop) {
  background: rgba(209, 213, 219);
  opacity: 1;
}

ion-modal ion-toolbar {
  --background: rgb(14 116 144);
  --color: white;
}
</style>
