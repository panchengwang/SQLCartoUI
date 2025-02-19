<template>
  <div :id="mapId">
    <canvas ref="canvas" class="full-width full-height"></canvas>
    <q-resize-observer @resize="onResize" />
  </div>
</template>

<script setup>
import { useId } from "quasar";
import { onMounted, onBeforeUnmount, ref } from "vue";
import { throttle } from "quasar";

const mapId = useId();
const canvas = ref(null);
const resolutions = [
  156543.03392804097,
  78271.51696402048,
  39135.75848201024,
  19567.879241005125,
  9783.93962050257,
  4891.9698102512775,
  2445.984905125646,
  1222.9924525628157,
  611.4962262814079,
  305.7481131407112,
  152.87405657034833,
  76.43702828517416,
  38.21851414258708,
  19.109257071308093,
  9.554628535654047,
  4.777314267834299,
  2.3886571339098737,
  1.1943285669549368,
  0.5971642834774684,
  0.2985821417387342,
  0.14929107087664306,
  0.07464553543832153,
  0.037322767719160765,
  0.018661383859580383,
];

const emits = defineEmits(["mapViewChanged"]);
const center = ref([0, 0]);
const scale = ref(1.0);
const srid = ref(3857);
const zoom = ref(0);

// let _scale = scale.value;
// let _center = center.value;

onMounted(() => {
  setCenter(center.value);
  setScale(scale.value);
  zoom.value = getNearistZoomOfScale(scale.value);
  canvas.value.addEventListener("wheel", onWheel);
});
onBeforeUnmount(() => {
  canvas.value.removeEventListener("wheel", onWheel);
});
const setCenter = (pt) => {
  center.value = pt;
};

const getNearistZoomOfScale = (s) => {
  let z = 0;
  let res = 1.0 / s;
  while (res < resolutions[z]) {
    z++;
  }

  if (z < 3) {
    z = 3;
  } else if (z >= resolutions.length) {
    z = resolutions.length - 1;
  }
  return z;
};
const setScale = (s) => {
  if (srid.value === 3857) {
    let z = getNearistZoomOfScale(s);
    scale.value = 1.0 / resolutions[z];
    zoom.value = z;
  } else {
    scale.value = s;
  }
};
const onWheel = throttle((e) => {
  e.preventDefault();
  if (srid.value === 3857) {
    if (e.deltaY > 0) {
      zoom.value--;
    } else {
      zoom.value++;
    }
    if (zoom.value < 3) {
      zoom.value = 3;
    } else if (zoom.value >= 24) {
      zoom.value = 23;
    }
    scale.value = 1.0 / resolutions[zoom.value];

    emits("mapViewChanged", {
      zoom: zoom.value,
      center: center.value,
      scale: scale.value,
    });
  } else {
    if (e.deltaY < 0) {
      scale.value *= 2.0;
    } else {
      scale.value *= 0.5;
    }
    emits("mapViewChanged", {
      zoom: false,
      center: center.value,
      scale: scale.value,
    });
  }
}, 300);

const onResize = (size) => {
  console.log(size);
  canvas.value.width = size.width;
  canvas.value.height = size.height;
};

const getScale = () => {
  return scale.value;
};
const getCenter = () => {
  return center.value;
};
const getResolutionOfZoom = (z) => {
  return resolutions[z];
};
const getZoom = () => {
  return zoom.value;
};
defineExpose({
  setCenter,
  getCenter,
  setScale,
  getScale,
  getResolutionOfZoom,
  getZoom,
  getNearistZoomOfScale,
});
</script>
