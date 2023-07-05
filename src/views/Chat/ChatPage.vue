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
          <ion-button solt="icon-only">
            <ion-icon aria-hidden="true" :icon="personAddOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="the-list">
        <ion-item @click="goConversation">
          <ion-avatar slot="start">
            <img src="public/assets/imgs/user.png" alt="" />
          </ion-avatar>
          <ion-label>
            <h3>123456 <span>5m</span></h3>
            <p>Hola como estas</p>
          </ion-label>
          <ion-badge slot="end" class="flex al-center jc-center"> 3 </ion-badge>
        </ion-item>
        <ion-item @click="goConversation">
          <ion-avatar slot="start">
            <img src="public/assets/imgs/user.png" alt="" />
          </ion-avatar>
          <ion-label>
            <h3>123456 <span>5m</span></h3>
            <div class="flex al-center">
              <img src="public/assets/imgs/icn-attachment.svg" alt="" />
              <p>Hola como estas</p>
            </div>
          </ion-label>
          <ion-badge slot="end" class="flex al-center jc-center"> 3 </ion-badge>
        </ion-item>
        <ion-item>
          <ion-avatar slot="start">
            <img src="public/assets/imgs/user.png" alt="" />
          </ion-avatar>
          <ion-label>
            <h3>123456 <span>5m</span></h3>
            <p>Hola como estas</p>
          </ion-label>
          <ion-badge slot="end" class="flex al-center jc-center"> 3 </ion-badge>
        </ion-item>
        <ion-item>
          <ion-avatar slot="start">
            <img src="public/assets/imgs/user.png" alt="" />
          </ion-avatar>
          <ion-label>
            <h3>123456 <span>5m</span></h3>
            <div class="flex al-center">
              <img src="public/assets/imgs/icn-attachment.svg" alt="" />
              <p>Hola como estas</p>
            </div>
          </ion-label>
          <ion-badge slot="end" class="flex al-center jc-center"> 3 </ion-badge>
        </ion-item>
        <ion-item>
          <ion-avatar slot="start">
            <img src="public/assets/imgs/user.png" alt="" />
          </ion-avatar>
          <ion-label>
            <h3>123456 <span>5m</span></h3>
            <p>Hola como estas</p>
          </ion-label>
          <ion-badge slot="end" class="flex al-center jc-center"> 3 </ion-badge>
        </ion-item>
        <ion-item>
          <ion-avatar slot="start">
            <img src="public/assets/imgs/user.png" alt="" />
          </ion-avatar>
          <ion-label>
            <h3>123456 <span>5m</span></h3>
            <div class="flex al-center">
              <img src="public/assets/imgs/icn-attachment.svg" alt="" />
              <p>Hola como estas</p>
            </div>
          </ion-label>
          <ion-badge slot="end" class="flex al-center jc-center"> 3 </ion-badge>
        </ion-item>
      </div>

      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button>
          <ion-icon src="public/assets/imgs/icn-chat.svg"></ion-icon>
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
const _pagination = reactive<IPaginatorObject>({
  current_page: 1,
  items_per_page: 1000,
  total_pages: 0,
  total_items: 0,
});
let conversation: Ref<any[]> = ref([]);
const router = useRouter();
const fetch = async () => {
  let { left, right } = getRangeForPagination(_pagination);

  let { data, error }: { data: any[] | null; error: any } = await supabase
    .from("conversations")
    .select("*,chat_users(*)")
    .order("created_at", { ascending: true })
    .range(left, right);
  if (data) {
    conversation.value = data;
  }
};
onMounted(async () => {
  fetch();
});

const goConversation = () => {
  router.replace("/conversation");
};
</script>
