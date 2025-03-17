<template>
  <q-splitter v-model="splitterModel" style="height: 100%" unit="%">
    <template v-slot:before>
      <MapControl />
    </template>

    <template v-slot:after>
      <div class="q-pa-md"></div>
    </template>
  </q-splitter>
</template>

<script setup>
import { ref } from "vue";
import MapControl from "./MapControl.vue";
const splitterModel = ref(80);
</script>
