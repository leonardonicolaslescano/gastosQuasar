<template>
  <div class="column items-center q-pa-xs shadow-2" style="width: 116px">
    <div class="column">
      <div class="text-subtitle2 text-capitalize">
        {{ props.nombre }}
      </div>
    </div>
    <q-separator />
    <div>
      <q-knob
        v-model="porcentajeConsumido"
        readonly
        show-value
        size="80px"
        :thickness="0.22"
        :color="porcentajeConsumido < 100 ? 'primary' : 'negative'"
        class="text-black q-ma-sm"
        track-color="grey-5"
      >
        <div class="column items-center justify-center">
          <div class="text-caption" style="font-size: 9px">Consumido</div>
          <div class="text-subtitle2">{{ porcentajeConsumido }}%</div>
        </div>
      </q-knob>
    </div>
    <div v-if="detalleVisible" class="column items-center q-gutter-sm q-my-xs">
      <q-chip class="q-pa-md">
        <div class="column items-center">
          <div style="font-size: 9px">Consumo</div>
          <div style="font-size: 12px">${{ props.totalGastos }}</div>
        </div>
      </q-chip>
      <q-chip class="q-pa-md">
        <div class="column items-center">
          <div style="font-size: 9px">Asignado</div>
          <div style="font-size: 12px">${{ props.importe }}</div>
        </div>
      </q-chip>
      <q-chip class="q-pa-md">
        <div class="column items-center">
          <div style="font-size: 9px">Porcentaje</div>
          <div style="font-size: 12px">{{ porcentajeAsignado }}%</div>
        </div>
      </q-chip>
    </div>
    <div v-if="categoriasVisible" class="column items-center q-mb-sm">
      <div class="text-caption q-my-sm">Categorias</div>
      <div key="Categorias">
        <div class="row">
          <q-chip
            v-for="cat in props.categorias"
            :key="cat.index"
            size="sm"
            class="text-capitalize"
            >{{ cat.nombre }}
          </q-chip>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  nombre: String,
  importe: Number,
  porcentaje: Number,
  totalGastos: Number,
  totalIngresos: Number,
  categorias: Array,
  categoriasVisible: Boolean,
  detalleVisible: Boolean,
});

const porcentajeConsumido = computed(() => {
  let total = (props.totalGastos / props.importe) * 100;
  return Number(total.toFixed(2));
});

const porcentajeAsignado = computed(() => {
  let total = (props.importe / props.totalIngresos) * 100;
  return Number(total.toFixed(2));
});
</script>
