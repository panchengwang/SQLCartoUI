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
      style="right: 10px; top: 10px; width: 200px"
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
// import { useAppConfig } from "src/stores/useAppConfig.js";
import WebMapSwitcher from "./WebMapSwitcher.vue";
import { useAppConfig } from "src/stores/ApplicationConfiguration";
import { transform } from "ol/proj";
import getDPI from "src/utils/getDPI";
// const mapid = useId();
const mapCanvas = ref(null);
const webMapControl = ref(null);
const appConfig = useAppConfig();

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
  return [900913, 3857].indexOf(srid.value) >= 0;
};

const onGetWebMapUrl = (type) => {
  const cpt = transform(center.value, `EPSG:${srid.value}`, `EPSG:4326`);
  if (type === "GAODE") {
    return `/webmap/gaode.html?x=${cpt[0]}&y=${cpt[1]}&z=${zoom.value}&key=${appConfig.getGaoDe.key}&password=${appConfig.getGaoDe.password}`;
  } else if (type === "GOOGLE") {
    return `/webmap/google.html?x=${cpt[0]}&y=${cpt[1]}&z=${zoom.value}&key=${appConfig.getGoogle.key}`;
  } else if (type === "BING") {
    return `/webmap/bing.html?x=${cpt[0]}&y=${cpt[1]}&z=${zoom.value}&key=${appConfig.getBing.key}`;
  } else if (type === "TIANDITU") {
    return `/webmap/tianditu.html?x=${cpt[0]}&y=${cpt[1]}&z=${zoom.value}&key=${appConfig.getTianDitu.key}`;
  } else if (type === "QQ") {
    return `/webmap/qq.html?x=${cpt[0]}&y=${cpt[1]}&z=${zoom.value}&key=${appConfig.getQQ.key}`;
  }

  return `/webmap/nomap.html`;
};

const onMapViewChanged = (view) => {
  if (view.zoom) {
    const center = transform(view.center, `EPSG:${srid.value}`, `EPSG:4326`);
    webMapControl.value.contentWindow.setView(center, view.zoom);
    zoom.value = view.zoom;
    center.value = view.center;
  }
};
</script>
