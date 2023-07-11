<template>
  <ion-page class="obtaincode-page">
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="title">
        <h3>Codigo de usuario generado</h3>
        <h6 class="ion-text-wrap">
          Estamos procesando tu dispositivo para crear un usuario valido para el
          uso del chat.
        </h6>
      </div>
      <div class="section">
        <div class="sub-title">
          <h4>Código asignado</h4>
        </div>

        <ion-row class="code-section">
          <ion-col size="7">
            <h1>{{ register_store.getCreatedUser().access_code }}</h1>
          </ion-col>
          <ion-col size="1" class="flex al-center jc-start">
            <div class="bar"></div>
          </ion-col>
          <ion-col size="4" class="flex al-center jc-start">
            <div
              class="btn ion-activatable flex al-center jc-center ripple-parent"
            >
              <ion-icon aria-hidden="true" :icon="copyOutline" />
              <ion-ripple-effect type="bounded"></ion-ripple-effect>
            </div>
          </ion-col>
        </ion-row>

        <div class="otp-holder">
          <div class="sub-title">
            <h4>Contraseña</h4>
          </div>
          <ion-grid>
            <ion-row class="ion-align-items-center ion-justify-content-center">
              <ion-col size="2">
                <div class="input-holder">
                  <ion-input
                    v-model="password.first"
                    type="tel"
                    #otp1
                    class="otp"
                    maxlength="1"
                  >
                  </ion-input>
                </div>
              </ion-col>
              <ion-col size="2" offset="1">
                <div class="input-holder">
                  <ion-input
                    v-model="password.second"
                    type="tel"
                    #otp2
                    class="otp"
                    maxlength="1"
                    size="1"
                  >
                  </ion-input>
                </div>
              </ion-col>
              <ion-col size="2" offset="1">
                <div class="input-holder">
                  <ion-input
                    v-model="password.third"
                    type="tel"
                    #otp3
                    class="otp"
                    pattern="[0-9]"
                    maxlength="1"
                    size="1"
                  >
                  </ion-input>
                </div>
              </ion-col>
              <ion-col size="2" offset="1">
                <div class="input-holder">
                  <ion-input
                    v-model="password.fourth"
                    type="tel"
                    #otp4
                    class="otp"
                    pattern="[0-9]"
                    maxlength="1"
                    size="1"
                  >
                  </ion-input>
                </div>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>
        <div class="otp-holder">
          <div class="sub-title">
            <h4>Confirmar contraseña</h4>
          </div>
          <ion-grid>
            <ion-row class="ion-align-items-center ion-justify-content-center">
              <ion-col size="2">
                <div class="input-holder">
                  <ion-input
                    type="tel"
                    #otp1
                    class="otp"
                    maxlength="1"
                    v-model="confirm_password.first"
                  >
                  </ion-input>
                </div>
              </ion-col>
              <ion-col size="2" offset="1">
                <div class="input-holder">
                  <ion-input
                    type="tel"
                    #otp2
                    class="otp"
                    maxlength="1"
                    size="1"
                    v-model="confirm_password.second"
                  >
                  </ion-input>
                </div>
              </ion-col>
              <ion-col size="2" offset="1">
                <div class="input-holder">
                  <ion-input
                    type="tel"
                    #otp3
                    class="otp"
                    pattern="[0-9]"
                    maxlength="1"
                    size="1"
                    v-model="confirm_password.third"
                  >
                  </ion-input>
                </div>
              </ion-col>
              <ion-col size="2" offset="1">
                <div class="input-holder">
                  <ion-input
                    type="tel"
                    #otp4
                    class="otp"
                    pattern="[0-9]"
                    maxlength="1"
                    size="1"
                    v-model="confirm_password.fourth"
                  >
                  </ion-input>
                </div>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>
      </div>
      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button @click="updatePassword">
          <ion-icon aria-hidden="true" :icon="arrowForward" />
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage } from "@ionic/vue";
import "./ObtainCodePage.scss";
import { useRouter } from "vue-router";
import { arrowForward, copyOutline } from "ionicons/icons";
import { useRegisterStore } from "@/stores/register-store";
import { reactive, onMounted } from "vue";

import { useAppStore } from "@/stores/app-store";
const app_store = useAppStore();

const register_store = useRegisterStore();
const router = useRouter();
let password = reactive({
  first: "",
  second: "",
  third: "",
  fourth: "",
});
let confirm_password = reactive({
  first: "",
  second: "",
  third: "",
  fourth: "",
});
const parsePassword = (password: object) => {
  let _password = "";
  for (let i in password) {
    _password = _password + "" + password[i];
  }
  return _password;
};
const updatePassword = async () => {
  let _password = parsePassword(password);
  let _confirm_password = parsePassword(confirm_password);
  if (_password == _confirm_password) {
    await register_store.updatePassword(_password);
    router.replace({
      path: "/welcome",
      query: {
        isObtaincode: true.toString(),
      },
    });
  } else {
    alert("las contraseñas no coinciden");
  }
};
onMounted(async () => {
  app_store.setAppIsLoading(false);
});
</script>
