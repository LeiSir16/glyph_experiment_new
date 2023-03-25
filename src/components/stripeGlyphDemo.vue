<template>
  <div :id="svgId" :ref="svgId"></div>
</template>

<script>
import {drawStripeGlyphRandom} from "@/mixin";
import {saveAs} from 'file-saver'
import html2canvas from "html2canvas";
import {canvasToBlob} from 'canvas-to-blob'

export default {
  name: "stripeGlyphDemo",
  props: ['layoutStrategies'],
  mixins: [drawStripeGlyphRandom],
  methods: {
    // 导出svg标签为svg图片
    exportSvg(d) {
      if (d.layout === this.layoutStrategies) {
        // const xml = new XMLSerializer().serializeToString(this.glyphSvg.node())
        // const svgBlob = new Blob([xml], {type: 'image/svg+xml'})
        // saveAs(svgBlob, `${d.svgName}.svg`)
        // console.log(this.$refs[this.svgId])
        // 将图片导出为png
        html2canvas(this.$refs[this.svgId]).then(canvas => {
          canvas.toBlob(blob => {
            saveAs(blob, `${d.svgName}.png`, 'image/png')
            this.$message({
              message: `${d.svgName}.png图片导出成功！`,
              type: 'success'
            });
          })
        })
      }
    },
    createGlyph() {
      this.createSvg()
      if (this.layoutStrategies === 1) {
        this.createFixedGlyph()
      } else {
        this.createRandomGlyph()
      }
    }
  },
  mounted() {
    this.createGlyph()
    // 导出图片
    this.$bus.$on('saveToSvg', this.exportSvg)
    this.$bus.$on('updatePublicParam', d => {
      if (d.layout === this.layoutStrategies) {
        this.publicGlyphCondition = {
          ...this.publicGlyphCondition,
          ...d.glyphAttrPublic
        }
        this.createGlyph()
      }
    })
    this.$bus.$on('updateFixedParam', d => {
      if (d.layout === this.layoutStrategies) {
        if (d.layout === 1) {
          this.fixedGlyphCondition = {
            ...this.fixedGlyphCondition,
            ...d.fixedGlyphCondition
          }
        } else {
          this.randomGlyphCondition = {
            ...this.randomGlyphCondition,
            ...d.fixedGlyphCondition
          }
        }
        this.createGlyph()
      }
    })
  }
}
</script>

<style scoped>

</style>