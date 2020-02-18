<template>
  <div class="games-list" v-if="games.length > 0">
    <GameCard v-for="game in games" :key="game._id" :game="game" />
  </div>
</template>

<script>
import GameCard from "@/components/GameCard";
export default {
  name: "GamesList",
  props: ["games"],
  components: {
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
}
</style>