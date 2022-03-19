<template>
  <div>
    <transition name="fade">
      <div class="v-modal" style="z-index: 2030;" @click="handleMask" v-if="mask" v-show="visible"></div>
    </transition>
    <div :class="wrapClasses" @click="handleWrapClick">
      <transition :name="'move-' + placement">
        <div :class="classes" :style="mainStyles" v-show="visible">
          <div :class="contentClasses" ref="content">
            <a class="l-drawer-close" v-if="closable" @click="close">
              <slot name="close">
                <i class="el-icon-close"></i>
              </slot>
            </a>
            <div :class="[prefixCls + '-header']" v-if="showHead">
              <slot name="header">
                <div :class="[prefixCls + '-header-inner']">{{ title }}</div>
              </slot>
            </div>
            <div :class="[prefixCls + '-body']" :style="styles">
              <slot></slot>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { oneOf } from '@/utils'

const prefixCls = 'l-drawer'
export default {
  name: 'LDrawer',
  props: {
    title: {
      type: String
    },
    value: {
      type: Boolean,
      default: false
    },
    width: {
      type: [Number, String],
      default: 256
    },
    mask: {
      type: Boolean,
      default: true
    },
    closable: {
      type: Boolean,
      default: true
    },
    maskClosable: {
      type: Boolean,
      default: true
    },

    className: {
      type: String
    },
    placement: {
      validator(value) {
        return oneOf(value, ['left', 'right']);
      },
      default: 'right'
    },
    styles: {
      type: Object
    }
  },
  data() {
    return {
      prefixCls: prefixCls,
      timer: null, // 抽屉消失动画 延迟时间对象
      wrapShow: false,
      showHead: true,
      visible: this.value
    };
  },
  methods: {
    close() {
      return this.handleClose();
    },
    handleClose() {
      this.visible = false;
      this.$emit('input', false);
      this.$emit('on-close');
    },
    handleMask() {
      if (this.maskClosable && this.mask) {
        this.close();
      }
    },
    handleWrapClick(event) {
      const className = event.target.getAttribute('class');
      if (className && className.indexOf(`${prefixCls}-wrap`) > -1) {
        this.handleMask();
      }
    }
  },
  computed: {
    contentClasses() {
      return [
        `${prefixCls}-content`,
        {
          [`${prefixCls}-content-no-mask`]: !this.mask
        }
      ];
    },
    classes() {
      return [
        `${prefixCls}`,
        `${prefixCls}-${this.placement}`,
        {
          [`${prefixCls}-no-header`]: !this.showHead
        }
      ];
    },
    wrapClasses() {
      return [
        `${prefixCls}-wrap`,
        {
          [`${prefixCls}-hidden`]: !this.wrapShow,
          [`${this.className}`]: !!this.className,
          [`${prefixCls}-no-mask`]: !this.mask
        }
      ];
    },
    mainStyles() {
      let style = {};
      const width = parseInt(this.width);
      const styleWidth = {
        width: width <= 100 ? `${width}%` : `${width}px`
      };
      Object.assign(style, styleWidth);
      return style;
    }
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    title(val) {
      if (this.$slots.header === undefined) {
        this.showHead = !!val;
      }
    },
    visible(val) {
      if (val === false) {
        this.timer = setTimeout(() => {
          this.wrapShow = false;
        }, 300);
      } else {
        if (this.timer) {
          clearTimeout(this.timer);
        }
        this.wrapShow = true;
      }
      this.$emit('on-visible-change', val);
    }
  },
  mounted() {
    if (this.visible) {
      this.wrapShow = true;
    }

    let showHead = true;
    if (this.$slots.header === undefined && !this.title) {
      showHead = false;
    }
    this.showHead = showHead;
  }
};
</script>

<style scoped lang="scss">
.l-drawer-wrap {
  position: fixed;
  overflow: auto;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10000;
  outline: 0;
}

.l-drawer-hidden {
  display: none !important;
}

.l-drawer-wrap * {
  box-sizing: border-box;
}

.l-drawer {
  width: 256px;
  height: 100%;
  position: fixed;
  top: 0;

  &-right {
    right: 0;
  }

  &-left {
    left: 0;
  }

  &-content {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    background-color: #fff;
    border: 0;
    background-clip: padding-box;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &-header {
    border-bottom: 1px solid #e8eaec;
    padding: 14px 16px;
    line-height: 1;
  }

  &-header-inner,
  &-header p {
    display: inline-block;
    width: 100%;
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    color: #17233d;
    font-weight: 700;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &-body {
    width: 100%;
    height: calc(100% - 51px);
    padding: 16px;
    font-size: 12px;
    line-height: 1.5;
    word-wrap: break-word;
    position: absolute;
    overflow: auto;
  }

  &-close {
    z-index: 1;
    font-size: 12px;
    position: absolute;
    right: 8px;
    top: 8px;
    overflow: hidden;
    cursor: pointer;
    .el-icon-close {
      font-size: 20px;
      color: #999;
      transition: color 0.2s ease;
      position: relative;
      top: 1px;
    }
  }
}

.fade-enter-active,
.fade-appear {
  opacity: 0;
  animation-timing-function: linear;
  animation-name: ivuFadeIn;
  animation-play-state: running;
  animation-duration: 0.3s;
  animation-fill-mode: both;
}

.fade-leave-active {
  animation-timing-function: linear;
  animation-name: ivuFadeOut;
  animation-play-state: running;
  animation-duration: 0.3s;
  animation-fill-mode: both;
}

.move-left-enter-active {
  opacity: 0;
  animation-timing-function: ease-in-out;
  animation-name: ivuMoveLeftIn;
  animation-play-state: running;
  animation-duration: 0.3s;
  animation-fill-mode: both;
}

.move-right-enter-active {
  opacity: 0;
  animation-timing-function: ease-in-out;
  animation-name: ivuMoveRightIn;
  animation-play-state: running;
  animation-duration: 0.3s;
  animation-fill-mode: both;
}

.move-left-leave-active {
  animation-timing-function: ease-in-out;
  animation-name: ivuMoveLeftOut;
  animation-play-state: running;
  animation-duration: 0.3s;
  animation-fill-mode: both;
}

.move-right-leave-active {
  animation-timing-function: ease-in-out;
  animation-name: ivuMoveRightOut;
  animation-play-state: running;
  animation-duration: 0.3s;
  animation-fill-mode: both;
}

@keyframes ivuMoveLeftIn {
  0% {
    transform-origin: 0 0;
    transform: translateX(-100%);
    opacity: 0;
  }
  100% {
    transform-origin: 0 0;
    transform: translateX(0%);
    opacity: 1;
  }
}

@keyframes ivuMoveLeftOut {
  0% {
    transform-origin: 0 0;
    transform: translateX(0%);
    opacity: 1;
  }
  100% {
    transform-origin: 0 0;
    transform: translateX(-100%);
    opacity: 0;
  }
}

@keyframes ivuMoveRightIn {
  0% {
    opacity: 0;
    transform-origin: 0 0;
    transform: translateX(100%);
  }
  100% {
    opacity: 1;
    transform-origin: 0 0;
    transform: translateX(0%);
  }
}

@keyframes ivuMoveRightOut {
  0% {
    transform-origin: 0 0;
    transform: translateX(0%);
    opacity: 1;
  }
  100% {
    transform-origin: 0 0;
    transform: translateX(100%);
    opacity: 0;
  }
}

@keyframes ivuFadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 0.5;
  }
}

@keyframes ivuFadeOut {
  0% {
    opacity: 0.5;
  }
  100% {
    opacity: 0;
  }
}
</style>
