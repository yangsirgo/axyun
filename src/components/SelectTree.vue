<template>
  <div class>
    <i
      class="el-icon-circle-close icon"
      v-if="selectValue"
      @click="handleClear"
    ></i>
    <el-select
      v-model="selectValue"
      placeholder="请选择"
      :disabled="disableSelect"
    >
      <el-option
        :value="treeValue"
        style="height: auto; max-height: 500px; width: 300px"
      >
        <el-tree
          :data="data"
          default-expand-all
          show-checkbox
          :node-key="keyValue"
          ref="tree"
          highlight-current
          :props="defaultProps"
          :check-strictly="true"
          :default-checked-keys="[treeValue]"
          @check-change="handleCheckChange"
        ></el-tree>
      </el-option>
    </el-select>
    <div
      class="el-form-item__error"
      v-if="isRequest && !validateSelect"
      style="margin-left: 50px"
    >
      {{ validateContent }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },

    disableSelect: {
      type: Boolean,
      default() {
        return false;
      }
    },

    isRequest: {
      type: Boolean,
      default() {
        return false;
      }
    },
    validateSelect: {
      type: Boolean,
      default() {
        return true;
      }
    },
    validateContent: {
      type: String,
      default() {
        return "";
      }
    },

    treeValue: {
      default() {
        return null;
      }
    },

    keyValue: {
      type: String,
      default() {
        return "";
      }
    },

    selectValue: {
      type: String,
      default() {
        return "";
      }
    }
  },

  watch: {
    treeValue(val) {
      if (!val) {
        this.$refs.tree.setCheckedKeys([]);
      }
    }
  },

  methods: {
    handleCheckChange(data, check) {
      if (check) {
        let arr = [data[this.keyValue]];
        this.$refs.tree.setCheckedKeys(arr);
        this.$emit("handleSelect", data);
      }
    },

    handleClear() {
      this.$refs.tree.setCheckedKeys([]);
      this.$emit("handleSelect", {});
    }
  }
};
</script>

<style lang="scss" scoped>
.el-select-dropdown__item.hover {
  background: #fff;
}
/deep/.el-select--medium {
  width: 100%;
}
.icon {
  color: rgb(192, 196, 204);
  position: absolute;
  z-index: 999999;
  right: 46px;
  right: 35px;
  top: 50%;
  margin-top: -5px;
}
</style>
