<template>
  <DragableResizableWindow ref="dialog" :width="800" :height="600" title="SQLCarto DB">
    <CatalogTree></CatalogTree>
  </DragableResizableWindow>
</template>

<script setup>
import { onMounted, ref } from "vue";
import DragableResizableWindow from "../dialog/DragableResizableWindow.vue";
import CatalogTree from "./CatalogTree.vue";

const dialog = ref(null);
onMounted(() => {});

defineExpose({
  activate: () => {
    dialog.value.activate();
  },
});
</script>
