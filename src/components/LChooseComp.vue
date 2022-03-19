<template>
  <div :class="wrapperCls()" ref="inputWrap">
    <div
      class="l-input-body"
      :style="{
        paddingLeft: paddingLeft + 'px',
        paddingRight: paddingRight + 'px'
      }"
    >
      <div class="l-input-body-main">
        <slot></slot>
      </div>
      <div class="l-input-body-left" v-if="showLeftFlag">
        <span class="l-input-title" ref="title">{{ label }}:</span>
      </div>
      <div class="l-input-body-right" v-if="showRightFlag">
        <span class="l-input-title" ref="title">:{{ label }}</span>
      </div>
    </div>
  </div>
</template>

<script>
const defaultTitleWidth = "40";

export default {
  name: "LFormtTitle",
  props: {
    label: {
      type: String,
      require: true
    },
    labelWidth: {
      type: [String, Number],
      default: defaultTitleWidth
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    displayMode: {
      type: String,
      default: "left"
    }
  },
  data() {
    return {
      paddingLeft: "0",
      paddingRight: "0"
    };
  },
  watch: {
    label() {
      this.getTitleWidth();
    },
    displayMode(val) {
      if (val === "" || val === "left") {
        this.paddingLeft = "56";
        this.paddingRight = "0";
      } else if (val === "right") {
        this.paddingLeft = "0";
        this.paddingRight = "56";
      } else if (val === "hidden") {
        this.paddingLeft = "0";
        this.paddingRight = "0";
      }
    }
  },
  computed: {
    showLeftFlag() {
      return this.displayMode === "left" || this.displayMode === "";
    },
    showRightFlag() {
      return this.displayMode === "right";
    }
  },
  methods: {
    //获取 title 的宽度
    getTitleWidth() {
      let me = this;
      this.$nextTick(() => {
        if (me.displayMode === "left" || me.displayMode === "") {
          me.paddingLeft = me.$refs.title.clientWidth;
        } else if (me.displayMode === "right") {
          me.paddingRight = me.$refs.title.clientWidth;
        }
      });
    },
    wrapperCls() {
      return {
        "l-input-wrap": true,
        required: this.required,
        disabled: this.disabled
      };
    }
  },
  mounted() {
    this.getTitleWidth();
  },
  updated() {
    this.getTitleWidth();
  }
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/variable.scss";
$color: rgba(148, 157, 163, 1);
$titleColor: #949da3;
$titleDefaultWidth: 40px;
$leftPadding: 56px;
.l-input-wrap {
  display: inline-block;
  white-space: nowrap;
  color: $color;
  box-sizing: border-box;
  transition: 0.1s;
  font-weight: 500;
  font-size: 14px;
  height: 36px;
  width: 100%;
  text-align: left;

  .l-input-body {
    width: 100%;
    height: 100%;
    position: relative;
    display: inline-block;
    font-size: 0;
    padding-left: $leftPadding;

    .l-input-body-main {
      float: left;
      width: 100%;
      line-height: 36px;
      font-size: 14px;
      overflow-x: auto;
      padding-left: 10px;
      > div {
        width: 100%;
      }
    }

    .l-input-body-left {
      width: auto;
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      .l-input-title {
        font-size: 14px;
        font-weight: 400;
        color: $titleColor;
        line-height: 33px;
        display: inline-block;
        padding: 0 10px;
      }
    }
    .l-input-body-right {
      width: auto;
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      .l-input-title {
        font-size: 14px;
        font-weight: 400;
        color: $titleColor;
        line-height: 33px;
        display: inline-block;
        padding: 0 10px;
      }
    }
  }
}

@media screen and (max-width: $resolution-ratio-width) {
}
</style>
<style lang="scss">
</style>
