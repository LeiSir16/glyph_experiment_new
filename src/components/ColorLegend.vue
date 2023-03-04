<template>
  <div>
    <div v-for="item in colorLegend" :key="item.id" class="legend-item">
      <color-item :color-name="item"/>
    </div>
  </div>
</template>

<script>
import ColorItem from "@/components/ColorItem.vue";

export default {
  name: "ColorLegend",
  components: {
    ColorItem
  },
  props: ['experiment'],
  computed: {
    colorLegend() {
      if (this.experiment === 1) {
        return this.$store.state.ssiColorEncoding
      }
      return this.$store.state.ssiColorEncoding
    }
  }
}
</script>

<style scoped lang="less">
.legend-item {
  margin: 1vh 0 1vh .7vw;
}
</style>