<template>
  <q-layout view="hHh lpR fFf" class="full-height">
    <q-header bordered height-hint="32px">
      <q-toolbar style="min-height: 36px">
        <q-btn flat dense round icon="menu" aria-label="Menu" />

        <q-toolbar-title> Welcome to PCWang's GIS World. </q-toolbar-title>

        <q-btn
          dense
          flat
          color="white"
          icon-right="account_circle"
          size="md"
          label="Sign In"
          no-caps
        />
        <!-- <div>Quasar v{{ $q.version }}</div> -->
      </q-toolbar>
    </q-header>

    <!-- <q-drawer v-model="leftDrawerOpen" show-if-above bordered> </q-drawer> -->

    <q-page-container class="full-height">
      <router-view />
    </q-page-container>

    <q-footer bordered class="bg-grey-2 text-grey-9">
      <q-toolbar style="min-height: 32px"> </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
// import { ref } from "vue";

// const leftDrawerOpen = ref(false);

// function toggleLeftDrawer() {
//   leftDrawerOpen.value = !leftDrawerOpen.value;
// }
</script>
