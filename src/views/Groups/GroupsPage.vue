<template>
  <ion-page class="groups-page">
    <ion-header class="ion-no-border">
      <ion-toolbar>
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
        class="the-list"
        v-for="(item, index) in displayedGroupList"
        :key="index"
      >
        <ion-item @click="goLoadingConversationPage(item.name, item.id)">
          <ion-avatar slot="start">
            <img :src="item.photo" alt="" />
          </ion-avatar>
          <ion-label>
            <h3>{{ item.name }}<span>5m</span></h3>
            <p>{{ getDateDifference(item.created_at) }}</p>
          </ion-label>
          <ion-badge slot="end" class="flex al-center jc-center">
            {{ item.conversations.participants_count[0].count }}
          </ion-badge>
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
import { ref, reactive, onMounted, Ref, computed } from "vue";
import { supabase } from "@/utils/SupabaseClient";
import { getDateDifference } from "@/utils/MomentUtils";
import moment from "moment";
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
let group: Ref<IChatGroup[]> = ref([]);

const fetchGroups = async () => {
  let { left, right } = getRangeForPagination(_pagination);
  let { data, error }: { data: IChatGroup[] | null; error: any } =
    await supabase
      .from("groups")
      .select(
        "*,conversations(*,participants_count:chat_users_conversations(count)),chat_users(*)"
      )
      .order("created_at", { ascending: true })
      .range(left, right);
  if (data) {
    group.value = data;
  }
};

const toggleSearch = () => {
  showSearch.value = !showSearch.value;
};
const goNewGroup = () => {
  router.replace("/newgroup1");
};

onMounted(async () => {
  fetchGroups();
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
    return group.value;
  } else {
    return group.value.filter((users) =>
      users.name.toLowerCase().includes(query)
    );
  }
});
</script>
