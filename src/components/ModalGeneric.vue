<style>
ion-modal#example-modal {
  --width: fit-content;
  --width: 80%;
  --height: fit-content;
  --border-radius: 6px;
  --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);
}

ion-modal#example-modal ion-icon {
  margin-right: 6px;

  width: 48px;
  height: 48px;

  padding: 4px 0;

  color: #aaaaaa;
}

ion-modal#example-modal .wrapper {
  margin: 20px;
  margin-bottom: 10px;
  margin-top: 0px;
}
</style>

<template>
  <ion-content class="ion-padding">
    <ion-modal
      id="example-modal"
      :is-open="modal_is_open"
      trigger="open-custom-dialog"
    >
      <div class="wrapper">
        <h1>{{ title }}</h1>

        <ion-list lines="none">
          <slot></slot>
        </ion-list>
      </div>
    </ion-modal>
  </ion-content>
</template>

<script lang="ts" setup>
import {
  IonButton,
  IonModal,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonItem,
  IonList,
  IonLabel,
  IonIcon,
} from "@ionic/vue";
import { personCircle } from "ionicons/icons";
import { onMounted, reactive, ref, watch } from "vue";

let modal_is_open = ref(false);
const props = defineProps({
  isOpen: {
    type: Boolean,
  },
  title: {
    type: String,
    default: "",
  },
});

watch(
  () => props.isOpen,
  (is_open) => {
    modal_is_open.value = is_open;
  }
);
onMounted(() => {
  modal_is_open.value = props.isOpen;
});
</script>
