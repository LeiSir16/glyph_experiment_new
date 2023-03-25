<template>
  <div>
    <!--任务描述部分-->
    <el-row type="flex" justify="center" align="middle" class="task-des">
      <el-col :span="23" :offset="1">
        <slot name="task"></slot>
      </el-col>
    </el-row>
    <!--任务解释部分-->
    <el-row type="flex" justify="center" align="middle" class="task-des">
      <el-col :span="23" :offset="1">
        <slot name="explanation"></slot>
      </el-col>
    </el-row>
    <!--实验一二的任务-->
    <el-row type="flex"
            justify="center"
            align="middle"
            style="margin-bottom: 15px"
            v-if="this.experimentInfo.experimentId !== 3">
      <el-col :span="5" class="radio-label" :offset="1">
        <span>Graph：</span>
      </el-col>
      <el-col :span="16" :offset="2">
        <el-radio-group v-model="glyphIndex">
          <el-radio-button label="0"><span class="glyph-label">A</span></el-radio-button>
          <el-radio-button label="1"><span class="glyph-label">B</span></el-radio-button>
        </el-radio-group>
      </el-col>
    </el-row>
    <!--实验三的任务-->
    <el-row type="flex"
            justify="start"
            align="middle"
            style="margin-bottom: 15px"
            v-if="this.experimentInfo.experimentId === 3">
      <el-col :span="7" class="radio-label" :offset="1">
        <span>Difference：</span>
      </el-col>
      <el-col :span="7">
        <el-input-number
            v-model="glyphIndex"
            :min="0"
            :max="10"
            :step=".01"
            :precision="2"
        ></el-input-number>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center" align="middle" style="margin-bottom: 1vh">
      <el-col :span="5" class="text-center" :offset="3">
        <el-button type="primary" @click="saveResult">Save</el-button>
      </el-col>
      <el-col :span="12" class="text-center">
        <el-button type="success" @click="nextStep" v-show="!isShowSubmitBtn" :disabled="!isSaveResult">Next<i
            class="el-icon-arrow-right el-icon--right"></i></el-button>
        <el-button type="danger" @click="submitResult" v-show="isShowSubmitBtn" :disabled="!isSaveResult">Export
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {publicFun} from "@/mixin";

export default {
  name: "experimentBTask",
  props: ['experimentInfo'],
  data() {
    return {
      glyphIndex: '',
      isSaveResult: false,
    }
  },
  mixins: [publicFun],
  methods: {
    // 下一个小实验
    nextStep() {
      this.$bus.$emit('nextExperiment', {
        isDemo: this.experimentInfo.isDemo,
        experimentId: this.experimentInfo.experimentId
      })
    },
    // 保存实验结果
    saveResult() {
      if (this.glyphIndex === '') {
        let msg = '您还未选择可视化图形!'
        if (this.experimentInfo.experimentId === 3) {
          msg = '您还未输入估算结果!'
        }
        this.$message({
          type: 'error',
          message: msg,
          duration: 1500
        })
      } else {
        this.$confirm('确定保存您的选择结果吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 如果不是练习的话可以提交结果
          if (!this.experimentInfo.isDemo) {
            this.$bus.$emit('saveChooseResult', {
              isDemo: this.experimentInfo.isDemo,
              experimentId: this.experimentInfo.experimentId,
              // 选择的glyph
              glyphIndex: Number(this.glyphIndex),
              // 当前保存的时间
              time: this.getCurrentTime()
            })
          }
          this.isSaveResult = true
          this.$message({
            type: 'success',
            message: '保存成功!',
            duration: 1500
          })
        }).catch(() => {
          console.log('已取消保存')
        })
      }
    },
    // 提交结果事件
    submitResult() {
      this.$bus.$emit('exportResult', {
        isDemo: this.experimentInfo.isDemo,
        experimentId: this.experimentInfo.experimentId,
      })
    }
  },
  computed: {
    isShowSubmitBtn() {
      return this.experimentInfo.curActive === this.experimentInfo.total
    }
  },
  watch: {
    'experimentInfo.curActive': {
      immediate: true,
      handler(newVal) {
        this.isSaveResult = false
        this.glyphIndex = ''
      }
    }
  }
}
</script>

<style scoped lang="less">
.task-des {
  font-size: 18px;
  font-weight: 700;
}

.text-center {
  text-align: center;
}

.radio-label {
  font-size: 18px;
  font-weight: 700;
}

.glyph-label {
  font-size: 18px;
  font-weight: 700;
}
</style>