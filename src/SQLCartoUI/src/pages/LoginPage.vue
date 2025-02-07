<template>
  <q-page class="full-width full-height bg-blue-3">
    <div class="absolute row no-wrap full-width full-height flex flex-center q-gutter-md">
      <div class="div-with-bg"></div>
      <div class="div-with-bg"></div>
      <div class="div-with-bg"></div>
    </div>
    <div class="absolute row no-wrap full-width full-height q-gutter-md">
      <q-card
        style="min-width: 500px; top: 150px; right: 150px"
        class="absolute"
        bordered="false"
      >
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
            <q-input dense outlined v-model="password" type="password" label="Password" />
          </q-form>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat no-caps @click="onRegister">Register</q-btn>
          <div style="flex-grow: 1"></div>
          <q-btn flat no-caps @click="onLogin">Sign In</q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { useAppConfig } from "src/stores/useAppConfig";
import { useRouter } from "vue-router";

const appConfig = useAppConfig();
const router = useRouter();

const onLogin = () => {
  appConfig.setAccountInformation("pcwang", "sdfasdfs");
  router.replace({ name: "application" });
};

const onRegister = () => {
  router.replace({ name: "register" });
};
</script>

<style scoped>
.div-with-bg {
  width: 450px; /* 根据需要调整宽度 */
  height: 450px; /* 根据需要调整高度 */
  background-image: url("/icons/logo.svg"); /* 替换为你的图片URL */
  background-size: 450px 450px; /* 设置背景图片的具体尺寸 */
  background-position: center; /* 居中显示背景图片 */
  background-repeat: no-repeat; /* 确保背景图片不会重复 */
  opacity: 1;
}
</style>
