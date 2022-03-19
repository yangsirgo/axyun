<template>
  <div class="width100 height100">
    <div class="search-con-outer clearfix width100">
      <div class="left-contain width100">
        <el-row>
          <el-col :span="6" class="col-padding">
            <LFormtTitle
              :label="params.visitType === '04' ? '住院号' : '就诊号'"
            >
              <el-input
                v-model="form.enId"
                :disabled="vDisabled"
                class="form_itme"
              ></el-input>
            </LFormtTitle>
          </el-col>
          <el-col :span="6" class="col-padding">
            <LFormtTitle label="患者姓名">
              <el-input
                v-model="form.patientNm"
                :disabled="vDisabled"
                class="form_itme"
              ></el-input>
            </LFormtTitle>
          </el-col>
          <el-col :span="6" class="col-padding">
            <LFormtTitle label="文书状态">
              <l-value-domain-emr
                clearable
                code="NoteStatus"
                :value.sync="form.mrStaCd"
                placeholder="请选择"
              ></l-value-domain-emr>
            </LFormtTitle>
          </el-col>
          <el-col :span="6" class="col-padding">
            <LFormtTitle label="文书名称">
              <el-input
                v-model="form.mrNm"
                :disabled="vDisabled"
                class="form_itme"
              ></el-input>
            </LFormtTitle>
          </el-col>
        </el-row>
      </div>
      <div class="clearfix" style="width: 100%; padding-right: 10px">
        <el-button
          @click="applyHandle"
          class="float-right margin-top-10"
          type="primary"
          style="margin-left: 10px"
          plain
          >申请
        </el-button>
        <el-button
          class="float-right margin-top-10"
          type="primary"
          plain
          @click="handleReset"
          >重置
        </el-button>
        <el-button
          class="float-right margin-top-10"
          type="primary"
          @click="handleQuery"
          >查询
        </el-button>
      </div>
    </div>
    <div class="table-contain">
      <div class="table-con">
        <l-table
          :total="pageParams.total"
          :pageSize.sync="pageParams.pageSize"
          :page.sync="pageParams.pageNo"
          layout="total,prev,pager,next,jumper"
          :singlePageShow="true"
          @changeSize="changeSize"
        >
          <el-table
            stripe
            style="margin-top: 10px"
            :data="eleData"
            ref="recordMaintenanceApply"
            @row-click="selectRow"
            width="100%"
            height="100%"
            border
            @selection-change="handleSelectionChange"
            v-loading="tlm_isLoading"
            highlight-current-row
            element-loading-text="加载中..."
          >
            <el-table-column
              fixed="left"
              type="selection"
              width="50"
            ></el-table-column>
            <el-table-column
              type="index"
              fixed="left"
              label="序号"
              width="60"
            ></el-table-column>
            <el-table-column
              v-for="(item, index) in eleParams"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              :align="item.align || 'left'"
              :header-align="item.headerAlign || 'left'"
              :fixed="item.fixed"
            >
              <template slot-scope="scope">
                <div v-if="item.prop === 'signLvlCd'">
                  <span
                    :val="scope.row.signLvlCd"
                    code="AuditType"
                    v-codeTransformEmr
                  ></span>
                </div>
                <div v-else-if="item.prop === 'mrStaCd'">
                  <span
                    :val="scope.row.mrStaCd"
                    code="NoteStatus"
                    v-codeTransformEmr
                  ></span>
                </div>
                <div v-else>{{ scope.row[item.prop] }}</div>
              </template>
            </el-table-column>
          </el-table>
        </l-table>
      </div>
    </div>
  </div>
</template>
<script>
import { getMrPage } from "@/api/emrRecord/ipnw/waitCheck/check.js";

export default {
  props: {
    params: Object
  },
  computed: {
    vDisabled() {
      return false;
    }
  },
  watch: {
    params: {
      handler(val) {
        if (val) {
          console.log("obj====", val);
          if (val.visitType === "04") {
            this.eleParams = [
              {
                prop: "enId",
                label: "住院号",
                align: "left",
                headerAlign: "left",
                fixed: "left",
                width: "140"
              },
              {
                prop: "bedCd",
                label: "床号",
                align: "left",
                headerAlign: "left",
                fixed: "left",
                width: "60"
              },
              {
                prop: "patientNm",
                label: "姓名",
                align: "left",
                headerAlign: "left",
                fixed: "left",
                width: "80"
              },
              {
                prop: "bizTime",
                label: "业务时间",
                align: "left",
                headerAlign: "left",
                width: "160"
              },
              {
                prop: "nm",
                label: "文书名称",
                align: "left",
                headerAlign: "left",
                width: "120"
              },
              {
                prop: "mrStaCd",
                label: "文书状态",
                align: "left",
                headerAlign: "left",
                width: "120"
              },
              {
                prop: "signLvlCd",
                label: "审签级别",
                align: "left",
                headerAlign: "left",
                width: "120"
              },
              {
                prop: "createdByNm",
                label: "创建人",
                align: "left",
                headerAlign: "left",
                width: "120"
              }
            ];
          } else {
            this.eleParams = [
              {
                prop: "enId",
                label: "就诊号",
                align: "left",
                headerAlign: "left",
                fixed: "left",
                width: "140"
              },
              // {
              //   prop: "bedCd",
              //   label: "床号",
              //   align: "left",
              //   headerAlign: "left",
              //   fixed: "left",
              //   width: "60"
              // },
              {
                prop: "patientNm",
                label: "姓名",
                align: "left",
                headerAlign: "left",
                fixed: "left",
                width: "80"
              },
              {
                prop: "bizTime",
                label: "业务时间",
                align: "left",
                headerAlign: "left",
                width: "160"
              },
              {
                prop: "nm",
                label: "文书名称",
                align: "left",
                headerAlign: "left",
                width: "120"
              },
              {
                prop: "mrStaCd",
                label: "文书状态",
                align: "left",
                headerAlign: "left",
                width: "120"
              },
              {
                prop: "signLvlCd",
                label: "审签级别",
                align: "left",
                headerAlign: "left",
                width: "120"
              },
              {
                prop: "createdByNm",
                label: "创建人",
                align: "left",
                headerAlign: "left",
                width: "120"
              }
            ];
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      selection: [], //选项
      sTemplate: {}, //给innerContain的数据
      sTemplatelistData: [], //表数据
      remoteParams: "",
      loading: false,
      tlm_isLoading: false,
      form: {
        hadSubmit: "1",
        mrStaCd: "",
        enId: "",
        patientNm: "", //"姓名",
        mrNm: ""
      },
      // ownNameOpt: [],
      diseaseOpt: [],
      eleData: [],
      eleParams: [
        {
          prop: "enId",
          label: "就诊号",
          align: "left",
          headerAlign: "left",
          fixed: "left",
          width: "140"
        },
        {
          prop: "bedCd",
          label: "床号",
          align: "left",
          headerAlign: "left",
          fixed: "left",
          width: "60"
        },
        {
          prop: "patientNm",
          label: "姓名",
          align: "left",
          headerAlign: "left",
          fixed: "left",
          width: "80"
        },
        {
          prop: "bizTime",
          label: "业务时间",
          align: "left",
          headerAlign: "left",
          width: "120"
        },
        {
          prop: "nm",
          label: "文书名称",
          align: "left",
          headerAlign: "left",
          width: "120"
        },
        {
          prop: "mrStaCd",
          label: "文书状态",
          align: "left",
          headerAlign: "left",
          width: "120"
        },
        {
          prop: "signLvlCd",
          label: "审签级别",
          align: "left",
          headerAlign: "left",
          width: "120"
        },
        {
          prop: "createdByNm",
          label: "创建人",
          align: "left",
          headerAlign: "left",
          width: "120"
        }
      ]
    };
  },
  methods: {
    selectRow(row, column, event) {
      this.$refs.recordMaintenanceApply.clearSelection();
      this.$refs.recordMaintenanceApply.toggleRowSelection(row);
    },
    changeSize(val) {
      this.pageParams.pageNo = val.page;
      this.fetchData();
    },
    //选择项发生变化
    handleSelectionChange(val) {
      this.selection = val;
    },

    //查询
    handleQuery() {
      this.pageParams = {
        pageNo: 1,
        pageSize: 20,
        total: 0
      };
      this.eleData = [];
      this.fetchData();
    },
    //调接口
    fetchData() {
      this.tlm_isLoading = true;
      getMrPage({
        visitType: this.params.visitType,
        beforeArchiveF: 1,
        ...this.form,
        ...this.pageParams
      })
        .then(res => {
          if (res.code === 1) {
            this.eleData = res.data;
            this.tlm_isLoading = false;
            this.pageParams = {
              pageNo: res.pageNo,
              total: res.total,
              pageSize: res.pageSize
            };
            console.log("page", this.pageParams);
          }
        })
        .catch(error => {
          this.$message(error || error.msg || "查询接口报错");
        })
        .finally(() => {
          this.tlm_isLoading = false;
        });
    },
    handleReset() {
      this.pageParams = {
        pageNo: 1,
        total: 0,
        pageSize: 20
      };
      this.form = {
        mrStaCd: "",
        enId: "",
        patientNm: "", //"姓名",
        mrNm: ""
      };
    },

    applyHandle() {
      console.log("this.applyHandle====", this.selection);
      if (this.selection.length <= 0) {
        this.$message.error("请您先选中数据");
        return;
      }
      if (this.selection.length > 1) {
        this.$message.error("只能选择一条数据");
        return;
      }
      this.$emit("handle-apple", { ...this.selection[0], chkStatus: "0" });

      // this.sTemplate = this.selection[0];
      // setTimeout(() => {
      //   this.innerVisible = true;
      // }, 200);

      // getDetail({
      //   mainId: this.selection[0].mrMainId,
      //   enId: this.selection[0].enId,
      //   pageNum: 0,
      //   pageSize: 5
      // }).then(res => {
      //   if (res.code === 1) {
      //     this.sTemplatelistData = res.data;
      //     this.sTemplate = this.selection[0];
      //     setTimeout(() => {
      //       this.innerVisible = true;
      //     }, 200);
      //   } else {
      //     this.$message.error("获取明细失败!");
      //   }
      // });
      // console.log("this.sTemplate====", this.sTemplate)
    },
    //对话框关闭
    dialogClose() {
      this.$emit("handle-update");
    }
  }
};
</script>

<style scoped lang="scss">
.table-con {
  height: calc(100% - 100px);
}

.table-contain {
  margin-top: 10px;
  position: relative;
  padding: 10px 20px;
  border-top: 1px solid #e4e4e4;
  height: calc(100% - 60px);
}

.left-contain {
  width: 1050px;
}

.col-padding {
  padding: 0 10px;
}

.search-con-outer {
  padding: 10px 20px;

  .search-con {
    width: 100%;

    .search-main {
      width: calc(100% - 160px);
    }
  }
}

.margin-top-10 {
  margin-top: 10px;
}
</style>
