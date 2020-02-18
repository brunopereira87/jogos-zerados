<template>
  <footer>
    <div class="resources">
      <a href="http://www.onlinewebfonts.com">oNline Web Fonts</a>
    </div>
    <p class="copyright">2020 - Todos os direitos reservados</p>
  </footer>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
footer {
  @include bgcolor("primary");
  @include textcolor("light");
  padding: 15px 0;
  a {
    @include textcolor("light");
    &:hover {
      text-decoration: underline;
    }
  }
  text-align: center;
}
</style>
