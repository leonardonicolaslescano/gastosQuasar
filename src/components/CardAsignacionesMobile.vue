<template>
  <q-card>
    <q-card-section class="q-px-sm q-pt-sm q-pb-none">
      <div class="row no-wrap content-stretch">
        <div class="column no-wrap items-center q-pa-none q-pl-xs">
          <div
            class="q-pa-none q-ma-none text-capitalize"
            style="font-size: 14px"
          >
            {{ props.nombre }}
          </div>
          <div>
            <q-circular-progress
              :value="porcentajeConsumido"
              size="100px"
              :thickness="0.15"
              color="orange"
              track-color="grey-3"
              class="q-ma-xs q-pa-none"
              show-value
            >
              <div class="column no-wrap items-center">
                <div class="q-mb-sm" style="font-size: 10px">Consumido</div>
                <div class="q-mb-sm" style="font-size: 12px">
                  ${{ props.totalGastos.toFixed(2) }}
                </div>
              </div>
            </q-circular-progress>
          </div>
        </div>
        <div class="column no-wrap" style="width: 100%; max-width: 430px">
          <div class="row no-wrap justify-between">
            <q-chip
              class="chip-field-status q-mr-xs"
              size="lg"
              :ripple="false"
              color="grey-3"
            >
              <div class="column">
                <div style="font-size: 10px">Restante</div>
                <div style="font-size: 12px">${{ restante.toFixed(2) }}</div>
              </div>
            </q-chip>
            <q-chip
              class="chip-field-status q-ml-none"
              size="lg"
              :ripple="false"
              color="grey-3"
            >
              <div class="column">
                <div style="font-size: 10px">Asignado</div>
                <div style="font-size: 12px">
                  ${{ props.importe.toFixed(2) }}
                </div>
              </div>
            </q-chip>
          </div>
          <div class="column no-wrap q-ma-xs">
            <div class="q-ml-sm q-mt-sm" style="font-size: 12px">
              Categorias
            </div>
            <div class="row" style="max-height: 80px; overflow-y: auto">
              <q-chip
                v-for="categoria in categorias"
                :key="categoria.index"
                class="q-pa-sm chip-categoria-asignacion text-capitalize"
                size="xs"
                :ripple="false"
                color="grey-3"
                style="font-size: 10px"
              >
                {{ categoria.nombre }}
              </q-chip>
            </div>
          </div>
        </div>
      </div>
    </q-card-section>
    <q-card-section class="listaGastosXAsignacion q-pa-none q-ma-none q-mt-xs">
      <div class="column no-wrap">
        <q-slide-transition :duration="200">
          <div key="gastosXAsignacion" v-show="tablasVisible">
            <div
              style="
                max-height: 105px;
                overflow-y: auto;
                border: none;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
              "
            >
              <q-list dense class="q-pb-sm">
                <q-item
                  style="font-size: 9px; min-height: 25px; max-height: 25px"
                >
                  <q-item-section style="min-width: 15%; max-width: 20%"
                    >Fecha</q-item-section
                  >
                  <q-item-section style="min-width: 10%; max-width: 20%"
                    >Importe</q-item-section
                  >
                  <q-item-section
                    class="q-pl-sm"
                    style="min-width: 10%; max-width: 30%"
                    >Categoria</q-item-section
                  >

                  <q-item-section
                    class="q-ml-sm"
                    side
                    style="width: 40px"
                  ></q-item-section>
                </q-item>
                <q-item
                  v-for="gasto in props.gastos"
                  :key="gasto.index"
                  style="font-size: 12px; min-height: 25px; max-height: 25px"
                >
                  <q-item-section
                    style="min-width: 15%; max-width: 20%; font-size: 10px"
                    >{{
                      date.formatDate(gasto.fecha.toDate(), "DD/MM/YYYY")
                    }}</q-item-section
                  >
                  <q-item-section
                    style="
                      min-width: 10%;
                      max-width: 20%;
                      white-space: nowrap;
                      overflow: hidden;
                      font-size: 10px;
                    "
                    >${{ gasto.importe }}</q-item-section
                  >
                  <q-item-section
                    class="q-pl-sm text-capitalize"
                    style="min-width: 15%; max-width: 30%; font-size: 10px"
                    >{{ gasto.categoriaNombre }}</q-item-section
                  >

                  <q-item-section
                    class="q-ml-sm"
                    side
                    style="width: 40px; padding: 0"
                    ><div class="row no-wrap justify-center">
                      <q-btn size="xs" flat dense round icon="info" />
                      <q-btn size="xs" flat dense round icon="mode_edit" />
                      <q-btn size="xs" flat dense round icon="delete" /></div
                  ></q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </q-slide-transition>
        <div>
          <q-card-actions
            class="q-pa-none q-ma-none q-py-xs"
            id="btn_Expandir"
            align="center"
          >
            <q-btn
              flat
              size="xs"
              dense
              :icon="tablasVisible ? 'expand_less' : 'expand_more'"
              @click="tablasVisible = !tablasVisible"
              no-caps
              style="font-size: 10px"
              >Gastos</q-btn
            >
          </q-card-actions>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, computed } from "vue";
import { date } from "quasar";

const value = ref(70);
const totalConsumido = ref(1000000.22);
const tablasVisible = ref(false);

const props = defineProps({
  nombre: String,
  importe: Number,
  porcentaje: Number,
  totalGastos: Number,
  totalIngresos: Number,
  categorias: Array,
  gastos: Array,
});

const porcentajeConsumido = computed(() => {
  let total = (props.totalGastos / props.importe) * 100;
  return Number(total.toFixed(2));
});

const porcentajeAsignado = computed(() => {
  let total = (props.importe / props.totalIngresos) * 100;
  return Number(total.toFixed(2));
});

const restante = computed(() => {
  let total = props.importe - props.totalGastos;
  return total;
});
</script>
