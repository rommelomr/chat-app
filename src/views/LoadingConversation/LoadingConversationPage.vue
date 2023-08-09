<template>
  <ion-page class="conversation-page">
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button
            defaultHref="#"
            @click="this.$router.go(-1)"
            mode="ios"
            text=""
          ></ion-back-button>
        </ion-buttons>
        <ion-buttons slot="start">
          <ion-item lines="none" @click="goProfile">
            <ion-avatar slot="start">
              <img src="/public/assets/gifs/giphy.gif" alt="" />
            </ion-avatar>
            <ion-label>
              <h3>{{ $route.params.code }}</h3>
              <p>Loading...</p>
            </ion-label>
          </ion-item>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="chat-holder"></div>
    </ion-content>

    <ion-footer class="conversation-footer"> </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { IonPage, IonPopover, IonHeader, IonToolbar } from "@ionic/vue";
import {
  attachOutline,
  call,
  checkmarkDone,
  ellipsisVertical,
  mic,
  searchOutline,
  send,
  videocam,
} from "ionicons/icons";
import "./LoadingConversationPage.vue";
import { useRouter } from "vue-router";
import { supabase } from "@/utils/SupabaseClient";
import { useCurrentConversation } from "../Conversation/store/current-conversation.store";
import { IChatGroup } from "../Conversation/interfaces";
import { useAppStore } from "@/stores/app-store";
const app_store = useAppStore();
const router = useRouter();
const currentConversation = useCurrentConversation();

const isModalOpen = ref(false);
const openModal = () => {
  isModalOpen.value = true;
};
const dismissModal = () => {
  isModalOpen.value = false;
};
const goProfile = () => {
  router.replace("/profile");
};
const selectChatUserUseCase = async (id: number) => {
  app_store.setAppIsLoading(true);
  let messages: Array<any> = [];
  //currentConversation.reset();
  let { data, error } = await supabase.rpc("get_conversation_with_chat_user", {
    partnerchatuserid: id,
  });
  app_store.setAppIsLoading(false);

  if (data.conversation.status == 404) {
    currentConversation.setCurrentConversation({
      id: data.conversation.id ?? 0,
      type: "SINGLE",
      label: `${
        data.chat_user.person.name ??
        router.currentRoute.value.params.code.toString()
      }`,
      isEmpty: true,
      userConversation: data.chat_user,
      group: undefined,
      label_image: data.chat_user.person.photo,
      me: 0,
      me_uuid: "",
    });
  }
  if (data.conversation.status == 200) {
    currentConversation.setCurrentConversation({
      id: data.conversation.id,
      type: "SINGLE",
      label: `${
        data.chat_user.access_code ??
        router.currentRoute.value.params.code.toString()
      }`,
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
};

const selectChatGroups = async (id: number) => {
  app_store.setAppIsLoading(true);
  currentConversation.reset();

  let { data, error }: { data: IChatGroup[] | null; error: any } =
    await supabase
      .from("groups")
      .select(
        "*,conversations(*,participants_count:chat_users_conversations(count)),chat_users(*)"
      )
      .eq("id", id);
  app_store.setAppIsLoading(false);
  if (data && data?.length > 0) {
    currentConversation.setCurrentConversation({
      id: data[0].conversation_id,
      type: "GROUP",
      label: `${data[0].name}`,
      isEmpty: false,
      userConversation: undefined,
      group: data[0],
      label_image: data[0].photo,
      me: 0,
      me_uuid: "",
    });
  }
  router.replace({
    path: `/conversation`,
  });
};

onMounted(() => {
  if (router.currentRoute.value.params.type === "SINGLE") {
    //@ts-ignore
    let id = parseInt(router.currentRoute.value.params.id);
    selectChatUserUseCase(id);
  }
  if (router.currentRoute.value.params.type === "GROUP") {
    //@ts-ignore
    let id = parseInt(router.currentRoute.value.params.id);
    selectChatGroups(id);
  }
});
</script>
