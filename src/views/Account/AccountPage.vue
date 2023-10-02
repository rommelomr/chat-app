<template>
  <ion-page class="account-page">
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button
            defaultHref="tabs/tab4"
            mode="ios"
            text=""
          ></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center"> Cuenta </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="section">
        <div class="title">
          <h3 class="ion-text-wrap">
            Quienes pueden ver tu información personal
          </h3>
          <p class="ion-text-wrap">
            En esta sección puedes habilitar los permisos para que otras
            personas queden restringidos
          </p>
        </div>
        <div class="detail" @click="openModal(0)">
          <h4>Ultima conexión</h4>
          <h5>{{ lastConnectionIsPublic }}</h5>
        </div>
        <div class="detail" @click="openModal(1)">
          <h4>Avatar del perfil</h4>
          <h5>{{ getAvatarVisibility }}</h5>
        </div>
        <div class="detail" @click="openModal(2)">
          <h4>Sobre ti</h4>
          <h5>{{ getAboutMeVisibility }}</h5>
        </div>

        <div class="detail flex al-start jc-between">
          <div class="left">
            <h4>Confirmación de lectura</h4>
            <h6 class="ion-text-wrap">
              Si tienes habilitada esta opción, las demás personas no podrán ver
              cuando leas sus mensajes
            </h6>
          </div>
          <ion-toggle
            :checked="getReadConfirmation"
            mode="md"
            @ionChange="onChangeReadConfirmation"
          ></ion-toggle>
        </div>
      </div>

      <div class="section">
        <div class="detail" @click="openModal(3)">
          <h4>Cambiar contraseña</h4>
          <h5>*******</h5>
        </div>

        <div class="detail" @click="openModal(4)">
          <div class="flex al-center jc-between">
            <h4>Tiempo de borrado de mensajes</h4>
          </div>
          <div class="wrapper flex al-center">
            <ion-item lines="none">
              {{ getAutodeleteTime }}
              <ion-icon src="/public/assets/imgs/icn-time.svg" slot="start" />
            </ion-item>
          </div>
        </div>
      </div>

      <!-- <ion-alert
        mode="md"
        :is-open="isOpen"
        header="Cambiar contraseña"
        :buttons="alertButtons"
        :inputs="alertInputs"
        @didDismiss="setOpen(false)"
      ></ion-alert> -->
      <ion-alert
        mode="md"
        :is-open="modal.is_open"
        :header="'Seleccione una opción'"
        :buttons="modal.buttons"
        :inputs="modal.inputs"
        @ionAlertDidDismiss="onCloseModal"
      ></ion-alert>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar } from "@ionic/vue";
import "./AccountPage.scss";
import { useRouter } from "vue-router";
import { ref, onMounted, reactive, computed } from "vue";
import { useAccountStore } from "@/stores/account-store";
import { useAuthStore } from "@/stores/auth.store";

const account_store = useAccountStore();
const router = useRouter();

const isOpen = ref(false);

const alertButtons = [
  {
    text: "Cambiar",
    cssClass: "alert-button-ok",
  },
];

const alertInputs = [
  {
    name: "Contraseña anterior",
    placeholder: "Contraseña actual",
    type: "number",
  },
  {
    name: "Nueva contraseña",
    placeholder: "Nueva contraseña",
    type: "number",
  },
  {
    name: "Confirmar nueva contraseña",
    placeholder: "Repetir nueva contraseña",
    type: "number",
  },
];

const setOpen = (state: boolean) => {
  isOpen.value = state;
};

let account_data = reactive({
  last_connection_visibility: -1,
  avatar_visibility: -1,
  about_me_visibility: -1,
  read_confirmation: false,
  messages_duration: "",
  inactivity_time: "",
});

const getAccountData = async () => {
  const auth_user = useAuthStore();
  let response = await account_store.getAccountBy(
    "chat_user_id",
    auth_user.getUser().chat_user_id
  );
  return response.data;
};
const setAccountData = async () => {
  let _account_data = await getAccountData();
  account_data.last_connection_visibility =
    _account_data.last_connection_visibility;
  account_data.messages_duration = _account_data.messages_duration;
  account_data.avatar_visibility = _account_data.avatar_visibility;
  account_data.about_me_visibility = _account_data.about_me_visibility;
  account_data.inactivity_time = _account_data.inactivity_time;
  account_data.read_confirmation = _account_data.read_confirmation;
};

const lastConnectionIsPublic = computed(() => {
  if (account_data.last_connection_visibility == -1) return "Cargando";
  if (account_data.last_connection_visibility == 0) return "Privado";
  if (account_data.last_connection_visibility == 1) return "Público";
  if (account_data.last_connection_visibility == 2) return "Mis contactos";
});

const getAutodeleteTime = computed(() => {
  return account_data.messages_duration
    ? alert_inputs[2].filter((input: any) => {
        return input.value == account_data.messages_duration;
      })[0].label
    : "Desactivado";
});

const getAvatarVisibility = computed(() => {
  if (account_data.avatar_visibility == -1) return "Cargando";
  if (account_data.avatar_visibility == 0) return "Privado";
  if (account_data.avatar_visibility == 1) return "Público";
  if (account_data.avatar_visibility == 2) return "Mis contactos";
});

const getAboutMeVisibility = computed(() => {
  if (account_data.about_me_visibility == -1) return "Cargando";
  if (account_data.about_me_visibility == 0) return "Privado";
  if (account_data.about_me_visibility == 1) return "Público";
  if (account_data.about_me_visibility == 2) return "Mis contactos";
});

const getReadConfirmation = computed(() => {
  return account_data.read_confirmation;
});

let modal = reactive({
  selected_option: "",
  is_open: false,
  inputs: [{}],
  buttons: ["Guardar"],
});
const MODAL_TYPE = new Map<number, string>([
  [0, "last_connection"],
  [1, "avatar_visibility"],
  [2, "about_me_visibility"],
  [3, "change_password"],
  [4, "messages_duration"],
]);
const alert_inputs = [
  [
    {
      label: "Público",
      type: "radio",
      value: "all",
    },
    {
      label: "Privado",
      type: "radio",
      value: "none",
    },
  ],
  [
    {
      name: "last_password",
      placeholder: "Contraseña actual",
      type: "password",
      attributes: {
        maxlength: 4,
      },
    },
    {
      name: "new_password",
      placeholder: "Nueva contraseña",
      type: "password",
      attributes: {
        maxlength: 4,
      },
    },
    {
      name: "confirm_new_password",
      placeholder: "Repetir nueva contraseña",
      type: "password",
      attributes: {
        maxlength: 4,
      },
    },
  ],
  [
    {
      label: "1 Día",
      type: "radio",
      value: "1440",
    },
    {
      label: "2 Días",
      type: "radio",
      value: "2880",
    },
    {
      label: "5 Días",
      type: "radio",
      value: "7200",
    },
    {
      label: "10 Días",
      type: "radio",
      value: "14400",
    },
    {
      label: "Nunca",
      type: "radio",
      value: "0",
    },
  ],
];

const MODAL_INPUTS = new Map<number, Array<object>>([
  [0, alert_inputs[0]],
  [1, alert_inputs[0]],
  [2, alert_inputs[0]],
  [3, alert_inputs[1]],
  [4, alert_inputs[2]],
]);

const openModal = (inputs_index: number) => {
  let type = MODAL_TYPE.get(inputs_index);
  if (!type) return;
  let inputs = MODAL_INPUTS.get(inputs_index);
  if (!inputs) return;
  modal.is_open = true;
  modal.selected_option = type;
  modal.inputs = inputs;
};
const MODAL_ACTIONS = new Map<string, Function>([
  [
    "last_connection",
    async (value: any) => {
      let response = await account_store.updateAccount({
        last_connection_visibility: value == "all" ? 1 : 0,
      });
      account_data.last_connection_visibility = value == "all" ? 1 : 0;
    },
  ],
  [
    "messages_duration",
    async (value: any) => {
      account_data.messages_duration = value == "0" ? null : value;
      let response = await account_store.updateAccount({
        messages_duration: value == "0" ? null : value,
      });
    },
  ],
  [
    "avatar_visibility",
    async (value: any) => {
      let response = await account_store.updateAccount({
        avatar_visibility: value == "all" ? 1 : 0,
      });
      account_data.avatar_visibility = value == "all" ? 1 : 0;
    },
  ],
  [
    "about_me_visibility",
    async (value: any) => {
      let response = await account_store.updateAccount({
        about_me_visibility: value == "all" ? 1 : 0,
      });
      account_data.about_me_visibility = value == "all" ? 1 : 0;
    },
  ],
  [
    "read_confirmation",
    async (read_confirmation: any) => {
      let response = await account_store.updateAccount({
        read_confirmation,
      });
      account_data.read_confirmation = read_confirmation;
    },
  ],
  [
    "change_password",
    async (inputs: any) => {
      if (inputs.new_password != inputs.confirm_new_password) {
        alert("Las contraseñas no coinciden");
        return;
      }
      let response = await account_store.resetPassword(
        `${inputs.new_password}..`
      );
      console.log(response);
    },
  ],
  [
    "change_message_duration",
    async (read_confirmation: any) => {
      // let response = await account_store.updateAccount({
      //   read_confirmation,
      // });
      // account_data.read_confirmation = read_confirmation;
      alert("cambia duracion de mensaje mi loco");
    },
  ],
]);
const updateAccount = (value: string, option: string) => {
  if (value != undefined) {
    let funct = MODAL_ACTIONS.get(option);
    if (funct) funct(value);
  }
};
const onCloseModal = (event: any) => {
  console.log(event.detail.data);
  if (event.detail.data)
    updateAccount(event.detail.data.values, modal.selected_option);
  modal.is_open = false;
  modal.selected_option = "";
  modal.inputs = [];
};

const onChangeReadConfirmation = (event: any) => {
  updateAccount(event.detail.checked, "read_confirmation");
};
onMounted(() => {
  setAccountData();
});
</script>
