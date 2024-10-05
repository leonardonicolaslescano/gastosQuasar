<template>
  <q-card>
    <q-card-section class="q-px-sm q-pt-sm q-pb-none">
      <q-btn
        v-if="editar"
        class="absolute-top-right q-pa-none q-ma-none float-right"
        icon="cancel"
        size="xs"
        flat
        style="z-index: 100; color: #828080; border-radius: 20px"
        ><q-popup-proxy style="border-radius: 16px"
          ><q-card style="border-radius: 16px"
            ><q-card-section class="row no-wrap q-mb-none q-pb-sm"
              >¿Confirma eliminar asignación
              <div class="q-pl-xs text-capitalize">{{ nombreActual }}</div>
              ?</q-card-section
            ><q-card-actions class="row no-wrap justify-center q-mb-sm"
              ><q-btn
                class="btn-form-dialog q-mr-lg"
                v-close-popup
                size="sm"
                label="Cancelar" />
              <q-btn
                v-close-popup
                size="sm"
                class="btn-form-dialog"
                label="Confirmar"
                @click="eliminar()" /></q-card-actions></q-card></q-popup-proxy
      ></q-btn>
      <div class="row no-wrap content-stretch">
        <div class="column no-wrap items-center q-pa-none q-pl-xs">
          <div
            v-if="editar"
            class="row no-wrap justify-end q-pa-none q-ma-none text-capitalize field-less-shadow"
            style="font-size: 14px"
          >
            {{ nombreActual }}
            <q-btn class="q-ml-xs" size="xs" flat dense round icon="mode_edit">
              <q-popup-proxy style="border-radius: 16px"
                ><q-card class="form-dialog" style="border-radius: 16px"
                  ><div class="column items-strech">
                    <q-card-section class="header-form-dialog"
                      >Modificar nombre</q-card-section
                    >
                    <q-separator />
                    <q-card-section class="q-card-section-form-dialog"
                      ><q-input
                        class="field-form-dialog text-capitalize"
                        v-model="nuevoNombre"
                    /></q-card-section>
                  </div>
                  <q-card-section
                    ><div class="row justify-center q-gutter-sm">
                      <q-btn
                        class="btn-form-dialog"
                        v-close-popup
                        label="Cancelar"
                        @click="nuevoNombre = nombreActual"
                      />
                      <q-btn
                        v-close-popup
                        class="btn-form-dialog"
                        label="Guardar"
                        @click="modificarNombre(nuevoNombre)"
                      /></div></q-card-section></q-card></q-popup-proxy
            ></q-btn>
          </div>
          <div
            v-else
            class="justify-center q-pa-none q-ma-none text-capitalize"
            style="font-size: 14px"
          >
            {{ nombreActual }}
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
                  ${{ totalGastos.toFixed(2) }}
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
              v-if="editar"
              class="chip-field-status q-ml-none"
              size="lg"
              :ripple="false"
              outline
              color="grey-6"
              clickable
            >
              <div class="column">
                <div style="font-size: 10px; color: black">Asignado</div>
                <div style="font-size: 12px; color: black">
                  ${{ importeAsignado.toFixed(2) }}
                </div>
              </div>
              <q-popup-proxy style="border-radius: 16px"
                ><q-card class="form-dialog" style="border-radius: 16px"
                  ><div class="column items-strech">
                    <q-card-section class="header-form-dialog"
                      >Modificar monto asignado</q-card-section
                    >
                    <q-separator />
                    <q-card-section class="q-card-section-form-dialog"
                      ><div class="row no-wrap">
                        <q-input
                          class="field-form-dialog"
                          v-model="nuevoImporte"
                          prefix="$"
                          mask="#.##"
                          fill-mask="0"
                          reverse-fill-mask
                          label="Asignado"
                        />
                        <q-btn
                          class="q-ml-sm q-pa-none q-px-sm btn-form-dialog"
                          color="primary"
                          icon="calculate"
                          style="font-size: 18px"
                          ><q-menu
                            style="background-color: rgba(133, 132, 132, 0.7)"
                            class="form-dialog-popup"
                            ><q-card
                              class="form-dialog-popup"
                              style="background-color: rgba(133, 132, 132, 0.7)"
                              ><q-card-section
                                ><q-input
                                  autofocus
                                  class="field-form-dialog"
                                  style="background-color: white"
                                  v-model="importeCalculo"
                                  prefix="$"
                                  mask="#.##"
                                  fill-mask="0"
                                  reverse-fill-mask
                                  label="Importe" /></q-card-section
                              ><q-card-section class="q-mt-none q-pt-none"
                                ><div class="row no-wrap justify-between">
                                  <q-btn
                                    class="btn-form-dialog"
                                    size="sm"
                                    label="Restar"
                                    @click="restarImporte()"
                                  />
                                  <q-btn
                                    class="btn-form-dialog"
                                    size="sm"
                                    label="Sumar"
                                    @click="sumarImporte()"
                                  /></div></q-card-section></q-card></q-menu
                        ></q-btn></div
                    ></q-card-section>
                    <q-card-section class="field-form-dialog q-mx-sm q-py-sm">
                      <div class="row justify-start" style="font-size: 12px">
                        <div>Disponible</div>
                        <div class="q-ml-md">
                          ${{ disponibleDialog.toFixed(2) }}
                        </div>
                      </div>
                      <q-slider
                        class="q-px-sm"
                        v-model="slideAsignado"
                        :min="0"
                        :max="100"
                      />
                    </q-card-section>
                  </div>
                  <q-card-section
                    ><div class="row justify-center q-gutter-sm">
                      <q-btn
                        class="btn-form-dialog"
                        v-close-popup
                        label="Cancelar"
                        @click="resetNuevoImporte()"
                      />
                      <q-btn
                        v-close-popup
                        class="btn-form-dialog"
                        label="Guardar"
                        @click="confirmarNuevoImporte()"
                      /></div></q-card-section></q-card
              ></q-popup-proxy>
            </q-chip>
            <q-chip
              v-else
              class="chip-field-status q-ml-none"
              size="lg"
              :ripple="false"
              color="grey-3"
            >
              <div class="column">
                <div style="font-size: 10px">Asignado</div>
                <div style="font-size: 12px">
                  ${{ importeAsignado.toFixed(2) }}
                </div>
              </div>
            </q-chip>
          </div>
          <div class="column no-wrap q-ma-xs">
            <div class="q-ml-sm q-mt-sm" style="font-size: 12px">
              Categorias
            </div>
            <div
              v-if="editar"
              class="row"
              style="max-height: 80px; overflow-y: auto"
            >
              <q-chip
                v-for="categoria in categoriasSeleccionadas"
                :key="categoria.index"
                class="q-pa-sm chip-categoria-asignacion text-capitalize"
                size="xs"
                :ripple="false"
                outline
                clickable
                style="font-size: 10px"
                removable
                @remove="cambiarEstado(categoria)"
              >
                {{ categoria.nombre }}
              </q-chip>
              <q-chip
                class="chip-categoria-asignacion"
                size="xs"
                :ripple="false"
                outline
                clickable
                style="font-size: 10px"
                ><q-menu fit auto-close
                  ><q-list
                    ><q-item
                      class="text-capitalize"
                      clickable
                      v-for="item in props.pCategorias"
                      :key="item.index"
                      @click="cambiarEstado(item)"
                      :disable="item.disable"
                    >
                      <q-item-section>{{ item.nombre }}</q-item-section>
                    </q-item></q-list
                  ></q-menu
                >+</q-chip
              >
            </div>
            <div v-else class="row" style="max-height: 80px; overflow-y: auto">
              <q-chip
                v-for="categoria in categoriasSeleccionadas"
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
                  v-for="gasto in gastos"
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
import { ref, computed, watch } from "vue";
import { date } from "quasar";
import { useNotifications } from "src/composables/useNotifications";

const { showError, showSuccess } = useNotifications();

const tablasVisible = ref(false);

const props = defineProps({
  pNombre: String,
  pImporteAsignado: Number,
  pPorcentaje: Number,
  pTotalGastos: Number,
  pTotalIngresos: Number,
  pCategorias: Array,
  pGastos: Array,
  pAsignaciones: Array,
  pEditar: Boolean,
  pCategoriasSeleccionadas: Array,
  pSinAsignar: Number,
});

const emit = defineEmits(["eliminarAsignacion"]);
const eliminar = () => {
  emit("eliminarAsignacion", nombreActual.value.toLowerCase());
};

const categoriasSeleccionadas = ref(props.pCategoriasSeleccionadas);
const categoriasDisponibles = ref(props.pCategorias);
const importeAsignado = ref(Number(props.pImporteAsignado));
const totalGastos = ref(Number(props.pTotalGastos));
const totalIngresos = ref(Number(props.pTotalIngresos));
const gastos = ref(props.pGastos);

const porcentajeConsumido = computed(() => {
  let total = (totalGastos.value / importeAsignado.value) * 100;
  return Number(total.toFixed(2));
});

const porcentajeAsignado = computed(() => {
  let total = (importeAsignado.value / totalIngresos.value) * 100;
  return Number(total.toFixed(2));
});

const restante = computed(() => {
  let total = importeAsignado.value - totalGastos.value;
  return total;
});

///REFERIDO A EDITAR
const editar = ref(props.pEditar);
const nuevoNombre = ref(props.pNombre);
const nombreActual = ref(props.pNombre);
const asignable = computed(() => {
  let auxTotal = 0;
  auxTotal = Number(importeAsignado.value + sinAsignar.value);
  return auxTotal;
});
const sinAsignar = ref(props.pSinAsignar);
const slideAsignado = ref(
  Number(importeAsignado.value / asignable.value) * 100
);
const nuevoImporte = ref(importeAsignado.value.toFixed(2));
const disponibleDialog = ref(props.pSinAsignar);
const importeCalculo = ref(0);

watch(slideAsignado, () => {
  let auxTotal = 0;
  let auxTotalDisponible = 0;
  auxTotal = Number(asignable.value * slideAsignado.value) / 100;
  nuevoImporte.value = Number(auxTotal).toFixed(2);
  auxTotalDisponible = Number(asignable.value - auxTotal);
  disponibleDialog.value = auxTotalDisponible;
});

const modificarNombre = (pNuevoNombre) => {
  let existe = false;
  props.pAsignaciones.forEach((asignacion) => {
    if (
      asignacion.nombre.trim().toLowerCase() ==
      pNuevoNombre.trim().toLowerCase()
    ) {
      existe = true;
    }
  });
  if (existe) {
    nuevoNombre.value = nombreActual.value;
    showError(
      "Error:",
      "Ya existe una asignación con el mismo nombre",
      "Al crear nueva asignación"
    );
  } else {
    props.pAsignaciones.forEach((asignacion) => {
      if (
        asignacion.nombre.trim().toLowerCase() ==
        nombreActual.value.trim().toLowerCase()
      ) {
        asignacion.nombre = pNuevoNombre.toLowerCase();
      }
    });
    nombreActual.value = pNuevoNombre;
    nuevoNombre.value = pNuevoNombre;
  }
};

const confirmarNuevoImporte = () => {
  props.pAsignaciones.forEach((asignacion) => {
    if (
      asignacion.nombre.trim().toLowerCase() ==
      nombreActual.value.trim().toLowerCase()
    ) {
      asignacion.importe = Number(nuevoImporte.value);
    }
  });
};

const sumarImporte = () => {
  let auxTotal = Number(nuevoImporte.value) + Number(importeCalculo.value);

  nuevoImporte.value = Number(auxTotal).toFixed(2);
  slideAsignado.value = Number(nuevoImporte.value / asignable.value) * 100;
  importeCalculo.value = 0;
};
const restarImporte = () => {
  let auxTotal = Number(nuevoImporte.value) - Number(importeCalculo.value);
  if (auxTotal < 0) {
    auxTotal = 0;
  }

  nuevoImporte.value = Number(auxTotal).toFixed(2);
  slideAsignado.value = Number(nuevoImporte.value / asignable.value) * 100;
  importeCalculo.value = 0;
};

const resetNuevoImporte = () => {
  nuevoImporte.value = importeAsignado.value.toFixed(2);
  slideAsignado.value = Number(importeAsignado.value / asignable.value) * 100;
};

const cambiarEstado = (categoria) => {
  if (categoria.disable === true) {
    eliminarCategoriaSeleccionada(categoria);
  } else {
    categoriasSeleccionadas.value.push(categoria);
    categoria.disable = true;
  }
};

const eliminarCategoriaSeleccionada = (categoriaParametro) => {
  const indexAEliminar = categoriasSeleccionadas.value.findIndex(
    (cat) => cat.id === categoriaParametro.id
  );
  categoriasSeleccionadas.value.splice(indexAEliminar, 1);
  categoriasDisponibles.value.find((cat) => {
    if (cat.id === categoriaParametro.id) {
      cat.disable = false;
    }
  });
};

const eliminarAsignacion = () => {};

///Si se modifica algo, se actualiza, sino aparecen datos en cards diferentes
watch(props, () => {
  console.log("entro al watch props");
  nombreActual.value = props.pNombre.toLowerCase();
  disponibleDialog.value = Number(props.pSinAsignar);
  nuevoNombre.value = props.pNombre.toLowerCase();
  importeCalculo.value = 0;
  nuevoImporte.value = props.pImporteAsignado.toFixed(2);
  totalIngresos.value = Number(props.pTotalIngresos);
  importeAsignado.value = Number(props.pImporteAsignado);
  totalGastos.value = Number(props.pTotalGastos);
  categoriasDisponibles.value = props.pCategorias;
  gastos.value = props.pGastos;
  editar.value = props.pEditar;
  sinAsignar.value = Number(props.pSinAsignar);
  slideAsignado.value = Number(props.pImporteAsignado / asignable.value) * 100;
  categoriasSeleccionadas.value = props.pCategoriasSeleccionadas;
});
</script>
