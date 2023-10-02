<template>
  <ion-page class="configuration-page">
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title> Configuración </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding-top">
      <div class="profile-holder">
        <ion-item lines="none" @click="goProfile">
          <ion-avatar slot="start">
            <img :src="profile_info.photo" alt="" />
          </ion-avatar>
          <ion-label>
            <h3>{{ auth_store.getUser().email.split("@")[0] }}</h3>
            <p class="ion-text-wrap">
              {{ profile_info.description }}
            </p>
          </ion-label>
        </ion-item>
      </div>

      <div class="the-list">
        <div class="section">
          <ion-item lines="none" @click="goAccount">
            <ion-icon src="/public/assets/imgs/icn-key.svg" slot="start" />
            <ion-label>
              <h3>Cuenta</h3>
              <p class="ion-text-wrap">Configura la cuenta de tu cuenta</p>
            </ion-label>
          </ion-item>
          <ion-item lines="none">
            <ion-icon
              src="/public/assets/imgs/icn-notification.svg"
              slot="start"
            />
            <ion-label>
              <h3>Notificaciones</h3>
              <p class="ion-text-wrap">Configura las notificaciones del chat</p>
            </ion-label>
          </ion-item>
        </div>
        <ion-item lines="none">
          <ion-icon src="/public/assets/imgs/icn-group.svg" slot="start" />
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
import { ref, reactive, onMounted } from "vue";
import { useProfileStore } from "@/stores/profile-store";
import { useAuthStore } from "@/stores/auth.store";
const auth_store = useAuthStore();
const profile_store = useProfileStore();
const router = useRouter();

let profile_info = reactive({
  description: "",
  photo: "",
});

const loadProfile = async () => {
  let _info = await profile_store.getProfile();

  profile_info.description = _info.description;
  profile_info.photo = "/assets/imgs/avatar/" + _info.photo + ".svg";
};

const goProfile = () => {
  router.replace("/profile");
};

const goAccount = () => {
  router.replace("/Account");
};

onMounted(() => {
  loadProfile();
});
</script>
