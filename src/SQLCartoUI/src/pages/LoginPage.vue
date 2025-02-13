<template>
  <q-page class="full-width full-height bg-blue-3">
    <div class="absolute row justify-center no-wrap full-width full-height q-gutter-md">
      <div class="col-1"></div>
      <div class="div-with-bg col"></div>
      <div class="div-with-bg col"></div>
      <div class="div-with-bg col"></div>
      <div class="col-1"></div>
    </div>
    <div class="absolute full-height full-width q-gutter-md flex flex-center">
      <q-card style="min-width: 500px; width: 30%; margin-top: -100px">
        <q-card-section class="bg-primary text-white q-pa-sm">
          <div class="text-h7">Sign In</div>
        </q-card-section>
        <q-card-section>
          <q-form
            dense
            @submit="onLogin"
            class="q-gutter-md full-width"
            style="width: 300px"
          >
            <q-input dense outlined v-model="username" type="text" label="UserName" />
            <InputPassword v-model="password"></InputPassword>
          </q-form>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat no-caps @click="onRegister">Register</q-btn>
          <q-btn flat no-caps @click="onResetPassword">Forget Password?</q-btn>
          <div style="flex-grow: 1"></div>
          <q-btn flat no-caps @click="onLogin">Sign In</q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import InputPassword from "src/components/form/InputPassword.vue";

import { useAppConfig } from "src/stores/ApplicationConfiguration";
import { useRouter } from "vue-router";

const appConfig = useAppConfig();
const router = useRouter();

const onLogin = () => {
  appConfig.setAccountInformation("pcwang", "sdfasdfs");
  router.replace({ name: "application" });
};

const onRegister = () => {
  router.replace({
    name: "register_or_reset_password",
    params: {
      type: "register",
    },
  });
};

const onResetPassword = () => {
  router.replace({
    name: "register_or_reset_password",
    params: { type: "reset_password" },
  });
};
</script>

<style scoped>
.div-with-bg {
  width: 100px;
  aspect-ratio: 1 / 1;
  background-image: url("/icons/logo.svg"); /* 替换为你的图片URL */
  background-position: center; /* 居中显示背景图片 */
  background-repeat: no-repeat;
  background-size: calc(100% * 0.8);
  opacity: 1;
}
</style>
