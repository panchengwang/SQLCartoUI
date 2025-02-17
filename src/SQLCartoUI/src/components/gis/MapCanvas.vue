<template>
  <div :id="mapId"></div>
</template>

<script setup>
import { useId } from "quasar";
import { onMounted, ref, toRefs } from "vue";
import Map from "ol/Map.js";
import View from "ol/View.js";

const mapId = useId();

const props = defineProps({
  srid: {
    type: Number,
    default: 0,
  },
  center: {
    type: Array,
    default: () => [0, 0],
  },
  zoom: {
    type: Number,
    default: 1,
  },
});

const { srid, center, zoom } = toRefs(props);
const olMap = ref(null);
onMounted(() => {
  olMap.value = new Map({
    view: new View({
      center: center.value,
      zoom: zoom.value,
      srid: `EPSG:${srid.value}`,
    }),
    controls: [],
    layers: [],
    target: mapId.value,
  });
});
</script>
