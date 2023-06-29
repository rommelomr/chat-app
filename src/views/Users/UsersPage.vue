<template>
  <ion-page class="groups-page">
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title>
          Usuarios
        </ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear">
            <ion-icon aria-hidden="true" :icon="searchOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="the-list">
        <ion-item>
          <ion-avatar slot="start">
            <img src="assets/imgs/man.png" alt="">
          </ion-avatar>
          <ion-label>
            <h3>123456 <span>5m</span></h3>
            <p>Roman : Hello</p>
          </ion-label>
          <ion-badge slot="end" class="flex al-center jc-center">
            3
          </ion-badge>
        </ion-item>
      </div>
      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button @click="goNewGroup">
          <ion-icon src="assets/imgs/icn-addperson.svg"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script  setup lang="ts">

import { inject, onMounted, ref, reactive, onUpdated, Ref } from "vue";
import { supabase } from "@/utils/SupabaseClient";
import { IonPage, IonHeader, IonToolbar } from '@ionic/vue';
import { searchOutline, } from 'ionicons/icons';
import './UsersPage.scss';
import { useRouter } from 'vue-router';


const router = useRouter();

const goNewGroup =()  => {
     router.replace('/newgroup1');
}
////// VARS //////
let current_chat_user = reactive({});
let users: Ref<Array<any> | null>  = ref([]);
////// VARS //////

////// Methods //////
const init = async () => {
  alert("hola")
  let { data, error } = await supabase
    .from("chat_users")
    .select("*,person:people(*,user:users(*))");
  if (error||!data) return;
  users.value = data;
};
////// Methods //////
onMounted(async () => {
  let { data, error } = await supabase.rpc("get_all_current_chat_user_info");
  current_chat_user = data;
  supabase.removeAllChannels();
  init();
});
onUpdated(() => {
  //current_message = 0;
});

</script>
