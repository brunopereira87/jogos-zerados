<template>
  <section class="register-game">
    <h2 class="section_title">Novo Jogo</h2>
    <GameForm>
      <div class="form-btn">
        <button class="btn btn-submit" type="input" @click.prevent="registerGame">Cadastrar</button>
      </div>
    </GameForm>
  </section>
</template>

<script>
import GameForm from "@/components/GameForm.vue";
//import {api} from "@/services"
export default {
  name: "GameRegister",
  components: {
    GameForm
  },
  methods: {
    registerGame() {
      console.log(this.formatGame());
    },
    formatGame() {
      const form = new FormData();
      const artbox = this.game.artbox;
      const screenshots = this.game.screenshots;

      console.log(this.game);
      console.log(artbox);
      console.log(screenshots);
      form.append("artbox", artbox);
      for (let i = 0; i < screenshots.length; i++) {
        form.append("screenshots[]", screenshots[i]);
      }

      form.append("name", this.game.name);
      form.append("plataform", this.game.plataform);
      form.append("publisher", this.game.publisher);
      form.append("release_date", this.game.release_date);
      form.append("metacritic", this.game.metacritic);
      form.append("developer", this.game.developer);
      form.append("video", this.game.video);
      form.append("styles", this.game.styles);
      console.log(form);
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
