<template>
  <q-input
    dense
    outlined
    hide-bottom-space
    label="Password: 8 to 32 characters long, at least one uppercase letter, one lowercase letter, at least one of: @, #, $, %. "
    :type="inputType"
    :rules="[
      (val) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%])[A-Za-z\d@#$%]{8,32}$/.test(val) ||
        'The password must be 8 to 32 characters long, contain at least one uppercase letter, one lowercase letter, and include at least one of the following special characters: @, #, $, %.',
    ]"
  >
    <template v-slot:append>
      <q-btn
        dense
        :icon="inputType !== 'password' ? 'visibility' : 'visibility_off'"
        no-caps
        round
        text-color="white"
        color="primary"
        size="sm"
        @click="onTurnOnOffVisibility"
      >
        <q-tooltip class="bg-accent" anchor="top middle">View password</q-tooltip>
      </q-btn>
    </template>
  </q-input>
</template>

<script setup>
import { ref } from "vue";
const inputType = ref("password");

const onTurnOnOffVisibility = () => {
  if (inputType.value === "password") {
    inputType.value = "text";
  } else {
    inputType.value = "password";
  }
};
</script>
