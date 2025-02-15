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
import SQLCartoDatabase from "src/net/SQLCartoDatabase";
const appConfig = useAppConfig();

const onAccept = () => {
  const db = new SQLCartoDatabase();
  db.userSaveWebMapKeys({
    username: appConfig.$state.username,
    token: appConfig.$state.token,
    webmapkeys: {
      gaode_key: appConfig.webMapKeys.GaoDe.key,
      gaode_password: appConfig.$state.webMapKeys.GaoDe.password,
      bing_key: appConfig.$state.webMapKeys.Bing.key,
      google_key: appConfig.$state.webMapKeys.Google.key,
      tianditu_key: appConfig.$state.webMapKeys.TianDiTu.key,
    },
  });
};
</script>
