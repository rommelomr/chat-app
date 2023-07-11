<template>
  <ion-modal
    ref="modal"
    :isOpen="isModalOpen"
    :backdropDismiss="false"
    @onDidDismiss="closeModal"
  >
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
        <!-- <ion-card-subtitle class="centered-text">{{ formatTime }}</ion-card-subtitle> -->
      </div>

      <div class="image-container" v-if="!sendMode">
        <img
          alt="Silhouette of mountains"
          class="centered-image"
          src="/public/assets/gifs/circle-sound.gif"
        />
      </div>
      <div class="image-container" v-if="sendMode">
        <img
          alt="Silhouette of mountains"
          class="centered-image"
          src="/public/assets/gifs/sound.gif"
        />
      </div>
      <div class="text-container" v-show="!sendMode">
        <ion-button @click="stopRecording" color="danger" class="centered-text">
          <ion-icon aria-hidden="true" :icon="stopCircle" />
          <ion-ripple-effect type="bounded"></ion-ripple-effect>
        </ion-button>
      </div>
      <div class="text-container" v-show="sendMode">
        <ion-button
          color="success"
          @click="playFile(currentFileName)"
          class="centered-text"
        >
          <ion-icon aria-hidden="true" :icon="play" />
        </ion-button>
        <ion-button color="danger" @click="stopRecording" class="centered-text">
          <ion-icon aria-hidden="true" :icon="sendSharp" />
        </ion-button>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { Directory, Filesystem } from "@capacitor/filesystem";
import { RecordingData, VoiceRecorder } from "capacitor-voice-recorder";
import Player from "./AudioReproductor.vue";
import { Plugins } from "@capacitor/core";
import {
  IonButton,
  IonModal,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonItem,
  IonList,
  IonAvatar,
  IonImg,
  IonLabel,
} from "@ionic/vue";
import {
  save,
  close,
  trashOutline,
  sendOutline,
  play,
  sendSharp,
  stopCircle,
  send,
} from "ionicons/icons";
import { Ref, computed, onMounted, ref, watch } from "vue";
const { AudioRecorder } = Plugins;
const storeFiles: Ref<Array<any>> = ref([]);
const recording = ref(false);
const props = defineProps({
  record: {
    type: Boolean,
  },
  show: {
    type: Boolean,
  },
});
const sendMode = ref(false);
const currentFileName = ref("");
const running = ref(false);
const time = ref(0);
let timer: any;

const emit = defineEmits(["onCloseModal"]);

const formatTime = computed(() => {
  const minutes = Math.floor(time.value / 60);
  const seconds = time.value % 60;
  return `${padZero(minutes)}:${padZero(seconds)}`;
});
const padZero = (num: number) => {
  return num.toString().padStart(2, "0");
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
const loadFiles = () => {
  Filesystem.readdir({
    path: "",
    directory: Directory.Data,
  }).then((result) => {
    console.log(result);
    storeFiles.value = result.files;
  });
};
const startRecording = async () => {
  if (recording.value) {
    return;
  }
  start();
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
const stopRecording = async () => {
  if (!recording.value) {
    return;
  }

  VoiceRecorder.stopRecording().then(async (result: RecordingData) => {
    if (result.value && result.value.recordDataBase64) {
      const recordData = result.value.recordDataBase64;
      console.log("saved");
      const fileName = new Date().getTime() + ".wav";
      await Filesystem.writeFile({
        path: fileName,
        directory: Directory.Data,
        data: recordData,
      });
      playFile(fileName);
      stop();
      sendMode.value = true;
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
const playFile = async (filename: string) => {
  const audioFile = await Filesystem.readFile({
    path: filename,
    directory: Directory.Data,
  });
  console.log("file");
  const base64Sound = audioFile.data;
  const audioRef = new Audio(`data:audio/aac;base64,${base64Sound}`);
  audioRef.oncanplaythrough = () => audioRef.play();
  audioRef.load();
  currentFileName.value = filename;
};
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
  emit("onCloseModal");
};

watch(
  () => props.show,
  () => {
    isModalOpen.value = props.show;
    if (props.record) {
      startRecording();
    }
    if (!props.record) {
      sendMode.value = false;
      currentFileName.value = "";
      clearInterval(timer);
    }
    if (!props.show) {
      time.value = 0;
    }
  }
);
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
