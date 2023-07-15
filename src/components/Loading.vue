<template>
  <div id="loading-page" align="center">
    <p style="margin-top: 40%; font-size: 30px"><b>Cargando</b></p>
  </div>
  <Vue3Lottie
    style=""
    id="lottie"
    :animationData="Loading"
    :height="200"
    :width="200"
  />
</template>
<script setup lang="ts">
import { Vue3Lottie } from "vue3-lottie";
import Loading from "../../public/assets/lottie-files/loading.json";
</script>
<style>
#loading-page {
  position: fixed;
  color: black;
  background: rgb(255, 255, 255);
  opacity: 0.8;
  width: 100vw;
  height: 100vh;
}
#lottie {
  margin-top: 50%;
  opacity: 1;
}
</style>
