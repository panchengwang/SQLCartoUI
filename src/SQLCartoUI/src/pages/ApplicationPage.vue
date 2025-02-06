<template>
  <q-page class="full-width full-height">
    <q-splitter v-model="splitterModel" class="full-height" unit="%" :limits="limits">
      <template v-slot:before>
        <div class="q-pa-none full-height">
          <div>
            <!-- <div class="text-h4 q-mb-md">Before</div>
            <div v-for="n in 20" :key="n" class="q-my-md">
              {{ n }}. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis
              praesentium cumque magnam odio iure quidem, quod illum numquam possimus
              obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In,
              libero.
            </div> -->
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
