<template>
  <div class="catalogue width100 height100 clearfix">
    <div class="catalogue-left height100 float-left">
      <div class="search-area">
        <div class="search-input">
          <el-row :gutter="10" class="width100">
            <el-col :span="4">
              <l-formt-title label="医保类别" disabled>
                <el-select
                  v-model="searchParams.medicareType"
                  @change="search"
                  placeholder="请选择"
                  disabled
                >
                  <el-option
                    v-for="(item, index) in medicareTypeList"
                    :key="index"
                    :value="index"
                    :label="item"
                  ></el-option>
                </el-select>
              </l-formt-title>
            </el-col>
          </el-row>
        </div>
        <div class="search-btn" style="margin-left: 20px">
          <el-button
            type="primary"
            plain
            :disabled="
              !(searchParams.medicareType !== '' && isCurrentData) ||
              uploadBasicDisabled0
            "
            @click="uploadBasicData('0')"
            >{{ uploadBasicDataMsg0 }}</el-button
          >
          <el-button
            type="primary"
            plain
            :disabled="
              !(searchParams.medicareType !== '' && isCurrentData) ||
              uploadBasicDisabled1
            "
            @click="uploadBasicData('1')"
            >{{ uploadBasicDataMsg1 }}</el-button
          >
          <el-button
            type="primary"
            :disabled="searchParams.medicareType === ''"
            @click="search"
            >查询</el-button
          >
        </div>
      </div>

      <div class="table-cont">
        <el-table
          ref="tableData"
          :data="tableData"
          width="100%"
          height="100%"
          border
          v-loading="loading"
          :element-loading-text="$t('retreat.loadInfo')"
          highlight-current-row
          @row-click="rowClick"
          finDictionary
        >
          <el-table-column
            v-for="(item, index) in tableParams"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width || item.label.length * 18 + 24"
            :align="item.align || 'left'"
            :header-align="item.headerAlign || 'left'"
            :fixed="item.fixed"
          >
            <template slot-scope="scope">
              <template v-if="item.prop == 'medicareType'">
                <span>{{ medicareTypeList[scope.row[item.prop]] }}</span>
              </template>
              <template v-else-if="item.prop == 'downLoadType'">
                <span>{{ downLoadTypeList[scope.row[item.prop]] }}</span>
              </template>
              <template v-else-if="item.prop == 'downLoadStatus'">
                <span>{{ downLoadStatusList[scope.row[item.prop]] }}</span>
              </template>
              <template v-else-if="item.prop == 'basicDataDownloadDictionary'">
                <template v-if="searchParams.medicareType==='01'">
                  <span>{{ downloadDictionaryList[scope.row[item.prop]] }}</span>
                </template>
                <template v-else-if="searchParams.medicareType==='02'">
                  <span>{{ scope.row['baseDatadDwnloadDictionaryName'] }}</span>
                </template>
                <template v-else></template>
              </template>
              <span v-else class="overflow-point">{{
                scope.row[item.prop]
              }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="page">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageParams.pageNo"
          :page-sizes="[20, 40, 60, 100, 300, 500, 1000, 3000, 5000, 10000]"
          :page-size="pageParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageParams.total"
        ></el-pagination>
      </div>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible"
      width="30%"
      center
    >
      <span>正在进行下载...</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" v-if="sureShow===1" @click="centerDialogVisible = false"
          >取消下载</el-button>
          <el-button v-if="sureShow===2" type="primary" @click="downSure"
          >确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  uploadBasicData,
  downCatelogueData,
  getBasicDataDownloadDictionary,
  updateBasicDataDownloadSituation,
  getPagemd,
  getBasicDataDownloadSituationList,
  deleteBasicDataDownloadDictionaryById,
  addBasicDataDownloadDictionary,
} from "@/api/medicalInsurance/index.js";
export default {
  name: "basicDataDownload",
  components: {},
  data() {
    return {
      uploadBasicDataMsg0: "增量更新",
      uploadBasicDataMsg1: "全量更新",
      uploadBasicDisabled0: false,
      uploadBasicDisabled1: false,
      timer0: null,
      timer1: null,
      medicareTypeList: {},
      downloadDictionaryList: {},
      addStatus: false,
      loading: false,
      basicDataType: "",
      searchParams: {
        medicareType: "",
        basicDataDownloadDictionary: "",
      },
      tableData: [],
      // 表格列
      tableParams: [
        {
          prop: "basicDataDownloadDictionary",
          label: "下载目录",
          align: "left",
          headerAlign: "center",
          width: "120",
          fixed: false,
        },
        {
          prop: "medicareType",
          label: "医保类型",
          align: "left",
          headerAlign: "center",
          width: "120",
        },
        {
          prop: "pageNo",
          label: "当前下载页数",
          align: "left",
          headerAlign: "center",
          width: "150",
        },
        {
          prop: "downLoadTime",
          label: "下载时间",
          align: "left",
          headerAlign: "center",
          width: "150",
        },
        {
          prop: "downLoadTimes",
          label: "下载次数",
          align: "left",
          headerAlign: "center",
          width: "150",
        },{
          prop: "downLoadType",
          label: "同步类型",
          align: "left",
          headerAlign: "center",
          width: "150",
        },{
          prop: "downLoadStatus",
          label: "下载状态",
          align: "left",
          headerAlign: "center",
          width: "150",
        }
      ],
      // 当前对象
      currentData: {},
      // 表单
      form: {
        siBasicDataDownloadSituationId: "",
        basicDataDownloadDictionary: "",
        medicareType: "",
        pageNo: "0",
        downLoadTimes: "",
        downLoadTime: "0",
      },
      rules: {
        basicDataDownloadDictionary: [
          { required: true, message: "请输入下载目录", trigger: "blur" },
        ],
        pageNo: [
          { required: true, message: "请输入下载页面号", trigger: "blur" },
        ],
      },
      // 分页
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 100,
      },
      centerDialogVisible: false,
      sureShow: "",
      downLoadStatusList: {
        0: "未下载",
        1: "下载中",
        2: "下载完成"
      },
      downLoadTypeList: {
        1: "下载类",
        2: "查询类"
      }
    };
  },
  computed: {
    isCurrentData() {
      return (
        this.currentData &&
        this.currentData.hasOwnProperty("basicDataDownloadDictionary")
      );
    },
  },
  async created() {
    // this.searchParams.medicareType = "01";
    await this.getMedicareType();
    await this.getBasicDataDownloadDictionaryList();
    await this.getBasicDataDownloadSituationList();
  },
  beforeDestroy() {
    clearTimeout(this.timer0);
    clearTimeout(this.timer1);
  },
  updated() {
    this.$nextTick(() => {
      this.$refs.tableData.doLayout();
    });
  },
  methods: {
    // 为按钮设置倒计时
    forCircle(time, s) {
      if (s == "0") {
        if (time == -1) {
          this.uploadBasicDataMsg0 = "增量更新";
          this.uploadBasicDisabled0 = false;
          clearTimeout(this.timer0);
          return;
        } else {
          this.uploadBasicDataMsg0 = `${time}s后可用`;
          this.uploadBasicDisabled0 = true;
        }
        this.timer0 = setTimeout(() => {
          time--;
          this.forCircle(time, s);
        }, 1000);
      } else if (s == "1") {
        if (time == -1) {
          this.uploadBasicDataMsg1 = "全量更新";
          this.uploadBasicDisabled1 = false;
          clearTimeout(this.timer1);
          return;
        } else {
          this.uploadBasicDataMsg1 = `${time}s后可用`;
          this.uploadBasicDisabled1 = true;
        }
        this.timer1 = setTimeout(() => {
          time--;
          this.forCircle(time, s);
        }, 1000);
      }
    },
    uploadBasicData(s) {
      if (!this.currentData.basicDataDownloadDictionary) {
        this.$message.error("请选择需要下载的项");
        return;
      }
      this.$confirm(
        `请确认是否进行${this.medicareTypeList[this.currentData.medicareType] || ''}${
          this.currentData.medicareType === '01' ? this.downloadDictionaryList[
            this.currentData.basicDataDownloadDictionary
          ] : this.currentData.baseDatadDwnloadDictionaryName
        }数据的${s === "0" ? "增量更新" : "全量更新"}？`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        if (this.currentData.medicareType === "01") {
          this.forCircle(5, s);
          this.uploadBasicDataMethod(s);
        } else if (this.currentData.medicareType === "02") {
          this.centerDialogVisible = true;
          this.sureShow = "";
          if (this.currentData.downLoadType == 1) {
            // 下载类
            this.sureShow = 2;
          } else {
            this.sureShow = 1;
          }
          this.uploadBasicDataNewMethod(s, 0);
        }
      });
    },
    uploadBasicDataMethod(s) {
      let params = {
        downloadType: s, // 0 增量下载 1 全量下载
        baseDataType: this.currentData.basicDataDownloadDictionary,
      };
      uploadBasicData(params);
      this.$message.success("正在后台下载.无需停留此界面");
    },
    async uploadBasicDataNewMethod(s, n) {
      let params = {
        downloadType: s, // 0 增量下载 1 全量下载
        baseDataType: this.currentData.basicDataDownloadDictionary,
        isDown: n
      };
      try {
        let res = await downCatelogueData(params);
        if (res.code === 1) {
          if (this.currentData.downLoadType == 2) {
            // 查询类
            if (res.data.isDown === "1" && this.centerDialogVisible === true) {
              // 继续下载
              await this.uploadBasicDataNewMethod(s, 1);
            } else if (res.data.isDown === "0") {
              // 下载完成
              this.$message.success("下载成功！");
              this.centerDialogVisible = false;
            }
          }
        }
      } catch (error) {
        // this.$message.error("下载失败！");
        this.centerDialogVisible = false;
      }
    },
    downSure() {
      this.centerDialogVisible = false;
      this.getBasicDataDownloadSituationList();
    },
    async getMedicareType() {
      let path = this.$route.path;
      let isNew = false;
      if(path.indexOf("medicalInsuranceNew") > -1) {
        isNew = true;
      } else {
        isNew = false;
      }
      await getPagemd().then((res) => {
        if (res.code === 1) {
          this.searchParams.medicareType = isNew ? res.data[0].dictCode : res.data[1].dictCode;
          res.data.forEach((item, index) => {
            this.medicareTypeList[item.dictCode] = item.dictName;
          });
        }
      });
    },
    async getBasicDataDownloadDictionaryList() {
      let params = {};
      await getBasicDataDownloadDictionary(params).then((res) => {
        if (res.code === 1) {
          res.data.forEach((item) => {
            this.downloadDictionaryList[item.basicDataDownloadDictionary] =
              item.downloadDictionaryName;
          });
        }
      });
    },
    async getBasicDataDownloadSituationList() {
      if (this.searchParams.medicareType === "") {
        return;
      }
      let params = {
        pageNo: this.pageParams.pageNo,
        pageSize: this.pageParams.pageSize,
        ...this.searchParams,
      };
      this.loading = true;
      getBasicDataDownloadSituationList(params)
        .then((res) => {
          if (res.code === 1 && res.data.length) {
            this.tableData = res.data;
            this.pageParams.total = res.total;
            this.$refs.tableData.setCurrentRow(this.tableData[0]);
            this.currentData = this.tableData[0];
            this.$emit("currentData", this.currentData);
            this.form = { ...this.tableData[0] };
          }
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    search() {
      this.pageParams.pageNo = 1;
      this.tableData = [];
      this.currentData = {};
      this.getBasicDataDownloadSituationList();
    },
    rowClick(row) {
      this.currentData = row;
      this.$emit("currentData", this.currentData);
      this.form = { ...row };
      this.addStatus = false;
      // this.form.grantDepartmentId = parseInt(row.grantDepartmentId);
    },
    async add() {
      this.form = {
        siBasicDataDownloadSituationId: "",
        basicDataDownloadDictionary: "",
        medicareType: "",
        pageNo: "0",
        downLoadTimes: "",
        downLoadTime: "0",
      };
      this.addStatus = true;
    },
    dele() {
      if (!this.form.siBasicDataDownloadSituationId) {
        this.$message.error("请选择需要删除的项");
        return;
      }
      deleteBasicDataDownloadDictionaryById(
        this.form.siBasicDataDownloadSituationId
      )
        .then((res) => {
          if (res.code === 1) {
            this.$message({ type: "success", message: "删除成功" });
            this.search();
          }
        })
        .catch((err) => {
          this.$hideLoading();
          this.$message.error(error.msg || "删除失败");
        });
    },
    save() {
      if (this.addStatus) {
        this.$refs["form"].validate(async (valid) => {
          if (valid) {
            try {
              this.$showLoading();
              let res = addBasicDataDownloadDictionary(this.form);
              this.$hideLoading();
              if (res.code === 1) {
                this.$message({ type: "success", message: "新增成功" });
                this.search();
              } else {
                this.$message({ type: "flag", message: "新增失败" });
              }
            } catch (error) {
              console.info(error);
              this.$hideLoading();
              this.$message.error(error.msg || "新增失败");
            }
          }
        });
      } else {
        this.$refs["form"].validate(async (valid) => {
          if (valid) {
            try {
              this.$showLoading();
              let res = updateBasicDataDownloadSituation(this.form);
              this.$hideLoading();
              this.$message({ type: "success", message: "保存成功" });
              this.search();
            } catch (error) {
              console.info(error);
              this.$hideLoading();
              this.$message.error(error.msg || "保存失败");
            }
          }
        });
      }
    },
    // 分页
    handleSizeChange(val) {
      this.pageParams.pageSize = val;
      this.getChannelByPage();
    },
    handleCurrentChange(val) {
      this.pageParams.pageNo = val;
      this.getChannelByPage();
    },
  },
};
</script>
<style lang="scss" scoped>
.margin-top-10 {
  margin-top: 10px;
}
.margin-top-20 {
  margin-top: 20px;
}
.catalogue {
  background-color: #fff;
  .catalogue-left {
    // width: calc(100% - 300px);
    width: 100%;
    padding: 10px;
    // border-right: 1px solid $l-color-bgcolor-11;
    .search-area {
      display: flex;
      .search-input {
        flex: 1;
      }
    }
    .table-cont {
      height: calc(100% - 106px);
      margin: 20px 0;
    }
    .page {
      text-align: right;
      .el-pagination {
        padding: 0;
        /deep/ .el-pagination__editor.el-input .el-input__inner {
          height: 100% !important;
        }
      }
    }
  }
  .catalogue-right {
    width: 300px;
    padding: 10px;
    overflow-y: scroll;
    .catalogue-right-form {
      // height: calc(100% - 46px);
      border-bottom: 1px solid $l-color-bgcolor-11;
    }
    .catalogue-right-btn {
      margin-top: 10px;
    }
  }
}
</style>
