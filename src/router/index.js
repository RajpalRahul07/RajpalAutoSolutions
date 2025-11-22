import { createRouter, createWebHashHistory } from "vue-router";
// import HomeView from "../views/HomeView.vue";
// // "lint": "vue-cli-service lint"
const routes = [
  {
    path: "/",
    name: "home",
    // component: HomeView,
    component: () =>
      import(/* webpackChunkName: "home" */ "../components/VehiclePage.vue"),
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../components/VehicleServices.vue"),
  },
  {
    path: "/vehicle",
    name: "vehicle",
    component: () =>
      import(/* webpackChunkName: "vehicle" */ "../views/AboutView.vue"),
  },
   {
    path: "/history",
    name: "history",
    component: () =>
      import(/* webpackChunkName: "vehicle" */ "../components/ServiceHistory.vue"),
  },
  {
    path: "/Sale",
    name: "Sale",
    component: () =>
      import(/* webpackChunkName: "vehicle" */ "../components/VehicleSale.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
