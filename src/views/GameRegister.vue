<template>
  <section class="register-game">
    <h2 class="section_title">Novo Jogo</h2>
    <SuccessMessage />
    <GameForm>
      <div class="form-btn">
        <button
          class="btn btn-submit"
          type="input"
          @click.prevent="registerGame"
        >
          Cadastrar
        </button>
      </div>
    </GameForm>
  </section>
</template>

<script>
import GameForm from "@/components/GameForm.vue";
import SuccessMessage from "@/components/SuccessMessage.vue";
import { api } from "@/services";
export default {
  name: "GameRegister",
  components: {
    GameForm,
    SuccessMessage
  },
  data() {
    return {
      success: ""
    };
  },
  methods: {
    async registerGame() {
      const game = await this.formatGame();

      api.post("/games", game).then(response => {
        if (response.data.status === 'success') {
          this.$store.commit("UPDATE_SUCCESS", response.data.message);
          this.$store.commit("UPDATE_GAME", {
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
          });
        }
      });
    },
    formatGame() {
      const form = new FormData();
      const artbox = this.game.artbox;

      const screenshots = this.game.screenshots;

      form.append("artbox", artbox);
      if (screenshots) {
        for (let i = 0; i < screenshots.length; i++) {
          form.append("screenshots", screenshots[i]);
        }
      }

      form.append("name", this.game.name);
      form.append("plataform", this.game.plataform);
      form.append("publisher", this.game.publisher);
      form.append("release_date", this.game.release_date);
      form.append("metacritic", this.game.metacritic);
      form.append("developer", this.game.developer);
      form.append("video", this.game.video);
      form.append("styles", this.game.styles);

      console.log(form.getAll("name"));
      return form;
    }
  },
  computed: {
    game() {
      return this.$store.state.game;
    }
  }
};
</script>

<style lang="scss" scoped></style>
