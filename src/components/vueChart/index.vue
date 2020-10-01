<template>
    <div
        class="echarts"
        :ref="chart"
    >

    </div>
</template>
<script>
import { ref, watch, onMounted } from "vue";
import Echarts from "echarts";
export default {
  name: "QChart",
  props: {
    options: Object,
  },
  setup(options) {
    let dom;
    let chart = ref(null);
    watch(
      () => props.options,
      () => {}
    );
    return {
      chart,
    };
  },
};
</script>
<style lang="scss" scoped>
.echarts {
  height: 100%;
  width: 100%;
}
</style>