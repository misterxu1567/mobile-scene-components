<template>
  <div class="box">
    <br>
    <h4>水平</h4>
    <br>
    <div class="item">
      <Slider v-model="value1" :max="100" :min="0" />
      <span class="val">{{value1}}%</span>
    </div>
    <br>
    <br>
    <h4>垂直</h4>
    <br>
    <div class="item vertical">
      <Slider v-model="value2" :max="90" :min="0" type="vertical" class="verticalSlider" />
      <span class="val">{{value2}}%</span>
    </div>
  </div>
</template>

<script>
import Slider from "../../components/slider";

export default {
  name: "SliderDemo",
  components: {
    Slider
  },
  data() {
    return {
      value1: 40,
      value2: 50
    };
  }
};
</script>
<style lang="scss" scoped>
.box{
  padding: 0 10px;
  .item{
    margin: 10px 0;
    display: flex;
    align-items: center;
    .val{
      margin-left: 20px;
    }
    &.vertical{
      display: block;
    }
  }
}
.verticalSlider{
  margin-top: 50px;
  width: 160px;
  height: 4px;
}
</style>