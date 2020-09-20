<template>

    <div class="test">{{message}}</div>

</template>
<script>
export default {
  name: "Test",
  setup() {
    const message = "Hello World";
    return { message };
  },
};
</script>
<style lang="scss">
.test {
  color: red;
}
</style>