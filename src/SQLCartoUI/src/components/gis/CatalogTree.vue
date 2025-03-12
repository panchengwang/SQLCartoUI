<template>
  <div class="q-pa-none q-gutter-none">
    <q-tree
      :nodes="catalogData"
      node-key="id"
      label-key="name"
      no-connectors
      v-model:expanded="expanded"
      v-model:selected="selected"
      @update:selected="onSelected"
      class="q-gutter-none"
      color="primary"
    >
      <template v-slot:default-header="prop">
        <div
          class="row items-center full-width q-pa-none q-ma-none cursor-pointer rounded-borders"
          :class="
            selected === prop.node.id ? 'bg-blue-3 text-black' : 'bg-white text-black'
          "
          @contextmenu.capture="onContextMenu($event, prop.node)"
        >
          <q-icon dense :name="getIcon(prop.node.type)" color="text-primary" size="sm" />
          <div class="q-pl-sm">{{ prop.node.name }}</div>
        </div>

        <q-menu
          context-menu
          id="groupmenu"
          v-if="['ROOT', 'FOLDER'].includes(prop.node.type)"
        >
          <q-list dense style="width: 200px">
            <q-item clickable v-close-popup @click="onNewSpatialLayer">
              <q-item-section side>
                <q-icon name="fg-layer-alt-add-o" class="text-primary" size="xs" />
              </q-item-section>
              <q-item-section>New Spatial Layer</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section side>
                <q-icon name="bi-table" class="text-primary" size="xs" />
              </q-item-section>
              <q-item-section>New Table</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section side>
                <q-icon name="bi-folder-plus" class="text-primary" size="xs" />
              </q-item-section>
              <q-item-section>New Folder</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable v-close-popup v-if="prop.node.type === 'FOLDER'">
              <q-item-section side>
                <q-icon name="bi-folder-minus" class="text-primary" size="xs" />
              </q-item-section>
              <q-item-section>Delete</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </template>
    </q-tree>

    <DragableResizableWindow
      v-if="dialogVisible"
      v-model="dialogVisible"
      :modal="true"
    ></DragableResizableWindow>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import DragableResizableWindow from "../dialog/DragableResizableWindow.vue";

const expanded = ref([0]);
const selected = ref(null);
const currentNode = ref(null);

const catalogData = ref([
  {
    id: 0,
    name: "SQLCarto DB",
    type: "ROOT",
    children: [],
  },
]);

onMounted(() => {});

const getIcon = (type) => {
  switch (type) {
    case "ROOT":
      return "img:/icons/logo.svg";
    case "FOLDER":
      return "o_folder";
    case "TABLE":
      return "table_view";
    case "POINT":
      return "fg-point";
    case "LINESTRING":
      return "fg-polyline";
    case "POLYGON":
      return "fg-polygon";
    default:
      return "";
  }
};

const onSelected = (val) => {
  console.log(val);
};

const onContextMenu = (event, node) => {
  currentNode.value = node;
  selected.value = node.id;
};

const dialogVisible = ref(false);
const onNewSpatialLayer = () => {
  dialogVisible.value = true;
};
</script>

<style scoped></style>
