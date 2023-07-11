<template>
  <div
    style="
      margin-top: 40%;
      position: absolute;
      width: 100%;
      height: 60vh;
      background: white;
      z-index: 999;
      color: black;
    "
  >
    <pre>{{ newConversationBody }}</pre>
  </div>
  <ion-footer
    v-if="current_conversation.getCurrentConversation()"
    class="conversation-footer"
  >
    <ion-toolbar>
      <ion-item lines="none">
        <ion-input
          v-model="textInput"
          type="text"
          placeholder="Escribir mensaje aquí"
        ></ion-input>
        <ion-icon aria-hidden="true" :icon="attachOutline" slot="end" />
      </ion-item>
      <ion-buttons slot="end">
        <Recording />
      </ion-buttons>
      <ion-buttons slot="end">
        <CameraCapter />
      </ion-buttons>
      <ion-buttons @click="setMessageSelector" slot="end">
        <div class="btn ion-activatable flex al-center jc-center ripple-parent">
          <ion-icon aria-hidden="true" :icon="send" />
          <ion-ripple-effect type="bounded"></ion-ripple-effect>
        </div>
      </ion-buttons>
    </ion-toolbar>
  </ion-footer>
</template>

<script setup lang="ts">
import { supabase } from "@/utils/SupabaseClient";
import { IonPage, IonPopover, IonHeader, IonToolbar } from "@ionic/vue";
import { set } from "@vueuse/core";
import Recording from "./Recording/Recording.vue";
import CameraCapter from "./Camera/index.vue";
import {
  attachOutline,
  call,
  checkmarkDone,
  ellipsisVertical,
  mic,
  searchOutline,
  send,
  videocam,
} from "ionicons/icons";
import { Ref, ref, onMounted } from "vue";
import {
  IBodyMessage,
  IMessage,
  INewConversation,
  INewConversationResponse,
} from "../interfaces";
import {
  useCurrentConversation,
  ICurrentConversation,
} from "../store/current-conversation.store";
import moment from "moment";

const current_conversation = useCurrentConversation();
const emit = defineEmits(["onSuccessSend"]);

const onSuccessSend = (messageSender: IMessage) => {
  emit("onSuccessSend", messageSender);
};

const currentConversation: Ref<ICurrentConversation | undefined> = ref();
let textInput: Ref<string> = ref("");
let bodyMessage: Ref<IBodyMessage> = ref({
  conversation_id: current_conversation.getCurrentConversation().id ?? 0,
  chat_user_id: current_conversation.getCurrentConversation().me ?? 0,
  content: {
    text: "",
  },
});
let newConversationBody: Ref<INewConversation> = ref({
  conversation_name: "",
  conversation_type: 1,
  chat_users_ids: [],
  auth_ids: [],
  content: {
    text: "",
  },
});

let senMessageIfNotEmptyConversation = async ({
  conversation_id,
  chat_user_id,
  content,
}: IBodyMessage) => {
  onSuccessSend({
    id: 0,
    chat_user: current_conversation.getCurrentConversation().userConversation,
    content: {
      text: textInput.value,
    },
    has_files: false,
    files: [],
    created_at: moment().toString(),
    conversation_id: current_conversation.getCurrentConversation().id ?? 0,
    conversation_id_chat_user_id: "",
    chat_user_id: current_conversation.current_conversation.me,
    is_forwarded: true,
  });
  let { data, error } = await supabase.functions.invoke("send-message", {
    body: {
      conversation_id,
      chat_user_id,
      content: {
        text: textInput.value,
      },
    },
  });
  textInput.value = "";
};

let sendMessageIfEmptyConversation = async ({
  conversation_type,
  chat_users_ids,
  auth_ids,
  conversation_name,
}: INewConversation) => {
  console.log(conversation_type, chat_users_ids, auth_ids, conversation_name);
  let { data, error } = await supabase.functions.invoke("send-message", {
    body: {
      conversation_type,
      conversation_name,
      chat_users_ids,
      auth_ids,
      content: {
        text: textInput.value,
      },
    },
  });
  if (error) return;

  current_conversation.current_conversation.id =
    data.message_info.first_message.conversation_id;

  textInput.value = "";
};
let setCurrentConversation = () => {
  alert("buenas");
  let _convesation_exist =
    !current_conversation.getCurrentConversation().isEmpty;
  if (_convesation_exist) {
    bodyMessage.value.conversation_id =
      current_conversation.getCurrentConversation().id ?? 0;
    bodyMessage.value.chat_user_id =
      current_conversation.getCurrentConversation().me ?? 0;
    return;
  }

  console.log(current_conversation.getCurrentConversation());
  let id = current_conversation.getCurrentConversation().userConversation?.id;
  alert(id);
  //@ts-ignore
  let uu_id =
    current_conversation.getCurrentConversation().userConversation?.person
      ?.auth_id;
  newConversationBody.value.chat_users_ids.push(parseInt(id) ?? 0);
  newConversationBody.value.auth_ids.push(uu_id ?? "");
  //}
};
const setMessageSelector = () => {
  if (
    bodyMessage.value.content &&
    bodyMessage.value.content.text &&
    bodyMessage.value.content.text?.length < 1
  ) {
    return;
  }
  if (!current_conversation.getCurrentConversation().isEmpty) {
    senMessageIfNotEmptyConversation(bodyMessage.value);
  }
  if (current_conversation.getCurrentConversation().isEmpty) {
    sendMessageIfEmptyConversation(newConversationBody.value);
  }
};
onMounted(() => {
  setCurrentConversation();
});
</script>
