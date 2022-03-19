<template>
  <div class="height100">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="true"
      pageName="advExamine"
      patientCardType="hospital"
      @message="messageHandler"
    >
      <template #list>
        <left-bar type="hos" :Multiple="true"></left-bar>
      </template>
      <template #content>
        <el-card
          class="height100 position-relative"
          style="padding-bottom: 150px;"
          v-loading="isLoading"
        >
          <div class="overflow-hidden padding20 position-absolute btn-top">
            <div class="float-left overflow-hidden" style="width: 50%;">
              <l-formt-title label="退回医嘱" class="reason-box">
                <el-input
                  v-model="reason"
                  placeholder="请输入退回原因"
                ></el-input>
              </l-formt-title>
              <el-button
                type="primary"
                plain
                class="float-right margin-left-10"
                @click="handleRecall"
              >退回
              </el-button
              >
            </div>

            <el-button
              class="float-right margin-left-10"
              v-hotKey="{ func: 'func_submit', flag: 'isLoading' }"
              type="primary"
              @click="handleExamine"
            >审核
            </el-button
            >
          </div>
          <div class="overflow-hidden search-box padding20">
            <div class="float-left">
              <span
                class="label float-left margin-right-10"
                style="margin-left: 0"
              >医嘱类别</span
              >
              <el-checkbox-group
                class="float-left"
                @change="categoryCodeChange"
                v-model="searchForm.categoryCode"
              >
                <el-checkbox label="1">长期</el-checkbox>
                <el-checkbox label="2">临时</el-checkbox>
                <el-checkbox label="3">出院带药</el-checkbox>
              </el-checkbox-group>
            </div>
            <div class="float-left margin-left-10">
              <span class="label float-left margin-right-10">状态</span>
              <el-checkbox-group
                class="float-left"
                @change="statusChange"
                v-model="searchForm.status"
              >
                <el-checkbox label="1">新开</el-checkbox>
                <el-checkbox label="4">停止</el-checkbox>
                <el-checkbox label="13,14,15">已审核</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div
            class="padding20 right height100"
            style="padding-top: 0;overflow-y: auto"
          >
            <el-collapse
              v-model="activeNames"
              @change="handleChange"
              style="border: none;"
            >
              <l-collapse-item
                v-for="(parentItem, $index) in collapseData"
                :name="$index"
                :key="$index"
              >
                <div slot="title" style="font-size: 14px;">
                  <el-checkbox
                    v-model="parentItem.checked"
                    @change="selectAll($index)"
                  ></el-checkbox>
                  <span style="font-size: 20px;">{{ parentItem.bedNo }}</span
                  >床
                  <span class="margin-left-20">{{
                    parentItem.patientName
                  }}</span>
                  <span
                    class="margin-left-20"
                    :val="parentItem.patientGender"
                    code="GENDER_CODE"
                    v-codeTransform
                  >{{ parentItem.patientGender }}</span
                  >
                  <span class="margin-left-20">{{ parentItem.ageInfo }}岁</span>
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
                      @selection-change="tableChange"
                      element-loading-text="加载中..."
                    >
                      <el-table-column
                        type="selection"
                        width="45"
                      ></el-table-column>
                      <el-table-column
                        v-for="item in collapseTableColumn"
                        :key="item.label"
                        :label="item.label"
                        :prop="item.prop"
                        align="center"
                        show-overflow-tooltip
                        header-align="center"
                        :min-width="item.width"
                      >
                        <template slot-scope="scope">
                          <div class="color2" v-if="item.prop === 'No'">
                            {{ scope.row[item.prop] }}
                          </div>
                          <div
                            class="main-color"
                            v-else-if="item.prop === 'status'"
                          >
                            <span v-if="['1'].includes(scope.row[item.prop])"
                            >新开</span
                            >
                            <span v-if="['4'].includes(scope.row[item.prop])"
                            >停止</span
                            >
                            <span v-if="['13'].includes(scope.row[item.prop])"
                            >已审核</span
                            >
                            <span v-if="['14'].includes(scope.row[item.prop])"
                            >已审核</span
                            >
                            <span v-if="['15'].includes(scope.row[item.prop])"
                            >已审核</span
                            >
                            <!-- <span
                               v-if="
                                 ['3', '11', '13', '14'].includes(
                                   scope.row[item.prop]
                                 )
                               "
                               >已审核</span
                             >-->
                          </div>
                          <div v-else-if="item.prop === 'uses'">
                            <div v-if="scope.row.uses"
                              :val="scope.row.uses"
                              code="MedicationRouteCode"
                              v-codeTransform
                            ></div>
                          </div>
                          <div v-else-if="item.prop === 'basicDosage'" class="color2">
                            <!--数量-->
                            <template v-if="scope.row.categoryCode=='3'">
                              {{scope.row.basicDosage}}
                              <span :val="scope.row.unit" code="DrugDoseUnit"  v-codeTransform></span>
                            </template>
                            <template v-else>
                              <template v-if="scope.row.dosageValue">
                              {{scope.row.onceDosage/scope.row.dosageValue}}
                              <span :val="scope.row.unit" code="DrugUnit" v-codeTransform></span>
                              </template>
                            </template>

                          </div>
                          <div v-else-if="item.prop === 'onceDosage'" class="color2">
                            <!--用量-->
                            {{scope.row.onceDosage}}
                            <span :val="scope.row.basicDosageUnit" code="DrugDoseUnit"  v-codeTransform></span>
                            <!--<span :val="scope.row.basicDosageUnit" code="DrugUnit"  v-codeTransform></span>-->

                          </div>

                          <div v-else-if="item.prop === 'groupNoCls'">
                            <span :class="scope.row[item.prop]"></span>
                          </div>
                          <div v-else-if="item.prop === 'adviceType'">
                            <div :val="scope.row.adviceType" code="order_type" v-codeTransform></div>
                          </div>
                          <div v-else-if="item.prop === 'categoryCode'">
                            <div :val="scope.row.categoryCode" code="category_Code" v-codeTransform></div>
                          </div>

                          <!-- <div v-else-if="item.prop === 'frequency'"  :val="scope.row.frequency" code="Frequency" v-codeTransform></div> -->
                          <div v-else-if="item.prop === 'frequency'">
                              <template v-if="scope.row.frequency">
                                <span columns="FREQUENCY_NAME"
                                      :conditionMap="{
                                                              FREQUENCY_CODE: scope.row.frequency
                                                            }"
                                      tableName="hrp_frequency"
                                      v-tableTransform
                                ></span>
                              </template>
                          </div>

                          <div v-else>{{ scope.row[item.prop] }}</div>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </l-collapse-item>
            </el-collapse>
          </div>
        </el-card>
      </template>
    </l-layout>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import {
    queryListAdvice,
    recallAdvice,
    adviceExamine,
    queryListAdviceYzsh
  } from "@/api/ipnw/nursing";
  import LeftBar from "../../components/nursingLeftBar";

  export default {
    name: "advExamine",
    components: {
      LeftBar
    },
    data() {
      return {
        isLoading: false,
        formParams: ["technicalOffices", "search"], // 左侧搜索条件
        toolBoxs: ["HistoricalDiagnosis", "Hotkey"],
        // 患者列表查询条件
        patientsSearchForm: {},
        searchForm: {
          categoryCode: ["1"], // 医嘱类别
          status: ["1", "4", "13,14,15"] // 状态
        },
        activeNames: "",
        reason: "", // 退回原因
        selectedList: [], // 已选中列表
        collapseData: [],
        collapseTableColumn: [
          {
            prop: "status",
            label: "状态",
            width: "80"
          },
          {
            prop: "categoryCode",
            label: "医嘱类别",
            width: "80"
          },  {
            prop: "adviceType",
            label: "医嘱类型",
            width: "80"
          },
          {
            prop: "adviceTime",
            label: "开始时间",
            width: "150"
          },
          {
            prop: "endTime",
            label: "停止时间",
            width: "150"
          },
          {
            prop: "name",
            label: "名称",
            width: "150"
          },
          {
            prop: "groupNoCls",
            label: "组",
            width: "50"
          },
          {
            prop: "spec",
            label: "规格",
            width: "150"
          },
          {
            prop: "onceDosage",
            label: "用量",
            width: "120"
          },
          {
            prop: "uses",
            label: "用法",
            width: "120"
          },
          {
            prop: "frequency",
            label: "频次",
            width: "80"
          },
          {
            prop: "basicDosage",
            label: "数量",
            width: "80"
          },
          {
            prop: "entrust",
            label: "嘱托",
            width: 150
          },
          {
            prop: "normalDate",
            label: "常规时间",
            width: "120"
          },
          {
            prop: "doctorName",
            label: "开嘱人",
            width: "80"
          },
          {
            prop: "deptName",
            label: "开嘱科室",
            width: "80"
          }

          /*,
          {
            prop: "prePayTime",
            label: "上次收费时间",
            width: "120"
          }*/
        ]
      };
    },
    computed: {
      ...mapGetters(["receivePatientDatas"])
    },
    created() {
      // this.fetchAdvList()
      this.fetchAdvList(this.receivePatientDatas);
    },
    methods: {
      messageHandler() {
        // 工具箱回调方法
      },
      handleClick() {
        // tab 的切换方法
      },
      search(form) {
        // 查询方法
        this.patientsSearchForm = form;
        this.$refs.patients.getPatientList(form);
      },
      readCard() {
        // 读卡方法
      },
      categoryCodeChange(val) {
        this.fetchAdvList(this.receivePatientDatas);

      },
      statusChange(val) {

        this.fetchAdvList(this.receivePatientDatas);
      },
      async handleRecall() {
        // 退回
        if (!this.checkSelectAdv()) {
          this.$message.warning("请选择可操作医嘱！");
          return;
        }
        if (this.selectedList.length === 0) {
          this.$message.warning("请选择一条医嘱!");
          return;
        }
        if (this.reason === "") {
          this.$message.warning("请输入退回原因");
          return;
        }
        try {
          let adviceId = [];
          adviceId = this.selectedList.map(item => {
            return item.adviceId;
          });
          let postBody = {
            adviceId,
            rejectReason: this.reason
          };
          let {code, data, msg} = await recallAdvice(postBody);
          if (code === 1) {
            this.$message.success(msg);
            this.fetchAdvList(this.receivePatientDatas);
            this.selectedList = [];
            this.reason = '';
          } else {
            this.$message.error(msg);
          }
        } catch (e) {
          this.$message.error(msg);
        }
      },
      checkSelectAdv() {
        // 检测所选医嘱是否符合操作要求 状态 1:提交,13：未执行
        let isOk = true;
        this.selectedList.map(item => {
          // if (!["1", "13"].includes(item.status)) {
          if (!["1"].includes(item.status)) {
            isOk = false;
          }
        });
        return isOk;
      },
      async handleExamine() {
        // 审核
        if (!this.checkSelectAdv()) {
          this.$message.warning("请选择可操作医嘱！");
          return;
        }
        if (this.selectedList.length === 0) {
          this.$message.warning("请选择一条医嘱!");
          return;
        }
        this.isLoading = true;
        try {
          let adviceId = [];
          adviceId = this.selectedList.map(item => {
            return item.adviceId;
          });
          let postBody = {
            adviceId,
            rejectReason: ""
          };
          let {code, data, msg} = await adviceExamine(postBody);
          if (code === 1) {
            this.isLoading = false;
            this.$message.success('医嘱审核成功');
            this.fetchAdvList(this.receivePatientDatas); // 再次请求列表
            this.selectedList = []; // 清空所选
            // this.$confirm(
            //   `<div><p>审核完成</p><p style="color: #949DA3">${msg}</p></div>`,
            //   "",
            //   {
            //     cancelButtonText: "取消",
            //     confirmButtonText: "申领",
            //     showClose: false,
            //     type: "warning",
            //     dangerouslyUseHTMLString: true
            //   }
            // )
            //   .then(() => {
            //     // 申领
            //   })
            //   .catch(() => {
            //     // 取消
            //   });
          } else {
            this.isLoading = false;
            this.$message.error(msg);
          }
        } catch (e) {
          this.isLoading = false;
        }
      },
      selectAll(i) {
        // 全选
        // alert(this.collapseData[i].checked)
        if (this.collapseData[i].checked) {
          this.collapseData[i].itemData.map(val => {
            this.$refs.singleTable[i].toggleRowSelection(val, true);
            val._itemChecked = true;
          });
        } else {
          this.$refs.singleTable[i].clearSelection();
          this.collapseData[i].itemData.map(val => {
            val._itemChecked = false;
          });
        }
        this.pushSelectedList();
      },
      selectItem(list, row) {
        // 单个选中 成组
        let isSelect = list.some(val => row.adviceId === val.adviceId);
        row._itemChecked = isSelect;
        this.collapseData[row._index].itemData.map(item => {
          if (
            row.groupNo === item.groupNo &&
            item.adviceId !== row.adviceId &&
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
      handleChange() {
      },
      tableChange(list) {
        // 当table项发生变化
      },
      isAllSelect() {
        // checked
        // _itemChecked
        let initial = true;
        this.collapseData.forEach(item => {
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
      grouping(list1) {
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
      pushSelectedList() {
        // 将选中项放入list
        let list = [];
        this.collapseData.map(item => {
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
      async fetchAdvList(list) {
        if (list.length === 0) {
          return;
        }
        // 请求医嘱列表
        let inpNolist = list.map(item => {
          return item.inpCode;
        });
        let status = this.searchForm.status.map(item => {
          return item.split(",");
        });
        status = status.join(",").split(",");
        try {
          this.isLoading = true;
          let {data} = await queryListAdviceYzsh({
            categoryCode: this.searchForm.categoryCode.join(","),
            inpNo: inpNolist.join(","),
            status: status.join(",")
          });
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
              Object.assign(val, {_index: index, _itemChecked: false}); // 用于确认所在table
              if (item.checked) {
                this.$refs.singleTable[index].toggleRowSelection(val, true);
              }
            });
          });
          advData.map(async item => {
            item.itemData = await this.grouping(item.itemData);
          });
          this.collapseData = advData;
          this.isLoading = false;
        } catch (e) {
          this.isLoading = false;
        }
      }
    },
    watch: {
      receivePatientDatas: {
        //深度监听，可监听到对象、数组的变化
        handler(val) {
          this.fetchAdvList(val);
        },
        deep: true
      }
    }
  };
</script>

<style lang="scss" scoped>
  /deep/ .right th .el-checkbox {
    display: none;
  }

  /deep/ .search-box {
    .el-checkbox {
      margin-right: 10px;
    }

    .el-checkbox__label {
      padding-left: 6px;
    }
  }

  .btn-top {
    bottom: 0;
    width: 100%;
    height: 80px;
    left: 0;
    border-top: 1px solid $l-color-bgcolor-11;

    .el-button {
      border-radius: 2px;
    }

    .normal {
      color: $l-color-primary;
      border-color: $l-color-primary;
    }
  }

  .search-box {
    .label {
      position: relative;
      top: 2px;
      margin-left: 20px;
      margin-right: 20px;
      color: $l-color-fontcolor-4;
    }
  }

  .main-color {
    color: $l-color-primary1;
  }

  .color2 {
    color: $l-color-fontcolor-2;
  }

  .reason-box {
    width: calc(100% - 90px);
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
