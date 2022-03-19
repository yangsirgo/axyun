<template>
  <div class="container">
    <div class="deptTree" style="height: 100%;">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="选择科室" name="first">
          <div class="tree_box" style="height: 100%;">
            <el-input placeholder="输入关键字进行过滤" v-model="filterText" style="height: 38px;"></el-input>
            <el-scrollbar style="height:98%">
              <el-tree
                :data="data"
                node-key="id"
                default-expand-all
                :expand-on-click-node="false"
                ref="tree"
                @node-click="handleDeptClick"
                highlight-current
                :filter-node-method="filterNode"
                style="height: 85%;overflow-y: auto;"
              >
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span>
                    <div
                      class="orgType"
                      :style="data.exts.orgType =='_TENANT_'?'color:#fff;background: #2b4583;':''"
                    >{{data.exts.orgTypeName}}</div>
                  </span>
                  <span>{{ node.label }}</span>
                </span>
              </el-tree>
            </el-scrollbar>
          </div>
        </el-tab-pane>
        <el-tab-pane label="选择角色" name="second">
          <div class="tree_box" style="height: 100%;">
            <el-input placeholder="输入关键字进行过滤" v-model="filterTextRole" style="height: 38px;"></el-input>
            <el-tree
              :data="options"
              default-expand-all
              ref="treerole"
              node-key="id"
              :filter-node-method="filterNode"
              highlight-current
              @node-click="handleRoleClick"
              style="height: 83%;overflow-y: auto;"
            >
              <div class="custom-tree-node" slot-scope="{ node,data }" style="width:100%">
                <span>{{ data.name}}</span>
                <!-- <span>{{data.name}}</span> -->
              </div>
            </el-tree>
            <!-- <div v-for="(item,index) in options" :key='index' @click="handleRoleClick">{{item.name}}</div> -->
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import { getOrgTree } from "@/api/admin/type";
import { getRoleList, getAllRole } from "@/api/admin/role";
export default {
  props: {
    isReset: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data() {
    return {
      activeName: "first",
      data: [],
      options: [],
      deptId: "",
      filterText: "",
      filterTextRole: "",
      checkedId: "",
      deptItem: {}
    };
  },
  mounted() {
    this.getOrgTree();
    this.updataTable();
  },
  methods: {
    handleClick() {
      this.deptId = "";
      this.roleId = "";
      this.filterText = "";
      this.filterTextRole = "";
    },
    getOrgTree(data) {
      getOrgTree(data).then(res => {
        if (res.code === 1) {
          console.log(res.data);
          this.data = res.data;
          console.log("res.data****", res.data);
        } else {
          this.$message("请求数据失败");
        }
      });
    },
    updataTable() {
      getAllRole().then(res => {
        if (res.code === 1) {
          this.options = res.data;
          console.log("res.data", res.data);
          console.log('options************', this.options)
        } else {
          this.$message("获取数据失败");
        }
      });
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
    // eslint-disable-next-line complexity
    getReturnNode(node, _array, value) {
      let isPass;
      if (node.data.orgId) {
        isPass =
          node.data && node.data.name && node.data.name.indexOf(value) !== -1;
        // eslint-disable-next-line no-unused-expressions
        // isPass ? _array.push(isPass) : "";
              if(isPass) {
        _array.push(isPass)
      }
      } else {
        isPass =
          node.data && node.data.label && node.data.label.indexOf(value) !== -1;
        // eslint-disable-next-line no-unused-expressions
        // isPass ? _array.push(isPass) : "";
              if(isPass) {
        _array.push(isPass)
      }
      }

      this.index++;
      console.log(this.index);
      if (!isPass && node.level != 1 && node.parent) {
        this.getReturnNode(node.parent, _array, value);
      }
    },
    handleDeptClick(row) {
      console.log("rowrowrow", row);
      if (
        row.exts.orgType == "_ORG_" ||
        row.exts.orgType == "_TENANT_" ||
        row.exts.orgType == "_HOS_"
      ) {
        this.$message("请选择科室");
        this.$refs.tree.setCurrentKey();
        return;
      }
      this.deptId = row.id;
      row.deptId = row.id;
      this.$emit("_handleSelect", row);
    },
    handleRoleClick(row) {
      this.roleId = row.id;
      row.roleId = row.id;
      this.$emit("_handleSelect", row);
    },
    handleReset() {
      this.$nextTick(function() {
        this.$refs.tree.setCurrentKey();
        this.$refs.treerole.setCurrentKey();
      });
    }
  },
  computed: {
    reSet() {
      return this.isReset;
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    filterTextRole(val) {
      this.$refs.treerole.filter(val);
    },

    reSet(val) {
      console.log("val", val);
      if (val) {
        this.handleReset();
        // this.$refs.tree.setCurrentKey();
        // this.$refs.treerole.setCurrentKey();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.formList {
  margin-bottom: 10px;
}
/deep/.el-button--primary {
  width: 45%;
  margin-top: 15px;
}
.container {
  height: 100%;
}
.el-tabs {
  height: 100%;
}
.el-tabs__content {
  height: 100%;
}
.deptTree {
  padding: 15px 10px;
}
.roleTree {
  padding: 15px 20px;
}
/deep/.cardtitle {
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #fff;
}
/deep/.cardtitle .titleleft::before {
  content: "";
  float: left;
  width: 4px;
  height: 20px;
  background: #2b4583;
  margin-right: 10px;
  margin-top: 15px;
}
/deep/.el-tabs__nav {
  width: 100%;
}
/deep/.el-tabs__item {
  width: 50%;
  text-align: center;
}
/deep/.el-input--medium {
  width: 100%;
}
/deep/.el-scrollbar .el-scrollbar__wrap {
  overflow-x: hidden;
  display: block;
}
/deep/.el-tree > .el-tree-node {
  // height: 100%; //这里的高根据实际情况
  min-width: 100%;
  display: inline-block;
}
/deep/.el-scrollbar__view {
  height: 100%;
}
.custom-tree-node {

  font-size: 14px;
  padding-right: 8px;
}
.orgType {
  padding: 3px 5px;
  border: 1px solid $l-color-primary;
  display: inline-block;
  margin-left: 10px;
  border-radius: 4px;
  color: $l-color-primary;
  font-size: 10px;
  line-height: 10px;
  margin-right: 10px;
}
</style>