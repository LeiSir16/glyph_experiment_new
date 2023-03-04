<template>
  <div :id="svgId"></div>
</template>

<script>
import {drawGlyph} from "@/mixin";
import {nanoid} from "nanoid";
import * as d3 from "d3";

export default {
  name: "stripeGlyph",
  mixins: [drawGlyph],
  props: ['glyphCondition', 'glyphData', 'experimentInfo'],
  data() {
    return {
      svgId: "",
      glyphSvg: '',
      showGlyph: ''
    }
  },
  created() {
    // 设置绘制glyph的盒子的id
    this.svgId = `stripeGlyph_${nanoid()}`
  },
  methods: {
    createGlyph() {
      if (this.showGlyph) {
        this.showGlyph.remove()
        this.showGlyph = ''
      }
      // 合并或覆盖条件
      this.stripeGlyphCondition = {
        ...this.stripeGlyphCondition,
        ...this.glyphCondition
      }
      this.glyphSvg.attr('width', this.stripeGlyphCondition.glyphSize)
          .attr('height', this.stripeGlyphCondition.glyphSize)
      this.showGlyph = this.drawStripGlyph(this.glyphSvg, this.stripeGlyphCondition, this.glyphData, {isExperimentB: this.experimentInfo.isExperimentB}, this.encodingColor, {})
    }
  },
  mounted() {
    const vc = this
    this.glyphSvg = d3.select(`#${vc.svgId}`)
        .append('svg')
        .attr('width', vc.stripeGlyphCondition.glyphSize)
        .attr('height', vc.stripeGlyphCondition.glyphSize)
    this.createGlyph()
  },
  watch: {
    experimentInfo: {
      deep: true,
      handler(newVal, oldVal) {
        this.createGlyph()
      }
    }
  }
}
</script>

<style scoped>

</style>