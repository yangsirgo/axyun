<template>
  <div class="treatRegionMaintain width100 height100 clearfix">
    <div class="left-cont height100 float-left">
      <div class="search-area">
        <div class="search-area-left">
          <el-row :gutter="20" style="margin-bottom: 10px">
            <el-col :span="8">
              <LFormtTitle label="诊疗类型名称">
                <el-input
                  type="text"
                  v-model="searchValue.diagTreatTypeName"
                  placeholder="请输入"
                  style="width: 100%"
                ></el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="8">
              <LFormtTitle label="诊疗类型编码">
                <el-input
                  type="text"
                  v-model="searchValue.diagTreatTypeCode"
                  placeholder="请输入编码,长度在 2 到 5 个字符"
                  style="width: 100%"
                ></el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="8">
              <!-- <LFormtTitle label="备注说明">
                <el-input
                  type="text"
                  v-model="searchValue.recordRemark"
                  placeholder="请输入"
                  style="width:100%"
                ></el-input>
              </LFormtTitle> -->
              <el-radio-group
                v-model="searchValue.recordStatus"
                style="line-height: 40px"
              >
                <el-radio label="1">开放使用</el-radio>
                <el-radio label="2">暂停使用</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
          <!-- <el-row :gutter="20">
            <el-radio-group v-model="searchValue.recordStatus">
              <el-radio label="1">开放使用</el-radio>
              <el-radio label="2">暂停使用</el-radio>
            </el-radio-group>
          </el-row> -->
        </div>
        <div class="search-area-right clearfix">
          <el-button
            type="primary"
            class="float-right"
            plain
            style="margin-left: 10px"
            @click="add"
            >新增</el-button
          >
          <el-button type="primary" class="float-right" plain @click="cancel"
            >重置</el-button
          >
          <el-button type="primary" class="float-right" @click="search"
            >查询</el-button
          >
        </div>
      </div>
      <div class="table-cont">
        <el-table
          :data="tableData"
          width="100%"
          height="100%"
          stripe
          border
          v-loading="loading"
        >
          <el-table-column
            :prop="tableParams[0].prop"
            :label="tableParams[0].label"
            :min-width="tableParams[0].width"
            :align="tableParams[0].align || 'left'"
            :header-align="tableParams[0].headerAlign || 'left'"
            :fixed="tableParams[0].fixed"
          ></el-table-column>
          <el-table-column
            :prop="tableParams[7].prop"
            :label="tableParams[7].label"
            :min-width="tableParams[7].width"
            :align="tableParams[7].align || 'left'"
            :header-align="tableParams[7].headerAlign || 'left'"
            :fixed="tableParams[7].fixed"
          ></el-table-column>
          <el-table-column
            :prop="tableParams[1].prop"
            :label="tableParams[1].label"
            :min-width="tableParams[1].width"
            :align="tableParams[1].align || 'left'"
            :header-align="tableParams[1].headerAlign || 'left'"
            :fixed="tableParams[1].fixed"
          ></el-table-column>
          <el-table-column
            :prop="tableParams[3].prop"
            :label="tableParams[3].label"
            :min-width="tableParams[3].width"
            :align="tableParams[3].align || 'left'"
            :header-align="tableParams[3].headerAlign || 'left'"
            :fixed="tableParams[3].fixed"
          >
            <template slot-scope="scope1">
              <span v-if="scope1.row['recordStatus'] == '1'">开放使用</span>
              <span v-else-if="scope1.row['recordStatus'] == '2'"
                >暂停使用</span
              >
            </template>
          </el-table-column>
          <el-table-column
            :prop="tableParams[4].prop"
            :label="tableParams[4].label"
            :min-width="tableParams[4].width"
            :align="tableParams[4].align || 'left'"
            :header-align="tableParams[4].headerAlign || 'left'"
            :fixed="tableParams[4].fixed"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="edit(scope.row, scope.$index)"
                >编辑</el-button
              >
              <el-button type="text" @click="deleted(scope.row, scope.$index)"
                >删除</el-button
              >
              <el-button type="text" @click="isUsed(scope.row, scope.$index)">
                <span v-if="scope.row['recordStatus'] == '1'">暂停使用</span>
                <span v-else-if="scope.row['recordStatus'] == '2'"
                  >开放使用</span
                >
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            :prop="tableParams[5].prop"
            :label="tableParams[5].label"
            :min-width="tableParams[5].width"
            :align="tableParams[5].align || 'left'"
            :header-align="tableParams[5].headerAlign || 'left'"
            :fixed="tableParams[5].fixed"
          ></el-table-column>
          <el-table-column
            :prop="tableParams[6].prop"
            :label="tableParams[6].label"
            :min-width="tableParams[6].width"
            :align="tableParams[6].align || 'left'"
            :header-align="tableParams[6].headerAlign || 'left'"
            :fixed="tableParams[6].fixed"
          ></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="right-cont height100 float-right">
      <l-card-title>
        <span slot="left">诊疗类型维护</span>
      </l-card-title>
      <el-form
        class="search-area-form"
        :model="form"
        :rules="rules"
        ref="ruleForm"
      >
        <el-row style="margin-bottom: 20px">
          <el-form-item prop="diagTreatTypeName" required>
            <LFormtTitle label="诊疗类型名称" required>
              <el-input
                type="text"
                v-model="form.diagTreatTypeName"
                placeholder="请输入"
                style="width: 100%"
              ></el-input>
            </LFormtTitle>
          </el-form-item>
        </el-row>
        <el-row style="margin-bottom: 20px">
          <el-form-item prop="diagTreatTypeCode" required>
            <LFormtTitle label="诊疗类型编码" required>
              <el-input
                type="text"
                v-model="form.diagTreatTypeCode"
                placeholder="请输入长度在2到5个字符编码"
                style="width: 100%"
              ></el-input>
            </LFormtTitle>
          </el-form-item>
        </el-row>
        <el-row style="margin-bottom: 20px">
          <LFormtTitle label="备注说明">
            <el-form-item prop="recordRemark">
              <el-input
                type="text"
                v-model="form.recordRemark"
                placeholder="请输入"
                style="width: 100%"
              ></el-input>
            </el-form-item>
          </LFormtTitle>
        </el-row>
        <el-row style="margin-bottom: 20px">
          <el-form-item prop="recordStatus" required>
            <LFormtTitle label="状态" required>
              <el-radio-group v-model="form.recordStatus">
                <el-radio label="1">开放使用</el-radio>
                <el-radio label="2">暂停使用</el-radio>
              </el-radio-group>
            </LFormtTitle>
          </el-form-item>
        </el-row>
      </el-form>
      <div class="clearfix">
        <el-button class="float-right" type="primary" @click="save"
          >保存</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import scheManagement from "@/api/schedule/scheduleManagement.js";

export default {
  name: "treatRegionMaintain",
  data() {
    let validatorVal = (rule, value, callback) => {
      if (value.length < 6 && value.length >= 2) {
        callback();
      } else {
        this.$message.warning("字符在2到5个之间");
        callback(new Error("字符在2到5个之间"));
      }
    };
    return {
      searchValue: {
        diagTreatTypeName: "",
        diagTreatTypeCode: "",
        isRatio1: false,
        isRatio2: false,
        recordStatus: "",
        recordRemark: ""
      },
      form: {
        diagTreatTypeName: "",
        diagTreatTypeCode: "",
        isRatio1: false,
        isRatio2: false,
        recordStatus: "",
        recordRemark: ""
      },
      ratioData: [],
      ratioParams: [
        {
          prop: "name",
          label: "渠道名称",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "80"
        }
        /*, {
            prop: "live",
            label: "现场",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "80"
          }, {
            prop: "app",
            label: "APP",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "80"
          }, {
            prop: "official1",
            label: "公众号1",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "80"
          }, {
            prop: "official2",
            label: "公众号2",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "80"
          }, {
            prop: "selfMachine",
            label: "自助机",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "80"
          }*/
      ],
      rules: {
        diagTreatTypeName: [
          { required: true, message: "请输入诊疗类型名称", trigger: "blur" },
          { min: 1, max: 15, message: "长度在 1 到 15 个字符", trigger: "blur" }
        ],
        diagTreatTypeCode: [
          { required: true, message: "请输入诊疗类型code", trigger: "blur" },
          {
            min: 2,
            max: 5,
            message: "长度在 2 到 5 个字符",
            trigger: "blur",
            validator: validatorVal
          }
        ],
        recordStatus: [
          { required: true, message: "请选择状态", trigger: "change" }
        ]
      },
      //分页信息
      loading: false,
      pageSize: 20,
      pageNo: 1,
      total: 0,
      tableParams: [],
      tableParamsInit: [
        {
          prop: "diagTreatTypeName",
          label: "诊疗类型名称",
          align: "left",
          headerAlign: "left",
          fixed: "left",
          width: "70"
        },
        {
          prop: "recordRemark",
          label: "备注",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "120"
        },
        {
          prop: "radiosName",
          label: "渠道占比 (%)",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "auto",
          childrenParams: []
        },
        {
          prop: "recordStatus",
          label: "状态",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "70"
        },
        {
          prop: "operate",
          label: "快捷操作",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "150"
        },
        {
          prop: "updatedByName",
          label: "操作人",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "60"
        },
        {
          prop: "updatedAt",
          label: "操作时间",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "90"
        },
        {
          prop: "diagTreatTypeCode",
          label: "诊疗类型编码",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "90"
        }
      ],
      tableData: [],
      isEdit: -1,
      //渠道列表
      channelData: [],
      //诊疗类型初始化列表
      treatDataInit: []
    };
  },
  computed: {
    totalPage() {
      return Math.ceil(this.total / this.pageSize);
    }
  },
  async created() {
    await this.getChannel();
    await this.search();
  },
  methods: {
    /*isRatio1Change(value) {
        let params = this.tableParamsInit[2].childrenParams;
        if (value == true) {
          this.form.isRatio2 = false;
          for (let i in params) {
            this.ratioData[0][params[i].prop] = '100';
          }
        } else if (!this.form.isRatio2) {
          for (let i in params) {
            this.ratioData[0][params[i].prop] = '';
          }
        }
      },*/
    isRatio2Change(value) {
      let params = this.tableParamsInit[2].childrenParams;
      if (value == true) {
        // this.form.isRatio1 = false;
        for (let i in params) {
          this.ratioData[0][params[i].prop] = "0";
        }
      } else {
        for (let i in params) {
          this.ratioData[0][params[i].prop] = "";
        }
      }
    },
    //校验渠道表格数字类型
    channelPerVal(value) {
      if (parseInt(value).toString().length > 3) {
        this.$message.error("只能输入三位以下数字");
      } else if (value != parseInt(value)) {
        this.$message.error("只能输入数字");
      }
    },
    async getSelectRoomStation() {
      this.$showLoading();
      try {
        let params = {
          diagTreatTypeName: this.searchValue.diagTreatTypeName,
          diagTreatTypeCode: this.searchValue.diagTreatTypeCode,
          // isAppointment: this.searchValue.isRatio2 === true ? "1" : "2",
          recordStatus: this.searchValue.recordStatus
        };
        // this.$delete(params, 'isRatio1');
        // this.$delete(params, "isRatio2");
        let data = await scheManagement.getDiagTreatType(params);
        /* let data = {
             code: '1',
             data: [
               {
                 diagTreatTypeName: '姓名',
                 live: 12,
                 app: 13,
                 official1: 14,
                 official2: 15,
                 selfMachine: 16,
                 recordStatus: '1'
               }, {
                 diagTreatTypeName: '姓名',
                 live: 12,
                 app: 13,
                 official1: 14,
                 official2: 15,
                 selfMachine: 16,
                 recordStatus: '2'
               }]
           };*/
        if (data.code == "1") {
          this.treatDataInit = [...data.data];
          await this.handleTreatData(data.data);
        } else {
          this.$message.error(data.msg || "获取列表失败");
        }
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "获取列表失败");
      }
    },
    //处理诊疗表格中的渠道数据
    handleTreatData(data) {
      let tableData = [...data];
      for (let i in tableData) {
        let item = tableData[i];
        for (let j in item.numPercentagePOs) {
          let channelId = item.numPercentagePOs[j].channelId;
          let channelPercentage = item.numPercentagePOs[j].channelPercentage;
          tableData[i][channelId] = Number(channelPercentage) * 100;
        }
      }
      this.tableData = [...tableData];
    },
    //查询
    async search() {
      await this.getSelectRoomStation();
    },
    //保存
    async save() {
      this.$nextTick(() => {
        this.$refs["ruleForm"].validate(async valid => {
          if (valid) {
            // let ratioData = await this.handleChannelPer();
            // if (ratioData.length <= 0) {
            //   this.$message.error("渠道比例之和必须等于100");
            // } else {
            this.$showLoading();
            try {
              let form = {
                ...this.form
                // isAppointment: this.form.isRatio2 === true ? "1" : "2",
                // numPercentagePOs: ratioData
              };
              // this.$delete(form, 'isRatio1');
              // this.$delete(form, "isRatio2");
              let data = {};
              if (this.isEdit != -1) {
                //修改
                data = await scheManagement.updateDiagTreatTypePO(form);
              } else {
                //新增
                data = await scheManagement.addDiagTreatTypePO(form);
              }
              if (data.code == "1") {
                this.$refs["ruleForm"].resetFields();
                this.search();
                this.$message("保存成功");
              } else {
                this.$message.error(data.msg || "保存失败");
              }
              this.$hideLoading();
            } catch (error) {
              this.$hideLoading();
              this.$message.error(error.msg || "保存失败");
            }
            // }
          }
        });
      });
    },
    //取消
    cancel() {
      this.searchValue = {
        diagTreatTypeName: "",
        diagTreatTypeCode: "",
        isRatio1: false,
        isRatio2: false,
        recordStatus: "",
        recordRemark: ""
      };
      /* let obj = { ...this.ratioData[0] };
      let params = this.tableParamsInit[2].childrenParams;
      for (let i in params) {
        this.$set(obj, params[i].prop, "");
      }
      this.$set(this.ratioData, 0, obj);
      this.$refs["ruleForm"].resetFields(); */
    },
    //新增
    add() {
      this.isEdit = -1;
      this.$nextTick(() => {
        this.form = {
          // isRatio1: false,
          isRatio2: false
        };
        this.$refs["ruleForm"].resetFields();
      });
    },
    //导出
    printTable() {},
    //编辑
    edit(row, index) {
      this.isEdit = index;
      this.form = {
        ...row,
        // isRatio1: false,
        isRatio2: row.isAppointment == "1" ? true : false
      };
      let params = this.tableParamsInit[2].childrenParams;
      for (let i in params) {
        this.ratioData[0][params[i].prop] = row[params[i].prop];
        this.$delete(this.form, params[i].prop);
      }
    },
    //删除
    deleted(row, index) {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          this.$showLoading();
          try {
            let params = row.diagTreatTypeId;
            let data = await scheManagement.delDiagTreatTypePO(params);
            if (data.code == "1") {
              this.search();
              this.$message("删除成功");
            } else {
              this.$message.error(data.msg || "删除失败");
            }
            this.$hideLoading();
          } catch (error) {
            this.$hideLoading();
            this.$message.error(error.msg || "删除失败");
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //是否使用
    async isUsed(row, index) {
      this.$showLoading();
      try {
        let ratioData = await this.handleChannelPer();
        let params = {
          ...row,
          isAppointment: this.form.isRatio2 === true ? "1" : "2",
          numPercentagePOs: ratioData,
          recordStatus: row.recordStatus == "1" ? "2" : "1"
        };
        this.$delete(this.form, "isRatio2");
        let data = await scheManagement.updateDiagTreatTypePO(params);
        if (data.code == "1") {
          this.search();
          this.$message("操作成功");
        } else {
          this.$message.error(data.msg || "操作失败");
        }
        this.$hideLoading();
      } catch (error) {
        console.info(error);
        this.$hideLoading();
        this.$message.error(error.msg || "操作失败");
      }
    },
    //查询渠道列表
    async getChannel() {
      this.$showLoading();
      try {
        let data = await scheManagement.getSelectNumPercentageDict();
        if (data.code == "1") {
          this.channelData = [...data.data];
          await this.handleChannel();
        } else {
          this.$message.error(data.msg || "获取渠道列表失败");
        }
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "获取渠道列表失败");
      }
    },
    //处理渠道表头
    handleChannel() {
      let data = [...this.channelData];
      let params = [];
      for (let i in data) {
        params.push({
          prop: data[i].channelId,
          label: data[i].channelName,
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "50"
        });
      }
      this.ratioParams = this.ratioParams.concat(params);
      this.ratioData.push({
        name: "比例分配 (%)"
      });
      this.tableParamsInit[2].childrenParams = params;
      this.tableParams = [...this.tableParamsInit];
    },
    //处理渠道数据
    handleChannelPer() {
      let ratioData = { ...this.ratioData[0] };
      let arr = [];
      if (this.isEdit != -1) {
        //修改
        for (let i in ratioData) {
          if (i !== "name") {
            let obj = this.getByChannelId(i, this.isEdit);
            arr.push({
              channelId: i,
              id: obj.id,
              dataVersion: obj.dataVersion,
              channelPercentage: Number(ratioData[i]) / 100
            });
          }
        }
      } else {
        //删除
        for (let i in ratioData) {
          if (i !== "name") {
            arr.push({
              channelId: i,
              channelPercentage: Number(ratioData[i]) / 100
            });
          }
        }
      }
      //校验加起来是否为100
      let num = 0;
      if (this.form.isRatio2 !== true) {
        for (let k in arr) {
          num += Number(arr[k].channelPercentage);
        }
        if (Number(num) !== 1) {
          return [];
        }
        return arr;
      }
      return arr;
    },
    //通过channelId找id与dataversion
    getByChannelId(channelId, index) {
      let data = this.treatDataInit[index].numPercentagePOs;
      for (let i in data) {
        if (data[i].channelId == channelId) {
          return {
            id: data[i].id,
            dataVersion: data[i].dataVersion
          };
        }
      }
      return {
        id: "",
        dataVersion: ""
      };
    }
  }
};
</script>

<style scoped lang="scss">
.treatRegionMaintain {
  .left-cont {
    width: calc(100% - 300px);
    padding: 10px;
    .search-area {
      display: flex;
      .search-area-left {
        flex: 1;
      }

      .radio-table {
        width: 60%;
        margin-bottom: 20px;
      }
    }

    .table-cont {
      height: calc(100% - 84px);
      margin: 20px 0;
    }
  }
  .right-cont {
    width: 300px;
    padding: 0 10px 10px 10px;
    border-left: 1px solid $l-color-bgcolor-11;
    .search-area-form {
      height: calc(100% - 109px);
      margin-bottom: 10px;
      border-bottom: 1px solid $l-color-bgcolor-11;
    }
  }
}
</style>
