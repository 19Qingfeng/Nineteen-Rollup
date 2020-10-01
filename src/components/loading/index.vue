<template>
    <div class="m_loading_cmp">
        <svg
            :height="height"
            :width="width"
            viewBox="0 0 100 100"
        >
            <circle
                cx="50"
                cy="50"
                r="25"
                stroke-width="5"
                fill="transparent"
                stroke-dasharray="39"
                stroke-linecap="round"
                :stroke="outerColor"
            >
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    values="0 50 50;360 50 50"
                    :dur="`${+ rotateDuration}s`"
                    repeatCount="indefinite"
                ></animateTransform>
                <animate
                    attributeName="stroke"
                    :values="outerCircleColor"
                    :dur="`${+ fillDuration}s`"
                    repeatCount="indefinite"
                ></animate>
            </circle>
            <circle
                cx="50"
                cy="50"
                r="15"
                stroke-width="5"
                fill="transparent"
                stroke-dasharray="23"
                stroke-linecap="round"
                :stroke="innerColor"
            >
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    values="360 50 50;0 50 50"
                    :dur="`${+ rotateDuration}s`"
                    repeatCount="indefinite"
                ></animateTransform>
                <animate
                    attributeName="stroke"
                    :values="innerCircleColor"
                    :dur="`${+ fillDuration}s`"
                    repeatCount="indefinite"
                ></animate>
            </circle>
        </svg>
        <slot></slot>
    </div>
</template>
<script>
import { computed } from "vue";
export default {
  name: "LoadingCmp",
  props: {
    height: {
      type: Number,
      default: 180,
    },
    width: {
      type: Number,
      default: 180,
    },
    rotateDuration: {
      type: [Number, String],
      default: 2,
    },
    fillDuration: {
      type: [Number, String],
      default: 2,
    },
    innerColor: {
      type: String,
      default: "#02bcfe",
    },
    outerColor: {
      type: String,
      default: "#3be6cd",
    },
  },
  setup(prop, ctx) {
    const outerCircleColor = computed(() => {
      return `${prop.outerColor};${prop.innerColor};${prop.outerColor}`;
    });
    const innerCircleColor = computed(() => {
      return `${prop.innerColor};${prop.outerColor};${prop.innerColor}`;
    });
    return { outerCircleColor, innerCircleColor };
  },
};
</script>
<style lang="scss" scoped>
.m_loading_cmp {
  display: flex;
  flex-direction: column;
}
</style>