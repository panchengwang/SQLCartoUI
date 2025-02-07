<template>
  <div>
    <q-btn-dropdown
      dense
      color="primary"
      :label="currentWebMap.label"
      no-caps
      square
      split
      class="full-width"
      unelevated
      stretch
    >
      <q-list>
        <q-item
          v-for="item in webMaps"
          v-ripple
          clickable
          v-close-popup
          :key="item.type"
          @click="switchTo(item)"
        >
          <q-item-section avatar>
            <q-avatar size="md">
              <img :src="item.icon" v-if="item.icon.trim() !== ''" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ item.label }}</q-item-label>
            <q-item-label caption class="text-grey-10">{{ item.caption }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator />

        <q-item clickable v-close-popup @click="onShowWebMapSetting">
          <q-item-section avatar>
            <q-avatar
              icon="settings"
              font-size="20px"
              color="primary"
              text-color="white"
              size="md"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>Setting</q-item-label>
            <q-item-label caption>Set keys of web map service.</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
    <DialogWebMapAPISetting
      v-model="showWebMapApiSetting"
      v-if="showWebMapApiSetting"
    ></DialogWebMapAPISetting>

    <!-- <q-avatar
      rounded
      color="primary"
      text-color="white"
      icon="layers"
      font-size="20px"
    ></q-avatar> -->
    <q-btn
      class="absolute q-pa-none q-ma-none"
      unelevated
      style="right: 0px; top: 36px"
      v-show="currentWebMap.type !== 'NOMAP'"
    >
      <q-avatar
        square
        style="border-radius: 4px"
        size="xl"
        font-size="22px"
        text-color="white"
        icon="layers"
        color="primary"
        @click="console.log('avatar')"
      >
      </q-avatar>
    </q-btn>
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import { useAppConfig } from "src/stores/useAppConfig";
import { ref, toRefs } from "vue";
import DialogWebMapAPISetting from "./DialogWebMapAPISetting.vue";

const appConfig = useAppConfig();
const $q = useQuasar();
const currentWebMap = ref({
  icon: "",
  label: "No Web Map",
  type: "NOMAP",
  caption: "无背景地图",
});
const showWebMapApiSetting = ref(false);

const props = defineProps({
  webMapControl: {
    type: Object,
    default: null,
  },
});

const { webMapControl } = toRefs(props);

const webMaps = [
  {
    icon: "/icons/gaode.png",
    label: "GaoDe",
    type: "GAODE",
    caption: "高德地图",
  },
  {
    icon: "/icons/google.png",
    label: "Google",
    type: "GOOGLE",
    caption: "谷歌地图",
  },
  {
    icon: "/icons/microsoft.png",
    label: "Bing",
    type: "BING",
    caption: "必应地图",
  },
  {
    icon: "/icons/tianditu.png",
    label: "TianDiTu",
    type: "TIANDITU",
    caption: "天地图",
  },
  {
    icon: "",
    label: "No Web Map",
    type: "NOMAP",
    caption: "无背景地图",
  },
];

const switchTo = (item) => {
  if (currentWebMap.value.type === item.type) return;
  currentWebMap.value = item;
  if (item.type === "GAODE") {
    switchToGaoDe();
  } else if (item.type === "GOOGLE") {
    switchToGoogle();
  } else if (item.type === "BING") {
    switchToBing();
  } else if (item.type === "TIANDITU") {
    switchToTianDiTu();
  } else {
    webMapControl.value.src = "/webmap/nomap.html";
  }
};

const switchToGaoDe = () => {
  if (appConfig.getGaoDe.key.trim() === "" || appConfig.getGaoDe.password.trim() === "") {
    $q.notify({
      message: "Please set key and password of gaode web map.",
      color: "purple",
    });
    return;
  }
  webMapControl.value.src = `/webmap/gaode.html?x=112.957273&y=28.199262&z=14&key=${appConfig.getGaoDe.key}&password=${appConfig.getGaoDe.password}`;
};

const switchToGoogle = () => {
  if (appConfig.getGoogle.key.trim() === "") {
    $q.notify({
      message: "Please set key and password of google web map.",
      color: "purple",
    });
    return;
  }
  webMapControl.value.src = `/webmap/google.html?x=112.957273&y=28.199262&z=14&key=${appConfig.getGoogle.key}`;
};

const switchToBing = () => {
  if (appConfig.getBing.key.trim() === "") {
    $q.notify({
      message: "Please set key and password of Bing web map.",
      color: "purple",
    });
    return;
  }
  webMapControl.value.src = `/webmap/bing.html?x=112.957273&y=28.199262&z=14&key=${appConfig.getBing.key}`;
};

const switchToTianDiTu = () => {
  if (appConfig.getBing.key.trim() === "") {
    $q.notify({
      message: "Please set key and password of TianDiTu web map.",
      color: "purple",
    });
    return;
  }
  webMapControl.value.src = `/webmap/tianditu.html?x=112.957273&y=28.199262&z=14&key=${appConfig.getTianDitu.key}`;
};

const onShowWebMapSetting = () => {
  showWebMapApiSetting.value = true;
};
</script>
