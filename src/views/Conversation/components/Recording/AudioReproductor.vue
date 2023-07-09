<template>
    <div>
      <button @click="playAudio" :disabled="isPlaying">Reproducir</button>
      <button @click="stopAudio" :disabled="!isPlaying">Detener</button>
      <div class="progress-bar-container">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onUnmounted } from 'vue';
  import { Plugins } from '@capacitor/core';
  
  const { NativeAudio } = Plugins;
  
  const isPlaying = ref(false);
  const progress = ref(0);
  let audioInterval:any=undefined;
  
  const playAudio = async () => {
    try {
      await NativeAudio.preloadSimple({
        assetPath: '/data/1688827982841.wav',
        assetId: 'my-audio',
      });
      await NativeAudio.play({ assetId: 'my-audio' });
      isPlaying.value = true;
      startProgress();
    } catch (error) {
      console.error('Error al reproducir el audio:', error);
    }
  };
  
  const stopAudio = async () => {
    try {
      await NativeAudio.stop({ assetId: 'my-audio' });
      isPlaying.value = false;
      resetProgress();
    } catch (error) {
      console.error('Error al detener el audio:', error);
    }
  };
  
  const startProgress = () => {
    audioInterval = setInterval(() => {
      progress.value += 1;
      if (progress.value >= 100) {
        stopAudio();
      }
    }, 1000);
  };
  
  const resetProgress = () => {
    progress.value = 0;
  };
  
  onUnmounted(() => {

    clearInterval(audioInterval);
  });
  
  const formattedProgress = computed(() => {
    return progress.value.toFixed(2);
  });
  </script>
  
  <style scoped>
  .progress-bar-container {
    width: 100%;
    height: 20px;
    background-color: lightgray;
    margin-top: 10px;
  }
  
  .progress-bar {
    height: 100%;
    background-color: green;
    width: 0%;
  }
  </style>