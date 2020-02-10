<template>
  <div class="game-card">
    <router-link :to="{name:'single-game',params:{slug:'zelda-botw'}}">
      <figure>
        <img src="../assets/zelda_box_art.jpg" alt="Capa do Jogo" />
      </figure>

      <p class="title">The Legend of Zelda: Breath of The Wild</p>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "GameCard"
};
</script>

<style lang="scss" scoped>
.game-card {
  width: 200px;
  box-shadow: $shadow_default;
  margin-bottom: 30px;
  .title {
    font-size: 1rem;
    margin-top: -4px;
    @include bgcolor("primary");
    @include textcolor("light");
    padding: 5px 10px;
  }
}
</style>