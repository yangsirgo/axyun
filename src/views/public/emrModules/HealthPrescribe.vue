<template>
  <div class="width100 height100 toolbox-con">
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
        @keyup.enter.native="query"
      >
        <el-button
          slot="append"
          size="mini"
          icon="el-icon-search"
          @click.native="query"
        ></el-button>
      </el-input>
    </div>
    <div class="table-con">
      <l-table
        :total="pageParams.total"
        :pageSize.sync="pageParams.pageSize"
        :page.sync="pageParams.pageNo"
        :layout="layout"
        :singlePageShow="true"
        :paginationSmall="true"
        @changeSize="changeSize"
      >
        <el-table
          :data="healthPrescribeList"
          ref="typeTable"
          border
          height="100%"
          style="width: 100%"
          stripe
          v-loading="tlm_isLoading"
          element-loading-background="rgba(255, 255, 255, 0.5)"
          @row-click="handleRowClick"
          @row-dblclick="handlerDbClick"
        >
          <el-table-column prop="hpNm" label="健康处方" width="170px">
            <template slot-scope="scope">
              <el-popover
                class="popover-cont"
                placement="left-start"
                width="200"
                trigger="hover"
                :title="scope.row.hpNm"
              >
                <p
                  v-for="(item, index) in renderLabel(scope.row.hpContent)"
                  :key="item + index"
                >
                  {{ item }}
                </p>

                <div style="cursor: pointer" slot="reference">
                  {{ scope.row.hpNm }}
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="icdDic" label="疾病名称" min-width="150px">
            <template slot-scope="scope">
              <span>{{ parseICDDic(scope.row.icdDic) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="diseaseIds" label="疾病编码" min-width="100px">
          </el-table-column>
        </el-table>
      </l-table>
    </div>
    <!-- <el-collapse class="collapse-con" accordion>
      <el-collapse-item :title="choosedTitle" name="1">
        <ul class="health-list" v-if="choosedHealthPre.length">
          <li
            class="health-choosed-item"
            v-for="item in choosedHealthPre"
            :key="item.hpId"
            @dblclick="delHealthItem(item)"
          >
            {{ item.hpNm }}
          </li>
        </ul>
      </el-collapse-item>
    </el-collapse> -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import hmm from "@/api/hmm/base.js";
import { getHealthPrescriptionPage } from "@/api/emrRecord/emr/healthPrescribe.js";
export default {
  name: "",
  components: {},
  props: {
    mainDiag: String
  },
  data() {
    return {
      tlm_isLoading: false,
      scopeLevel: [],
      filterText: "",
      healthPrescribeList: [],
      choosedHealthPre: [],
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      layout: "pager",
      checkOptions: [],
      clickItem: null
    };
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"]),
    choosedTitle() {
      return `已选健康处方 共${this.choosedHealthPre.length}条`;
    }
  },
  watch: {
    receivePatientData: {
      handler(val) {
        console.log(val, "name-name");
        if (val && val.patientId && val.diagName) {
          // 诊断存在情况下 调用
          this.filterText = val.diagName;
          this.query();
        }
      },
      immediate: true,
      deep: true
    },
    mainDiag: {
      handler(val) {
        if (val) {
          this.filterText = val;
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.handlerOrgList();
    this.query();
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
    getTemplate(val) {
      this.handleSearch();
    },
    changeSize(val) {
      this.pageParams.pageNo = val.page;
      this.handleSearch();
    },
    renderLabel(content) {
      let listStr = content.split("\n");
      return listStr;
    },
    renderHtml(content) {
      let listStr = content.split("\n");
      return listStr.join("<br/>");
    },
    handleRowClick(row) {
      this.clickItem = row;
    },
    handlerDbClick(row) {
      // 双击添加
      const findIndex = this.choosedHealthPre.findIndex(
        item => item.hpId === row.hpId
      );
      if (findIndex < 0) {
        this.choosedHealthPre.push(row);
      }
      this.insertRecordHander(row);
    },
    // 向文书中添加数据
    insertRecordHander(item) {
      const domStr = this.renderHtml(item.hpContent) || "";
      this.$root.eventHub.$emit("insertRecordHander", domStr);
    },
    // 删除文书中对应的数据
    delRecordData(deleteId) {
      this.$root.eventHub.$emit("deleteglHandler", deleteId);
    },
    parseICDDic(dic) {
      let str = "";
      let dicList = Object.keys(dic);
      let dicLen = dicList.length;
      Object.keys(dic).forEach((item, index) => {
        if (index !== dicLen - 1) {
          str += `${dic[item].DICTIONARY_NAME}、`;
        } else {
          str += `${dic[item].DICTIONARY_NAME}`;
        }
      });
      return str;
    },
    query() {
      this.pageParams.pageNo = 1;
      this.handleSearch();
    },
    handleSearch() {
      if (this.tlm_isLoading) return;
      this.tlm_isLoading = true;

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
        ...this.pageParams
      };

      getHealthPrescriptionPage(params)
        .then(res => {
          let { code, data, total } = res;
          if (code === 1 && data) {
            this.healthPrescribeList = data;
            this.pageParams.total = total;
          }
        })
        .catch(err => {
          this.$message.error(err || "获取健康处方数据失败");
        })
        .finally(() => {
          this.tlm_isLoading = false;
        });
    },
    delHealthItem(item) {
      // 删除当前所选项
      let findIndex = this.choosedHealthPre.findIndex(
        item => item.hpId === item.hpId
      );
      if (findIndex >= 0) {
        this.choosedHealthPre.splice(findIndex, 1);
        // 删除向文书中添加的数据
        this.delRecordData(item.hpId);
      }
    }
  }
};
</script>

<style lang="scss">
.el-popover {
  padding: 16px !important;
  width: 400px !important;
}
</style>

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

.toolbox-con {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .table-con {
    margin-top: 8px;
    flex: 1;
  }
  .collapse-con {
    margin-top: 8px;
    max-height: 200px;
    overflow: auto;
    .health-list {
      padding: 8px;
      .health-choosed-item {
        line-height: 24px;
        font-size: 14px;
        cursor: pointer;
      }
    }
  }
}
</style>
