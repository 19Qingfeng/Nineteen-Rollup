<template>
    <div
        class="m_fly_box"
        ref="wapper"
    >
        <!-- 自适应布局把握以下要点
            onMounted时获取最外层div的宽和高(最外层div宽高继承层100%)
            然后svg的width和height等于最外层宽高 此时viewBox默认是宽高是viewPort
            然后内层矩形和外层矩形的对应大小要根据宽高变化 这里使用computed获得path的d
            之后动画animateMotion的path也要随着矩形变化而变化（动画环绕矩形点运动）
     -->
        <svg
            :width="width"
            :height="height"
        >
            <defs>
                <mask id="mask">
                    <circle
                        cx="0"
                        cy="0"
                        :r="starArea"
                        fill="url(#gradient)"
                    >
                        <!-- mask -->
                        <!-- fill:white 纯白色不透明 显示顶层使用者 -->
                        <!-- fill:black 纯黑色全透明 顶层隐藏 显示底层 -->
                        <!-- 结合opacity或者fill的颜色透明度 可以达到蒙蔽颜色结合的效果 -->
                        <!-- 这里就是使用了渐变白 达到了 不透明->全透明效果的视觉渐变 -->
                        <!-- mask坐标系统按照svg画布 -->

                        <!-- 最后再让蒙版按照外层矩形运行起来 就实现了流行环绕视觉效果 -->

                        <!-- 注意这里的rotate 这个属性实现了运动过程中动画元素的旋转 -->
                        <!-- 可以指定固定值，固定角度并不会跟随动画而变动
                            也可以在路径交汇点自动变化auto表示跟随动画自动旋转(右转)auto-reverse左
                            https://developer.mozilla.org/zh-CN/docs/Web/SVG/Attribute/rotate
                         -->
                        <animateMotion
                            :path="path"
                            :dur="`${+ duration}s`"
                            rotate="auto"
                            repeatCount="indefinite"
                        ></animateMotion>
                    </circle>
                </mask>
                <radialGradient
                    id="gradient"
                    cx=".5"
                    cy=".5"
                    fx="1"
                    fy=".5"
                    r=".5"
                >
                    <!-- cx cy 确定渐变圆的位置 结合 r 确定渐变圆 -->
                    <!-- 要求到达渐变圆的边界完成渐变(offset:1) -->
                    <!-- fx fy 确定渐变起始点 -->
                    <!-- 既从fxfy(offset:0) -> 确定圆边界(offset:1) 完成渐变 -->

                    <!-- cx cy fx fy r相对于调用者宽高的百分比(坐标系统在调用者内部) -->
                    <stop
                        offset="0"
                        stop-color="#fff"
                        stop-opacity="1"
                    ></stop>
                    <stop
                        offset="1"
                        stop-color="#fff"
                        stop-opacity="0"
                    ></stop>
                </radialGradient>

                <path
                    id="rect"
                    :d="path"
                    fill="none"
                ></path>

                <!-- <rect :path="path"></rect> -->

            </defs>

            <use
                href="#rect"
                :stroke-width="+lineWidth"
                :stroke="lineColor"
            ></use>
            <use
                href="#rect"
                :stroke-width="+starWidth"
                :stroke="starColor"
                mask="url(#mask)"
            ></use>
        </svg>
        <div class="content">
            <slot></slot>
        </div>

    </div>
</template>
<script>
import { onMounted, ref, computed, getCurrentInstance } from "vue";
export default {
  name: "flyBox",
  props: {
    // 宽高继承外层元素
    // 矩形边框颜色
    lineColor: {
      type: String,
      default: "#235fa7",
    },
    // 矩形线宽
    lineWidth: {
      type: [Number, String],
      default: 1,
    },
    // 动画线条（流行）宽度
    starWidth: {
      type: [Number, String],
      default: 3,
    },
    // 动画线条（流星）颜色
    starColor: {
      type: String,
      default: "#4fd2dd",
    },
    // 动画时间
    duration: {
      type: [Number, String],
      default: 2,
    },
    // 动画线条（流行）长度
    starArea: {
      type: Number,
      default: 50,
    },
  },
  setup(prop, ctx) {
    const height = ref(0);
    const width = ref(0);
    const wapper = ref(null);
    const path = computed(() => {
      return `M5 5 L${width.value - 5} 5 L${width.value - 5} ${
        height.value - 5
      } L5 ${height.value - 5} Z`;
    });
    const init = () => {
      const dom = getCurrentInstance().ctx.$refs["wapper"];
      //   console.log(wapper.value, "wapper"); // 也可以直接使用wapper.value
      height.value = dom.clientHeight;
      width.value = dom.clientWidth;
    };
    onMounted(() => {
      init();
    });
    return {
      height,
      width,
      wapper,
      path,
    };
  },
};
</script>
<style lang="scss" scoped>
.m_fly_box {
  height: 100%;
  width: 100%;
  position: relative;
  svg {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
  }
  .content {
    padding: 5px;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
  }
}
</style>