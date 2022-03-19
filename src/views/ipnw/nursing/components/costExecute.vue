<template>
  <div class="containers height100 position-relative">
    <div class="right height100 position-relative padding10">
      <div class="height100 position-relative" style="padding-bottom: 150px;" v-loading="isLoading">
        <div class="overflow-hidden search-box padding10" style="padding-bottom: 0px;">
          <div class="float-left margin-right-20" style="margin-top: 9px;">
            <el-checkbox-group
              class="float-left"
              @change="categoryCodeChange"
              v-model="categoryCode"
            >
              <el-checkbox label="0">待执行</el-checkbox>
              <el-checkbox label="1">已执行</el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="overflow-hidden" style="height: 60px;">
            <span class="float-left margin-right-20" style="line-height: 36px;">类型</span>
            <el-radio
              class="float-left"
              @change="categoryCodeChange"
              style="margin-top: 10px;"
              v-model="time_type"
              label="1"
            >开嘱时间</el-radio>
            <el-radio
              class="float-left"
              @change="categoryCodeChange"
              style="margin-top: 10px;"
              v-model="time_type"
              label="2"
            >执行时间</el-radio>
            <l-formt-title label="选择时间" style="width: 350px;" class="position-relative float-left">
              <el-date-picker
                v-model="dateRange"
                @change="categoryCodeChange"
                type="daterange"
                prefix-icon="null"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                :default-time="['00:00:00', '23:59:59']"
              ></el-date-picker>
              <i class="iconfont iconriqi position-absolute date-icon"></i>
            </l-formt-title>
          </div>
        </div>
        <div class="padding20 right height100" style="padding-top: 0;overflow-y: auto">
          <el-collapse v-model="activeNames" style="border: none;">
            <l-collapse-item
              v-for="(parentItem, $index) in stayExecute.data"
              :name="$index"
              :key="$index"
            >
              <div slot="title" style="font-size: 14px;">
                <el-checkbox v-model="parentItem.checked" @change="selectAll($index)"></el-checkbox>
                <!-- <span style="font-size: 20px;">{{parentItem.bedNo}}</span>床 -->
                <span class="margin-left-20">{{parentItem.patientName}}</span>
                <span
                  class="margin-left-20"
                  :val="parentItem.patientGender"
                  code="GENDER_CODE"
                  v-codeTransform
                >{{parentItem.patientGender}}</span>
                <!-- <span class="margin-left-20">{{parentItem.ageInfo}}岁</span> -->
              </div>
              <div slot="content">
                <div class="table-wrapper" style="margin-top: 5px;">
                  <el-table
                    header-cell-class-name="headerCls"
                    row-class-name="rowStyleCls"
                    ref="singleTable"
                    :data="parentItem.itemData"
                    highlight-current-row
                    style="width: 100%"
                    stripe
                    border
                    @select="selectItem"
                    element-loading-text="加载中..."
                  >
                    <el-table-column type="selection" width="45"></el-table-column>
                    <el-table-column
                      v-for="item in stayExecute.columnAll"
                      :key="item.label"
                      :label="item.label"
                      :prop="item.prop"
                      align="center"
                      show-overflow-tooltip
                      header-align="center"
                      :min-width="item.width"
                    >
                      <template slot-scope="scope">
                        <div class="color2" v-if="item.prop === 'basicDosage'">
                          <template v-if="scope.row.dosageValue">
                            {{scope.row.onceDosage/scope.row.dosageValue}}
                            <span
                              :val="scope.row.packUnit"
                              code="DrugUnit"
                              v-codeTransform
                            ></span>
                          </template>
                          <template v-else-if="scope.row.originId=='1'">
                            {{scope.row.onceDosage}}

                          </template>
                        </div>
                        <div v-else-if="item.prop === 'status'" class="color1">
                          <span>{{statusArr[scope.row.status]}}</span>
                        </div>
                        <div v-else-if="item.prop === 'uses'">
                          <div :val="scope.row.uses" code="MedicationRouteCode" v-codeTransform></div>
                        </div>
                        <div v-else-if="item.prop === 'groupNoCls'">
                          <span :class="scope.row[item.prop]"></span>
                        </div>
                        <div v-else-if="item.prop === 'deptCode'">
                          <span
                            tableName="sys_org"
                            :conditionMap="{org_type: '_DEPT_', id: scope.row[item.prop]}"
                            columns="org_nm"
                            v-tableTransform
                          ></span>
                        </div>
                        <div v-else-if="item.prop ==='prepayBalance'">
                          <template v-if="scope.row[item.prop]===1">未欠费</template>
                          <template v-else>欠费</template>
                        </div>
                        <template v-else-if="item.prop === 'frequency'">
                          <span
                            v-if="scope.row.frequency"
                            columns="FREQUENCY_NAME"
                            :conditionMap="{FREQUENCY_CODE: scope.row.frequency}"
                            tableName="hrp_frequency"
                            v-tableTransform
                          ></span>
                        </template>

                        <div v-else>{{scope.row[item.prop]}}</div>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </l-collapse-item>
          </el-collapse>
        </div>
      </div>
      <div class="btn">
        <el-button
          type="primary"
          style="border-radius: 2px;"
          v-hotKey="{func: 'func_submit', flag: 'isLoading'}"
          @click="handleExecute"
        >执行</el-button>
        <!-- <el-button  type="primary" plain>收费</el-button> -->
        <el-button type="primary" plain  @click="printZld">打印治疗单</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { drugList, executeAdvice, stayAdviceCount } from "@/api/ipnw/nursing";
import { onPreview, onPrint } from "@/utils/print";
import Temperature from "./temperature";
export default {
  name: "costExecute",
  components: {Temperature},
  data() {
    return {
      isLoading: false,
      activeNames: "",
      categoryCode: ["0"], // 状态 已执行、未执行
      currentStay: 0, // 当前患者待执行
      time_type: "1", // 开嘱时间 1 执行时间 2
      dateRange: [], // 时间段
      stayExecuteCount: 0,
      statusArr: {
        0: "未执行",
        1: "执行完成"
      },
      stayExecute: {
        columnAll: [
          {
            prop: "status",
            label: "状态",
            width: 80,
            fixed: false
          },
          {
            prop: "prepayBalance",
            label: "费用状态",
            width: 80,
            fixed: false
          },
          {
            prop: "normalDate",
            label: "常规时间",
            width: 100,
            fixed: false
          },
          {
            prop: "name",
            label: "医嘱名称",
            width: 180,
            fixed: false
          },
          {
            prop: "groupNoCls",
            label: "组",
            width: 60,
            fixed: false
          },
          {
            prop: "frequency",
            label: "频次",
            width: 120,
            fixed: false
          },
          {
            prop: "spec",
            label: "规格",
            width: 100,
            fixed: false
          },
          {
            prop: "basicDosage",
            label: "数量",
            width: 60,
            fixed: false
          },
          {
            prop: "entrust",
            label: "嘱托",
            width: 180,
            fixed: false
          },
          {
            prop: "doctorName",
            label: "开嘱医生",
            width: 80,
            fixed: false
          },
          {
            prop: "deptCode",
            label: "开嘱科室",
            width: 80,
            fixed: false
          },
          {
            prop: "adviceTime",
            label: "开嘱时间",
            width: 150,
            fixed: false
          },
          {
            prop: "executeName",
            label: "执行人",
            width: 120,
            fixed: false
          },
          {
            prop: "executeTime",
            label: "执行时间",
            width: 150,
            fixed: false
          }
        ],
        data: []
      },
      selectedList: []
    };
  },
  computed: {
    ...mapGetters(["receivePatientDatas"])
  },
  created() {
    this.fetchExecuteList(this.receivePatientDatas);
    // this.fetchStayExecuteCount(this.receivePatientDatas);
  },
  methods: {
    categoryCodeChange(val) {
      // 状态 改变
      // if (this.searchForm.categoryCode.length > 1) {
      //   this.searchForm.categoryCode.shift();// 多选改单选功能
      this.receivePatientDatas.time_type = this.time_type;
      this.receivePatientDatas.categoryCode = this.categoryCode;


      console.log(this.receivePatientDatas, "this.receivePatientDatas");
      this.fetchExecuteList(this.receivePatientDatas);
      // }
    },
    checkSelectAdv() {
      // 检测所选医嘱是否符合操作要求 状态 1,10
      let isOk = true;
      this.selectedList.map(item => {
        if (!["1", "10"].includes(item.status)) {
          isOk = false;
        }
      });
      return isOk;
    },
    selectAll(i) {
      // 全选
      // alert(this.stayExecute.data[i].checked)
      if (this.stayExecute.data[i].checked) {
        this.stayExecute.data[i].itemData.map(val => {
          this.$refs.singleTable[i].toggleRowSelection(val, true);
          val._itemChecked = true;
        });
      } else {
        this.$refs.singleTable[i].clearSelection();
        this.stayExecute.data[i].itemData.map(val => {
          val._itemChecked = false;
        });
      }
      this.pushSelectedList();
    },
    isAllSelect() {
      // checked
      // _itemChecked
      let initial = true;
      this.stayExecute.data.forEach(item => {
        item.itemData.forEach(val => {
          if (!val._itemChecked) {
            initial = false;
          }
        });
        item.checked = initial;
        initial = true;
      });
      this.pushSelectedList();
    },
    pushSelectedList() {
      // 将选中项放入list
      let list = [];
      this.stayExecute.data.map(item => {
        if (item.checked) {
          list = [...list, ...item.itemData];
        } else {
          item.itemData.map(val => {
            if (val._itemChecked) {
              list = [...list, val];
            }
          });
        }
      });
      this.selectedList = list;
    },
    selectItem(list, row) {
      // 单个选中 成组
      let isSelect = list.some(val => row.recordId === val.recordId);
      row._itemChecked = isSelect;
      this.stayExecute.data[row._index].itemData.map(item => {
        if (
          row.groupNo === item.groupNo &&
          item.recordId !== row.recordId &&
          row.groupNo
        ) {
          item._itemChecked = isSelect;
          setTimeout(() => {
            this.$refs.singleTable[row._index].toggleRowSelection(item);
          }, 10);
        }
      });
      this.isAllSelect();
    },
    timeRangeChange() {
      this.fetchExecuteList(this.receivePatientDatas);
    },
    async fetchStayExecuteCount(args) {
      // 请求所选患者待执行医嘱数量
      let params = {
        status: 3,
        inpCode: args.map(val => val.inpCode)
      };
      if (params.inpCode.length === 0) {
        return;
      }
      let { code, data, msg } = await stayAdviceCount(params);
      if (code === 1) {
        this.stayExecuteCount = data;
      }
    },
    async fetchExecuteList(args) {
      this.isLoading = true;
      // 请求费用执行列表
      let status = [];
      let params = {};
      var searchForm = {
        searchType: this.time_type
      };
      if (this.dateRange && this.dateRange.length > 1) {
        searchForm['sDate'] = this.dateRange[0] + " 00:00:00"
        searchForm['eDate'] = this.dateRange[1] + " 23:59:59"
      }
      let inpCode = args.map(val => {
        return val.inpCode;
      });
      status = this.categoryCode.map(item => {
        return item.split(",");
      });
      status = status.join(",").split(",");
      status = Array.from(new Set(status));
      if (inpCode.length === 0) {
        this.isLoading = false;
        this.stayExecute.data = [];
        this.selectedList = [];
        return;
      }

      params = {
        ...searchForm,
        status,
        inpCode
      };
      try {
        let { code, data, msg } = await drugList(params);
        if (code === 1) {
          let patientList = []; // 患者分组
          let advData = [];
          patientList = data.map(item => {
            return item.patientId;
          });
          patientList = Array.from(new Set(patientList)); // 去除重复患者id
          advData = patientList.map(item => {
            // 初始化患者信息
            return {
              patientId: item,
              patientName: "",
              patientGender: "",
              ageInfo: "",
              bedNo: "",
              checked: false,
              itemData: []
            };
          });
          advData.forEach((val, index) => {
            data.forEach(item => {
              if (val.patientId === item.patientId) {
                val = {
                  ...val,
                  ...item
                };
                val.itemData.push(item);
                advData[index] = val;
              }
            });
          });
          advData.forEach((item, index) => {
            item.itemData.map(val => {
              Object.assign(val, { _index: index, _itemChecked: false }); // 用于确认所在table
              if (item.checked) {
                this.$refs.singleTable[index].toggleRowSelection(val, true);
              }
            });
          });
          advData.map(async item => {
            item.itemData = await this.grouping(item.itemData);
          });
          this.stayExecute.data = advData;
          this.isLoading = false;
        } else {
          this.$message.error(msg);
          this.isLoading = false;
        }
      } catch (error) {
        this.isLoading = false;
      }
      this.isLoading = false;
    },
    grouping(list1) {
      // table 数据 成组操作
      // 将list 分组
      return new Promise((resolve, reject) => {
        let list = [];
        let groupList = [];
        let filterList = [];
        let tableList = [];
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
          if (itemList.length == 1) return;
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
        resolve(tableList);
      });
    },
    //打印治疗单
    printZld(){
        if(!this.selectedList || this.selectedList.length <=0){
          this.$message.warning("请选择要打印的数据")
          return;
        }
      let dataObject = {} ;
      this.$set(dataObject,'patientName',this.selectedList[0].patientName);
      this.$set(dataObject,'patientGender',this.selectedList[0].patientGender);
      this.$set(dataObject,'inpCode',this.selectedList[0].inpCode);
      this.$set(dataObject,'a',this.selectedList);


      onPreview(dataObject,'治疗单');
    },
    async handleExecute() {
      // 执行方法
      if (this.selectedList.length === 0) {
        this.$message.warning("请选择执行医嘱!");
        return;
      }
      let recordId = this.selectedList.map(item => {
        return item.recordId;
      });
      let { code, msg } = await executeAdvice({
        recordId
      });
      if (code === 1) {
        this.fetchExecuteList(this.receivePatientDatas);
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    }
  },
  watch: {
    receivePatientDatas: {
      //深度监听，可监听到对象、数组的变化
      handler(val) {
        this.fetchExecuteList(val);
        this.fetchStayExecuteCount(val);
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-tabs__nav {
  padding-top: 10px;
  margin-left: 0 !important;
}
/deep/ .el-badge__content {
  line-height: 16px;
}
/deep/ .right th .el-checkbox {
  display: none;
}
.color1 {
  color: $l-color-primary1;
}
.color2 {
  color: $l-color-fontcolor-2;
}
.date-icon {
  top: 10px;
  right: 10px;
  color: $l-color-fontcolor-4;
}
.containers {
  overflow: hidden;
  .aside-hidden-btn {
    position: absolute;
    top: calc(50% - 40px);
    line-height: 80px;
    text-align: center;
    z-index: 1000;
    border: 1px solid $l-color-bgcolor-11;
    border-radius: 2px;
    i {
      transition: transform 0.5s;
    }
  }
  .left {
    float: left;
    height: 100%;
    overflow: hidden;
    /*transition: all 0.3s;*/
  }

  .right {
    padding-top: 10px;
    .btn {
      position: absolute;
      right: 20px;
      bottom: 20px;
    }
  }
}
.normal {
  border-color: $l-color-primary;
  color: $l-color-primary;
  border-radius: 2px;
}
.msg_header {
  line-height: 66px;
  height: 66px;
  background-color: $l-color-bgcolor-14;
  margin-bottom: 10px;
  border-radius: 4px;
  overflow: hidden;

  .person {
    text-align: left;
    min-width: 60px;

    & > span {
      display: inline-block;
      vertical-align: middle;
    }

    .person_num {
      
      font-size: 36px;
      color: $l-color-border-6;
      min-width: 54px;
      text-align: center;
      background-color: #fef6e8;
      display: inline-block;
    }

    .person_number {
      font-size: 18px;
      color: $l-color-fontcolor-2;
      padding: 0 20px;
      display: inline-block;
    }

    .pad20 {
      padding: 0 20px;
    }
  }

  .nav-gap-wrap {
    height: inherit;
  }

  .nav-gap {
    position: relative;
    width: 1px;
    height: inherit;
    padding: 0 20px;

    &:before {
      content: "";
      position: absolute;
      top: calc(50% - 8px);
      width: 1px;
      height: 16px;
      background: #ebebeb;
    }
  }

  .docter {
    /*height: 60px;*/
    /*line-height: 60px;*/
    margin-right: 20px;
    .docter_box {
      height: 100%;
      border-left: 1px solid #c5cbcf;
      padding-left: 20px;
      font-size: 12px;

      .box_item {
        line-height: 20px;
      }
    }
  }
}
.main-box {
  height: calc(100% - 120px);
}
.bunchingUp {
  display: inline-block;
  color: $l-color-primary1;

  &::after {
    content: "┓";
  }
}

.bunchingCenter {
  display: inline-block;
  color: $l-color-primary1;

  &::after {
    content: "┫";
  }
}

.bunchingDown {
  color: $l-color-primary1;
  display: inline-block;

  &::after {
    content: "┛";
  }
}
</style>
