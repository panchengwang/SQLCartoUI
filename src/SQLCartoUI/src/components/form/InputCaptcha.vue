<template>
  <q-input
    dense
    outlined
    hide-bottom-space
    type="text"
    label="Input Captcha"
    :rules="[
      (val) =>
        (val && val.length === 8) ||
        'The password does not match the one entered previously.',
    ]"
  >
    <template v-slot:append>
      <q-btn dense size="sm" round color="primary" icon="code" no-caps>
        <q-tooltip class="bg-accent" anchor="top middle">Get captcha</q-tooltip>
      </q-btn>
    </template>
  </q-input>
</template>
<script setup></script>
