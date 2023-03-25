<template>
  <div class="show-panel">
    <div class="control-panel">
      <demo-adjustment-panel :key-control="keyControl"/>
    </div>
    <div class="show-glyph">
      <stripe-glyph-demo ref="myStripe" :layout-strategies="layoutStrategies"/>
    </div>
  </div>
</template>

<script>
import stripeGlyphDemo from "@/components/stripeGlyphDemo.vue";
import demoAdjustmentPanel from "@/components/demoAdjustmentPanel.vue";

export default {
  name: "glyphDemo",
  props: ['layoutStrategies'],
  components: {
    stripeGlyphDemo,
    demoAdjustmentPanel
  },
  computed: {
    keyControl() {
      return {
        layoutStrategies: this.layoutStrategies,
      }
    }
  }
}
</script>

<style scoped>
.show-panel {
  display: flex;
  justify-content: center;
  align-items: center;
}

.control-panel {
  height: 100%;
  width: 30%;
}

.show-glyph {
  height: 100%;
  width: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2% 0;
}
</style>