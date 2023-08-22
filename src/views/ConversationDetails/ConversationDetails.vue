<template>
  <ion-page class="newgroup-page" v-if="render_details">
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
          <img :src="getConversationImage()" alt="" />
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

        <div class="holder" v-if="hasFiles()">
          <div class="img-holder-container">
            <div
              class="img-holder"
              v-for="(
                file, index
              ) in conversations_store.getConversationDetails().files"
              :key="index"
              @click="openFile(file)"
            >
              <img
                style="object-fit: cover"
                v-if="file.mimetype == 'image'"
                :src="file.url"
              />
              <img
                style="background: white"
                v-if="file.mimetype == 'audio'"
                src="/public/assets/imgs/audio.svg"
              />
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
    <MediaLayout :is-active="file.is_active" @onExit="closeFile">
      <img v-if="file.type == 'image'" :src="file.url" />
      <audio
        v-else-if="file.type == 'audio'"
        controls
        :src="file.url"
        autoplay
      ></audio>
    </MediaLayout>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, modalController } from "@ionic/vue";
import { ellipsisVertical, searchOutline } from "ionicons/icons";
import "./ConversationDetails.scss";
import { useRouter } from "vue-router";
import { ref, reactive, watch } from "vue";
import PreviewModal from "../Modals/PreviewModal.vue";
import { useConversationsStore } from "@/stores/conversations-store";
import { Vue3Lottie } from "vue3-lottie";
import Sound from "../../../public/assets/lottie-files/sound.json";
const conversations_store = useConversationsStore();
const im_contact_of_partner =
  Object.keys(conversations_store.getConversationDetails().im_contact).length >
  0;

const partner_is_my_contact =
  Object.keys(conversations_store.getConversationDetails().contact).length > 0;
const router = useRouter();
const file = reactive({
  url: "",
  type: "",
  is_active: false,
});
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

const getChatUserDescription = () => {
  let _description: string =
    conversations_store.getConversationDetails().data
      .chat_users_conversations[0].chat_user.person.description;
  if (im_contact_of_partner) {
    return _description;
  }

  let _description_is_public: boolean =
    conversations_store.getConversationDetails().data
      .chat_users_conversations[0].chat_user.account[0].about_me_visibility ==
    1;
  if (_description_is_public) return _description;
  else return "Descripción no disponible.";
};

const getGroupDescription = () => {
  return conversations_store.getConversationDetails().data.group[0].description;
};

const getPartnerNickname = () => {
  return conversations_store.getConversationDetails().contact.nickname;
};

const getPartnerAccessCode = () => {
  return conversations_store.getConversationDetails().data
    .chat_users_conversations[0].chat_user.access_code;
};

const getChatUserName = () => {
  if (partner_is_my_contact) {
    return getPartnerNickname();
  }
  return getPartnerAccessCode();
};

const getGroupName = () => {
  return conversations_store.getConversationDetails().data.group[0].name;
};
const getDescription = () => {
  if (conversationIsSingle()) return getChatUserDescription();
  else return getGroupDescription();
};
const getConversationName = () => {
  if (conversationIsSingle()) {
    return getChatUserName();
  } else {
    return getGroupName();
  }
};
const openFile = async (selected_file: any) => {
  file.type = selected_file.mimetype;
  file.url = selected_file.url;
  file.is_active = true;
};
const closeFile = () => {
  file.is_active = false;
  file.type = "";
  file.url = "";
};

const getGroupImage = () => {
  let _group = conversations_store.getConversationDetails().data.group[0];
  return "/assets/imgs/landscapes/" + _group.photo + ".svg";
};

const getPartnerImage = () => {
  let _person =
    conversations_store.getConversationDetails().data
      .chat_users_conversations[0].chat_user.person;
  if (im_contact_of_partner) {
    return "/assets/imgs/avatar/" + _person.photo + ".svg";
  }
  if (
    conversations_store.getConversationDetails().data
      .chat_users_conversations[0].chat_user.account[0].avatar_visibility == 1
  ) {
    return "/assets/imgs/avatar/" + _person.photo + ".svg";
  }
  return "/assets/imgs/avatar/empty.svg";
};
const getConversationImage = () => {
  if (conversationIsSingle()) {
    return getPartnerImage();
  } else {
    return getGroupImage();
  }
};
const hasFiles = () => {
  return (
    conversations_store.getConversationDetails().files &&
    conversations_store.getConversationDetails().files.length > 0
  );
};

let render_details = ref(true);
watch(
  () => router.currentRoute.value.path,
  (path) => {
    render_details.value = false;
    if (path == "/conversation") conversations_store.resetConversationDetails();
  }
);
</script>
