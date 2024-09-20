<template>
  <q-card>
    <q-card-section class="q-px-sm q-pt-sm q-pb-none">
      <div class="row no-wrap">
        <div
          class="column no-wrap items-center justify-center q-pa-none q-pl-xs"
        >
          <div class="q-pa-none q-ma-none" style="font-size: 14px">Viveres</div>
          <div>
            <q-circular-progress
              :value="value"
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
                  ${{ totalConsumido }}
                </div>
              </div>
            </q-circular-progress>
          </div>
        </div>
        <div class="column no-wrap">
          <div class="row no-wrap">
            <div>
              <q-chip
                class="chip-field-status q-mr-xs"
                size="lg"
                :ripple="false"
                color="grey-3"
                style="width: 95px"
              >
                <div class="column">
                  <div style="font-size: 10px">Restante</div>
                  <div style="font-size: 12px">$8000000,00</div>
                </div>
              </q-chip>
            </div>
            <div>
              <q-chip
                style="width: 95px"
                class="chip-field-status q-ml-none"
                size="lg"
                :ripple="false"
                color="grey-3"
              >
                <div class="column">
                  <div style="font-size: 10px">Asignado</div>
                  <div style="font-size: 12px">$8000000,00</div>
                </div>
              </q-chip>
            </div>
          </div>
          <div class="column no-wrap q-ma-xs">
            <div class="q-ml-sm q-mt-sm" style="font-size: 12px">
              Categorias
            </div>
            <div class="row" style="max-height: 80px; overflow-y: auto">
              <q-chip
                class="q-pa-sm chip-categoria-asignacion"
                size="xs"
                :ripple="false"
                color="grey-3"
                style="font-size: 10px"
              >
                Supermercado
              </q-chip>
              <q-chip
                class="q-pa-sm chip-categoria-asignacion"
                size="xs"
                :ripple="false"
                color="grey-3"
                style="font-size: 10px"
              >
                Despensa
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
                  v-for="gasto in gastos"
                  :key="gasto.index"
                  style="font-size: 12px; min-height: 25px; max-height: 25px"
                >
                  <q-item-section
                    style="min-width: 15%; max-width: 20%; font-size: 10px"
                    >{{ gasto.fecha }}</q-item-section
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
                    class="q-pl-sm"
                    style="min-width: 15%; max-width: 30%; font-size: 10px"
                    >{{ gasto.categoria }}</q-item-section
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

const value = ref(70);
const totalConsumido = ref(1000000.22);
const tablasVisible = ref(false);
const gastos = ref([
  {
    fecha: "01/09/2024",
    importe: 1000000.22,
    categoria: "Supermercado",
    descripcion: "Compras de la 1ra semana",
  },
  {
    fecha: "01/09/2024",
    importe: 1000000,
    categoria: "Supermercado",
    descripcion: "Compras de la 1ra semana",
  },
  {
    fecha: "01/09/2024",
    importe: 100000,
    categoria: "Supermercado",
    descripcion: "Compras de la 1ra semana",
  },
  {
    fecha: "01/09/2024",
    importe: 100000,
    categoria: "Supermercado",
    descripcion: "Compras de la 1ra semana",
  },
  {
    fecha: "01/09/2024",
    importe: 100000,
    categoria: "Supermercado",
    descripcion: "Compras de la 1ra semana",
  },
  {
    fecha: "01/09/2024",
    importe: 100000,
    categoria: "Supermercado",
    descripcion: "Compras de la 1ra semana",
  },
]);
</script>
