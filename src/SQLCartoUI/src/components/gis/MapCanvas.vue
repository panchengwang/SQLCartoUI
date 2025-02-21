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
import { LineString, Point } from "ol/geom";

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
const srid = ref(4326);
const zoom = ref(0);
const drawOperation = ref("POINT");
const isDragging = ref(false);
const draftGeometries = ref([]);

let dragStart = [0, 0];
let dragEnd = [0, 0];
let offscreenCanvas = null;
let offscreenContext = null;

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

const getSrid = () => {
  return srid.value;
};

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

const setSrid = (id) => {
  srid.value = id;
};

const setDrawOperation = (op) => {
  drawOperation.value = op;
};
const getDrawOperation = () => {
  return drawOperation.value;
};

const drawDraft = () => {
  offscreenContext.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
  for (let i = 0; i < draftGeometries.value.length; i++) {
    drawGeometry(mapToPixel(draftGeometries.value[i]));
  }
  console.log(dragStart, dragEnd);

  const ctx = canvas.value.getContext("2d");
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
  ctx.drawImage(offscreenCanvas, 0, 0);
};

const drawGeometry = (geo) => {
  if (geo instanceof Point) {
    let coord = geo.getCoordinates();
    offscreenContext.beginPath();
    offscreenContext.arc(coord[0], coord[1], 5, 0, 2 * Math.PI);
    offscreenContext.stroke();
  }
};
onMounted(() => {
  setCenter(center.value);
  setScale(scale.value);
  zoom.value = getNearistZoomOfScale(scale.value);
  canvas.value.addEventListener("wheel", onWheel);
  canvas.value.addEventListener("mousedown", onMouseDown);
  canvas.value.addEventListener("mouseup", onMouseUp);
  canvas.value.addEventListener("mousemove", onMouseMove);
  offscreenCanvas = document.createElement("canvas");
  offscreenContext = offscreenCanvas.getContext("2d");
  var parentStyles = window.getComputedStyle(document.getElementById(mapId.value));
  canvas.value.width = parseInt(parentStyles.getPropertyValue("width"));
  canvas.value.height = parseInt(parentStyles.getPropertyValue("height"));
  offscreenCanvas.width = canvas.value.width;
  offscreenCanvas.height = canvas.value.height;
  offscreenContext = offscreenCanvas.getContext("2d");
});
onBeforeUnmount(() => {
  canvas.value.removeEventListener("wheel", onWheel);
  offscreenCanvas.remove();
});

const onWheel = throttle((e) => {
  e.preventDefault();
  if ([3857, 900913].indexOf(srid.value) >= 0) {
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
  drawDraft();
}, 300);

const onResize = (size) => {
  canvas.value.width = size.width;
  canvas.value.height = size.height;
  console.log("width:", canvas.value.width);
  console.log("height:", canvas.value.height);
  if (offscreenCanvas) {
    offscreenCanvas.width = canvas.value.width;
    offscreenCanvas.height = canvas.value.height;
    offscreenContext = offscreenCanvas.getContext("2d");
    drawDraft();
  }
};

const pixelToMap = (geo) => {
  if (geo instanceof Array) {
    let x = (geo[0] - canvas.value.width * 0.5) / scale.value + center.value[0];
    let y = center.value[1] - (geo[1] - canvas.value.height * 0.5) / scale.value;
    return [x, y];
  } else if (geo instanceof Point) {
    return new Point(pixelToMap(geo.getCoordinates()));
  } else if (geo instanceof LineString) {
    let coords = geo.getCoordinates();
    for (let i = 0; i < coords.length; i++) {
      coords[i] = pixelToMap(coords[i]);
    }
    return new LineString(coords);
  }
};

const mapToPixel = (geo) => {
  if (geo instanceof Array) {
    let x = canvas.value.width * 0.5 + (geo[0] - center.value[0]) * scale.value;
    let y = canvas.value.height * 0.5 - (geo[1] - center.value[1]) * scale.value;
    return [x, y];
  } else if (geo instanceof Point) {
    return new Point(mapToPixel(geo.getCoordinates()));
  } else if (geo instanceof LineString) {
    let coords = geo.getCoordinates();
    for (let i = 0; i < coords.length; i++) {
      coords[i] = mapToPixel(coords[i]);
    }
    return new LineString(coords);
  }
};

const onMouseDown = (e) => {
  let coord = pixelToMap([e.offsetX, e.offsetY]);

  if (e.button === 0) {
    if (drawOperation.value === "POINT") {
      // draftGeometries.value.push(new Point(coord));
    } else if (drawOperation.value === "LINESTRING") {
      console.log("draw linestring");
    } else if (drawOperation.value === "POLYGON") {
      console.log("draw polygon");
    }
  }
  coord[0];
};

const onMouseUp = (e) => {
  let coord = pixelToMap([e.offsetX, e.offsetY]);
  if (e.button === 0) {
    if (drawOperation.value === "POINT") {
      draftGeometries.value.push(new Point(coord));
      drawDraft();
    } else if (drawOperation.value === "LINESTRING") {
      console.log("draw linestring");
    } else if (drawOperation.value === "POLYGON") {
      console.log("draw polygon");
    }
  }
  isDragging.value = false;
};

const onMouseMove = (e) => {
  let coord = pixelToMap([e.offsetX, e.offsetY]);

  if (e.buttons === 1) {
    if (!isDragging.value) {
      dragStart = dragEnd = coord;
    } else {
      dragEnd = coord;
    }
    isDragging.value = true;
    drawDraft();
  }
};

defineExpose({
  setCenter,
  getCenter,
  setScale,
  getScale,
  setSrid,
  getSrid,
  getResolutionOfZoom,
  getZoom,
  getNearistZoomOfScale,
  setDrawOperation,
  getDrawOperation,
  pixelToMap,
  mapToPixel,
});
</script>
