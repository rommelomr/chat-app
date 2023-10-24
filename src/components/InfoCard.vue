<template>
  <div class>
    <ion-avatar slot="start" @click="onClick">
      <img :src="item.image" alt="" />
    </ion-avatar>
    <ion-label @click="onClick">
      <h3>
        {{ item.title }}
        <!-- <span>5m</span> -->
      </h3>
      <p>{{ item.subtitle }}</p>
    </ion-label>
  </div>
</template>
<script setup>
import { onMounted, reactive } from "vue";

let item = reactive({
  image: "",
  title: "",
  subtitle: "",
});

const props = defineProps({
  info: {
    type: Object,
    default: {},
  },
});

const emit = defineEmits(["onClick"]);

const onClick = () => {
  emit("onClick", {
    name: "InfoCard.onClick",
    data: {},
  });
};
onMounted(() => {
  item.image = props.info.image;
  item.title = props.info.title;
  item.subtitle = props.info.subtitle;
});
</script>
<style scoped>
.the-list {
  margin-bottom: 10px;
}

.the-list ion-avatar {
  --border-radius: 50%;
  height: 3rem;
  width: 3rem;
}

.the-list ion-label h3 {
  font-family: "Medium";
  font-size: 16px;
}

.the-list ion-label h3 span {
  color: #9c9c9c;
  font-size: 11px;
}

.the-list ion-label img {
  margin-right: 10px;
}

.the-list ion-label p {
  color: #9c9c9c;
  font-family: "Medium";
  font-size: 13px;
}

.the-list ion-badge {
  border-radius: 50%;
  height: 1.5rem;
  width: 1.5rem;
}
</style>
