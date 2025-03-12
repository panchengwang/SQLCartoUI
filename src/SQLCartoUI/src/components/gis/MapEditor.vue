<template>
  <DragableResizableWindow ref="dialog" :width="800" :height="600" title="Map Editor">
    <MapControl></MapControl>
  </DragableResizableWindow>
</template>

<script setup>
import DragableResizableWindow from "../dialog/DragableResizableWindow.vue";
import MapControl from "./MapControl.vue";
import { ref } from "vue";
const dialog = ref(null);

defineExpose({
  activate: () => {
    dialog.value.activate();
  },
});
</script>
