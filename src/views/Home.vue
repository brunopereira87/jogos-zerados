<template>
  <section class="home">
    <GameFeatured />
    <section class="most-played">
      <h2 class="title">Mais jogados no momento</h2>
      <div class="games-list" v-if="games.length > 0">
        <GameCard v-for="game in games" :key="game._id" :game="game" />
      </div>
    </section>
    <section class="most-rated">
      <h2 class="title">Mais bem avaliados</h2>
      <div class="games-list" v-if="games.length > 0">
        <GameCard v-for="game in games" :key="game._id" :game="game" />
      </div>
    </section>
  </section>
</template>

<script>
// @ is an alias to /src
import GameFeatured from "@/components/GameFeatured";
import GameCard from "@/components/GameCard";
import { api } from "@/services";
export default {
  name: "home",
  components: {
    GameFeatured,
    GameCard
  },
  data() {
    return {
      games: []
    };
  },
  methods: {
    async getGames() {
      try {
        const response = await api.get("/games");
        this.games = response.data.games;
        console.log("GAmes:", response.data);
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
.games-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  justify-content: space-between;
  margin-top: $section_margin;

  .title {
    grid-column: 1 / -1;
    @include textcolor("light");
    text-align: left;
    margin-bottom: $title_margin;
  }
}
.most-rated {
  margin-top: 30px;
}
</style>
