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
              @click="onClick(item.id)"
            >
              <q-icon size="3.5em" :name="item.icon"></q-icon>
              <div class="button-label">{{ item.label }}</div>
            </q-btn>
          </div>
        </div>
      </div>
      <div class="full-width bg-primary">
        <q-toolbar style="min-height: 36px"> </q-toolbar>
      </div>
    </div>

    <CatalogWindow v-model="catalogWindowVisible" :container="`#${desktopId}`" />
    <MapEditor v-model="mapEditorVisible" :container="`#${desktopId}`" />
  </q-page>
</template>

<script setup>
import { useId } from "quasar";
import CatalogWindow from "src/components/gis/CatalogWindow.vue";
import MapEditor from "src/components/gis/MapEditor.vue";

import { ref } from "vue";

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

const catalogWindowVisible = ref(false);
const mapEditorVisible = ref(false);

const onClick = (id) => {
  if (id === "catalog") {
    catalogWindowVisible.value = true;
  } else if (id === "map") {
    mapEditorVisible.value = true;
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
