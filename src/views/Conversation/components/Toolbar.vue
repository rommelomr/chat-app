<template>
  <ion-toolbar v-if="currentConversation">
    <ion-buttons slot="start">
      <ion-back-button
        defaultHref="/tabs/tab1"
        mode="ios"
        text=""
      ></ion-back-button>
    </ion-buttons>
    <ion-buttons slot="start">
      <ion-item lines="none" @click="goToConversationDetails">
        <ion-avatar slot="start">
          <img
            :src="`/assets/imgs/${
              currentConversation.type == 'GROUP' ? 'landscapes' : 'avatar'
            }/${currentConversation.label_image ?? 1}.svg`"
          />
        </ion-avatar>
        <ion-label>
          <h3>{{ currentConversation.label }}</h3>
          <p>Online</p>
        </ion-label>
      </ion-item>
    </ion-buttons>
    <!-- <ion-buttons slot="end">
      <ion-button id="end-btn">
        <ion-icon aria-hidden="true" :icon="call" />
      </ion-button>
    </ion-buttons>
    <ion-buttons slot="end">
      <ion-button id="end-btn">
        <ion-icon aria-hidden="true" :icon="videocam" />
      </ion-button>
    </ion-buttons> -->
    <ion-buttons slot="end">
      <ion-button id="click-trigger">
        <ion-icon aria-hidden="true" :icon="ellipsisVertical" />
      </ion-button>
      <ion-popover trigger="click-trigger" triggerAction="click">
        <ion-content class="pop ion-padding" :scrollEvents="false">
          <ion-item @click="openModal" button detail="false" lines="none">
            <ion-label> Re nombrar </ion-label>
          </ion-item>
        </ion-content>
      </ion-popover>
    </ion-buttons>
    <ion-modal
      class="ion-modall"
      :is-open="isModalOpen"
      @dismiss="dismissModal"
    >
      <ion-content class="modall ion-padding">
        <div class="holder">
          <div class="section">
            <h3>Ingrese Nick Name</h3>
            <ion-item>
              <ion-input value="Pedito" />
            </ion-item>
            <div class="btns-holder flex al-center jc-end">
              <ion-button fill="clear" @ionPress="dismissModal"
                >Cancelar</ion-button
              >
              <ion-button fill="clear">Guardar</ion-button>
            </div>
          </div>
        </div>
      </ion-content>
    </ion-modal>
    <ion-modal class="ion-modall" :is-open="modalRef" @dismiss="dismissModal">
      <ion-content class="modall ion-padding">
        <div class="holder">
          <div class="section">
            <h3>Ingrese Nick Name</h3>
            <ion-item>
              <ion-input value="Pedrito" />
            </ion-item>
            <div class="btns-holder flex al-center jc-end">
              <ion-button fill="clear" @ionPress="dismissModal"
                >Cancelar</ion-button
              >
              <ion-button fill="clear">Guardar</ion-button>
            </div>
          </div>
        </div>
      </ion-content>
    </ion-modal>
  </ion-toolbar>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonPopover,
  IonButtons,
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
} from "@ionic/vue";
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
import { Ref, ref } from "vue";
import {
  useCurrentConversation,
  ICurrentConversation,
} from "../store/current-conversation.store";
import Details from "./Details.vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/stores/app-store";
import { useConversationsStore } from "@/stores/conversations-store";
const app_store = useAppStore();

const router = useRouter();
const goToConversationDetails = async () => {
  const conversations_store = useConversationsStore();
  if (conversations_store.getCurrentConversation().isEmpty) {
    app_store.setToast({
      is_open: true,
      message: "Debes iniciar una conversación primero",
    });
    return;
  }
  await app_store.loadingBefore(async () => {
    let store_response = await conversations_store.loadConversationDetails({
      id: conversations_store.getCurrentConversation().id,
    });

    router.replace("/conversationdetails");
  });
};
const isModalOpen = ref(false);

const { getCurrentConversation } = useCurrentConversation();
const currentConversation: Ref<ICurrentConversation | undefined> = ref();
const modalRef = ref(null);
let open_modal = ref(false);

const isOpen = ref(true);

const openModal = () => {
  //@ts-ignore
  modalRef.value = true;
};

const dismissModal = () => {
  isModalOpen.value = false;
};
const closeModal = () => {
  //@ts-ignore
  modalRef.value.present();
};

let setCurrentConversation = () => {
  currentConversation.value = getCurrentConversation();
};
setCurrentConversation();
</script>
