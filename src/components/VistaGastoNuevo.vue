<template>
  <div class="column q-px-md items-center">
    <!-- FORMULARIO NUEVO GASTO: dentro de un componente de transition para que se oculte al ver listado de gastos -->
    <q-slide-transition :duration="1000">
      <!-- DIV contenedor usado solo para que se oculte el contenido con efecto de transición -->
      <div v-show="visibleDiv">
        <div key="titulo" class="text-h4 q-my-md">Nuevo Gasto</div>
        <div class="column">
          <div id="campoFecha" class="col">
            <q-input v-model="fecha" stack-label label="Fecha" readonly>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="fecha"
                      mask="DD/MM/YYYY"
                      today-btn
                      :locale="formatoCalendario"
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div id="campoImporte" class="col">
            <div class="text-caption text-grey-7">Importe</div>
            <q-input
              v-model="importe"
              class="text-h4"
              prefix="$"
              mask="#.##"
              fill-mask="0"
              reverse-fill-mask
            />
          </div>
          <div id="campoCategoria" class="col">
            <q-select
              v-model="categoria"
              :options="listaCategorias"
              :option-label="(item) => item.nombre"
              label="Categoria"
              class="text-h6 text-capitalize"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <q-avatar
                      :icon="scope.opt.icon"
                      color="primary"
                      text-color="white"
                      size="md"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-capitalize">{{
                      scope.opt.nombre
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div id="campoDescripcion" class="col">
            <q-input v-model="descripcion" label="Descripción (opcional)" />
          </div>
          <div id="botones" class="col">
            <div class="row q-my-sm q-mx-none justify-end">
              <q-btn
                class="col q-px-xs"
                color="warning"
                label="Cancelar"
                @click="resetGasto()"
              />
              <q-btn
                class="col q-px-xs q-ml-md"
                color="primary"
                label="Agregar"
                :disable="importe.length < 1 || categoria.length < 1"
                @click="agregarGasto()"
              />
            </div>
          </div>
        </div>
      </div>
    </q-slide-transition>
    <!-- BOTON EXPANDIR LISTA GASTOS y ocultar nuevo gasto -->
    <div v-touch-pan.prevent.vertical="swipe">
      <div class="row items-center">
        <div class="text-h6 q-my-md">
          <q-separator /><q-btn
            flat
            :icon="visibleDiv ? 'expand_more' : 'expand_less'"
            :label="visibleDiv ? 'Gastos del mes' : 'Agregar gasto'"
            @click="visibleDiv = !visibleDiv"
          />
        </div>
      </div>
    </div>
    <!-- LISTADO DE GASTOS: dentro de un componente de transition para que se expanda al mostrarse y se oculte nuevo gasto -->
    <q-slide-transition :duration="1000">
      <!-- DIV contenedor usado solo para que se oculte el contenido con el efecto de transición -->
      <div key="listaGastos" v-if="!visibleDiv">
        <div class="q-py-md" style="max-width: 90vw">
          <!-- LISTA DE GASTOS: Componente lista dentro de un DIV que define las dimensiones -->
          <q-list separator class="rounded-borders">
            <q-item-label header>Gastos del mes</q-item-label>

            <q-item
              v-for="(gasto, index) in listGastosCategorias"
              :key="index"
              :data-id="gasto.id"
              clickable
              class="q-px-xs"
            >
              <!-- Campos de la lista -->
              <div
                class="row no-wrap q-px-none q-gutter-sm justify-center items-center"
                style="max-width: 90vw"
              >
                <!-- Campo fecha -->
                <div>{{ gasto.fecha }}</div>
                <q-separator vertical />
                <!-- Campo importe -->
                <div style="min-width: 90px; max-width: 200px">
                  ${{ gasto.importe }}
                </div>
                <q-space />
                <q-separator vertical />
                <!-- Campo icono de la categoria-->
                <q-avatar
                  class="gt-xs"
                  :icon="gasto.categoriaIcono"
                  color="primary"
                  text-color="white"
                  size="sm"
                ></q-avatar>
                <q-avatar
                  class="lt-sm"
                  :icon="gasto.categoriaIcono"
                  color="primary"
                  text-color="white"
                  size="sm"
                  ><q-tooltip class="text-capitalize">
                    {{ gasto.categoriaNombre }}
                  </q-tooltip></q-avatar
                >
                <!-- Campo nombre de categoria, se oculta en pantallas pequeñas -->
                <div class="gt-xs text-capitalize" style="width: 100px">
                  {{ gasto.categoriaNombre }}
                </div>
                <q-separator vertical />
                <!-- Campo descripción, se oculta en pantallas pequeñas -->
                <div class="gt-xs" style="width: 300px">
                  {{ gasto.descripcion }}
                </div>
                <q-separator class="gt-xs" vertical />
                <!-- Sección derecho del item de la lista, botones -->
                <q-item-section side class="q-pa-none q-mx-none">
                  <div
                    class="row no-wrap justify-end text-grey-8"
                    style="min-width: 80px"
                  >
                    <q-space />
                    <!-- Boton Info, aparece en pantallas pequeñas en reemplazo del nombre de la categoria y la descripción del gasto -->
                    <q-btn class="lt-sm" flat dense round icon="info"
                      ><q-menu>
                        <q-item
                          class="column no-wrap items-start text-caption q-pa-sm"
                          style="max-width: 160px"
                        >
                          <div>{{ gasto.fecha }}</div>
                          <div>${{ gasto.importe }}</div>
                          <div class="row no-wrap q-my-sm">
                            <q-avatar
                              class="lt-sm q-mr-sm"
                              :icon="gasto.categoriaIcono"
                              color="primary"
                              text-color="white"
                              size="xs"
                            />
                            <div class="text-capitalize">
                              {{ gasto.categoriaNombre }}
                            </div>
                          </div>
                          <q-item-section>{{
                            gasto.descripcion
                          }}</q-item-section>
                        </q-item>
                      </q-menu></q-btn
                    >
                    <!-- Boton "mas opciones", aparece en pantallas chicas reemplazando el edit y delete -->
                    <q-btn class="lt-sm" flat dense round icon="more_vert">
                      <q-menu anchor="bottom left" self="top left">
                        <q-item
                          clickable
                          v-close-popup
                          @click="seleccionarGasto(gasto), (dialogEdit = true)"
                        >
                          <q-item-section>Editar</q-item-section>
                        </q-item>
                        <q-item
                          clickable
                          v-close-popup
                          @click="
                            seleccionarGasto(gasto), (dialogDelete = true)
                          "
                        >
                          <q-item-section>Eliminar</q-item-section>
                        </q-item>
                      </q-menu>
                    </q-btn>
                    <!-- Boton Edit, Desaparece en pantallas pequeñas y se reemplaza por boton "mas opciones" -->
                    <q-btn
                      class="gt-xs"
                      flat
                      dense
                      round
                      icon="mode_edit"
                      @click="seleccionarGasto(gasto), (dialogEdit = true)"
                    />
                    <!-- Botón Delete, Desaparece en pantallas pequeñas y se reemplaza por botón "mas opciones" -->
                    <q-btn
                      class="gt-xs"
                      flat
                      dense
                      round
                      icon="delete"
                      @click="seleccionarGasto(gasto), (dialogDelete = true)"
                    />
                  </div>
                </q-item-section>
              </div>
            </q-item>
            <!-- Dialog Delete -->
            <q-dialog
              v-model="dialogDelete"
              persistent
              backdrop-filter="blur(4px)"
            >
              <q-card>
                <q-card-section class="row items-center">
                  <q-avatar
                    icon="report_problem"
                    color="primary"
                    text-color="white"
                    size="md"
                  />
                  <span class="q-ml-sm text-h6">Eliminar? </span>
                </q-card-section>
                <q-separator />
                <q-card-section class="column items-center">
                  <div class="q-ml-sm text-caption">
                    {{ gastoSeleccionado.fecha }}
                  </div>
                  <div class="q-ml-sm text-body1">
                    ${{ gastoSeleccionado.importe }}
                  </div>
                  <div class="q-ml-sm text-body2 text-capitalize">
                    {{ gastoSeleccionado.categoriaNombre }}
                  </div>
                </q-card-section>
                <q-card-actions align="right">
                  <q-btn
                    flat
                    label="Cancel"
                    color="primary"
                    v-close-popup
                    @click="confirmDelete = false"
                  />
                  <q-btn
                    flat
                    label="Confirmar"
                    color="primary"
                    v-close-popup
                    @click="eliminarGasto(gastoSeleccionado.id)"
                  />
                </q-card-actions>
              </q-card>
            </q-dialog>
            <!-- Dialog Edit -->
            <q-dialog
              v-model="dialogEdit"
              persistent
              backdrop-filter="blur(4px)"
            >
              <q-card class="column items-center">
                <q-card-section class="text-h6">Modificar gasto</q-card-section>
                <q-separator />
                <q-card-section>
                  <div class="column q-gutter-xs items-stretch">
                    <div>
                      <q-input
                        v-model="gastoSeleccionado.fecha"
                        stack-label
                        label="Fecha"
                        readonly
                      >
                        <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              cover
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date
                                v-model="gastoSeleccionado.fecha"
                                mask="DD/MM/YYYY"
                                today-btn
                                :locale="formatoCalendario"
                              >
                                <div class="row items-center justify-end">
                                  <q-btn
                                    v-close-popup
                                    label="Close"
                                    color="primary"
                                    flat
                                  />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
                    <div>
                      <div class="text-caption text-grey-7">Importe</div>
                      <q-input
                        v-model="gastoSeleccionado.importe"
                        prefix="$"
                        mask="#.##"
                        fill-mask="0"
                        reverse-fill-mask
                      />
                    </div>
                    <div>
                      <q-select
                        class="text-capitalize"
                        v-model="gastoSeleccionado.categoriaNombre"
                        :display-value="gastoSeleccionado.categoriaNombre"
                        :options="listaCategorias"
                        :option-label="(item) => item.nombre"
                        :option-value="(item) => item.id"
                        label="Categoria"
                        @update:model-value="
                          (cat) => {
                            gastoSeleccionado.categoriaId = cat.id;
                            gastoSeleccionado.categoriaNombre = cat.nombre;
                            gastoSeleccionado.categoriaIcono = cat.icon;
                          }
                        "
                      >
                        <template v-slot:option="scope">
                          <q-item v-bind="scope.itemProps">
                            <q-item-section avatar>
                              <q-avatar
                                :icon="scope.opt.icon"
                                color="primary"
                                text-color="white"
                                size="md"
                              />
                            </q-item-section>
                            <q-item-section>
                              <q-item-label class="text-capitalize">{{
                                scope.opt.nombre
                              }}</q-item-label>
                            </q-item-section>
                          </q-item>
                        </template>
                      </q-select>
                    </div>
                    <div>
                      <q-input
                        v-model="gastoSeleccionado.descripcion"
                        label="Descripción"
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
                    @click="dialogEdit = false"
                  />
                  <q-btn
                    :disable="gastoSeleccionado.importe.length < 1"
                    flat
                    label="Confirmar"
                    color="primary"
                    v-close-popup
                    @click="modificarGasto()"
                  />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </q-list>
        </div>
      </div>
    </q-slide-transition>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useAuthStore } from "src/stores/AuthStore";
import { date } from "quasar";

//Stores
const store = useAuthStore();

//Visibilidad de los dialogos
const visibleDiv = ref(true);
const dialogDelete = ref(false);
const dialogEdit = ref(false);

//Comportamiento de swipe para alternar entre NUEVO GASTO y LISTA DE GASTOS
const swipe = ({ evt, ...newInfo }) => {
  const info = newInfo;
  if (info.direction == "up") {
    visibleDiv.value = false;
  }
  if (info.direction == "down") {
    visibleDiv.value = true;
  }
};

//Campos MODELS de los componentes de la vista
//Constante que guarda los datos del gasto a editar o eliminar
const gastoSeleccionado = ref("");
//Lista de gastos con datos completos de la categoria
const listGastosCategorias = computed(() => {
  if (!visibleDiv.value) {
    return store.gastosDelMes.map((gasto) => ({
      id: gasto.id,
      fecha: date.formatDate(gasto.fecha.toDate(), "DD/MM/YYYY"),
      importe: gasto.importe,
      descripcion: gasto.descripcion,
      categoriaId: gasto.categoriaId,
      categoriaNombre: nombreCategoriaPorId(gasto.categoriaId),
      categoriaIcono: iconoCategoriaPorId(gasto.categoriaId),
    }));
  } else {
    return null;
  }
});
//Lista de todas las categorias
const listaCategorias = computed(() => {
  return store.categorias;
});
//Constante que guarda la categoria seleccionada para el NUEVO GASTO
const categoria = ref("");
//Importe para el NUEVO GASTO
const importe = ref("");
//Descripción para el NUEVO GASTO
const descripcion = ref("");
//Fecha para el NUEVO GASTO
const fecha = ref(null);
//Fecha actual para mostrar predeterminadamente en NUEVO GASTO
const fechaActual = Date.now();
//Fecha actula formateada para mostrarla correctamente
const fechaformateada = date.formatDate(fechaActual, "DD/MM/YYYY");
//Se asigna al inicio la fecha actual formateada al campo fecha de NUEVO GASTO
fecha.value = fechaformateada;

//Funciones
//Función para asociar el gasto seleccionado y cargar los datos en los dialogos
const seleccionarGasto = (gasto) => {
  gastoSeleccionado.value = { ...gasto };
};
//Función para obtener el nombre de una categoria por su ID
const nombreCategoriaPorId = (id) => {
  const categoria = listaCategorias.value.find((cat) => cat.id === id);
  return categoria.nombre;
};
//Función para obtener el icono de una categoria por su ID
const iconoCategoriaPorId = (id) => {
  const categoria = listaCategorias.value.find((cat) => cat.id === id);
  return categoria.icon;
};
//Función para reiniciar los campos de NUEVO GASTO
const resetGasto = () => {
  importe.value = "";
  categoria.value = "";
  descripcion.value = "";
  fecha.value = fechaformateada;
};
//Función para agregar el gasto nuevo
const agregarGasto = async () => {
  await store.agregarGasto(
    fecha.value,
    importe.value,
    categoria.value.id,
    descripcion.value
  );
  resetGasto();
  store.actualizarGastosDelMes();
};
//Función para eliminar gasto seleccionado
const eliminarGasto = async (id) => {
  await store.eliminarGasto(id);
};
//Función para modificar gasto seleccionado
const modificarGasto = async () => {
  store.modificarGasto(gastoSeleccionado.value);
};

//Array con el formato de fechas para mostrar, en el futuro esto estara en el Store Config
const formatoCalendario = ref({
  monthsShort: [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ],
  months: [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ],
  days: [
    "Domingo",
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
  ],
  daysShort: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
});
</script>
