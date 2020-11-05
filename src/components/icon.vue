<template>
    <svg class="svg">
        <use :href="name"></use>
    </svg>
</template>
<script>
export default {
  name: "Icon",
  props: {
    name: String,
  },
  setup(prop, ctx) {
    const name = `#${prop.name}`;
    return {
      name,
    };
  },
};
</script>
<style lang="scss" scoped>
.svg {
  height: 100%;
  width: 100%;
}
</style>