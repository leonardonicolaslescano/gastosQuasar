const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/IndexPage.vue") }],
  },
  {
    path: "/Categorias",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/CategoriasPage.vue"),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: "/Gastos",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/GastosPage.vue"),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: "/AnalisisGastos",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/AnalisisGastosPage.vue"),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: "/Presupuestos",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/PresupuestosPage.vue"),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: "/PresupuestosMobile",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/PresupuestosMobile.vue"),
        meta: { requiresAuth: true },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
