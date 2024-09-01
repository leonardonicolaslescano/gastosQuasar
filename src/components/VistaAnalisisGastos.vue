<template>
  <div class="column items-center q-gutter-md q-px-md">
    <div id="Filtro" class="column">
      <div key="titulo" class="text-h4 q-my-md">Listado de gastos</div>
      <div key="Campos" class="row text-caption q-gutter-sm q-px-md">
        <div class="column no-wrap">
          <div>Desde</div>
          <div>
            <div class="row no-wrap q-gutter-sm">
              <q-select
                class="text-caption"
                style="width: 80px"
                v-model="mesInicio"
                :options="meses"
                :option-label="(item) => item.nombre"
                :display-value="mesInicio.nombre"
                label="Mes"
              ></q-select>
              <q-select
                class="text-caption"
                style="width: 60px"
                v-model="añoInicio"
                :options="años"
                label="Año"
              ></q-select>
            </div>
          </div>
        </div>
        <div class="column">
          <div>Hasta</div>
          <div>
            <div class="row no-wrap q-gutter-sm">
              <q-select
                class="text-caption"
                style="width: 100px"
                v-model="mesHasta"
                :options="meses"
                :option-label="(item) => item.nombre"
                :display-value="mesHasta.nombre"
                label="Mes Hasta"
              ></q-select>
              <q-select
                class="text-caption"
                style="width: 100px"
                v-model="añoHasta"
                :options="años"
                label="Año Hasta"
              ></q-select>
              <q-btn
                color="primary"
                label="Busqueda"
                @click="buscarGastos(mesInicio, añoInicio, mesHasta, añoHasta)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!loadingVisible">
      <q-inner-loading
        :showing="!loadingVisible"
        label="Please wait..."
        label-class="text-teal"
        label-style="font-size: 1.1em"
      />
    </div>
    <div id="Tabla" v-if="listaFiltrada">
      <CardAnalisisGastos
        class="q-my-md"
        v-for="itemMesAño in listaFiltrada"
        :key="itemMesAño.id"
        :itemId="itemMesAño.id"
        :mes="itemMesAño.mes"
        :año="itemMesAño.año"
        :total="itemMesAño.total"
        :listaGastos="itemMesAño.gastos"
        :listaCategoriasAgrupadas="itemMesAño.categoriasAgrupadas"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useAuthStore } from "src/stores/AuthStore";
import { date } from "quasar";
import CardAnalisisGastos from "../components/CardAnalisisGastos.vue";

const loadingVisible = ref(true);

const store = useAuthStore();

//Relacionado a fechas y filtro
const meses = [
  {
    id: 0,
    nombre: "Enero",
  },
  {
    id: 1,
    nombre: "Febrero",
  },
  {
    id: 2,
    nombre: "Marzo",
  },
  {
    id: 3,
    nombre: "Abril",
  },
  {
    id: 4,
    nombre: "Mayo",
  },
  {
    id: 5,
    nombre: "Junio",
  },
  {
    id: 6,
    nombre: "Julio",
  },
  {
    id: 7,
    nombre: "Agosto",
  },
  {
    id: 8,
    nombre: "Septiembre",
  },
  {
    id: 9,
    nombre: "Octubre",
  },
  {
    id: 10,
    nombre: "Noviembre",
  },
  {
    id: 11,
    nombre: "Diciembre",
  },
];
const años = ["2020", "2021", "2022", "2023", "2024", "2025"];

const fechaActual = new Date();
const mesActual = fechaActual.getMonth();
const obtejoMesActual = meses.find((mes) => mes.id === mesActual);

const mesInicio = ref({
  id: obtejoMesActual.id,
  nombre: obtejoMesActual.nombre,
});
const añoInicio = ref(fechaActual.getFullYear());
const mesHasta = ref({
  id: obtejoMesActual.id,
  nombre: obtejoMesActual.nombre,
});
const añoHasta = ref(fechaActual.getFullYear());

//Referido a listas y a su estructuración
const listaCategorias = computed(() => {
  return store.categorias;
});
const listaFiltrada = ref(null);
const nombreCategoriaPorId = (id) => {
  const categoria = listaCategorias.value.find((cat) => cat.id === id);
  return categoria.nombre;
};
const iconoCategoriaPorId = (id) => {
  const categoria = listaCategorias.value.find((cat) => cat.id === id);
  return categoria.icon;
};
const agruparPorMesAño = (lista) => {
  return lista.reduce((acc, gasto) => {
    var fecha = gasto.fecha.split("/");
    var mesGasto = fecha[1];
    var añoGasto = fecha[2];
    var mesNombre = meses.find((mes) => mes.id === Number(mesGasto) - 1);
    var indexFecha = mesGasto + añoGasto;
    if (!acc[indexFecha]) {
      acc[indexFecha] = {
        id: indexFecha,
        mes: mesNombre.nombre,
        año: añoGasto,
        gastos: [],
        categoriasAgrupadas: [],
        total: 0,
      };
    }
    acc[indexFecha].total += Number(gasto.importe);

    acc[indexFecha].gastos.push({
      id: gasto.id,
      fecha: gasto.fecha,
      importe: gasto.importe,
      descripcion: gasto.descripcion,
      categoriaId: gasto.categoriaId,
      categoriaNombre: gasto.categoriaNombre,
      categoriaIcono: gasto.categoriaIcono,
    });
    return acc;
  }, {});
};
const agruparGastosPorCategoria = (listaGastosConCategoria) => {
  const gastosPorCategoria = listaGastosConCategoria.reduce((acc, gasto) => {
    // Si la categoriaId no existe en el acumulador, inicializarla
    if (!acc[gasto.categoriaId]) {
      acc[gasto.categoriaId] = {
        categoriaId: gasto.categoriaId,
        categoriaNombre: gasto.categoriaNombre,
        categoriaIcono: gasto.categoriaIcono,
        importeTotalDeCategoria: 0,
        listaGastosDeCategoria: [],
      };
    }

    // Agregar el importe al total de la categoría
    acc[gasto.categoriaId].importeTotalDeCategoria += Number(gasto.importe);

    // Agregar el gasto a la lista de gastos de la categoría
    acc[gasto.categoriaId].listaGastosDeCategoria.push({
      id: gasto.id,
      fecha: gasto.fecha,
      importe: gasto.importe,
      descripcion: gasto.descripcion,
    });

    return acc;
  }, {});

  const listaCategoriasAgrupadas = Object.values(gastosPorCategoria);
  return listaCategoriasAgrupadas;
};

//Ejecución de busqueda
const buscarGastos = async (
  mesDesde,
  añoDesde,
  mesHasta = mesDesde,
  añoHasta = añoDesde
) => {
  loadingVisible.value = false;
  listaFiltrada.value = null;
  const fechaDesdeCompleta = new Date(añoDesde, mesDesde.id, 1);
  const fechaHastaCompleta = new Date(añoHasta, mesHasta.id + 1, 0);
  const listaPrevia = await store.buscarGastosPorMesAño(
    fechaDesdeCompleta,
    fechaHastaCompleta
  );
  const listaPreviaConCategorias = listaPrevia.map((gasto) => ({
    id: gasto.id,
    fecha: date.formatDate(gasto.fecha.toDate(), "DD/MM/YYYY"),
    importe: gasto.importe,
    descripcion: gasto.descripcion,
    categoriaId: gasto.categoriaId,
    categoriaNombre: nombreCategoriaPorId(gasto.categoriaId),
    categoriaIcono: iconoCategoriaPorId(gasto.categoriaId),
  }));

  const hashPreviaAgrupadoMesAño = agruparPorMesAño(listaPreviaConCategorias);

  var arrayPreviaAgrupadoMesAño = Object.values(hashPreviaAgrupadoMesAño);

  arrayPreviaAgrupadoMesAño.forEach((item) => {
    var arrayGastosPorCategoria = agruparGastosPorCategoria(item.gastos);
    item.categoriasAgrupadas = arrayGastosPorCategoria;
  });

  listaFiltrada.value = arrayPreviaAgrupadoMesAño;
  loadingVisible.value = true;
};
</script>
