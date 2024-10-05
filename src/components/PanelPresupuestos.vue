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
            ><q-item clickable v-close-popup @click="editar = true"
              >Editar</q-item
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
              <q-chip
                clickable
                v-if="editar"
                size="lg"
                :ripple="false"
                outline
                color="grey-6"
                text-color="primary"
              >
                <div class="column">
                  <div style="font-size: 9px; color: black">
                    Fecha de inicio
                  </div>
                  <div
                    class="row no-wrap"
                    style="font-size: 11px; color: black"
                  >
                    <div class="q-mr-sm">{{ mes.nombre }}</div>
                    <div>{{ año }}</div>
                  </div>
                </div>
                <q-menu
                  style="
                    border-radius: 16px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6); /* Sombra */
                  "
                  transition-show
                  ><q-card class="q-pa-none" style="border-radius: 16px"
                    ><div class="row items-strech q-pa-sm">
                      <q-card-section class="q-card-section-form-dialog"
                        ><q-select
                          v-if="año"
                          style="min-width: 70px; font-size: 12px"
                          label="Mes"
                          v-model="mes"
                          :options="meses"
                          :option-label="(item) => item.nombre"
                          :option-value="(item) => item.id"
                        />
                      </q-card-section>
                      <q-card-section class="q-card-section-form-dialog"
                        ><q-select
                          style="width: 65px; font-size: 12px"
                          v-model="año"
                          :options="años"
                          label="Año"
                      /></q-card-section>
                    </div> </q-card
                ></q-menu>
              </q-chip>
              <q-chip v-else size="lg" :ripple="false" color="grey-3">
                <div class="column">
                  <div style="font-size: 9px">Fecha de inicio</div>
                  <div class="row no-wrap" style="font-size: 11px">
                    <div class="q-mr-sm">{{ mes.nombre }}</div>
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
                  <div
                    v-if="editar"
                    class="q-ml-sm"
                    style="position: absolute; right: -4px"
                  >
                    <q-btn color="orange" round size="13px" @click.stop=""
                      >+
                      <q-popup-proxy style="border-radius: 16px"
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
                                @click="resetIngreso()"
                              />
                              <q-btn
                                :disable="
                                  descripcion.trim().toLowerCase().length < 1 ||
                                  importe < 1 ||
                                  tipo.trim().length < 0
                                "
                                v-close-popup
                                class="btn-form-dialog"
                                label="Guardar"
                                @click="agregarIngreso()"
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
                    v-if="editar"
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
                    >${{ ingreso.importe.toFixed(2) }}</q-item-section
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
                    v-if="editar"
                    class="q-ml-sm"
                    side
                    style="width: 40px; padding: 0"
                    ><div class="row no-wrap justify-center">
                      <q-btn size="xs" flat dense round icon="mode_edit" />
                      <q-btn
                        size="xs"
                        flat
                        dense
                        round
                        icon="delete"
                        @click="eliminarIngreso(ingreso.descripcion)"
                      /></div
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
      style="width: 100%; position: sticky; top: 59px; z-index: 1000"
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
                  <div
                    v-if="editar"
                    class="q-ml-sm"
                    style="position: absolute; right: -4px"
                  >
                    <q-btn
                      color="orange"
                      label="+"
                      round
                      size="13px"
                      @click.stop=""
                      ><q-popup-proxy style="border-radius: 16px"
                        ><q-card class="form-dialog" style="border-radius: 16px"
                          ><div class="column items-strech">
                            <q-card-section class="header-form-dialog"
                              >Nueva Asignación</q-card-section
                            >
                            <q-separator />
                            <q-card-section
                              class="q-card-section-form-dialog q-mt-sm"
                              ><q-input
                                class="field-form-dialog text-capitalize"
                                v-model="asignacionNombre"
                                label="Nombre"
                              ></q-input
                            ></q-card-section>
                            <q-card-section class="q-card-section-form-dialog"
                              ><q-input
                                class="field-form-dialog"
                                v-model="asignacionImporte"
                                prefix="$"
                                mask="#.##"
                                fill-mask="0"
                                reverse-fill-mask
                                label="Asignado"
                            /></q-card-section>
                            <q-card-section
                              class="field-form-dialog q-mx-sm q-py-sm"
                            >
                              <div
                                class="row justify-start"
                                style="font-size: 12px"
                              >
                                <div>Disponible</div>
                                <div class="q-ml-md">
                                  ${{ importeSinAsignar.toFixed(2) }}
                                </div>
                              </div>
                              <q-slider
                                class="q-px-sm"
                                v-model="slideNuevaAsignacion"
                                :min="0"
                                :max="100"
                              />
                            </q-card-section>
                            <q-card-section class="q-card-section-form-dialog">
                              <div class="q-ml-sm q-my-sm">Categorias</div>
                              <div class="row">
                                <div class="row">
                                  <q-chip
                                    class="text-capitalize"
                                    v-for="cat in asignacionCategorias"
                                    :key="cat.index"
                                    size="sm"
                                    clickable
                                    @click="eliminarCategoriaSeleccionada(cat)"
                                    >{{ cat.nombre }}
                                  </q-chip>
                                </div>
                                <q-chip size="sm" clickable
                                  ><q-menu fit
                                    ><q-list
                                      ><q-item
                                        class="text-capitalize"
                                        clickable
                                        v-for="item in categorias"
                                        :key="item.index"
                                        :disable="item.disable"
                                        @click="cambiarEstado(item)"
                                      >
                                        <q-item-section>{{
                                          item.nombre
                                        }}</q-item-section>
                                      </q-item></q-list
                                    ></q-menu
                                  >+</q-chip
                                >
                              </div>
                            </q-card-section>
                          </div>
                          <q-card-section
                            ><div class="row justify-center q-gutter-sm">
                              <q-btn
                                class="btn-form-dialog"
                                v-close-popup
                                label="Cancelar"
                                @click="resetNuevaAsignacion()"
                              />
                              <q-btn
                                v-close-popup
                                class="btn-form-dialog"
                                label="Guardar"
                                :disable="asignacionNombre.trim().length < 1"
                                @click="agregarAsignaciones()"
                              /></div></q-card-section></q-card
                      ></q-popup-proxy>
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
              <div style="font-size: 10px">${{ totalAsignado.toFixed(2) }}</div>
            </div>
            <div
              class="div-indicator-sm column q-ma-none q-ml-sm q-mr-xs"
              style="width: 100%"
            >
              <div style="font-size: 9px">Sin asignar</div>
              <div style="font-size: 10px">
                ${{ importeSinAsignar.toFixed(2) }}
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <div
      v-if="editar"
      class="row justify-between items-start"
      style="width: 100%"
    >
      <CardAsignacionesMobile
        class="card-asignaciones q-pa-none q-ma-none q-mt-sm q-mb-none"
        v-for="asignacion in asignaciones"
        :key="asignacion.index"
        :pNombre="asignacion.nombre"
        :pImporteAsignado="Number(asignacion.importe)"
        :pTotalGastos="Number(asignacion.totalGastos)"
        :pCategoriasSeleccionadas="asignacion.categorias"
        :pCategorias="categorias"
        :pTotalIngresos="props.totalIngresos"
        :pGastos="asignacion.gastos"
        :pAsignaciones="asignaciones"
        :pEditar="true"
        :pSinAsignar="importeSinAsignar"
        @eliminarAsignacion="
          (nombreAsignacion) => eliminarAsignacion(nombreAsignacion)
        "
      />
    </div>
    <div v-else class="row justify-between items-start" style="width: 100%">
      <CardAsignacionesMobile
        class="card-asignaciones q-pa-none q-ma-none q-mt-sm q-mb-none"
        v-for="asignacion in asignaciones"
        :key="asignacion.index"
        :pNombre="asignacion.nombre"
        :pImporteAsignado="Number(asignacion.importe)"
        :pTotalGastos="Number(asignacion.totalGastos)"
        :pCategoriasSeleccionadas="asignacion.categorias"
        :pCategorias="categorias"
        :pTotalIngresos="props.totalIngresos"
        :pGastos="asignacion.gastos"
        :pAsignaciones="asignaciones"
        :pEditar="false"
        :pSinAsignar="importeSinAsignar"
      />
    </div>
    <q-page-sticky v-if="editar" position="bottom" :offset="[0, 18]">
      <q-btn
        class="q-mr-sm"
        unelevated
        rounded
        push
        size="md"
        color="primary"
        label="Guardar"
        style="box-shadow: 0px 6px 14px rgba(0, 0, 0, 0.4)"
        @click="agregarNuevoPresupuesto()"
      />
      <q-btn
        class="q-ml-sm"
        unelevated
        rounded
        push
        size="md"
        color="warning"
        label="Cancelar"
        style="box-shadow: 0px 6px 14px rgba(0, 0, 0, 0.4)"
        @click="editar = false"
      />
    </q-page-sticky>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import CardAsignacionesMobile from "../components/CardAsignacionesMobile.vue";
import { usePresupuestosStore } from "src/stores/PresupuestosStore";
import { useConfigStore } from "src/stores/ConfigStore";
import { useAuthStore } from "src/stores/AuthStore";
import { useNotifications } from "src/composables/useNotifications";

const { showError, showSuccess } = useNotifications();

const configStore = useConfigStore();
const storePresupuestos = usePresupuestosStore();
const storeUser = useAuthStore();
const visibleListaIngresos = ref(true);
const importe = ref(0.0);
const descripcion = ref("");
const tipos = ref(["Fijo", "Único"]);
const tipo = ref("Fijo");
////

const props = defineProps({
  pMes: Object,
  pAño: Number,
  fecha: Date,
  totalIngresos: Number,
  totalGastos: Number,
  pIngresos: Array,
  asignaciones: Array,
  pEditar: Boolean,
});

const ingresos = ref(props.pIngresos);

const editar = ref(props.pEditar);

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
  return Number(total);
});
const importeSinAsignar = computed(() => {
  let total = props.totalIngresos - totalAsignado.value;
  return Number(total);
});

const eliminarPresupuesto = async () => {
  await storePresupuestos.eliminarPresupuesto(props.fecha);
};

////REFERIDO A EDITAR PRESUPUESTO

const visibleSliderAsignacion = ref(false);
const asignacionNombre = ref("");
const asignacionImporte = ref(0);
const asignacionCategorias = ref([]);

const categorias = computed(() => {
  const categoriasAux = storeUser.categorias.map((categoria) => ({
    ...categoria,
    disable: existeCategoriaSeleccionada(categoria),
  }));
  return categoriasAux;
});

const existeCategoriaSeleccionada = (pCategoria) => {
  var resultado = false;
  asignaciones.value.find((asignacion) => {
    asignacion.categorias.find((categoria) => {
      if (categoria.id === pCategoria.id) {
        resultado = true;
      }
    });
  });
  return resultado;
};

const fechaActual = new Date();
const años = ref([
  fechaActual.getFullYear(),
  fechaActual.getFullYear() + 1,
  fechaActual.getFullYear() + 2,
]);

const año = ref(props.pAño);
const mes = ref(props.pMes);

const meses = computed(() => {
  var mesesAux = [];
  var añoAux = año.value;
  if (añoAux == fechaActual.getFullYear()) {
    for (var i = fechaActual.getMonth(); i < 12; i++) {
      mesesAux.push(configStore.meses[i]);
    }
  } else {
    mesesAux = configStore.meses;
  }
  return mesesAux;
});
watch(año, () => {
  mes.value = "";
});

const cambiarEstado = (categoria) => {
  if (categoria.disable === true) {
    eliminarCategoriaSeleccionada(categoria);
  } else {
    asignacionCategorias.value.push(categoria);
    categoria.disable = true;
  }
};

const eliminarCategoriaSeleccionada = (categoriaParametro) => {
  const indexAEliminar = asignacionCategorias.value.findIndex(
    (cat) => cat.id === categoriaParametro.id
  );
  asignacionCategorias.value.splice(indexAEliminar, 1);
  categorias.value.find((cat) => {
    if (cat.id === categoriaParametro.id) {
      cat.disable = false;
    }
  });
};

const agregarAsignaciones = () => {
  const nuevaAsignacion = () => {
    asignaciones.value.unshift({
      nombre: asignacionNombre.value.toLowerCase(),
      categorias: asignacionCategorias.value,
      importe: Number(asignacionImporte.value),
      totalGastos: Number(0).toFixed(2),
    });
    resetNuevaAsignacion();
    slideNuevaAsignacion.value = 0;
    console.table(asignaciones.value);
  };
  if (asignaciones.value.length < 1) {
    nuevaAsignacion();
  } else {
    let sinNombre = asignaciones.value.find((asignacion) => {
      if (asignacion.nombre === asignacionNombre.value.toLowerCase()) {
        return true;
      }
    });
    if (sinNombre) {
      showError(
        "Error:",
        "Ya existe una asignación con el mismo nombre",
        "Al crear nueva asignación"
      );
    } else {
      nuevaAsignacion();
    }
  }
};

const resetNuevaAsignacion = () => {
  asignacionNombre.value = "";
  asignacionImporte.value = 0;
  asignacionCategorias.value = [];
};

const slideNuevaAsignacion = ref(0);

watch(slideNuevaAsignacion, () => {
  let auxTotal = 0;
  auxTotal = Number(importeSinAsignar.value * slideNuevaAsignacion.value) / 100;
  asignacionImporte.value = auxTotal.toFixed(2);
});

const eliminarAsignacion = (nombre) => {
  let index = null;
  let auxAsignacion = [];
  asignaciones.value.find((asignacion) => {
    if (asignacion.nombre === nombre) {
      index = asignaciones.value.indexOf(asignacion);
      auxAsignacion = asignacion;
    }
  });
  auxAsignacion.categorias.forEach((categoria) => {
    categorias.value.forEach((cat) => {
      if (cat.id === categoria.id) {
        cat.disable = false;
      }
    });
  });
  asignaciones.value.splice(index, 1);
};

const agregarNuevoPresupuesto = () => {
  let sinNombre = asignaciones.value.find((asignacion) => {
    if (asignacion.nombre === "") {
      return true;
    }
  });
  if (sinNombre) {
    showError(
      "Error:",
      "No se puede guardar con asignaciones sin nombre",
      "Al guardar un presupuesto"
    );
  } else {
    var pFecha = new Date(año.value, mes.value.id, 1);
    storePresupuestos.agregarPresupuesto(
      pFecha,
      ingresos.value,
      asignaciones.value
    );
  }
};
const agregarIngreso = () => {
  let auxYaExiste = false;
  ingresos.value.forEach((ingreso) => {
    if (
      ingreso.descripcion.trim().toLowerCase() ==
      descripcion.value.trim().toLowerCase()
    ) {
      auxYaExiste = true;
    }
  });
  if (auxYaExiste) {
    showError(
      "Error:",
      "Ya existe un ingreso con la misma descripción",
      "Al agregar nuevo ingreso"
    );
  } else {
    let auxIngreso = {
      importe: Number(importe.value),
      descripcion: descripcion.value,
      tipo: tipo.value,
    };
    ingresos.value.push(auxIngreso);
    resetIngreso();
  }
};

const resetIngreso = () => {
  importe.value = 0;
  descripcion.value = "";
  tipo.value = "Fijo";
};

const eliminarIngreso = (pDescripcion) => {
  let index = null;
  ingresos.value.find((ingreso) => {
    if (ingreso.descripcion === pDescripcion) {
      index = ingresos.value.indexOf(ingreso);
    }
  });
  ingresos.value.splice(index, 1);
};
</script>
