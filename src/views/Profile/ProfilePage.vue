<template>
  <ion-page class="profile-page">
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button
            defaultHref="tabs/tab4"
            mode="ios"
            text=""
          ></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center"> Perfil </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="dp-holder ion-text-center">
        <ion-avatar>
          <img :src="profile_info.photo" alt="" />
        </ion-avatar>
        <div
          class="btn ion-activatable flex al-center jc-center ripple-parent"
          id="open-modal"
          expand="block"
        >
          <ion-icon aria-hidden="true" :icon="camera" />
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
              <h3>
                {{ profile_info.name ? profile_info.name : "Sin nombre" }}
                {{
                  profile_info.last_name
                    ? profile_info.last_name
                    : "Sin apellido"
                }}
              </h3>
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
              <h6>{{ profile_info.description }}</h6>
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
              <h6 id="acces_code_container" @click="copyContentToClipboard">
                {{ profile_info.access_code }}
              </h6>
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
                <ion-input v-model="profile_form_state.name" />
              </ion-item>
              <ion-item>
                <ion-input v-model="profile_form_state.last_name" />
              </ion-item>
              <div class="btns-holder flex al-center jc-end">
                <ion-button fill="clear" @click="dismissModal"
                  >Cancelar</ion-button
                >
                <ion-button fill="clear" @click="updateProfile"
                  >Guardar</ion-button
                >
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
                <ion-input v-model="profile_form_state.description" />
              </ion-item>
              <div class="btns-holder flex al-center jc-end">
                <ion-button fill="clear" @click="dismissModal1"
                  >Cancelar</ion-button
                >
                <ion-button fill="clear" @click="updateProfile"
                  >Guardar</ion-button
                >
              </div>
            </div>
          </div>
        </ion-content>
      </ion-modal>
    </ion-content>
    <ion-modal ref="modal" trigger="open-modal" @willDismiss="onWillDismiss">
      <!-- <ion-buttons slot="start">
        <ion-button @click="cancel()">Cancel</ion-button>
      </ion-buttons>
      <ion-buttons slot="end">
        <ion-button :strong="true" @click="confirm()">Confirm</ion-button>
      </ion-buttons> -->
      <ion-content class="ion-padding">
        <div class="custom-modal-container">
          <div
            v-for="(image, i) in profile_images"
            :key="'profile_image_' + i"
            style="width: 20%; display: inline-block"
            align="center"
          >
            <ion-avatar @click="selectNewProfileImage(image)">
              <img :src="image.signedUrl" alt="" />
            </ion-avatar>
          </div>
        </div>
      </ion-content>
    </ion-modal>
  </ion-page>
</template>
<style></style>
<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar } from "@ionic/vue";
import { call, camera, ellipsisVertical, send, videocam } from "ionicons/icons";
import "./ProfilePage.scss";
import { useRouter } from "vue-router";
import { ref, reactive, onMounted, computed } from "vue";
import { useAuthStore } from "@/stores/auth.store";
import { useProfileStore } from "@/stores/profile-store";
import { useAppStore } from "@/stores/app-store";
import Utils from "@/utils/Utils";
import { useAccountStore } from "@/stores/account-store";
const profile_store = useProfileStore();
const auth_store = useAuthStore();
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
let profile_info = reactive({
  name: "",
  last_name: "",
  description: "",
  photo: "",
  access_code: auth_store.getUser().email.split("@")[0],
});
let profile_images = ref([]);
const loadProfilePhotos = async () => {
  const app_store = useAppStore();
  let response = await app_store.loadProfilePhotos();
  response.data.splice(0, 1);
  profile_images.value = response.data;
};
const loadProfileInfo = async () => {
  let _profile_data = await profile_store.getProfile();
  profile_info.name = _profile_data.name;
  profile_form_state.name = _profile_data.name;
  profile_info.last_name = _profile_data.last_name;
  profile_form_state.last_name = _profile_data.last_name;
  profile_info.description = _profile_data.description;
  profile_form_state.description = _profile_data.description;

  profile_info.photo = _profile_data.signedUrl;
};
let profile_form_state = reactive({
  name: "",
  last_name: "",
  description: "",
});
const updateProfile = async () => {
  dismissModal();
  dismissModal1();
  profile_info.name = profile_form_state.name;
  profile_info.last_name = profile_form_state.last_name;
  profile_info.description = profile_form_state.description;
  let _profile_data = await profile_store.updateProfile(profile_form_state);
  console.log(_profile_data);
};

const copyContentToClipboard = () => {
  Utils.copyContentToClipboard(profile_info.access_code);
  const app_store = useAppStore();
  app_store.showToast("Texto copiado al portapapeles");
};
const message = ref(
  "This modal example uses triggers to automatically open a modal when the button is clicked."
);

const modal = ref();
const input = ref();
const cancel = () => modal.value.$el.dismiss(null, "cancel");

const confirm = () => {
  const name = input.value.$el.value;
  modal.value.$el.dismiss(name, "confirm");
};
const onWillDismiss = (ev: CustomEvent<any>) => {
  if (ev.detail.role === "confirm") {
    message.value = `Hello, ${ev.detail.data}!`;
  }
};
const selectNewProfileImage = async (selected_photo: any) => {
  await profile_store.updateProfileImage(selected_photo.path.split(".")[0]);
  profile_info.photo = selected_photo.signedUrl;
};
onMounted(() => {
  loadProfilePhotos();
  loadProfileInfo();
});
</script>
