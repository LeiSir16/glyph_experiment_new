<template>
  <div>
    <el-container>
      <el-header>
        <el-row>
          <el-col :span="24">
            <h1>欢迎参加本次实验</h1>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <el-row>
          <el-col :span="24">
            <h4 style="color: grey">请允许我们收集您的一些个人信息</h4>
          </el-col>
        </el-row>
        <el-row type="flex" justify="left" align="middle">
          <el-col :span="7" :offset="8">
            <!--:model校验的时候要保证该字段与信息对象变量名一致-->
            <el-form label-position="right" ref="formUser" label-width="80px" :model="userInfo">
              <el-form-item label="实验编号">
                <el-input v-model="userInfo.sId" readonly></el-input>
              </el-form-item>
              <el-form-item label="姓名" prop="name">
                <el-input v-model="userInfo.name" placeholder="请输入您的姓名" clearable></el-input>
              </el-form-item>
              <el-form-item label="性别" class="gender">
                <el-radio-group v-model="userInfo.gender">
                  <el-radio label="男"></el-radio>
                  <el-radio label="女"></el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="年龄" prop="age">
                <el-input v-model.number="userInfo.age" placeholder="请输入您的年龄" clearable></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="startExperiment" class="begin-experiment">开始实验
                </el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <h3 style="color: red">
              请在屏幕1920x1080分辨率，100%缩放的环境下完成实验，实验过程中请勿缩放浏览器
            </h3>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {publicFun} from "@/mixin";

export default {
  name: "userPage",
  mixins: [publicFun],
  data() {
    return {
      userInfo: {
        sId: '',
        gender: '男',
        name: '',
        age: 23
      }
    }
  },
  created() {
    // 自动生成唯一编号
    this.$set(this.userInfo, 'sId', this.getId())
  },
  methods: {
    startExperiment() {
      // 将用户相关信息存在vuex中
      this.$store.dispatch('storeUserInfo', this.userInfo)
      this.$router.push({
        name: 'mainPage'
      })
    }
  }
}
</script>

<style scoped lang="less">
.el-container {
  text-align: center;

  .gender {
    text-align: left;
  }

  .begin-experiment {
    width: 100%;
    font-size: 18px;
    font-weight: 700;
  }
}


</style>