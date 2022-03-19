<template>
  <!-- 管理计划 -->
  <div class="width100 height100" v-loading="loading">
    <div class="top-container">
      <el-checkbox-group
        class="scopeLevel"
        v-model="scopeLevel"
        @change="getTemplate"
      >
        <el-checkbox
          v-for="item in checkOptions"
          :key="item._id"
          :label="handlerValue(item.code)"
          >{{ item.name }}</el-checkbox
        >
      </el-checkbox-group>
      <!-- 检索 -->
      <el-input
        class="keyword margin-top-08"
        placeholder="请输入检索条件"
        type="text"
        v-model="filterText"
        @keyup.enter.native="handleSearch"
      >
        <el-button
          class="append-button"
          slot="append"
          size="mini"
          icon="el-icon-search"
          @click.native="handleSearch"
        ></el-button>
      </el-input>
    </div>
    <div class="margin-top-08">
      <el-collapse v-model="activeNames">
        <el-collapse-item
          v-for="item in managePlanList"
          :key="item.id"
          :name="item.id"
        >
          <template slot="title">
            <p class="overflow-point" :title="item.label">
              {{ item.label }}
            </p>
          </template>
          <ul v-if="item.children && item.children.length > 0">
            <el-tooltip
              v-for="items in item.children"
              :key="items.id"
              :content="items.exts.content"
              placement="left"
              effect="light"
            >
              <li
                class="overflow-point manage-plan-item"
                @dblclick="insertEditorHandler(items, item.label)"
              >
                {{ items.label }}
              </li>
            </el-tooltip>
          </ul>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import { getMngPlanTypeTree } from "@/api/emrRecord/emr/managePlan";
import hmm from "@/api/hmm/base.js";

export default {
  name: "",
  components: {},
  data() {
    return {
      loading: false,
      scopeLevel: [],
      filterText: "",
      planType: null,
      children: 10,
      managePlanList: [],
      checkOptions: [],
      activeNames: null
    };
  },
  created() {
    this.handlerOrgList();
    this.handleSearch();
  },
  methods: {
    handlerValue(code) {
      return `level${code}`;
    },
    async handlerOrgList() {
      try {
        const { code, data, msg } = await hmm.getDictListForCode(
          "AllLevelType"
        );
        if (code === 1 && data) {
          this.checkOptions = data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    insertEditorHandler(item, label) {
      const domStr = `<span style="display: block;">  ${label} : <span>${item
        .exts.content || ""}</span></span>`;
      this.$root.eventHub.$emit("managePlanInsert", domStr);
    },
    getMngPlanTypeRequire() {
      if (this.loading) return;
      this.loading = true;

      let flagTenant = this.scopeLevel.findIndex(x => x == "level9") >= 0;
      let flagHos = this.scopeLevel.findIndex(x => x == "level0") >= 0;
      let flagDept = this.scopeLevel.findIndex(x => x == "level1") >= 0;
      let flagUser = this.scopeLevel.findIndex(x => x == "level2") >= 0;
      let childrenParams = {
        currTenant: flagTenant ? 1 : "",
        currHos: flagHos ? 1 : "",
        currDept: flagDept ? 1 : "",
        currUser: flagUser ? 1 : "",
        level0: flagHos ? 0 : "",
        level1: flagDept ? 1 : "",
        level2: flagUser ? 2 : "",
        level9: flagTenant ? 9 : ""
      };
      let flag = Object.keys(childrenParams).every(param => {
        return childrenParams[param] === "";
      });
      if (flag) {
        childrenParams.currTenant = 1;
        childrenParams.currHos = 1;
        childrenParams.currDept = 1;
        childrenParams.currUser = 1;
        childrenParams.level0 = 0;
        childrenParams.level1 = 1;
        childrenParams.level2 = 2;
        childrenParams.level9 = 9;
      }

      let params = {
        key: this.filterText,
        ...childrenParams,
        viewCnt: 50
      };
      getMngPlanTypeTree(params)
        .then(res => {
          let { code, data } = res;
          if (code === 1) {
            this.managePlanList = data;
            this.activeNames = data.map(item => item.id);
          }
        })
        .catch(err => {
          this.$message.error(err || "获取管理计划类别接口失败");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getTemplate(val) {
      this.handleSearch();
    },
    handleSearch() {
      this.getMngPlanTypeRequire();
    }
  }
};
</script>

<style lang='scss' scoped>
.margin-top-08 {
  margin-top: 8px;
}
/deep/ .el-input-group__append {
  box-sizing: border-box;
  height: 32px;
}
/deep/ .el-collapse-item .el-collapse-item__arrow {
  left: 8px;
}
/deep/ .el-collapse-item .el-collapse-item__header {
  font-weight: normal;
  color: #2e323a;
  height: 32px;
  line-height: 32px;
  border-bottom: none;
  font-size: 14px;
  padding-left: 24px;
}

/deep/ .el-collapse-item .el-collapse-item__content {
  padding-left: 16px;
}

.manage-plan-item {
  height: 28px;
  line-height: 28px;
  cursor: pointer;
}
.no-data {
  text-align: center;
}
</style>
