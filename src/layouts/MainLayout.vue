<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="q-my-xs">
        <q-btn
          v-if="isLoggin"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer()"
        />
        <q-toolbar-title v-if="!$q.screen.lt.sm">Gastos App </q-toolbar-title>
        <div class="q-mx-md">
          <div v-if="isLoggin" class="text-caption text-left">
            {{ mesActual }}
          </div>
          <div v-if="isLoggin" class="text-subtitle1">${{ totalMes }}</div>
        </div>
        <q-space />
        {{ emailLogged }}
        <q-btn class="q-ml-md" v-if="isLoggin" label="Salir" @click="LogOut" />
      </q-toolbar>
      <!-- <div v-if="cantidadAsignaciones > 0 && isLoggin" class="bg-blue-9">
        <q-scroll-area style="height: 60px">
          <div class="row no-wrap q-gutter-md q-px-md justify-center">
            <AsignacionesItemBar
              v-for="asignacion in presupuestoActual.asignaciones"
              :key="asignacion.index"
              :nombre="asignacion.nombre"
              :importe="Number(asignacion.importe)"
              :totalGastos="Number(asignacion.totalGastos)"
            />
          </div>
        </q-scroll-area>
      </div> -->
    </q-header>

    <q-drawer v-model="drawerOpen" bordered overlay elevated class="bg-blue-9">
      <q-list class="q-mt-md">
        <EssentialLink />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, computed, inject, watch } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import { usePresupuestosStore } from "src/stores/PresupuestosStore";
import { useAuthStore } from "src/stores/AuthStore";
import AsignacionesItemBar from "../components/AsignacionesItemBar.vue";

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
    //AsignacionesItemBar,
  },

  setup() {
    const drawerOpen = ref(false);
    // const store = inject("store");
    const store = useAuthStore();
    const presupuestoStore = usePresupuestosStore();
    const isLoggin = computed(() => store.isLoggedIn);
    const emailLogged = computed(() => store.userEmail);
    const mesActual = computed(() => store.mesActual);
    const totalMes = computed(() => store.totalMesActual);
    const presupuestoActual = computed(() => {
      return presupuestoStore.presupuestoActual;
    });

    const cantidadAsignaciones = computed(() => {
      var cantidad = 0;
      if (presupuestoActual.value.asignaciones) {
        cantidad = presupuestoActual.value.asignaciones.length;
      }
      return cantidad;
    });
    // watch(presupuestoActual, () => {
    //   cantidadAsignaciones.value = presupuestoActual.value.asignaciones.length;
    // });

    const LogOut = () => {
      store.logOut();
    };
    const toggleLeftDrawer = () => {
      drawerOpen.value = !drawerOpen.value;
    };

    return {
      EssentialLink,
      toggleLeftDrawer,
      emailLogged,
      LogOut,
      isLoggin,
      drawerOpen,
      mesActual,
      totalMes,
      presupuestoActual,
      AsignacionesItemBar,
      cantidadAsignaciones,
    };
  },
});
</script>
