<template>
  <div class="q-pa-none">
    <iframe
      frameBorder="0"
      class="absolute full-width full-height"
      ref="webMapControl"
    ></iframe>

    <MapCanvas
      class="absolute full-width full-height q-pa-none no-scroll"
      ref="mapCanvas"
      @contextmenu.prevent="null"
      @mapViewChanged="onMapViewChanged"
    ></MapCanvas>

    <WebMapSwitcher
      class="absolute"
      style="right: 10px; top: 10px; width: 200px; z-index: 100"
      v-show="srid === 3857 || srid === 900913"
      :web-map-control="webMapControl"
      :before-map-changed="onBeforeWebMapChanged"
      :get-web-map-url="onGetWebMapUrl"
    ></WebMapSwitcher>
  </div>
</template>

<script setup>
import MapCanvas from "./MapCanvas.vue";
// import { useId } from "quasar";
import { onMounted, ref } from "vue";
// import { useConfiguration } from "src/stores/useconfiguration.js";
import WebMapSwitcher from "./WebMapSwitcher.vue";
import { useConfiguration } from "src/stores/Configuration";
import { transform } from "ol/proj";
import getDPI from "src/utils/getDPI";
// const mapid = useId();
const mapCanvas = ref(null);
const webMapControl = ref(null);
const configuration = useConfiguration();

const center = ref(transform([112.957273, 28.199262], "EPSG:4326", "EPSG:3857"));
const srid = ref(3857);
const scale = ref(getDPI() / 2.54 / 1000.0);
const zoom = ref(0);

onMounted(() => {
  mapCanvas.value.setSrid(srid.value);
  mapCanvas.value.setCenter(center.value);
  mapCanvas.value.setScale(scale.value);
  scale.value = mapCanvas.value.getScale();
  zoom.value = mapCanvas.value.getZoom();
  webMapControl.value.src = "/webmap/nomap.html";
});

const onBeforeWebMapChanged = () => {
  return [900913, 3857].includes(srid.value);
};

const onGetWebMapUrl = (type) => {
  const cpt = transform(center.value, `EPSG:${srid.value}`, `EPSG:4326`);
  if (type === "GAODE") {
    return `/webmap/gaode.html?x=${cpt[0]}&y=${cpt[1]}&z=${zoom.value}&key=${configuration.getGaoDe.key}&password=${configuration.getGaoDe.password}`;
  } else if (type === "GOOGLE") {
    return `/webmap/google.html?x=${cpt[0]}&y=${cpt[1]}&z=${zoom.value}&key=${configuration.getGoogle.key}`;
  } else if (type === "BING") {
    return `/webmap/bing.html?x=${cpt[0]}&y=${cpt[1]}&z=${zoom.value}&key=${configuration.getBing.key}`;
  } else if (type === "TIANDITU") {
    return `/webmap/tianditu.html?x=${cpt[0]}&y=${cpt[1]}&z=${zoom.value}&key=${configuration.getTianDitu.key}`;
  } else if (type === "QQ") {
    return `/webmap/qq.html?x=${cpt[0]}&y=${cpt[1]}&z=${zoom.value}&key=${configuration.getQQ.key}`;
  }

  return `/webmap/nomap.html`;
};

const onMapViewChanged = (view) => {
  if (view.zoom) {
    const viewCenter = transform(view.center, `EPSG:${srid.value}`, `EPSG:4326`);
    webMapControl.value.contentWindow.setView(viewCenter, view.zoom);
    zoom.value = view.zoom;
    center.value = view.center;
  }
};
</script>

<style scoped>
.no-select {
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* 标准语法 */
}

.custom-select::selection {
  background-color: transparent; /* 设置选中背景颜色为透明 */
  color: inherit; /* 保持文本颜色不变 */
}

.custom-select::-moz-selection {
  /* Firefox 需要单独处理 */
  background-color: transparent;
  color: inherit;
}
</style>
