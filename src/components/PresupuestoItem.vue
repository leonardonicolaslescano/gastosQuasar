<template>
  <div class="column q-ma-sm">
    <q-btn
      class="absolute-top-right q-pa-xs q-ma-sm float-right"
      icon="edit"
      size="sm"
      color="primary"
      round
      style="z-index: 1000"
      @click="editarPresupuesto()"
    />
    <div class="row q-gutter-xs q-py-sm text-caption">
      <div>Fecha de inicio:</div>
      <div>{{ props.mes }}</div>
      <div>{{ props.año }}</div>
    </div>
    <div class="column q-py-sm">
      <div class="row q-gutter-md">
        <div>Gastado:</div>
        <div>${{ props.totalGastos.toFixed(2) }}</div>
      </div>
      <div class="q-py-sm">
        <q-linear-progress
          rounded
          :color="porcentajeLabel < 100 ? 'info' : 'negative'"
          stripe
          size="20px"
          :value="porcentajeGastado"
          ><div
            class="absolute-full flex flex-center text-caption"
            style="color: black"
          >
            {{ porcentajeLabel }}%
          </div>
        </q-linear-progress>
      </div>
      <div>
        <q-expansion-item
          dense
          :label="'Ingresos: $' + props.totalIngresos"
          header-class="q-pa-none"
        >
          <q-list>
            <q-item v-for="ingreso in props.ingresos" :key="ingreso.index">
              <q-item-section>
                <q-item-label> {{ ingreso.descripcion }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label> ${{ ingreso.importe }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label> {{ ingreso.tipo }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>
      </div>
    </div>
    <q-separator />
    <div class="column items-center q-mb-md">
      <div class="q-pt-md">Asignaciones</div>
      <div class="q-my-sm text-caption">
        <q-toggle
          v-model="detalleVisible"
          size="xs"
          checked-icon="check"
          color="blue"
          label="Detalle"
          unchecked-icon="clear"
        />
        <q-toggle
          v-if="detalleVisible"
          v-model="categoriasVisible"
          :disable="!detalleVisible"
          size="xs"
          checked-icon="check"
          color="blue"
          label="Categorias"
          unchecked-icon="clear"
        />
      </div>
      <div class="row q-gutter-xs justify-center">
        <AsignacionesItem
          v-for="asignacion in props.asignaciones"
          :key="asignacion.index"
          :nombre="asignacion.nombre"
          :importe="Number(asignacion.importe)"
          :totalGastos="Number(asignacion.totalGastos)"
          :categorias="asignacion.categorias"
          :totalIngresos="props.totalIngresos"
          :categoriasVisible="categoriasVisible"
          :detalleVisible="detalleVisible"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { useConfigStore } from "src/stores/ConfigStore";
import { useAuthStore } from "src/stores/AuthStore";
import { ref, computed, watch } from "vue";
import AsignacionesItem from "../components/AsignacionesItem.vue";

const store = useAuthStore();
const configStore = useConfigStore();
const categoriasVisible = ref(false);
const detalleVisible = ref(false);

const props = defineProps({
  mes: String,
  año: Number,
  totalIngresos: Number,
  totalGastos: Number,
  ingresos: Array,
  asignaciones: Array,
});

const emit = defineEmits(["editar"]);

const editarPresupuesto = () => {
  emit("editar");
};

const porcentajeGastado = computed(() => {
  var total = 0;
  total = props.totalIngresos - props.totalGastos;
  let porcentaje = 1 - Number(total / props.totalIngresos).toFixed(2);
  return Number(porcentaje.toFixed(2));
});

const porcentajeLabel = computed(() => {
  return Number(porcentajeGastado.value * 100);
});

watch(detalleVisible, () => {
  if (!detalleVisible.value) {
    categoriasVisible.value = false;
  }
});
</script>
