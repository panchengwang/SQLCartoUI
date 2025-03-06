<template>
  <q-page class="full-width full-height">
    <q-splitter v-model="splitterModel" class="full-height" unit="px">
      <template v-slot:before>
        <div class="q-pa-none full-height">
          <div class="full-width full-height">
            <q-card flat class="no-radius full-width full-height flex-column">
              <q-tabs
                v-model="tab"
                class="bg-primary text-white"
                align="left"
                narrow-indicator
                dense
                inline-label
                breakpoint="300"
              >
                <q-tab name="SQLCarto" label="SQLCarto" no-caps style="flex-shrink: 0" />
                <!-- <q-tab name="Database" label="Database" no-caps style="flex-shrink: 0" /> -->
              </q-tabs>

              <q-separator />

              <q-tab-panels v-model="tab" animated class="flex-fill-remaining">
                <q-tab-panel
                  name="SQLCarto"
                  style="padding-top: 1px; padding-left: 0px; padding-right: 0px"
                >
                  <CatalogTree class="full-height full-width"></CatalogTree>
                </q-tab-panel>

                <!-- <q-tab-panel name="Database" class="bg-grey-9 text-white">
                  <div class="text-h6">Alarms</div>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </q-tab-panel> -->
              </q-tab-panels>
            </q-card>
          </div>
        </div>
      </template>

      <template v-slot:after>
        <div class="q-pa-none full-height">
          <div class="full-width full-height">
            <MapControl class="full-width full-height"></MapControl>
          </div>
        </div>
      </template>
    </q-splitter>
  </q-page>
</template>

<script setup>
import CatalogTree from "src/components/gis/CatalogTree.vue";
import MapControl from "src/components/gis/MapControl.vue";
import { ref } from "vue";

const splitterModel = ref(300);
const tab = ref("SQLCarto");
// const limits = ref([0, 100]);
</script>

<style scoped>
.no-radius {
  border-radius: 0px !important;
}

.flex-column {
  display: flex;
  flex-direction: column;
}

.flex-fill-remaining {
  flex-grow: 1;
}
</style>
