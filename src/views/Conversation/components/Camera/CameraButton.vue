<template>
  <div
    :style="{ background: taking_photo ? 'red' : 'grey' }"
    class="btn ion-activatable flex al-center jc-center ripple-parent"
  >
    <ion-button @click="runPhotoCamera">
      <ion-icon aria-hidden="true" :icon="camera" />
      <ion-ripple-effect type="bounded"></ion-ripple-effect>
    </ion-button>
  </div>
  <!-- <CameraModal
    :show="taking_photo"
    :uri="uri"
    @onCloseModal="runPhotoCamera"
  /> -->
</template>

<script setup lang="ts">
import { Ref, onMounted, ref, shallowReactive } from "vue";
import CameraModal from "./CameraModal.vue";
import { mic, camera } from "ionicons/icons";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { RecordingData, VoiceRecorder } from "capacitor-voice-recorder";
import { Camera, CameraResultType, ImageOptions } from "@capacitor/camera";
import { useConversationsStore } from "@/stores/conversations-store";
import Utils from "@/utils/Utils";
import { useCurrentConversation } from "../../store/current-conversation.store";
const current_conversation = useCurrentConversation();
const conversation_store = useConversationsStore();
const FILES_FOLDER = "chat-taked-photos";

const storeFiles: Ref<Array<any>> = ref([]);
const taking_photo = ref(false);
const uri: Ref<string> = ref("");
const emit = defineEmits(["onSendPhoto"]);
const runPhotoCamera = async () => {
  await takePhoto();
};
const takePhoto = async () => {
  try {
    //take photo
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      saveToGallery: true,
    });

    if (image.dataUrl) {
      //@ts-ignore
      console.log(image.dataUrl)
      const { data, error } = Utils.b64toBlob(image.dataUrl);
      if (data) {
        emit("onSendPhoto", {
          name: "CameraButton.onSendPhoto",
          data: [data.blob],
        });
        //conversation_store.sendFilesToConversation([data.blob]);
      }
    }

    //let { file_name } = await storeImageLocally(image);

    // const saved_image_path = file_name;
    // uri.value = saved_image_path;
    // taking_photo.value = true;
  } catch (error) {
    //if person close camera without take photo
    console.error("Error capturing photo:", error);
  }
};
let photo: Ref<string> = ref("null");

const loadFiles = () => {
  console.log(Directory.Data);
  Filesystem.readdir({
    path: `${FILES_FOLDER}`,
    directory: Directory.Data,
  }).then((result) => {
    console.log(result);
    storeFiles.value = result.files;
  });
};

onMounted(() => {
  //loadFiles();
});
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
