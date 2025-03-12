<template>
  <ResizeableDialog @accept="onAccept" caption="API keys for web map service">
    <template v-slot:content>
      <q-form class="full-width q-pt-md q-gutter-sm">
        <label>GaoDe:</label>
        <InputPassword
          class="q-pa-none"
          outlined
          dense
          label="key"
          v-model="configuration.$state.webMapKeys.GaoDe.key"
          :rules="[true]"
        ></InputPassword>

        <InputPassword
          outlined
          dense
          label="password"
          v-model="configuration.$state.webMapKeys.GaoDe.password"
          :rules="[true]"
        ></InputPassword>

        <label>QQ:</label>
        <InputPassword
          class="q-pa-none"
          outlined
          dense
          label="key"
          v-model="configuration.$state.webMapKeys.QQ.key"
          :rules="[true]"
        ></InputPassword>
        <label>Google:</label>
        <InputPassword
          class="q-pa-none"
          outlined
          dense
          label="key"
          v-model="configuration.$state.webMapKeys.Google.key"
          :rules="[true]"
        ></InputPassword>
        <label>Bing:</label>
        <InputPassword
          class="q-pa-none"
          outlined
          dense
          label="key"
          v-model="configuration.$state.webMapKeys.Bing.key"
          :rules="[true]"
        ></InputPassword>
        <label>TianDiTu:</label>
        <InputPassword
          class="q-pa-none"
          outlined
          dense
          label="key"
          v-model="configuration.$state.webMapKeys.TianDiTu.key"
          :rules="[true]"
        ></InputPassword>
      </q-form>
    </template>
  </ResizeableDialog>
</template>

<script setup>
import { useConfiguration } from "src/stores/Configuration";
import ResizeableDialog from "src/components/dialog/ResizeableDialog.vue";
import InputPassword from "../form/InputPassword.vue";
import SQLCartoDatabase from "src/net/SQLCartoDatabase";
import { useQuasar } from "quasar";
const configuration = useConfiguration();
const $q = useQuasar();

const onAccept = () => {
  const db = new SQLCartoDatabase();
  db.userSaveWebMapKeys(
    {
      username: configuration.$state.username,
      token: configuration.$state.token,
      webmapkeys: {
        gaode_key: configuration.webMapKeys.GaoDe.key,
        gaode_password: configuration.$state.webMapKeys.GaoDe.password,
        bing_key: configuration.$state.webMapKeys.Bing.key,
        google_key: configuration.$state.webMapKeys.Google.key,
        tianditu_key: configuration.$state.webMapKeys.TianDiTu.key,
        qq_key: configuration.$state.webMapKeys.QQ.key,
      },
    },
    (response) => {
      if (!response.success) {
        $q.notify({
          type: "negative",
          position: "top",
          message: response.message,
        });
      }
    }
  );
};
</script>
