<template>
  <div class="column q-gutter-sm q-ma-none q-pa-none">
    <div class="row justify-center items-center q-ma-xs">
      <div class="q-pa-sm">
        <q-btn
          color="primary"
          label="Guardar"
          @click="agregarNuevoPresupuesto()"
        />
      </div>
      <div class="q-pa-sm">
        <q-btn color="primary" label="Cancelar" @click="cancelar()" />
      </div>
    </div>
    <div key="fecha">
      <div class="row q-gutter-sm items-center">
        <div>Fecha inicio:</div>
        <q-select
          v-if="año"
          style="min-width: 70px"
          label="Mes"
          v-model="mes"
          :options="meses"
          :option-label="(item) => item.nombre"
          :option-value="(item) => item.id"
        />
        <q-select
          style="width: 65px"
          v-model="año"
          :options="años"
          label="Año"
        />
      </div>
    </div>
    <q-separator />
    <div class="column" key="ingresos">
      <div class="row q-gutter-md text-subtitle1">
        <div>Ingresos:</div>
        <div>${{ totalIngresos }}</div>
      </div>
      <div class="column q-my-sm">
        <div
          class="row q-gutter-md text-caption"
          :style="porcentajeAsignado > 100 ? 'color: red' : 'color: black'"
        >
          <div>Asignado:</div>
          <div>${{ totalAsignado }}</div>
          <div>{{ porcentajeAsignado }}%</div>
        </div>
        <div
          class="row q-gutter-md text-caption"
          :style="importeSinAsignar < 0 ? 'color: red' : 'color: black'"
        >
          <div>Sin asignar:</div>
          <div>${{ importeSinAsignar }}</div>
          <div>{{ porcentajeSinAsignar }}%</div>
        </div>
      </div>

      <div key="lista_ingresos">
        <q-list>
          <q-item v-for="ingreso in ingresos" :key="ingreso.index">
            <q-item-section>
              <q-item-label> {{ ingreso.descripcion }}</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label> ${{ ingreso.importe }}</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label> {{ ingreso.tipo }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <div class="text-grey-8 q-gutter-xs">
                <q-btn
                  flat
                  dense
                  round
                  icon="mode_edit"
                  @click="
                    editarIngreso(
                      ingreso.descripcion,
                      ingreso.importe,
                      ingreso.tipo
                    ),
                      (dialogoModificarIngreso = true)
                  "
                />
                <q-btn
                  flat
                  dense
                  round
                  icon="delete"
                  @click="eliminarIngreso(ingreso.descripcion)"
                />
              </div>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-input v-model="descripcionIngreso" label="Descripción"
            /></q-item-section>
            <q-item-section>
              <q-input
                v-model="importe"
                label="Importe"
                prefix="$"
                mask="#.##"
                fill-mask="0"
                reverse-fill-mask
            /></q-item-section>
            <q-item-section>
              <q-select v-model="tipo" :options="arrayTipos" label="Tipo"
            /></q-item-section>
            <q-item-section side>
              <div class="text-grey-8 q-gutter-xs">
                <q-btn
                  flat
                  dense
                  round
                  icon="done"
                  :disable="
                    importe < 1 ||
                    descripcionIngreso.length < 1 ||
                    tipo.length < 1
                  "
                  @click="agregarIngreso()"
                />
                <q-btn flat dense round icon="close" @click="resetIngreso()" />
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
    <q-separator />
    <div
      class="column q-ma-none q-pa-none items-center"
      key="asignaciones"
      v-if="visible"
      v-show="totalIngresos > 0"
    >
      <div class="q-pa-md">Asignaciones</div>
      <div class="row q-gutter-sm q-ml-xs q-mb-sm">
        <AsignacionesEdit
          v-for="item in asignaciones"
          :key="item.index"
          :totalIngreso="totalIngresos"
          :categoriasDisponibles="categorias"
          :importeAsignado="item.importe"
          :asignaciones="asignaciones"
          :nombreAsignacion="item.nombre"
          :arrayCategoriasSeleccionadas="item.categorias"
          :porcentaje="
            item.importe > 0 ? (item.importe / totalIngresos) * 100 : 0
          "
          @eliminar-asignacion="(asignacion) => eliminarAsignacion(asignacion)"
        />
        <div key="itemNuevo" class="column" style="width: 114px">
          <div class="column items-center shadow-2 q-pa-xs">
            <div class="text-subtitle2">Nuevo</div>
            <div class="text-caption">
              <q-btn
                class="q-ma-lg"
                color="primary"
                size="lg"
                round
                label="+"
                @click="agregarAsigaciones"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <q-inner-loading
      :showing="!visible"
      label="Please wait..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
    <q-dialog
      v-model="dialogoModificarIngreso"
      persistent
      backdrop-filter="blur(4px)"
    >
      <q-card>
        <q-card-section class="row items-center">
          <div class="row q-gutter-sm">
            <div>
              <q-input
                v-model="ingresoEdit.descripcionNuevo"
                label="Descripción"
              />
            </div>
            <div>
              <q-input
                v-model.number="ingresoEdit.importe"
                type="number"
                label="Importe"
                prefix="$"
              />
            </div>
            <div>
              <q-select
                v-model="ingresoEdit.tipo"
                :options="arrayTipos"
                label="Tipo"
                style="width: 80px"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn
            flat
            label="Cancel"
            color="primary"
            v-close-popup
            @click="clearIngresoEdit(), (dialogoModificarIngreso = false)"
          />
          <q-btn
            :disable="
              ingresoEdit.descripcionNuevo.length < 1 ||
              ingresoEdit.importe < 1 ||
              ingresoEdit.tipo.length < 1
            "
            flat
            label="Confirmar"
            color="primary"
            v-close-popup
            @click="confirmarModificarIngreso()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import AsignacionesEdit from "../components/AsignacionesEdit.vue";
import { useAuthStore } from "src/stores/AuthStore";
import { useConfigStore } from "src/stores/ConfigStore";
import { usePresupuestosStore } from "src/stores/PresupuestosStore";
import { useNotifications } from "../composables/useNotifications";
import { date } from "quasar";

const { showError, showSuccess } = useNotifications();

const store = useAuthStore();
const configStore = useConfigStore();
const presupuestoStore = usePresupuestosStore();

const props = defineProps({
  pMes: Object,
  pAño: Number,
  pIngresos: Array,
  pAsignaciones: Array,
  pCategoriasSeleccionadas: Array,
  pEditar: Boolean,
});

const emit = defineEmits(["cancelar"]);

const asignaciones = ref(props.pAsignaciones);
const dialogoModificarIngreso = ref(false);

const fechaActual = new Date();
const años = ref([
  fechaActual.getFullYear(),
  fechaActual.getFullYear() + 1,
  fechaActual.getFullYear() + 2,
]);

//21/08/2024 Modificaciones para mostrar fecha al editar
//const año = ref("");
const año = ref(props.pAño);
const mes = ref(props.pMes);
// const mes = computed(() => {
//   var pFecha = new Date(año.value, props.pMes.id, 1);
//   if (pFecha < fechaActual) {
//     return configStore.meses[fechaActual.getMonth()];
//   } else {
//     return props.pMes;
//   }
// });
//

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

const visible = computed(() => {
  //Verifica si la lista de categorias ya fué actualizada en el store
  return store.listaCategoriaCargada;
});

const categorias = computed(() => {
  const categoriasAux = store.categorias.map((categoria) => ({
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

const ingresos = ref(props.pIngresos);

const descripcionIngreso = ref("");
const importe = ref(0);
const tipo = ref("");
const arrayTipos = ref(["Fijo", "Único"]);
const ingresoEdit = ref({
  descripcionNuevo: "",
  descripcionAnterior: "",
  importe: 0,
  tipo: "",
});

const agregarIngreso = () => {
  if (!existeDescripcionIngreso(descripcionIngreso.value)) {
    ingresos.value.push({
      descripcion: descripcionIngreso.value,
      importe: Number(importe.value),
      tipo: tipo.value,
    });
    resetIngreso();
  } else {
    showError(
      "Error: ",
      "Ya existe un ingreso con la descripción: " + descripcionIngreso.value,
      "Al agregar ingreso en presupuestos"
    );
  }
};
const existeDescripcionIngreso = (nuevoNombre) => {
  let resultado = false;
  ingresos.value.find((ingreso) => {
    if (ingreso.descripcion === nuevoNombre) {
      resultado = true;
    }
  });
  return resultado;
};
const editarIngreso = (pDescripcion, pImporte, pTipo) => {
  ingresoEdit.value.descripcionNuevo = pDescripcion;
  ingresoEdit.value.descripcionAnterior = pDescripcion;
  ingresoEdit.value.importe = pImporte;
  ingresoEdit.value.tipo = pTipo;
};

const confirmarModificarIngreso = () => {
  if (
    ingresoEdit.value.descripcionNuevo === ingresoEdit.value.descripcionAnterior
  ) {
    modificarIngreso();
  } else {
    if (existeDescripcionIngreso(ingresoEdit.value.descripcionNuevo)) {
      showError(
        "Error: ",
        "Ya existe un ingreso con al descripción: " +
          ingresoEdit.value.descripcionNuevo,
        "Al modificar ingreso"
      );
    } else {
      modificarIngreso();
    }
  }
};

const modificarIngreso = () => {
  ingresos.value.find((ingreso) => {
    if (ingreso.descripcion === ingresoEdit.value.descripcionAnterior) {
      ingreso.descripcion = ingresoEdit.value.descripcionNuevo;
      ingreso.importe = Number(ingresoEdit.value.importe);
      ingreso.tipo = ingresoEdit.value.tipo;
    }
  });
};

const clearIngresoEdit = () => {
  ingresoEdit.value.descripcionNuevo = "";
  ingresoEdit.value.descripcionAnterior = "";
  ingresoEdit.value.importe = 0;
  ingresoEdit.value.tipo = "";
};

const resetIngreso = () => {
  descripcionIngreso.value = "";
  importe.value = 0;
  tipo.value = "";
};
const totalIngresos = computed(() => {
  var total = 0;
  if (ingresos.value.length > 0)
    total = ingresos.value.reduce(
      (acumulador, ingreso) => acumulador + ingreso.importe,
      0
    );

  return Number(total.toFixed(2));
});

const agregarAsigaciones = () => {
  const nuevaAsignacion = () => {
    asignaciones.value.push({
      nombre: "",
      categorias: [],
      porcentaje: 0,
      importe: 0,
    });
  };
  if (asignaciones.value.length < 1) {
    nuevaAsignacion();
  } else {
    let sinNombre = asignaciones.value.find((asignacion) => {
      if (asignacion.nombre === "") {
        return true;
      }
    });
    if (sinNombre) {
      showError(
        "Error:",
        "Existe una asignación sin Nombre modificado",
        "Al crear nueva asignación"
      );
    } else {
      nuevaAsignacion();
    }
  }
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
const totalAsignado = computed(() => {
  let total = asignaciones.value.reduce(
    (acumulador, asignacion) => acumulador + asignacion.importe,
    0
  );
  return Number(total.toFixed(2));
});
const importeSinAsignar = computed(() => {
  let total = totalIngresos.value - totalAsignado.value;
  return Number(total.toFixed(2));
});

const porcentajeAsignado = computed(() => {
  let porcentaje = 0;
  if (ingresos.value.length > 0)
    porcentaje =
      (1 -
        Number(importeSinAsignar.value.toFixed(2)) /
          Number(totalIngresos.value.toFixed(2))) *
      100;
  return porcentaje.toFixed(2);
});
const porcentajeSinAsignar = computed(() => {
  let porcentaje = 0;
  if (ingresos.value.length > 0)
    porcentaje =
      (Number(importeSinAsignar.value.toFixed(2)) /
        Number(totalIngresos.value.toFixed(2))) *
      100;
  return porcentaje.toFixed(2);
});
const eliminarAsignacion = (nombre) => {
  let index = null;
  let auxAsignacion = null;
  asignaciones.value.find((asignacion) => {
    if (asignacion.nombre === nombre) {
      index = asignaciones.value.indexOf(asignacion);
      auxAsignacion = asignacion;
    }
  });
  auxAsignacion.categorias.find((categoria) => {
    categorias.value.find((cat) => {
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
    presupuestoStore.agregarPresupuesto(
      pFecha,
      ingresos.value,
      asignaciones.value
    );
  }
};
const cancelar = () => {
  emit("cancelar");
};
</script>
