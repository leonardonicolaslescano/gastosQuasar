<template>
  <div class="q-ma-md">
    <!-- FORMULARIO NUEVA CATEGORIA -->
    <div class="column">
      <h5>Nueva Categoria</h5>
      <div class="row q-gutter-xs items-strech">
        <!-- CAMPO ICONO -->
        <div class="col-auto">
          <q-btn
            padding="none 20px "
            @click="dialogIcon = true"
            no-caps
            stretch
            rounded
            stack
            style="height: 100%"
            color="primary"
            unelevated
          >
            <div class="column">
              <div
                class="col text-weight-regular text-white-7 text-caption"
                :style="{ fontSize: '9px' }"
              >
                Icono
              </div>
              <div class="col-8 self-center">
                <q-icon :name="nuevaCategoria.icon" size="sm" />
              </div>
            </div>
          </q-btn>
        </div>
        <!-- CAMPO NOMBRE -->
        <div class="col items-strech">
          <q-input
            class="text-capitalize"
            ref="inputNombreCategoria"
            outlined
            v-model="nuevaCategoria.nombre"
            label="Nombre"
            clearable
            @clear="nuevaCategoria.nombre = ''"
            :rules="[(val) => val.length >= 1]"
            hide-bottom-space
            lazy-rules
            @focus="resetValidation"
          />
        </div>
        <!-- BOTON GUARDAR -->
        <div class="col-auto">
          <q-btn
            :disable="nuevaCategoria.nombre.length < 1"
            color="primary"
            label="Agregar"
            style="height: 100%"
            @click="agregarCategoria()"
          />
        </div>
      </div>
    </div>
    <!-- LISTADO DE CATEGORIAS Y DIALOGOS -->
    <div>
      <!-- LISTADO DE CATEGORIAS -->
      <div class="q-py-md">
        <div class="column">
          <q-list bordered padding class="rounded-borders">
            <q-item-label header>Categorias</q-item-label>
            <q-item
              v-for="(categoria, index) in listCategorias"
              :key="index"
              :data-id="categoria.id"
              clickable
            >
              <!-- Campo Icono -->
              <q-item-section avatar top>
                <q-avatar
                  :icon="categoria.icon"
                  color="primary"
                  text-color="white"
                />
              </q-item-section>
              <!-- Campo nombre -->
              <q-item-section>
                <q-item-label class="text-capitalize">{{
                  categoria.nombre
                }}</q-item-label>
              </q-item-section>

              <q-item-section side>
                <div class="text-grey-8 q-gutter-xs">
                  <q-btn
                    flat
                    dense
                    round
                    icon="mode_edit"
                    @click="
                      seleccionarCategoria(
                        categoria.id,
                        categoria.icon,
                        categoria.nombre
                      ),
                        (confirmEdit = true)
                    "
                  />
                  <q-btn
                    flat
                    dense
                    round
                    icon="delete"
                    @click="
                      seleccionarCategoria(
                        categoria.id,
                        categoria.icon,
                        categoria.nombre
                      ),
                        (confirmDelete = true)
                    "
                  />
                </div>
              </q-item-section>
            </q-item>
          </q-list>
          <q-inner-loading
            :showing="!visible"
            label="Please wait..."
            label-class="text-teal"
            label-style="font-size: 1.1em"
          />
        </div>
      </div>
      <!-- DIALOGO CONFIRMAR DELETE -->
      <q-dialog v-model="confirmDelete" persistent backdrop-filter="blur(4px)">
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar
              icon="report_problem"
              color="primary"
              text-color="white"
            />
            <span class="q-ml-sm text-capitalize"
              >Eliminar {{ categoriaSeleccionada.nombre }} ?</span
            >
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              flat
              label="Cancel"
              color="primary"
              v-close-popup
              @click="resetCategoriaSeleccionada(), (confirmDelete = false)"
            />
            <q-btn
              flat
              label="Confirmar"
              color="primary"
              v-close-popup
              @click="eliminarCategoria()"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- DIALOGO CONFIRMAR EDITAR -->
      <q-dialog v-model="confirmEdit" persistent backdrop-filter="blur(4px)">
        <q-card>
          <q-card-section class="row no-wrap items-center">
            <div class="row no-wrap q-gutter-xs">
              <div class=".col" height="100px">
                <q-btn
                  padding="none 20px "
                  @click="dialogIcon = true"
                  no-caps
                  stretch
                  rounded
                  stack
                  style="height: 100%"
                  color="primary"
                  unelevated
                >
                  <div class="column">
                    <div
                      class="col text-weight-regular text-white-7 text-caption"
                      :style="{ fontSize: '9px' }"
                    >
                      Icono
                    </div>
                    <div class="col-8 self-center">
                      <q-icon :name="categoriaSeleccionada.icon" size="sm" />
                    </div>
                  </div>
                </q-btn>
              </div>
              <div class=".col">
                <q-input
                  class="text-capitalize"
                  outlined
                  v-model="categoriaSeleccionada.nombre"
                  label="Nombre"
                  @clear="categoriaSeleccionada.nombre = ''"
                  :rules="[(val) => val.length >= 1]"
                  hide-bottom-space
                  clearable
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
              @click="resetCategoriaSeleccionada(), (confirmEdit = false)"
            />
            <q-btn
              :disable="categoriaSeleccionada.nombre.length < 1"
              flat
              label="Confirmar"
              color="primary"
              v-close-popup
              @click="modificarCategoria()"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- DIALOGO LISTADO DE ICONOS -->
      <q-dialog v-model="dialogIcon" backdrop-filter="blur(4px)">
        <q-card class="q-pa-none" style="width: 480px; max-width: 83vw">
          <q-card-section class="row q-pt-sm q-pb-none q-pl-lg">
            <div class="text-subtitle1">Elige un icono</div>
            <q-space />
            <div>
              <q-btn size="sm" icon="close" flat round dense v-close-popup />
            </div>
          </q-card-section>
          <q-card-section class="row q-px-md q-py-sm justify-center">
            <q-item
              v-for="icon in icons"
              :key="icon.icon"
              clickable
              class="q-pa-sm"
              @click="seleccionarIcono(icon.icon)"
              v-close-popup
              ><q-avatar
                size="lg"
                color="primary"
                text-color="white"
                :icon="icon.icon"
            /></q-item>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from "vue";

//A futuro, se cambiará la forma de usar el store según PINIA
const store = inject("store");

//Visibilidad de los dialog
const confirmDelete = ref(false);
const confirmEdit = ref(false);
const dialogIcon = ref(false);

//MODELS asociados a los campos de la vista

//Nombre de categoria para el formulario NUEVA CATEGORIA
const inputNombreCategoria = ref(null);
//Variable que verifica si la lista de categorias terminó de actualizarse, se usa para mostrar un loading
const visible = computed(() => {
  return store.listaCategoriaCargada;
});
//Lista de todas las categorias
const listCategorias = computed(() => {
  return store.categorias;
});
//Categoria seleccionada para editar o eliminar
const categoriaSeleccionada = ref({
  id: "",
  icon: "",
  nombre: "",
});
//Datos de la nueva categoria
const nuevaCategoria = ref({
  icon: "home",
  nombre: "",
});

//Funciones

//Reinicia el validador del Nombre de categoria
const resetValidation = () => {
  inputNombreCategoria.value.resetValidation();
};
//Asocia el icono elegido al campo icono de nueva categoria o al edit
const seleccionarIcono = (icon) => {
  //Al seleccionar un icono del dialogIcon, se asigna tanto para nueva como seleccionada ya que se usa el mismo dialog
  nuevaCategoria.value.icon = icon;
  categoriaSeleccionada.value.icon = icon;
};
//Asocia los campos de la categoria seleccionada al objeto categoriaSeleccionada para los dialogos
const seleccionarCategoria = (id, icon, nombre) => {
  //Al seleccionar modificar o eliminar categoria, se asigan sus datos
  categoriaSeleccionada.value.id = id;
  categoriaSeleccionada.value.icon = icon;
  categoriaSeleccionada.value.nombre = nombre;
};
//Reinicia el objeto categoriaSeleccionada
const resetCategoriaSeleccionada = () => {
  //Luego de realizar acciones sobre una categoria de la lista, se resetean datos, tambien en nueva Icon ya que usan mismo dialog
  categoriaSeleccionada.value.id = "";
  categoriaSeleccionada.value.icon = "";
  categoriaSeleccionada.value.nombre = "";
  nuevaCategoria.value.icon = "home";
};
//Función para agregar categoria nueva
const agregarCategoria = async () => {
  //Agregar categoria en store y resetear datos
  await store.agregarCategoria(
    nuevaCategoria.value.icon,
    nuevaCategoria.value.nombre.toLowerCase()
  );
  nuevaCategoria.value.nombre = "";
  nuevaCategoria.value.icon = "home";
};
//Función para eliminar categoria seleccionada
const eliminarCategoria = async () => {
  //Eliminar categoria del store
  store.eliminarCategoria(categoriaSeleccionada.value.id);
};
//Función para modificar categoria seleccionada
const modificarCategoria = async () => {
  //Modificar categoria del store y reseteo de sus datos
  await store.modificarCategoria(
    categoriaSeleccionada.value.id,
    categoriaSeleccionada.value.icon,
    categoriaSeleccionada.value.nombre.toLowerCase()
  );
  resetCategoriaSeleccionada();
};

//A futuro se deberán tomar estos datos de un store
const icons = [
  {
    icon: "home",
  },
  {
    icon: "shopping_cart",
  },
  {
    icon: "favorite",
  },
  {
    icon: "description",
  },
  {
    icon: "event",
  },
  {
    icon: "perm_identity",
  },
  {
    icon: "pets",
  },
  {
    icon: "store",
  },
  {
    icon: "work_outline",
  },
  {
    icon: "flight_takeoff",
  },
  {
    icon: "commute",
  },
  {
    icon: "payments",
  },
  {
    icon: "people_alt",
  },
  {
    icon: "domain",
  },
  {
    icon: "palette",
  },
  {
    icon: "currency_bitcoin",
  },
  {
    icon: "phone_enabled",
  },
  {
    icon: "handyman",
  },
  {
    icon: "restaurant",
  },
  {
    icon: "directions_car",
  },
  {
    icon: "lunch_dining",
  },
  {
    icon: "local_hospital",
  },
  {
    icon: "restaurant_menu",
  },
  {
    icon: "local_activity",
  },
  {
    icon: "local_bar",
  },
  {
    icon: "liquor",
  },
  {
    icon: "local_taxi",
  },
  {
    icon: "check_box",
  },
  {
    icon: "warning",
  },
  {
    icon: "power",
  },
  {
    icon: "attach_money",
  },
  {
    icon: "insert_emoticon",
  },
  {
    icon: "phone_iphone",
  },
  {
    icon: "child_friendly",
  },
  {
    icon: "smoking_rooms",
  },
  {
    icon: "chair",
  },
  {
    icon: "blender",
  },
];
</script>
