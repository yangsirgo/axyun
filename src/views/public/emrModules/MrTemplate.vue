<template>
  <div class="mr-template height100">
    <el-tabs class="height100">
      <el-tab-pane style="overflow-x: auto" label="模板查询">
        <!-- 所属范围 -->
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
          class="keyword"
          placeholder="请输入检索条件"
          v-model="keyword"
          @keyup.enter.native="getTemplateByFirst"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click.native="getTemplateByFirst"
          ></el-button>
        </el-input>
        <!-- 检索结果 -->
        <div class="templTable" style="height: calc(100% - 80px)">
          <l-table
            :total="pageParams.total"
            :pageSize.sync="pageParams.pageSize"
            :page.sync="pageParams.pageNo"
            :layout="layout"
            paginationAlign="center"
            :singlePageShow="true"
            @changeSize="changeSize"
          >
            <el-table
              :data="tableData"
              border
              stripe
              height="100%"
              class="tableData"
              v-loading="tlm_isLoading"
              @row-dblclick="loadTemplate"
              @row-click="showPop"
            >
              <el-table-column prop="templateName" label="模板名称" width="275px">
              </el-table-column>
              <el-table-column prop="diseaseId" label="适应病种">
                <template slot-scope="scope">
                  <span
                    v-if="
                      scope.row.diseaseId != null && scope.row.diseaseId != ''
                    "
                    tableName="md_diseases"
                    :conditionMap="{ diseases_id: scope.row.diseaseId }"
                    columns="diseases_name"
                    v-tableTransform-emr
                  ></span>
                </template>
              </el-table-column>
            </el-table>
          </l-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="模板树">
        <div style="overflow: auto" class="height100">
          <el-tree
            v-loading="tempTreeLoading"
            default-expand-all
            :data="tree1"
            :props="defaultProps1"
            :highlight-current="true"
            :render-content="renderContent1"
            @node-click="handleNodeClick1"
          ></el-tree>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

import hmm from "@/api/hmm/base.js";

import { getUsableList, getContent } from "@/api/emrRecord/emr/template";
import { getTempalteTree } from "@/api/emrRecord/emr/instrument";

import { getUId } from "@/utils/crypto";
import { getPamars } from "@/utils/auth.js";
import { getFrameUrlNew } from "@/api/third/third";

// 历次处方
export default {
  name: "MrTemplate",
  props: {
    editor: {
      type: Object,
      default: null
    },
    visitType: String,
    dnFlag: {
      type: String,
      default: "1"
    },
    refreshTemplateFlag: {
      type: Boolean,
      default: false
    },
    isHome: {
      type: String,
      default: "0"
    }
  },
  data() {
    return {
      timer: null, // 处理单双击问题
      tempTreeLoading: false,
      tableData: [],
      keyword: "",
      scopeLevel: ["level0"],
      tlm_isLoading: false,
      layout: "pager",
      tree1: [],
      pageParams: {
        pageNo: 1, // 当前页数
        total: 0, // 总共页数
        pageSize: 20 // 每页数据条数
      },
      defaultProps1: {
        children: "children",
        label: "label"
      },
      checkOptions: []
    };
  },
  computed: {
    ...mapGetters(["role"]),
    ...mapGetters("base", ["receivePatientData"]),
    ...mapGetters("homeSickbeds", {
      homeSickbedsPatient: "receivePatientData"
    }),
    patientId() {
      let patientId =
        this.visitType === "04" && this.isHome === "1"
          ? this.homeSickbedsPatient.patientId
          : this.receivePatientData.patientId;
      return patientId;
    },
    patientAge() {
      let patientAge =
        this.visitType === "04" && this.isHome === "1"
          ? this.homeSickbedsPatient.age
          : this.receivePatientData.patientAge;
      return patientAge;
    },
    patientGender() {
      let patientGender =
        this.visitType === "04" && this.isHome === "1"
          ? this.homeSickbedsPatient.gender
          : this.receivePatientData.patientGender;
      return patientGender;
    }
  },
  created() {
    this.handlerOrgList();
    if (!this.editor) {
      return;
    }
    this.getTemplate();
    this.loadTempData();
  },
  watch: {
    refreshTemplateFlag: {
      handler(val) {
        if (val === true) {
          console.log("模板刷新了");
          this.getTemplateByFirst();
          this.loadTempData();
        }
      },
      immediate: true
    }
  },
  methods: {
    handlerValue(code) {
      return `level${code}`;
    },
    async handlerOrgList() {
      try {
        const { code, data } = await hmm.getDictListForCode("AllLevelType");
        if (code === 1 && data) {
          this.checkOptions = data.filter(item => item.name !== '租户');
        }
      } catch (error) {
        console.log(error);
      }
    },
    loadTempData() {
      this.tempTreeLoading = true;
      let params = {};
      if (this.patientId) {
        params = {
          visitType: this.visitType,
          dnFlag: this.dnFlag,
          age: Number.parseFloat(this.patientAge) || null,
          sex: this.patientGender || null
        };
      } else {
        params = {
          visitType: this.visitType,
          dnFlag: this.dnFlag
        };
      }

      getTempalteTree(params).then(res => {
        if (res.code == 1) {
          this.tempTreeLoading = false;
          this.tree1 = res.data.children;
        }
      });
    },
    handleNodeClick1(data) {
      if (data.exts ? (data.exts.isTemplate == "true" ? true : false) : false) {
        if (!this.patientId) {
          this.$message({
            message: "请选择患者!",
            type: "warning"
          });
          return;
        }

        let params = {
          templateCode: data.id || "",
          templateName: data.label || "",
          typeCode: data.parentId || "",
          signLevel: data.exts.sign_level,
          templateVersion: data.exts.templateVersion,
          businessTime: this.dayjs().format("YYYY-MM-DD HH:mm")
        };
        this.$emit("selectTemplate", params);
      }
    },
    renderContent1(h, { node, data, store }) {
      if (data.exts ? (data.exts.isTemplate == "true" ? true : false) : false) {
        return (
          <div class="el-tree-node__content">
            <div class="iconfont iconsijiwenjian" style="color:#C6D1DF" />
            <p style="margin-left:5px">{node.label}</p>
          </div>
        );
      } else if (
        data.label == "全院" ||
        data.label == "科室" ||
        data.label == "个人"
      ) {
        return (
          <div class="el-tree-node__content">
            <div class="iconfont iconyijiwenjianjia" style="color:#C6D1DF" />
            <p style="margin-left:5px">{node.label}</p>
          </div>
        );
      } else if (
        data.exts ? (data.exts.isTypeGroup == "true" ? true : false) : false
      ) {
        return (
          <div class="el-tree-node__content">
            <div class="iconfont iconerjiwenjianjia" style="color:#C6D1DF" />
            <p style="margin-left:5px">{node.label}</p>
          </div>
        );
      } else if (
        data.exts ? (data.exts.isType == "true" ? true : false) : false
      ) {
        return (
          <div class="el-tree-node__content">
            <div class="iconfont iconsanjiwenjian" style="color:#C6D1DF" />
            <p style="margin-left:5px">{node.label}</p>
          </div>
        );
      }
      return <p>{node.label}</p>;
    },
    getTemplateByFirst() {
      this.pageParams.pageNo = 1;
      this.getTemplate();
    },
    changeSize(val) {
      this.pageParams.pageNo = val.page;
      this.getTemplate();
    },
    //查询病历模板
    getTemplate() {
      let params = {
        key: this.keyword,
        visitType: this.visitType,
        dnFlag: this.dnFlag,
        age: this.patientAge || "",
        sex: this.patientGender || "",
        ...this.pageParams
      };

      if (this.scopeLevel.length === 0) {
        params.currTenant = 1;
        params.currHos = 1;
        params.currDept = 1;
        params.currUser = 1;
        params.level0 = 0;
        params.level1 = 1;
        params.level2 = 2;
        // params.level9 = 9;
      } else {
        params.currTenant = 0;
        params.currHos = 0;
        params.currDept = 0;
        params.currUser = 0;
        for (let i = 0; i < this.scopeLevel.length; i++) {
          params[this.scopeLevel[i]] = this.scopeLevel[i].substring(
            this.scopeLevel[i].length - 1,
            this.scopeLevel[i].length
          );
          if (params[this.scopeLevel[i]] == 0) {
            params.currHos = 1;
          } else if (params[this.scopeLevel[i]] == 1) {
            params.deptIds = this.role.deptId;
            params.currDept = 1;
          } else if (params[this.scopeLevel[i]] == 2) {
            params.persId = getUId();
            params.currUser = 1;
          } else if (params[this.scopeLevel[i]] == 9) {
            params.currTenant = 1;
          }
        }
      }

      this.tlm_isLoading = true;

      getUsableList(params)
        .then(res => {
          if (res.code === 1) {
            this.tableData = res.data;

            this.pageParams.total = res.pageParams.total;
          } else {
            this.$message.error("获取病历模板列表失败!" + res.message);
          }
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          this.tlm_isLoading = false;
        });
    },
    //加载模板内容
    async loadTemplate(row, column, event) {
      if (row.typeCode === 'T_2104230001') {
        const thirdRes = await getFrameUrlNew({
          identificationType: this.receivePatientData.identificationType || '1',
          identificationNum: this.receivePatientData.identificationNum,
          identificationName: this.receivePatientData.patientName
        });
        const { manageOrgCode, hypertensionCdId } = thirdRes.data.baseInfo ? thirdRes.data.baseInfo : {};

        if (!manageOrgCode) {
          this.$message.error('未查询到居民的健康档案，无需进行高血压随访');
          return;
        }

        let pamars = JSON.parse(getPamars());
        let hosID = '';
        if (pamars.hosId.slice(0, 1) === 'H') {
          hosID = pamars.hosId.slice(20, 33);
        } else {
          hosID = pamars.hosIdNum.slice(20, 33);
        }
        if (manageOrgCode !== hosID) {
          this.$message.error('该居民的健康档案当前不归本中心管理，无需进行高血压随访服务，请另选常规病历继续接诊');
          return;
        }

        if (!hypertensionCdId) {
          this.$message.error('该居民当前未建立高血压专案，如需随访请先建立‘专案’！');
          return;
        }
      }

      if (this.timer) {
        clearTimeout(this.timer); //清除
      }
      let id = row.templateId;
      getContent(id, {}).then(res => {
        if (res.code === 1) {
          let data = row;
          data.content = res.data.content;
          // 创建时间
          data.businessTime = this.dayjs().format("YYYY-MM-DD HH:mm");
          console.log(data, "点击模板模板");
          this.$emit("selectTemplate", data);
        } else {
          this.$message.error("加载病历模板失败!" + res.message);
        }
      });
    },
    showPop(row, column, event) {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        let id = row.templateId;
        getContent(id, {}).then(res => {
          if (res.code === 1) {
            let data = row;
            data.content = res.data.content;
            this.$emit("showPop", data.content);
          } else {
            this.$message.error("加载病历模板失败!" + res.message);
          }
        });
      }, 300);
    }
  }
};
</script>
<style lang="scss">
.mr-template {
  padding: 0 !important;
  padding-left: 1px;
  .scopeLevel {
    margin: 10px 10px 10px 10px;
  }
  .keyword {
    padding: 0 10px;
    box-sizing: border-box;
  }
  .templTable {
    padding: 10px;
  }
  /deep/ .el-tabs__content {
    height: calc(100% - 55px);
  }
  /deep/ .el-tabs__header {
    padding-left: 10px;
  }
}
</style>
