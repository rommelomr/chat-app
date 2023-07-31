<template>
  <div>
    <div class="audio-player">
      <!-- Use the audio tag and bind the src attribute -->
      <audio ref="audioRef" controls :src="audioSource"></audio>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps } from "vue";

// Define the 'base64Sound' prop
const props = defineProps(["base64Sound"]);

// Computed property to generate the data URI for the audio source
const audioSource = `data:audio/aac;base64,${props.base64Sound}`;

// Ref for the audio element
const audioRef = ref(null);

onMounted(() => {
  // Load the audio when the component is mounted
  audioRef.value.load();
});
</script>
<style>
/* Estilos para la etiqueta <audio> */
audio {
  width: 100%;
  border-radius: 12px;
  outline: none;
}

/* Estilos para el contenedor del reproductor */
.audio-player {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
