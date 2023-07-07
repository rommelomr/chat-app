<template>
  <ion-page class="newgroup-page">
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button
            defaultHref="newgroup1"
            mode="ios"
            text=""
          ></ion-back-button>
        </ion-buttons>
        <ion-title> Nuevo grupo </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="top-btn">
        <div class="btn ion-activatable flex al-center jc-center ripple-parent">
          <ion-icon aria-hidden="true" :icon="camera" />
          <ion-ripple-effect type="bounded"></ion-ripple-effect>
        </div>
      </div>
      <div class="the-form">
        <div class="input-item">
          <ion-item lines="none">
            <div class="flex al-center jc-center" slot="start">
              <img src="/public/assets/imgs/icn-group.svg" alt="" />
            </div>
            <ion-input
              v-model="newConversationBody.conversation_name"
              placeholder="Nombre del grupo"
            />
          </ion-item>
        </div>
        <div class="input-item">
          <ion-item lines="none">
            <div class="flex al-center jc-center" slot="start">
              <img src="/public/assets/imgs/icn-des.svg" alt="" />
            </div>
            <ion-input
              v-model="newConversationBody.description"
              placeholder="Descripción del grupo"
            />
          </ion-item>
        </div>
      </div>
      <div class="avatar-list" v-if="users.length > 0">
        <div
          class="avatar-holder ion-text-center"
          v-for="(group, index) in users"
          :key="index"
        >
          <ion-avatar>
            <img :src="group.person.photo" alt="" />
          </ion-avatar>
          <h6>{{ group.access_code }}</h6>
        </div>
      </div>
     
      <ion-fab
        slot="fixed"
        vertical="bottom"
        horizontal="end"
        @click="senMessageIfEmptyConversation(newConversationBody)"
      >
        <ion-fab-button>
          <ion-icon aria-hidden="true" :icon="save" />
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar } from "@ionic/vue";
import { arrowForward, camera, save, searchOutline } from "ionicons/icons";
import "./NewGroupPage.scss";
import { useRouter } from "vue-router";
import { onMounted, ref, Ref } from "vue";
import { useNewGroup } from "../Groups/store/new-group.store";
import { ChatUser } from "@/logic/interfaces/iChatUser";
import { INewConversation } from "../Conversation/interfaces";
import { supabase } from "@/utils/SupabaseClient";
import { useCurrentConversation } from "../Conversation/store/current-conversation.store";

let newGroup = useNewGroup();
let users: Ref<ChatUser[]> = ref([]);
const current_conversation = useCurrentConversation();
let nameGroup: Ref<string> = ref("");
let descriptionGroup: Ref<string> = ref("");
const router = useRouter();

const goProfile = () => {
  router.replace("/profile");
};

let newConversationBody: Ref<INewConversation> = ref({
  conversation_name: "",
  description: "",
  conversation_type: 2,
  chat_users_ids: [],
  auth_ids: [],
  content: {
    text: "",
  },
});

let senMessageIfEmptyConversation = async ({
  conversation_type,
  chat_users_ids,
  auth_ids,
  conversation_name,
  description,
}: INewConversation) => {
  let { data, error } = await supabase.rpc("create_group", {
    authids: auth_ids,
    chatusersids: chat_users_ids,
    conversationdescription: description,
    conversationname: conversation_name,
    conversationtype: conversation_type,
  });
  if (error) return;
  goLoadingConversationPage(data.id);
};

const goLoadingConversationPage = (id: number) => {
  router.replace({
    path: `/loading-conversation/GROUP/${id}/GROUP`,
  });
};
onMounted(async () => {
  users.value = newGroup.getNewGroups().users;
  users.value.forEach((x) => {
    newConversationBody.value.chat_users_ids.push(x.id);
    newConversationBody.value.auth_ids.push(x.person?.auth_id ?? "");
  });
});
</script>
