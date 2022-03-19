<template>
  <div class="wrapper position-relative height100">
    <l-card-title style="margin-left: 15px">
      <span slot="left" v-if="isType === 'big'">医嘱大类</span>
      <span slot="left" v-else-if="isType === 'son'">医嘱子类</span>
    </l-card-title>
    <!--医嘱大类搜索项-->
    <div class="utils-cls" v-if="isType === 'big'">
      <el-form
        :model="bigUtilsFilter"
        :rules="bigRules"
        ref="bigRuleForm"
        label-width="0"
        class="big-ruleForm"
      >
        <el-form-item label="" prop="doctorsAdviceCode">
          <l-formt-title
            label="代码"
            style="width: 200px"
            class="margin5 mr3"
            :required="true"
          >
            <el-input
              size="medium"
              v-model="bigUtilsFilter.doctorsAdviceCode"
            ></el-input>
          </l-formt-title>
        </el-form-item>
        <el-switch
          class="margin-left-10"
          style="vertical-align: 12px"
          v-model="bigUtilsFilter.status"
          active-text="激活"
          active-value="0"
          inactive-text="禁用"
          inactive-value="1"
        >
        </el-switch>
        <el-form-item label="" prop="doctorsAdviceName">
          <l-formt-title label="大类名称" :required="true" class="margin5">
            <el-input
              size="medium"
              v-model="bigUtilsFilter.doctorsAdviceName"
            ></el-input>
          </l-formt-title>
        </el-form-item>
      </el-form>
    </div>
    <!--医嘱子类搜索项-->
    <div class="utils-cls" v-else-if="isType === 'son'">
      <el-form
        :model="sonUtilsFilter"
        :rules="sonRules"
        ref="sonRuleForm"
        label-width="0"
        class="demo-ruleForm"
      >
        <el-form-item label="" prop="doctorsAdviceCode">
          <l-formt-title
            label="代码"
            style="width: 200px"
            class="margin5 mr3"
            required
          >
            <el-input
              size="medium"
              v-model="sonUtilsFilter.doctorsAdviceCode"
            ></el-input>
          </l-formt-title>
        </el-form-item>
        <el-switch
          class="margin-left-10"
          style="vertical-align: 12px"
          v-model="sonUtilsFilter.status"
          active-text="激活"
          active-value="0"
          inactive-text="禁用"
          inactive-value="1"
        >
        </el-switch>
        <el-form-item label="" prop="parentId">
          <l-formt-title label="医嘱大类" :required="true" class="margin5">
            <l-value-domain
              clearable
              remoteUrl="/doctorsAdvice/getListOn"
              :remoteParams="remoteParams"
              type="select"
              :value.sync="sonUtilsFilter.parentId"
              remoteShowKey="doctorsAdviceName"
              remoteValueKey="doctorsAdviceId"
              placeholder="请选择医嘱大类"
            ></l-value-domain>
          </l-formt-title>
        </el-form-item>
        <el-form-item label="" prop="sonDoctorsAdviceName">
          <l-formt-title label="子类名称" :required="true" class="margin5">
            <el-input
              size="medium"
              v-model="sonUtilsFilter.sonDoctorsAdviceName"
            ></el-input>
          </l-formt-title>
        </el-form-item>
        <el-form-item label="" prop="targetSystem">
          <div style="display: flex; align-items: center; height: 46px">
            <el-checkbox
              label="电子申请单"
              true-label="1"
              false-label="0"
              v-model="sonUtilsFilter.isApply"
            ></el-checkbox>
            <l-formt-title
              label="对接系统"
              :required="true"
              class="margin5 inline marginlr5"
              v-if="sonUtilsFilter.isApply == '1'"
            >
              <l-value-domain
                defaultFirst
                remoteShowKey="name"
                remoteValueKey="code"
                :value.sync="sonUtilsFilter.targetSystem"
                code="TARGET_SYSTEM"
                placeholder="请选择对接系统"
              ></l-value-domain>
            </l-formt-title>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div style="text-align: center">
      <el-button
        @click="addDepartment"
        type="primary"
        icon="el-icon-circle-plus-outline"
        style="margin: 10px"
        >执行科室
      </el-button>
    </div>
    <div style="text-align: center" :class="mainTableCls">
      <el-form
        :model="fromData"
        ref="tableFrom"
        class="tableWrapperForm height100"
        :rules="fromData.rules"
      >
        <el-table
          @row-click="rowClick"
          :row-class-name="rowStyleCls"
          :data="fromData.tableData"
          border
          height="100%"
        >
          <!-- 业务列 -->
          <el-table-column
            v-for="(item, index) in tableParams"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            header-align="center"
            :align="item.align || 'center'"
            :fixed="item.fixed"
          >
            <template slot-scope="scope">
              <!--病人科室-->
              <template v-if="item.prop === 'pDepartment'">
                <!--科室-->
                <l-value-domain
                  clearable
                  code=""
                  remoteUrl="/wadmin/hos/dept"
                  type="select"
                  :value.sync="scope.row.pDepartment"
                  remoteShowKey="orgNm"
                  remoteValueKey="id"
                  :placeholder="'请选择' + item.label"
                ></l-value-domain>
              </template>
              <!--执行科室-->
              <template v-else-if="item.prop === 'eDepartment'">
                <el-form-item
                  :prop="'tableData.' + scope.$index + '.eDepartment'"
                  :rules="fromData.fromDataRules.eDepartment"
                  :show-message="false"
                >
                  <l-value-domain
                    clearable
                    code=""
                    remoteUrl="/wadmin/hos/dept"
                    type="select"
                    :value.sync="scope.row.eDepartment"
                    remoteShowKey="orgNm"
                    remoteValueKey="id"
                    :placeholder="'请选择' + item.label"
                  ></l-value-domain>
                </el-form-item>
              </template>
              <!--医嘱类别-->
              <template v-else-if="item.prop === 'type'">
                <el-select v-model="scope.row.type" placeholder="请选择">
                  <el-option :key="0" label="医嘱类别" :value="0"> </el-option>
                </el-select>
              </template>
              <!--时间起-->
              <template v-else-if="item.prop === 'sTime'">
                <el-date-picker
                  :picker-options="startTime(scope.row.eTime)"
                  v-model="scope.row.sTime"
                  style="width: 100%"
                  type="datetime"
                  placeholder="开始时间"
                  default-time="12:00:00"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
              </template>
              <!--时间止-->
              <template v-else-if="item.prop === 'eTime'">
                <el-date-picker
                  v-model="scope.row.eTime"
                  :picker-options="endTime(scope.row.sTime)"
                  style="width: 100%"
                  type="datetime"
                  placeholder="结束时间"
                  default-time="12:00:00"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
              </template>
              <!--默认-->
              <template v-else-if="item.prop === 'default'">
                <el-checkbox
                  v-model="scope.row.default"
                  true-label="1"
                  false-label="0"
                  @change="defaultChange"
                ></el-checkbox>
              </template>
              <!--操作-->
              <template v-else-if="item.prop === 'action'">
                <el-button
                  size="small"
                  type="text"
                  icon="el-icon-delete"
                  @click="del(scope.row)"
                ></el-button>
              </template>
              <span v-else>{{ scope.row[item.prop] }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div style="position: absolute; right: 10px; bottom: 10px">
        <el-button @click="reset">新增</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  saveDoctorsAdvice,
  getDoctorsAdviceInfo
} from "@/api/systemManagement/dataMaintain/doctorsAdvice";
import { removeAdviceExecRelate } from "@/api/systemManagement/dataMaintain/doctorsAdviceRelation";

export default {
  name: "right",
  props: ["type"],
  components: {},
  data() {
    return {
      bigUtilsFilter: {
        doctorsAdviceId: null,
        doctorsAdviceCode: "",
        doctorsAdviceName: "",
        status: ""
      },
      bigRules: {
        doctorsAdviceCode: [
          { required: true, message: "代码不能为空", trigger: "blur" }
        ],
        doctorsAdviceName: [
          { required: true, message: "大类名称不能为空", trigger: "blur" }
        ]
      },
      sonRules: {
        parentId: [
          {
            required: true,
            message: "医嘱大类不能为空",
            trigger: "blur"
          }
        ],
        sonDoctorsAdviceName: [
          {
            required: true,
            message: "子类名称不能为空",
            trigger: "blur"
          }
        ],
        doctorsAdviceCode: [
          {
            required: true,
            message: "代码不能为空",
            trigger: "blur"
          }
        ]
      },
      currentRow: {},
      currentRowIndex: 0,
      sonUtilsFilter: {
        parentId: "",
        doctorsAdviceId: null,
        doctorsAdviceCode: "",
        doctorsAdviceName: "",
        status: "",
        isApply: "0",
        targetSystem: "",
        sonDoctorsAdviceName: ""
      },
      isType: "",
      // tableData:[],
      fromData: {
        tableData: [],
        fromDataRules: {
          eDepartment: [
            { required: true, message: "请选择执行科室", trigger: "blur" }
          ]
        }
      },

      tableParams: [
        {
          prop: "pDepartment",
          label: "病人科室",
          width: 130,
          fixed: true
        },
        {
          prop: "eDepartment",
          label: "执行科室",
          width: 130,
          fixed: true
        },
        {
          prop: "default",
          label: "默认",
          width: 50,
          fixed: true
        },
        /*{
          prop:'type',
          label:'医嘱类别'
        },*/ {
          prop: "sTime",
          width: 200,
          label: "时间起"
        },
        {
          prop: "eTime",
          width: 200,
          label: "时间止"
        },
        {
          prop: "action",
          label: "操作",
          width: 60
        }
      ],

      /* start 开始时间小于今天,结束时间不能大于开始时间 */
      startTime: {},
      endTime: {},
      remoteParams: { pageSize: 10, parentId: "0" }, // 分页参数
      remoteSonParams: { pageSize: 10, parentCode: "-1" } // 分页参数
    };
  },
  created() {
    this.startTime = function(eDate) {
      return {
        disabledDate(time) {
          return time.getTime() > new Date(eDate).getTime();
        }
      };
    };

    this.endTime = function(sDate) {
      return {
        disabledDate(time) {
          return time.getTime() < new Date(sDate).getTime();
        }
      };
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    rowClick(row, column, event) {
      this.currentRow = row;
      this.currentRowIndex = row.trindex;
    },
    //处理 row 的样式
    rowStyleCls(a) {
      a.row.trindex = a.rowIndex;
    },
    //默认的checkbox 选中一个 其他个取消
    defaultChange(data) {
      if (data === "1") {
        //没有选中要变成选中状态 此时是1
        this.fromData.tableData.forEach((item, index) => {
          if (index !== this.currentRowIndex) {
            item.default = "0";
          }
        });
      }
    },
    //表单的error 信息
    showErrorMsg(errorObj) {
      let self = this;
      for (let key in errorObj) {
        setTimeout(function() {
          if (document.getElementsByClassName("el-message").length === 0) {
            //message 弹窗一次错误
            self.$message.error(errorObj[key][0]);
          }
        }, 0);
      }
    },
    init() {
      this.isType = this.type;
      // this.$set(this.fromData,'tableData',this.tableData)
    },
    addDepartment() {
      let propList = this.tableParams.map(item => {
        return item.prop;
      });
      let obj = {
        __targetId__: +new Date()
      };
      propList.forEach(item => {
        obj[item] = "";
      });
      // console.info("tableData", this.tableData);
      this.fromData.tableData.push(obj);
      this.currentRow = obj;
      this.currentRowIndex = this.fromData.tableData.length - 1;
    },
    del(row) {
      // console.log('发送删除接口',row);
      removeAdviceExecRelate(row).then(res => {
        if (res.code === 1) {
          this.fromData.tableData = this.fromData.tableData.filter(item => {
            return item.__targetId__ !== row.__targetId__;
          });
        } else {
          this.$message(res.msg);
        }
      });
    },
    reset() {
      this.bigUtilsFilter = {
        doctorsAdviceId: null,
        doctorsAdviceCode: "",
        doctorsAdviceName: "",
        status: "0"
      };
      this.sonUtilsFilter = {
        doctorsAdviceId: null,
        doctorsAdviceCode: "",
        doctorsAdviceName: "",
        parentId: null,
        status: "0",
        targetSystem: "",
        isApply: "0"
      };
      this.fromData.tableData = [];
      this.resetForm();
    },

    resetForm() {
      this.$refs["bigRuleForm"] && this.$refs["bigRuleForm"].resetFields();
      this.$refs["sonRuleForm"] && this.$refs["sonRuleForm"].resetFields();
      try {
        this.$refs["tableFrom"] && this.$refs["tableFrom"].resetFields();
      } catch (e) {
        console.log(e);
      }
    },

    save() {
      // if (this.isType === 'big' && this.bigUtilsFilter.doctorsAdviceName === "") {
      //   this.$message.warning("名称不能为空！");
      //   return false;
      // }
      // if (this.isType !== 'big' && this.sonUtilsFilter.sonDoctorsAdviceName === "") {
      //   this.$message.warning("名称不能为空！");
      //   return false;
      // }
      // debugger

      let bigFlag = false;
      let sonFlag = false;
      let tableFlag = false;
      console.log("20200317 sonUtilsFilter", this.sonUtilsFilter);
      if (this.$refs["bigRuleForm"]) {
        console.log(this.$refs["bigRuleForm"]);
        this.$refs["bigRuleForm"].validate(valid => {
          if (valid) {
            bigFlag = true;
            return;
          } else {
            console.log("error submit!!");
            bigFlag = false;
            return false;
          }
        });
      } else {
        bigFlag = true;
      }

      if (this.$refs["sonRuleForm"]) {
        console.log(this.sonUtilsFilter);
        this.$refs["sonRuleForm"].validate((valid, error) => {
          console.log(valid, error);
          if (valid) {
            sonFlag = true;
          } else {
            console.log("error submit!!");
            sonFlag = false;
            return false;
          }
        });
      } else {
        sonFlag = true;
      }

      this.$refs["tableFrom"].validate((valid, error) => {
        if (valid) {
          tableFlag = true;
        } else {
          console.log(error);
          this.showErrorMsg(error);
          tableFlag = false;
          return false;
        }
      });

      if (!sonFlag || !bigFlag || !tableFlag) {
        return;
      }

      let adviceExecRelateList = [];
      for (let i = 0; i < this.fromData.tableData.length; i++) {
        let adviceExecRelate = {
          adviceId: this.bigUtilsFilter.doctorsAdviceId,
          visitDeptId: this.fromData.tableData[i].pDepartment,
          execDeptId: this.fromData.tableData[i].eDepartment,
          // isDefault: (this.fromData.tableData[i].default == 'true') ? 1 : 0,
          isDefault: this.fromData.tableData[i].default,
          startTime: this.fromData.tableData[i].sTime,
          endTime: this.fromData.tableData[i].eTime
        };
        // console.info("adviceExecRelate",adviceExecRelate);
        adviceExecRelateList.push(adviceExecRelate);
      }
      let parentId = this.isType == "big" ? "0" : this.sonUtilsFilter.parentId;
      let obj = {
        doctorsAdvicePO: {
          parentId: parentId,
          doctorsAdviceId:
            this.isType == "big"
              ? this.bigUtilsFilter.doctorsAdviceId
              : this.sonUtilsFilter.doctorsAdviceId,
          doctorsAdviceName:
            this.isType == "big"
              ? this.bigUtilsFilter.doctorsAdviceName
              : this.sonUtilsFilter.sonDoctorsAdviceName,
          doctorsAdviceCode:
            this.isType == "big"
              ? this.bigUtilsFilter.doctorsAdviceCode
              : this.sonUtilsFilter.doctorsAdviceCode,
          status:
            this.isType == "big"
              ? this.bigUtilsFilter.status
              : this.sonUtilsFilter.status
        },
        adviceExecRelateList: adviceExecRelateList
      };

      debugger;

      if (this.isType == "son") {
        let copydoctorsAdvicePO = {
          ...obj.doctorsAdvicePO,
          ...{
            isApply: this.sonUtilsFilter.isApply,
            targetSystem: this.sonUtilsFilter.targetSystem
          }
        };
        obj.doctorsAdvicePO = copydoctorsAdvicePO;
      }

      this.saveDoctorsAdviceFun(obj);
      // this.$emit('save', this.fromData.tableData);
    },

    saveDoctorsAdviceFun(obj) {
      saveDoctorsAdvice(obj).then(res => {
        // console.log(res)
        if (res.code === 1) {
          let msg =
            this.isType == "big" ? "保存医嘱大类成功" : "保存医嘱子类成功";
          this.$message.success(msg);
          this.bigUtilsFilter.doctorsAdviceId = null;
          this.bigUtilsFilter.doctorsAdviceName = "";
          this.bigUtilsFilter.doctorsAdviceCode = "";
          this.bigUtilsFilter.status = "0";
          this.sonUtilsFilter.doctorsAdviceId = null;
          this.sonUtilsFilter.doctorsAdviceName = "";
          this.sonUtilsFilter.sonDoctorsAdviceName = "";
          this.sonUtilsFilter.doctorsAdviceCode = "";
          this.bigUtilsFilter.status = "0";
          this.sonUtilsFilter.isApply = "0";
          this.sonUtilsFilter.targetSystem = "";
          this.fromData.tableData = [];
          this.resetForm(); //保存成功之后重置表单
          if (this.isType === "son") {
            this.$emit("save", 4);
          } else if (this.isType === "big") {
            this.$emit("save", 3);
          }
        } else {
          //this.$message.error(res.message ? res.message : "保存失败！");
          this.$message.error(res.data ? res.data : "保存失败！");
        }
      });
    },
    loadData(row) {
      this.fromData.tableData = [];
      let doctorsAdviceId = row.doctorsAdviceId;
      let obj = {
        id: doctorsAdviceId
      };

      this.$nextTick(() => {
        this.resetForm(); //重置表单
      });

      getDoctorsAdviceInfo(obj).then(res => {
        if (res.code === 1) {
          let doctorsAdviceDTO = res.data;
          let doctorsAdvice = doctorsAdviceDTO.doctorsAdvicePO;
          if (this.isType == "big") {
            this.bigUtilsFilter.doctorsAdviceId = doctorsAdvice.doctorsAdviceId;
            this.bigUtilsFilter.doctorsAdviceName =
              doctorsAdvice.doctorsAdviceName;
            this.bigUtilsFilter.doctorsAdviceCode =
              doctorsAdvice.doctorsAdviceCode;
            this.bigUtilsFilter.status = doctorsAdvice.status;
          } else {
            this.sonUtilsFilter.doctorsAdviceId = doctorsAdvice.doctorsAdviceId;
            this.sonUtilsFilter.parentId = doctorsAdvice.parentId;
            this.sonUtilsFilter.sonDoctorsAdviceName =
              doctorsAdvice.doctorsAdviceName;
            this.sonUtilsFilter.doctorsAdviceCode =
              doctorsAdvice.doctorsAdviceCode;
            this.sonUtilsFilter.status = doctorsAdvice.status;
            this.sonUtilsFilter.isApply = doctorsAdvice.isApply || "0";
            this.sonUtilsFilter.targetSystem = doctorsAdvice.targetSystem || "";
          }
          let adviceExecRelateList = doctorsAdviceDTO.adviceExecRelateList;
          for (let i = 0; i < adviceExecRelateList.length; i++) {
            let adviceExecRelate = adviceExecRelateList[i];
            let tableRow = {
              // row: {
              pDepartment: adviceExecRelate.visitDeptId,
              eDepartment: adviceExecRelate.execDeptId,
              default: adviceExecRelate.isDefault,
              sTime: adviceExecRelate.startTime,
              eTime: adviceExecRelate.endTime,
              dataVersion: adviceExecRelate.dataVersion,
              id: adviceExecRelate.id
              // }
            };
            this.fromData.tableData.push(tableRow);
          }
        } else {
          this.$message("未找到该类别信息");
        }
      });
      // this.bigUtilsFilter.doctorsAdviceId = row.doctorsAdviceId;
      // this.bigUtilsFilter.doctorsAdviceName = row.doctorsAdviceName;
      // this.bigUtilsFilter.doctorsAdviceCode = row.doctorsAdviceCode;
      // this.bigUtilsFilter.status = row.status == "激活" ? "0" : "1";
      // this.tableData = [];
    }
  },
  watch: {
    type() {
      this.isType = this.type;
    }
  },
  computed: {
    mainTableCls() {
      return {
        bigMainTable: this.isType === "big",
        subMainTable: this.isType === "son"
      };
    }
  }
};
</script>

<style scoped lang="scss">
.wrapper {
  background-color: #fff;
}
.utils-cls {
  padding: 0 10px;
}

.bigMainTable {
  height: calc(100% - 286px);
}
.subMainTable {
  height: calc(100% - 350px);
}

.margin5 {
  margin: 5px 0;
}
.marginlr5 {
  margin: 0 5px;
}
.inline {
  display: inline-block;
}

.mr3 {
  margin-right: 3px;
}

/deep/ .el-form-item__error {
  top: 75% !important;
}

/deep/ .cell {
  padding: 0 !important;
}
</style>
