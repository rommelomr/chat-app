<template>
  <ion-breadcrumbs v-if="current_conversation">
    <ion-breadcrumb href="#">{{
      current_conversation.type === "SINGLE" ? "Usuario" : "Grupo"
    }}</ion-breadcrumb>
    <ion-breadcrumb href="#">{{
      current_conversation.label ?? ""
    }}</ion-breadcrumb>
  </ion-breadcrumbs>
  <ion-card v-if="current_conversation">
    <img
      alt="Silhouette of mountains"
      :src="
        current_conversation.group?.photo
          ? current_conversation.group?.photo
          : 'https://ionicframework.com/docs/img/demos/card-media.png'
      "
    />
    <ion-card-header>
      <ion-card-title>{{ current_conversation.label ?? "" }}</ion-card-title>
      <!-- <ion-card-subtitle>{{ current_conversation.userConversation?.username }}</ion-card-subtitle> -->
    </ion-card-header>

    <ion-card-content>
      Here's a small text description for the card content. Nothing more,
      nothing less.
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import {
  IonBreadcrumb,
  IonBreadcrumbs,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from "@ionic/vue";
import { Ref, defineComponent, onMounted, ref } from "vue";
import {
  ICurrentConversation,
  useCurrentConversation,
} from "../store/current-conversation.store";
let current_conversation: Ref<ICurrentConversation | undefined> = ref();

onMounted(() => {
  current_conversation.value =
    useCurrentConversation().getCurrentConversation();
});
</script>
