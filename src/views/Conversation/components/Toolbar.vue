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
          <img :src="getConversationPhoto()" />
        </ion-avatar>
        <ion-label>
          <h3>{{ currentConversation.label }}</h3>
          <p>
            {{ show_online_message ? "online" : getLastTime() }}
          </p>
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
    <!-- <ion-modal
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
    </ion-modal> -->
    <ion-modal class="ion-modall" :is-open="isModalOpen" @dismiss="() => {}">
      <ion-content class="modall ion-padding">
        <div class="holder">
          <div class="section">
            <h3>Ingrese Nick Name</h3>
            <ion-item>
              <ion-input v-model="new_contact_name" />
            </ion-item>
            <div class="btns-holder flex al-center jc-end">
              <ion-button fill="clear" @click="dismissModal"
                >Cancelar</ion-button
              >
              <ion-button @click="changeContactName" fill="clear"
                >Guardar</ion-button
              >
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
import { Ref, ref, onMounted, watch } from "vue";
import {
  useCurrentConversation,
  ICurrentConversation,
} from "../store/current-conversation.store";
import Details from "./Details.vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/stores/app-store";
import { useConversationsStore } from "@/stores/conversations-store";
import { useContactsStore } from "@/stores/contacts-store";

let new_contact_name = ref("");
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
      partner: conversations_store.getCurrentConversation().userConversation,
    });

    router.replace("/conversationdetails");
  });
};
let isModalOpen = ref(false);

const { getCurrentConversation } = useCurrentConversation();
const conversation_store = useConversationsStore();
const currentConversation: Ref<ICurrentConversation | undefined> = ref();
const modalRef = ref(null);
let open_modal = ref(false);

const isOpen = ref(true);

const openModal = () => {
  //@ts-ignore
  isModalOpen.value = true;
};

const dismissModal = () => {
  isModalOpen.value = false;
};
const changeContactName = async () => {
  const contacts_store = useContactsStore();
  await contacts_store.changeContactName(
    new_contact_name.value,
    conversation_store.getCurrentConversation().contact_id
  );
  currentConversation.value.label = new_contact_name.value;
  isModalOpen.value = false;
};
const conversationIsGroup = () => {
  return currentConversation.value.type == "GROUP";
};
const conversationIsLoading = () => {
  return currentConversation.value.label == "Loading..";
};
const getConversationPhoto = () => {
  if (conversationIsLoading()) return `/assets/imgs/avatar/empty.svg`;
  let _is_group = currentConversation.value.type == "GROUP";
  if (_is_group)
    return `/assets/imgs/landscapes/${
      currentConversation.value.label_image ?? 1
    }.svg`;

  let _partner_photo_is_public =
    currentConversation.value?.userConversation.account[0].avatar_visibility ==
    1;
  let _partner_photo = `/assets/imgs/avatar/${
    currentConversation.value.label_image ?? 1
  }.svg`;

  if (_partner_photo_is_public) return _partner_photo;

  return `/assets/imgs/avatar/${
    currentConversation.value.im_contact
      ? currentConversation.value.label_image
      : "empty"
  }.svg`;
};
let setCurrentConversation = () => {
  currentConversation.value = getCurrentConversation();
};
let lastTimeIsPrivate = () => {
  return (
    currentConversation.value?.userConversation.account[0]
      .last_connection_visibility == 0
  );
};
const getLastTime = () => {
  if (conversationIsLoading() || conversationIsGroup() || lastTimeIsPrivate())
    return "";

  let _date_time =
    currentConversation.value.userConversation.account[0].last_connection.split(
      "+"
    )[0];
  _date_time = _date_time.split(".")[0];
  _date_time = _date_time.split("T");
  return _date_time[1] + " " + _date_time[0];
};
let show_online_message = ref(false);
let show_online_timeout = null;
const keepOnlineMessage = () => {
  show_online_message.value = true;
  clearTimeout(show_online_timeout);
  show_online_timeout = setTimeout(() => {
    show_online_message.value = false;
  }, 17000);
};
watch(
  () => conversation_store.my_conversations_realtime.partner_last_connection,
  () => {
    keepOnlineMessage();
  }
);
setCurrentConversation();
const suscribeToPartnerAccount = () => {
  conversation_store.suscribeToPartnerAccount();
};
const getPartner = () => {
  return currentConversation.value.userConversation;
};
const detectPartnerOnline = () => {
  let _last_connection_date = new Date(
    getPartner()?.account[0].last_connection
  );
  _last_connection_date.setSeconds(_last_connection_date.getSeconds() + 15);
  let _current_date = new Date();
  console.log(_last_connection_date);
  console.log(_current_date);
  if (_last_connection_date >= _current_date) {
    show_online_message.value = true;
  }
};
onMounted(() => {
  detectPartnerOnline();
  suscribeToPartnerAccount();
});
</script>
