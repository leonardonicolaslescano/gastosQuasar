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

  const icons = [
    "home",
    "shopping_cart",
    "favorite",
    "description",
    "event",
    "perm_identity",
    "pets",
    "store",
    "work_outline",
    "flight_takeoff",
    "commute",
    "payments",
    "people_alt",
    "domain",
    "palette",
    "currency_bitcoin",
    "phone_enabled",
    "handyman",
    "restaurant",
    "directions_car",
    "lunch_dining",
    "local_hospital",
    "restaurant_menu",
    "local_activity",
    "local_bar",
    "liquor",
    "local_taxi",
    "check_box",
    "warning",
    "power",
    "attach_money",
    "insert_emoticon",
    "phone_iphone",
    "child_friendly",
    "smoking_rooms",
    "chair",
    "blender",
  ];

  return { meses, icons };
});
