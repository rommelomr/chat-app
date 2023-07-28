<template>
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
        <VoiceRecordingButton />
      </ion-buttons>
      <ion-buttons slot="end">
        <CameraButton @onSendPhoto="onSendPhoto" />
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
//import { set } from "@vueuse/core";
import VoiceRecordingButton from "./Recording/VoiceRecordingButton.vue";
import CameraButton from "./Camera/CameraButton.vue";
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
import { Ref, ref, onMounted, reactive, watch } from "vue";
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
import { useConversationsStore } from "@/stores/conversations-store";

const conversation_store = useConversationsStore();
const current_conversation = useCurrentConversation();
const emit = defineEmits(["onSuccessSend"]);

const onSuccessSend = (messageSender: IMessage) => {
  emit("onSuccessSend", messageSender);
};

const currentConversation: Ref<ICurrentConversation | undefined> = ref();
let textInput: Ref<string> = ref("");
let bodyMessage = reactive({
  conversation_id: current_conversation.getCurrentConversation().id ?? 0,
  chat_user_id: current_conversation.getCurrentConversation().me ?? 0,
  content: {
    text: "",
  },
});
let newConversationBody = reactive({
  conversation_name: "",
  conversation_type: 1,
  chat_users_ids: [],
  auth_ids: [],
  content: {
    text: "",
  },
});
watch(
  () => current_conversation.getCurrentConversation().id,
  () => {
    setCurrentConversation();
  }
);
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
    files: [],
    created_at: moment().toString(),
    conversation_id: current_conversation.getCurrentConversation().id ?? 0,
    conversation_id_chat_user_id: "",
    chat_user_id: current_conversation.current_conversation.me,
    is_forwarded: true,
  });

  let _text_input_aux = textInput.value;

  textInput.value = "";

  let { data, error } = await supabase.functions.invoke("send-message", {
    body: {
      conversation_id,
      chat_user_id,
      content: {
        text: _text_input_aux,
      },
    },
  });
};

let sendMessageIfEmptyConversation = async ({
  conversation_type,
  chat_users_ids,
  auth_ids,
  conversation_name,
}: INewConversation) => {
  let _aux_text_input = textInput.value;
  textInput.value = "";
  let { data, error } = await supabase.functions.invoke("send-message", {
    body: {
      conversation_type,
      conversation_name,
      chat_users_ids,
      auth_ids,
      content: {
        text: _aux_text_input,
      },
    },
  });
  if (error) return;

  current_conversation.current_conversation.isEmpty = false;
  current_conversation.current_conversation.id =
    data.message_info.first_message.conversation_id;
};
let setCurrentConversation = () => {
  let _current_conversation = current_conversation.getCurrentConversation();

  let _convesation_exist = !_current_conversation.isEmpty;
  if (_convesation_exist) {
    bodyMessage.conversation_id = _current_conversation?.id ?? 0;
    bodyMessage.chat_user_id = _current_conversation?.me ?? 0;
    return;
  }

  let id = current_conversation.getCurrentConversation().userConversation?.id;
  //@ts-ignore
  let uu_id =
    current_conversation.getCurrentConversation().userConversation?.person
      ?.auth_id;
  newConversationBody.chat_users_ids.push(parseInt(id) ?? 0);
  newConversationBody.auth_ids.push(uu_id ?? "");
  //}
};
const setMessageSelector = () => {
  if (textInput.value == "") return;
  if (
    bodyMessage.content &&
    bodyMessage.content.text &&
    bodyMessage.content.text?.length < 1
  ) {
    return;
  }

  if (!current_conversation.getCurrentConversation().isEmpty) {
    senMessageIfNotEmptyConversation(bodyMessage);
  }
  if (current_conversation.getCurrentConversation().isEmpty) {
    sendMessageIfEmptyConversation(newConversationBody);
  }
};
const onSendPhoto = async (emitted: any) => {
  console.log({
    id: 0,
    chat_user: current_conversation.getCurrentConversation().userConversation,
    content: {
      text: "",
    },
    files: [],
    created_at: moment().toString(),
    conversation_id: current_conversation.getCurrentConversation().id ?? 0,
    conversation_id_chat_user_id: "",
    chat_user_id: current_conversation.current_conversation.me,
    is_forwarded: true,
  });
  onSuccessSend({
    id: 0,
    chat_user: current_conversation.getCurrentConversation().userConversation,
    content: {
      text: "",
    },
    files: [{ id: "" }],
    created_at: moment().toString(),
    conversation_id: current_conversation.getCurrentConversation().id ?? 0,
    conversation_id_chat_user_id: "",
    chat_user_id: current_conversation.current_conversation.me,
    is_forwarded: true,
  });
  await conversation_store.sendFilesToConversation(emitted.data);
};

onMounted(() => {
  setCurrentConversation();
});
</script>
