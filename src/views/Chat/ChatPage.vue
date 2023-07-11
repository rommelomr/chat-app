<template>
  <ion-page class="chat-page">
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="tabs/tab4" mode="ios" text="">
          </ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">Chat</ion-title>
        <ion-buttons slot="end">
          <ion-button solt="icon-only">
            <ion-icon aria-hidden="true" :icon="searchOutline" />
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button solt="icon-only">
            <ion-icon aria-hidden="true" :icon="personAddOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="the-list">
        <ion-item
          v-for="(conversation, i) in conversations"
          :key="'conversation_' + conversation.id"
          @click="goConversation"
        >
          <ion-avatar slot="start">
            <img src="/public/assets/imgs/user.png" alt="" />
          </ion-avatar>
          <ion-label>
            <h3>
              {{ partnerName(conversation) }}
              <!-- <span>5m</span> -->
            </h3>
            <p>{{ showLastMessageText(conversation) }}</p>
          </ion-label>
          <!-- <ion-badge slot="end" class="flex al-center jc-center"> 3 </ion-badge> -->
          <!-- <ion-badge
            v-if="conversation.pending"
            slot="end"
            class="flex al-center jc-center"
          ></ion-badge> -->
        </ion-item>
      </div>

      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button>
          <ion-icon src="/public/assets/imgs/icn-chat.svg"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from "@ionic/vue";
import "./ChatPage.scss";
import { personAddOutline, searchOutline } from "ionicons/icons";
import { useRouter } from "vue-router";
import { Ref, onMounted, reactive, ref } from "vue";
import {
  IPaginatorObject,
  getRangeForPagination,
} from "@/utils/PaginationUtils";
import { IChatGroup } from "../Conversation/interfaces";
import { supabase } from "@/utils/SupabaseClient";
import { useAppStore } from "@/stores/app-store";
import { useAuthStore } from "@/stores/auth.store";

const app_store = useAppStore();
const _pagination = reactive<IPaginatorObject>({
  current_page: 1,
  items_per_page: 1000,
  total_pages: 0,
  total_items: 0,
});
let conversations: Ref<any[]> = ref([]);
const router = useRouter();
const fetchCurrentUserConversation = async () => {
  let { data: conversation_ids, error: conversation_ids_error } =
    await supabase.rpc("get_current_chat_user_conversation_ids");
  if (conversation_ids_error) return;

  const auth_store = useAuthStore();

  let { left, right } = getRangeForPagination(_pagination);
  let { data, error }: { data: any[] | null; error: any } = await supabase
    .from("conversations")
    .select(
      "*,last_message:messages(*),flag:chat_users_conversations(id),chat_users_conversations(*,chat_users(*))"
    )
    .eq("type", 1)
    .is("messages.is_last", true)
    .eq("flag.chat_user_id", auth_store.getUser().chat_user_id)
    .order("updated_at", { ascending: false })
    .range(left, right);
  console.log(data);
  if (data) {
    conversations.value = data;
  }
};

const goConversation = () => {
  router.replace("/conversation");
};

const partnerName = (conversation: any) => {
  const auth_store = useAuthStore();
  let _name = "unknown";
  conversation.chat_users_conversations.map((chat_user_conversation: any) => {
    let _my_access_code = auth_store.getUser().email.split("@")[0];
    console.log(chat_user_conversation.chat_users.access_code);
    if (chat_user_conversation.chat_users.access_code != _my_access_code) {
      _name = chat_user_conversation.chat_users.access_code;
    }
  });
  return _name;
};
const showLastMessageText = (conversation: any) => {
  let last_message = "¡Envia un saludo!";
  if (conversation.last_message.length > 0) {
    last_message = conversation.last_message[0].content.text;
  }
  return last_message;
};
onMounted(async () => {
  app_store.setAppIsLoading(true);
  await fetchCurrentUserConversation();
  app_store.setAppIsLoading(false);
});
</script>
