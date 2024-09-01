<template>
  <div
    key="itemAsignaciones"
    class="column shadow-2 q-pa-xs"
    style="width: 114px; position: relative"
  >
    <q-icon
      class="absolute-top-right q-mt-sm q-mr-sm float-right"
      name="cancel"
      size="xs"
      color="grey-5"
      style="z-index: 1000"
      @click="eliminar()"
    />
    <div class="column items-center">
      <div class="text-subtitle2">
        <q-input
          v-model="nombre"
          class="text-subtitle2 text-capitalize"
          label="Nombre"
          @blur="modificarNombre(nombre.toLowerCase())"
        />
      </div>
      <div>
        <q-knob
          v-model="slider"
          readonly
          show-value
          size="70px"
          :thickness="0.22"
          color="primary"
          class="text-black q-ma-md"
          track-color="grey-5"
        >
          <div class="column items-center justify-center">
            <div class="text-subtitle2">{{ slider.toFixed(2) }}%</div>
          </div>
        </q-knob>
      </div>
      <div class="text-caption">
        ${{ monto }}
        <q-popup-edit
          v-model.number="monto"
          v-slot="scope"
          @update:model-value="modificarPorcentaje(monto)"
          buttons
          label-set="Confirmar"
          label-cancel="Cancelar"
          ><q-input
            @keyup.enter="scope.set"
            type="number"
            v-model="scope.value"
            class="text-caption"
            prefix="$"
            @blur="modificarPorcentaje(monto)"
        /></q-popup-edit>
      </div>
      <div style="width: 80px">
        <q-slider
          v-model="slider"
          :min="0"
          :max="100"
          color="primary"
          :label="false"
          :step="0.01"
        />
      </div>
      <div class="text-caption">Categorias</div>
      <div key="categorias" class="row">
        <div class="row">
          <div class="row">
            <q-chip
              class="text-capitalize"
              v-for="cat in categoriasSeleccionadas"
              :key="cat.index"
              size="sm"
              clickable
              @click="eliminarCategoriaSeleccionada(cat)"
              >{{ cat.nombre }}
            </q-chip>
          </div>
        </div>
        <div>
          <q-chip size="sm" clickable
            ><q-menu fit auto-close
              ><q-list
                ><q-item
                  class="text-capitalize"
                  clickable
                  v-for="item in props.categoriasDisponibles"
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from "vue";
import { useNotifications } from "../composables/useNotifications";

const { showError, showSuccess } = useNotifications();

const props = defineProps({
  totalIngreso: Number,
  categoriasDisponibles: Array,
  asignaciones: Array,
  nombreAsignacion: String,
  importeAsignado: Number,
  arrayCategoriasSeleccionadas: Array,
  porcentaje: Number,
});
let { totalIngreso, categoriasDisponibles, asignaciones, nombreAsignacion } =
  props;

const nombre = ref(props.nombreAsignacion.toLowerCase());
const slider = ref(props.porcentaje);
const monto = ref(props.importeAsignado);
const categoriasSeleccionadas = ref(props.arrayCategoriasSeleccionadas);
let nombreAnterior = props.nombreAsignacion.toLowerCase();

const emit = defineEmits(["eliminarAsignacion"]);

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
  categoriasDisponibles.find((cat) => {
    if (cat.id === categoriaParametro.id) {
      cat.disable = false;
    }
  });
};

const eliminar = () => {
  emit("eliminarAsignacion", nombre.value.toLowerCase());
};

watch(monto, () => {
  asignaciones.find((asignacion) => {
    if (asignacion.nombre === nombre.value.toLowerCase()) {
      asignacion.importe = monto.value;
    }
  });
});

watch(slider, () => {
  monto.value = Number(totalIngreso) * (slider.value / 100);
  monto.value = Number(monto.value.toFixed(2));
});
watch(props, () => {
  nombre.value = props.nombreAsignacion.toLowerCase();
  nombreAnterior = props.nombreAsignacion.toLowerCase();
  totalIngreso = props.totalIngreso;
  monto.value = props.importeAsignado;
  categoriasSeleccionadas.value = props.arrayCategoriasSeleccionadas;
  if (totalIngreso > 0) {
    slider.value = (monto.value / totalIngreso) * 100;
  }
});
const modificarPorcentaje = (nuevoMonto) => {
  slider.value = (nuevoMonto / totalIngreso) * 100;
};
const modificarNombre = (nuevoNombre) => {
  let auxNombre = "";
  if (nuevoNombre === "") {
    nombre.value = nombreAnterior.toLowerCase();
  }
  if (nuevoNombre.toLowerCase() !== nombreAnterior.toLowerCase()) {
    asignaciones.find((asignacion) => {
      if (asignacion.nombre.toLowerCase() === nuevoNombre.toLowerCase()) {
        auxNombre = asignacion.nombre.toLowerCase();
      }
    });
    if (auxNombre) {
      showError(
        "Error: ",
        "Ya existe una asignación con el nombre: " + nuevoNombre,
        " Al modificar nombre de asignación"
      );
      nombre.value = nombreAnterior.toLowerCase();
    } else {
      asignaciones.find((asignacion) => {
        if (asignacion.nombre.toLowerCase() === nombreAnterior.toLowerCase()) {
          asignacion.nombre = nombre.value.toLowerCase();
        }
      });
      nombreAnterior = nombre.value.toLowerCase();
    }
  }
};
</script>
