<template>
  <ion-page class="entercode-page">
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="title">
        <h3>Ingrese su codigo de usuario</h3>
        <h6>
          Para poder ingresar a nuestro chat , es necesario que proporciones tu
          código de usuario suministrado.
        </h6>
      </div>

      <div class="section">
        <div class="sub-title">
          <h4>Codigo de usuario</h4>
        </div>
        <div class="the-form">
          <div class="input-item">
            <ion-item>
              <ion-icon aria-hidden="true" :icon="person" slot="start" />
              <ion-label position="inline"> Code </ion-label>
              <ion-input
                v-model="form_state.code"
                class="ion-text-center"
                placeholder="Codigo de usuario"
              />
            </ion-item>
          </div>
          <div class="input-item">
            <ion-item>
              <ion-input
                v-model="form_state.password"
                type="password"
                class="ion-text-left"
                placeholder="Contraseña"
              />
            </ion-item>
          </div>
        </div>
      </div>
      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button @click="signIn">
          <ion-icon aria-hidden="true" :icon="arrowForward" />
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage } from "@ionic/vue";
import { arrowForward, person, searchOutline } from "ionicons/icons";
import "./EnterCodePage.scss";
import { useRouter } from "vue-router";
import { ref, reactive } from "vue";
import { useAuthStore } from "@/stores/auth.store";

const router = useRouter();
const auth_store = useAuthStore();
let form_state = reactive({
  code: "",
  password: "",
});
const signIn = async () => {
  await auth_store.attemptLogin(form_state.code, form_state.password);
  router.replace({
    path: "/welcome",
    query: {
      isObtaincode: true.toString(),
    },
  });
};
</script>
