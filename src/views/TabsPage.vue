<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom" className="tabs-page tab-bar-no-border">
        <ion-tab-button tab="tab1" @click="moveBetweenTabs('/tabs/tab1')">
          <div class="wrapper flex al-center jc-center">
            <ion-icon
              aria-hidden="true"
              :icon="chatbox"
              className="tab-icon-inactive"
            />
            <ion-icon
              aria-hidden="true"
              :icon="chatboxOutline"
              className="tab-icon-active"
            />
          </div>
          <ion-label className="tab-icon-inactive">Chat</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2" @click="moveBetweenTabs('/tabs/tab2')">
          <div class="wrapper flex al-center jc-center">
            <ion-icon
              aria-hidden="true"
              :icon="person"
              className="tab-icon-inactive"
            />
            <ion-icon
              aria-hidden="true"
              :icon="personOutline"
              className="tab-icon-active"
            />
          </div>

          <ion-label className="tab-icon-inactive">Usuarios</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab3" @click="moveBetweenTabs('/tabs/tab3')">
          <div class="wrapper flex al-center jc-center">
            <ion-icon
              aria-hidden="true"
              :icon="people"
              className="tab-icon-inactive"
            />
            <ion-icon
              aria-hidden="true"
              :icon="peopleOutline"
              className="tab-icon-active"
            />
          </div>

          <ion-label className="tab-icon-inactive">Grupos</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab4" @click="moveBetweenTabs('/profile')">
          <div class="wrapper flex al-center jc-center">
            <ion-icon
              aria-hidden="true"
              :icon="happyOutline"
              className="tab-icon-inactive"
            />
            <ion-icon
              aria-hidden="true"
              :icon="happyOutline"
              className="tab-icon-active"
            />
          </div>

          <ion-label className="tab-icon-inactive">Perfil</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
  IonIcon,
  IonPage,
  IonRouterOutlet,
} from "@ionic/vue";
import {
  call,
  person,
  personCircle,
  personCircleOutline,
  personOutline,
} from "ionicons/icons";
import { people } from "ionicons/icons";
import { ellipsisHorizontal } from "ionicons/icons";
import { happyOutline } from "ionicons/icons";
import { peopleOutline } from "ionicons/icons";
import { callOutline } from "ionicons/icons";
import { chatbox } from "ionicons/icons";
import { chatboxOutline } from "ionicons/icons";
import { ellipse, square, triangle } from "ionicons/icons";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "vue-router";
import { useAppStore } from "@/stores/app-store";
const app_store = useAppStore();
const router = useRouter();
const moveBetweenTabs = (tab: string) => {
  router.replace(tab);
};

//  const login_action_testing = useAuthStore().attemptLogin;
//  const startLogin=()=>{
//   login_action_testing()
//  }
//  startLogin();
</script>
