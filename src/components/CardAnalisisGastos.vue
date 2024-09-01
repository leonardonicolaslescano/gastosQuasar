<template>
  <div>
    <q-card :style="$q.screen.lt.sm ? 'width:380px' : 'width:600px'">
      <!-- Encabezado, muestra el Mes, año y el monto total gastado -->
      <q-card-section id="Header">
        <div class="row q-gutter-sm items-center">
          <div class="q-table__title text-h5">
            {{ mes }}
          </div>
          <div class="q-table__title">
            {{ año }}
          </div>
          <q-space />
          <div class="column items-end q-mr-lg">
            <div class="text-caption">Total</div>
            <div class="q-table__title">${{ total.toFixed(2) }}</div>
          </div>
        </div>
      </q-card-section>
      <!-- Componente de transición, da el efecto de ocultar o mostrar las tables deslizandose -->
      <q-slide-transition :duration="600">
        <div v-show="tablasVisible">
          <!-- TABS para deslizarse entre las tablas -->
          <q-card-section id="Tabs"
            ><q-tabs
              v-model="tab"
              dense
              inline-label
              class="text-grey"
              active-color="primary"
              indicator-color="primary"
              align="center"
              narrow-indicator
              :breakpoint="0"
              stretch
            >
              <q-tab name="general" label="General" />
              <q-tab name="categorias" label="Categorias" />
              <q-tab name="grafico" label="Gráfico" />
            </q-tabs>
          </q-card-section>
          <!-- TABLAS -->
          <q-card-section id="Tablas">
            <q-tab-panels v-model="tab" animated>
              <!-- Tabla GENERAL de gastos del mes -->
              <q-tab-panel name="general" class="q-pa-xs">
                <q-table
                  :style="$q.screen.lt.sm ? 'width:340px' : 'max-width:560px'"
                  title="General"
                  :rows="listaGastos"
                  :columns="columns"
                  row-key="name"
                  no-data-label="Sin resultados"
                  separator="vertical"
                  :rows-per-page-options="[7]"
                >
                </q-table>
              </q-tab-panel>
              <!-- Tabla CATEGORIAS, muestra gastos agrupados por categorias -->
              <q-tab-panel name="categorias" class="q-pa-xs">
                <q-table
                  title="Categorias"
                  :rows="listaCategoriasAgrupadas"
                  :columns="columnsCategoria"
                  row-key="name"
                  no-data-label="Sin resultados"
                  :rows-per-page-options="[0, 0]"
                  hide-bottom
                >
                  <template v-slot:header="props">
                    <q-tr :props="props">
                      <q-th auto-width />
                      <q-th
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                      >
                        {{ col.label }}
                      </q-th>
                    </q-tr>
                  </template>

                  <!-- botón expandir: muestra los gastos de esa categoría -->
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td auto-width>
                        <q-btn
                          flat
                          size="sm"
                          round
                          dense
                          @click="props.row.expand = !props.row.expand"
                          :icon="
                            props.row.expand ? 'expand_less' : 'expand_more'
                          "
                        />
                      </q-td>
                      <q-td key="name" :props="props">
                        <q-avatar
                          :icon="props.row.categoriaIcono"
                          size="xs"
                          color="primary"
                          text-color="white"
                          class="q-mr-sm"
                        />
                        {{ props.row.categoriaNombre }}
                      </q-td>
                      <q-td key="importeTotalDeCategoria" :props="props">
                        ${{ props.row.importeTotalDeCategoria.toFixed(2) }}
                      </q-td>
                    </q-tr>
                    <q-tr v-show="props.row.expand" :props="props">
                      <q-td colspan="100%">
                        <div class="text-left">
                          <q-table
                            :style="
                              $q.screen.lt.sm
                                ? 'width:310px'
                                : 'max-width:560px'
                            "
                            dense
                            :rows="props.row.listaGastosDeCategoria"
                            :columns="columnsGastoPorCategoria"
                            row-key="name"
                            no-data-label="Sin resultados"
                            separator="none"
                            :rows-per-page-options="[0, 0]"
                            hide-bottom
                          />
                        </div>
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </q-tab-panel>
              <!-- Tabla GRAFICO de gastos por día -->
              <q-tab-panel
                name="grafico"
                @vue:mounted="cargarGrafico()"
                class="q-pa-xs"
              >
                <canvas :id="itemId"></canvas>
              </q-tab-panel>
            </q-tab-panels>
          </q-card-section>
        </div>
      </q-slide-transition>
      <q-separator />
      <!-- Botón expandir, para ocultar o mostrar las tablas -->
      <q-card-actions id="btn_Expandir" align="center">
        <q-btn
          flat
          size="sm"
          dense
          :icon="tablasVisible ? 'expand_less' : 'expand_more'"
          @click="tablasVisible = !tablasVisible"
        ></q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>
import { ref, defineProps } from "vue";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const tab = ref("general");
const tablasVisible = ref(false);
let chart = null;

const props = defineProps({
  itemId: String,
  mes: String,
  año: String,
  total: Number,
  listaGastos: Array,
  listaCategoriasAgrupadas: Array,
});

const { itemId, mes, año, total, listaGastos, listaCategoriasAgrupadas } =
  props;

const agruparGastosPorFecha = (gastos) => {
  return gastos.reduce((acc, gasto) => {
    if (!acc[gasto.fecha]) {
      acc[gasto.fecha] = 0;
    }
    acc[gasto.fecha] += Number(gasto.importe);
    return acc;
  }, {});
};

const gastosPorFecha = agruparGastosPorFecha(listaGastos);
const etiquetas = Object.keys(gastosPorFecha);
const datos = Object.values(gastosPorFecha);

const data = {
  labels: etiquetas,
  datasets: [
    {
      label: "Gastos por día",
      data: datos,
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1,
      maxBarThickness: 20,
    },
  ],
};
const config = {
  type: "bar",
  data: data,
  options: {
    aspectRatio: 1 | 1,
    indexAxis: "y",
    scales: {
      y: {
        ticks: {
          autoSkip: false,
        },
      },
      x: {
        ticks: {
          callback: function (value, index, ticks) {
            return "$" + value;
          },
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";

            if (label) {
              label += ": ";
            }
            if (context.parsed.x !== null) {
              label = label + "$" + context.parsed.x;
            }
            return label;
          },
        },
      },
    },
  },
};

const cargarGrafico = () => {
  var ctx = document.getElementById(itemId);
  if (chart) {
    chart.destroy();
  }
  chart = new Chart(ctx, config);
};

const columns = [
  {
    name: "name",
    required: true,
    label: "Fecha",
    align: "left",
    style: "width: 50px",
    field: (row) => row.fecha,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "importe",
    align: "right",
    style: "width: 100px",
    label: "Importe",
    field: "importe",
    format: (val) => `$${val}`,
    sortable: true,
  },
  {
    name: "categoria",
    align: "right",
    label: "Categoria",
    field: "categoriaNombre",
    sortable: true,
    classes: "text-capitalize",
  },
  {
    name: "descripcion",
    align: "center",
    label: "Descripcion",
    field: "descripcion",
  },
];
const columnsCategoria = [
  {
    name: "name",
    required: true,
    label: "Categoria",
    align: "left",
    style: "width: 400px",
    field: (row) => row.categoriaNombre,
    format: (val) => `${val}`,
    sortable: true,
    classes: "text-capitalize",
  },
  {
    name: "importeTotalDeCategoria",
    align: "right",
    style: "width: 100px",
    label: "Total",
    field: (row) => row.importeTotalDeCategoria.toFixed(2),
    format: (val) => `$${val}`,
    sortable: true,
  },
];
const columnsGastoPorCategoria = [
  {
    name: "name",
    required: true,
    label: "Fecha",
    align: "left",
    style: "width: 50px",
    field: (row) => row.fecha,
    format: (val) => `${val}`,
  },
  {
    name: "importe",
    align: "right",
    style: "width: 100px",
    label: "Importe",
    field: "importe",
    format: (val) => `$${val}`,
  },
  {
    name: "descripcion",
    align: "right",
    style: "width: 20px",
    label: "Descripcion",
    field: "descripcion",
  },
];
</script>
