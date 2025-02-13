<template>
  <q-input
    dense
    outlined
    hide-bottom-space
    type="text"
    label="Input Captcha"
    :rules="[
      (val) =>
        (val && val.length >= props.minLength && val.length <= props.maxLength) ||
        'The captcha is invalid: length must be greater than or equals to  ' +
          props.minLength +
          ' and be less than or equals to ' +
          props.maxLength +
          ' .',
    ]"
  >
    <template v-slot:append>
      <q-btn
        dense
        size="sm"
        round
        color="primary"
        icon="code"
        no-caps
        @click="onGetCaptcha"
      >
        <q-tooltip class="bg-accent" anchor="top middle">Get captcha</q-tooltip>
      </q-btn>
    </template>
  </q-input>
</template>
<script setup>
import { useQuasar } from "quasar";
import SQLCartoDatabase from "src/net/SQLCartoDatabase.js";
import { toRefs } from "vue";

const $q = useQuasar();
const props = defineProps({
  minLength: {
    type: Number,
    default: 6,
  },
  maxLength: {
    type: Number,
    default: 6,
  },
  username: {
    type: String,
    default: "",
  },
});

const { username } = toRefs(props);

const onGetCaptcha = () => {
  const db = new SQLCartoDatabase({});
  db.userGetCaptcha(username.value, (response) => {
    $q.notify({
      type: response.success ? "positive" : "negative",
      position: "top",
      message: response.message,
    });
  });
};
</script>
