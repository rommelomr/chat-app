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
      <div
        class="dp-holder ion-text-center ion-padding"
        v-if="
          !partner_is_my_contact &&
          !conversations_store.getCurrentConversation().groups
        "
      >
        Esta persona no esta en tu lista de contactos

        <a @click="addContact">Agregar a mis contactos</a>
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
          style="margin-top: 5px; margin-bottom: 5px"
          v-for="(
            pivot_chat_user, i
          ) in conversations_store.getConversationDetails().data
            .chat_users_conversations"
          :key="'conversation_' + i"
        >
          {{ pivot_chat_user.chat_user.access_code }}
          <ion-icon
            src="/public/assets/imgs/block.svg"
            slot="start"
            @click="openDeleteParticipantModal()"
          />
        </div>
        <div style="margin-top: 12px; font-size: 12px">
          <a @click="openAddParticipantsModal">Agregar participante</a>
        </div>
      </div>

      <div class="seperator"></div>

      <div
        class="last"
        v-if="conversations_store.getCurrentConversation().groups"
      >
        <ion-item button lines="none" detail="false">
          <ion-icon src="/public/assets/imgs/block.svg" slot="start" />
          <ion-label>Salir del grupo</ion-label>
        </ion-item>
      </div>

      <div class="last" v-else>
        <ion-item button lines="none" detail="false">
          <ion-icon
            src="/public/assets/imgs/block.svg"
            @click="openDeleteParticipantModal"
            slot="start"
          />
          <ion-label>Bloquear contacto</ion-label>
        </ion-item>
      </div>

      <!-- <div class="seperator" style="margin-top: 0"></div>

      <div class="last">
        <ion-item button lines="none" detail="false">
          <ion-icon src="/public/assets/imgs/reporter.svg" slot="start" />
          <ion-label>Reportar contacto</ion-label>
        </ion-item>
      </div> -->
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
              <ion-button @click="createContact" fill="clear"
                >Guardar</ion-button
              >
            </div>
          </div>
        </div>
      </ion-content>
    </ion-modal>
    <HeaderModal
      v-if="modal.name != ''"
      static
      :size="modal.size"
      :title="modal.title"
      :show="modal.show"
      :text="modal.text"
      @on-footer-button-clicked="onFooterButtonClicked"
      @on-close-modal="onCloseModal"
      :footerButtons="getButtons"
    >
      <div class="the-list" v-if="modal.name == 'add_participant'">
        <div v-for="(info_card_contact, i) in info_card_contacts">
          <ion-item
            :class="[info_card_contact.disabled && 'contact-disabled']"
            @click="onSelectContact(i, info_card_contact)"
          >
            <ion-avatar slot="start">
              <img
                :src="'/assets/imgs/avatar/' + info_card_contact.image"
                alt=""
              />
            </ion-avatar>
            <ion-label>
              <h3>
                {{ info_card_contact.title }}
              </h3>
              <p>{{ info_card_contact.subtitle }}</p>
            </ion-label>
            <span v-if="detectCheck(i)" class="checked"></span>
            <span v-if="info_card_contact.disabled" style="font-size: 13px"
              >Ya es participante</span
            >
          </ion-item>
        </div>
      </div>
    </HeaderModal>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, modalController } from "@ionic/vue";
import { ellipsisVertical, searchOutline } from "ionicons/icons";
import "./ConversationDetails.scss";
import { useRouter } from "vue-router";
import { ref, reactive, watch, computed } from "vue";
import PreviewModal from "../Modals/PreviewModal.vue";
import { useConversationsStore } from "@/stores/conversations-store";
import { Vue3Lottie } from "vue3-lottie";
import Sound from "../../../public/assets/lottie-files/sound.json";
import { useContactsStore } from "@/stores/contacts-store";
import { useGroupsStore } from "@/stores/groups-store";
import { useAuthStore } from "@/stores/auth.store";
import { useCurrentConversation } from "@/views/Conversation/store/current-conversation.store";
import Utils from "@/utils/Utils";
const chat_users_store = useContactsStore();
const conversations_store = useConversationsStore();
let im_contact_of_partner =
  Object.keys(conversations_store.getConversationDetails().im_contact).length >
  0;

let partner_is_my_contact = ref(
  Object.keys(conversations_store.getConversationDetails().contact).length > 0
);
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

let modal = reactive({
  text: "",
  name: "",
  size: "",
  show: false,
  title: "",
});

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

let isModalOpen = ref(false);
let new_contact_name = ref("");

const dismissModal = () => {
  isModalOpen.value = false;
  new_contact_name.value = "";
};

const createContact = async () => {
  let _partner =
    conversations_store.getConversationDetails().data
      .chat_users_conversations[0].chat_user;

  const store_response = await chat_users_store.addContact(
    _partner.id,
    new_contact_name.value
  );
  conversations_store.getConversationDetails().contact = store_response.data;

  partner_is_my_contact.value = true;
  isModalOpen.value = false;
  conversations_store.getCurrentConversation().label = new_contact_name.value;
};

const addContact = () => {
  isModalOpen.value = true;
};

let info_card_contacts = ref([]);
const parseContactsToInfoCard = (contacts: any) => {
  console.log(contacts);
  let _info_card_contacts = [] as any[];
  const current_conversation = useCurrentConversation();
  contacts.map((contact: any) => {
    _info_card_contacts.push({
      original: contact,
      image: contact.chat_user.person.photo + ".svg",
      title: contact.nickname,
      subtitle: contact.chat_user.access_code,
      disabled:
        current_conversation.getGroupContacts()[
          contact.chat_user.access_code
        ] != undefined,
    });
  });
  return _info_card_contacts;
};
const openAddParticipantsModal = async () => {
  modal.name = "add_participant";
  modal.show = true;
  modal.title = "Agregar participante";
  modal.size = "md";
  const groups_store = useGroupsStore();
  const auth_store = useAuthStore();
  const _contacts = await groups_store.fetchContactsOf({
    id: auth_store.getUser().chat_user_id,
  });

  info_card_contacts.value = parseContactsToInfoCard(_contacts.data);
};

const openDeleteParticipantModal = () => {
  modal.name = "delete_participant";
  modal.show = true;
  modal.title = "Sacar del grupo";
  modal.size = "sm";
  modal.text = "¿Esta seguro que desea eliminar a este participante?";
};

const onCloseModal = () => {
  modal.show = false;
  modal.name = "";
  modal.title = "";
  modal.size = "";
  modal.text = "";
};
const addParticipants = async () => {
  let _contacts = [] as any[];
  selected_contacts_index.value.map((selected_contact: any) => {
    _contacts.push(info_card_contacts.value[selected_contact].original);
  });

  const response = await conversations_store.addChatUsersToConversations(
    _contacts
  );

  conversations_store.conversation_details.data.chat_users_conversations = [
    ...conversations_store.conversation_details.data.chat_users_conversations,
    ..._contacts,
  ];
  conversations_store.group_contacts.contacts = {
    ...conversations_store.group_contacts.contacts,
    ...Utils.parseContactsToStorage(_contacts),
  };
};
const deleteParticipant = async () => {
  alert("borralo menor");
};
const onFooterButtonClicked = (emitted: any) => {
  if (emitted.data.footer_button.name == "delete_participant")
    deleteParticipant();

  if (emitted.data.footer_button.name == "add_participants") addParticipants();
  if (emitted.data.footer_button.close) onCloseModal();
};

let selected_contacts_index = ref([]);
const onSelectContact = (index: number, contact: any) => {
  if (contact.disabled) return;
  let index_of = selected_contacts_index.value.indexOf(index);
  if (index_of == -1) {
    selected_contacts_index.value.push(index);
  } else {
    selected_contacts_index.value.splice(index_of, 1);
  }
};

const detectCheck = (index: any) => {
  return selected_contacts_index.value.indexOf(index) != -1;
};
const getButtons = computed(() => {
  if (modal.name == "add_participant")
    return addParticipantsFooterButtons.value;
  else
    return [
      {
        label: "Cancelar",
        type: "danger",
        close: true,
      },
      {
        label: "Aceptar",
        type: "success",
        name: "delete_participant",
        close: true,
      },
    ];
});
const addParticipantsFooterButtons = computed(() => {
  let buttons = [
    {
      label: "Cancelar",
      type: "danger",
      close: true,
      name: "",
    },
  ];
  console.log(selected_contacts_index.value.length);
  if (selected_contacts_index.value.length > 0) {
    buttons.push({
      label: "Guardar",
      type: "success",
      name: "add_participants",
      close: true,
    });
  }
  return buttons;
});
</script>
<style scoped>
.the-list {
  margin-bottom: 10px;
}

.the-list ion-avatar {
  --border-radius: 50%;
  height: 3rem;
  width: 3rem;
}

.the-list ion-label h3 {
  font-family: "Medium";
  font-size: 16px;
}

.the-list ion-label h3 span {
  color: #9c9c9c;
  font-size: 11px;
}

.the-list ion-label img {
  margin-right: 10px;
}

.the-list ion-label p {
  color: #9c9c9c;
  font-family: "Medium";
  font-size: 13px;
}

.the-list ion-badge {
  border-radius: 50%;
  height: 1.5rem;
  width: 1.5rem;
}

.contact-disabled {
  opacity: 0.5;
}
.checked {
  display: inline-block;
  width: 20px;
  height: 20px;
  background-color: #2ecc71; /* Cambia el color como desees */
  border-radius: 50%; /* Esto crea un círculo */
  position: relative;
}

.cross::before {
  content: "X"; /* Símbolo de X Unicode */
  color: red; /* Cambia el color de la X, en este caso a rojo */
  font-size: 24px; /* Cambia el tamaño de la fuente de la X */
  font-weight: 20px;
}
.checked::before {
  content: "\2713"; /* Código de verificación Unicode */
  color: #fff; /* Cambia el color del icono de verificación */
  font-size: 18px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.unchecked {
  display: inline-block;
  width: 20px;
  height: 20px;
  background-color: #3498db; /* Cambia el color como desees */
  border-radius: 50%; /* Esto crea un círculo */
}
</style>
