<template>
  <ResizeableDialog @accept="onAccept">
    <template v-slot:content>
      <q-form class="full-width q-pt-md q-gutter-sm">
        <label>GaoDe:</label>
        <q-input
          class="q-pa-none"
          outlined
          dense
          label="key"
          v-model="appConfig.getGaoDe.key"
        ></q-input>
        <q-input
          outlined
          dense
          label="password"
          v-model="appConfig.getGaoDe.password"
        ></q-input>
        <label>Google:</label>
        <q-input
          class="q-pa-none"
          outlined
          dense
          label="key"
          v-model="appConfig.getGoogle.key"
        ></q-input>
        <label>Bing:</label>
        <q-input
          class="q-pa-none"
          outlined
          dense
          label="key"
          v-model="appConfig.getBing.key"
        ></q-input>
        <label>TianDiTu:</label>
        <q-input
          class="q-pa-none"
          outlined
          dense
          label="key"
          v-model="appConfig.getTianDitu.key"
        ></q-input>
      </q-form>
    </template>
  </ResizeableDialog>
</template>

<script setup>
import { useAppConfig } from "src/stores/ApplicationConfiguration";
import ResizeableDialog from "src/components/dialog/ResizeableDialog.vue";

const appConfig = useAppConfig();

const onAccept = () => {
  appConfig.setGaoDe(appConfig.getGaoDe.key, appConfig.getGaoDe.password);
  appConfig.setBing(appConfig.getBing.key);
  appConfig.setGoogle(appConfig.getGoogle.key);
  appConfig.setTianDiTu(appConfig.getTianDitu.key);
};
</script>
