<template>
  <div class="contain">
    <div>
      <el-checkbox-group
        class="scopeLevel"
        v-model="scopeLevel"
        @change="getTemplate"
      >
        <el-checkbox label="level0">全院</el-checkbox>
        <el-checkbox label="level1">科室</el-checkbox>
        <el-checkbox label="level2">个人</el-checkbox>
      </el-checkbox-group>
      <!-- 检索 -->
      <el-input
        class="keyword"
        placeholder="请输入检索条件"
        type="text"
        v-model="filterText"
        @keyup.enter.native="handleSearch"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click.native="handleSearch"
        ></el-button>
      </el-input>
      <div class="templTable">
        <el-row
          class="tree_box"
          v-loading="loading"
          style="
            height: 88%;
            padding-left: 10px;
            padding-right: 10px;
            padding-bottom: 20px;
          "
        >
          <el-tree
            id="myTree"
            :expand-on-click-node="false"
            :data="treeData"
            default-expand-all
            node-key="_id"
            ref="tree"
            @node-click="handleChange"
            :filter-node-method="filterNode"
            :props="defaultProps"
            style="height: 100%; overflow-y: auto"
          >
            <span class="custom-tree-node" slot-scope="{ node }">
              <div v-if="!node.data.parentId && !node.data.children">
                <el-popover
                  placement="left"
                  :title="node.data.label"
                  width="400"
                  trigger="hover"
                  :content="node.data.exts ? node.data.exts.kLibContent : ''"
                >
                  <span slot="reference"
                    ><span style="color: red">{{ node.data.label }}</span></span
                  >
                </el-popover>
              </div>
              <span v-else>{{ node.data.label }}</span>
            </span>
          </el-tree>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getKLibTpTree,
  getKLibTree,
  getList,
  getDetail,
  removeBatch,
  multiUpdate,
  deleteKnowledgeLibTp,
} from "@/api/emrRecord/emr/knowledge.js";

export default {
  name: "knowledgeBase",
  components: {},
  data() {
    return {
      keyword: "",
      scopeLevel: ["level0"],
      loading: false,
      defaultProps: {
        children: "children",
        label: "label",
      },
      filterText: "",
      treeData: [],
    };
  },
  created() {},
  mounted() {
    this.getKnowledge();
  },
  watch: {},
  methods: {
    getKnowledge() {
      let i = this.scopeLevel.findIndex((x) => x == "level0");
      let data = {
        kLibTpNm: this.filterText,
        level0: this.scopeLevel.findIndex((x) => x == "level0") >= 0 ? 1 : 0,
        level1: this.scopeLevel.findIndex((x) => x == "level1") >= 0 ? 1 : 0,
        level2: this.scopeLevel.findIndex((x) => x == "level2") >= 0 ? 1 : 0,
      };
      getKLibTree(data)
        .then((res) => {
          if (res.code === 1) {
            this.treeData = res.data;
          }
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error(res.msg);
        });
    },
    getTemplate(data) {
      this.getKnowledge();
    },
    handleSearch() {
      this.getKnowledge();
    },
    filterNode(value, data) {
      // if (!value) return true;
      // return data.label.indexOf(value) !== -1;
    },
    handleChange(item, node, index) {
      console.log("item========", item);
      console.log("node========", node);
      console.log("index========", index);
    },
  },
};
</script>

<style lang='scss' scoped>
.contain {
  .scopeLevel {
    margin: 10px 10px 10px 10px;
  }

  .keyword {
    padding: 0 10px 10px 10px;
    box-sizing: border-box;
  }

  .templTable {
    padding: 10px;
  }

  /deep/
    .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    background-color: $l-color-bgcolor-12;
  }

  /deep/ .el-tree-node__content:hover {
    background-color: $l-color-bgcolor-12;
  }

  /deep/ .el-tree-node__content {
    white-space: nowrap;
  }
}
</style>
