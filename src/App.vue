<template>
  <ion-app>
    <ion-router-outlet />
    <Loading v-if="app_store.getAppIsLoading()" />
    <Offline v-if="!app_store.getAppIsOnline()" />
    <ion-toast
      :is-open="app_store.getToastIsOpen()"
      :message="app_store.getToastMessage()"
      :duration="3000"
      @didDismiss="onCloseToast(false)"
    ></ion-toast>
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { Geolocation, PermissionStatus } from "@capacitor/geolocation";
import { onMounted, onUnmounted } from "vue";
import Loading from "@/components/Loading.vue";
import Offline from "@/components/Offline.vue";
import { useLocalNotificationsStore } from "@/stores/local-notifications-store";
import { useAppStore } from "@/stores/app-store";
import { useRouter } from "vue-router";
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

const onCloseToast = () => {
  app_store.setToast({
    is_open: false,
    message: "",
  });
};

const lifeListener = () => {
  document.addEventListener("pause", () => {
    app_store.refreshLastConnectionDateTime();
    app_store.updateIAmOnline(false);
  });

  document.addEventListener("resume", () => {
    app_store.updateIAmOnline(true);
  });
};
const updateConnection = async () => {
  app_store.updateIAmOnline(true);
};
const router = useRouter();
const verifySessionExpiration = () => {
  if (
    ["/", "/welcome", "/obtaincode", "/entercode"].indexOf(
      router.currentRoute.value.path
    ) == -1
  )
    app_store.verifySessionExpiration();
};
onMounted(() => {
  verifySessionExpiration();
  storeDeviceInfo();
  sendLocationIfRequested();
  lifeListener();
  updateConnection();
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
