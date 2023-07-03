<template>

      <ion-modal ref="modal" :isOpen="show_modal" :enter-animation="enterAnimation" :leave-animation="leaveAnimation">
        <ion-content>
          <ion-toolbar>
            <ion-title>{{props.title}}</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="dismiss()">
                <ion-icon aria-hidden="true" :icon="close" />
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
            <slot>
                
            </slot>
            
        </ion-content>
      </ion-modal>

  </template>
  
<script setup lang="ts">
import { close } from 'ionicons/icons';
import { defineComponent, watch, ref} from 'vue';
import {
createAnimation,
IonButtons,
IonButton,
IonModal,
IonHeader,
IonContent,
IonToolbar,
IonTitle,
IonItem,
IonList,
IonAvatar,
IonImg,
IonLabel,
} from '@ionic/vue';

let modal = ref(null);

const props = defineProps({
    show:{
        type:Boolean
    },
    title:{
        type:String
    }
})
const emit = defineEmits(['onClose'])
let show_modal = ref(false)

watch(()=>props.show,()=>{
    show_modal.value = props.show;
})

const enterAnimation = (baseEl: HTMLElement) => {
const root = baseEl.shadowRoot;

const backdropAnimation = createAnimation().addElement(root.querySelector('ion-backdrop')).fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

const wrapperAnimation = createAnimation()
    .addElement(root.querySelector('.modal-wrapper'))
    .keyframes([
        { offset: 0, opacity: '0', transform: 'scale(0)' },
        { offset: 1, opacity: '0.99', transform: 'scale(1)' },
    ]);

    return createAnimation()
    .addElement(baseEl)
    .easing('ease-out')
    .duration(500)
    .addAnimation([backdropAnimation, wrapperAnimation]);
};
const leaveAnimation = (baseEl) => {
return enterAnimation(baseEl).direction('reverse');
};

const dismiss = () => {
    emit('onClose')
    modal.value.$el.dismiss();
};


</script>