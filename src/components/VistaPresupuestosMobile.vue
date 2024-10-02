<template>
  <div class="column items-start" style="width: 95%">
    <div class="titulo q-pa-md text-h6">Presupuestos</div>
    <div class="column no-wrap" v-if="visible" style="width: 100%">
      <div
        class="row no-wrap"
        style="width: 100%; overflow-x: auto; white-space: nowrap"
      >
        <div v-if="presupuestoActual.activo">
          <div
            :class="
              tab == 'actual' ? 'tab-presupuesto-activo' : 'tab-presupuesto'
            "
            clickable
            @click="tab = 'actual'"
          >
            Actual
          </div>
        </div>

        <div v-for="presupuesto in presupuestos" :key="presupuesto.index">
          <div
            :class="
              tab == presupuesto.mes.nombre
                ? 'tab-presupuesto-activo'
                : 'tab-presupuesto'
            "
            clickable
            @click="tab = presupuesto.mes.nombre"
          >
            {{ presupuesto.mes.nombre }}
          </div>
        </div>
        <div
          :class="
            tab == 'nuevo' ? 'tab-presupuesto-activo ' : 'tab-presupuesto'
          "
          clickable
          @click="tab = 'nuevo'"
        >
          Nuevo
        </div>
      </div>

      <transition
        leave-active-class="animated slideOutLeft faster"
        enter-active-class="animated slideInRight    "
      >
        <PanelPresupuestos
          key="panelActual"
          v-if="tab == 'actual' && presupuestoActual.activo"
          :pMes="presupuestoActual.mes"
          :pAño="presupuestoActual.año"
          :fecha="presupuestoActual.fecha.toDate()"
          :totalIngresos="presupuestoActual.totalIngresos"
          :totalGastos="presupuestoActual.totalGastos"
          :ingresos="presupuestoActual.ingresos"
          :asignaciones="presupuestoActual.asignaciones"
          :pEditar="presupuestoActual.editar"
          @presupuestoEliminado="reiniciarTab()"
        />
      </transition>
      <div v-for="presupuesto in presupuestos" :key="presupuesto.index">
        <transition
          leave-active-class="animated slideOutLeft faster"
          enter-active-class="animated slideInRight    "
        >
          <PanelPresupuestos
            v-if="tab == presupuesto.mes.nombre"
            :pMes="presupuesto.mes"
            :pAño="presupuesto.año"
            :fecha="presupuesto.fecha.toDate()"
            :totalIngresos="presupuesto.totalIngresos"
            :totalGastos="presupuesto.totalGastos"
            :ingresos="presupuesto.ingresos"
            :asignaciones="presupuesto.asignaciones"
            :pEditar="presupuesto.editar"
            @presupuestoEliminado="reiniciarTab()"
          />
        </transition>
      </div>
    </div>
    <q-inner-loading
      :showing="!visible"
      label="Actualizando..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import PanelPresupuestos from "./PanelPresupuestos.vue";
import { usePresupuestosStore } from "src/stores/PresupuestosStore";
import { useConfigStore } from "src/stores/ConfigStore";

const presupuestoStore = usePresupuestosStore();
const configStore = useConfigStore();

presupuestoStore.actualizarListaPresupuestos();
presupuestoStore.actualizarPresupuestoActual();

const visible = computed(() => {
  let isVisible = false;
  if (!presupuestoStore.listaActualizada || !presupuestoStore.listaActualizada)
    isVisible = false;
  else {
    isVisible = true;
  }
  return isVisible;
});

const tab = ref("actual");

const fechaActual = new Date();
const mesActual = configStore.meses[fechaActual.getMonth()];

const presupuestoActual = computed(() => {
  return presupuestoStore.presupuestoActual;
});

const presupuestos = computed(() => {
  return presupuestoStore.presupuestos;
});

watch(presupuestos, () => {
  tab.value = "actual";
});
</script>
