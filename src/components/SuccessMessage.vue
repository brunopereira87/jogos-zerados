<template>
  <p v-if="message">{{ message }}</p>
</template>

<script>
export default {
  name: "SuccessMessage",
  computed: {
    message() {
      return this.$store.state.success_message;
    }
  }
};
</script>

<style lang="scss" scoped>
p {
  @include bgcolor("fourth");
  @include textcolor("light");
  padding: 15px 10px;
  border-radius: 5px;
  margin-bottom: 30px;
}
</style>
