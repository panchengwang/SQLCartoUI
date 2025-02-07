<template>
  <q-page class="full-width full-height">
    <q-splitter v-model="splitterModel" class="full-height" unit="%" :limits="limits">
      <template v-slot:before>
        <div class="q-pa-none full-height">
          <div class="full-width full-height">
            <!-- <MapControl class="full-width full-height"></MapControl> -->
          </div>
        </div>
      </template>

      <template v-slot:after>
        <div class="q-pa-none full-height">
          <div class="full-width full-height">
            <MapControl class="full-width full-height"></MapControl>
          </div>
        </div>
      </template>
    </q-splitter>
  </q-page>
</template>

<script setup>
import MapControl from "src/components/gis/MapControl.vue";
import { ref } from "vue";

const splitterModel = ref(0);
const limits = ref([0, 100]);
</script>
