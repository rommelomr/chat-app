<template>
 
      <ion-modal ref="modal" :isOpen="isModalOpen" :backdropDismiss="false" @onDidDismiss="closeModal">
        <ion-content>
          <ion-toolbar>
            <ion-title>Nota De Voz</ion-title>
            <ion-buttons slot="end">
              <ion-button color="light" @click="closeModal">
                <ion-icon aria-hidden="true" :icon="trashOutline" />
              </ion-button>
            </ion-buttons>
          </ion-toolbar>

          <div class="text-container">
              <ion-card-subtitle class="centered-text">{{ formatTime }}</ion-card-subtitle>
          </div>
          
          <div class="image-container" v-if="!sendMode">
            <img alt="Silhouette of mountains" class="centered-image" src="/public/assets/gifs/circle-sound.gif" />
          </div>
          <div class="image-container" v-if="sendMode">
            <img alt="Silhouette of mountains" class="centered-image" src="/public/assets/gifs/sound.gif" />
          </div>
          <div class="text-container" v-show="!sendMode">
            <ion-button @click="stopRecording" color="danger" class="centered-text" >
              <ion-icon aria-hidden="true" :icon="stopCircle" />
              <ion-ripple-effect type="bounded"></ion-ripple-effect>
            </ion-button>
          </div>
          <div class="text-container" v-show="sendMode">
            <ion-button color="success" @click="playFile(currentFileName)" class="centered-text" >
              <ion-icon aria-hidden="true" :icon="play" />
   
            </ion-button>
            <ion-button color="danger" @click="sendSetFiles(currentFileName)" class="centered-text"  >
              <ion-icon aria-hidden="true" :icon="sendSharp" />

            </ion-button>
          </div>
        </ion-content>
      </ion-modal>

  </template>
  
  <script setup lang="ts">
  import lamejs from 'lamejs';
  import { Directory, Encoding, Filesystem} from '@capacitor/filesystem';
  import { RecordingData, VoiceRecorder } from 'capacitor-voice-recorder';
  import Player from './AudioReproductor.vue'
  import { Plugins } from '@capacitor/core';
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
import { supabase } from '@/utils/SupabaseClient';
    const { AudioRecorder } = Plugins;
    const storeFiles:Ref<Array<any>> = ref([]);
    const recording = ref(false);
    const props = defineProps({
        record:{
            type:Boolean
        },
        show:{
            type:Boolean
        }
    })
    const sendMode = ref(false);
    const currentFileName = ref('');
    const running = ref(false);
    const time = ref(0);
    let timer:any;

    const emit = defineEmits(['onCloseModal'])

    const formatTime = computed(() => {
        const minutes = Math.floor(time.value / 60);
        const seconds = time.value % 60;
        return `${padZero(minutes)}:${padZero(seconds)}`;
    });
    const padZero = (num:number) => {
        return num.toString().padStart(2, '0');
    };
    const start = () => {
        if (!running.value) {
            running.value = true;
            timer = setInterval(() => {
            time.value++;
            }, 1000);
        }
    };
    const stop = () => {
      if (running.value) {
        running.value = false;
        clearInterval(timer);
      }
    };
    const reset = () => {
        time.value = 0;
    };
    const isModalOpen = ref(false);
    const loadFiles = ()=>{
        Filesystem.readdir({
        path:'',
        directory:Directory.Data
        }).then(result =>{
        console.log(result)
        storeFiles.value=result.files
        })
    }
    const startRecording= async () => {
        if(recording.value){
        return;
        }
        start()
        recording.value= true;
        VoiceRecorder.startRecording().then(result =>{
        console.log(result)
        })
    }

  const cancelRecording =async()=>{
    VoiceRecorder.getCurrentStatus().then(result =>{
      console.log(result)
      if(result.status==='RECORDING'){
         VoiceRecorder.stopRecording();
         timer=0;
       }
    })
  }
  const stopRecording= async () => {
    if(!recording.value){
      return;
    }
   
    VoiceRecorder.stopRecording().then(async(result:RecordingData)=>{
      if(result.value && result.value.recordDataBase64){
        const recordData = result.value.recordDataBase64;
        const fileName = new Date().getTime()+'.wav';
         await Filesystem.writeFile({
          path:fileName,
          directory:Directory.Data,
          data:recordData
        });
        playFile(fileName);    
        stop();
        sendMode.value= true;
      }
    })
    recording.value= false;
    loadFiles();
  }

  const toggleRecording = async () => {
    if (recording.value) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  const playFile= async (filename:string)=>{
    const audioFile = await Filesystem.readFile({
      path:filename,
      directory:Directory.Data
    });
    console.log("file")
    const base64Sound = audioFile.data;
    const audioRef = new Audio(`data:audio/aac;base64,${base64Sound}`)
    audioRef.oncanplaythrough =()=> audioRef.play();
    audioRef.load();
    currentFileName.value=filename;
  }
  
  onMounted(() => {
    VoiceRecorder.requestAudioRecordingPermission();
    loadFiles();
  });
  const openModal = () => {
    isModalOpen.value = true;
  };
  const closeModal = () => {
    cancelRecording();
    isModalOpen.value = false;
    emit('onCloseModal')
  };
  watch(()=>props.show,()=>{
    isModalOpen.value = props.show;
    if(props.record){
        startRecording();
    }
    if(!props.record){
      sendMode.value=false;
      currentFileName.value="";
      clearInterval(timer);
    }
    if(!props.show){
      time.value=0
    }
  });
  const sendSetFiles=async(filename:string)=>{ 
    const audioFile = await Filesystem.readFile({
      path:filename,
      directory:Directory.Data
    });
    sendFiles(758,759,audioFile.data)
  }
 
  const sendFiles = async (message_id=758, last_message_index=759,dataFile:any) => {
  //cada archivo se envia independientemente en un ciclo mas adelante

  //array que va a guardar en success las respuestas de cada solicitud
  //success para los que se subieron correctamente
  //error para los que no
  let files = {
    success: [],
    errors: [],
  };
  let _files= []
  //_files es un array que se usará para
   _files.push(storeFiles.value[storeFiles.value.length-1])
  console.log(_files)
  //ciclo que itera el array de archivos en bruto para subirlos uno por uno usando la funcion de supabase
  for (let i in _files) {
    let _file = _files[i];

    const audioFile = await Filesystem.readFile({
      path:currentFileName.value,
      directory:Directory.Data,
      encoding:Encoding.UTF8
    });

    const formData = new FormData();
    formData.append('file', new Blob([audioFile.data], { type: 'audio/wav' }), 'audio.wav');
      const { data , error } = await supabase.storage
        .from("users-files")
        .upload('00003' + "/" + Date.now()+'.wav', formData, {
          cacheControl: "3600",
          upsert: false,
        });
        

      return
    //si hay error se pushea a files.errors
    if (error) {
      console.log(error)
    } else {
      
      //si no hay error se pushea a files.success solo el path
     // files.success.push(data.path);

      /*y se agrega al array _files el objeto
        {
          name: string,
          metadata: {
            mimetype: string
          }
        }
      */
      _files.push({
        name: data.path,
        metadata: {
          mimetype: _file.type,
        },
      });
    }
  }
  /*
    si al menos un archivo se subió correctamente, se agregan al campo
    files del mensaje que se muestra en pantalla  
  */
  //if (files.success.length > 0) {
   // messages.value[last_message_index - 1].has_files = true;
  //  messages.value[last_message_index - 1].files = _files;
 // }

  /*
    Cuando se sube un archivo, se dispara un trigger que crea un registro en la tabla
    message_files. La siguiente consulta le pone a cada registro su chat_user_id, message_id, y conversation_id correspondientes

  */
  const { data, error } = await supabase
    .from("message_files")
    .update({
      chat_user_id: 125,
      message_id,
      conversation_id: 237,
    })
    .in("name", files.success);
};
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
  height: 30%;
}

.centered-image {
  max-width: 60%;
}
</style>