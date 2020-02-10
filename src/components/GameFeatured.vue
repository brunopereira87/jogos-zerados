<template>
  <div class="featured">
    <h2 class="section_title">Destaques</h2>
    <figure>
      <img
        class="main_image"
        src="../assets/zelda-breath-wild-capa.png"
        alt="Zelda Breath of The Wild Capa"
      />
      <img class="small_image" src="../assets/zelda1.jpg" alt="Zelda Screenshot" />
      <img class="small_image" src="../assets/zelda1.jpg" alt="Zelda Screenshot" />
      <img class="small_image" src="../assets/zelda1.jpg" alt="Zelda Screenshot" />
      <img class="small_image" src="../assets/zelda1.jpg" alt="Zelda Screenshot" />
    </figure>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
figure {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.2);
  //   grid-template-rows: 2fr 1fr 1fr;
  .main_image {
    grid-row: 1/3;
    height: 100%;
    object-fit: cover;
  }
}
</style>
