<template>
    <svg>
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