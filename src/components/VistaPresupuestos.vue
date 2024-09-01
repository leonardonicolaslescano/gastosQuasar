<template>
  <div
    class="column q-pa-md q-gutter-sm"
    :style="$q.screen.lt.sm ? 'width: 420px' : 'width: 800px'"
  >
    <div key="titulo" class="text-h5 q-my-md">Presupuestos</div>
    <div :style="$q.screen.lt.sm ? 'max-width: 380px' : 'width: 800px'">
      <q-tabs
        class="text-grey-5 shadow-1"
        v-model="tab"
        dense
        active-color="black"
        active-bg-color="secondary"
        indicator-color="transparent"
        align="left"
        :breakpoint="0"
        shrink
        stretch
      >
        <q-tab v-if="presupuestoActual.activo" name="actual" label="Actual" />
        <q-tab
          v-for="presupuesto in presupuestos"
          :key="presupuesto.index"
          :name="presupuesto.mes.nombre"
          :label="presupuesto.mes.nombre" />
        <q-tab name="nuevo" label="Nuevo"
      /></q-tabs>
      <q-tab-panels
        class="bg-secondary shadow-1 q-ma-none q-pa-none"
        v-model="tab"
        animated
      >
        <q-tab-panel
          v-if="presupuestoActual.activo"
          name="actual"
          label="Actual"
          class="q-ma-none q-pa-none"
        >
          <PresupuestoItem
            v-if="!presupuestoActual.editar"
            :mes="presupuestoActual.mes.nombre"
            :año="presupuestoActual.año"
            :totalIngresos="presupuestoActual.totalIngresos"
            :totalGastos="presupuestoActual.totalGastos"
            :ingresos="presupuestoActual.ingresos"
            :asignaciones="presupuestoActual.asignaciones"
            @editar="() => (presupuestoActual.editar = true)"
          />
          <PresupuestoEdit
            v-else
            :pMes="mesActual"
            :pAño="presupuestoActual.año"
            :pIngresos="presupuestoActual.ingresos"
            :pAsignaciones="presupuestoActual.asignaciones"
            @cancelar="() => cancelarEdit()"
          />
        </q-tab-panel>
        <q-tab-panel
          v-for="presupuesto in presupuestos"
          :key="presupuesto.index"
          :name="presupuesto.mes.nombre"
          :label="presupuesto.mes.nombre"
          ><PresupuestoItem
            v-if="!presupuesto.editar"
            :mes="presupuesto.mes.nombre"
            :año="presupuesto.año"
            :totalIngresos="presupuesto.totalIngresos"
            :totalGastos="presupuesto.totalGastos"
            :ingresos="presupuesto.ingresos"
            :asignaciones="presupuesto.asignaciones"
            @editar="() => (presupuesto.editar = true)"
          />
          <PresupuestoEdit
            v-else
            :pMes="presupuesto.mes"
            :pAño="presupuesto.año"
            :pIngresos="presupuesto.ingresos"
            :pAsignaciones="presupuesto.asignaciones"
            @cancelar="() => cancelarEdit()"
          />
        </q-tab-panel>
        <q-tab-panel name="nuevo"
          ><PresupuestoEdit
            :pIngresos="[]"
            :pAsignaciones="[]"
            :pAño="fechaActual.getFullYear()"
            @cancelar="() => (tab = 'actual')"
        /></q-tab-panel>
      </q-tab-panels>
      <q-inner-loading
        :showing="!visible"
        label="Actualizando..."
        label-class="text-teal"
        label-style="font-size: 1.1em"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import PresupuestoEdit from "../components/PresupuestoEdit.vue";
import PresupuestoItem from "./PresupuestoItem.vue";
import { usePresupuestosStore } from "src/stores/PresupuestosStore";
import { useConfigStore } from "src/stores/ConfigStore";

const presupuestoStore = usePresupuestosStore();
const configStore = useConfigStore();
const visible = computed(() => {
  return presupuestoStore.listaActualizada;
});

const fechaActual = new Date();
const mesActual = configStore.meses[fechaActual.getMonth()];

const tab = ref("actual");

presupuestoStore.actualizarListaPresupuestos();
presupuestoStore.actualizarPresupuestoActual();

const presupuestoActual = computed(() => {
  return presupuestoStore.presupuestoActual;
});

const presupuestos = computed(() => {
  return presupuestoStore.presupuestos;
});

const cancelarEdit = () => {
  presupuestoStore.actualizarListaPresupuestos();
  presupuestoStore.actualizarPresupuestoActual();
};
</script>
