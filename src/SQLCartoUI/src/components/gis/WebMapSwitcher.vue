<template>
  <div>
    <q-btn-dropdown
      dense
      color="primary"
      :label="currentWebMap.label"
      no-caps
      square
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

    <div
      class="absolute q-pa-none q-ma-none column no-wrap q-gutter-sm"
      unelevated
      style="right: 0px; top: 40px"
      v-show="currentWebMap.type !== 'NOMAP'"
    >
      <q-btn color="indigo-1" text-color="grey-8" dense style="border-radius: 8px">
        <q-avatar
          square
          style="border-radius: 4px"
          size="xl"
          font-size="22px"
          text-color="white"
          @click="onShowDefaultMap()"
        >
          <img src="/icons/default.png" />
        </q-avatar>
      </q-btn>
      <q-btn color="indigo-1" text-color="grey-8" dense style="border-radius: 8px">
        <q-avatar
          square
          style="border-radius: 4px"
          size="xl"
          font-size="22px"
          text-color="white"
          @click="onShowSatelliteMap()"
        >
          <img src="/icons/satellite.png" />
        </q-avatar>
      </q-btn>
      <q-btn
        color="indigo-1"
        text-color="grey-8"
        dense
        :disable="['TIANDITU', 'GOOGLE', 'BING'].indexOf(currentWebMap.type) >= 0"
        @click="onShowTrafficMap()"
        style="border-radius: 8px"
      >
        <q-avatar
          square
          style="border-radius: 4px"
          size="xl"
          font-size="22px"
          text-color="white"
          @click="console.log('avatar')"
        >
          <img src="/icons/traffic.png" />
        </q-avatar>
      </q-btn>
      <q-btn
        color="indigo-1"
        text-color="grey-8"
        dense
        stack
        :icon="labelVisible ? 'check_box' : 'check_box_outline_blank'"
        label="Labels"
        no-caps
        @click="onSwitchLabelVisible()"
        style="border-radius: 8px"
      >
      </q-btn>
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import { useConfiguration } from "src/stores/Configuration";
import { ref, toRefs } from "vue";
import DialogWebMapAPISetting from "./DialogWebMapAPISetting.vue";

const configuration = useConfiguration();
const $q = useQuasar();

const webMaps = [
  {
    icon: "/icons/gaode.png",
    label: "GaoDe",
    type: "GAODE",
    caption: "高德地图",
  },
  {
    icon: "/icons/qq.svg",
    label: "QQ",
    type: "QQ",
    caption: "腾讯地图",
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
  beforeMapChanged: {
    type: Function,
    default: () => {
      return true;
    },
  },
  getWebMapUrl: {
    type: Function,
    default: () => {
      return "/webmap/nomap.html";
    },
  },
});

const { webMapControl, beforeMapChanged, getWebMapUrl } = toRefs(props);
const labelVisible = ref(true);
const trafficVisible = ref(false);

const switchToMap = (type) => {
  const configKey = {
    GAODE: "getGaoDe",
    GOOGLE: "getGoogle",
    BING: "getBing",
    TIANDITU: "getTianDitu",
    QQ: "getQQ",
  }[type];

  if (!configKey || configuration[configKey].key.trim() === "") {
    $q.notify({
      position: "top",
      type: "negative",
      message: `Please set key of ${type} web map.`,
    });
    return;
  }

  webMapControl.value.src = getWebMapUrl.value(type);
};

const switchTo = (item) => {
  if (!beforeMapChanged.value()) {
    return;
  }
  if (currentWebMap.value.type === item.type) return;

  currentWebMap.value = item;
  labelVisible.value = true;

  if (["GAODE", "GOOGLE", "BING", "TIANDITU", "QQ"].includes(item.type)) {
    switchToMap(item.type);
  } else {
    webMapControl.value.src = getWebMapUrl.value();
  }
};

const onShowWebMapSetting = () => {
  showWebMapApiSetting.value = true;
};

const onShowDefaultMap = () => {
  webMapControl.value.contentWindow.setDefaultMapVisible();
};

const onShowSatelliteMap = () => {
  webMapControl.value.contentWindow.setSatelliteMapVisible();
};

const onSwitchLabelVisible = () => {
  labelVisible.value = !labelVisible.value;
  webMapControl.value.contentWindow.setLabelVisible(labelVisible.value);
};

const onShowTrafficMap = () => {
  trafficVisible.value = !trafficVisible.value;
  webMapControl.value.contentWindow.setTrafficMapVisible(trafficVisible.value);
};
</script>
