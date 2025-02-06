<template>
  <div class="q-pa-none">
    <iframe
      frameBorder="0"
      class="absolute full-width full-height"
      ref="webMapControl"
    ></iframe>
    <div
      :id="mapid"
      class="absolute full-width full-height q-pa-none no-scroll"
      @contextmenu.prevent="null"
    ></div>
    <WebMapSwitcher
      class="absolute"
      style="right: 10px; top: 10px; width: 200px"
      :webMapControl="webMapControl"
    ></WebMapSwitcher>
  </div>
</template>

<script setup>
import { MapCanvas } from "./MapCanvas.js";
import { useId } from "quasar";
import { onMounted, ref } from "vue";
// import { useAppConfig } from "src/stores/useAppConfig.js";
import WebMapSwitcher from "./WebMapSwitcher.vue";

const mapid = useId();
const mapCanvas = ref(null);
const webMapControl = ref(null);
// const appConfig = useAppConfig();
// const webMapSrc = ref(
//   "/webmap/gaode.html?x=112.957273&y=28.199262&z=14&key=d27242255dfd0152233a1023c4ea0ecb&password=99be80ec0f86d6dec388057d0133f8e2"
// );

onMounted(() => {
  mapCanvas.value = new MapCanvas({
    el: document.getElementById(mapid.value),
  });
});
</script>
