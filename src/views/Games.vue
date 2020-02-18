<template>
  <section class="games">
    <section class="most-played">
      <h2 class="title">Mais jogados no momento</h2>
      <GamesList :games="games" />
    </section>
    <section class="most-rated">
      <h2 class="title">Mais bem avaliados</h2>
      <GamesList :games="games" />
    </section>
  </section>
</template>

<script>
import GamesList from "@/components/GamesList";
import { api } from "@/services";
export default {
  name: "Games",
  props: ["slug"],
  components: {
    GamesList
  },
  data() {
    return {
      games: []
    };
  },
  methods: {
    async getGames() {
      try {
        const plataform_response = await api.get(`/plataforms/${this.slug}`);
        const plataform = plataform_response.data.plataform;

        const response = await api.get(`/games?plataform=${plataform._id}`);
        this.games = response.data.games;
      } catch (error) {
        console.log(error);
      }
    }
  },

  created() {
    this.getGames();
  }
};
</script>

<style lang="scss" scoped>
.games {
  margin: $section_margin;
}
.title {
  grid-column: 1 / -1;
  @include textcolor("light");
  text-align: left;
  margin-bottom: $title_margin;
}
</style>
