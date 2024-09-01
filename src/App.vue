<template>
  <router-view />
</template>

<script>
import { defineComponent, provide, watch } from "vue";
import { useAuthStore } from "./stores/AuthStore";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "App",
  setup() {
    const store = useAuthStore();
    const $Q = useQuasar();
    provide("store", store);
    $Q.dark.set("false");

    //esto funcionaba
    // store.handleAuthStateChanged();

    // watch(store.usuario.value, async () => {
    //   if (usuario.value) {
    //     await categorias.value; // Actualiza la lista de categorías
    //   }
    // });
  },
});
// onMounted(async () => {
//   await store.handleAuthStateChanged(); // Espera a que el usuario se obtenga
//   await store.actualizarListaCategorias(); // Actualiza la lista de categorías
// });
</script>
