<template>
  <ion-page class="conversation-page">
    <ion-header class="ion-no-border">
      <Toolbar />
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="chat-holder">
        <!-- <div v-for="(message,index) in messages" :key="index" 
            :class="message.chat_user_id!=current_conversation.me ? 'sender':'reciver'"
          >
          <div :class="message.chat_user_id!=current_conversation.me ? 'message flex al-center jc-end':'chat-bubble' ">
            <h4>{{ message.content.text }}</h4>
          </div>
          <div class="time">
            <p>9 : 34 AM</p>
          </div>
        </div> -->

        <div v-if="messages.length == 0" align="center" style="margin-top: 20%">
          <Vue3Lottie :animationData="Hello" :height="200" :width="200" />
          <p style="color: white">Envia un saludo!</p>
        </div>
        <div v-for="(message, index) in messages" :key="index">
          <div
            v-if="
              message.chat_user_id ===
              current_conversation.getCurrentConversation().me
            "
            class="sender"
            @click="presentActionSheet(message.id)"
          >
            <div class="message flex al-center jc-end">
              <div class="wrapper">
                <div class="chat-bubble">
                  <h4>{{ message.content.text }}</h4>
                </div>
                <div class="time flex al-center">
                  <ion-icon aria-hidden="true" :icon="checkmarkDone" />
                  <p>{{ getDateDifference(message.created_at) }}</p>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="reciver">
            <div class="chat-bubble">
              <span class="partner-name">{{
                message.chat_user.access_code
              }}</span
              ><br /><br />
              <h4>{{ message.content.text }}</h4>
            </div>
            <div class="time">
              <p>{{ getDateDifference(message.created_at) }}</p>
            </div>
          </div>
        </div>
      </div>
      <ion-modal
        class="ion-modall"
        :is-open="openModal"
        @dismiss="dismissModal"
      >
        <ion-content class="modall ion-padding">
          <div class="holder">
            <div class="section">
              <h3>Ingrese Nick Nameeee</h3>
              <ion-item>
                <ion-input value="Pedrito" />
              </ion-item>
              <div class="btns-holder flex al-center jc-end">
                <ion-button fill="clear" @click="dismissModal"
                  >Cancelar</ion-button
                >
                <ion-button fill="clear">Guardar</ion-button>
              </div>
            </div>
          </div>
        </ion-content>
      </ion-modal>
    </ion-content>

    <FooterConversation @onSuccessSend="onSuccessSend" />
  </ion-page>
</template>

<script setup lang="ts">
import { LocalNotifications } from "@capacitor/local-notifications";
import {
  IonPage,
  IonPopover,
  IonHeader,
  IonToolbar,
  toastController,
  actionSheetController,
} from "@ionic/vue";
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
import { IonActionSheet, IonButton } from "@ionic/vue";
import { useRouter } from "vue-router";
import { onMounted, reactive, Ref, ref, watch } from "vue";
import {
  ICurrentConversation,
  useCurrentConversation,
} from "./store/current-conversation.store";
import { supabase } from "@/utils/SupabaseClient";
import { useAuthStore } from "@/stores/auth.store";
import Toolbar from "./components/Toolbar.vue";
import FooterConversation from "./components/FooterConversation.vue";
import { get } from "@vueuse/core";
import { ErrorToast, SuccessToast } from "@/utils/ShowToast";
import { IMessage } from "./interfaces";
import { getDateDifference } from "@/utils/MomentUtils";
import { useAppStore } from "@/stores/app-store";
import { Vue3Lottie } from "vue3-lottie";
import Hello from "../../../public/assets/lottie-files/hello.json";
import "./ConversationPage.scss";
import { useConversationsStore } from "@/stores/conversations-store";
const app_store = useAppStore();
const current_conversation = useCurrentConversation();
const conversation_store = useConversationsStore();
const { user } = useAuthStore();
const router = useRouter();
const isModalOpen = ref(false);

const openModal = () => {
  isModalOpen.value = true;
};
const dismissModal = () => {
  isModalOpen.value = false;
};
const goProfile = () => {
  router.replace("/profile");
};
let messages: Ref<IMessage[]> = ref([]);
let channels = reactive({
  insert: {},
  update: {},
});

const deleteForAll = async (id: number) => {
  let { data, error } = await supabase
    .from("messages")
    .update({ deleted_for_all: true })
    .eq("id", id);
};

const deleteForMe = async (id: number) => {
  let { data, error } = await supabase
    .from("messages")
    .update({ deleted_for_me: true })
    .eq("id", id);
};
const scheduleNotification = async (message: IMessage) => {};
const presentActionSheet = async (id: number) => {
  const actionSheet = await actionSheetController.create({
    header: "Borarr",
    buttons: [
      {
        text: "Borrar para mi",
        role: "destructive",
        data: {
          action: "delete",
        },
      },
      {
        text: "Borarr para todos",
        role: "destructive",
        data: {
          action: "delete_all",
        },
      },
      {
        text: "Cancel",
        role: "cancel",
        data: {
          action: "cancel",
        },
      },
    ],
  });

  await actionSheet.present();
  const { data } = await actionSheet.onDidDismiss();
  if (data.action === "delete_all") {
    deleteForAll(id);
  }
  if (data.action === "delete") {
    deleteForMe(id);
  }
};
const onSuccessSend = (message: IMessage) => {
  messages.value.push(message);
};
const getMessageRequest = async (
  conversation: number,
  chat_user: number
): Promise<any | undefined> => {
  let _me = current_conversation.getCurrentConversation().me;

  try {
    let { data, error } = await supabase
      .from("messages")
      .select(
        "*,chat_user:chat_users(*,person:people(*)),files:message_files(*)"
      )
      .eq("conversation_id", current_conversation.getCurrentConversation().id)
      .or(
        `chat_user_id.neq.${_me},and(chat_user_id.eq.${_me},deleted_for_me.eq.FALSE)`
      )
      .is("message_files.deleted_at", null)
      .is("deleted_for_all", false)
      .order("created_at", { ascending: true });
    return data;
  } catch (e) {
    ErrorToast("Ocurrio un error!!!");
  }
};
const loadMesaggesFromConversation = async (
  conversation: number,
  chat_user: number
) => {
  messages.value = await getMessageRequest(conversation, chat_user);
  let _conversation_id = current_conversation.getCurrentConversation().id;
  let _me = current_conversation.getCurrentConversation().me;
  channels.insert = supabase
    .channel(_conversation_id + "-insert")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${_conversation_id}`,
      },
      async (event) => {
        if (event.new.chat_user_id == _me) return;
        let { data, error } = await supabase
          .from("messages")
          .select(
            "*,chat_user:chat_users(*,person:people(*)),files:message_files(*)",
            {
              count: "exact",
            }
          )
          .eq("id", event.new.id);
        if (error) return;
        //@ts-ignore
        messages.value.push(data[0]);
        scheduleNotification(data[0]);
        setTimeout(() => {
          //@ts-ignore
          // scrollToBottom("#conversation");
        }, 200);
      }
    )
    .subscribe();

  channels.update = await supabase
    .channel(conversation + "-update")
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversation}`,
      },
      async (event) => {
        console.log(event);
        let deleted_for_owner =
          event.new.deleted_for_me && event.new.chat_user_id == user.id;
        if (event.new.deleted_for_all || deleted_for_owner) {
          let _message_to_delete = messages.value.findIndex((message) => {
            //@ts-ignore
            return message.id == event.new.id;
          });
          messages.value.splice(_message_to_delete, 1);
        }
      }
    )
    .subscribe();
};

watch(
  () => current_conversation.getCurrentConversation().id,
  () => {
    loadMesaggesFromConversation(
      current_conversation.getCurrentConversation().id,
      current_conversation.getCurrentConversation().userConversation?.id ?? 0
    );
  }
);

watch(
  () => conversation_store.getMyConversationsRealtime().new_conversation,
  (private_conversation) => {
    current_conversation.current_conversation.isEmpty = false;

    current_conversation.current_conversation.id =
      private_conversation.conversation_id;
  }
);

const suscribeToNewConversation = () => {
  const auth_store = useAuthStore();
  conversation_store.suscribeToNewConversation(
    current_conversation.getCurrentConversation().userConversation?.id ?? 0,
    auth_store.getUser().chat_user_id
  );
};
onMounted(async () => {
  conversation_store.unsuscribeFromConversationEvents();
  if (!current_conversation.getCurrentConversation().isEmpty) {
    await loadMesaggesFromConversation(
      current_conversation.getCurrentConversation().id,
      current_conversation.getCurrentConversation().userConversation?.id ?? 0
    );
  } else {
    suscribeToNewConversation();
  }
  app_store.setAppIsLoading(false);
});
</script>
