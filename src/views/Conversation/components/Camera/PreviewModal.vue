<template>
  <ion-content class="preview-modal">
    <ion-grid style="height: 100%">
      <ion-row
        class="ion-justify-content-center ion-align-items-center"
        style="height: 100%"
      >
        <div class="holder">
          <div class="toolbar">
            <div
              class="btn ion-activatable flex al-center jc-center ripple-parent"
              @click="close"
            >
              <ion-icon src="/public/assets/imgs/close-outline.svg" />
              <ion-ripple-effect type="bounded"></ion-ripple-effect>
            </div>
          </div>
          <div class="preview-holder">
            <img
              :src="selectedImage"
              alt="Selected Image"
              v-if="selectedImage"
            />
          </div>

          <div class="previews" v-if="images">
            <div
              v-for="image in images"
              :key="image"
              class="image-holder"
              @click="selectImage(image)"
            >
              <img :src="image" alt="Preview Image" />
            </div>
          </div>
        </div>
      </ion-row>
    </ion-grid>
  </ion-content>
</template>

<script lang="ts">
import { modalController } from "@ionic/vue";
import "./PreviewModal.scss";
import { PropType, defineComponent, ref } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "PreviewModal",
  props: {
    images: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    selectedImage: {
      type: String as PropType<string>,
      default: "",
    },
  },

  setup(props) {
    const router = useRouter();
    const selectedImage = ref(props.selectedImage);

    const selectImage = (image: string) => {
      selectedImage.value = image;
    };
    return { router, selectedImage, selectImage };
  },
  mounted() {},

  methods: {
    close() {
      return modalController.dismiss();
    },
  },
});
</script>
