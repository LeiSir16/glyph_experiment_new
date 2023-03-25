<template>
  <div class="panel">
    <el-form label-position="left" :model="glyphAttrPublic">
      <el-form-item>
        <el-row type="flex" align="middle" style="text-align: center">
          <el-col :span="4" :offset="2" class="show-left">
            <slot name="label">
              尺寸
            </slot>
          </el-col>
          <el-col :span="16">
            <el-input-number v-model="glyphAttrPublic.glyphSize"
                             :min="500"
                             :max="1000"
                             label="glyph的大小">

            </el-input-number>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row type="flex" align="middle" style="text-align: center">
          <el-col :span="4" :offset="2" class="show-left">
            <slot name="label">
              属性数量
            </slot>
          </el-col>
          <el-col :span="16" :offset="1">
            <el-slider v-model="glyphAttrPublic.attrNum"
                       show-input
                       :min="1"
                       :max="15"
                       :step="1"
                       input-size="medium">

            </el-slider>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row type="flex" align="middle" style="text-align: center">
          <el-col :span="4" :offset="2" class="show-left">
            <slot name="label">
              内半径
            </slot>
          </el-col>
          <el-col :span="16" :offset="1">
            <el-slider v-model="glyphAttrPublic.iRadius"
                       show-input
                       :min="1"
                       :max="6"
                       :step="0.1"
                       input-size="medium">

            </el-slider>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row type="flex" align="middle" style="text-align: center">
          <el-col :span="4" :offset="2" class="show-left">
            <slot name="label">
              区域间隔
            </slot>
          </el-col>
          <el-col :span="16" :offset="1">
            <el-slider v-model="glyphAttrPublic.sectorInterval"
                       show-input
                       :min="0"
                       :max="3"
                       :step="0.1"
                       input-size="medium">

            </el-slider>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row type="flex" align="middle" style="text-align: center">
          <el-col :span="4" :offset="2" class="show-left">
            <slot name="label">
              条纹左右间距
            </slot>
          </el-col>
          <el-col :span="16" :offset="1">
            <el-slider v-model="glyphAttrPublic.stripe_L_R"
                       show-input
                       :min="0"
                       :max="0.8"
                       :step="0.01"
                       input-size="medium">

            </el-slider>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row type="flex" align="middle" style="text-align: center">
          <el-col :span="4" :offset="2" class="show-left">
            <slot name="label">
              条纹前后间距
            </slot>
          </el-col>
          <el-col :span="16" :offset="1">
            <el-slider v-model="glyphAttrPublic.stripe_B_A"
                       show-input
                       :min="0"
                       :max=".19"
                       :step="0.01"
                       input-size="medium">

            </el-slider>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row type="flex" align="middle" style="text-align: center">
          <el-col :span="4" :offset="2" class="show-left">
            <slot name="label">
              条纹段长度
            </slot>
          </el-col>
          <el-col :span="16" :offset="1">
            <el-slider v-model="glyphAttrPublic.stripeProportion"
                       show-input
                       :min="0"
                       :max="1"
                       :step="0.01"
                       input-size="medium">

            </el-slider>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row type="flex" align="middle" style="text-align: center">
          <el-col :span="4" :offset="2" class="show-left">
            <slot name="label">
              轮廓粗细
            </slot>
          </el-col>
          <el-col :span="16" :offset="1">
            <el-slider v-model="glyphAttrPublic.outlineThickness"
                       show-input
                       :min="0"
                       :max="2"
                       :step="0.1"
                       input-size="medium">

            </el-slider>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row type="flex" align="middle" style="text-align: center">
          <el-col :span="4" :offset="2" class="show-left">
            <slot name="label">
              背景透明度
            </slot>
          </el-col>
          <el-col :span="16" :offset="1">
            <el-slider v-model="glyphAttrPublic.bgOpacity"
                       show-input
                       :min="0"
                       :max="1"
                       :step="0.1"
                       input-size="medium">

            </el-slider>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row type="flex" align="middle" style="text-align: center">
          <el-col :span="4" :offset="2" class="show-left">
            <slot name="label">
              隐喻透明度
            </slot>
          </el-col>
          <el-col :span="16" :offset="1">
            <el-slider v-model="glyphAttrPublic.metaphorOpacity"
                       show-input
                       :min="0"
                       :max="1"
                       :step="0.1"
                       input-size="medium">

            </el-slider>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row type="flex" align="middle" style="text-align: center">
          <el-col :span="4" :offset="2" class="show-left">
            <slot name="label">
              条纹透明度
            </slot>
          </el-col>
          <el-col :span="16" :offset="1">
            <el-slider v-model="glyphAttrPublic.stripeOpacity"
                       show-input
                       :min="0"
                       :max="1"
                       :step="0.01"
                       input-size="medium">

            </el-slider>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row type="flex" align="middle" style="text-align: center">
          <el-col :span="4" :offset="2" class="show-left">
            <slot name="label">
              轮廓透明度
            </slot>
          </el-col>
          <el-col :span="16" :offset="1">
            <el-slider v-model="glyphAttrPublic.innerOpacity"
                       show-input
                       :min="0"
                       :max="1"
                       :step="0.1"
                       input-size="medium">

            </el-slider>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row type="flex" align="middle" style="text-align: center">
          <el-col :span="4" :offset="2" class="show-left">
            <slot name="label">
              分隔线透明度
            </slot>
          </el-col>
          <el-col :span="16" :offset="1">
            <el-slider v-model="glyphAttrPublic.divisionOpacity"
                       show-input
                       :min="0"
                       :max="1"
                       :step="0.1"
                       input-size="medium">

            </el-slider>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row type="flex" align="middle">
          <el-col :span="4" :offset="2" class="show-left">
            <slot name="label">
              编码信息
            </slot>
          </el-col>
          <el-col :span="16" :offset="1">
            <el-switch
                v-model="glyphAttrPublic.isEncodingInfo"
                active-color="#13ce66"
                inactive-color="#ff4949">
            </el-switch>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row type="flex" align="middle">
          <el-col :span="4" :offset="2" class="show-left">
            <slot name="label">
              单一颜色
            </slot>
          </el-col>
          <el-col :span="16" :offset="1" style="display: flex;align-items: center">
            <el-color-picker
                v-model="glyphAttrPublic.encodingInfoColor"
                :disabled="glyphAttrPublic.isEncodingInfo">
            </el-color-picker>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row type="flex" align="middle">
          <el-col :span="4" :offset="2" class="show-left">
            <slot name="label">
              隐喻条纹颜色
            </slot>
          </el-col>
          <el-col :span="16" :offset="1" style="display: flex;align-items: center">
            <el-color-picker
                v-model="glyphAttrPublic.metaphorColor">
            </el-color-picker>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <el-form label-position="left" :model="fixedGlyphCondition" v-show="keyControl.layoutStrategies === 1">
      <el-form-item>
        <el-row type="flex" align="middle" style="text-align: center">
          <el-col :span="4" :offset="2" class="show-left">
            <slot name="label">
              层数
            </slot>
          </el-col>
          <el-col :span="16" :offset="1">
            <el-slider v-model="fixedGlyphCondition.layerNum"
                       show-input
                       :min="1"
                       :max="10"
                       :step="1"
                       input-size="medium">

            </el-slider>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <el-form label-position="left" :model="randomGlyphCondition" v-show="keyControl.layoutStrategies === 2">
      <el-form-item>
        <el-row type="flex" align="middle" style="text-align: center">
          <el-col :span="4" :offset="2" class="show-left">
            <slot name="label">
              条纹粗细
            </slot>
          </el-col>
          <el-col :span="16" :offset="1">
            <el-slider v-model="randomGlyphCondition.stripeThickness"
                       show-input
                       :min="0.01"
                       :max="1"
                       :step=".01"
                       input-size="medium">

            </el-slider>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row type="flex" align="middle" style="text-align: center">
          <el-col :span="4" :offset="2" class="show-left">
            <slot name="label">
              总条纹段数量
            </slot>
          </el-col>
          <el-col :span="16" :offset="1">
            <el-slider v-model="randomGlyphCondition.stripeNum"
                       show-input
                       :min="1"
                       :max="maxStripeNum"
                       :step="1"
                       input-size="medium">

            </el-slider>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <div class="export-glyph">
      <el-button type="danger" @click="exportSvg">导出glyph为图片</el-button>
    </div>
  </div>
</template>

<script>
import {nanoid} from "nanoid";

export default {
  name: "demoAdjustmentPanel",
  props: ["keyControl"],
  data() {
    return {
      glyphAttrPublic: {
        // svg的大小
        glyphSize: 900,
        // 内半径
        iRadius: 2.5,
        // 扇形区域之间的间隔
        sectorInterval: 1.5,
        // 轮廓粗细
        outlineThickness: 0.7,
        // 区域分割线透明度
        divisionOpacity: 1,
        // 背景透明度
        bgOpacity: 0,
        // 轮廓的透明度
        innerOpacity: 1,
        // 条纹段长度占的比例
        stripeProportion: .083,
        // 条纹左右间距
        stripe_L_R: .15,
        // 条纹前后间距
        stripe_B_A: .07,
        // 隐喻条纹颜色
        metaphorColor: '#C0C0C0',
        // 隐喻条纹透明度
        metaphorOpacity: .3,
        // glyph条纹段是否编码颜色
        isEncodingInfo: true,
        // 编码单一颜色时的颜色
        encodingInfoColor: 'red',
        // 条纹段透明度
        stripeOpacity: 1,
        // 编码属性的数量
        attrNum: 9
      },
      // 区域均匀分布glyph条件
      fixedGlyphCondition: {
        // 分隔的层数
        layerNum: 6,
      },
      randomGlyphCondition: {
        // 条纹段的粗细
        stripeThickness: .07,
        stripeNum: 20
      },
      maxStripeNum: 1
    }
  },
  mounted() {
    this.$bus.$on('updateStripeNum', d => {
      this.maxStripeNum = d.length
    })
  },
  watch: {
    // 更新公共参数
    glyphAttrPublic: {
      deep: true,
      handler(newVal) {
        this.$bus.$emit('updatePublicParam', {
          layout: this.keyControl.layoutStrategies,
          glyphAttrPublic: newVal
        })
      }
    },
    fixedGlyphCondition: {
      deep: true,
      handler(newVal) {
        this.$bus.$emit('updateFixedParam', {
          layout: this.keyControl.layoutStrategies,
          fixedGlyphCondition: newVal
        })
      }
    },
    randomGlyphCondition: {
      deep: true,
      handler(newVal) {
        console.log(newVal)
        this.$bus.$emit('updateFixedParam', {
          layout: this.keyControl.layoutStrategies,
          fixedGlyphCondition: newVal
        })
      }
    }
  },
  methods: {
    exportSvg() {
      const name = nanoid()
      this.$bus.$emit('saveToSvg', {
        svgName: name,
        layout: this.keyControl.layoutStrategies
      })
    }
  }
}
</script>

<style scoped>
.panel {
  box-sizing: border-box;
  height: 48vw;
  background-color: rgba(225, 225, 225, .6);
  border-radius: 1vw;
  padding: 1vw 0;
  font-size: 24px;
  font-weight: bolder;
  overflow: auto;
}

.show-left {
  text-align: right;
}

.export-glyph {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>