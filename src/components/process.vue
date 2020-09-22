<template>
    <div class="wapper">
        <svg
            width="80"
            height="80"
            viewBox="0 0 440 440"
        >
            <circle
                cx="220"
                cy="220"
                r="200"
                class="base"
            ></circle>
            <circle
                class="outer"
                cx="220"
                cy="220"
                r="200"
                transform="matrix(0 -1 1 0 0 440)"
            ></circle>
        </svg>
    </div>
</template>
<script>
export default {
  name: "ProcessCircle",
};
</script>
<style>
.wapper {
  border: 1px solid red;
  width: 200px;
  height: 80px;
  margin: 0 auto;
}
.base {
  fill: transparent;
  stroke-width: 20px;
  stroke: rgba(0, 0, 0, 0.2);
}
.outer {
  transform: matrix(0 -1 1 0 0 440);
  fill: transparent;
  stroke: turquoise;
  stroke-width: 20px;
  animation: process 2s ease-in-out infinite;
}
@keyframes process {
  0% {
    stroke-dasharray: 0 1257px;
  }
  100% {
    stroke-dasharray: 1257px 0;
  }
}
</style>