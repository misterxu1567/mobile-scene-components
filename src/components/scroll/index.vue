<template>
  <div class="scrollContainer">
    <slot v-for="(item, index) in allData" :data="item"></slot>
  </div>
</template>

<script>
export default {
  name: "Scroll",
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      renderDone: false,
      allData: []
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      document.addEventListener("scroll", () => {
        this.scrollLoad();
      });
    },
    scrollLoad() {
      function throttle(method, context) {
        clearTimeout(method.tId);
        method.tId = setTimeout(function() {
          method.call(context);
        }, 500);
      }
      throttle(() => {
        if (this.isBom() && this.renderDone) {
          this.$emit("load");
          this.renderDone = false;
        } else {
          return false;
        }
      });
    },
    isBom() {
      var documentHeight = document.body.scrollHeight;
      var winHeight = document.documentElement.clientHeight;
      var scrollHeight =
        document.documentElement.scrollTop || document.body.scrollTop;
      return documentHeight - winHeight <= scrollHeight;
    },
    resolveData() {
      this.allData.push(...this.data);
      this.renderDone = true;
    }
  },
  watch: {
    data: {
      handler(newVal) {
        this.$nextTick().then(() => {
          this.resolveData();
        });
      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
.scrollContainer {
  width: 100%;
  height: auto;
  overflow: hidden;
}
</style>