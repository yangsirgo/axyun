<template>
  <div @click="onFieldClick" class="edit-cell">
    <div tabindex="0"
      v-if="!editMode"
      class="cell-content"
      @focus="onFieldClick"
      :class="{'edit-enabled-cell': editable}"
      @keyup.enter="onFieldClick"
    >
      <slot name="content" v-slot="editMode"></slot>
    </div>
    <component :is="editableComponent"
      v-if="editMode"
      ref="input"
      @change="onInputChange"
      @blur="onTabHandler"
      @keyup.prevent="onClickHandler"
      v-on="listeners"
      v-bind="$attrs"
      v-model="model"
    >
      <slot name="edit-component-slot" v-slot="editMode"></slot>
    </component>
  </div>
</template>
<script>
export default {
  name: "editable-cell",
  inheritAttrs: false,
  props: {
    value: {
      type: [String, Boolean, Array, Number],
      default: ""
    },
    showInput: {
      type: Boolean,
      default: false
    },
    editableComponent: {
      type: String,
      default: "el-input"
    },
    closeEvent: {
      type: String,
      default: "blur"
    },
    editable: {
      type: Boolean,
      default: false
    },
    stopTab: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      editMode: false
    };
  },
  computed: {
    model: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("change", val);
        this.$emit("update:value", val);
      }
    },
    listeners() {
      return {
        [this.closeEvent]: this.onInputExit,
        ...this.$listeners
      };
    }
  },
  // mounted() {
  //   // 做tab事件的拦截处理
  //   window.addEventListener("keyup", this.onClickHandler);
  // },
  // beforeDestroy() {
  //   window.removeEventListener("keyup", this.onClickHandler);
  // },
  methods: {
    onClickHandler(event) {
      event.cancelBubble = true;
      event.preventDefault();
      console.log(event);
      // if (event.keyCode === 9 && this.stopTab && this.editMode) {
      //   console.log("---stop-tab---");
      //   event.cancelBubble = true;
      //   event.preventDefault();
      //   this.$emit("stopTab");
      // }
    },
    onTabHandler() {
      console.log("blur---", this.value);
      this.editMode = false;
    },
    onFieldClick() {
      console.log("enter---", this.value);
      if (this.editable) {
        this.editMode = true;
        this.$nextTick(() => {
          let inputRef = this.$refs.input;
          if (inputRef && inputRef.focus) {
            inputRef.focus();
          }
          if (this.editableComponent === "el-select" || this.editableComponent === "el-cascader") { 
            if (inputRef && inputRef.$el && inputRef.$el.click) {
              inputRef.$el.click();
            }
          }
        });
      }
    },
    onInputExit() {
      this.editMode = false;
    },
    onInputChange(val) {
      this.$emit("change", val);
    },
    onTab() {
      console.log(this.value);
      this.$emit("blur");
    }
  }
};
</script>
<style>
.cell-content {
  
  border: 1px solid transparent;
}
.edit-enabled-cell {
  border: 1px dashed #409eff;
}
</style>