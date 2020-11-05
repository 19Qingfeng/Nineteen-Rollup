<template>
    <div
        class="echarts"
        ref="chart"
    >
    </div>
</template>
<script>
import { ref, watch, onMounted } from "vue";
import Echarts from "echarts";
export default {
  name: "QaCharts",
  props: {
    options: Object,
    theme: [String, Object],
  },
  setup(prop) {
    let chart = ref(null);
    let chartObj;
    const initChart = () => {
      if (!chartObj) {
        chartObj = Echarts.init(chart.value);
      }
      if (!prop.options) return;
      chartObj.setOption(prop.options);
    };
    watch(
      () => prop.options,
      () => {
        initChart();
      }
    );
    onMounted(() => {
      initChart();
    });
    return {
      chart,
    };
  },
};
</script>
<style lang="scss">
.echarts {
  height: 100%;
  width: 100%;
}
</style>