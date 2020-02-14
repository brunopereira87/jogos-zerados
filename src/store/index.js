import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    game: {
      name: "",
      plataform: "",
      developer: "",
      publisher: "",
      styles: "",
      artbox: null,
      screenshots: null,
      video: "",
      release_date: "",
      metacritic: null
    }
  },
  mutations: {
    UPDATE_GAME(state, payload) {
      state.game = Object.assign(state.game, payload);
    }
  },
  actions: {},
  modules: {}
});
