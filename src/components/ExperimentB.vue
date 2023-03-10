<template>
  <div>
    <el-row type="flex" justify="center" align="middle">
      <el-col :span="19">
        <!--glyph显示部分-->
        <el-row type="flex" justify="center" align="middle">
          <template v-if="curShowGlyph === 1">
            <el-col :span="10" :offset="1">
              <pea-glyph :glyph-condition="peaGlyphCondition" :glyph-data="glyphData[0]"
                         :experiment-info="experimentInfo"/>
            </el-col>
            <el-col :span="10" :offset="1">
              <pea-glyph :glyph-condition="peaGlyphCondition" :glyph-data="glyphData[1]"
                         :experiment-info="experimentInfo"/>
            </el-col>
          </template>
          <template v-else>
            <el-col :span="10" :offset="1">
              <stripe-glyph :glyph-condition="stripeGlyphCondition" :glyph-data="glyphData[0]"
                            :experiment-info="experimentInfo"/>
            </el-col>
            <el-col :span="10" :offset="1">
              <stripe-glyph :glyph-condition="stripeGlyphCondition" :glyph-data="glyphData[1]"
                            :experiment-info="experimentInfo"/>
            </el-col>
          </template>
        </el-row>
        <!-- glyph编号-->
        <el-row type="flex" justify="center" align="middle">
          <el-col :span="10" :offset="1" data-id="0">
            <h1 class="glyph-name">A</h1>
          </el-col>
          <el-col :span="10" :offset="1" data-id="1">
            <h1 class="glyph-name">B</h1>
          </el-col>
        </el-row>
        <!-- 实验计数部分-->
        <el-row type="flex" justify="center" align="middle">
          <el-col :span="3">
            <el-statistic>
              <span slot="title" class="static-title">
                已完成实验数
              </span>
              <span slot="formatter" class="experiment-num">
                {{ curActive }}
              </span>
            </el-statistic>
          </el-col>
          <el-col :span="3">
            <el-statistic>
              <span slot="title" class="static-title">
                实验总数
              </span>
              <span slot="formatter" class="experiment-num">
                {{ totalExperimentNum }}
              </span>
            </el-statistic>
          </el-col>
        </el-row>
        <!--重新练习按钮-->
        <el-row type="flex" justify="center" align="middle"
                v-show="experimentSettings.isDemo && curActive===totalExperimentNum">
          <el-col :span="24" style="text-align: center;margin-top: 1vh">
            <el-button type="primary" plain icon="el-icon-refresh-left" @click="practiceAgain">重新练习</el-button>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="5" class="des-outline">
        <!--可视化图例部分-->
        <el-row type="flex" justify="center" align="middle">
          <el-col :span="24">
            <h2 class="show-center">图例</h2>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center" align="middle">
          <el-col :span="24">
            <color-legend :experiment="1"/>
          </el-col>
        </el-row>
        <div class="divider"></div>
        <!--可视化解释部分-->
        <el-row type="flex" justify="center" align="middle">
          <el-col :span="24">
            <h2 class="show-center">可视化解释</h2>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center" align="middle">
          <el-col :span="24">
            <VisualizationDescription :vis-description="visDes"/>
          </el-col>
        </el-row>
        <div class="divider"></div>
        <!-- 实验任务部分-->
        <el-row type="flex" justify="center" align="middle">
          <el-col :span="24">
            <h2 class="show-center">实验任务</h2>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center" align="middle">
          <el-col :span="24">
            <experiment-b-task :experiment-info="experimentInfo">
              <!-- 数据分布实验任务和微小差值实验任务-->
              <p slot="task" v-if="experimentSettings.experimentId !== 3">请从左侧两个可视化图形中选择<span
                  style="color: red"
                  v-show="experimentSettings.experimentId===1">数据分布比较均匀的一个【方差最小】</span>
                <span style="color: red" v-show="experimentSettings.experimentId===2">具有较大【{{
                    curFindAttr.nameCh
                  }}】的图形</span>
              </p>
              <!-- 差值实验的任务显示-->
              <p slot="task" v-else>
                请估算左侧两个可视化图形中<span style="color: red">{{ curFindAttr.nameCh }}</span>的差值
              </p>
              <p slot="explanation" class="task-explanation" v-if="experimentSettings.experimentId !== 3">
                说明：请在下方<strong>【单击】</strong>选择图形<strong>【A/B】</strong>后点击<strong>【保存结果】</strong>按钮进行保存，保存成功后即可点击<span
                  v-show="totalExperimentNum!==curActive"><strong>【下一步】</strong>按钮进行下一个实验</span><span
                  v-show="totalExperimentNum===curActive"><strong>【提交结果】</strong>按钮导出实验结果</span>
              </p>
              <p slot="explanation" class="task-explanation" v-else>
                说明：请在下方<strong>【输入】</strong>您估算的结果<strong>(小数点后两位)</strong>后点击<strong>【保存结果】</strong>按钮进行保存，保存成功后即可点击<span
                  v-show="totalExperimentNum!==curActive"><strong>【下一步】</strong>按钮进行下一个实验</span><span
                  v-show="totalExperimentNum===curActive"><strong>【提交结果】</strong>按钮导出实验结果</span>
              </p>
            </experiment-b-task>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import peaGlyph from "@/components/peaGlyph.vue";
import stripeGlyph from "@/components/stripeGlyph.vue";
import experimentBTask from "@/components/experimentBTask.vue";
import {publicFun} from "@/mixin";
import VisualizationDescription from "@/components/VisualizationDescription.vue";
import ColorLegend from "@/components/ColorLegend.vue";
import lo from "dayjs/esm/locale/lo";

export default {
  name: "ExperimentB",
  components: {
    peaGlyph,
    stripeGlyph,
    experimentBTask,
    VisualizationDescription,
    ColorLegend
  },
  props: ['experimentSettings'],
  mixins: [publicFun],
  data() {
    return {
      curActive: 1,
      curShowGlyph: 1,
      maxValue: 10,
      peaGlyphCondition: {
        glyphSize: 650,
        circleNum: 10,
        centerOffset: 12,
        circleValue: 1
      },
      stripeGlyphCondition: {
        glyphSize: 650,
        stripe_L_R: .1,
        stripe_B_A: .02,
        stripeProportion: .072,
        layerNum: 10,
        // 这个值现在传递的是编码的条纹的数量
        stripeNum: 40,
        stripeValue: 0.25
      },
      glyphType: [1, 2],
      circleNum: [10, 20, 40],
      // 存储加载的所有数据
      allGlyphData: {},
      // 每种条件下已做实验计数
      conditionFinish: {},
      glyphData: [],
      curCondition: 10,
      // 只对微小差值实验有效
      allRandomAttrs: {},
      curFindAttr: {},
      // 保存实验结果
      curExperimentInfo: {
        glyphType: 1,
        stripeNum: 0,
        stripeValue: 0,
        startTime: '',
        submitTime: '',
        endTime: '',
        chooseIndex: 0,
        chooseData: {},
        allData: [],
        findAttr: '',
        isRight: false
      },
      // 整体实验结果
      experimentResultInfo: {
        startTime: '',
        endTime: '',
        childExperiment: []
      }
    }
  },
  methods: {
    // 重新加载数据
    initialGlyphData() {
      let data = {}
      const dataName = ['ExperimentB_Demo', 'ExperimentB_10', 'ExperimentB_20', 'ExperimentB_40']
      if (this.experimentSettings.experimentId === 1) {
        data = this.experimentSettings.isDemo ? this.$store.state.DistributionPractice : this.$store.state.Distribution
      } else if (this.experimentSettings.experimentId === 2) {
        data = this.experimentSettings.isDemo ? this.$store.state.SmallDifferPractice : this.$store.state.SmallDiffer
      } else {
        data = this.experimentSettings.isDemo ? this.$store.state.AccuracyDifferPractice : this.$store.state.AccuracyDiffer
      }
      if (this.experimentSettings.isDemo) {
        this.allGlyphData = {
          demo: [...data[dataName[0]]],
          'num_10': [...data[dataName[1]]],
          'num_20': [...data[dataName[2]]],
          'num_40': [...data[dataName[3]]]
        }
      } else {
        if (this.experimentSettings.experimentNum < data[dataName[0]].length) {
          this.allGlyphData = {
            demo: [...data[dataName[0]].slice(0, this.experimentSettings.experimentNum)],
            'num_10': [...data[dataName[1]].slice(0, this.experimentSettings.experimentNum)],
            'num_20': [...data[dataName[2]].slice(0, this.experimentSettings.experimentNum)],
            'num_40': [...data[dataName[3]].slice(0, this.experimentSettings.experimentNum)]
          }
        } else if (this.experimentSettings.experimentNum === data[dataName[0]].length) {
          this.allGlyphData = {
            demo: [...data[dataName[0]]],
            'num_10': [...data[dataName[1]]],
            'num_20': [...data[dataName[2]]],
            'num_40': [...data[dataName[3]]]
          }
        } else {
          console.log('数据量不够，需要变小实验数量')
        }
      }
      this.conditionFinish = {
        demo: 0,
        num_10: 0,
        num_20: 0,
        num_40: 0
      }
    },
    // 随机选择一组数据
    randomChooseData() {
      let index = this.randomIndex(this.circleNum.length)
      let num = this.circleNum[index]
      let curFinishNum = this.conditionFinish[`num_${num}`]
      // 选出的condition实验需要没有完成
      while (curFinishNum >= this.experimentSettings.experimentNum) {
        index = this.randomIndex(this.circleNum.length)
        num = this.circleNum[index]
        curFinishNum = this.conditionFinish[`num_${num}`]
      }
      this.$set(this.conditionFinish, `num_${num}`, ++curFinishNum)
      // 当前随机选的条件
      this.curCondition = num
      // 记录当前的条件
      this.$set(this.curExperimentInfo, 'stripeNum', this.curCondition)
      const data = this.allGlyphData[`num_${num}`]
      if (data.length) {
        const d_index = this.randomIndex(data.length)
        // 更新数据
        this.glyphData = data[d_index]
        // 记录选择的数据
        this.$set(this.curExperimentInfo, 'allData', this.glyphData)
        if (this.experimentSettings.experimentId === 2) {
          this.curFindAttr = this.findAttrs(this.curCondition, this.glyphData[0].originIndex)
          // 记录需要查找的属性
          this.$set(this.curExperimentInfo, 'findAttr', this.curFindAttr.name)
        } else if (this.experimentSettings.experimentId === 3) {
          this.curFindAttr = this.findAttrs(this.curCondition, this.glyphData[0].index)
          // 记录需要查找的属性
          this.$set(this.curExperimentInfo, 'findAttr', this.curFindAttr.name)
        }
        // 移除已经做过的数据
        data.splice(d_index, 1)
      } else {
        console.log('数据不够用了')
      }
    },
    // 变更glyph的布局
    changeGlyphLayout(glyph, condition) {
      // peaGlyph
      if (glyph === 1) {
        const circleNum = condition
        const circleValue = this.maxValue / condition
        let centerOffset = 3
        switch (condition) {
          case 10:
            centerOffset = 12
            break
          case 20:
            centerOffset = 6
            break
          case 40:
            centerOffset = 3
            break
        }
        // 更新布局条件
        this.peaGlyphCondition = {
          ...this.peaGlyphCondition,
          circleNum,
          circleValue,
          centerOffset,
        }
      } else {
        const stripeNum = condition
        const stripeValue = this.maxValue / condition
        let layerNum = 6, stripeProportion = .083, stripe_B_A = .07, stripe_L_R = .15
        switch (condition) {
          case 10:
            layerNum = 4
            stripeProportion = .117
            stripe_B_A = .07
            stripe_L_R = .1
            break
          case 20:
            layerNum = 6
            stripeProportion = .083
            stripe_B_A = .07
            stripe_L_R = .15
            break
          case 40:
            layerNum = 10
            stripeProportion = .072
            stripe_B_A = .02
            stripe_L_R = .1
            break
        }
        this.stripeGlyphCondition = {
          ...this.stripeGlyphCondition,
          stripeNum,
          stripeValue,
          layerNum,
          stripeProportion,
          stripe_B_A,
          stripe_L_R
        }
      }
    },
    // 随机生成要寻找的属性
    initialFindAttr() {
      const attr = this.$store.state.ssiColorEncoding
      if (this.experimentSettings.experimentId === 2 && this.allGlyphData) {
        // 微小差值实验生成属性
        for (const allGlyphDataKey in this.allGlyphData) {
          let chooseAttr = []
          for (const allGlyphDatumElement of this.allGlyphData[allGlyphDataKey]) {
            const index = Math.floor(Math.random() * attr.length)
            chooseAttr.push({
              ...attr[index],
              id: allGlyphDatumElement[0].originIndex
            })
          }
          this.$set(this.allRandomAttrs, allGlyphDataKey, chooseAttr)
        }
      } else if (this.experimentSettings.experimentId === 3 && this.allGlyphData) {
        // 差值实验随机选择属性
        for (const allGlyphDataKey in this.allGlyphData) {
          let chooseAttr = []
          let threshold = .5
          for (const allGlyphDatumElement of this.allGlyphData[allGlyphDataKey]) {
            let index = Math.floor(Math.random() * attr.length)
            let attrValue_1 = this.getDataAttrNum(allGlyphDatumElement[0], attr[index].name)
            let attrValue_2 = this.getDataAttrNum(allGlyphDatumElement[1], attr[index].name)
            let differs = Math.abs(attrValue_2 - attrValue_1)
            while (differs < threshold) {
              index = Math.floor(Math.random() * attr.length)
              attrValue_1 = this.getDataAttrNum(allGlyphDatumElement[0], attr[index].name)
              attrValue_2 = this.getDataAttrNum(allGlyphDatumElement[1], attr[index].name)
              differs = Math.abs(attrValue_2 - attrValue_1)
            }
            chooseAttr.push({
              ...attr[index],
              differs,
              id: allGlyphDatumElement[0].index
            })
          }
          this.$set(this.allRandomAttrs, allGlyphDataKey, chooseAttr)
        }
      }
    },
    /**
     * 根据id和condition搜索对应的属性
     * @param condition 条件
     * @param id  原数据id
     * @return {any}
     */
    findAttrs(condition, id) {
      const key = `num_${condition}`
      const data = this.allRandomAttrs[key]
      for (const datum of data) {
        if (id === datum.id) {
          return datum
        }
      }
      return ''
    },
    // 重新练习按钮
    practiceAgain() {
      if (this.experimentSettings.isDemo) {
        this.curActive = 1
      }
    },
    // 判断分布选择是否正确
    distributionIsRight(data, chooseIndex) {
      const rightIndex = data[0].var > data[1].var ? 1 : 0
      return Number(chooseIndex) === rightIndex
    },
    // 判断指定属性值的大小关系是否正确
    smallDifferIsRight(data, chooseIndex, attr) {
      // filter返回的是一个数组
      const d_1 = data[0].data.filter(item => {
        return item.name === attr.name
      })[0].value
      const d_2 = data[1].data.filter(item => {
        return item.name === attr.name
      })[0].value
      const rightIndex = d_1 > d_2 ? 0 : 1
      return rightIndex === Number(chooseIndex)
    }
  },
  mounted() {
    // 记录下实验的开始事件（仅限正式实验）
    this.$bus.$on('saveStartTime', d => {
      const {passInfo} = d
      if (passInfo.isDemo === this.experimentSettings.isDemo && passInfo.experimentId === this.experimentSettings.experimentId) {
        this.$set(this.experimentResultInfo, 'startTime', this.getCurrentTime())
        this.$set(this.curExperimentInfo, 'startTime', this.getCurrentTime())
      }
    })
    // 下一步按钮事件
    this.$bus.$on('nextExperiment', d => {
      if (d.isDemo === this.experimentSettings.isDemo && d.experimentId === this.experimentSettings.experimentId) {
        if (this.curActive < this.totalExperimentNum) {
          this.curActive++
          // 记录当前小实验的结束时间
          this.$set(this.curExperimentInfo, 'endTime', this.getCurrentTime())
          // 将当前小实验数据放到总实验结果中
          this.experimentResultInfo.childExperiment.push({
            ...this.curExperimentInfo
          })
        }
      }
    })
    // 保存结果按钮事件
    this.$bus.$on('saveChooseResult', d => {
      if (d.isDemo === this.experimentSettings.isDemo && d.experimentId === this.experimentSettings.experimentId) {
        let isRight = false
        if (d.experimentId === 1) {
          isRight = this.distributionIsRight(this.glyphData, d.glyphIndex)
        } else if (d.experimentId === 2) {
          isRight = this.smallDifferIsRight(this.glyphData, d.glyphIndex, this.curFindAttr)
        } else {
          // 对于差值实验isRight记录的是偏差
          isRight = Number(d.glyphIndex) - this.curFindAttr.differs
        }
        // 保存相关数据
        this.curExperimentInfo = {
          ...this.curExperimentInfo,
          submitTime: d.time,
          // 对于差值实验这个记录的是差值结果
          chooseIndex: d.glyphIndex,
          chooseData: this.experimentSettings.experimentId === 3 ? this.curFindAttr.differs : this.glyphData[Number(d.glyphIndex)],
          isRight,
          stripeValue: this.maxValue / this.curCondition
        }
      }
    })
    // 导出实验结果
    this.$bus.$on('exportResult', d => {
      if (d.isDemo === this.experimentSettings.isDemo && d.experimentId === this.experimentSettings.experimentId) {
        if (!this.experimentSettings.isDemo) {
          const endTime = this.getCurrentTime()
          // 记录当前小实验的结束时间
          this.$set(this.curExperimentInfo, 'endTime', endTime)
          // 将当前小实验数据放到总实验结果中
          this.experimentResultInfo.childExperiment.push({
            ...this.curExperimentInfo
          })
          this.$set(this.experimentResultInfo, 'endTime', endTime)
          this.saveAsJson(this.experimentResultInfo, this.experimentSettings.experimentId, () => {
            this.$message({
              message: '感谢您的参与，数据已保存成功!',
              type: 'success',
              duration: 1500
            });
          })
        }
      }
    })
  },
  computed: {
    // 实验总数
    totalExperimentNum() {
      return this.glyphType.length * this.circleNum.length * this.experimentSettings.experimentNum
    },
    // 实验的相关信息
    experimentInfo() {
      return {
        isExperimentB: true,
        isDemo: this.experimentSettings.isDemo,
        experimentId: this.experimentSettings.experimentId,
        curActive: this.curActive,
        total: this.totalExperimentNum,
      }
    },
    // 可视化解释所需要的数据
    visDes() {
      let circleValue = 0, maxCircle = 10
      if (this.curShowGlyph === 1) {
        circleValue = this.peaGlyphCondition.circleValue
        maxCircle = this.peaGlyphCondition.circleNum
      } else {
        circleValue = this.stripeGlyphCondition.stripeValue
        maxCircle = this.stripeGlyphCondition.stripeNum
      }
      return {
        circleValue,
        maxCircle,
        glyphType: this.curShowGlyph
      }
    }
  },
  watch: {
    curActive: {
      immediate: true,
      handler(newVal, oldVal) {
        // 当实验刚开始的时候随机选择一种glyph实验开始
        if (newVal === 1) {
          this.curShowGlyph = Math.random() > 0.5 ? 1 : 2
          // 实验刚开始时加载数据
          this.initialGlyphData()
          // 初始化要寻找的属性
          this.initialFindAttr()
        } else if (newVal === this.totalExperimentNum / 2 + 1) {
          // 当某一个Glyph的实验全部完成后重新初始化数据并显示通知
          this.initialGlyphData()
          // 显示实验已完成提示
          this.$notify({
            title: '提示',
            message: `${this.curShowGlyph === 1 ? 'PeaGlyph' : 'StripeGlyph'}相关实验已全部完成！`,
            type: 'success',
            duration: 3000
          })
          this.curShowGlyph = 3 - this.curShowGlyph
        }
        if (newVal !== 1) {
          // 除了第一个实验之外才需要记录实验开始时间
          this.$set(this.curExperimentInfo, 'startTime', this.getCurrentTime())
        }
        // 保存当前实验的glyph类型
        this.$set(this.curExperimentInfo, 'glyphType', this.curShowGlyph)
        // 随机生成数据和选择当前显示的condition
        this.randomChooseData()
        // console.log(this.glyphData)
        this.changeGlyphLayout(this.curShowGlyph, this.curCondition)
      }
    }
  }
}
</script>

<style scoped lang="less">
.des-outline {
  border: 3px solid black;
  border-radius: 20px;

  .divider {
    border-bottom: 2px solid #cccccc;
    margin: .5vh 0;
  }
}

.glyph-name {
  text-align: center;
  font-size: 40px;
}

.static-title {
  font-size: 20px;
}

.experiment-num {
  font-size: 20px;
}

.show-center {
  text-align: center;
  margin: .5vh 0 0;
}

.task-explanation {
  margin: 0 0 1vh;
  font-size: 16px;
  font-weight: 400;

  .highlight {
    font-weight: 700;
  }
}
</style>