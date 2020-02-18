import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Games from "../views/Games.vue";
import GameSingle from "../views/GameSingle.vue";
import GameRegister from "../views/GameRegister.vue";
import Plataforms from "../views/Plataforms.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/jogos/:slug",
    name: "games",
    component: Games,
    props: true
  },
  {
    path: "jogo/:id/:slug",
    name: "single-game",
    component: GameSingle,
    props: true
  },
  {
    path: "/jogos/cadastrar",
    name: "register-game",
    component: GameRegister
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
