<template>
  <ion-page class="newgroup-page">
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start"> </ion-buttons>
        <ion-title>
          <h3>Contactos</h3>
        </ion-title>
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
      <div class="the-list">
        <div v-if="contacts.length == 0" align="center" style="margin-top: 20%">
          <Vue3Lottie :animationData="Empty" :height="250" :width="250" />
          <p>No tienes contactos</p>
        </div>
        <ion-item
          v-for="(contact, index) in contacts"
          :key="index"
          @click="
            selectChatUserUseCase(
              contact.chat_user.access_code,
              contact.chat_user.id,
              contact
            )
          "
        >
          <ion-avatar slot="start">
            <img
              :src="`/assets/imgs/avatar/${
                contact.chat_user.person.photo ?? 1
              }.svg`"
            />
          </ion-avatar>
          <ion-label>
            <!-- <ion-icon aria-hidden="true" :icon="call" v-if="group.selected" /> -->
            <h3>{{ contact.chat_user.access_code }}</h3>
            <p>{{ contact.nickname }}</p>
          </ion-label>
        </ion-item>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  inject,
  onMounted,
  ref,
  reactive,
  onUpdated,
  Ref,
  computed,
} from "vue";
import { supabase } from "@/utils/SupabaseClient";
import { IonPage, IonHeader, IonToolbar } from "@ionic/vue";
import { arrowForward, close, searchOutline } from "ionicons/icons";
import "./ContactsPage.scss";
import { useRouter } from "vue-router";
import { ChatUser } from "@/logic/interfaces/iChatUser";
import { useAuthStore } from "@/stores/auth.store";
import { useAppStore } from "@/stores/app-store";
import { useCurrentConversation } from "../Conversation/store/current-conversation.store";
import { useContactsStore } from "@/stores/contacts-store";
import Empty from "../../../public/assets/lottie-files/empty.json";

const contacts_store = useContactsStore();
const currentConversation = useCurrentConversation();
const app_store = useAppStore();
const selectedList = ref(
  [] as {
    avatar: string;
    name: string;
    message: string;
    selected: boolean;
  }[]
);

const showSearch = ref(false);
const router = useRouter();
const searchQuery = ref("");
let userAuth = useAuthStore().getUser();
const auth_store = useAuthStore();
const selectChatUserUseCase = async (
  access_code: string,
  id: number,
  contact: any
) => {
  await app_store.loadingBefore(async () => {
    let messages: Array<any> = [];
    //currentConversation.reset();
    let { data, error } = await supabase.rpc(
      "get_conversation_with_chat_user",
      {
        partnerchatuserid: id,
      }
    );

    app_store.setAppIsLoading(false);

    if (data.conversation.status == 404) {
      await currentConversation.setCurrentConversation({
        id: 0,
        type: "SINGLE",
        label: contact.nickname ?? data.chat_user.access_code,
        isEmpty: true,
        contact_id: contact.id,
        userConversation: data.chat_user,
        group: undefined,
        label_image: data.chat_user.person.photo,
        me: 0,
        me_uuid: "",
      });
    }
    if (data.conversation.status == 200) {
      console.log(data);
      await currentConversation.setCurrentConversation({
        id: data.conversation.id,
        type: "SINGLE",
        label: contact.nickname ?? data.chat_user.access_code,
        contact_id: contact.id,
        isEmpty: false,
        userConversation: data.chat_user,
        group: undefined,
        label_image: data.chat_user.person.photo,
        me: 0,
        me_uuid: "",
      });
    }

    router.replace({
      path: `/conversation`,
    });
  });
};

// const goLoadingConversationPage = (code: string, id: number) => {
//   router.replace({
//     path: `/loading-conversation/${code}/${id}/SINGLE`,
//   });
// };
////// VARS //////
let current_chat_user = reactive({});
let users: Ref<Array<ChatUser> | null> = ref([]);

////// VARS //////

////// Methods //////
let contacts = ref([]);
const listContacts = async () => {
  const _store_response = await contacts_store.fetchContacts(
    auth_store.getUser().chat_user_id
  );
  contacts.value = _store_response.data;
};
////// Methods //////
onMounted(async () => {
  //suscribeToNewConversation();
  app_store.loadingBefore(async () => {
    let { data, error } = await supabase.rpc("get_all_current_chat_user_info");
    current_chat_user = data;
    listContacts();
  });
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

const toggleSearch = () => {
  showSearch.value = !showSearch.value;
};

const displayedGroupList = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (query === "") {
    return users.value;
  } else {
    //@ts-ignore
    return users.value.filter((users) =>
      users.access_code.toLowerCase().includes(query)
    );
  }
});
</script>
