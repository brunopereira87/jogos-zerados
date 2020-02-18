<template>
  <header>
    <div class="container">
      <router-link to="/">
        <h1>
          <img src="../assets/logo-white.svg" alt="Logo" />
        </h1>
      </router-link>

      <nav id="nav">
        <ul class="nav-menu">
          <li>
            <router-link :to="{ name: 'games', params: { slug: 'nintendo-switch' } }">Switch</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'games', params: { slug: 'playstation-4' } }">PS4</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'games', params: { slug: 'xbox-one' } }">Xbox One</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'games', params: { slug: 'pc' } }">PC</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'games', params: { slug: 'stadia' } }">Stadia</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'games', params: { slug: '3ds' } }">3DS</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'plataforms' }">Outros</router-link>
          </li>
        </ul>
      </nav>
    </div>

    <nav></nav>
  </header>
</template>

<script>
export default {
  name: "TheHeader"
};
</script>

<style lang="scss" scoped>
h1 {
  width: 50px;
  display: flex;
  align-items: center;
}
header {
  @include bgcolor("primary");
  @include textcolor("light");
  padding: 10px 0;
  .container {
    display: flex;
    align-items: center;
  }
  ul {
    display: flex;
    margin-left: 50px;
  }
  li {
    margin-right: 30px;
  }
  a {
    @include textcolor("light");
    transition: all 0.3s;
    &:hover {
      text-decoration: underline;
      @include textcolor("warning");
    }
  }
}
</style>
