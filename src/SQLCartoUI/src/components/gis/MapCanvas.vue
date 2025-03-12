<template>
  <div :id="mapId" class="no-select">
    <canvas ref="canvas" class="full-width full-height"></canvas>
    <q-resize-observer @resize="onResize" />
  </div>
</template>

<script setup>
import { useId } from "quasar";
import { onMounted, onBeforeUnmount, ref } from "vue";
import { throttle } from "quasar";
import { LinearRing, LineString, Point, Polygon } from "ol/geom";

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
const drawOperation = ref("POLYGON");

let draftFillColor = "rgba(255,255,0,0.3)";
let isDragging = false;
let draftGeometries = [];
let draftCoordinates = [];
let draftMoveingCoordinate = null;
let drawStart = false;
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

const drawPath = (coordinates) => {
  let coord = mapToPixel(coordinates[0]);
  offscreenContext.moveTo(coord[0], coord[1]);
  for (let i = 1; i < coordinates.length; i++) {
    coord = mapToPixel(coordinates[i]);
    offscreenContext.lineTo(coord[0], coord[1]);
  }
};

const drawPolygonDraft = () => {
  if (draftCoordinates.length > 0) {
    offscreenContext.beginPath();
    drawPath(draftCoordinates);

    const [startPixelX, startPixelY] = mapToPixel(draftCoordinates[0]);
    const [movePixelX, movePixelY] = mapToPixel(draftMoveingCoordinate);

    offscreenContext.lineTo(movePixelX, movePixelY);
    offscreenContext.lineTo(startPixelX, startPixelY);

    offscreenContext.fillStyle = draftFillColor;
    offscreenContext.fill();

    offscreenContext.strokeStyle = "white";
    offscreenContext.lineWidth = 4.0;
    offscreenContext.stroke();

    offscreenContext.strokeStyle = "black";
    offscreenContext.lineWidth = 1.0;
    offscreenContext.stroke();
  }
};

const drawLineStringDraft = () => {
  if (draftCoordinates.length > 0) {
    offscreenContext.beginPath();
    drawPath(draftCoordinates);
    offscreenContext.lineTo(
      mapToPixel(draftMoveingCoordinate)[0],
      mapToPixel(draftMoveingCoordinate)[1]
    );
    offscreenContext.strokeStyle = "white";
    offscreenContext.lineWidth = 4.0;
    offscreenContext.stroke();

    offscreenContext.strokeStyle = "black";
    offscreenContext.lineWidth = 1.0;
    offscreenContext.stroke();
  }
};

// const drawDraft = () => {
//   offscreenContext.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
//   for (let i = 0; i < draftGeometries.length; i++) {
//     drawGeometry(mapToPixel(draftGeometries[i]));
//   }
//   // console.log(dragStart, dragEnd);
//   if (drawStart) {
//     if (drawOperation.value === "LINESTRING") {
//       if (draftCoordinates.length > 0) {
//         offscreenContext.beginPath();
//         let coord = mapToPixel(draftCoordinates[0]);
//         offscreenContext.moveTo(coord[0], coord[1]);
//         for (let i = 1; i < draftCoordinates.length; i++) {
//           coord = mapToPixel(draftCoordinates[i]);
//           offscreenContext.lineTo(coord[0], coord[1]);
//         }
//         coord = mapToPixel(draftMoveingCoordinate);
//         offscreenContext.lineTo(coord[0], coord[1]);
//         offscreenContext.strokeStyle = "white";
//         offscreenContext.lineWidth = 4.0;
//         offscreenContext.stroke();

//         offscreenContext.strokeStyle = "black";
//         offscreenContext.lineWidth = 1.0;
//         offscreenContext.stroke();
//       }
//     } else if (drawOperation.value === "POLYGON") {
//       if (draftCoordinates.length > 0) {
//         offscreenContext.beginPath();
//         let coord = mapToPixel(draftCoordinates[0]);
//         let start = coord;
//         offscreenContext.moveTo(coord[0], coord[1]);
//         for (let i = 1; i < draftCoordinates.length; i++) {
//           coord = mapToPixel(draftCoordinates[i]);
//           offscreenContext.lineTo(coord[0], coord[1]);
//         }
//         coord = mapToPixel(draftMoveingCoordinate);
//         offscreenContext.lineTo(coord[0], coord[1]);
//         offscreenContext.lineTo(start[0], start[1]);

//         offscreenContext.fillStyle = draftFillColor;
//         offscreenContext.fill();

//         offscreenContext.lineTo(coord[0], coord[1]);
//         offscreenContext.strokeStyle = "white";
//         offscreenContext.lineWidth = 4.0;
//         offscreenContext.stroke();

//         offscreenContext.strokeStyle = "black";
//         offscreenContext.lineWidth = 1.0;
//         offscreenContext.stroke();
//       }
//     }
//   }
//   const ctx = canvas.value.getContext("2d");
//   ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
//   ctx.drawImage(offscreenCanvas, 0, 0, canvas.value.width, canvas.value.height);
// };

const drawDraft = () => {
  offscreenContext.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);

  draftGeometries.forEach((geo) => {
    drawGeometry(mapToPixel(geo));
  });

  if (drawStart) {
    if (drawOperation.value === "LINESTRING") {
      drawLineStringDraft();
    } else if (drawOperation.value === "POLYGON") {
      drawPolygonDraft();
    }
  }

  const ctx = canvas.value.getContext("2d");
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
  ctx.drawImage(offscreenCanvas, 0, 0, canvas.value.width, canvas.value.height);
};

const drawGeometry = (geo) => {
  if (geo instanceof Point) {
    drawPoint(geo);
  } else if (geo instanceof LineString) {
    drawLineString(geo);
  } else if (geo instanceof Polygon) {
    drawPolygon(geo);
  }
};

const drawPoint = (geo) => {
  let coord = geo.getCoordinates();
  offscreenContext.beginPath();
  offscreenContext.arc(coord[0], coord[1], 5, 0, 2 * Math.PI);
  offscreenContext.stroke();
};

const drawLineString = (geo) => {
  offscreenContext.beginPath();
  let coords = geo.getCoordinates();
  if (coords.length >= 2) {
    offscreenContext.moveTo(coords[0][0], coords[0][1]);
    for (let i = 1; i < coords.length; i++) {
      offscreenContext.lineTo(coords[i][0], coords[i][1]);
    }
  }
  offscreenContext.strokeStyle = "white";
  offscreenContext.lineWidth = 4.0;
  offscreenContext.stroke();

  offscreenContext.strokeStyle = "black";
  offscreenContext.lineWidth = 1.0;
  offscreenContext.stroke();
  offscreenContext.stroke();
};

const drawPolygon = (geo) => {
  offscreenContext.beginPath();
  for (let i = 0; i < geo.getLinearRingCount(); i++) {
    const lr = geo.getLinearRing(i);
    let coords = lr.getCoordinates();
    if (coords.length >= 2) {
      offscreenContext.moveTo(coords[0][0], coords[0][1]);
      for (let j = 1; j < coords.length; j++) {
        offscreenContext.lineTo(coords[j][0], coords[j][1]);
      }
    }
  }

  offscreenContext.fillStyle = draftFillColor;
  offscreenContext.fill();

  offscreenContext.strokeStyle = "white";
  offscreenContext.lineWidth = 4.0;
  offscreenContext.stroke();

  offscreenContext.strokeStyle = "black";
  offscreenContext.lineWidth = 1.0;
  offscreenContext.stroke();
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
  let coord1 = pixelToMap([e.offsetX, e.offsetY]);
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
    let coord2 = pixelToMap([e.offsetX, e.offsetY]);
    const xoff = coord1[0] - coord2[0];
    const yoff = coord1[1] - coord2[1];
    center.value[0] += xoff;
    center.value[1] += yoff;
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

    let coord2 = pixelToMap([e.offsetX, e.offsetY]);
    const xoff = coord1[0] - coord2[0];
    const yoff = coord1[1] - coord2[1];
    center.value[0] += xoff;
    center.value[1] += yoff;
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
  if (offscreenCanvas) {
    offscreenCanvas.width = canvas.value.width;
    offscreenCanvas.height = canvas.value.height;
    // offscreenContext = offscreenCanvas.getContext("2d");
    drawDraft();
  }
};

// const pixelToMap = (geo) => {
//   if (geo instanceof Array) {
//     let x = (geo[0] - canvas.value.width * 0.5) / scale.value + center.value[0];
//     let y = center.value[1] - (geo[1] - canvas.value.height * 0.5) / scale.value;
//     return [x, y];
//   } else if (geo instanceof Point) {
//     return new Point(pixelToMap(geo.getCoordinates()));
//   } else if (geo instanceof LineString) {
//     let coords = geo.getCoordinates();
//     for (let i = 0; i < coords.length; i++) {
//       coords[i] = pixelToMap(coords[i]);
//     }
//     return new LineString(coords);
//   } else if (geo instanceof Polygon) {
//     let coordarr = [];
//     for (let i = 0; i < geo.getLinearRingCount(); i++) {
//       let coords = geo.getLinearRing(i).getCoordinates();
//       for (let j = 0; j < coords.length; j++) {
//         coords[j] = pixelToMap(coords[j]);
//       }
//       coordarr.push(coords);
//     }
//     return new Polygon(coordarr);
//   }
// };

const pixelToMap = (geo) => {
  const transformCoord = (coord) => {
    const halfWidth = canvas.value.width * 0.5;
    const halfHeight = canvas.value.height * 0.5;
    return [
      (coord[0] - halfWidth) / scale.value + center.value[0],
      center.value[1] - (coord[1] - halfHeight) / scale.value,
    ];
  };

  if (geo instanceof Array) {
    return transformCoord(geo);
  } else if (geo instanceof Point) {
    return new Point(transformCoord(geo.getCoordinates()));
  } else if (geo instanceof LineString) {
    return new LineString(geo.getCoordinates().map(transformCoord));
  } else if (geo instanceof Polygon) {
    return new Polygon(
      geo.getLinearRings().map((lr) => lr.getCoordinates().map(transformCoord))
    );
  }
};

// const mapToPixel = (geo) => {
//   if (geo instanceof Array) {
//     let x = canvas.value.width * 0.5 + (geo[0] - center.value[0]) * scale.value;
//     let y = canvas.value.height * 0.5 - (geo[1] - center.value[1]) * scale.value;
//     return [x, y];
//   } else if (geo instanceof Point) {
//     return new Point(mapToPixel(geo.getCoordinates()));
//   } else if (geo instanceof LineString) {
//     let coords = geo.getCoordinates();
//     for (let i = 0; i < coords.length; i++) {
//       coords[i] = mapToPixel(coords[i]);
//     }
//     return new LineString(coords);
//   } else if (geo instanceof Polygon) {
//     let coordarr = [];
//     for (let i = 0; i < geo.getLinearRingCount(); i++) {
//       let coords = geo.getLinearRing(i).getCoordinates();
//       for (let j = 0; j < coords.length; j++) {
//         coords[j] = mapToPixel(coords[j]);
//       }
//       coordarr.push(coords);
//     }
//     return new Polygon(coordarr);
//   }
// };

const mapToPixel = (geo) => {
  const transformCoord = (coord) => {
    const halfWidth = canvas.value.width * 0.5;
    const halfHeight = canvas.value.height * 0.5;
    return [
      halfWidth + (coord[0] - center.value[0]) * scale.value,
      halfHeight - (coord[1] - center.value[1]) * scale.value,
    ];
  };
  if (geo instanceof Array) {
    return transformCoord(geo);
  } else if (geo instanceof Point) {
    return new Point(transformCoord(geo.getCoordinates()));
  } else if (geo instanceof LineString) {
    return new LineString(geo.getCoordinates().map(transformCoord));
  } else if (geo instanceof Polygon) {
    return new Polygon(
      geo.getLinearRings().map((lr) => lr.getCoordinates().map(transformCoord))
    );
  }
};

const onMouseDown = () => {};

const onMouseUp = (e) => {
  let coord = pixelToMap([e.offsetX, e.offsetY]);

  if (e.button === 0) {
    // Left button
    if (drawOperation.value === "POINT") {
      draftGeometries.push(new Point(coord));
    } else if (["LINESTRING", "POLYGON"].includes(drawOperation.value)) {
      if (!drawStart) {
        drawStart = true;
      }
      if (!isDragging) {
        draftCoordinates.push(coord);
        console.log("push", coord);
      }
    }
  } else if (e.button === 2) {
    // Right button
    if (["LINESTRING", "POLYGON"].includes(drawOperation.value)) {
      drawStart = false;
      if (draftCoordinates.length >= 2 && drawOperation.value === "LINESTRING") {
        draftGeometries.push(new LineString(draftCoordinates));
      } else if (draftCoordinates.length >= 3 && drawOperation.value === "POLYGON") {
        console.log("draw end mouse up: ", draftCoordinates.length);
        draftCoordinates.push(draftCoordinates[0]);
        let lr = new LinearRing(draftCoordinates);
        draftGeometries.push(new Polygon([lr.getCoordinates()]));
      }
      draftCoordinates.length = 0;
    }
  }

  isDragging = false;
  drawDraft();
};

const onDragEnd = () => {
  let xoff = dragEnd[0] - dragStart[0];
  let yoff = dragEnd[1] - dragStart[1];
  center.value[0] -= xoff;
  center.value[1] -= yoff;
  emits("mapViewChanged", {
    zoom: [3857, 900913].includes(srid.value) ? zoom.value : false,
    center: center.value,
    scale: scale.value,
  });
  drawDraft();
};
const onMouseMove = (e) => {
  let coord = pixelToMap([e.offsetX, e.offsetY]);
  draftMoveingCoordinate = coord;

  // dragging
  if (e.buttons === 1) {
    if (!isDragging) {
      dragStart = dragEnd = coord;
    } else {
      dragEnd = coord;
      onDragEnd();
    }

    isDragging = true;
  } else {
    if (["LINESTRING", "POLYGON"].includes(drawOperation.value)) {
      drawDraft();
    }
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
