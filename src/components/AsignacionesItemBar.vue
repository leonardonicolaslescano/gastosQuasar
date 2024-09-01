<template>
  <div class="column items-center">
    <div class="text-caption text-capitalize" style="font-size: 8px">
      {{ props.nombre }}
    </div>
    <q-knob
      v-model="porcentajeConsumido"
      readonly
      show-value
      size="30px"
      :thickness="1"
      :color="porcentajeConsumido < 100 ? 'primary' : 'negative'"
      class="text-white q-mb-sm"
      track-color="grey-5"
    >
    </q-knob>
  </div>
</template>
<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  nombre: String,
  importe: Number,
  totalGastos: Number,
});
const porcentajeConsumido = computed(() => {
  let total = (props.totalGastos / props.importe) * 100;
  return Number(total.toFixed(2));
});
</script>
