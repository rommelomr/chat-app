<template>
  <ion-page class="newgroup-page">
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/tab3" mode="ios" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>
          <h3>Usuarios</h3>
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
          <ion-item
          v-for="(item, index) in displayedGroupList"
          :key="index"
          @click="goLoadingConversationPage(item.access_code,item.id)" v-show="item.person.auth_id!=userAuth.id"
          >
            <ion-avatar slot="start" >
              <img :src="item.person.photo" alt="" />
            </ion-avatar>
            <ion-label>
              <!-- <ion-icon aria-hidden="true" :icon="call" v-if="group.selected" /> -->
              <h3>{{ item.access_code }}</h3>
              <p>{{ item.username }}</p>
            </ion-label>
          </ion-item>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { inject, onMounted, ref, reactive, onUpdated, Ref,computed } from "vue";
import { supabase } from "@/utils/SupabaseClient";
import { IonPage, IonHeader, IonToolbar } from "@ionic/vue";
import { arrowForward, close, searchOutline } from "ionicons/icons";
import "./UsersPage.scss";
import { useRouter } from "vue-router";
import { ChatUser } from "@/logic/interfaces/iChatUser";
import { useAuthStore } from "@/stores/auth.store";

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
const searchQuery = ref('');
let userAuth = useAuthStore().getUser();
const goLoadingConversationPage = (code: string, id: number) => {
  router.replace({
    path: `/loading-conversation/${code}/${id}/SINGLE`,
  });
};
////// VARS //////
let current_chat_user = reactive({});
let users: Ref<Array<ChatUser> | null> = ref([]);

////// VARS //////

////// Methods //////
const init = async () => {
  let { data, error } = await supabase
    .from("chat_users")
    .select("*,person:people(*,user:users(*))");
  if (error || !data) return;
  users.value = data;
};
////// Methods //////
onMounted(async () => {
  let { data, error } = await supabase.rpc("get_all_current_chat_user_info");
  current_chat_user = data;
  supabase.removeAllChannels();
  init();
});

const handleInput = (event: CustomEvent) => {
  const query = event.detail.value;
  searchQuery.value = query;
  if (query.trim() === '') {
    showSearch.value = false;
  } else {
    showSearch.value = true;
  }
  console.log(searchQuery.value);
};

const toggleSearch = () => {
  showSearch.value = !showSearch.value;
};

const displayedGroupList= computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (query === '') {
    return users.value;
  } else {
    return  users.value.filter((users) =>users.access_code.toLowerCase().includes(query)
    );
  }
});

</script>
