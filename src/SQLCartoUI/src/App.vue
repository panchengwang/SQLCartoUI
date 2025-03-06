<template>
  <router-view />
</template>

<script setup>
import { useQuasar } from "quasar";
const $q = useQuasar();
$q.iconMapFn = (iconName) => {
  // iconName is the content of QIcon "name" prop (or related icon prop of other Quasar components)

  // can be any logic you want, but for this example:
  if (iconName.startsWith("fg-") === true) {
    console.log("fg-icon: ", iconName);
    return { cls: iconName };
  }

  // when we don't return anything from our iconMapFn,
  // the default Quasar icon mapping takes over
};

document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});
</script>
