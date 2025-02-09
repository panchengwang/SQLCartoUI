<template>
  <q-page class="item-center">
    <div class="fit flex justify-center q-pt-xl">
      <q-form
        class="q-gutter-md"
        style="min-width: 500px; width: 50%"
        @submit="onRegister"
      >
        <InputUserName v-model="username"> </InputUserName>
        <InputPassword dense outlined v-model="password" hide-bottom-space />
        <InputPassword
          label="Please input password again."
          v-model="password2"
          :rules="[
            (val) =>
              password === password2 ||
              'The password does not match the one entered previously.',
          ]"
        ></InputPassword>

        <InputCaptcha v-model="captcha" :username="username"></InputCaptcha>
        <div class="row">
          <div class="col"></div>
          <q-btn dense label="Register" type="submit" color="primary" no-caps />
          <q-btn
            dense
            label="Cancel"
            color="primary"
            flat
            class="q-ml-sm"
            no-caps
            @click="onCancel"
          />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup>
import InputCaptcha from "src/components/form/InputCaptcha.vue";
import InputPassword from "src/components/form/InputPassword.vue";
import InputUserName from "src/components/form/InputUserName.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
const username = ref("wang_wang_lao@163.com");
const password = ref("@Ww111111");
const password2 = ref("@Ww111111");
const captcha = ref("");
const router = useRouter();

const onRegister = () => {
  console.log("register");
};

const onCancel = () => {
  router.replace({ name: "login" });
};
</script>
