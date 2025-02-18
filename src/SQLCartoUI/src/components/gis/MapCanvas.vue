<template>
  <div :id="mapId">
    <canvas ref="canvas" class="full-width full-height"></canvas>
    <q-resize-observer @resize="onResize" />
  </div>
</template>

<script setup>
// import { useId } from "quasar";
// import { onMounted, ref, toRefs } from "vue";
// import Map from "ol/Map.js";
// import View from "ol/View.js";

// const mapId = useId();

// const props = defineProps({
//   srid: {
//     type: Number,
//     default: 0,
//   },
//   center: {
//     type: Array,
//     default: () => [0, 0],
//   },
//   zoom: {
//     type: Number,
//     default: 1,
//   },
// });

// // const emits = defineEmits(["zoomChanged", "centerChanged"]);

// const { srid, center, zoom } = toRefs(props);
// const olMap = ref(null);
// onMounted(() => {
//   olMap.value = new Map({
//     view: new View({
//       center: center.value,
//       zoom: zoom.value,
//       srid: `EPSG:${srid.value}`,
//     }),
//     controls: [],
//     layers: [],
//     target: mapId.value,
//   });
//   olMap.value.getView().on("change", (e) => {
//     console.log(e);
//   });
// });

import { useId } from "quasar";
import { onMounted, toRefs, ref } from "vue";
const mapId = useId();
const canvas = ref(null);
const props = defineProps({
  srid: {
    type: Number,
    default: 0,
  },
  center: {
    type: Array,
    default: () => [0, 0],
  },
  scale: {
    type: Number,
    default: 1.0,
  },
});
const { center, scale } = toRefs(props);
onMounted(() => {
  console.log(center, scale);
  // canvas.value = document.createElement("canvas");
});

const onResize = (size) => {
  console.log(size);
  canvas.value.width = size.width;
  canvas.value.height = size.height;
};
</script>
