<template>
  <ion-grid :fixed="true">
    <ion-row>
      <ion-col

      v-for="(x,index) in imgArray"
      @click="selectModal(x)"
      size="3">
      <ion-avatar>
          <img :src="`/public/assets/imgs/avatar/${x}.png`" alt="" width="100%" />
        </ion-avatar>
    </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script lang="ts"  setup>
const emit = defineEmits(['onSelectAvatar'])
import { IonCol, IonGrid, IonRow } from "@ionic/vue";
import { Ref, defineComponent, ref } from "vue";
let imgArray:Ref<number[]>=ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30])

const selectModal = (id:number) => {
  emit('onSelectAvatar',{
    id:id
  })
};

</script>

<style scoped>
ion-grid {
  --ion-grid-width: 70%;

  --ion-grid-width-xs: 70%;
  --ion-grid-width-sm: 288px;
  --ion-grid-width-md: 384px;
  --ion-grid-width-lg: 480px;
  --ion-grid-width-xl: 570px;
}

ion-col {
  background-color:solid 1px #fff;
  border: solid 1px #fff;
  color: #fff;
  text-align: center;
}
</style>
