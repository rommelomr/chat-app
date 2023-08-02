<template>
  <ion-page class="newgroup-page">
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button
            defaultHref="/conversation"
            mode="ios"
            text=""
          ></ion-back-button>
        </ion-buttons>
        <ion-title> {{ getConversationName() }} </ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear">
            <ion-icon aria-hidden="true" :icon="ellipsisVertical" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div class="dp-holder ion-text-center ion-padding">
        <ion-avatar>
          <img src="/public/assets/imgs/user.png" alt="" />
        </ion-avatar>
      </div>

      <div class="quote ion-padding">
        <h4 class="ion-text-wrap">
          {{ getDescription() }}
        </h4>
      </div>

      <div class="seperator"></div>

      <div class="multimedia ion-padding">
        <h3>Multimedia</h3>

        <div
          class="holder"
          v-if="conversations_store.getConversationDetails().files.length > 0"
        >
          <div class="img-holder-container">
            <div
              class="img-holder"
              v-for="(
                file, index
              ) in conversations_store.getConversationDetails().files"
              :key="index"
              @click="openModal(file)"
            >
              <img :src="file.url" />
            </div>
          </div>
        </div>
        <div v-else>Esta conversación no tiene archivos</div>
      </div>
      <div class="seperator"></div>

      <div class="section">
        <h3>
          {{ conversationIsSingle() ? "Código de usuario" : "Integrantes" }}
        </h3>
        <div
          class="contact-holder flex al-center jc-between"
          v-for="(
            pivot_chat_user, i
          ) in conversations_store.getConversationDetails().data
            .chat_users_conversations"
          :key="'conversation_' + i"
        >
          <h4>{{ pivot_chat_user.chat_user.access_code }}</h4>
          <!-- <div class="btn-holder flex al-center">
            <div
              class="btn ion-activatable flex al-center jc-center ripple-parent"
            >
              <ion-icon src="/public/assets/imgs/icn-time.svg" />
              <ion-ripple-effect type="bounded"></ion-ripple-effect>
            </div>

            <div
              class="btn ion-activatable flex al-center jc-center ripple-parent"
            >
              <ion-icon src="/public/assets/imgs/icn-call.svg" />
              <ion-ripple-effect type="bounded"></ion-ripple-effect>
            </div>

            <div
              class="btn ion-activatable flex al-center jc-center ripple-parent"
            >
              <ion-icon src="/public/assets/imgs/icn-video.svg" />
              <ion-ripple-effect type="bounded"></ion-ripple-effect>
            </div>
          </div> -->
        </div>
      </div>

      <div class="seperator"></div>

      <div class="last">
        <ion-item button lines="none" detail="false">
          <ion-icon src="/public/assets/imgs/block.svg" slot="start" />
          <ion-label>Bloquear usuario</ion-label>
        </ion-item>
      </div>
      <div class="seperator" style="margin-top: 0"></div>

      <div class="last">
        <ion-item button lines="none" detail="false">
          <ion-icon src="/public/assets/imgs/reporter.svg" slot="start" />
          <ion-label>Reportar contacto</ion-label>
        </ion-item>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, modalController } from "@ionic/vue";
import { ellipsisVertical, searchOutline } from "ionicons/icons";
import "./ConversationDetails.scss";
import { useRouter } from "vue-router";
import { ref } from "vue";
import PreviewModal from "../Modals/PreviewModal.vue";
import { useConversationsStore } from "@/stores/conversations-store";
const conversations_store = useConversationsStore();

const router = useRouter();

interface Item {
  src: string;
}

const groupList = ref([
  {
    src: "assets/imgs/user.png",
  },
  {
    src: "assets/imgs/man.png",
  },
  {
    src: "assets/imgs/bg.png",
  },
  {
    src: "assets/imgs/img.png",
  },
  {
    src: "assets/imgs/user.png",
  },
  {
    src: "assets/imgs/man.png",
  },
  {
    src: "assets/imgs/bg.png",
  },
  {
    src: "assets/imgs/img.png",
  },
]);
const conversationIsSingle = () => {
  return conversations_store.getCurrentConversation().type == "SINGLE";
};
const getDescription = () => {
  if (conversationIsSingle()) {
    return conversations_store.getConversationDetails().data
      .chat_users_conversations[0].chat_user.person.description;
  } else {
    return conversations_store.getConversationDetails().data.group[0]
      .description;
  }
};
const getConversationName = () => {
  if (conversationIsSingle()) {
    return conversations_store.getConversationDetails().data
      .chat_users_conversations[0].chat_user.access_code;
  } else {
    return conversations_store.getConversationDetails().data.group[0].name;
  }
};
const openModal = async (item: Item) => {
  console.log(item.src);
  const images = groupList.value.map((item) => item.src);
  const modal = await modalController.create({
    component: PreviewModal,
    componentProps: {
      images: images,
      selectedImage: item.src,
    },
  });

  await modal.present();
};
</script>
