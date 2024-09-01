import { defineStore } from "pinia";
import { ref } from "vue";
import { isUsuarioLogueado } from "boot/firebase";

export const useUserLoggedStore = defineStore("users", () => {
  const emailLogged = ref("Desconectado");
  const uIdLogged = ref("");

  const loginUser = (email, uId) => {
    emailLogged.value = email;
    uIdLogged.value = uId;
  };
  const logoutUser = () => {
    emailLogged.value = "Desconectado";
    uIdLogged.value = "";
  };

  const isAutentificated = () => {
    return isUsuarioLogueado();
  };

  return { emailLogged, uIdLogged, loginUser, logoutUser, isAutentificated };
});
