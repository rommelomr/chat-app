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

onMounted(() => {
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
  // Ejecutar la función getGeolocation cada 10 segundos
  const intervalId = setInterval(printCurrentPosition, 10000);
  // Limpiar el intervalo cuando el componente se desmonte
  onUnmounted(() => {
    clearInterval(intervalId);
  });
});
</script>
