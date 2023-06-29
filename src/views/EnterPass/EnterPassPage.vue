<template>
  <ion-page class="enterpass-page">

    <ion-content :fullscreen="true" class="ion-padding">
      <div class="title ">
        <h3>Ingrese su contraseña</h3>
        <h6 class="ion-text-wrap">Para poder ingresar a nuestro chat , es necesario que
          proporciones tu contraseña.</h6>
      </div>
      <div class="section">
        <div class="sub-title">
          <h4>Contraseña</h4>
        </div>
        <div class="the-form">
  
          <div class="input-item">
            <ion-item>
             
              <ion-input class="ion-text-left" placeholder="Contraseña"/>
            </ion-item>
          </div>
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
import './EnterPassPage.scss';
import { useRouter } from 'vue-router';
import { arrowForward } from 'ionicons/icons';


const router = useRouter();

const goObtainCode =()  => {
     router.replace('/obtaincode');
   }

</script>
