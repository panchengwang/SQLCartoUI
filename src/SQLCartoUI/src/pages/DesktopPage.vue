<template>
  <q-page class="full-width full-height">
    <div class="full-width full-height flex-column">
      <div
        class="flex-fill-remaining bg-indigo-1 items-center justify-center overflow-hidden"
        :id="desktopId"
      >
        <div class="div-with-bg-logo absolute full-width full-height"></div>
        <div class="row full-width full-height justify-center overflow: scroll">
          <div
            class="q-pt-xl q-px-xl q-pb-lg q-gutter-lg"
            style="width: 67%; min-width: 200px"
          >
            <q-btn
              v-for="item in appButtons"
              :key="item.id"
              stack
              color="indigo-7 "
              no-caps
              class="q-pa-none"
              style="width: 100px; height: 100px"
              @dblclick="onStart(item.id)"
              flat
            >
              <q-icon size="3.5em" :name="item.icon"></q-icon>
              <div class="button-label">{{ item.label }}</div>
            </q-btn>
          </div>

          <!-- <div v-for="(win, index) in windows" :key="index">
            <component
              v-bind:is="win.type"
              :containter="win.container"
              v-model="win.visible"
              v-if="win.visible"
              @close="
                console.log('remove dialog');
                windows.splice(index, 1);
              "
            ></component>
          </div> -->
          <DragableResizableWindow
            v-model="win.visible"
            v-for="win in winManager.$state.windows"
            :key="win.id"
            :container="win.container"
            :icon="win.icon"
            :height="win.height"
            :width="win.width"
            :title="win.id"
            :id="win.id"
            :activate="win.activate"
            @close="onCloseWindow($event)"
            @activate="onActiveWindow"
            :ref="setWindows"
          >
            <component :is="win.type"></component>
          </DragableResizableWindow>
        </div>
      </div>
      <div class="full-width bg-primary">
        <DesktopDockBar @activate="onActiveWindow"></DesktopDockBar>
      </div>
    </div>

    <!-- <CatalogWindow
      ref="catalogWindow"
      v-model="catalogWindowVisible"
      :container="`#${desktopId}`"
    />
    <MapEditor ref="mapEditor" v-model="mapEditorVisible" :container="`#${desktopId}`" /> -->
  </q-page>
</template>

<script setup>
import { useId } from "quasar";

// import CatalogWindow from "src/components/gis/CatalogWindow.vue";
// import MapEditor from "src/components/gis/MapEditor.vue";
import { useQuasar } from "quasar";
import { ref, onMounted, markRaw } from "vue";
import DesktopDockBar from "./DesktopDockBar.vue";
import DragableResizableWindow from "src/components/dialog/DragableResizableWindow.vue";
import MapEditorPanel from "src/components/gis/MapEditorPanel.vue";
import CatalogPanel from "src/components/gis/CatalogPanel.vue";
import { useWindowsManager } from "src/stores/WindowsManager";

const desktopId = useId();
const appButtons = ref([
  {
    id: "catalog",
    icon: "fas fa-database",
    label: "Spatial DB",
  },
  {
    id: "map",
    icon: "fg-world-map",
    label: "Map Editor",
  },
  {
    id: "toolbox",
    icon: "bi-tools",
    label: "Toolbox",
  },
  {
    id: "symbol",
    icon: "fg-map-legend",
    label: "Symbols",
  },
  {
    id: "settings",
    icon: "bi-gear",
    label: "Settings",
  },
  {
    id: "convert",
    icon: "fas fa-arrow-right-arrow-left",
    label: "Convert",
  },
  {
    id: "projection",
    icon: "fg-proj-geo",
    label: "Projection",
  },
]);

const winManager = useWindowsManager();
const windows = ref({});
const $q = useQuasar();
const setWindows = (el) => {
  if (el && el.id) {
    windows.value[el.id] = el;
  }
};

onMounted(() => {});
const onStart = (id) => {
  let winid = useId().value;
  if (id === "catalog") {
    // catalogWindowVisible.value = true;
    // if (catalogWindow.value) {
    //   catalogWindow.value.activate();
    // }
    winid = "SQLCarto DB - " + winid;
    winManager.$state.windows.push({
      id: winid,
      icon: "fas fa-database",
      width: "80%",
      height: "80%",
      activate: false,
      visible: true,
      type: markRaw(CatalogPanel),
      container: `#${desktopId.value}`,
    });
    onActiveWindow(winid);
  } else if (id === "map") {
    winid = "Map - " + winid;
    winManager.$state.windows.push({
      id: winid,
      icon: "fg-world-map",
      width: "80%",
      height: "80%",
      activate: false,
      visible: true,
      type: markRaw(MapEditorPanel),
      container: `#${desktopId.value}`,
    });
    onActiveWindow(winid);
  } else if (id === "toolbox") {
    createToolbox();
  } else {
    $q.notify(`${id} is not implemented yet`);
  }
};

const createToolbox = () => {
  // let toolbox = document.createElement("div");
  // document.body.appendChild(toolbox);
  // let win = createApp(MapEditor, {
  //   container: `#${desktopId.value}`,
  // });
  // win.mount(toolbox);
};

const onCloseWindow = (id) => {
  let index = -1;
  for (let i = 0; i < winManager.$state.windows.length; i++) {
    if (winManager.$state.windows[i].id === id) {
      index = i;
      break;
    }
  }
  console.log("remove dialog", index);
  if (index >= 0) winManager.$state.windows.splice(index, 1);
};

const onActiveWindow = (id) => {
  for (let i = 0; i < winManager.$state.windows.length; i++) {
    if (winManager.$state.windows[i].id === id) {
      winManager.$state.windows[i].visible = true;
      winManager.$state.windows[i].activate = true;
    } else {
      winManager.$state.windows[i].activate = false;
    }
    if (windows.value[id]) {
      windows.value[id].activate();
    }
  }
};
</script>

<style scoped>
.div-with-bg-logo {
  background-image: url("/icons/logo.svg");
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.6;
  background-size: calc(100% * 0.6) calc(100% * 0.6);
}

.button-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}
</style>
