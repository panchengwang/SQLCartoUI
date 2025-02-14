<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin q-gutter-md" bordered>
      <q-card-section
        dense
        class="row items-center justify-between q-ma-none q-pa-sm bg-primary text-white"
      >
        <div class="text-h7">{{ props.caption }}</div>
        <div>
          <!-- <q-btn dense flat size="sm" icon="minimize" />
          <q-btn dense flat size="sm" icon="crop_square" /> -->
          <q-btn dense flat size="sm" icon="close" @click="onDialogCancel" />
        </div>
      </q-card-section>
      <q-card-section dense class="row items-center justify-between q-ma-none q-pa-sm">
        <slot name="content"></slot>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          no-caps
          size="md"
          dense
          color="primary"
          label="OK"
          @click="onOKClick"
          icon="check"
        />
        <q-btn
          no-caps
          dense
          size="md"
          color="primary"
          label="Cancel"
          @click="onDialogCancel"
          icon="close"
        />
      </q-card-actions>
    </q-card>
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
