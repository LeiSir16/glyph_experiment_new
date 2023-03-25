<template>
  <div style="margin: 1vh 0 .5vh 0">
    <!--peaGlyph的说明-->
    <template v-if="visDescription.glyphType === 1">
      <el-row>
        <el-col :span="23" :offset="1">
          Circle fill color represents <span class="under_line">data categories</span>.
          <!-- 圆圈填充的颜色表示<span class="under_line">数据的类别</span>-->
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="23" :offset="1">
          Each circle represents a value of <span class="under_line">{{ visDescription.circleValue.toFixed(2) }}</span>
          <!-- 每个圆圈表示的值的大小为<span class="under_line">{{ visDescription.circleValue.toFixed(2) }}</span>-->
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="23" :offset="1">
          Up to <span class="under_line">{{ visDescription.maxCircle }}</span> circles can be used to represent each
          category of data.
          <!-- 每类数据最多可以通过<span class="under_line">{{ visDescription.maxCircle }}</span>个圆圈表示-->
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="23" :offset="1">
          The range of values represented by each category is from <span class="under_line">[0,{{
            visDescription.circleValue * visDescription.maxCircle
          }}]</span>.
          <!--          每类数据表达的值的范围是<span class="under_line">[0,{{-->
          <!--            visDescription.circleValue * visDescription.maxCircle-->
          <!--          }}]</span>-->
        </el-col>
      </el-row>
    </template>
    <!--stripeGlyph的解释-->
    <template v-else>
      <el-row>
        <el-col :span="23" :offset="1">
          <!-- 条纹段填充的颜色表达了<span class="under_line">数据的类别</span>-->
          Stripe fill color represents <span class="under_line">data categories</span>.
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="23" :offset="1">
          <!--  每个条纹段表示的值为<span class="under_line">{{ visDescription.circleValue.toFixed(2) }}</span>-->
          Each stripe represents a value of <span class="under_line">{{ visDescription.circleValue.toFixed(2) }}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="23" :offset="1">
          <!-- 每类数据最多可以通过<span class="under_line">{{ visDescription.maxCircle }}</span>个条纹段编码-->
          Up to <span class="under_line">{{ visDescription.maxCircle }}</span> stripes can be used to represent each
          category of data.
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="23" :offset="1">
          <!--          每类数据表达的值的范围是<span class="under_line">[0,{{-->
          <!--            visDescription.circleValue * visDescription.maxCircle-->
          <!--          }}]</span>-->
          The range of values represented by each category is from <span class="under_line">[0,{{
            visDescription.circleValue * visDescription.maxCircle
          }}]</span>.
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="23" :offset="1" class="text">
          <!--  每个扇形区域的<span class="under_line">灰色半透明条纹段和彩色条纹段的数量之和</span>表达了该扇形区域所能编码条纹段的最大值-->
          <span
              class="under_line">The sum of the number of gray transparent and colored stripe segments in each sector</span>
          represents the maximum value of stripes that can be encoded in that sector.
        </el-col>
      </el-row>
    </template>
  </div>
</template>

<script>
export default {
  name: "VisualizationDescription",
  props: ["visDescription"]
}
</script>

<style scoped lang="less">
.el-row {
  margin: .5vh 0;
}

.under_line {
  font-weight: 900;
  color: red;
}
</style>