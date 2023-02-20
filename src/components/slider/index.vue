<template>
  <input
    :class="['slider', type]"
    type="range"
    :max="max"
    :min="min"
    :value="value"
    :style="{background: `linear-gradient(to right, ${color} 0%, ${color} ${value * 100 / max}%, #eee ${value * 100 / max}%, #eee)`}"
    @input="handleChange($event)"
  />
</template>

<script>
export default {
  name: "Slider",
  props: {
    max: {
      type: Number,
      default: 100
    },
    min: {
      type: Number,
      default: 0
    },
    color: {
      type: String,
      default: "#22d6af"
    },
    value: {
      type: Number,
      default: 0
    },
    // vertical => 垂直
    type: {
      type: String,
      default: 'horizontal'
    }
  },
  methods: {
    handleChange(e){
      let value = parseInt(e.target.value);
      this.$emit('input', value);
      this.$emit('change', value);
    }
  }
};
</script>

<style lang="scss" scoped>
.slider {
  width: 100%;
  height: 2px;
  &.vertical{
    transform: rotate(-90deg);
  }
  /*横条样式*/
  &[type="range"] {
    -webkit-appearance: none;
  }
  /*拖动块的样式*/
  &[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 16px;
    width: 16px;
    background: #fff;
    margin-top: -1px;
    border-radius: 50%;
    border:1px solid #efefef;
  }
}
</style>
