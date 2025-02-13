<template>
  <q-layout view="hHh lpR fFf" class="full-height">
    <q-header bordered height-hint="32px">
      <q-toolbar style="min-height: 36px">
        <q-btn
          size="sm"
          color="white"
          dense
          round
          icon="img:/icons/logo.svg"
          aria-label="Menu"
        />

        <q-toolbar-title> Welcome to PCWang's GIS World. </q-toolbar-title>
        <q-btn-dropdown
          dense
          flat
          color="white"
          :label="appConfig.$state.username.trim()"
          icon="account_circle"
          no-caps
          v-show="
            appConfig.$state.token.trim() !== '' &&
            appConfig.$state.username.trim() !== ''
          "
        >
          <div class="row no-wrap q-pa-md" style="z-index: 1000">
            <div class="column">
              <div class="text-h6 q-mb-md">Settings</div>
              <q-toggle v-model="mobileData" label="Use Mobile Data" />
              <q-toggle v-model="bluetooth" label="Bluetooth" />
            </div>

            <q-separator vertical inset class="q-mx-lg" />

            <div class="column items-center">
              <q-avatar size="72px">
                <img src="/icons/pcwang.png" />
              </q-avatar>

              <div class="text-subtitle1 q-mt-md q-mb-xs">
                {{ appConfig.$state.username.trim() }}
              </div>

              <q-btn
                color="primary"
                label="Sign Out"
                push
                size="md"
                v-close-popup
                @click="onLogout"
                no-caps
              />
            </div>
          </div>
        </q-btn-dropdown>
        <!-- <q-btn-dropdown
          dense
          flat
          color="white"
          icon="account_circle"
          size="md"
          :label="appConfig.$state.username.trim()"
          no-caps
          v-show="
            appConfig.$state.token.trim() !== '' &&
            appConfig.$state.username.trim() !== ''
          "
        >
          <q-list>
            <q-item v-ripple clickable v-close-popup>
              <q-item-section avatar>
                <q-avatar icon="check" size="md"> </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>asfsf</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown> -->
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
import { useAppConfig } from "src/stores/ApplicationConfiguration";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const appConfig = useAppConfig();
const router = useRouter();

onMounted(() => {
  if (appConfig.hasLogin) {
    router.replace({ name: "application" });
  }
});

const onLogout = () => {
  appConfig.setAccountInformation("", "");
  router.replace({ name: "login" });
};
</script>
