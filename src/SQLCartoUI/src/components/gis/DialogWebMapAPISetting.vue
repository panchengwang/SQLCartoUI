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
          v-model="appConfig.$state.webMapKeys.GaoDe.key"
          :rules="[true]"
        ></InputPassword>
        <InputPassword
          outlined
          dense
          label="password"
          v-model="appConfig.$state.webMapKeys.GaoDe.password"
          :rules="[true]"
        ></InputPassword>
        <label>Google:</label>
        <InputPassword
          class="q-pa-none"
          outlined
          dense
          label="key"
          v-model="appConfig.$state.webMapKeys.Google.key"
          :rules="[true]"
        ></InputPassword>
        <label>Bing:</label>
        <InputPassword
          class="q-pa-none"
          outlined
          dense
          label="key"
          v-model="appConfig.$state.webMapKeys.Bing.key"
          :rules="[true]"
        ></InputPassword>
        <label>TianDiTu:</label>
        <InputPassword
          class="q-pa-none"
          outlined
          dense
          label="key"
          v-model="appConfig.$state.webMapKeys.TianDiTu.key"
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
  console.log(appConfig.$state.webMapKeys);
};
</script>
