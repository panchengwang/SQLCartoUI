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
        <q-menu context-menu>
          <q-list dense style="width: 200px">
            <q-item
              clickable
              v-close-popup
              v-if="['ROOT', 'FOLDER'].includes(prop.node.type)"
            >
              <q-item-section side>
                <q-icon name="fg-layer-alt-add-o" class="text-primary" />
              </q-item-section>
              <q-item-section>New Spatial Layer</q-item-section>
            </q-item>
            <q-item
              clickable
              v-close-popup
              v-if="['ROOT', 'FOLDER'].includes(prop.node.type)"
            >
              <q-item-section>Submenu Label</q-item-section>
              <q-item-section side>
                <q-icon name="keyboard_arrow_right" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </template>
    </q-tree>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

const expanded = ref([0]);
const selected = ref(null);
const currentNode = ref(null);

const catalogData = ref([
  {
    id: 0,
    name: "SQLCarto DB",
    icon: "img:/icons/logo.svg",
    type: "ROOT",
    children: [
      {
        id: 1,
        name: "Tables",
        icon: "table_view",
        type: "TABLE",
      },
      {
        id: 2,
        name: "Point",
        icon: "fg-point",
        type: "POINT",
      },
      {
        id: 3,
        name: "LineString",
        icon: "fg-polyline",
        type: "LINESTRING",
      },
      {
        id: 4,
        name: "polygon",
        icon: "fg-polygon",
        type: "POLYGON",
      },
    ],
  },
]);

onMounted(() => {});

const getIcon = (type) => {
  switch (type) {
    case "ROOT":
      return "img:/icons/logo.svg";
    case "FOLDER":
      return "folder";
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
</script>

<style scoped></style>
