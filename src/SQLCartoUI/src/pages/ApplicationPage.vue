<template>
  <q-page class="full-width full-height">
    <div class="full-width full-height flex-column">
      <div
        class="row flex-fill-remaining bg-indigo-1 items-center justify-center"
        :id="desktopId"
      >
        <div class="div-with-bg-logo absolute full-width full-height"></div>
        <div
          class="full-height q-pt-xl q-px-xl q-pb-lg justify-center q-gutter-lg"
          style="width: 67%; min-width: 200px"
        >
          <q-btn v-for="i in 10" :key="i" :label="`button${i}`"></q-btn>
        </div>
      </div>
      <div class="full-width bg-primary">
        <q-toolbar style="min-height: 36px"> </q-toolbar>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useId } from "quasar";

const desktopId = useId();
</script>

<style scoped>
.div-with-bg-logo {
  /* aspect-ratio: 1 / 1; */
  background-image: url("/icons/logo.svg"); /* 替换为你的图片URL */
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.9;
  background-size: calc(100% * 0.7) calc(100% * 0.7);
}
</style>
