<template>
  <ion-page class="newgroup-page">
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="" mode="ios" text=""></ion-back-button>
        </ion-buttons>
        <ion-title> Pedrito </ion-title>
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
          " La vida es bueno y debemos vivirla, como es una de las personas mas
          "
        </h4>
      </div>

      <div class="seperator"></div>

      <div class="multimedia ion-padding">
        <h3>Multimedia</h3>
        <ion-row>
          <ion-col size="3">
            <div class="img-holder flex al-center jc-center">
              <img src="/public/assets/imgs/icn-gallery.svg" alt="" />
            </div>
          </ion-col>
          <ion-col size="3">
            <div class="img-holder flex al-center jc-center">
              <img src="/public/assets/imgs/icn-gallery.svg" alt="" />
            </div>
          </ion-col>
          <ion-col size="3">
            <div class="img-holder flex al-center jc-center">
              <img src="/public/assets/imgs/icn-gallery.svg" alt="" />
            </div>
          </ion-col>
          <ion-col size="3">
            <div class="img-holder flex al-center jc-center">
              <img src="/public/assets/imgs/icn-gallery.svg" alt="" />
            </div>
          </ion-col>
        </ion-row>
      </div>
      <div class="seperator"></div>

      <div class="section">
        <h3>Codigo de usuario</h3>
        <div class="contact-holder flex al-center jc-between">
          <h4>123456</h4>
          <div class="btn-holder flex al-center">
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
          </div>
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
import { IonPage, IonHeader, IonToolbar } from "@ionic/vue";
import { ellipsisVertical, searchOutline } from "ionicons/icons";
import "./MainViewGroupPage.scss";
import { useRouter } from "vue-router";
import { ref } from "vue";

const router = useRouter();

const goProfile = () => {
  router.replace("/profile");
};
</script>
