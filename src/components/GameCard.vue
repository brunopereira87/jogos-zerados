<template>
  <div class="game-card">
    <router-link :to="{ name: 'single-game', params: { slug: game.slug } }">
      <figure>
        <img :src="`http://localhost:3000/${artbox}`" :alt="game.name" />
      </figure>

      <p class="title">{{ game.name }}</p>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "GameCard",
  props: ["game"],
  computed: {
    artbox() {
      return this.game.artbox.replace("api\\uploads\\", "/");
    }
  }
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
    height: 50px;
    text-align: center;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  img {
    width: 100%;
    height: 230px;
    object-fit: cover;
  }
}
</style>
