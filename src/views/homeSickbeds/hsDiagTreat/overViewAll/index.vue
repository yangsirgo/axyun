/* eslint-disable no-dupe-keys */
/* eslint-disable complexity */
<template>
  <div class="pageWrapper height100">
    <l-card-title><span slot="left">诊疗信息</span></l-card-title>
    <diagnosisInfo></diagnosisInfo>
    <l-card-title class="margin-top-32"><span slot="left">医嘱信息</span></l-card-title>
    <div class="mainTable">
      <div class="filter">
        <div class="filter-top margin8">
          <el-radio-group v-model="filter.type" class="marginright8" @change="fetchTableList">
            <el-radio label="1">长期</el-radio>
            <el-radio label="2">临时</el-radio>
          </el-radio-group>
          <el-select class="selectWidth marginright8" v-model="filter.status" placeholder="请选择" @change="query">
            <el-option label="全部状态" value="-2">
            </el-option>
            <el-option label="当前有效" value="-1">
            </el-option>
            <el-option label="停止" value="7">
            </el-option>
            <el-option label="作废" value="9">
            </el-option>
          </el-select>
          <!-- <el-select
            class="selectWidth marginright8"
            v-model="filter.yard"
            placeholder="请选择"
          >
            <el-option
              label="本科及病区"
              value="1"
            >
            </el-option>
          </el-select> -->
          <!-- <el-select
            class="selectWidth marginright8"
            v-model="filter.doctor"
            placeholder="请选择"
          >
            <el-option
              label="全部医生"
              value="1"
            >
            </el-option>
          </el-select> -->
          <!-- <el-select
            class="selectWidth marginright8"
            v-model="filter.listType"
            placeholder="请选择"
          >
            <el-option
              label="医嘱单"
              value="1"
            >
            </el-option>
          </el-select> -->
          <el-input class="inputWidth" placeholder="医嘱名称/简码" :maxLength="100" suffix-icon="el-icon-search" v-model="filter.itemName">
          </el-input>
          <el-button type="primary" plain class="btn margin-left-20" @click="query">查询</el-button>
          <el-button plain class="btn" @click="reset">重置</el-button>
        </div>
        <div class="filter-bottom margin8">
          <el-button v-if="filter.type === '1'" @click="stopHandler" class="filter-item" type="text" icon="iconfont icontingzhi"
            v-hotKey="{ func: 'func_stop' }">停止</el-button>
          <el-button @click="toVoidHandler" class="filter-item" type="text" icon="iconfont iconshanchu" v-hotKey="{ func: 'func_stop' }">作废</el-button>
          <!-- <el-button
            @click="deleteHandler"
            class="filter-item"
            type="text"
            icon="iconfont iconshanchu"
            v-hotKey="{ func: 'func_delete' }"
          >删除</el-button> -->
          <div class="separator"></div>
          <el-button @click="copyLongHandler" class="filter-item" 
            type="text" 
            icon="iconfont iconfuzhidaochangqi"
            v-hotKey="{ func: 'func_copy_long' }">复制到长期</el-button>
          <el-button @click="copyShortHandler" class="filter-item" type="text" icon="iconfont iconfuzhidaochangqi"
            v-hotKey="{ func: 'func_garton_short' }">复制到临时</el-button>
<!--          <el-button @click="saveTemp" class="filter-item" type="text" icon="iconfont iconfuzhidaochangqi" v-hotKey="{ func: 'func_save_temp' }">保存模板</el-button>
          <div class="separator"></div> -->
          <el-button @click="printHandler" class="filter-item" type="text" icon="iconfont icondayin" v-hotKey="{ func: 'func_print' }">医嘱单打印</el-button>
        </div>
      </div>
      <div class="table">
        <el-table ref="multipleTable" highlight-current-row v-loading="mainTableLoading" @selection-change="handleSelectionChange"
          @select="handleSelect" :data="tableData" show-overflow-tooltip border height="100%">
          <!-- 需要列 -->
          <el-table-column type="selection" label="序号" width="32" header-align="center" align="center"></el-table-column>
          <!-- 业务列 -->
          <el-table-column v-for="(item,index) in tableParams" :key="index" :prop="item.prop" :label="item.label"
            show-overflow-tooltip :min-width="item.width" header-align="center" :align="item.align || 'center'" :fixed="item.fixed"
            v-if="!item.hide">
            <template slot-scope="scope">
              <!-- 医嘱内容 -->
              <template v-if="item.prop == 'orderContent'">
                <div class="orderContent kuoKuan" :id="scope.row.id">
                  <span style="color: red">{{scope.row.urgent == 1 ? "紧急" : ""}}</span>
                  <span>{{scope.row.name || ""}}</span>
                  <span>{{scope.row.spec || ""}}</span>
                  <span v-if="!!scope.row.onceDosage">
                    {{scope.row.onceDosage || ""}}<span v-if="scope.row.dosageUnit" :val="scope.row.dosageUnit" code="DrugDoseUnit"
                      v-codeTransform></span>
                  </span>
                  <span v-if="scope.row.useWay" :val="scope.row.useWay" code="MedicationRouteCode" v-codeTransform></span>
                  <span>{{scope.row.remark || ""}}</span>
                  <span v-if="scope.row.stSolutionType" :val="scope.row.stSolutionType" code="SkinTestWay"
                    v-codeTransform></span>
                  <span v-if="scope.row.specialNote" :val="scope.row.specialNote" code="adviceSpecialNote"
                    v-codeTransform></span>
                  <span>{{scope.row.freqCode || ""}}</span>
                  <span>首日{{scope.row.firstDayUse || ""}}</span>
                </div>
              </template>
              <!-- 可自定义内容 -->
              <template v-else-if="item.prop == 'status'">
                <span :val="scope.row.status" code="adviceStatus" v-codeTransform></span>
                <!-- {{ receivePatientData.patientId }} -->
                <!-- <applStatusShow 
                  :patientCode="receivePatientData.patientId" 
                  :aStatus="scope.row.status"></applStatusShow> -->
              </template>
              <template v-else-if="item.prop == 'mSkillStatus'">
                <applStatusShow 
                  :patientObj="receivePatientData" 
                  :aStatus="scope.row.mSkillStatus"></applStatusShow>
              </template>
              <template v-else-if="item.prop == 'type'">
                <span>{{ scope.row.type | filterProperty }}</span>
              </template>
              <template v-else-if="item.prop == 'groupNoCls'">
                <span :class="scope.row.groupNoCls"></span>
              </template>
              <template v-else>
                <span>{{ scope.row[item.prop] || "--"}}</span>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog :modal-append-to-body="false" :visible.sync="dialogVisible" :close-on-click-modal="false" width="475px"
      title="停止医嘱">
      <div class="dialogCls" v-if="dialogVisible">
        <el-form :model="stopForm" :rules="rules" ref="stopForm" label-width="0" inline>
          <div class="radioPart">
            <span class="radioPartTitle">是否预停</span>
            <el-radio-group v-model="orderFutureStop">
              <el-radio label="1">是</el-radio>
              <el-radio label="2">否</el-radio>
            </el-radio-group>
          </div>
          <div class="bottomDate">
            <el-form-item label="" prop="orderStopDate">
              <l-formt-title label="停止日期" style="width: 184px; margin-right: 8px;" :disabled="orderFutureStop ==='2'">
                <el-date-picker v-model="stopForm.orderStopDate" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                  :disabled="orderFutureStop ==='2'" placeholder="选择日期" :clearable="false">
                </el-date-picker>
              </l-formt-title>
            </el-form-item>
            <el-form-item label="" prop="orderStopTime">
              <l-formt-title label="停止时间" style="width: 184px;">
                <el-time-picker v-model="stopForm.orderStopTime" class="date-box" format='HH:mm' :clearable="false"
                  value-format="HH:mm" :picker-options="{
                  selectableRange: '00:00:00 - 23:59:59'
                }">
                </el-time-picker>
              </l-formt-title>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleOk1">停 止</el-button>
        <el-button @click="handleClose1">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script type="text/ecmascript-6">
  import diagnosisInfo from "./module/diagnosisInfo.vue";
  import {
    mapActions,
    mapGetters
  } from "vuex";
  import {
    westAdviceDelete,
    stopAdvice,
    copyToAdvice,
    invalidAdvice,
    westAdviceGetAfterAdvice
  } from "@/api/homeSickbeds/hsDiagTreat/hsOrder.js";
  import {
    type
  } from "jquery";
  import {
    grouping
  } from "@/views/homeSickbeds/hsDiagTreat/order/module/adviceUtil/util.js";
  import {
    getPharmacyData,
    setGroupNoList
  } from "@/components/adviceCommon/adviceUtils.js";
  import applStatusShow from "@/views/public/electronApply/component/applStatusShow.vue"


  export default {
    data() {
      return {
        orderFutureStop: "2",
        dialogVisible: false,
        mainTableLoading: false,
        filter: {
          type: "1", 
          status: "-1",
          // yard: "1",
          // doctor: "1",
          // listType: "1",
          itemName: ""
        },
        statusArr: {
          0: "暂存",
          1: "提交",
          2: "删除",
          3: "已审核",
          4: "停止",
          5: "作废",
          9: "打回",
          10: "审核停止",
          11: "审核停止通过",
          12: "审核停止打回",
          13: "未执行",
          14: "执行中",
          15: "执行完毕",
          16: "撤销"
        },
        tableData: [],
        multipleSelection: [],
        groupNoList: [],
        rules: {
          orderStopDate: [{
            required: true,
            message: "请输入日期",
            trigger: "blur"
          }],
          orderStopTime: [{
            required: true,
            message: "请输入时间",
            trigger: "blur"
          }]
        },
        stopForm: {
          orderStopDate: "",
          orderStopTime: ""
        },
        tableParams: [{
            prop: "status",
            label: "状态",
            fixed: true
          },
          {
            prop: "mSkillStatus",
            label: "医技",
            fixed: true
          },
          {
            prop: "type",
            label: "属性",
            fixed: true
          },
          {
            prop: "expectStartTime",
            label: "开始时间",
            width: "180px",
            fixed: true
          },
          {
            prop: "orderContent",
            label: "医嘱内容",
            width: "470px",
            align: "left",
            fixed: true
          },
          {
            prop: "groupNoCls",
            label: "组",
            width: "55px"
          },
          {
            prop: "doctorName",
            label: "开嘱医生"
          },
          {
            prop: "deptName",
            label: "开嘱科室"
          },
          {
            prop: "terminateTime",
            label: "停止时间",
            width: "180px"
          },
          {
            prop: "terminatorName",
            label: "停止医生"
          },
          {
            prop: "expectStopNurse",
            label: "停止处理护士",
            width: "130px"
          },
          {
            prop: "executorName",
            label: "执行人"
          },
          {
            prop: "execTime",
            label: "执行时间",
            width: "130px"
          },
          {
            prop: "pharmacyName",
            label: "接收科室"
          }
        ]
      };
    },
    filters: {
      filterProperty(value) {
        return value == 1 ? "长期" : "临时";
      }
    },
    components: {
      diagnosisInfo,
      applStatusShow
    },
    computed: {
      ...mapGetters("homeSickbeds", ["receivePatientData"]),
      ...mapGetters("adviceCommon", ["westPharmacyObject"])
    },
    created() {
      this.fetchTableList();
    },
    mounted() {
      this.setPharmacyList();
    },
    watch: {
      receivePatientData: {
        //深度监听,可监听到对象、数组的变化
        handler() {
          console.log("执行次数");
          this.fetchTableList();
        },
        deep: true
      },
      dialogVisible(val) {
        if (val) {
          this.stopForm.orderStopDate = this.dayjs().format("YYYY-MM-DD");
          this.stopForm.orderStopTime = this.dayjs().format("HH:mm");
          this.orderFutureStop = "2";
          this.clearFields();
        }
      }
    },
    methods: {
      ...mapActions({
        changeWestPharmacyObject: "adviceCommon/changeWestPharmacyObject",
        changeChmPharmacyObject: "adviceCommon/changeChmPharmacyObject"
      }),
      async setPharmacyList() {
        try {
          let {
            cList,
            wlist
          } = await getPharmacyData();
          // console.log(data, code, msg);
          this.changeWestPharmacyObject({
              selected: wlist[0] || "",
              list: wlist //西药药房
          });
          //更改中草药药房
          this.changeChmPharmacyObject({
            selected: cList[0] || "",
            list: cList //中药药房
          });
        } catch (error) {
          this.$message.error(error.msg || "获取药房数据失败！");
        }
      },
      handleSelect(selection, row) {
        let isChecked =
          selection.filter(item => {
            return item.id === row.id;
          }).length > 0;
        this.setBunchingSelect([row], isChecked);
      },
      //获取勾选中的 已成组 项
      setBunchingSelect(list, flag) {
        let bunchingList = null;
        list.forEach(item => {
          this.groupNoList.forEach(row => {
            if (row.key === item.majorId) {
              row.value.forEach(tableRow => {
                setTimeout(() => {
                  //修复 selection 只有一个的问题
                  this.$refs.multipleTable.toggleRowSelection(tableRow, flag);
                }, 0);
              });
            }
          });
        });
      },
      getPharmacyId() {
        let target = document.querySelector("[pharmacyId]");
        return target.getAttribute("pharmacyId");
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      // eslint-disable-next-line complexity
      async fetchTableList() {
        let cloneData = {};
        cloneData.bedNo = this.receivePatientData.bedCode;
        cloneData.inpCode = this.receivePatientData.inpCode;
        cloneData.treatNo = this.receivePatientData.treatNo;
        cloneData.treatId = this.receivePatientData.id;
        cloneData.patientId = this.receivePatientData.patientId;
        cloneData.pageNo = 1;
        cloneData.type = this.filter.type;
        cloneData.itemName = this.filter.itemName;
        cloneData.status = this.filter.status;

        if (this.filter.status === "-1") {
          cloneData.effective = "1";
          delete cloneData.status;
        } else if (this.filter.status === "-2") {
          delete cloneData.status;
        }

        cloneData.pageSize = 999;
        cloneData = {
          ...cloneData
          // ...this.filter
        };
        if (!cloneData.treatId) {
          return;
        }
        this.mainTableLoading = true;
        try {
          let {
            data,
            msg,
            code
          } = await westAdviceGetAfterAdvice(cloneData);
          if (code === 1) {
            for (let i = 0; i < data.length; i++) {
              const element = data[i];
              const { id } = element;
              let cloneItem = {
                ...element,
                ...element.item,
                id
              };
              data[i] = cloneItem;
            }

            this.tableData = data;
            this.groupNoList = setGroupNoList(this.tableData);
            grouping(data);
            this.setColumnStatus();
          } else {
            this.$message.error(msg || "获取列表数据错误");
          }
          this.mainTableLoading = false;
        } catch (error) {
          this.mainTableLoading = false;
          this.$message.error("获取列表数据错误");
        }
      },
      setColumnStatus() {
        let hideList =
          this.filter.type == 2 ?
          ["terminateTime", "terminatorName", "expectStopNurse"] :
          ["decPerson", "decTime", "execTime"];
        this.setTableParams();
        this.setTableParams(hideList);
      },
      setTableParams(hideList = []) {
        this.tableParams.forEach(item => {
          this.$set(item, "hide", hideList.indexOf(item.prop) > -1);
        });
      },
      query() {
        this.fetchTableList();
      },
      reset() {
        this.filter = {
          type: "1",
          status: "-1",
          // yard: "1",
          // doctor: "1",
          // listType: "1",
          itemName: ""
        };
      },
      deleteHandler() {
        if (this.multipleSelection.length > 0) {
          //最少选中一项
          this.$confirm("删除后不可恢复，是否继续?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
            .then(() => {
              westAdviceDelete(this.multipleSelection[0])
                .then(res => {
                  if (res.code === 1) {
                    this.$message({
                      type: "success",
                      message: "删除成功!"
                    });
                    this.fetchTableList();
                  } else {
                    this.$message({
                      type: "error",
                      message: res.msg || "删除失败"
                    });
                  }
                })
                .catch(() => {
                  this.$message({
                    type: "error",
                    message: "删除失败"
                  });
                });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消删除"
              });
            });
        } else {
          this.$message({
            type: "warning",
            message: "请选择一条需要删除的医嘱"
          });
        }
      },
      stopHandler() {
        if (this.multipleSelection.length > 0) {
          this.dialogVisible = true;
        } else {
          this.$message({
            type: "warning",
            message: "请选择一条需要删除的医嘱"
          });
        }
      },
      async copyFunc(adviceType) {
        if (this.mainTableLoading) return;
        // this.$nextTick(async ()=>{
        let list = this.getKeyList(this.multipleSelection, "id");
        let ajaxData = {
          list,
          type: adviceType,
          treatId: this.receivePatientData.id,
          pharmacyId: this.westPharmacyObject.selected.deptId
        };
        this.mainTableLoading = true;
        try {
          let {
            code,
            msg,
            data
          } = await copyToAdvice(ajaxData);
          if (code === 1) {
            this.$message.success("医嘱复制成功！");
            this.goOrderPage(adviceType);
          } else {
            this.$message.error(msg || "医嘱复制失败！");
          }
          this.mainTableLoading = false;
        } catch (error) {
          this.$message.error("医嘱复制失败！");
          this.mainTableLoading = false;
        }
        // });
      },
      getKeyList(list = [], key) {
        return list.map(item => {
          return item[key];
        });
      },
      copyLongHandler() {
        if (this.multipleSelection == 0) {
          this.$message.warning("请选择要复制的医嘱！");
          return;
        }
        //选中的有中草药的处方
        if (this.hasChmSelected()){
          this.$message.warning("中草药的医嘱不可以复制！");
          return;
        }
        this.copyFunc("1");
      },
      //选中的有中草药的处方
      hasChmSelected (){
        let tableData = this.multipleSelection;
        let chmClass = "11";
        return tableData.some((item)=>{
          return item.majorClass == chmClass;
        });
      },
      copyShortHandler() {
        if (this.multipleSelection == 0) {
          this.$message.warning("请选择要复制的医嘱！");
          return;
        }
        //选中的有中草药的处方
        if (this.hasChmSelected()){
          this.$message.warning("中草药的医嘱不可以复制！");
          return;
        }
        this.copyFunc("2");
      },
      goOrderPage(adviceType) {
        let transferm = {
          name: "order",
          addition: [{
            name: "setAdviceType",
            value: adviceType
          }]
        };
        this.$emit("setWrapperActiveName", transferm);
      },
      printHandler() {},
      getText(id) {
        let text = document
          .getElementById(id)
          .textContent.trim()
          .replace(/\s+/g, "");
        console.log(text);
        return text;
      },
      toVoidHandler() {
        if (this.multipleSelection.length > 0) {
          let showText = "<div style='height:100%; max-height: 500px; overflow: auto;'><span style='font-weight: bolder;color:black'> 您是否确定作废</span>";
          this.multipleSelection.forEach(item => {
            showText +=
              "<p style='text-align:left'>" + this.getText(item.id) + "</p>";
          });
          showText += "<span  style='font-weight: bolder;color:black'>?</span></div>";
          this.$confirm(showText, "作废医嘱", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              closeOnClickModal: false,
              dangerouslyUseHTMLString: true,
              type: "warning"
            })
            .then(async () => {
              if (this.mainTableLoading) return;
              this.mainTableLoading = true;
              let multipleSelection = {
                adviceIds: this.multipleSelection.map(item => {
                  return item.id;
                })
              };
              //继续选中操作
              try {
                let {
                  data,
                  code,
                  msg
                } = await invalidAdvice(multipleSelection);
                if (code === 1) {
                  this.$message.success("作废医嘱成功！");
                  this.fetchTableList();
                } else {
                  this.$message.error(msg || "作废医嘱失败！");
                }
                this.mainTableLoading = false;
              } catch (error) {
                this.$message.error("作废医嘱失败！");
                this.mainTableLoading = false;
              }
            })
            .catch(() => {});
        } else {
          this.$message({
            type: "warning",
            message: "请选择一条需要删除的医嘱"
          });
        }
      },
      handleClose1() {
        this.dialogVisible = false;
      },
      validateStopForm() {
        return new Promise((resolve, reject) => {
          this.$refs["stopForm"].validate(valid => {
            if (valid) {
              resolve(true);
            } else {
              reject(false);
            }
          });
        });
      },
      clearFields(formName) {
        this.$nextTick(() => {
          this.$refs["stopForm"].clearValidate();
        });
      },
      // eslint-disable-next-line vue/no-dupe-keys
      clearFields(formName) {
        this.$nextTick(() => {
          this.$refs["stopForm"].clearValidate();
        });
      },
      // date 和 time 都是时间戳
      jionDateAndTime(date, time) {
        let dateTime = date + " " + time;
        console.log(dateTime, "dateTime");
        dateTime = this.dayjs(dateTime).format("YYYY-MM-DD HH:mm");
        console.log(dateTime, "dateTime");
        return dateTime;
      },
      async handleOk1() {
        if (this.mainTableLoading) return;

        try {
          let result = await this.validateStopForm();
        } catch (error) {
          return;
        }
        let stopTime = this.jionDateAndTime(
          this.stopForm.orderStopDate,
          this.stopForm.orderStopTime
        );

        console.log("结束时间日志：：", stopTime);
        let multipleSelection = {
          adviceIds: this.multipleSelection.map(item => {
            return item.id;
          }),
          stopTime
        };
        this.mainTableLoading = true;
        try {
          let {
            data,
            code,
            msg
          } = await stopAdvice(multipleSelection);
          if (code === 1) {
            this.$message.success("停止医嘱成功！");
            this.dialogVisible = false;
            this.fetchTableList();
          } else {
            this.$message.error(msg || "停止医嘱失败！");
          }
          this.mainTableLoading = false;
        } catch (error) {
          this.$message.error("停止医嘱失败！");
          this.mainTableLoading = false;
        }
      }
    }
  };
</script>

<style scoped lang="scss">
  .pageWrapper {
    padding: 16px;
    display: flex;
    flex-direction: column;

    .dialogCls {
      padding: 16px 20px;

      .radioPart {
        font-size: 14px;
        font-weight: 400;
        color: #666c70;

        .radioPartTitle {
          padding-right: 8px;
        }
      }

      .bottomDate {
        padding-top: 8px;
        font-size: 0;
      }
    }

    .mainTable {
      flex: 1;
      display: flex;
      flex-direction: column;

      .filter {
        font-size: 0;

        .filter-top {
          .selectWidth {
            width: 112px;
          }

          .inputWidth {
            width: 226px;
          }
        }

        .filter-bottom {
          display: flex;
          align-items: center;

          .el-button:first-of-type {
            padding-left: 0 !important;
          }

          .el-button {
            padding: 8px;
          }

          .el-button--text,
          .el-button--text:hover {
            font-size: 14px;
            font-weight: 400;
            color: #2e323a;
          }

          .separator {
            width: 2px;
            height: 18px;
            margin: 0 8px;
            background: #e4e4e4;
            display: inline-block;
          }

          /deep/ .el-button {
            &>i {
              font-size: 18px;
              vertical-align: middle;
              padding: 3px;
            }

            &>span {
              margin-left: 5px;
            }
          }

          .el-button+.el-button {
            margin-left: 5px;
          }
        }
      }

      .table {
        flex: 1;
      }
    }
  }

  .margin8 {
    margin: 8px 0 10px 0;
  }

  .marginright8 {
    margin-right: 8px;

    &:last-child {
      margin-right: 0px;
    }
  }

  .vertical-baseline {
    vertical-align: baseline;
  }

  .margin-top-32 {
    margin-top: 32px;
  }

  .bunchingUp {
    display: inline-block;
    color: $l-color-primary;

    &::after {
      content: "┓";
    }
  }

  .bunchingCenter {
    display: inline-block;
    color: $l-color-primary;

    &::after {
      content: "┫";
    }
  }

  .bunchingDown {
    color: $l-color-primary;
    display: inline-block;

    &::after {
      content: "┛";
    }
  }

  .orderContent {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    >span+span {
      padding-right: 5px;
    }
  }

  .kuoKuan {
    margin-left: -8px;
    margin-right: -10px;
    padding-left: 8px;
    padding-right: 10px;
  }
</style>
