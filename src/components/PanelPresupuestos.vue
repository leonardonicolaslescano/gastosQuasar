<template>
  <div class="column items-center q-mt-sm" style="width: 100%">
    <q-card style="width: 100%; position: relative">
      <q-icon
        class="absolute-top-right q-mt-sm q-mr-sm float-right"
        name="more_vert"
        size="sm"
        color="grey-5"
        style="z-index: 1000"
      >
        <q-menu
          ><q-list
            ><q-item clickable v-close-popup>Editar</q-item
            ><q-item clickable v-close-popup>Duplicar</q-item
            ><q-item clickable
              >Eliminar<q-popup-proxy class="form-dialog"
                ><q-card
                  ><q-card-section class="card-title"
                    >¿Confirma eliminar presupuesto?</q-card-section
                  ><q-card-actions class="row no-wrap justify-evenly"
                    ><q-btn
                      size="sm"
                      color="primary"
                      @click="eliminarPresupuesto()"
                      >Confirmar</q-btn
                    ><q-btn size="sm" color="primary" v-close-popup
                      >Cancelar</q-btn
                    ></q-card-actions
                  ></q-card
                >></q-popup-proxy
              ></q-item
            ></q-list
          ></q-menu
        >
      </q-icon>
      <q-card-section class="q-pa-sm q-py-md">
        <div class="row q-mb-sm no-wrap items-center">
          <div key="izquierda" style="width: 50%">
            <div class="column q-gutter-sm">
              <q-chip size="lg" :ripple="false" color="grey-3">
                <div class="column">
                  <div style="font-size: 9px">Fecha de inicio</div>
                  <div class="row no-wrap" style="font-size: 11px">
                    <div class="q-mr-sm">{{ mes }}</div>
                    <div>{{ año }}</div>
                  </div>
                </div>
              </q-chip>
              <q-chip size="lg" :ripple="false" color="grey-3">
                <div class="column">
                  <div class="q-mt-xs" style="font-size: 9px">Restante</div>
                  <div class="q-mb-xs" style="font-size: 13px">
                    ${{ restante.toFixed(2) }}
                  </div>
                </div>
              </q-chip>
              <q-chip
                size="lg"
                class="q-pa-none"
                :style="
                  visibleListaIngresos
                    ? 'position: relative; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3)'
                    : 'position: relative; border: 1px solid #ccc;'
                "
                :color="visibleListaIngresos ? 'green' : 'black'"
                outline
                :clickable="false"
                :ripple="false"
              >
                <div class="row no-wrap items-center" style="width: 100%">
                  <div
                    style="width: 100%"
                    class="column q-px-md"
                    @click="visibleListaIngresos = !visibleListaIngresos"
                  >
                    <div class="q-mt-xs" style="font-size: 9px">Ingresos</div>
                    <div class="q-mb-xs" style="font-size: 13px">
                      ${{ totalIngresos.toFixed(2) }}
                    </div>
                  </div>
                  <div class="q-ml-sm" style="position: absolute; right: -4px">
                    <q-btn color="orange" round size="13px" @click.stop=""
                      >+
                      <q-popup-proxy class="form-dialog"
                        ><q-card class="form-dialog" style="border-radius: 16px"
                          ><div class="column items-strech">
                            <q-card-section class="header-form-dialog"
                              >Nuevo ingreso</q-card-section
                            >
                            <q-separator />
                            <q-card-section class="q-card-section-form-dialog"
                              ><q-input
                                class="field-form-dialog"
                                v-model="importe"
                                prefix="$"
                                mask="#.##"
                                fill-mask="0"
                                reverse-fill-mask
                                label="Importe"
                            /></q-card-section>
                            <q-card-section class="q-card-section-form-dialog"
                              ><q-input
                                class="field-form-dialog"
                                v-model="descripcion"
                                label="Descripción"
                              ></q-input
                            ></q-card-section>
                            <q-card-section class="q-card-section-form-dialog"
                              ><q-select
                                class="field-form-dialog"
                                v-model="tipo"
                                :options="tipos"
                                label="Tipo"
                                style=""
                              ></q-select
                            ></q-card-section>
                          </div>
                          <q-card-section
                            ><div class="row justify-center q-gutter-sm">
                              <q-btn
                                class="btn-form-dialog"
                                v-close-popup
                                label="Cancelar"
                              />
                              <q-btn
                                class="btn-form-dialog"
                                label="Guardar"
                              /></div></q-card-section></q-card></q-popup-proxy
                    ></q-btn>
                  </div>
                </div>
              </q-chip>
            </div>
          </div>
          <div key="derecha" style="width: 50%">
            <div class="column items-center">
              <div class="text-subtitle2">Consumido</div>
              <div>
                <q-circular-progress
                  :value="porcentajeGastado"
                  size="120px"
                  :thickness="0.22"
                  color="orange"
                  track-color="grey-3"
                  class="q-ma-sm"
                  show-value
                  font-size="12px"
                >
                  ${{ totalGastos.toFixed(2) }}
                </q-circular-progress>
              </div>
            </div>
          </div>
        </div>
        <q-slide-transition :duration="200">
          <div key="listaIngresos" v-show="visibleListaIngresos">
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
                  <q-item-section style="min-width: 30%; max-width: 30%"
                    >Importe</q-item-section
                  >
                  <q-item-section style="min-width: 10%; max-width: 40%"
                    >Descripción</q-item-section
                  >
                  <q-item-section
                    class="q-pl-sm"
                    style="min-width: 10%; max-width: 15%"
                    >Tipo</q-item-section
                  >
                  <q-item-section
                    class="q-ml-sm"
                    side
                    style="width: 40px"
                  ></q-item-section>
                </q-item>
                <q-item
                  v-for="ingreso in ingresos"
                  :key="ingreso.index"
                  style="font-size: 12px; min-height: 25px; max-height: 25px"
                >
                  <q-item-section style="min-width: 30%; max-width: 30%"
                    >${{ ingreso.importe }}</q-item-section
                  >
                  <q-item-section
                    style="
                      min-width: 10%;
                      max-width: 40%;
                      white-space: nowrap;
                      overflow: hidden;
                    "
                    >{{ ingreso.descripcion }}</q-item-section
                  >
                  <q-item-section
                    class="q-pl-sm"
                    style="min-width: 10%; max-width: 15%"
                    >{{ ingreso.tipo }}</q-item-section
                  >
                  <q-item-section
                    class="q-ml-sm"
                    side
                    style="width: 40px; padding: 0"
                    ><div class="row no-wrap justify-center">
                      <q-btn size="xs" flat dense round icon="mode_edit" />
                      <q-btn size="xs" flat dense round icon="delete" /></div
                  ></q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </q-slide-transition>
      </q-card-section>
    </q-card>
    <q-card
      id="headAsignaciones"
      class="vertical-top q-pa-none q-ma-none q-mt-sm"
      style="width: 100%; position: sticky; top: 120px; z-index: 1000"
    >
      <q-card-section class="q-px-xs q-py-none">
        <div class="row no-wrap">
          <div style="width: 50%">
            <div class="column justify-center">
              <q-chip
                size="lg"
                class="q-pa-sm q-my-md"
                style="position: relative; border: 1px solid #ccc"
                outline
                :clickable="false"
                :ripple="false"
              >
                <div
                  class="row q-ma-none q-pa-none no-wrap items-center"
                  style="width: 100%"
                >
                  <div class="column q-mx-xs">
                    <div class="q-mb-xs" style="font-size: 16px">
                      Asignaciones
                    </div>
                  </div>
                  <div class="q-ml-sm" style="position: absolute; right: -4px">
                    <q-btn color="orange" round size="13px" @click.stop=""
                      >+
                    </q-btn>
                  </div>
                </div>
              </q-chip>
            </div>
          </div>
          <div
            class="row justify-evenly items-center no-wrap q-ma-none"
            style="width: 50%"
          >
            <div class="div-indicator-sm column q-ml-xs" style="width: 100%">
              <div style="font-size: 9px">Asignado</div>
              <div style="font-size: 10px">${{ totalAsignado }}</div>
            </div>
            <div
              class="div-indicator-sm column q-ma-none q-ml-sm q-mr-xs"
              style="width: 100%"
            >
              <div style="font-size: 9px">Sin asignar</div>
              <div style="font-size: 10px">${{ importeSinAsignar }}</div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <div class="row justify-between items-start" style="width: 100%">
      <CardAsignacionesMobile
        class="card-asignaciones q-pa-none q-ma-none q-mt-sm q-mb-none"
        v-for="asignacion in asignaciones"
        :key="asignacion.index"
        :nombre="asignacion.nombre"
        :importe="Number(asignacion.importe)"
        :totalGastos="Number(asignacion.totalGastos)"
        :categorias="asignacion.categorias"
        :totalIngresos="props.totalIngresos"
        :gastos="asignacion.gastos"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import CardAsignacionesMobile from "../components/CardAsignacionesMobile.vue";
import { usePresupuestosStore } from "src/stores/PresupuestosStore";

const storePresupuestos = usePresupuestosStore();
const visibleListaIngresos = ref(true);
const importe = ref(1000.0);
const descripcion = ref("");
const tipos = ref(["Fijo", "Único"]);
const tipo = ref();
////

const props = defineProps({
  mes: String,
  año: Number,
  fecha: Date,
  totalIngresos: Number,
  totalGastos: Number,
  ingresos: Array,
  asignaciones: Array,
  pEditar: Boolean,
});

const emit = defineEmits(["presupuestoEliminado"]);

const asignaciones = ref(
  props.asignaciones.map((data) => ({
    ...data,
  }))
);

const restante = computed(() => {
  return Number(props.totalIngresos - props.totalGastos);
});

const porcentajeGastado = computed(() => {
  let porcentaje =
    Number(props.totalGastos / props.totalIngresos).toFixed(2) * 100;
  return Number(porcentaje.toFixed(2));
});

const totalAsignado = computed(() => {
  let total = asignaciones.value.reduce(
    (acumulador, asignacion) => acumulador + asignacion.importe,
    0
  );
  return Number(total.toFixed(2));
});
const importeSinAsignar = computed(() => {
  let total = props.totalIngresos - totalAsignado.value;
  return Number(total.toFixed(2));
});

const eliminarPresupuesto = async () => {
  await storePresupuestos.eliminarPresupuesto(props.fecha);
};

// watch(visibleListaIngresos, () => {
//   console.log("en visible lista ingresos: " + visibleListaIngresos.value);
// });

//
</script>
