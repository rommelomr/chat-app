<template>
  <ion-page class="obtaincode-page">

    <ion-content :fullscreen="true" class="ion-padding">
      <div class="title ">
        <h3>Obtenido código de usuario</h3>
        <h6 class="ion-text-wrap">Estamos procesando tu dispositivo para crear 
          un usuario valido para el uso del chat.</h6>
      </div>
      <div class="section">
        <div class="sub-title">
          <h4>Codigo asignado</h4>
        </div>

        <ion-row class="code-section">
          <ion-col size="7">
            <h1>234987</h1>
          </ion-col>
          <ion-col size="1" class="flex al-center jc-start">
            <div class="bar">

            </div>
          </ion-col>
          <ion-col size="4" class="flex al-center jc-start">
            <div class="btn ion-activatable flex al-center jc-center ripple-parent">
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
            <ion-row class="ion-align-items-center	ion-justify-content-center">
              <ion-col size="2">
                <div class="input-holder">
                  <ion-input type="tel" #otp1 class="otp" maxlength="1">
                  </ion-input>
                </div>
              </ion-col>
              <ion-col size="2" offset="1">
                <div class="input-holder">
                  <ion-input type="tel" #otp2 class="otp" maxlength="1" size="1" >
                  </ion-input>
                </div>
              </ion-col>
              <ion-col size="2" offset="1">
                <div class="input-holder">
                  <ion-input type="tel" #otp3 class="otp" pattern="[0-9]" maxlength="1" size="1" >
                  </ion-input>
                </div>
              </ion-col>
              <ion-col size="2" offset="1">
                <div class="input-holder">
                  <ion-input type="tel" #otp4 class="otp" pattern="[0-9]" maxlength="1" size="1">
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
            <ion-row class="ion-align-items-center	ion-justify-content-center">
              <ion-col size="2">
                <div class="input-holder">
                  <ion-input type="tel" #otp1 class="otp" maxlength="1">
                  </ion-input>
                </div>
              </ion-col>
              <ion-col size="2" offset="1">
                <div class="input-holder">
                  <ion-input type="tel" #otp2 class="otp" maxlength="1" size="1" >
                  </ion-input>
                </div>
              </ion-col>
              <ion-col size="2" offset="1">
                <div class="input-holder">
                  <ion-input type="tel" #otp3 class="otp" pattern="[0-9]" maxlength="1" size="1" >
                  </ion-input>
                </div>
              </ion-col>
              <ion-col size="2" offset="1">
                <div class="input-holder">
                  <ion-input type="tel" #otp4 class="otp" pattern="[0-9]" maxlength="1" size="1">
                  </ion-input>
                </div>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>
    
      </div>
      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button @click="goObtainCode">
          <ion-icon aria-hidden="true" :icon="arrowForward" />
        </ion-fab-button>

      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script  setup lang="ts">
import { IonPage} from '@ionic/vue';
import './ObtainCodePage.scss';
import { useRouter } from 'vue-router';
import { arrowForward, copyOutline } from 'ionicons/icons';


const router = useRouter();

const goObtainCode =()  => {
     router.replace({path: '/welcome', query: {
      isObtaincode: true.toString()
    }});
   }

</script>
