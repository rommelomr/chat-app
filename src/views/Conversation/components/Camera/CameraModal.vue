<template>
  <ion-modal
    ref="modal"
    :isOpen="isModalOpen"
    :backdropDismiss="false"
    @onDidDismiss="closeModal"
  >
    <ion-content style="margin: 30%">
      <div class="image-container">
        <img class="image" v-if="image_src" :src="image_src" />
      </div>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { Directory, Encoding, Filesystem } from "@capacitor/filesystem";
import { RecordingData, VoiceRecorder } from "capacitor-voice-recorder";
import { Plugins } from "@capacitor/core";
import { defineCustomElements } from "@ionic/pwa-elements/loader";
import {
  modalController,
  IonButton,
  IonModal,
  IonContent,
  IonToolbar,
  IonTitle,
} from "@ionic/vue";
import { trashOutline, play, sendSharp, stopCircle } from "ionicons/icons";
import { Ref, computed, onMounted, ref, watch } from "vue";
import { supabase } from "@/utils/SupabaseClient";
import { useConversationsStore } from "@/stores/conversations-store";
import PreviewModal from "./PreviewModal.vue";
const conversation_store = useConversationsStore();
const store_files: Ref<Array<any>> = ref([]);
const recording = ref(false);
let photo: Ref<string> = ref("");
let image_src: Ref<string> = ref("");

const props = defineProps({
  uri: {
    type: String,
  },
  show: {
    type: Boolean,
  },
});
const sendMode = ref(false);
const emit = defineEmits(["onCloseModal"]);
const isModalOpen = ref(false);

const previewImage = async (name: string) => {
  try {
    const file = await Filesystem.readFile({
      path: name,
      directory: Directory.Data,
    });
    const _base_64 = `data:image/jpeg;base64,${file.data}`;
    image_src.value = _base_64;
  } catch (error) {
    console.error("Error al cargar la imagen:", error);
  }
};

const sendFiles = async (
  message_id = 758,
  last_message_index = 759,
  name: string
) => {
  conversation_store.sendFilesToConversation(store_files.value, name);
  return;
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
  _files.push(store_files.value[store_files.value.length - 1]);
  console.log(_files);
  //ciclo que itera el array de archivos en bruto para subirlos uno por uno usando la funcion de supabase
  for (let i in _files) {
    let _file = _files[i];
    console.log(name);
    const audioFile = await Filesystem.readFile({
      path: name,
      directory: Directory.Data,
    });

    const base64Data = audioFile.data;
    const blobData = b64toBlob(base64Data, "image/jpeg");

    const { data, error } = await supabase.storage
      .from("users-files")
      .upload("00003" + "/" + Date.now() + ".jpeg", blobData, {
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
      // _files.push({
      //   name: data.path,
      //   metadata: {
      //     mimetype: _file.type,
      //   },
      // });
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

function b64toBlob(base64Data: any, contentType = "", sliceSize = 512) {
  const byteCharacters = atob(base64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
}

onMounted(async () => {
  // const modal = await modalController.create({
  //   component: PreviewModal,
  //   componentProps: {
  //     //images: images,
  //     //selectedImage: item.src,
  //   },
  // });
});
const openModal = async () => {};

const closeModal = () => {
  isModalOpen.value = false;
  emit("onCloseModal");
};

watch(
  () => props.uri,
  () => {
    openModal();
    // isModalOpen.value = props.show;
    // if (props.uri) {
    //   photo.value = props.uri;
    // }
    // if (props.uri) {
    //   previewImage(props.uri);
    // }
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
  align-items: center;
  width: 100%;
}
.modal-wrapper {
  background: #222;
}
.image {
  max-width: 100%;
}
</style>
