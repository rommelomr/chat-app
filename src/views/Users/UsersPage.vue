<template>
  <ion-page class="newgroup-page">
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button
            defaultHref="/tabs/tab1"
            mode="ios"
            text=""
          ></ion-back-button>
        </ion-buttons>
        <ion-title>
          <h3>Usuarios</h3>
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <div align="center">
        <h4>¡Agrega a tus amigos!</h4>
      </div>
      <ion-searchbar
        v-model="searcher"
        placeholder="Buscar..."
        @ionInput="handleInput($event)"
      ></ion-searchbar>
      <div>
        <Vue3Lottie
          v-if="users.length == 0"
          :animationData="Search"
          :height="300"
          :width="400"
        />
      </div>
      <div class="the-list">
        <ion-item
          v-for="(item, index) in users"
          :key="index"
          @click="selectChatUserUseCase(item)"
          v-show="item.person.auth_id != userAuth.id"
        >
          <ion-avatar slot="start">
            <img
              :src="`/public/assets/imgs/avatar/${item.person.photo ?? 1}.png`"
            />
          </ion-avatar>
          <ion-label>
            <!-- <ion-icon aria-hidden="true" :icon="call" v-if="group.selected" /> -->
            <h3>{{ item.access_code }}</h3>
            <p>{{ item.username }}</p>
          </ion-label>
        </ion-item>
      </div>
    </ion-content>

    <ModalGeneric
      :is-open="selected_chat_user.is_selected"
      title="Agregar contacto"
    >
      <div align="center" v-if="selected_chat_user.is_selected">
        <ion-avatar slot="start">
          <img
            :src="`/public/assets/imgs/avatar/${
              selected_chat_user.data.person.photo ?? 1
            }.png`"
          />
        </ion-avatar>
      </div>
      <br />

      <div align="center">
        codigo del usuario:
        {{ selected_chat_user.data.access_code }}
      </div>
      <br />
      <div align="center">
        <ion-input
          v-model="new_contact_name"
          type="text"
          class="ion-text-left"
          placeholder="Asignar nickname"
        />
      </div>
      <br />
      <div align="center">
        <ion-button @click="addContact" expand="block"
          >Agregar como contacto</ion-button
        >
      </div>
    </ModalGeneric>
    <ion-toast
      :is-open="toast.is_open"
      :message="toast.message"
      :duration="5000"
      @didDismiss="onCloseToast(false)"
    ></ion-toast>
  </ion-page>
</template>

<script setup lang="ts">
import Search from "../../../public/assets/lottie-files/search.json";
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
import "./UsersPage.scss";
import { useRouter } from "vue-router";
import { ChatUser } from "@/logic/interfaces/iChatUser";
import { useAuthStore } from "@/stores/auth.store";
import { useAppStore } from "@/stores/app-store";
import { useCurrentConversation } from "../Conversation/store/current-conversation.store";
import ModalGeneric from "@/components/ModalGeneric.vue";
import { useContactsStore } from "@/stores/contacts-store";

const chat_users_store = useContactsStore();
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
const searcher = ref("");
let userAuth = useAuthStore().getUser();

const dismissModal = () => {
  selected_chat_user.is_selected = false;
};

let toast = reactive({
  is_open: false,
  message: "",
});

let selected_chat_user = reactive({
  data: {},
  is_selected: false,
});
const selectChatUserUseCase = async (chat_user: any) => {
  selected_chat_user.is_selected = true;
  selected_chat_user.data = chat_user;
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
const searchChatUsers = async (access_code: string) => {
  let { data, error } = await supabase
    .from("chat_users")
    .select("*,person:people(*,user:users(*))")
    .ilike("access_code", access_code);
  if (error) return;

  users.value = data;
};
////// Methods //////
onMounted(async () => {
  //suscribeToNewConversation();
  app_store.loadingBefore(async () => {
    let { data, error } = await supabase.rpc("get_all_current_chat_user_info");
    current_chat_user = data;
  });
});
let timer;
const handleInput = (event: CustomEvent) => {
  clearTimeout(timer);
  timer = setTimeout(async () => {
    const query = event.detail.value;
    searchChatUsers(query);
  }, 600);
};

const toggleSearch = () => {
  showSearch.value = !showSearch.value;
};

let new_contact_name = ref("");

const addContact = async () => {
  let store_response = await chat_users_store.addContact(
    selected_chat_user.data.id,
    new_contact_name.value
  );
  searcher.value = "";
  new_contact_name.value = "";
  selected_chat_user.is_selected = false;
  selected_chat_user.data = {};

  if (store_response.status == 0) return;

  if (store_response.status == 2) {
    toast.message = "Ya tienes agregado a este contacto";
  }

  if (store_response.status == 1) {
    toast.message = "Contacto agregado correctamente";
  }
  toast.is_open = true;

  users.value = [];
};
const onCloseToast = () => {
  toast.message = "";
  toast.is_open = false;
};
const displayedChatUsers = computed(() => {
  const query = searcher.value.toLowerCase().trim();
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
