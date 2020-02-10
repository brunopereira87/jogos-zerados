import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Games from "../views/Games.vue";
import Plataforms from "../views/Plataforms.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/jogos",
    name: "games",
    component: Games,
    props: true,
    children: [
      {
        path: "/:slug",
        name: "single-game",
        props: true
      }
    ]
  },
  {
    path: "/plataformas",
    name: "plataforms",
    component: Plataforms
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
