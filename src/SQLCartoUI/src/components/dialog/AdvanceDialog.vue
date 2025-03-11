<template>
  <div ref="dialog">
    <div
      :style="{ zIndex: zIndex }"
      :id="backgroundId"
      style="
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: transparent;
      "
      v-show="isResizing || isDragging"
    ></div>
    <div
      v-show="props.modelValue"
      class="custom-window"
      :style="{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        backgroundColor: 'rgba(255, 255, 255, 0)',
        zIndex: zIndex + 1,
      }"
    >
      <q-card class="flex-column fit q-pa-none">
        <q-card-section dense class="q-ma-none q-pa-none">
          <q-toolbar
            dense
            class="bg-primary text-white"
            style="border-top-left-radius: 4px; border-top-right-radius: 4px"
            @dblclick="toggleMaximize()"
            @mousedown.stop="startDrag"
          >
            <q-toolbar-title>
              <div class="full-width full-height">
                {{ props.title }}
              </div>
            </q-toolbar-title>

            <div class="q-gutter-sm">
              <q-btn flat dense size="sm" icon="bi-dash-lg" />
              <q-btn
                flat
                dense
                size="sm"
                icon="bi-fullscreen-exit"
                @click="toggleMaximize()"
                v-show="isMaximized"
              />
              <q-btn
                flat
                dense
                size="sm"
                icon="bi-fullscreen"
                @click="toggleMaximize()"
                v-show="!isMaximized"
              />
              <q-btn flat dense size="sm" icon="bi-x-lg" @click="onClose" />
            </div>
          </q-toolbar>
        </q-card-section>
        <q-card-section class="flex-fill-remaining">
          <slot></slot>
        </q-card-section>
      </q-card>

      <div
        v-for="handle in resizeHandles"
        :key="handle.position"
        class="resize-handle"
        :class="handle.position"
        @mousedown.stop="startResize(handle.directions, $event)"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { useId } from "quasar";
import { onMounted, onBeforeUnmount, onUnmounted } from "vue";

import { ref } from "vue";
const backgroundId = useId();

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: { type: String, default: "Window" },
  container: { type: String, default: "body" },
  width: { type: Number, default: 450 },
  height: { type: Number, default: 300 },
  minWidth: { type: Number, default: 200 },
  minHeight: { type: Number, default: 200 },
});
const emits = defineEmits(["update:modelValue"]);

const resizeHandles = [
  { position: "top", directions: ["n"] },
  { position: "right", directions: ["e"] },
  { position: "bottom", directions: ["s"] },
  { position: "left", directions: ["w"] },
  { position: "top-left", directions: ["n", "w"] },
  { position: "top-right", directions: ["n", "e"] },
  { position: "bottom-left", directions: ["s", "w"] },
  { position: "bottom-right", directions: ["s", "e"] },
];

const dialog = ref(null);
const containerEl = ref(null);
const isMaximized = ref(false);
const isResizing = ref(false);
const isDragging = ref(false);

const zIndex = ref(10000);
const size = ref({ width: props.width, height: props.height });
const position = ref({ x: 50, y: 50 });
const initialValues = ref({ size: null, position: null });
const containerRect = ref({ left: 0, top: 0, width: 0, height: 0 });

const updateContainerRect = () => {
  if (containerEl.value) {
    const rect = containerEl.value.getBoundingClientRect();
    containerRect.value = {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    };
  }
};

onMounted(() => {
  containerEl.value = document.querySelector(props.container);
  containerEl.value.appendChild(dialog.value);
  updateContainerRect();
  position.value = {
    x: (containerRect.value.width - size.value.width) / 2,
    y: (containerRect.value.height - size.value.height) / 2,
  };
  initialValues.value = {
    size: { ...size.value },
    position: { ...position.value },
  };

  window.addEventListener("resize", updateContainerRect);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateContainerRect);
});

const toggleMaximize = () => {
  if (isMaximized.value) {
    size.value = initialValues.value.size;
    position.value = initialValues.value.position;
  } else {
    initialValues.value = {
      size: { ...size.value },
      position: { ...position.value },
    };
    size.value = {
      width: containerRect.value.width,
      height: containerRect.value.height,
    };
    position.value = { x: 0, y: 0 };
  }
  isMaximized.value = !isMaximized.value;
};

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateContainerRect);
});

const onClose = () => {
  emits("update:modelValue", false);
};

const startResize = (directions, e) => {
  e.preventDefault();
  if (isMaximized.value) return;
  isResizing.value = true;

  const startX = e.clientX;
  const startY = e.clientY;
  const initialSize = { ...size.value };
  const initialPosition = { ...position.value };

  const handleResize = (e) => {
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    directions.forEach((dir) => {
      switch (dir) {
        case "n":
          if (
            initialSize.height - deltaY >= props.minHeight &&
            initialPosition.y + deltaY >= 0
          ) {
            size.value.height = initialSize.height - deltaY;
            position.value.y = initialPosition.y + deltaY;
          }
          break;
        case "s":
          if (
            initialSize.height + deltaY >= props.minHeight &&
            position.value.y + initialSize.height + deltaY <= containerRect.value.height
          ) {
            size.value.height = initialSize.height + deltaY;
          }
          break;
        case "e":
          if (
            initialSize.width + deltaX >= props.minWidth &&
            position.value.x + initialSize.width + deltaX <= containerRect.value.width
          ) {
            size.value.width = initialSize.width + deltaX;
          }
          break;
        case "w":
          if (
            initialSize.width - deltaX >= props.minWidth &&
            initialPosition.x + deltaX >= 0
          ) {
            size.value.width = initialSize.width - deltaX;
            position.value.x = initialPosition.x + deltaX;
          }
          break;
      }
    });
  };

  const stopResize = () => {
    isResizing.value = false;
    containerEl.value.removeEventListener("mousemove", handleResize);
    containerEl.value.removeEventListener("mouseup", stopResize);
  };

  containerEl.value.addEventListener("mousemove", handleResize);
  containerEl.value.addEventListener("mouseup", stopResize);
};

const startDrag = (e) => {
  if (isResizing.value) return;
  isDragging.value = true;

  const startX = e.clientX;
  const startY = e.clientY;
  const initialPosition = { ...position.value };
  const handleDrag = (e) => {
    if (!isDragging.value) return;

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    position.value.x = initialPosition.x + deltaX;
    position.value.y = initialPosition.y + deltaY;

    if (position.value.x < 0) {
      position.value.x = 0;
    }
    if (position.value.y < 0) {
      position.value.y = 0;
    }

    if (position.value.x + size.value.width > containerRect.value.width) {
      position.value.x = containerRect.value.width - size.value.width;
    }
    if (position.value.y + size.value.height > containerRect.value.height) {
      position.value.y = containerRect.value.height - size.value.height;
    }
  };

  const stopDrag = () => {
    isDragging.value = false;
    containerEl.value.removeEventListener("mousemove", handleDrag);
    containerEl.value.removeEventListener("mouseup", stopDrag);
  };

  containerEl.value.addEventListener("mousemove", handleDrag);
  containerEl.value.addEventListener("mouseup", stopDrag);
};
</script>

<style scoped>
.custom-window {
  position: absolute;
}

.resize-handle {
  position: absolute;
  background: transparent;
  z-index: 1;
}

/* 调整大小手柄样式 */
.resize-handle.top,
.resize-handle.bottom {
  height: 4px;
  left: 4px;
  right: 4px;
  cursor: ns-resize;
}

.resize-handle.top {
  top: 0;
}
.resize-handle.bottom {
  bottom: 0;
}

.resize-handle.left,
.resize-handle.right {
  width: 4px;
  top: 4px;
  bottom: 4px;
  cursor: ew-resize;
}

.resize-handle.left {
  left: 0;
}
.resize-handle.right {
  right: 0;
}

.resize-handle[class*="-left"],
.resize-handle[class*="-right"] {
  width: 8px;
  height: 8px;
}

.resize-handle.top-left {
  top: 0;
  left: 0;
  cursor: nwse-resize;
}
.resize-handle.top-right {
  top: 0;
  right: 0;
  cursor: nesw-resize;
}
.resize-handle.bottom-left {
  bottom: 0;
  left: 0;
  cursor: nesw-resize;
}
.resize-handle.bottom-right {
  bottom: 0;
  right: 0;
  cursor: nwse-resize;
}

.q-toolbar {
  min-height: 32px !important;
}

.q-toolbar__title {
  font-size: 18px !important;
}
</style>
