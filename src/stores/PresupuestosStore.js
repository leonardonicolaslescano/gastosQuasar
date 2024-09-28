import { defineStore } from "pinia";
import { useAuthStore } from "../stores/AuthStore.js";
import { useConfigStore } from "./ConfigStore.js";
import { auth, db } from "boot/configFirebase.js";
import {
  doc,
  collection,
  addDoc,
  getDocs,
  getDoc,
  limit,
  deleteDoc,
  updateDoc,
  setDoc,
  query,
  where,
  Timestamp,
  orderBy,
} from "firebase/firestore";
import { useNotifications } from "../composables/useNotifications";
import { date } from "quasar";
import { ref, computed } from "vue";

export const usePresupuestosStore = defineStore("presupuestosStore", () => {
  const { showError, showSuccess } = useNotifications();
  const userStore = useAuthStore();
  const configStore = useConfigStore();

  const listaActualizada = ref(true);
  const listaActualActualizada = ref(true);
  const presupuestos = ref([]);
  const presupuestoActual = ref({
    activo: false,
  });

  const agregarPresupuesto = async (pFecha, pIngresos, pAsignaciones) => {
    try {
      const mes = pFecha.getMonth();
      const año = pFecha.getFullYear();
      const fechaDesde = new Date(año, mes, 1);
      const fechaHasta = new Date(año, mes + 1, 0);

      const objetoPresupuesto = {
        fecha: pFecha,
        ingresos: pIngresos,
        asignaciones: pAsignaciones,
      };

      const userDocRef = await doc(db, "usuarios", userStore.uId);

      const presupuestosCollection = collection(userDocRef, "presupuestos");

      const q = query(
        presupuestosCollection,
        where("fecha", ">=", fechaDesde),
        where("fecha", "<", fechaHasta)
      );

      const presupuestoDoc = await getDocs(q);
      if (presupuestoDoc.empty) {
        await addDoc(presupuestosCollection, objetoPresupuesto);
        showSuccess("Presupuesto añadido");
      } else {
        const presupuestoAModificarDoc = await doc(
          db,
          presupuestosCollection.path,
          presupuestoDoc.docs[0].id
        );
        await setDoc(presupuestoAModificarDoc, objetoPresupuesto);
        showSuccess("Presupuesto actualizado correctamente");
      }
      await actualizarListaPresupuestos();
      await actualizarPresupuestoActual();
    } catch (error) {
      showError("Error: ", error.message, "Al agregar presupuesto");
    }
  };

  const actualizarPresupuestoActual = async () => {
    try {
      listaActualizada.value = false;
      listaActualActualizada.value = false;
      await userStore.actualizarGastosDelMes();

      const userDocRef = await doc(db, "usuarios", userStore.uId);
      const presupuestosCollection = collection(userDocRef, "presupuestos");

      const fechaActual = new Date();

      //creo una constante con el último día del mes actual
      const fechaActualhasta = new Date(
        fechaActual.getFullYear(),
        fechaActual.getMonth() + 1,
        -1
      );

      //Creo la query para obtener presupuestos igual o anterior al mes corriente, order descendiente, limitado a 1 solo registro
      //Trae el un solo presupuesto, el corriente, y si no existe, el anterior
      const q = query(
        presupuestosCollection,
        where("fecha", "<=", fechaActualhasta),
        orderBy("fecha", "desc"),
        limit(1)
      );

      //Ejecuto la query
      const presupuestoActualDoc = await getDocs(q);

      //en un futuro puedo crear una función ya que esto se repite mas adelante
      if (!presupuestoActualDoc.empty) {
        var auxPresu = presupuestoActualDoc.docs.map((doc) => ({
          mes: configStore.meses[doc.data().fecha.toDate().getMonth()],
          año: doc.data().fecha.toDate().getFullYear(),
          totalIngresos: 0,
          totalGastos: 0,
          editar: false,
          activo: true,
          ...doc.data(),
        }));

        //asigno al objeto presupuesto actual del store, el presupuesto obtenido, posición 0 del array ya que es uno solo
        presupuestoActual.value = auxPresu[0];

        //Recorro la lista de ingresos del presupuesto y sumo importastes para asignarle al campo totalIngresos
        var auxTotalIngresos = 0;
        presupuestoActual.value.ingresos.forEach((ingreso) => {
          auxTotalIngresos = auxTotalIngresos + Number(ingreso.importe);
        });
        presupuestoActual.value.totalIngresos = Number(
          auxTotalIngresos.toFixed(2)
        );

        //Obtengo los gastos del mes corriente ya que corresponden al presupuesto actual, sea de este mes o el último vigente
        //Esto ya fué calculado en store de gastos
        presupuestoActual.value.totalGastos = Number(userStore.totalMesActual);

        let auxAsignaciones = [];
        //Recorro cada asignacion del presupuesto
        presupuestoActual.value.asignaciones.forEach((asignacion) => {
          let auxTotalGastoAsignacion = 0;
          let auxListaGastos = [];
          //recorro cada categoria de la asignacion
          asignacion.categorias.forEach((categoria) => {
            //recorro cada gasto y me fijo si su categoria corresponde a la categoria de la asignacion para sumar el gasto
            userStore.gastosDelMes.forEach((gasto) => {
              if (gasto.categoriaId === categoria.id) {
                auxTotalGastoAsignacion += Number(gasto.importe);
                auxListaGastos.push({
                  fecha: gasto.fecha,
                  importe: gasto.importe,
                  categoriaId: gasto.categoriaId,
                  categoriaNombre: userStore.nombreCategoriaPorId(
                    gasto.categoriaId
                  ),
                  categoriaIcono: userStore.iconoCategoriaPorId(
                    gasto.categoriaId
                  ),
                });
              }
            });
          });
          //agrego a la lista auxiliar de asignaciones para despues reemplazar el array de asignaciones del presupuesto
          auxAsignaciones.push({
            nombre: asignacion.nombre,
            importe: Number(asignacion.importe),
            categorias: asignacion.categorias,
            totalGastos: auxTotalGastoAsignacion.toFixed(2),
            gastos: auxListaGastos.sort((a, b) => {
              return a.fecha - b.fecha;
            }),
          });
        });
        presupuestoActual.value.asignaciones = auxAsignaciones;
      } else {
        presupuestoActual.value = { activo: false };
      }
      listaActualizada.value = true;
      listaActualActualizada.value = true;
    } catch (error) {
      showError("Error: ", error.message, "Al actualizar presupuesto actual");
    }
  };

  const existePresupuestoConCategoria = async (catId) => {
    try {
      var resultado = false;
      const userDocRef = doc(db, "usuarios", userStore.uId);
      const presupuestosCollection = collection(userDocRef, "presupuestos");
      const docsPresupuestos = await getDocs(presupuestosCollection);
      if (!docsPresupuestos.empty) {
        docsPresupuestos.docs.forEach((doc) => {
          doc.data().asignaciones.forEach((asignacion) => {
            asignacion.categorias.forEach((categoria) => {
              if (categoria.id == catId) {
                resultado = true;
              }
            });
          });
        });
      }
      return resultado;
    } catch (error) {
      showError(
        "Error: ",
        error.message,
        "Al validar presupuesto con categoria"
      );
    }
  };

  const actualizarListaPresupuestos = async () => {
    try {
      listaActualizada.value = false;
      await userStore.actualizarGastosDelMes();
      const fechaActual = new Date();
      const fechaDesde = new Date(
        fechaActual.getFullYear(),
        fechaActual.getMonth() + 1,
        0
      );
      const fechaHasta = new Date(fechaActual.getFullYear() + 1, 1, 0);

      const userDocRef = await doc(db, "usuarios", userStore.uId);
      const presupuestosCollection = collection(userDocRef, "presupuestos");

      const q = query(
        presupuestosCollection,
        where("fecha", ">=", fechaDesde),
        where("fecha", "<", fechaHasta)
      );
      const presupuestoDoc = await getDocs(q);

      //creo lista de presupuestos para luego asignar nuevos campos
      var auxPresupuestos = presupuestoDoc.docs.map((doc) => ({
        mes: configStore.meses[doc.data().fecha.toDate().getMonth()],
        año: doc.data().fecha.toDate().getFullYear(),
        totalIngresos: 0,
        totalGastos: 0,
        editar: false,
        ...doc.data(),
      }));

      //recorro la lista de presupuestos para luego asignarle el total de gastosm ingresos y gasto x asignacion
      auxPresupuestos.forEach(async (presupuesto) => {
        var total = 0;
        //sumo el total de ingresos
        presupuesto.ingresos.forEach((ingreso) => {
          total = total + Number(ingreso.importe);
        });
        presupuesto.totalIngresos = Number(total.toFixed(2));
        var auxFechaDesde = new Date(
          fechaActual.getFullYear(),
          presupuesto.fecha.toDate().getMonth(),
          1
        );
        var auxFechaHasta = new Date(
          fechaActual.getFullYear(),
          presupuesto.fecha.toDate().getMonth() + 1,
          0
        );
        //busco una lista de gastos del periodo correspondiente al presupuesto
        let auxGastosPeriodo = await userStore.buscarGastosPorMesAño(
          auxFechaDesde,
          auxFechaHasta
        );
        //sumo el total de gastos del periodo
        auxGastosPeriodo.forEach((gasto) => {
          presupuesto.totalGastos += Number(gasto.importe);
        });
        let auxAsignaciones = [];
        //Recorro cada asignacion del presupuesto
        presupuesto.asignaciones.forEach((asignacion) => {
          let auxTotalGastoAsignacion = 0;
          let auxListaGastos = [];
          //recorro cada categoria de la asignacion
          asignacion.categorias.forEach((categoria) => {
            //recorro cada gasto y me fijo si su categoria corresponde a la categoria de la asignacion para sumar el gasto
            auxGastosPeriodo.forEach((gasto) => {
              if (gasto.categoriaId === categoria.id) {
                auxTotalGastoAsignacion += Number(gasto.importe);
                auxListaGastos.push({
                  fecha: gasto.fecha,
                  importe: gasto.importe,
                  categoriaId: gasto.categoriaId,
                  categoriaNombre: userStore.nombreCategoriaPorId(
                    gasto.categoriaId
                  ),
                  categoriaIcono: userStore.iconoCategoriaPorId(
                    gasto.categoriaId
                  ),
                });
              }
            });
          });
          //agrego a la lista auxiliar de asignaciones para despues reemplazar el array de asignaciones del presupuesto
          auxAsignaciones.push({
            nombre: asignacion.nombre,
            importe: Number(asignacion.importe),
            categorias: asignacion.categorias,
            totalGastos: auxTotalGastoAsignacion.toFixed(2),
            gastos: auxListaGastos.sort((a, b) => {
              return a.fecha - b.fecha;
            }),
          });
        });
        presupuesto.asignaciones = auxAsignaciones;
      });

      presupuestos.value = auxPresupuestos;

      listaActualizada.value = true;

      // presupuestos.value = presupuestoDoc.docs.map((doc) => ({
      //   mes: configStore.meses[doc.data().fecha.toDate().getMonth()].nombre,
      //   año: doc.data().fecha.toDate().getFullYear(),
      //   ...doc.data(),
      // }));
    } catch (error) {
      showError("Error: ", error.message, "Al actualizar lista presupuestos");
    }
  };

  const eliminarPresupuesto = async (pFecha) => {
    try {
      const mes = pFecha.getMonth();
      const año = pFecha.getFullYear();
      const fechaDesde = new Date(año, mes, 1);
      const fechaHasta = new Date(año, mes + 1, 0);

      const userDocRef = await doc(db, "usuarios", userStore.uId);

      const presupuestosCollection = collection(userDocRef, "presupuestos");

      const q = query(
        presupuestosCollection,
        where("fecha", ">=", fechaDesde),
        where("fecha", "<", fechaHasta)
      );

      const presupuestoDoc = await getDocs(q);
      if (!presupuestoDoc.empty) {
        const presupuestoAModificarDoc = await doc(
          db,
          presupuestosCollection.path,
          presupuestoDoc.docs[0].id
        );
        await deleteDoc(presupuestoAModificarDoc);
        await actualizarPresupuestoActual();
        await actualizarListaPresupuestos();
        showSuccess("Presupuesto eliminado correctamente");
      }
    } catch (error) {
      showError("Error: ", error.message, "Al eliminar presupuesto");
    }
  };

  return {
    eliminarPresupuesto,
    listaActualActualizada,
    presupuestoActual,
    agregarPresupuesto,
    presupuestos,
    actualizarListaPresupuestos,
    actualizarPresupuestoActual,
    listaActualizada,
    existePresupuestoConCategoria,
  };
});
