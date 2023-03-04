<template>
  <div class="legend">
    <div class="legend-icon">
      <svg :width="svgSize" :height="svgSize">
        <circle :r="svgSize / 2-outlineThickness / 2"
                :cx="svgSize / 2"
                :cy="svgSize / 2"
                :fill="colorName.color"
                stroke="#000000"
                :stroke-width="outlineThickness">

        </circle>
      </svg>
    </div>
    <div class="legend-des">
      {{ colorName.nameCh }}
    </div>
  </div>
</template>

<script>
export default {
  name: "ColorItem",
  data() {
    return {
      svgSize: 20,
      outlineThickness: 1
    }
  },
  computed: {
    circleInfo() {
      return {
        width: `${this.svgSize}vh`,
        height: `${this.svgSize}vh`,
        r: `${(this.svgSize - this.outlineThickness) / 2}vh`,
        cx: `${this.svgSize / 2}vh`,
        cy: `${this.svgSize / 2}vh`,
        strokeWidth: `${this.outlineThickness}vh`
      }
    }
  },
  props: ['colorName']
}
</script>

<style scoped lang="less">
.legend {
  display: flex;
  width: 100%;
  justify-content: flex-start;
  align-items: center;

  .legend-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20px;
    height: 20px;
  }

  .legend-des {
    margin-left: 1vw;
  }
}
</style>