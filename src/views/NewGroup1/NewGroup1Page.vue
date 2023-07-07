<template>
  <ion-page class="newgroup-page">
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button
            defaultHref="tabs/tab3"
            mode="ios"
            text=""
          ></ion-back-button>
        </ion-buttons>
        <ion-title>
          <h3>Nuevo grupo</h3>
          <p>Agrega participantes</p>
        </ion-title>
        <ion-buttons slot="end">
          <ion-button solt="icon-only" @click="toggleSearch">
            <ion-icon aria-hidden="true" :icon="searchOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="avatar-list" v-if="selectedList.length > 0">
        <div
          class="avatar-holder ion-text-center"
          v-for="(group, index) in selectedList"
          :key="index"
          @click="pushOrRemoveObject(group)"
          
        >
          <ion-avatar>
            <img :src="group.person.photo" alt="" />
          </ion-avatar>
          <h6>{{ group.access_code }}</h6>
          <div
            class="btn ion-activatable flex al-center jc-center ripple-parent"
          >
            <ion-icon aria-hidden="true" :icon="close" />
            <ion-ripple-effect type="bounded"></ion-ripple-effect>
          </div>
        </div>
      </div>

      <ion-searchbar
        v-show="showSearch"
        v-model="searchQuery"
        placeholder="Search"
        @ionInput="handleInput($event)"
      ></ion-searchbar>

      <div class="the-list">
        <ion-item
          v-for="(group, index) in displayedGroupList"
          :key="index"
          @click="pushOrRemoveObject(group)"
          v-show="group.person.auth_id!=userAuth.id"
        >
          <ion-avatar slot="start">
            <img :src="group.person.photo" alt="" />
          </ion-avatar>
          <ion-label>
            <!-- <ion-icon aria-hidden="true" :icon="call" v-if="group.selected" /> -->
            <h3>{{ group.access_code }}</h3>
            <p>
              {{ group.person.name ?? "" }} {{ group.person.last_name ?? "" }}
            </p>
          </ion-label>
        </ion-item>
      </div>
      <ion-fab slot="fixed" vertical="bottom" horizontal="end" @click="goNew">
        <ion-fab-button>
          <ion-icon aria-hidden="true" :icon="arrowForward" />
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar } from "@ionic/vue";
import { arrowForward, call, close, searchOutline } from "ionicons/icons";
import "./NewGroup1Page.scss";
import { useRouter } from "vue-router";
import { computed, onMounted, reactive, ref, Ref } from "vue";
import { supabase } from "@/utils/SupabaseClient";
import { ChatUser } from "@/logic/interfaces/iChatUser";
import { useNewGroup } from "../Groups/store/new-group.store";
import { useAuthStore } from "@/stores/auth.store";

let userAuth = useAuthStore().getUser();
let newGroup = useNewGroup();

interface Group {
  avatar: string;
  name: string;
  message: string;
  selected: boolean;
}

const router = useRouter();
const showSearch = ref(false);
const groupList = ref([
  {
    avatar: "assets/imgs/user.png",
    name: "Aaaaaaaa",
    message: "aaaaaaaa",
    selected: false,
  },
]);
let current_chat_user = reactive({});
let users: Ref<Array<ChatUser> | null> = ref([]);

const displayedGroupList = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (query === "") {
    return users.value;
  } else {
    return users.value.filter((users) =>
      users.access_code.toLowerCase().includes(query)
    );
  }
});

const selectedList: Ref<ChatUser[]> = ref([]);

const searchQuery = ref("");

const filteredGroupList = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (query === "") {
    return groupList.value;
  } else {
    return groupList.value.filter((group) =>
      group.name.toLowerCase().includes(query)
    );
  }
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

const goNew = () => {
  newGroup.setNewGroupList(selectedList.value);
  router.replace("/newgroup");
};
const init = async () => {
  let { data, error } = await supabase
    .from("chat_users")
    .select("*,person:people(*,user:users(*))");
  if (error || !data) return;
  users.value = data;
};
onMounted(async () => {
  let { data, error } = await supabase.rpc("get_all_current_chat_user_info");
  current_chat_user = data;
  supabase.removeAllChannels();
  init();
});

const pushOrRemoveObject = (obj: ChatUser): void => {
  const index = selectedList.value.findIndex((item) => item.id === obj.id);
  if (index !== -1) {
    selectedList.value.splice(index, 1); // Elimina el objeto si se encuentra en el array
  } else {
    selectedList.value.push(obj); // Agrega el objeto al array si no se encuentra
  }
};
</script>
