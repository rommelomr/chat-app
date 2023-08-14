<template>
  <ion-page class="groups-page">
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start"> </ion-buttons>
        <ion-title> Grupos </ion-title>
        <ion-buttons slot="end">
          <ion-button solt="icon-only" @click="toggleSearch">
            <ion-icon aria-hidden="true" :icon="searchOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-searchbar
        v-show="showSearch"
        v-model="searchQuery"
        placeholder="Buscar..."
        @ionInput="handleInput($event)"
      ></ion-searchbar>

      <div
        v-if="displayedGroupList.length < 1"
        align="center"
        style="margin-top: 20%"
      >
        <Vue3Lottie :animationData="Empty" :height="250" :width="250" />
        <p>No tienes grupos</p>
      </div>
      <div
        class="the-list"
        v-for="(item, index) in displayedGroupList"
        :key="index"
      >
        <ion-item
          @click="goLoadingConversationPage(item.name, item.groups[0].id)"
        >
          <ion-avatar slot="start">
            <img :src="`/assets/imgs/landscapes/${item.groups[0].photo}.svg`" />
          </ion-avatar>
          <ion-label>
            <h3>
              {{ item.name }}
              <!-- <span>5m</span> -->
            </h3>
            <p>
              {{ getLastMessage(item) }}
              {{ getDateDifference(item.updated_at) }}
            </p>
          </ion-label>
          <!-- <ion-badge slot="end" class="flex al-center jc-center">
            {{ item.conversations.participants_count[0].count }}
          </ion-badge> -->
        </ion-item>
      </div>
      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button @click="goNewGroup">
          <ion-icon src="/public/assets/imgs/icn-addperson.svg"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar } from "@ionic/vue";
import { alertCircle, searchOutline } from "ionicons/icons";
import { IChatGroup } from "../Conversation/interfaces/index";
import "./GroupsPage.scss";
import {
  IPaginatorObject,
  getRangeForPagination,
} from "@/utils/PaginationUtils";
import { useRouter } from "vue-router";
import { ref, reactive, onMounted, Ref, computed, watch } from "vue";
import { supabase } from "@/utils/SupabaseClient";
import { getDateDifference } from "@/utils/MomentUtils";
import moment from "moment";
import { useAppStore } from "@/stores/app-store";
import { Vue3Lottie } from "vue3-lottie";
import Empty from "@/../public/assets/lottie-files/empty.json";
import { useAuthStore } from "@/stores/auth.store";
import { useConversationsStore } from "@/stores/conversations-store";
import Utils from "@/utils/Utils";
const conversations_store = useConversationsStore();
const app_store = useAppStore();
const showSearch = ref(false);
const router = useRouter();
const searchQuery = ref("");
const goLoadingConversationPage = (code: string, id: number) => {
  router.replace({
    path: `/loading-conversation/${code}/${id}/GROUP`,
  });
};

const _pagination = reactive<IPaginatorObject>({
  current_page: 1,
  items_per_page: 1000,
  total_pages: 0,
  total_items: 0,
});
let conversations = ref([]);

const fetchGroups = async () => {
  const auth_store = useAuthStore();
  let { left, right } = getRangeForPagination(_pagination);
  let { data, error }: { data: IChatGroup[] | null; error: any } =
    await supabase
      .from("conversations")
      .select(
        "*,flag:chat_users_conversations!inner(id),last_message:messages(*),participants_count:chat_users_conversations(count),groups(*,chat_users(*))"
      )
      .eq("type", 2)
      .is("messages.is_last", true)
      .eq("flag.chat_user_id", auth_store.getUser().chat_user_id)
      .order("updated_at", { ascending: false })
      .range(left, right);
  if (data) {
    conversations.value = data;
  }
};

const toggleSearch = () => {
  showSearch.value = !showSearch.value;
};
const goNewGroup = () => {
  router.replace("/newgroup1");
};
const suscribeToMyConversations = () => {
  const auth_store = useAuthStore();
  conversations_store.suscribeToMyConversations(
    auth_store.getUser().chat_user_id
  );
};
onMounted(async () => {
  app_store.setAppIsLoading(true);
  await fetchGroups();
  app_store.setAppIsLoading(false);
});

const handleInput = (event: CustomEvent) => {
  const query = event.detail.value;
  searchQuery.value = query;
  if (query.trim() === "") {
    showSearch.value = false;
  } else {
    showSearch.value = true;
  }
  console.log(searchQuery.value);
};

const displayedGroupList = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (query === "") {
    return conversations.value;
  } else {
    return conversations.value.filter((users: any) =>
      users.name.toLowerCase().includes(query)
    );
  }
});
const getLastMessage = (conversation: any) => {
  console.log(conversation.last_message.length);
  if (conversation.last_message.length == 0) return "¡Saluda!";

  return conversation.last_message[0].content.text ?? "[archivo]";
};
const updateGroupInfo = (conversation: any, group_id: number) => {
  conversations.value[group_id].conversations = conversation;
  conversations.value[group_id].conversations = conversation;
};
const placeGroupAtFirst = (conversation: any) => {
  let _conversation_id = conversations.value.findIndex((c: any) => {
    return c.id == conversation.id;
  });
  console.log(conversation);
  conversations.value[_conversation_id] = conversation;
  conversations.value = Utils.placeElementAtBeginning(
    conversations.value,
    _conversation_id
  );
};
watch(
  () => conversations_store.getMyConversationsRealtime().conversation,
  (conversation) => {
    let _is_private_conversation = conversation.groups.length > 0;
    if (_is_private_conversation) {
      placeGroupAtFirst(conversation);
    }
  }
);
watch(
  () => conversations_store.getMyConversationsRealtime().new_conversation,
  (conversation) => {
    console.log(conversation);
    let _is_private_conversation = conversation.groups.length > 0;
    if (_is_private_conversation) {
      conversations.value.unshift(conversation);
    }
  }
);
</script>
