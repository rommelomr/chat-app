<template>
  <ion-page class="welcome-page" @ionViewWillEnter="onPageLoaded">
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-grid style="height: 100%">
        <ion-row
          class="ion-justify-content-center ion-align-items-center"
          style="height: 100%"
        >
          <div class="holder ion-text-center">
            <h3>Bienvenido a nuestro chat</h3>
            <div class="img-holder">
              <img src="assets/imgs/welcome.svg" alt="" />
              <p class="ion-text-wrap">
                Este chat esta cifrado de extremo a extremo
              </p>

              <div class="bottom-holder">
                <h6 class="ion-text-wrap">
                  Puedes leer nuestras <span>políticas de Privacidad</span>, al
                  continuar estas aceptando nuestros
                  <span>Términos y Condiciones</span>
                </h6>

                <div class="btn-holder ion-padding">
                  <ion-button expand="block" @click="setAccesTypeOpen(true)">
                    AGREGAR Y CONTINUAR
                  </ion-button>
                </div>
              </div>
            </div>
          </div>
        </ion-row>
      </ion-grid>
      <ion-alert
        mode="md"
        :is-open="acces_type_open"
        header="Tipo de cuenta"
        :buttons="alert_buttons"
        :inputs="alert_inputs"
        @didDismiss="goNextPage"
      ></ion-alert>

      <ion-alert
        class="custom-alert"
        :is-open="error_alert_open"
        header="Mensaje"
        sub-header=""
        message="Este dispositivo ya tiene un usuario asignado,vuelva a intentarlo"
        :buttons="alert_buttons2"
        @didDismiss="setErrorAlertOpen(false)"
      ></ion-alert>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonAlert, IonPage, onIonViewDidEnter } from "@ionic/vue";
import "./WelcomePage.scss";
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";

const router = useRouter();
let acces_type_open = ref(false);
let error_alert_open = ref(false);

const alert_buttons = ["OK"];
const alert_buttons2 = [
  {
    text: "CERRAR",
    role: "confirm",
    cssClass: "alert-button-ok",
    handler: () => {
      setErrorAlertOpen(false);
      setTimeout(() => {
        goHome();
      }, 200);
    },
  },
];
const alert_inputs = [
  {
    label: "Ya tengo cuenta",
    type: "radio",
    value: "sign-in",
  },
  {
    label: "Nueva cuenta",
    type: "radio",
    value: "sign-up",
  },
];

const is_obtain_code = router.currentRoute.value.query.isObtaincode;

const goNextPage = (next_page_info: any) => {
  let _selectedOption = next_page_info.detail.data.values;

  _selectedOption == "sign-in"
    ? router.replace("/entercode")
    : router.replace("/obtaincode");
};

const goHome = () => {
  router.replace("/tabs/tab1");
};
const onPageLoaded = () => {
  console.log(is_obtain_code);
  setTimeout(() => {
    if (is_obtain_code) {
      setErrorAlertOpen(true);
    }
  }, 500);
};

onMounted(() => {
  const ionViewDidEnter = onIonViewDidEnter(onPageLoaded);
  ionViewDidEnter();
});

const setAccesTypeOpen = (state: boolean) => {
  acces_type_open.value = state;
};

const setErrorAlertOpen = (state: boolean) => {
  error_alert_open.value = state;
};
</script>
