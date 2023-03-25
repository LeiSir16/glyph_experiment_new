<template>
  <div style="margin-top: 5vh">
    <el-row type="flex" justify="center" align="middle">
      <el-col :span="11" :offset="1">
        <pea-glyph :glyph-condition="peaGlyphCondition" :glyph-data="glyphData"
                   :experiment-info="experimentInfo"/>
      </el-col>
      <el-col :span="12">
        <stripe-glyph :glyph-condition="stripeGlyphCondition" :glyph-data="glyphData"
                      :experiment-info="experimentInfo"/>
      </el-col>
    </el-row>
    <el-row type="flex">
      <el-col :span="2" style="margin-left: 23vw">
        <h1 class="glyph-name">A</h1>
      </el-col>
      <el-col :span="2" style="margin-left: 37vw">
        <h1 class="glyph-name">B</h1>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import peaGlyph from "@/components/peaGlyph.vue";
import stripeGlyph from "@/components/stripeGlyph.vue";

export default {
  name: "VisualizationDesign",
  components: {
    peaGlyph,
    stripeGlyph
  },
  data() {
    return {
      peaGlyphCondition: {
        glyphSize: 750,
        circleNum: 10,
        centerOffset: 15,
        circleValue: 1
      },
      stripeGlyphCondition: {
        glyphSize: 750,
        stripe_L_R: .07,
        stripe_B_A: .1,
        stripeProportion: .117,
        layerNum: 4,
        // 这个值现在传递的是编码的条纹的数量
        stripeNum: 10,
        stripeValue: 1
      },
      glyphData: [],
      experimentInfo: {
        isExperimentB: true
      }
    }
  },
  created() {
    this.glyphData = this.$store.state.GlyphDesignData
  }
}
</script>

<style scoped>

</style>