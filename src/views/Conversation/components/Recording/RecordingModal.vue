<template>
  <ion-modal
    ref="modal"
    :isOpen="is_modal_open"
    :backdropDismiss="false"
    @onDidDismiss="closeRecordingModal"
  >
    <ion-content>
      <div id="custom-ion-content">
        <div style="width: 100%">
          <div id="time-container" align="center">
            {{ formatTime }}
          </div>

          <div id="recording" v-if="!send_mode" align="center">
            <img
              alt="Silhouette of mountains"
              class="centered-image"
              src="/public/assets/gifs/circle-sound.gif"
            />
          </div>

          <Player
            id="player"
            v-if="_audio"
            :base64Sound="base_64_file"
            :key="_audioName"
          />
          <div align="center">
            <div class="" v-show="!send_mode">
              <ion-button
                @click="stopRecording"
                color="danger"
                class="centered-text"
              >
                <ion-icon aria-hidden="true" :icon="stopCircle" />
                <ion-ripple-effect type="bounded"></ion-ripple-effect>
              </ion-button>
            </div>

            <div class="" v-show="send_mode">
              <ion-button
                color="danger"
                @click="closeRecordingModal()"
                class="centered-text"
              >
                <ion-icon aria-hidden="true" :icon="closeCircle" />
              </ion-button>
              <ion-button
                color="success"
                @click="acceptAudio()"
                class="centered-text"
              >
                <ion-icon aria-hidden="true" :icon="sendSharp" />
              </ion-button>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import lamejs from "lamejs";
import { Directory, Encoding, Filesystem } from "@capacitor/filesystem";
import { RecordingData, VoiceRecorder } from "capacitor-voice-recorder";
import Player from "./AudioReproductor.vue";
import { Plugins } from "@capacitor/core";
import {
  IonButton,
  IonModal,
  IonContent,
  IonToolbar,
  IonTitle,
} from "@ionic/vue";
import {
  trashOutline,
  closeCircle,
  sendSharp,
  stopCircle,
} from "ionicons/icons";
import { Ref, computed, onMounted, ref, watch } from "vue";
import { supabase } from "@/utils/SupabaseClient";

const { AudioRecorder } = Plugins;
const storeFiles: Ref<Array<any>> = ref([]);
const recording = ref(false);
let _audio: Ref<any> = ref();
let _audioName: Ref<any> = ref();

const props = defineProps({
  record: {
    type: Boolean,
  },
  show: {
    type: Boolean,
  },
});

const send_mode = ref(false);
const current_file_name = ref("");
const timer_is_running = ref(false);
const time = ref(0);
let timer: any;

const emit = defineEmits(["onCloseModal", "onAcceptAudio"]);

const formatTime = computed(() => {
  const minutes = Math.floor(time.value / 60);
  const seconds = time.value % 60;
  return `${padZero(minutes)}:${padZero(seconds)}`;
});

const padZero = (num: number) => {
  return num.toString().padStart(2, "0");
};

const startRecordingTimer = () => {
  if (timer_is_running.value) return;
  timer_is_running.value = true;
  timer = setInterval(() => {
    time.value++;
  }, 1000);
};

const stopTimer = () => {
  if (!timer_is_running.value) return;
  timer_is_running.value = false;
  clearInterval(timer);
};
const reset = () => {
  time.value = 0;
};
const is_modal_open = ref(false);

const startRecording = async () => {
  let is_already_recording = recording.value == true;
  if (is_already_recording) return;

  startRecordingTimer();
  recording.value = true;
  VoiceRecorder.startRecording().then((result) => {
    console.log(result);
  });
};

const cancelRecording = async () => {
  VoiceRecorder.getCurrentStatus().then((result) => {
    console.log(result);
    if (result.status === "RECORDING") {
      VoiceRecorder.stopRecording();
      timer = 0;
    }
  });
};
let base_64_file = ref('')
const stopRecording = async () => {
  let is_already_recording = recording.value == true;
  if (!is_already_recording) return;

  //detiene la grabación y la obtiene en result
  VoiceRecorder.stopRecording().then(async (result: RecordingData) => {
    if (result.value && result.value.recordDataBase64) {
      base_64_file.value = `${result.value.recordDataBase64}`;
      const file_name = new Date().getTime();
      //let _audio_blob = Utils.b64toBlob(base_64_file);
      playFile(`data:${result.value.mimeType};base64,${result.value.recordDataBase64}`);
      stopTimer();
      send_mode.value = true;
    }
  });
  recording.value = false;
};

const toggleRecording = async () => {
  if (recording.value) {
    stopRecording();
  } else {
    startRecording();
  }
};
const playFile = async (base_64_file: string) => {
  _audio.value = base_64_file;
  //_audioName.value = audioFile.fileName;
  //current_file_name.value = filename;
};

onMounted(() => {
  VoiceRecorder.requestAudioRecordingPermission();
});
const openModal = () => {
  is_modal_open.value = true;
};
const closeRecordingModal = () => {
  cancelRecording();
  is_modal_open.value = false;
  send_mode.value = false;
  _audio.value = null;
  emit("onCloseModal");
};
watch(
  () => props.show,
  (is_showing) => {
    is_modal_open.value = is_showing;
    send_mode.value = false;
    if (!is_showing) {
      time.value = 0;
    }
  }
);
watch(
  () => props.record,
  (is_recording) => {
    if (is_recording) {
      send_mode.value = false;
      startRecording();
    } else {
      current_file_name.value = "";
      clearInterval(timer);
    }
  }
);
const acceptAudio = async () => {
  
  is_modal_open.value = false;
  emit("onAcceptAudio", {
    name: "RecordingModal",
    data: {
      audio: _audio.value,
    },
  });
  _audio.value = null
};

const sendFiles = async (
  message_id = 758,
  last_message_index = 759,
  dataFile: any
) => {
  //cada archivo se envia independientemente en un ciclo mas adelante

  //array que va a guardar en success las respuestas de cada solicitud
  //success para los que se subieron correctamente
  //error para los que no
  let files = {
    success: [],
    errors: [],
  };
  let _files = [];
  //_files es un array que se usará para
  _files.push(storeFiles.value[storeFiles.value.length - 1]);
  console.log(_files);
  //ciclo que itera el array de archivos en bruto para subirlos uno por uno usando la funcion de supabase
  for (let i in _files) {
    let _file = _files[i];

    const audioFile = await Filesystem.readFile({
      path: current_file_name.value,
      directory: Directory.Data,
      encoding: Encoding.UTF8,
    });

    const formData = new FormData();
    formData.append(
      "file",
      new Blob([audioFile.data], { type: "audio/wav" }),
      "audio.wav"
    );
    const { data, error } = await supabase.storage
      .from("users-files")
      .upload("00003" + "/" + Date.now() + ".wav", formData, {
        cacheControl: "3600",
        upsert: false,
      });

    return;
    //si hay error se pushea a files.errors
    if (error) {
      console.log(error);
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
#custom-ion-content {
  height: 100%;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}
#time-container {
  font-size: 30px;
  margin-bottom: 10%;
}

#player {
  margin-bottom: 10%;
  width: 100%;
}

.centered-text {
  text-align: center;
}
.image-container {
  height: 30%;
}

.centered-image {
  max-width: 60%;
}
</style>
