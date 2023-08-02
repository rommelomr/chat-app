<template>
  <div
    :style="{ background: recording ? 'red' : 'grey' }"
    class="btn ion-activatable flex al-center jc-center ripple-parent"
  >
    <ion-button @click="toggleRecording">
      <ion-icon aria-hidden="true" :icon="mic" />
      <ion-ripple-effect type="bounded"></ion-ripple-effect>
    </ion-button>
  </div>
  <RecordingModal
    :show="recording"
    :record="recording"
    @onAcceptAudio="onAcceptAudio"
    @onCloseModal="toggleRecording"
  />
</template>

<script setup lang="ts">
import { Ref, onMounted, ref, watch } from "vue";
import RecordingModal from "./RecordingModal.vue";
import { Plugins } from "@capacitor/core";
import { mic, star } from "ionicons/icons";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { RecordingData, VoiceRecorder } from "capacitor-voice-recorder";
import Utils from "@/utils/Utils";
import { useConversationsStore } from "@/stores/conversations-store";

const conversation_store = useConversationsStore();
const storeFiles: Ref<Array<any>> = ref([]);
let recording = ref(false);

const props = defineProps({
  isRecording: {
    type: Boolean,
  },
});

watch(
  () => props.isRecording,
  (value) => {
    recording.value = value;
  }
);
const toggleRecording = () => {
  conversation_store.toggleRecordingVoice();
  recording.value = !recording.value;
};

const emit = defineEmits(["onSendAudio"]);
const onAcceptAudio = (emitted: any) => {
  conversation_store.toggleRecordingVoice();
  console.log(emitted.data.audio);
  const { data, error } = Utils.b64toBlob(emitted.data.audio);
  if (error) {
    Utils.handleErrors(error);
  }
  if (data) {
    emit("onSendAudio", {
      name: `VoiceRecordingButton.${emitted.name}`,
      data: [data.blob],
    });
  }
};
</script>
<style>
ion-modal {
  --height: 50%;
  --border-radius: 16px;
  --box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -4px rgb(0 0 0 / 0.1);
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
