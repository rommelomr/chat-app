<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom" className="tabs-page tab-bar-no-border">
        <ion-tab-button tab="tab1" href="/tabs/tab1">
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

        <ion-tab-button tab="tab2" href="/tabs/tab2">
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

        <ion-tab-button tab="tab3" href="/tabs/tab3">
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

        <ion-tab-button tab="tab4" href="/tabs/tab4">
          <div class="wrapper flex al-center jc-center">
            <ion-icon
              aria-hidden="true"
              :icon="ellipsisHorizontal"
              className="tab-icon-inactive"
            />
            <ion-icon
              aria-hidden="true"
              :icon="ellipsisHorizontalOutline"
              className="tab-icon-active"
            />
          </div>

          <ion-label className="tab-icon-inactive">Mas</ion-label>
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
  ellipsisHorizontalOutline,
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

//  const login_action_testing = useAuthStore().attemptLogin;
//  const startLogin=()=>{
//   login_action_testing()
//  }
//  startLogin();
</script>
