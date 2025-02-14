<template>
  <ResizeableDialog @accept="onAccept">
    <template v-slot:content>
      <q-form class="full-width q-pt-md q-gutter-sm">
        <label>GaoDe:</label>
        <InputPassword
          class="q-pa-none"
          outlined
          dense
          label="key"
          v-model="appConfig.getGaoDe.key"
          :rules="[true]"
        ></InputPassword>
        <InputPassword
          outlined
          dense
          label="password"
          v-model="appConfig.getGaoDe.password"
          :rules="[true]"
        ></InputPassword>
        <label>Google:</label>
        <InputPassword
          class="q-pa-none"
          outlined
          dense
          label="key"
          v-model="appConfig.getGoogle.key"
          :rules="[true]"
        ></InputPassword>
        <label>Bing:</label>
        <InputPassword
          class="q-pa-none"
          outlined
          dense
          label="key"
          v-model="appConfig.getBing.key"
          :rules="[true]"
        ></InputPassword>
        <label>TianDiTu:</label>
        <InputPassword
          class="q-pa-none"
          outlined
          dense
          label="key"
          v-model="appConfig.getTianDitu.key"
          :rules="[true]"
        ></InputPassword>
      </q-form>
    </template>
  </ResizeableDialog>
</template>

<script setup>
import { useAppConfig } from "src/stores/ApplicationConfiguration";
import ResizeableDialog from "src/components/dialog/ResizeableDialog.vue";
import InputPassword from "../form/InputPassword.vue";
const appConfig = useAppConfig();

const onAccept = () => {
  appConfig.setGaoDe(appConfig.getGaoDe.key, appConfig.getGaoDe.password);
  appConfig.setBing(appConfig.getBing.key);
  appConfig.setGoogle(appConfig.getGoogle.key);
  appConfig.setTianDiTu(appConfig.getTianDitu.key);
};
</script>
