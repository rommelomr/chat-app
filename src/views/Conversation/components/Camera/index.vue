<template>
    <div  
    :style="{ background: recording ? 'red' : 'grey' }"
    class="btn ion-activatable flex al-center jc-center ripple-parent">
          <ion-button @click="toggleRecording">
            <ion-icon aria-hidden="true" :icon="camera" />
            <ion-ripple-effect type="bounded"></ion-ripple-effect>
          </ion-button>
    </div>
   <Modal :show="recording" :uri="uri" @onCloseModal="toggleRecording"/> 

  </template>
  
  <script setup lang="ts">
  import { Ref, onMounted, ref, shallowReactive } from 'vue';
  import Modal from './ModalRecording.vue'
  import { Plugins } from '@capacitor/core';
  import {
  mic, camera
} from "ionicons/icons";
import { Directory, Filesystem } from '@capacitor/filesystem';
import { RecordingData, VoiceRecorder } from 'capacitor-voice-recorder';
import { Camera, CameraResultType, ImageOptions } from '@capacitor/camera';
  const storeFiles:Ref<Array<any>> = ref([]);
  const recording = ref(false);
  const uri: Ref<string> = ref('');
  const toggleRecording =  () => {
      takePhoto();
  };
  let photo:Ref<string> = ref('null');
  const loadFiles = ()=>{
        Filesystem.readdir({
        path:'',
        directory:Directory.Data
        }).then(result =>{
        console.log(result)
        storeFiles.value=result.files
        })
  }

const takePhoto = async () => {
  try {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      saveToGallery: true
    });

    console.log(image);

    const fileName = new Date().getTime() + '.jpeg';

    if (image && image.dataUrl) {
      await Filesystem.writeFile({
        path: fileName,
        data: image.dataUrl,
        directory: Directory.Data
      });
      const savedImagePath = fileName;
      uri.value= fileName;
      recording.value= true;

    }
  } catch (error) {
    console.error('Error capturing photo:', error);
  }
};
  onMounted(()=>{
    loadFiles();
  })

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