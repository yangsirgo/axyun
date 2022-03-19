<template>
  <el-dialog
    :visible.sync="hosVisible"
    title="选择医院"
    class="tree_dialog"
    append-to-body
    :before-close="handleCancel"
  >
    <div class="tree_box" style="height: 100%;padding-bottom:20px;">
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText"
        style="width: 255px;margin:10px 20px;height: 38px;"
      ></el-input>
      <el-tree
        :data="data"
        default-expand-all
        node-key="id"
        ref="tree"
        highlight-current
        :filter-node-method="filterNode"
        show-checkbox
        style="height: 350px;overflow-y: auto;margin-left: 20px"
        @check-change="handleCheck"
        :check-strictly="true"
        :props="defaultProps"
      ></el-tree>
      <div style="text-align: right;margin-right: 30px">
        <span>
          <el-button type="primary" @click="handleOk">确 定</el-button>
          <el-button @click="handleCancel">取 消</el-button>
        </span>
      </div>
    </div>
  </el-dialog>
</template>
<script>
//   import {getOrgTree} from "@/api/admin/type"
import { log } from "util";
export default {
  data() {
    return {
      isCheck: false,
      filterText: "",
      checkedId: "",
      deptItem: {},
      defaultProps: {
        children: "children",
        label: "label",
        disabled: this.disabledFn
      }
    };
  },
  mounted() {
    //   this.getOrgTree()
  },
  props: {
    hosVisible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    // id: {
    //   type: Array,
    //   default() {
    //     return [];
    //   }
    // },
    hosIds: {
      type: Array,
      default() {
        return [];
      }
    },
    data: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  methods: {
    //清空树
    clearTree() {
      this.$nextTick(function() {
        this.$refs.tree.setCheckedKeys([]);
      });
    },
    disabledFn(data, node) {
      console.log('data', data)
      if (data.exts.orgType == "_ORG_" || data.exts.orgType == "_TENANT_") {
        return true;
      }
        console.log('this.hosIds', this.hosIds,data.id)
        if(this.hosIds.indexOf(data.id+'')==-1){
          return true
        }
        

    },
    //加载树
    // 确定按钮
    handleOk() {
      let data = this.$refs.tree.getCheckedNodes();
      console.log(data);
      if (data) {
        this.$emit("handleHos", data[0]);
        return;
      }
    },
    //取消按钮
    handleCancel() {
      this.$emit("handleHos");
    },
    //单选
    handleCheck(data, check) {
      console.log(data, check);
      if (check) {
        let arr = [data.id];
        this.$refs.tree.setCheckedKeys(arr);
      }
    },
    //搜索显示子节点
    filterNode(value, data, node) {
      if (!value) {
        return true;
      }
      let _array = [];
      this.getReturnNode(node, _array, value);
      let result = false;
      _array.forEach(item => {
        result = result || item;
      });
      return result;
    },
    getReturnNode(node, _array, value) {
      let isPass =
        node.data && node.data.label && node.data.label.indexOf(value) !== -1;
      isPass ? _array.push(isPass) : "";
      this.index++;
      console.log(this.index);
      if (!isPass && node.level != 1 && node.parent) {
        this.getReturnNode(node.parent, _array, value);
      }
    }
  },
  computed: {
    visible() {
      return this.hosVisible;
    }
  },
  watch: {
    //监听id

    filterText(val) {
      this.$refs.tree.filter(val);
    },
    visible(val) {
      if (val) {
        this.clearTree();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/.el-form-item__content {
  margin-left: 0px !important;
}
</style>
