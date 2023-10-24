<template>
  <div class="modal-background" v-if="show_modal" @click="tapBackground"></div>
  <div class="custom-modal text-grey" :class="modal_size" v-if="show_modal">
    <div class="custom-header">
      <span>{{ title }}</span>
      <span class="close-modal-button" @click="closeModal">Salir</span>
    </div>
    <hr style="background: rgb(235, 235, 235)" />
    <div v-if="modal_text">{{ modal_text }}</div>
    <div class="overflow-y">
      <slot></slot>
    </div>
    <div class="custom-footer">
      <div
        v-for="(footer_button, i) in footer_buttons"
        class="button-footer"
        :class="[footer_button.type]"
        @click="clickFooterButton(footer_button)"
      >
        {{ footer_button.label }}
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watchEffect, watch } from "vue";
let show_modal = ref(false);
let title = ref("");
let footer_buttons = ref([]);
let modal_size = ref("");
let modal_text = ref("");
let modal_is_static = ref(false);
const props = defineProps({
  static: {
    type: Boolean,
  },
  size: {
    type: String,
    default: "lg",
  },
  text: {
    type: String,
    default: "",
  },
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "",
  },
  footerButtons: {
    type: Array,
    default: [],
  },
});
const emit = defineEmits(["onCloseModal", "onFooterButtonClicked"]);
watchEffect(() => {
  show_modal.value = props.show;
  title.value = props.title;
  footer_buttons.value = props.footerButtons;
  modal_size.value = props.size;
  modal_is_static.value = props.static;
  modal_text.value = props.text;
});

const closeModal = () => {
  show_modal.value = false;
  emit("onCloseModal", {
    name: "HeaderModal.closeModal",
    data: {},
  });
};
const clickFooterButton = (footer_button) => {
  emit("onFooterButtonClicked", {
    name: "HeaderModal.clickFooterButton",
    data: {
      footer_button,
    },
  });
};
const tapBackground = () => {
  if (!modal_is_static.value) closeModal();
};
onMounted(() => {
  console.log(props.show);
  show_modal.value = props.show;
  title.value = props.title;
  footer_buttons.value = props.footerButtons;
  modal_size.value = props.size;
  modal_is_static.value = props.static;
});
</script>

<style scoped>
.lg {
  height: 90vh;
}
.md {
  height: 60vh;
}
.sm {
  height: 20vh;
}
.overflow-y {
  overflow-y: auto;
}
.custom-modal {
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background: white;
  margin: 10px;
  padding: 10px;
  z-index: 100;
  border-radius: 6px 6px 6px 6px;
  border: solid 1px rgb(235, 235, 235);
}

.text-grey {
  color: rgb(83, 83, 83);
}

.close-modal-button {
  float: right;
}
.danger {
  color: white;
  background: rgb(246, 97, 80);
}
.success {
  color: rgb(70, 92, 52);
  background: rgb(138, 246, 80);
}
.info {
  color: rgb(52, 61, 92);
  background: rgb(125, 201, 255);
}
.custom-footer {
  display: flex;
  justify-content: right;
  margin-top: auto;
}
.button-footer {
  padding: 10px;
  border: solid 1px rgb(220, 220, 220);
  border-radius: 5px 5px 5px 5px;
  font-size: 14px;
  margin: 2px;
}
.modal-background {
  position: fixed;
  height: 100vh;
  width: 100%;
  z-index: 99;
  background: black;
  opacity: 0.5;
}
</style>
