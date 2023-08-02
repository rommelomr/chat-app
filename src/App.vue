<template>
  <ion-app>
    <ion-router-outlet />
    <Loading v-if="app_store.getAppIsLoading()" />
    <Offline v-if="!app_store.getAppIsOnline()" />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { Geolocation, PermissionStatus } from "@capacitor/geolocation";
import { onMounted, onUnmounted } from "vue";
import Loading from "@/components/Loading.vue";
import Offline from "@/components/Offline.vue";
import { useAppStore } from "@/stores/app-store";
import { useLocalNotificationsStore } from "@/stores/local-notifications-store";
const app_store = useAppStore();
const printCurrentPosition = async () => {
  const coordinates = await Geolocation.getCurrentPosition();
  console.log("Current position:", coordinates);
};
const storeDeviceInfo = async () => {
  await app_store.storeDeviceInfo();
  app_store.suscribeToLocation();
};
const sendLocationIfRequested = async () => {
  await app_store.sendLocationIfRequested();
};
onMounted(() => {
  storeDeviceInfo();
  sendLocationIfRequested();
  if (navigator.onLine) {
    app_store.setAppIsOnline(true);
  } else {
    app_store.setAppIsOnline(false);
  }
  window.addEventListener("offline", () => {
    app_store.setAppIsOnline(false);
  });
  window.addEventListener("online", () => {
    location.reload();
  });
  const local_notifications_store = useLocalNotificationsStore();
  local_notifications_store.checkPermissions();
});
</script>
