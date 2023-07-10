<template>
 
    <ion-modal ref="modal" :isOpen="isModalOpen" :backdropDismiss="false" @onDidDismiss="closeModal">
      <ion-content>
        <ion-toolbar>
          <ion-title>Avatar</ion-title>
          <ion-buttons slot="end">
            <ion-button color="light" @click="closeModal">
              <ion-icon aria-hidden="true" :icon="trashOutline" />
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
        <ImageSelector @onSelectAvatar="closeModal"/>
     

      </ion-content>
    </ion-modal>

</template>

<script setup lang="ts">
import ImageSelector from "../AvatarSelector/index.vue";
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
  close
  } from "ionicons/icons";
  import { Ref, computed, onMounted, ref, watch } from 'vue';
  const storeFiles:Ref<Array<any>> = ref([]);
  const recording = ref(false);
  let photo: Ref<string> = ref('')
  let imageSrc:Ref<string>=ref('')

  const props = defineProps({
      show:{
          type:Boolean
      }
  })
  const emit = defineEmits(['onCloseModal'])
  const isModalOpen = ref(false);


const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = (id?:number) => {
  isModalOpen.value = false;
  emit('onCloseModal',{
    id:id??null
  })
};

watch(()=>props.show,()=>{
  isModalOpen.value = props.show;
})
</script>
<style scoped>
.text-container {
display: flex;
justify-content: center;
align-items: center;
height: 90%;
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