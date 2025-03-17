<template>
  <q-toolbar style="min-height: 36px">
    <q-btn-dropdown
      dense
      flat
      color="white"
      :label="configuration.$state.username.trim()"
      icon="account_circle"
      no-caps
      class="no-arrow"
      v-show="
        configuration.$state.token.trim() !== '' &&
        configuration.$state.username.trim() !== ''
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
            {{ configuration.$state.username.trim() }}
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
    <q-btn flat dense icon="bi-microsoft" class="text-white" @click="onShowDesktop" />
    <q-toolbar-title class="row items-center justify-center q-gutter-x-md no-wrap">
      <q-btn
        class="truncate-btn"
        :class="!window.activate ? 'bg-primary text-white' : 'bg-white text-primary'"
        v-for="window in winManager.$state.windows"
        :key="window.id"
        flat
        dense
        no-wrap
        :label="window.id"
        :icon="window.icon"
        @click="emits('activate', window.id)"
        style="max-width: 100px"
      />
    </q-toolbar-title>

    <div style="width: 150px"></div>
  </q-toolbar>
</template>

<script setup>
import { useConfiguration } from "src/stores/Configuration";
import { useWindowsManager } from "src/stores/WindowsManager";
import { useRouter } from "vue-router";

const configuration = useConfiguration();
const winManager = useWindowsManager();
const router = useRouter();
const emits = defineEmits(["activate"]);

const onShowDesktop = () => {
  winManager.$state.windows.forEach((window) => {
    window.visible = false;
  });
};
const onLogout = () => {
  configuration.setAccountInformation("", "");
  router.replace({ name: "login" });
};
</script>

<style scoped>
.no-arrow .q-btn__dropdown-icon {
  display: none !important;
}

.truncate-btn {
  max-width: 120px; /* 控制按鈕最大寬度 */
}

/* 穿透樣式到按鈕內容容器 */
.truncate-btn ::v-deep .q-btn__content {
  display: flex; /* 使用 flex 布局 */
  align-items: flex-start; /* 垂直居中 */
  min-width: 0; /* 覆蓋 Quasar 默認的 min-width */
  width: 100%; /* 確保容器填滿按鈕 */
}

.truncate-btn ::v-deep .q-btn__content span {
  flex: 1;
  min-width: 0; /* 允許文本容器縮小 */
  white-space: nowrap; /* 強制單行顯示 */
  overflow: hidden; /* 隱藏溢出 */
  text-overflow: ellipsis; /* 顯示省略號 */
}

/* 單獨控制文本標籤的截斷 */
.truncate-btn ::v-deep .q-btn__label {
  flex: 1; /* 文本佔據剩餘空間 */
  min-width: 0; /* 允許文本容器縮小 */
  white-space: nowrap; /* 強制單行顯示 */
  overflow: hidden; /* 隱藏溢出 */
  text-overflow: ellipsis; /* 顯示省略號 */
}

/* 確保圖標不被壓縮 */
.truncate-btn ::v-deep .q-icon {
  flex-shrink: 0; /* 禁止圖標縮小 */
}
</style>
