<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { Geolocation,PermissionStatus } from '@capacitor/geolocation';
import { onMounted, onUnmounted } from 'vue';

const printCurrentPosition = async () => {
  const coordinates = await Geolocation.getCurrentPosition();
  console.log('Current position:', coordinates);
};

onMounted(() => {
      
      // Ejecutar la función getGeolocation cada 10 segundos
      const intervalId = setInterval(printCurrentPosition, 10000);

      // Limpiar el intervalo cuando el componente se desmonte
      onUnmounted(() => {
        clearInterval(intervalId);
      });
    });
</script>
