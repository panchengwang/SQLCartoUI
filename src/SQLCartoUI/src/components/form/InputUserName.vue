<template>
  <q-input
    dense
    outlined
    hide-bottom-space
    type="text"
    label="Input email as user name"
    :rules="[
      (val) =>
        /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(val.toLowerCase()) ||
        'Email is invalid! Please check it!',
    ]"
  >
    <template v-slot:append>
      <q-btn
        color="primary"
        dense
        round
        size="sm"
        icon="how_to_reg"
        no-caps
        @click="onUserCheckExists"
      >
        <q-tooltip class="bg-accent" anchor="top middle">Check if user exists</q-tooltip>
      </q-btn>
    </template>
  </q-input>
</template>

<script setup>
import { useAttrs } from "vue";
import SQLCartoDatabase from "src/net/SQLCartoDatabase";
import { useQuasar } from "quasar";
const $attrs = useAttrs();

const $q = useQuasar();
const onUserCheckExists = () => {
  const db = new SQLCartoDatabase();
  db.userIfAvailable($attrs.modelValue.trim(), (response) => {
    $q.notify({
      type: response.success ? "positive" : "negative",
      position: "top",
      message: response.message,
    });
  });
};
</script>
