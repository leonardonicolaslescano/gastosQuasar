<template>
  <q-item
    v-for="(linkItem, index) in links"
    :key="index"
    clickable
    @click="hacia(linkItem.url)"
    class="text-white"
    separator
  >
    <q-item-section v-if="link.icon" avatar>
      <q-avatar :icon="linkItem.icon" size="60px" />
    </q-item-section>

    <q-item-section>
      <q-item-label class="text-subtitle1">{{ linkItem.title }}</q-item-label>
      <q-item-label caption class="text-white">{{
        linkItem.caption
      }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const links = [];
const link = {
  title: "Categorias",
  caption: "Administre sus categorias",
  icon: "home",
  url: "/Categorias",
};
// links.push(link);
links.push(
  {
    title: "Gastos",
    caption: "Registre sus gastos",
    icon: "paid",
    url: "/Gastos",
  },
  {
    title: "Categorias",
    caption: "Administre sus categorias",
    icon: "label",
    url: "/Categorias",
  },

  {
    title: "Analisis Gastos",
    caption: "Listado de todos los gastos",
    icon: "list_alt",
    url: "/AnalisisGastos",
  },
  {
    title: "Presupuestos",
    caption: "Asignación de presupuestos",
    icon: "tune",
    url: "/Presupuestos",
  },
  {
    title: "Presupuestos 2",
    caption: "Asignación de presupuestos",
    icon: "tune",
    url: "/PresupuestosMobile",
  }
);

const hacia = (url) => {
  router.push(url);
};
</script>
