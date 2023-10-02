<template>
  <div style="color: white" v-if="isActive" id="container">
    <div id="header">
      <button id="button" @click="onExit">salir</button>
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps({
  isActive: {
    type: Boolean,
  },
  content: {
    type: Object,
    default: {
      is_empty: true,
      data: {},
    },
  },
});
const emit = defineEmits(["onExit"]);
const onExit = () => {
  emit("onExit");
};
</script>

<style scoped>
#container {
  background: black;
  position: absolute;
  width: 100vw;
  height: 100vh;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}
#header {
  position: absolute;
  margin-top: 50%;
  padding: 3%;
  bottom: 0;
  z-index: 15;
}
#button {
  background: none;
  padding: 10px;
  border: solid white 1px;
  color: white;
  border-radius: 10px 10px 10px 10px;
}
#media {
  width: 100%;
  object-fit: "contain";
  object-position: "center";
}
</style>
