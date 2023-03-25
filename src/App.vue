<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import userPage from "@/pages/userPage.vue";

export default {
  name: 'App',
  components: {
    userPage
  },
  beforeCreate() {
    // 加载ssi数据
    this.$store.dispatch('loadSSIData')
  },
  created() {

  }
}
</script>

<style>
*{
  font-family: "Gotham Black";
}
</style>
