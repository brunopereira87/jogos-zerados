<template>
  <section class="home">
    <GameFeatured />
    <section class="games-list most-played">
      <h2 class="title">Mais jogados no momento</h2>
      <GameCard />
      <GameCard />
      <GameCard />
      <GameCard />
      <GameCard />
      <GameCard />
      <GameCard />
      <GameCard />
      <GameCard />
      <GameCard />
    </section>
    <section class="games-list most-rated">
      <h2 class="title">Mais bem avaliados</h2>
      <GameCard />
      <GameCard />
      <GameCard />
      <GameCard />
      <GameCard />
      <GameCard />
      <GameCard />
      <GameCard />
      <GameCard />
      <GameCard />
    </section>
  </section>
</template>

<script>
// @ is an alias to /src
import GameFeatured from "@/components/GameFeatured";
import GameCard from "@/components/GameCard";
export default {
  name: "home",
  components: {
    GameFeatured,
    GameCard
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
  &.most-rated {
    margin-top: 30px;
  }
}
</style>
