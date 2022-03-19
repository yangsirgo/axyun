<template>
  <div style="width: 100%;height: 100%;">
    <el-card style="width: 100%;height:100%" id="card">
      <div ref="SearchForm" class="search-box">
        <el-radio-group class="radio-group"  @change="radioChange" v-model="searchForm.categoryCode">
          <el-radio :label="1">{{$t('cis.medicalOrder.long')}}</el-radio>
          <el-radio :label="2">{{$t('cis.medicalOrder.short')}}</el-radio>
          <el-radio :label="3">{{$t('cis.medicalOrder.outWithMedicine')}}</el-radio>
        </el-radio-group>
        <el-date-picker
          clearable
          class="datePicker"
          v-model="searchForm.dateRange"
          style="float: left; width: 230px;"
          type="daterange"
          prefix-icon="iconfont iconriqi"
          :start-placeholder="$t('cis.medicalOrder.startDate')"
          :end-placeholder="$t('cis.medicalOrder.endDate')"
          :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
        <el-select class="select-item" v-model="searchForm.status" placeholder="请选择">
          <el-option label="全部" value>全部</el-option>
          <el-option label="暂存" value="0">暂存</el-option>
          <el-option label="已提交" value="1">已提交</el-option>
          <el-option label="已停止" value="4">已停止</el-option>
          <el-option label="已作废" value="5">已作废</el-option>
          <el-option label="审核驳回" value="9">审核驳回</el-option>
          <el-option label="未执行" value="13">未执行</el-option>
          <el-option label="执行中" value="14">执行中</el-option>
          <el-option label="执行完毕" value="15">执行完毕</el-option>
        </el-select>
        <el-select class="select-item" v-model="searchForm.deptType" placeholder="请选择">
          <el-option label="本科医嘱" value="1">本科医嘱</el-option>
          <el-option label="其他科室医嘱" value="2">其他科室医嘱</el-option>
        </el-select>
        <el-select
          class="select-item"
          v-model="searchForm.today"
          placeholder="请选择"
        >
          <el-option label="全部" value>全部</el-option>
          <el-option label="今日" value="1">今日</el-option>
        </el-select>
        <el-input
          class="select-item"
          style="width: 193px;"
          placeholder="医嘱关键字"
          suffix-icon="el-icon-search"
          v-model="searchForm.name">
        </el-input>
        <el-button style="margin-left: 10px;float: left;margin-top: 12px;" @click="searchAdv" type="primary">
          {{$t('cis.btn.check')}}
        </el-button>
      </div>
      <el-table
        :data="tableList"
        ref="multipleTable"
        stripe
        highlight-current-row
        :height="tableHeight"
        style="width: 100%">
        <el-table-column
          width="45">
          <el-table-column
            type="selection"
            width="45">
          </el-table-column>
        </el-table-column>
        <el-table-column
          :label="$t('cis.medicalOrder.start')">
          <el-table-column
            :label="$t('cis.medicalOrder.status')"
            show-overflow-tooltip
            min-width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.status === '0'">暂存</span>
              <span v-else-if="scope.row.status === '1'">已提交</span>
              <!--  <span v-else-if="scope.row.status === '3'" class="disabled">审核通过</span>-->
              <span v-else-if="scope.row.status === '4'">已停止</span>
              <span v-else-if="scope.row.status === '5'" class="disabled">已作废</span>
              <span v-else-if="scope.row.status === '13'">未执行</span>
              <span v-else-if="scope.row.status === '14'">执行中</span>
              <span v-else-if="scope.row.status === '15'">执行完毕</span>
              <spangetHistoryByPatient
                class="state-info"
                v-else-if="
                      scope.row.status === '9' || scope.row.status === '12'
                    "
              >
                    <span v-if="scope.row.status === '9'" class="disabled"
                    >审核驳回</span
                    >
                <span v-else class="disabled">停嘱驳回</span>
                <el-popover
                  trigger="hover"
                  placement="right-start"
                  popper-class="popper-class"
                >
                  <div class="hoverContent">
                    {{ scope.row.rejectReason }}
                  </div>
                  <i
                    slot="reference"
                    class="el-icon-warning-outline state-info-icon"
                  ></i>
                </el-popover>
              </spangetHistoryByPatient>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('cis.medicalOrder.adviceTime')"
            prop="adviceTime"
            show-overflow-tooltip
            min-width="100">
          </el-table-column>
          <el-table-column
            :label="$t('cis.medicalOrder.beginTime')"
            prop="beginTime"
            show-overflow-tooltip
            min-width="60">
          </el-table-column>
        </el-table-column>
        <el-table-column
          :label="$t('cis.medicalOrder.medicalOrder')">
          <el-table-column
            :label="$t('cis.medicalOrder.name')"
            prop="name"
            show-overflow-tooltip
            min-width="220">
          </el-table-column>
          <el-table-column
            :label="$t('cis.rpTableTitle.bunching')"
            min-width="40">
            <template slot-scope="scope">
              <span :class="scope.row.groupNoCls"></span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('cis.rpTableTitle.spec')"
            prop="spec"
            show-overflow-tooltip
            min-width="80">
          </el-table-column>
          <el-table-column
            :label="$t('cis.medicalOrder.uses')"
            prop="uses"
            show-overflow-tooltip
            min-width="60">
            <template slot-scope="scope">
              <span :val="scope.row.uses" code="MedicationRouteCode" v-codeTransform></span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('cis.medicalOrder.onceDosage')"
            prop="onceDosage"
            show-overflow-tooltip
            min-width="60">
          </el-table-column>
          <el-table-column
            :label="$t('cis.rpTableTitle.frequencyCode')"
            prop="frequency"
            show-overflow-tooltip
            min-width="60">
            <template slot-scope = 'scope'>
              <span columns="FREQUENCY_NAME" :conditionMap="{FREQUENCY_CODE: scope.row.frequency}" tableName="hrp_frequency" v-tableTransform></span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('cis.medicalOrder.normalDate')"
            prop="normalDate"
            show-overflow-tooltip
            min-width="100">
          </el-table-column>
          <el-table-column
            :label="$t('cis.medicalOrder.doctorName')"
            prop="doctorName"
            show-overflow-tooltip
            min-width="80">
          </el-table-column>
          <el-table-column
            :label="$t('cis.medicalOrder.deptName')"
            prop="deptName"
            show-overflow-tooltip
            min-width="80">
          </el-table-column>
        </el-table-column>
        <el-table-column
          :label="$t('cis.medicalOrder.stop')"
          min-width="100">
          <el-table-column
            :label="$t('cis.medicalOrder.stopDoctorTime')"
            prop="stopDoctorTime"
            show-overflow-tooltip
            min-width="100">
          </el-table-column>
          <el-table-column
            :label="$t('cis.medicalOrder.endTime')"
            prop="endTime"
            show-overflow-tooltip
            min-width="100">
          </el-table-column>
          <el-table-column
            :label="$t('cis.medicalOrder.stopDoctorName')"
            prop="end_doctor"
            show-overflow-tooltip
            min-width="100">
          </el-table-column>
          <el-table-column
            :label="$t('cis.medicalOrder.Nurse')"
            prop="end_nurse"
            show-overflow-tooltip
            min-width="100">
          </el-table-column>
        </el-table-column>
        <el-table-column
          :label="$t('cis.medicalOrder.other')"
          min-width="100">
          <el-table-column
            :label="$t('cis.medicalOrder.ExecutiveRoom')"
            prop="execute_depart"
            show-overflow-tooltip
            min-width="100">
          </el-table-column>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
    import {
      adviceDelete,
      allStop,
      bunching,
      cancel,
      copyLong,
      copyShort,
      getAdvice,
      gonna,
      stop,
      unbunching,
      adviceSubmit
    } from "@/api/cis/resident/residentAdvice";
    import {mapGetters} from 'vuex'

    export default {
        name: "medicalOrderList",
        data(){
          return {
            searchForm: {
              categoryCode: 1,
              inpCode: "",
              dateRange: [],
              patientId: "",
              bedNo: "",
              name: "", // 医嘱查询关键词
              status: "", //
              deptType: "1", //
              adviceType: "1",
              today: "" ,
              patientName: ""
            },
            //  医嘱列表
            tableList: [],
            tableHeight: 100
          }
        },
        mounted(){
          setTimeout(()=>{
            this.tableHeight = document.getElementById("card").offsetHeight - 60
          })
          this.fetchTableList()
        },
        watch: {
          receivePatientData: {
            handler(c) {
              this.searchForm.inpCode = c.inpCode;
              this.searchForm.patientId = c.patientId;
              this.searchForm.bedNo = c.bedCode;
              this.fetchTableList();
            },
            immediate: true
          }
        },
        computed: {
          ...mapGetters("base", ["receivePatientData"])
        },
        methods: {
          // 查询医嘱按钮
          searchAdv() {
            this.fetchTableList();
          },
          async fetchTableList() { // 请求医嘱方法
            let data = this.searchForm;
            let cloneData = Object.assign(data);
            for(let key in data) {
              if (key === 'dateRange') {
                if (data[key] != null && data[key].length != 0) {
                  cloneData['startDate'] = data[key][0];
                  cloneData['endDate'] = data[key][1];
                }else {
                  cloneData['startDate'] = '';
                  cloneData['endDate'] = '';
                }
              }
            }
            getAdvice(cloneData).then((data) => {
              this.tableList = data.data;
              this.grouping(data.data);
            });
          },
          radioChange() {

            this.fetchTableList();
          //  this.$root.eventHub.$emit("radioType", this.searchForm.categoryCode);
          },
          grouping(list1) { // 将list 分组
            // 将list 分组
            return new Promise((resolve, reject) => {
              let list = [];
              let groupList = [];
              let filterList = [];
              let tableList = [];
              console.log(list1);
              groupList = list1.map(item => {
                // 获取所有组
                return item.groupNo;
              });

              groupList = Array.from(new Set(groupList));
              groupList = groupList.filter((item, index) => {
                // 数组去undefind
                return item !== undefined && item != "";
              });
              groupList.forEach((item, index) => {
                //遍历 成map结构 分组
                // list = [];
                filterList = list1.filter((sonItem, sonIde) => {
                  return item === sonItem.groupNo;
                });
                list.push({
                  key: item,
                  value: filterList
                });
              });
              list.forEach(item => {
                // 将有组item添加class
                let itemList = item.value;
                if (itemList.length == 1) {
                  return;
                }
                itemList.forEach((sonItem, sonIndex) => {
                  if (sonIndex === 0) {
                    sonItem.groupNoCls = "bunchingUp";
                  } else if (sonIndex === itemList.length - 1) {
                    sonItem.groupNoCls = "bunchingDown";
                  } else {
                    sonItem.groupNoCls = "bunchingCenter";
                  }
                });
              });
              console.log(list);
              list.map(item => {
                // 更改list格式
                item.value.map(val => {
                  tableList.push(val);
                });
              });
              list1.map(item => {
                // 补充未成组项
                if (!item.groupNo) {
                  tableList.push(item);
                }
              });
              console.log(tableList);
              resolve(tableList);
            });
          }
        }
    }
</script>

<style lang="scss" scoped>
  .search-box {
    overflow: hidden;
    line-height: 60px;
    padding-left: 20px;

    .radio-group {
      float: left;
      margin-top: 20px;
    }

    .datePicker {
      margin: 12px 0 0 10px;
    }

    .select-item {
      float: left;
      width: 120px;
      margin-left: 10px;
    }
  }
  .bunchingUp {
    display: inline-block;
    color: $l-color-primary;

    &::after {
      content: '┓';
    }
  }

  .bunchingCenter {
    display: inline-block;
    color: $l-color-primary;

    &::after {
      content: '┫';
    }
  }

  .bunchingDown {
    color: $l-color-primary;
    display: inline-block;

    &::after {
      content: '┛';
    }
  }

  .state-info {
    position: relative;
    font-size: 14px;
    
    font-weight: 400;
    display: inline-block;
    width: 100%;
    .state-info-icon {
      position: absolute;
      right: 0;
      width: 15px;
      height: 15px;
      display: inline-block;
      color: #ffd2c2;
      top: 0;
      cursor: pointer;
      z-index: 100;
    }
  }
</style>
