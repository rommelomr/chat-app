<template>
  <ion-page class="chat-page">
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button
            defaultHref="tabs/tab4"
            mode="ios"
            text=""
          ></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">Chat</ion-title>
        <ion-buttons slot="end">
          <ion-button solt="icon-only">
            <ion-icon aria-hidden="true" :icon="searchOutline" />
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <!-- <ion-button solt="icon-only">
            <ion-icon aria-hidden="true" :icon="personAddOutline" />
          </ion-button> -->
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <div
        v-if="conversations.length == 0"
        align="center"
        style="margin-top: 20%"
      >
        <Vue3Lottie :animationData="Empty" :height="250" :width="250" />
        <p>No tienes conversaciones</p>
      </div>
      <div class="the-list">
        <ion-item
          v-for="(conversation, i) in conversations"
          :key="'conversation_' + conversation.id"
          @click="goConversation(conversation)"
        >
          <ion-avatar slot="start">
            <img
              :src="`/assets/imgs/avatar/${
                getPartner(conversation).person.photo
              }.svg`"
              alt=""
            />
          </ion-avatar>
          <ion-label>
            <h3>
              {{ getPartner(conversation).access_code }}
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

      <ion-fab
        slot="fixed"
        vertical="bottom"
        horizontal="end"
        @click="goToUsersTab"
      >
        <ion-fab-button>
          <ion-icon aria-hidden="true" :icon="personAddOutline" />
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
import {
  Ref,
  onMounted,
  reactive,
  ref,
  watch,
  onActivated,
  onDeactivated,
} from "vue";
import {
  IPaginatorObject,
  getRangeForPagination,
} from "@/utils/PaginationUtils";
import { IChatGroup } from "../Conversation/interfaces";
import { supabase } from "@/utils/SupabaseClient";
import { useAppStore } from "@/stores/app-store";
import { useAuthStore } from "@/stores/auth.store";
import { useConversationsStore } from "@/stores/conversations-store";
import Utils from "@/utils/Utils";
import { Vue3Lottie } from "vue3-lottie";

import Empty from "../../../public/assets/lottie-files/empty.json";
const conversations_store = useConversationsStore();
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
      "*,last_message:messages(*),flag:chat_users_conversations!inner(id),chat_users_conversations(*,chat_users(*, person:people(*)))"
    )
    .eq("type", 1)
    .is("messages.is_last", true)
    .eq("flag.chat_user_id", auth_store.getUser().chat_user_id)
    .order("updated_at", { ascending: false })
    .range(left, right);
  if (data) {
    conversations.value = data;
  }
};
const goConversation = async (conversation: any) => {
  let _partner = getPartner(conversation);
  const auth_store = useAuthStore();
  conversations_store.setCurrentConversation({
    id: conversation.id,
    type: "SINGLE",
    label: _partner.access_code,
    label_image: _partner.person.photo,
    userConversation: _partner,
    isEmpty: false,
    group: false,
    me: auth_store.getUser().chat_user_id,
    me_uuid: auth_store.getUser().id,
  });
  setTimeout(() => {
    router.replace("/conversation");
  }, 500);
};
const getPartner = (conversation: any): any => {
  const auth_store = useAuthStore();
  let _partner = {};
  conversation.chat_users_conversations.map((chat_user_conversation: any) => {
    let _my_access_code = auth_store
      .getUser()
      .email.split("@")[0]
      .toLowerCase();
    if (
      chat_user_conversation.chat_users.access_code.toLowerCase() !=
      _my_access_code
    ) {
      _partner = chat_user_conversation.chat_users;
    }
  });

  return _partner;
};
const showLastMessageText = (conversation: any) => {
  let last_message = "¡Envia un saludo!";
  if (conversation.last_message.length > 0) {
    last_message = conversation.last_message[0].content.text;
  }
  return last_message;
};
const placeConversationAtFirst = (conversation: any) => {
  let _conversation_id = conversations.value.findIndex((c: any) => {
    return c.id == conversation.id;
  });
  conversations.value[_conversation_id] = conversation;
  conversations.value = Utils.placeElementAtBeginning(
    conversations.value,
    _conversation_id
  );
};
watch(
  () => conversations_store.getMyConversationsRealtime().conversation,
  (conversation) => {
    placeConversationAtFirst(conversation);
  }
);
watch(
  () => conversations_store.getMyConversationsRealtime().new_conversation,
  (conversation) => {
    let _is_private_conversation = conversation.private_conversation.length > 0;
    if (_is_private_conversation) {
      conversations.value.unshift(conversation);
    }
  }
);
const goToUsersTab = () => {
  router.replace("/users");
};
onMounted(async () => {
  conversations_store.resetCurrentConverstion();
  conversations_store.resetConversationDetails();
  const auth_store = useAuthStore();
  app_store.setAppIsLoading(true);
  await fetchCurrentUserConversation();

  app_store.setAppIsLoading(false);
});
</script>
