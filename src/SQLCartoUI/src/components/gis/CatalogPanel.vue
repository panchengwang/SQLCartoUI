<template>
  <q-splitter v-model="splitterModel" style="height: 100%" unit="px">
    <template v-slot:before>
      <CatalogTree />
    </template>

    <template v-slot:after>
      <div class="q-pa-md"></div>
    </template>
  </q-splitter>
</template>

<script setup>
import { ref } from "vue";
import CatalogTree from "./CatalogTree.vue";
const splitterModel = ref(300);
</script>
