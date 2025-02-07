<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <div class="q-dialog-plugin container" style="width: 800px; height: 300px">
      <div class="corner-tl"></div>
      <div class="corner-tr"></div>
      <div class="corner-bl"></div>
      <div class="corner-br"></div>
      <div class="top"></div>
      <div class="bottom"></div>
      <div class="left"></div>
      <div class="right"></div>
      <div class="center">
        <q-card class="full-width full-height">
          <q-card-section
            dense
            class="row items-center justify-between q-ma-none q-pa-sm bg-primary text-white"
          >
            <div class="text-h7">{{ props.caption }}</div>
            <div>
              <q-btn dense flat size="sm" icon="minimize" />
              <q-btn dense flat size="sm" icon="crop_square" />
              <q-btn dense flat size="sm" icon="close" @click="onDialogCancel" />
            </div>
          </q-card-section>
          <q-card-section
            dense
            class="row items-center justify-between q-ma-none q-pa-sm"
            style="flex-grow: 1"
          >
            <slot name="content"></slot>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn size="md" color="primary" label="OK" @click="onOKClick" icon="check" />
            <q-btn
              size="md"
              color="primary"
              label="Cancel"
              @click="onDialogCancel"
              icon="close"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from "quasar";

const props = defineProps({
  caption: { type: String, default: "Caption" },
});

const $emits = defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits,
  "accept",
]);

const {
  dialogRef,
  onDialogHide,
  onDialogOK,
  onDialogCancel,
} = useDialogPluginComponent();
// dialogRef      - Vue ref to be applied to QDialog
// onDialogHide   - Function to be used as handler for @hide on QDialog
// onDialogOK     - Function to call to settle dialog with "ok" outcome
//                    example: onDialogOK() - no payload
//                    example: onDialogOK({ /*...*/ }) - with payload
// onDialogCancel - Function to call to settle dialog with "cancel" outcome

// this is part of our example (so not required)
function onOKClick() {
  // on OK, it is REQUIRED to
  // call onDialogOK (with optional payload)
  $emits("accept", {});
  onDialogOK();
  // or with payload: onDialogOK({ ... })
  // ...and it will also hide the dialog automatically
}
</script>

<style scoped>
.container {
  display: grid;
  grid-template-columns: 4px 1fr 4px;
  grid-template-rows: 4px 1fr 4px;
  width: 100%;
  /* height: 100vh; 使用视窗高度单位，使容器充满整个屏幕 */
}

.corner-tl {
  grid-area: 1 / 1 / 2 / 2;
  cursor: nwse-resize;
} /* 左上角 */
.corner-tr {
  grid-area: 1 / 3 / 2 / 4;
  cursor: nesw-resize;
} /* 右上角 */
.corner-bl {
  grid-area: 3 / 1 / 4 / 2;
  cursor: nesw-resize;
} /* 左下角 */
.corner-br {
  grid-area: 3 / 3 / 4 / 4;
  cursor: nwse-resize;
} /* 右下角 */

.top {
  grid-area: 1 / 2 / 2 / 3;
  cursor: ns-resize;
} /* 上边 */
.bottom {
  grid-area: 3 / 2 / 4 / 3;
  cursor: ns-resize;
} /* 下边 */

.left {
  grid-area: 2 / 1 / 3 / 2;
  cursor: ew-resize;
} /* 左边 */
.right {
  grid-area: 2 / 3 / 3 / 4;
  cursor: ew-resize;
} /* 右边 */

.center {
  grid-area: 2 / 2 / 3 / 3;
} /* 中心 */
</style>
