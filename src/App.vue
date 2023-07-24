<template>
  <ion-app>
    <ion-router-outlet />
    <Loading v-if="app_store.getAppIsLoading()" />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { Geolocation, PermissionStatus } from "@capacitor/geolocation";
import { onMounted, onUnmounted } from "vue";
import Loading from "@/components/Loading.vue";
import { useAppStore } from "@/stores/app-store";
import { useLocalNotificationsStore } from "@/stores/local-notifications-store";
const app_store = useAppStore();
const printCurrentPosition = async () => {
  const coordinates = await Geolocation.getCurrentPosition();
  console.log("Current position:", coordinates);
};

onMounted(() => {
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
