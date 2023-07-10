<template>
 
      <ion-modal ref="modal" :isOpen="isModalOpen" :backdropDismiss="false" @onDidDismiss="closeModal">
        <ion-content>
          <ion-toolbar>
            <ion-title></ion-title>
            <ion-buttons slot="end">
              <ion-button color="light" @click="closeModal">
                <ion-icon aria-hidden="true" :icon="trashOutline" />
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
          <div class="image-container" >
            <img class="centered-image"  v-if="imageSrc" :src="imageSrc"/>
          </div>
       

        </ion-content>
      </ion-modal>

  </template>
  
  <script setup lang="ts">
  import { Directory, Filesystem } from '@capacitor/filesystem';
  import { RecordingData, VoiceRecorder } from 'capacitor-voice-recorder';
  import { Plugins } from '@capacitor/core';
  import { defineCustomElements } from '@ionic/pwa-elements/loader';
  import {
      IonButton,
      IonModal,
      IonContent,
      IonToolbar,
      IonTitle,
    } from '@ionic/vue';
    import {
    trashOutline,
    play,
    sendSharp,
    stopCircle,
    } from "ionicons/icons";
    import { Ref, computed, onMounted, ref, watch } from 'vue';
    const storeFiles:Ref<Array<any>> = ref([]);
    const recording = ref(false);
    let photo: Ref<string> = ref('')
    let imageSrc:Ref<string>=ref('')
    

    const props = defineProps({
        uri:{
            type:String
        },
        show:{
            type:Boolean
        }
    })
    const sendMode = ref(false);
    const emit = defineEmits(['onCloseModal'])
    const isModalOpen = ref(false);


    const loadImage = async (name:string) => {
      try {
        const file = await Filesystem.readFile({
          path: name,
          directory: Directory.Data,
        });
        // Obtener los datos de la imagen en formato base64
        const imageBase64 = file.data;
        // Crear una URL válida para la imagen
        const imageUrl = `data:image/jpeg;base64,${imageBase64}`;
        // Establecer la URL de la imagen para mostrarla
        imageSrc.value = imageUrl;
      } catch (error) {
        console.error('Error al cargar la imagen:', error);
      }
    };




  onMounted(() => {
  });
  const openModal = () => {
    isModalOpen.value = true;
  };
  
  const closeModal = () => {
    isModalOpen.value = false;
    emit('onCloseModal')
  };

  watch(()=>props.uri,()=>{
    isModalOpen.value = props.show;
    if(props.uri){
      photo.value= props.uri
    }
    if(props.uri){
      loadImage(props.uri);
    }
  })
  </script>
  <style scoped>
.text-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30%;
}

.centered-text {
  text-align: center;
}
.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  widows: 100%;
}

.centered-image {
  max-width: 60%;
}
</style>