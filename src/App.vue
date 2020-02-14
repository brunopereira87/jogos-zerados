<template>
  <div id="app">
    <TheHeader />
    <main class="main container">
      <transition mode="out-in">
        <router-view />
      </transition>
    </main>
    <TheFooter />
  </div>
</template>
<script>
import TheHeader from "@/components/TheHeader";
import TheFooter from "@/components/TheFooter";
export default {
  components: {
    TheHeader,
    TheFooter
  }
};
</script>
<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  font-family: "Roboto", "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  color: #2c3e50;
  @include bgcolor("secondary");
}
.container {
  width: map-get($container_width, "desktop");
  max-width: 100%;
  margin: $center;
}
ul,
li {
  list-style: none;
}
img {
  max-width: 100%;
}
a {
  text-decoration: none;
}
.v-enter,
.v-leave-to {
  opacity: 0;
  transform: translate3d(0, -20px, 0);
}

.v-enter-active,
.v-leave-active {
  transition: all 0.3s;
}
.section_title {
  text-align: left;
  margin-top: $section_margin;
  margin-bottom: $title_margin;
  font-size: 2.5rem;
  font-weight: 500;
  @include textcolor("light");
}

.btn {
  padding: 10px 30px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.btn-submit {
  font-weight: 600;
  @include bgcolor("primary");
  @include textcolor("light");
  transition: all 0.3s;
  &:hover {
    @include bgcolor("fourth");
  }
}
</style>
