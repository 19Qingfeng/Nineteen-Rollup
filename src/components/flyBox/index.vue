<template>
    <div style="width:600px;height:600px;background-color:#333">
        <svg
            style="margin-top:20px"
            height="400"
            width="400"
        >
            <defs>
                <mask id="mask">
                    <circle
                        cx="0"
                        cy="0"
                        r="100"
                        fill="url(#gradient)"
                    >
                        <!-- mask -->
                        <!-- fill:white 纯白色不透明 显示顶层使用者 -->
                        <!-- fill:black 纯黑色全透明 顶层隐藏 显示底层 -->
                        <!-- 结合opacity或者fill的颜色透明度 可以达到蒙蔽颜色结合的效果 -->
                        <!-- 这里就是使用了渐变白 达到了 不透明->全透明效果的视觉渐变 -->

                        <!-- 最后再让蒙版按照外层矩形运行起来 就实现了流行环绕视觉效果 -->
                        <animateMotion
                            path="M 0 0 L400 0 L400 400 L0 400 Z"
                            dur="2s"
                            rotate="0"
                            repeatCount="indefinite"
                        ></animateMotion>
                    </circle>
                </mask>
                <radialGradient
                    id="gradient"
                    cx=".5"
                    cy=".5"
                    fx=".9"
                    fy=".5"
                    r=".5"
                >
                    <!-- cx cy 确定渐变圆的位置 结合 r 确定渐变圆 -->
                    <!-- 要求到达渐变圆的边界完成渐变(offset:1) -->
                    <!-- fx fy 确定渐变起始点 -->
                    <!-- 既从fxfy(offset:0) -> 确定圆边界(offset:1) 完成渐变 -->

                    <!-- cx cy fx fy r相对于调用者宽高的百分比 -->
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

                <rect
                    id="rect"
                    x='0'
                    y='0'
                    height="400"
                    width="400"
                    fill="none"
                ></rect>

            </defs>

            <use
                href="#rect"
                stroke-width="3"
                stroke="#235fa7"
            ></use>
            <use
                href="#rect"
                stroke-width="5"
                stroke="#4fd2dd"
                mask="url(#mask)"
            ></use>
            <!-- <rect
                x='0'
                y='0'
                height="400"
                width="400"
                stroke-width="3"
                stroke="#235fa7"
                fill="none"
            ></rect> -->
            <!-- <rect
                x='0'
                y='0'
                height="400"
                width="400"
                stroke-width="5"
                stroke="#4fd2dd"
                fill="none"
                mask="url(#mask)"
            ></rect> -->
        </svg>
    </div>
</template>
<script>
export default {
  name: "flyBox",
};
</script>