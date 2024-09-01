import { defineStore } from "pinia";
import { date } from "quasar";

export const useConfigStore = defineStore("configStore", () => {
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

  return { meses };
});
