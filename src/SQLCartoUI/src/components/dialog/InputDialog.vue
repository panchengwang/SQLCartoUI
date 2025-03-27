<template>
  <DragableResizableWindow
    height="180"
    title="Input"
    :show-min-button="false"
    :show-max-button="false"
    :check-buttons="true"
  >
    <div class="q-pa-md">
      <label style="font-size: 18px">Please enter folder name here:</label>
      <q-input outlined dense :v-model="inputValue"></q-input>
    </div>
  </DragableResizableWindow>
</template>

<script setup>
import DragableResizableWindow from "./DragableResizableWindow.vue";
import { watch } from "vue";

const { inputValue } = defineProps({
  inputValue: { type: String, default: "" },
});

const emit = defineEmits(["update:inputValue"]);

watch(
  () => inputValue,
  (newVal) => {
    emit("update:inputValue", newVal);
  }
);
</script>
