import { defineStore } from "pinia";
import { auth, db } from "boot/configFirebase.js";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  doc,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  setDoc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { useRouter } from "vue-router";
import { ref, computed } from "vue";
import { useNotifications } from "../composables/useNotifications";
import { usePresupuestosStore } from "./PresupuestosStore";
import { date } from "quasar";

export const useAuthStore = defineStore("authStore", () => {
  const { showError, showSuccess } = useNotifications();
  const presupuestoStore = usePresupuestosStore();

  const router = useRouter();

  //Datos de usuario en store
  const isLoggedIn = ref(false);
  const uId = ref("");
  const userEmail = ref("Desconectado");

  //Categorias, después veo si migro esto a store aparte
  const categorias = ref([]);

  //Para saber cuando la lista de categoria este cargada
  const listaCategoriaCargada = ref(false);

  //Chequea cuando hay cambios en logueo
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      userEmail.value = user.email;
      uId.value = user.uid;
      isLoggedIn.value = true;
      await actualizarListaCategorias();
      await actualizarGastosDelMes();
      await presupuestoStore.actualizarPresupuestoActual();
    }
  });

  //Actualizar categorias del usuario en el store
  const actualizarListaCategorias = async () => {
    try {
      const userDocRef = await doc(db, "usuarios", uId.value);
      const categoriasCollection = await collection(userDocRef, "categorias");
      const categoriasDocs = await getDocs(categoriasCollection);

      listaCategoriaCargada.value = false; // Esta por verse si lo uso para mostrar un cargando...

      categorias.value = await categoriasDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      listaCategoriaCargada.value = true; // Esta por verse si lo uso para mostrar un cargando...
    } catch (error) {
      showError(
        "Error al obtener categorias: ",
        error.message,
        "Actulizar Categorias en Store"
      );
    }
  };

  //Agregar nueva categoria
  const agregarCategoria = async (iconCat, nombreCat) => {
    try {
      listaCategoriaCargada.value = false;
      const obtejoCategoria = {
        icon: iconCat,
        nombre: nombreCat,
      };
      const categoriasCollection = collection(
        db,
        "usuarios",
        uId.value,
        "categorias"
      );
      const q = query(categoriasCollection, where("nombre", "==", nombreCat));
      const categoriaDoc = await getDocs(q);
      if (categoriaDoc.empty) {
        await addDoc(categoriasCollection, obtejoCategoria);
        showSuccess("Categoria añadida");
        await actualizarListaCategorias();
      } else {
        showError(
          "Error: ",
          "Ya existe esta categoria",
          "Al agregar categoria"
        );
      }

      listaCategoriaCargada.value = true;
    } catch (error) {
      showError(
        "Error al agregar categoria: ",
        error.message,
        "Func. agregarCat en store"
      );
    }
  };
  //Eliminar Categoria
  const eliminarCategoria = async (catId) => {
    try {
      const userDocRef = await doc(db, "usuarios", uId.value);
      const gastoCollection = await collection(userDocRef, "Gastos");
      const q = query(gastoCollection, where("categoriaId", "==", catId));
      const gastosDoc = await getDocs(q);
      if (gastosDoc.empty) {
        var existePresupuestoAsociado =
          await presupuestoStore.existePresupuestoConCategoria(catId);
        if (existePresupuestoAsociado) {
          showError(
            "Error: ",
            "No se puede eliminar categoria si hay presupuestos asociados",
            "Al eliminar cat en Store"
          );
        } else {
          const categoriasCollection = await collection(
            userDocRef,
            "categorias"
          );
          await deleteDoc(doc(db, categoriasCollection.path, catId));
          showSuccess("Categoria eliminada");
          await actualizarListaCategorias();
        }
      } else {
        showError(
          "Error: ",
          "No se puede eliminar categoria si hay gastos asociados",
          "Al eliminar cat en Store"
        );
      }
    } catch (error) {
      showError("Error: ", error.message, "Eliminar cat en store");
    }
  };
  //Modificar categoria
  const modificarCategoria = async (catId, iconCat, nombreCat) => {
    try {
      const userDocRef = await doc(db, "usuarios", uId.value);
      const categoriasCollection = await collection(userDocRef, "categorias");

      const updateCategoriaEnBD = async () => {
        const categoriaDocRef = await doc(db, categoriasCollection.path, catId);
        await updateDoc(categoriaDocRef, {
          icon: iconCat,
          nombre: nombreCat,
        });
        await actualizarListaCategorias();
        showSuccess("Categoria modificada");
      };

      listaCategoriaCargada.value = false;

      categorias.value.forEach(async (categoria) => {
        if (categoria.id == catId) {
          if (categoria.nombre != nombreCat) {
            const q = query(
              categoriasCollection,
              where("nombre", "==", nombreCat)
            );
            const categoriaDoc = await getDocs(q);
            if (!categoriaDoc.empty) {
              showError(
                "Error: ",
                "Ya existe una categoria con el nombre: " + nombreCat,
                "Al agregar categoria"
              );
            } else {
              updateCategoriaEnBD();
            }
          } else {
            updateCategoriaEnBD();
          }
        }
      });
      listaCategoriaCargada.value = true;
    } catch (error) {
      showError("Error: ", error.message, "modificar categoria en store");
    }
  };

  //Funciones de gastos
  const agregarGasto = async (pFecha, pImporte, pCategoriaId, pDescripcion) => {
    try {
      const fechaformateada = date.extractDate(pFecha, "DD/MM/YYYY");
      const objetoGasto = {
        fecha: Timestamp.fromDate(fechaformateada),
        importe: pImporte,
        categoriaId: pCategoriaId,
        descripcion: pDescripcion,
      };
      const gastosCollection = collection(db, "usuarios", uId.value, "Gastos");
      await addDoc(gastosCollection, objetoGasto);
      await presupuestoStore.actualizarPresupuestoActual();
      showSuccess("Gasto añadido");
    } catch (error) {
      showError(
        "Error al agregar Gasto: ",
        error.message,
        "Func. agregarGasto en store"
      );
    }
  };
  const eliminarGasto = async (pId) => {
    try {
      const userDocRef = await doc(db, "usuarios", uId.value);
      const gastosCollection = await collection(userDocRef, "Gastos");
      await deleteDoc(doc(db, gastosCollection.path, pId));
      showSuccess("Gasto eliminado");
      await actualizarGastosDelMes();
      await presupuestoStore.actualizarPresupuestoActual();
    } catch (error) {
      showError("Error: ", error.message, "Eliminar gasto en store");
    }
  };
  const modificarGasto = async (gastoModificado) => {
    try {
      const fechaformateada = date.extractDate(
        gastoModificado.fecha,
        "DD/MM/YYYY"
      );
      const userDocRef = await doc(db, "usuarios", uId.value);
      const gastoCollection = await collection(userDocRef, "Gastos");
      const gastoDocRef = await doc(
        db,
        gastoCollection.path,
        gastoModificado.id
      );
      await updateDoc(gastoDocRef, {
        importe: gastoModificado.importe,
        fecha: Timestamp.fromDate(fechaformateada),
        categoriaId: gastoModificado.categoriaId,
        descripcion: gastoModificado.descripcion,
      });
      await actualizarGastosDelMes();
      await presupuestoStore.actualizarPresupuestoActual();
      showSuccess("Gasto modificada");
    } catch (error) {
      showError("Error: ", error.message, "modificar Gasto en store");
    }
  };

  const totalMesActual = ref("0.00");
  const gastosDelMes = ref([]);
  const mesActual = ref("");
  const mesesArray = [
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
  ];

  const actualizarGastosDelMes = async () => {
    try {
      const userDocRef = await doc(db, "usuarios", uId.value);
      const gastosCollection = await collection(userDocRef, "Gastos");

      // Obtener la fecha actual
      const fechaActual = new Date();
      const añoActual = fechaActual.getFullYear();
      const MesActual = fechaActual.getMonth() + 1; // Los meses en JavaScript son de 0 a 11
      mesActual.value = mesesArray[MesActual - 1];

      // Crear fechas de inicio y fin del mes actual
      const fechaInicio = new Date(añoActual, MesActual - 1, 1);
      const fechaFin = new Date(añoActual, MesActual, 0); //

      const q = query(
        gastosCollection,
        where("fecha", ">=", fechaInicio),
        where("fecha", "<=", fechaFin)
      );
      const gastosDocs = await getDocs(q);
      gastosDelMes.value = await gastosDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      var cuentaAux = 0;
      gastosDelMes.value.forEach((elemento) => {
        cuentaAux += Number(elemento.importe);
      });

      totalMesActual.value = cuentaAux.toFixed(2);
    } catch (error) {
      showError(
        "Error al obtener Gastos: ",
        error.message,
        "Actulizar Gastos en Store"
      );
    }
  };

  //Funciones de busqueda
  // const buscarGastosPorMesAño = async (fechaDesde) => {
  //   try {
  //     const userDocRef = await doc(db, "usuarios", uId.value);
  //     const gastosCollection = await collection(userDocRef, "Gastos");

  //     // Obtener la fecha desde
  //     const añoActual = fechaDesde.getFullYear();
  //     const MesActual = fechaDesde.getMonth() + 1; // Los meses en JavaScript son de 0 a 11

  //     // Crear fechas de inicio y fin del mes desde
  //     const fechaInicio = new Date(añoActual, MesActual - 1, 1);
  //     const fechaFin = new Date(añoActual, MesActual, 0); //

  //     const q = query(
  //       gastosCollection,
  //       where("fecha", ">=", fechaInicio),
  //       where("fecha", "<=", fechaFin)
  //     );
  //     const gastosDocs = await getDocs(q);
  //     const listaObtenida = await gastosDocs.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  //     return listaObtenida;
  //   } catch (error) {
  //     showError(
  //       "Error al obtener Lista de Gastos: ",
  //       error.message,
  //       "Obtener lista de Gastos en Store"
  //     );
  //   }
  // };
  const buscarGastosPorMesAño = async (fechaDesde, fechaHasta) => {
    try {
      const userDocRef = await doc(db, "usuarios", uId.value);
      const gastosCollection = await collection(userDocRef, "Gastos");

      const q = query(
        gastosCollection,
        where("fecha", ">=", fechaDesde),
        where("fecha", "<=", fechaHasta)
      );
      const gastosDocs = await getDocs(q);
      const listaObtenida = await gastosDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return listaObtenida;
    } catch (error) {
      showError(
        "Error al obtener Lista de Gastos: ",
        error.message,
        "Obtener lista de Gastos en Store"
      );
    }
  };

  //Funciones referida a la autentificación
  //Logueo
  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        uId.value = user.uid;
        userEmail.value = user.email;
        isLoggedIn.value = true;
        showSuccess("Bienvenido " + user.email);
        router.push("/Gastos");
      })
      .catch((error) => {
        if (error.code == "auth/invalid-credential") {
          showError("Error: ", "Credenciales inválidas", "Login en store");
        } else {
          showError("Error: ", error.message, "Login en store");
        }
      });
  };

  //Registro
  const register = async (email, password) => {
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        uId.value = user.uid;
        userEmail.value = user.email;
        isLoggedIn.value = true;
        showSuccess("Bienvenido " + user.email);
        router.push("/Categorias");
      })
      .catch((error) => {
        if (error.code == "auth/email-already-in-use") {
          showError("Error: ", "El email ya esta en uso", "Registro en store");
        } else {
          showError("Error: ", error.message, "Registro en store");
        }
      });
  };

  //Deslogueo
  const logOut = async () => {
    signOut(auth);
    showSuccess("Sesión finalizada");
    categorias.value = [];
    listaCategoriaCargada.value = false;
    isLoggedIn.value = false;
    uId.value = "";
    userEmail.value = "Desconectado";
    presupuestoStore.presupuestoActual = [];
    router.push("/");
  };
  //Finaliza lo referido a la autentificación

  ///prueba
  const pruebaValidacionFirebase = async () => {
    try {
      const userDocRef = await doc(db, "usuarios", uId.value);
      const gastosCollection = await collection(userDocRef, "categorias");

      const gastosDocs = await getDocs(gastosCollection);
      const listaObtenida = await gastosDocs.docs.map((doc) => ({
        ...doc.data(),
      }));
    } catch (error) {
      showError(
        "Error al obtener Lista de Gastos: ",
        error.message,
        "Obtener lista de Gastos en Store"
      );
    }
  };

  return {
    pruebaValidacionFirebase,
    isLoggedIn,
    uId,
    userEmail,
    // handleAuthStateChanged,
    login,
    register,
    logOut,
    agregarCategoria,
    actualizarListaCategorias,
    categorias,
    // usuario,
    listaCategoriaCargada,
    eliminarCategoria,
    modificarCategoria,
    agregarGasto,
    actualizarGastosDelMes,
    totalMesActual,
    mesActual,
    mesesArray,
    gastosDelMes,
    eliminarGasto,
    modificarGasto,
    buscarGastosPorMesAño,
  };
});
