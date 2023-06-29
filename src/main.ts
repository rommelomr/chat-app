import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import {
  IonActionSheet,
  IonAlert,
  IonAvatar,
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonPage,
  IonPopover,
  IonRippleEffect,
  IonRow,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToggle,
  IonToolbar,
  IonicVue,
} from "@ionic/vue";

/* Core CSS required for Ionic components to work properly */
import "@ionic/vue/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/vue/css/padding.css";
import "@ionic/vue/css/float-elements.css";
import "@ionic/vue/css/text-alignment.css";
import "@ionic/vue/css/text-transformation.css";
import "@ionic/vue/css/flex-utils.css";
import "@ionic/vue/css/display.css";

/* Theme variables */
import "./theme/variables.scss";

import { createPinia } from "pinia";
const pinia = createPinia();

const app = createApp(App).use(IonicVue).use(router);
app.use(pinia);
app.component("IonActionSheet", IonActionSheet);
app.component("IonAlert", IonAlert);
app.component("IonPage", IonPage);
app.component("IonHeader", IonHeader);
app.component("IonToolbar", IonToolbar);
app.component("IonButtons", IonButtons);
app.component("IonBackButton", IonBackButton);
app.component("IonButton", IonButton);
app.component("IonItem", IonItem);
app.component("IonTitle", IonTitle);
app.component("IonContent", IonContent);
app.component("IonIcon", IonIcon);
app.component("IonAvatar", IonAvatar);
app.component("IonBadge", IonBadge);
app.component("IonLabel", IonLabel);
app.component("IonFab", IonFab);
app.component("IonFabButton", IonFabButton);
app.component("IonGrid", IonGrid);
app.component("IonRow", IonRow);
app.component("IonCol", IonCol);
app.component("IonFooter", IonFooter);
app.component("IonRippleEffect", IonRippleEffect);
app.component("IonPopOver", IonPopover);
app.component("IonModal", IonModal);
app.component("IonInput", IonInput);
app.component("IonToggle", IonToggle);
app.component("IonSelect", IonSelect);
app.component("IonSearchbar", IonSearchbar);
app.component("IonSelectOption", IonSelectOption);
router.isReady().then(() => {
  app.mount("#app");
});
