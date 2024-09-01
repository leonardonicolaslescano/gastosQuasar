<template>
  <div class="q-px-xl">
    <h4>{{ login ? "Inicie sesión" : "Nuevo Usuario" }}</h4>
    <q-form class="q-gutter-md" @submit.prevent="ProcesarFormulario">
      <q-input label="Email" v-model="email" type="email" />
      <q-input label="Password" v-model="password" type="password" />
      <q-btn
        :label="login ? 'Login' : 'Registro'"
        type="submit"
        color="primary"
        :disable="email.length < 1 || password.length < 1"
      />
      <q-btn color="primary" outline v-if="!login" @click="login = true"
        >¿Ya tienes cuenta?</q-btn
      >
      <q-btn color="negative" outline v-else @click="login = false"
        >¿No tienes cuenta?</q-btn
      >
    </q-form>
  </div>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="dialog" :position="position">
      <q-card style="width: 350px">
        <q-card-section class="row items-center no-wrap">
          <div>
            <div class="text-weight-bold">{{ errorDialog }}</div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, inject } from "vue";
import { createUser, loginUser } from "boot/firebase";

import { useUserLoggedStore } from "src/stores/UsuariosStore";
import { storeToRefs } from "pinia";
import { useNotifications } from "../composables/useNotifications";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

export default {
  setup() {
    const { showError } = useNotifications();
    // const store = useUserLoggedStore();
    const store = inject("store");
    // const { emailLogged } = storeToRefs(store);
    // const { userEmail } = storeToRefs(store);
    // const storePrueba = ref("inicio");
    const router = useRouter();
    const $q = useQuasar();

    const email = ref("");
    const password = ref("");
    const errorDialog = ref("");
    const login = ref(true);

    // const mostrarStore = () => {
    //   // storePrueba.value = store.emailLogged;
    //   storePrueba.value = store.userEmail;
    // };

    const ProcesarFormulario = async () => {
      if (!email.value.trim() || !password.value.trim()) {
        errorDialog.value = "Debe completar los campos correctamente";
        showError(
          "",
          "Debe completar todos los campos",
          "Al confirmar Login o Registro"
        );
        open();
      } else {
        try {
          if (!login.value) {
            await store.register(email.value, password.value);
            email.value = "";
            password.value = "";
          } else {
            await store.login(email.value, password.value);
            email.value = "";
            password.value = "";
          }
        } catch (error) {
          showError(
            "Error: ",
            error.message,
            "Al procesar formulario de Login/Registro"
          );
        }
      }
    };
    const dialog = ref(false);
    const position = ref("top");

    const open = (pos) => {
      position.value = pos;
      dialog.value = true;
    };

    return {
      email,
      password,
      dialog,
      position,
      errorDialog,
      login,
      ProcesarFormulario,
      // mostrarStore,
      // storePrueba,
    };
  },
};
</script>
