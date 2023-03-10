<template>
  <div class="main-page">
    <el-tabs v-model="activeTab" @tab-click="tabClicks">
      <el-tab-pane name="GlyphDesign">
        <span slot="label" class="tab-item-title">可视化设计</span>
        <VisualizationDesign/>
      </el-tab-pane>
      <el-tab-pane name="DistributionPractice">
        <span slot="label" class="tab-item-title">实验一(实验练习)</span>
        <ExperimentB :experiment-settings="distributionPractice"/>
      </el-tab-pane>
      <el-tab-pane name="Distribution">
        <span slot="label" class="tab-item-title">实验一(正式实验)</span>
        <ExperimentB :experiment-settings="distribution"/>
      </el-tab-pane>
      <el-tab-pane name="SmallDifferPractice">
        <span slot="label" class="tab-item-title">实验二(实验练习)</span>
        <ExperimentB :experiment-settings="smallDifferPractice"/>
      </el-tab-pane>
      <el-tab-pane name="SmallDiffer">
        <span slot="label" class="tab-item-title">实验二(正式实验)</span>
        <ExperimentB :experiment-settings="smallDiffer"/>
      </el-tab-pane>
      <el-tab-pane name="AccuracyDifferPractice">
        <span slot="label" class="tab-item-title">实验三(实验练习)</span>
        <ExperimentB :experiment-settings="accuracyDifferPractice"/>
      </el-tab-pane>
      <el-tab-pane name="AccuracyDiffer">
        <span slot="label" class="tab-item-title">实验三(正式实验)</span>
        <ExperimentB :experiment-settings="accuracyDiffer"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ExperimentB from "@/components/ExperimentB.vue";
import VisualizationDesign from "@/components/VisualizationDesign.vue";

export default {
  name: "mainPage",
  data() {
    return {
      activeTab: 'GlyphDesign',
      distributionPractice: {
        isDemo: true,
        // 1分布实验，2微小差值实验
        experimentId: 1,
        experimentNum: 1
      },
      distribution: {
        isDemo: false,
        experimentId: 1,
        experimentNum: 10
      },
      smallDifferPractice: {
        isDemo: true,
        // 1分布实验练习，2微小差值实验
        experimentId: 2,
        experimentNum: 1
      },
      smallDiffer: {
        isDemo: false,
        experimentId: 2,
        experimentNum: 10
      },
      accuracyDifferPractice: {
        isDemo: true,
        // 1分布实验练习，2微小差值实验
        experimentId: 3,
        experimentNum: 1
      },
      accuracyDiffer: {
        isDemo: false,
        // 1分布实验练习，2微小差值实验
        experimentId: 3,
        experimentNum: 10
      }
    }
  },
  components: {
    ExperimentB,
    VisualizationDesign
  },
  methods: {
    // 切换tab时通知需要记录时间的tabpane记录对应的时间
    tabClicks(e) {
      const paneName = e.name
      if (paneName === 'Distribution') {
        this.$bus.$emit('saveStartTime', {
          passInfo: this.distribution
        })
      } else if (paneName === 'SmallDiffer') {
        this.$bus.$emit('saveStartTime', {
          passInfo: this.smallDiffer
        })
      } else if (paneName === "AccuracyDiffer") {
        this.$bus.$emit('saveStartTime', {
          passInfo: this.accuracyDiffer
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
.main-page {
  margin: 0 10px;

  .tab-item-title {
    font-weight: bolder;
    font-size: 20px;
  }

}
</style>