<template>
  <ion-page class="conversation-page">
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="tabs/tab1" mode="ios" text=""></ion-back-button>
        </ion-buttons>
        <ion-buttons slot="start">
          <ion-item lines="none" @click="goProfile">
            <ion-avatar slot="start">
              <img src="assets/imgs/user.png" alt="">
            </ion-avatar>
            <ion-label>
              <h3>123456</h3>
              <p>Online</p>
            </ion-label>
          </ion-item>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button id="end-btn">
            <ion-icon aria-hidden="true" :icon="call" />
          </ion-button>

        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button id="end-btn">
            <ion-icon aria-hidden="true" :icon="videocam" />
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button id="click-trigger">
            <ion-icon aria-hidden="true" :icon="ellipsisVertical" />
          </ion-button>
          <ion-popover trigger="click-trigger" triggerAction="click">
            <ion-content class="pop ion-padding" :scrollEvents="false">
              <ion-item @click="openModal" button detail="false" lines="none">
                <ion-label>
                  Re nombrar
                </ion-label>
              </ion-item>
            </ion-content>
          </ion-popover>
          
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="chat-holder">
        <div class="reciver">
          <div class="chat-bubble">
            <h4>Hello</h4>
          </div>
          <div class="time">
            <p>9 : 34 AM</p>
          </div>
        </div>
        <div class="sender">
          <div class="message flex al-center jc-end">
            <div class="wrapper">
              <div class="chat-bubble">
                <h4>Hello</h4>
              </div>
              <div class="time flex al-center">
                <ion-icon aria-hidden="true" :icon="checkmarkDone" />
                <p>9 : 34 AM</p>
              </div>
            </div>
          </div>
        </div>
        <div class="reciver">
          <div class="chat-bubble">
            <h4>Como estas tu</h4>
          </div>
          <div class="time">
            <p>9 : 34 AM</p>
          </div>
        </div>
        <div class="sender">
          <div class="message flex al-center jc-end">
            <div class="wrapper">
              <div class="chat-bubble">
                <h4>Yo estoy super bien </h4>
              </div>
              <div class="time flex al-center">
                <ion-icon aria-hidden="true" icon="checkmarkDone" />
                <p>9 : 34 AM</p>
              </div>
            </div>
          </div>
        </div>
        <div class="reciver">
          <div class="chat-bubble">
            <h4>Pedrito</h4>
            <div class="img-holder">
              <img src="assets/imgs/img.png" alt="">
            </div>
          </div>
          <div class="time">
            <p>9 : 34 AM</p>
          </div>
        </div>
        <div class="sender">
          <div class="message flex al-center jc-end">
            <div class="wrapper">
              <div class="chat-bubble">
                <h4>Yo estoy super bien </h4>
              </div>
              <div class="time flex al-center">
                <ion-icon aria-hidden="true" :icon="checkmarkDone" />
                <p>Super</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ion-modal class="ion-modall" :is-open="isModalOpen" @dismiss="dismissModal" >
     
        <ion-content  class="modall ion-padding">
          <div class="holder">
            <div class="section">
              <h3>Ingrese Nick Name</h3>
              <ion-item>
                <ion-input value="Pedrito"  />
              </ion-item>
              <div class="btns-holder flex al-center jc-end">
                <ion-button fill="clear" @click="dismissModal">Cancelar</ion-button>
                <ion-button fill="clear">Guardar</ion-button>
              </div>
            </div>
          </div>
        </ion-content>
      </ion-modal>
      
    </ion-content>

    <ion-footer class="conversation-footer">
      <ion-toolbar>
        <ion-item lines="none">
          <ion-input type="text" placeholder="Escribir mensaje aquí"></ion-input>
          <ion-icon aria-hidden="true" :icon="attachOutline" slot="end" />
        </ion-item>
        <ion-buttons slot="end">
          <div class="btn ion-activatable flex al-center jc-center ripple-parent">
            <ion-icon aria-hidden="true" :icon="mic" />
            <ion-ripple-effect type="bounded"></ion-ripple-effect>
          </div>
        </ion-buttons>
        <ion-buttons slot="end">
          <div class="btn ion-activatable flex al-center jc-center ripple-parent">
            <ion-icon aria-hidden="true" :icon="send" />
            <ion-ripple-effect type="bounded"></ion-ripple-effect>
          </div>
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>


    

  </ion-page>
</template>

<script  setup lang="ts">
import { IonPage,IonPopover, IonHeader, IonToolbar } from '@ionic/vue';
import { attachOutline, call, checkmarkDone, ellipsisVertical, mic, searchOutline, send, videocam } from 'ionicons/icons';
import './ConversationPage.scss';
import { useRouter } from 'vue-router';
import { ref } from 'vue';


const router = useRouter();

const isModalOpen = ref(false);


const openModal = () => {
  isModalOpen.value = true;
};

const dismissModal = () => {
  isModalOpen.value = false;
};


const goProfile =()  => {
     router.replace('/profile');
   }

</script>
