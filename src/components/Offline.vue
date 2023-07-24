<template>
  <div id="loading-page" align="center">
    <p style="margin: 10%; margin-top: 20vh; font-size: 20px">
      <b
        >No tienes conexión. La aplicación volverá a ejecutarse cuanto estes en
        una zona WiFi, o cuando tengas datos activos.</b
      >
    </p>
    <Vue3Lottie :animationData="NoConnection" :height="200" :width="200" />
  </div>
</template>
<script setup lang="ts">
import { Vue3Lottie } from "vue3-lottie";
import NoConnection from "../../public/assets/lottie-files/no-connection.json";
</script>
<style>
#loading-page {
  position: fixed;
  color: black;
  background: rgb(255, 255, 255);
  opacity: 0.9;
  width: 100vw;
  height: 100vh;
}
</style>
