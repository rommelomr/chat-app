<template>
    <div  
    :style="{ background: recording ? 'red' : 'grey' }"
    class="btn ion-activatable flex al-center jc-center ripple-parent">
          <ion-button @click="toggleRecording">
            <ion-icon aria-hidden="true" :icon="mic" />
            <ion-ripple-effect type="bounded"></ion-ripple-effect>
          </ion-button>
    </div>
    <Modal :show="recording" :record="recording" @onCloseModal="toggleRecording"/>

  </template>
  
  <script setup lang="ts">
  import { Ref, onMounted, ref } from 'vue';
  import Modal from './ModalRecording.vue'
  import { Plugins } from '@capacitor/core';
  import {
  mic, star
} from "ionicons/icons";
import { Directory, Filesystem } from '@capacitor/filesystem';
import { RecordingData, VoiceRecorder } from 'capacitor-voice-recorder';
  const { AudioRecorder } = Plugins;
  const storeFiles:Ref<Array<any>> = ref([]);
  const recording = ref(false);
  const toggleRecording =  () => {
      recording.value=!recording.value
  };
  </script>
  <style>
  ion-modal {
    --height: 50%;
    --border-radius: 16px;
    --box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  }

  ion-modal::part(backdrop) {
    background: rgba(209, 213, 219);
    opacity: 1;
  }

  ion-modal ion-toolbar {
    --background: rgb(14 116 144);
    --color: white;
  }
</style>