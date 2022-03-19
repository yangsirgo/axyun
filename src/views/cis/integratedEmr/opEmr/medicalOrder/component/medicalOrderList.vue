<template>
  <div style="width: 100%; height: 100%;">
    <el-card style="width: 100%; height: 100%;" id="card">
      <el-table
        :span-method="objectSpanMethod"
        ref="multipleTable"
        stripe
        border
        v-loading="listLoading"
        :data="tableData"
        tooltip-effect="dark"
        :height="tableHeight"
        header-cell-class-name="headerCls"
        :row-class-name="rowStyleCls"
        :cell-style="cellStyle"
        style="width: 100%;"
      >
        <el-table-column
          :key="index"
          v-for="(item, index) in tableColumn"
          :min-width="item.width"
          :fixed="item.fixed"
          :prop="item.keyName"
          :header-align="item.align"
          :align="item.align"
          :label="item.name"
        >
          <template slot-scope="scope">
            <template v-if="item.type === 'selectTable'">
              <!--度麻醉标识-->
              <span class="druggieType" v-if="scope.row.manageType == 'D'"
                >毒</span
              >
              <span
                class="druggieType orange"
                v-if="scope.row.manageType == 'M'"
                >麻</span
              >
              <span
                class="druggieType blue"
                v-if="scope.row.manageType == 1 || scope.row.manageType == 2"
                >精</span
              >
              <span class="cell-text">{{ scope.row[item.keyName] }}</span>
            </template>
            <template v-else-if="item.type === 'bunching'">
              <span :class="scope.row.groupNoCls"></span>
            </template>
            <template
              v-else-if="item.keyName == 'price' || item.keyName == 'amt'"
            >
              <span>{{ scope.row[item.keyName] | rounding }}</span>
            </template>
            <template v-else-if="item.keyName == 'useWay'">
              <span
                :val="scope.row[item.keyName]"
                code="MedicationRouteCode"
                v-codeTransform
              ></span>
            </template>
            <template v-else-if="item.keyName == 'dosageUnit'">
              <span
                :val="scope.row[item.keyName]"
                code="DrugDoseUnit"
                v-codeTransform
              ></span>
            </template>
            <template v-else-if="item.keyName == 'unitKey'">
              <span
                :val="scope.row[item.keyName]"
                code="DrugUnit"
                v-codeTransform
              ></span>
            </template>
            <template v-else-if="item.keyName == 'useWay'">
              <span
                :val="scope.row[item.keyName]"
                code="MedicationRouteCode"
                v-codeTransform
              ></span>
            </template>
            <template v-else-if="item.keyName == 'frequencyCode'">
              <span
                columns="FREQUENCY_NAME"
                :conditionMap="{ FREQUENCY_CODE: scope.row[item.keyName] }"
                tableName="hrp_frequency"
                v-tableTransform
              ></span>
            </template>
            <template v-else-if="item.keyName == 'qty'">
              <span class="over" v-if="scope.row.excessReason">
                {{ scope.row[item.keyName] }}
                <el-popover
                  trigger="click"
                  placement="left-start"
                  popper-class="popper-class"
                >
                  <div class="hoverContent">
                    <p>
                      <span class="title">超量原因</span>
                      <span class="content">{{
                        scope.row["excessReason"]
                      }}</span>
                    </p>
                    <p>
                      <span class="title">提交时间</span>
                      <span class="content">{{
                        scope.row["diagnosisTime"]
                      }}</span>
                    </p>
                    <p>
                      <span class="title">提交人</span>
                      <span class="content">{{ scope.row["doctorName"] }}</span>
                    </p>
                  </div>
                  <i slot="reference" class="el-icon-warning-outline icon"></i>
                </el-popover>
              </span>
              <span v-else>{{ scope.row[item.keyName] }}</span>
            </template>
            <template v-else-if="item.keyName == 'skinTest'">
              <span v-if="scope.row.skinTest == '0'">否</span>
              <span v-if="scope.row.skinTest == '1'">是</span>
            </template>
            <template v-else-if="item.keyName == 'orderCat'">
              <span
                :val="scope.row[item.keyName]"
                code="order_type"
                v-codeTransform
              ></span>
            </template>
            <template v-else-if="item.keyName == 'orderStatus'">
              <template v-if="scope.row[item.keyName] === '4'">
                <span>已收费</span>
              </template>
              <template v-else-if="scope.row[item.keyName] != '4'">
                <span
                  :val="scope.row[item.keyName]"
                  code="MedicalStatus"
                  v-codeTransform
                ></span>
              </template>
            </template>
            <template v-else>
              <span v-if="item.type !== 'selectTable'">{{
                scope.row[item.keyName]
              }}</span>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        ref="pagination"
        v-if="total > pageSize"
        :total="total"
        :page.sync="currentPage"
        :limit.sync="pageSize"
        @pagination="getList"
      />
    </el-card>
  </div>
</template>

<script>
  import {
    getOrder,
    getPageItemList,
    submitOrders,
    bunching,
    unbunching,
    batchRemoveOrders,
    saveOrdersMould,
    getAdviceItem,
    getRecipeCode
  } from "@/api/cis/order/order";
  import { getDiaByClinicType } from "@/api/cis/visit/visit";
  import { updateStatus } from "@/utils/updateRecipeStatus.js";

    export default {
        name: "medicalOrderList",
        data(){
          return {
            listLoading: false,
            // 分页数据
            currentPage: 1,
            pageSize: 10,
            total: 1,
            tableData: [],
            groupNoList: [],
            tableHeight: 100,
            tableColumn: [
              // table 配置表头
              {
                keyName: "recipeCode", //处方
                name: this.$t("cis.rpTableTitle.recipeCode"),
                fixed: true,
                width: 140,
                align: "center"
              },
              {
                keyName: "orderStatus",
                name: this.$t("cis.rpTableTitle.orderStatus"),
                value: 0,
                fixed: true,
                width: 70
              },
              {
                keyName: "orderItemName",
                name: this.$t("cis.rpTableTitle.orderItemName"),
                fixed: true,
                align: "center",
                width: 220,
                type: "selectTable"
              },
              {
                keyName: "orderCat",
                name: this.$t("cis.rpTableTitle.orderCat"),
                align: "center"
              },
              {
                keyName: "bunching",
                name: this.$t("cis.rpTableTitle.bunching"),
                align: "center",
                width: 40,
                type: "bunching"
              },
              {
                keyName: "spec",
                name: this.$t("cis.rpTableTitle.spec"),
                align: "center",
                width: 100
              },
              {
                keyName: "onceDosage",
                name: this.$t("cis.rpTableTitle.onceDosage"),
                align: "center",
                width: 120
              },
              {
                keyName: "dosageUnit",
                name: this.$t("cis.rpTableTitle.dosageUnit"),
                align: "center",
                width: 60
              },
              {
                keyName: "useWay",
                name: this.$t("cis.rpTableTitle.useWay"),
                align: "center",
                width: 100
              },
              {
                keyName: "frequencyCode",
                name: this.$t("cis.rpTableTitle.frequencyCode"),
                align: "center",
                width: 100
              },
              {
                keyName: "qty",
                name: this.$t("cis.rpTableTitle.quantity"),
                align: "center",
                width: 60
              },
              {
                keyName: "unitKey",
                name: this.$t("cis.rpTableTitle.unit"),
                align: "center",
                width: 60
              },
              {
                keyName: "useDay",
                name: this.$t("cis.rpTableTitle.day"),
                align: "center",
                value: 0,
                width: 40
              },

              {
                keyName: "price",
                name: this.$t("cis.rpTableTitle.price"),
                align: "center",
                value: 0,
                width: 80
              },
              {
                keyName: "amt",
                name: this.$t("cis.rpTableTitle.amt"),
                align: "center",
                value: 0,
                width: 100
              },
              {
                keyName: "skinTest",
                name: this.$t("cis.rpTableTitle.skinTest"),
                align: "center",
                width: 60,
                type: "checkbox"
              },
              {
                keyName: "remark",
                name: this.$t("cis.rpTableTitle.remarks"),
                align: "center",
                // width: 120,
                // type: 'input'
              }
            ],
            RpRowArr: [],
            rpPosition: 0,
            isMask : false,// 查看遮罩
          }
        },
        mounted(){
          setTimeout(()=>{
            this.tableHeight = document.getElementById("card").offsetHeight - 50
          })
          this.getList(true);
          this.setBunchingCls();
        },
        watch: {
          patientItem: {
            handler(n) {
              this.tableData = [];
              this.getList(false);
              this.isMask = n.recordStatus === "5";
            },
            deep: true //深度监听
          },

        },
        computed: {
          patientItem() {
            return this.$store.state.base.receivePatientData;
          }
        },
        filters: {
          rounding (value) {
            value = value !== "" ? new Number(value) : 0;
            return value.toFixed(4)
          }
        },
        methods: {
          async getList(flag) {
            // console.info("this.$store.state.cis",this.$store.state.cis.RpTableData);
            let visitCode = typeof this.$store.state.base.receivePatientData["visitCode"] !== 'undefined' ? this.$store.state.base.receivePatientData["visitCode"] : "all";//获取患者就诊ID
            let data = {...{pageNo: this.currentPage, pageSize: this.pageSize, visitCode: visitCode}}

            getOrder(data, flag).then(res => {
              if (res.code === 1) {
                let {data} = res;
                let tableData = [];
                for (let i = 0; i < data.length; i++) {
                  const item = data[i];
                  // 数量单位转换
                  let qty = item.quantity % item.packQuantity !== 0 ? item.quantity : item.quantity / item.packQuantity;
                  let unitKey = item.quantity % item.packQuantity !== 0 ? item.unit : item.packUnit;
                  tableData.push({
                    visitCode: item.visitCode || "",
                    orderItemId: item.orderItemId || "",
                    category: item.category || "",
                    orgId: item.orgId,
                    hosId: item.hosId,
                    doctorId: item.doctorId,
                    doctorName: item.doctorName,
                    patientId: item.patientId,
                    patientName: item.patientName,
                    ouptDeptId: item.ouptDeptId,
                    ouptDeptName: item.ouptDeptName,
                    ouptDeptCode: item.ouptDeptCode,
                    recipeCode: item.recipeCode || "",
                    recipeId: item.recipeId || "",
                    orderCat: item.orderCat || "",
                    spec: item.spec || "",
                    price: item.price || "",
                    dosage: item.dosage || "",
                    dosageUnit: item.dosageUnit || "",
                    onceDosage: item.onceDosage || "",
                    useWay: item.useWay || "",
                    frequencyCode: item.frequencyCode || "",
                    frequencyTimes: item.frequencyTimes || "",
                    frequencyUnit: item.frequencyUnit || "",
                    quantity: item.quantity || "",
                    unit: item.unit || "",
                    packUnit: item.packUnit || "",
                    qty: qty || "",
                    packQuantity: item.packQuantity || "",
                    unitKey: unitKey || "",
                    skinTest: item.skinTest || "",
                    amt: item.amt || "",
                    day: item.day || "",
                    remark: item.remark || "",
                    orderItemName: item.orderItemName || "",
                    id: item.id,
                    manageType: item.manageType,
                    formCode: item.formCode,
                    dropRate: item.dropRate || "",
                    administrationTimeCode: item.administrationTimeCode || "",
                    stClassCode: item.a || "",
                    excessReason: item.excessReason || "",
                    diagnosisTime: item.diagnosisTime,
                    isMajor: item.isMajor,
                    groupNo: item.groupNo,
                    groupNoCls: '',//成组样式
                    execDeptId: item.receiveDept,
                    execDeptName: item.receiveDeptName,
                    orderStatus: item.orderStatus || "",
                    chargeStatus: item.chargeStatus || "",
                    dataVersion: item.dataVersion || 0,
                    rDataVersion: item.rDataVersion || 0
                  });
                }
                // 初始化处方状态
                // updateStatus(data, this);
                this.$root.eventHub.$emit("top-list-change");
                this.tableData = tableData;
                // np console.info("this.tableData",this.tableData);
                this.setBunchingCls();
                this.setDataAddType();//给数据增加type 属性
                this.getRpRowArr();//处方项相同的合并处理
                this.currentPage = res.pageNo;
                this.pageSize = res.pageSize;
                this.total = res.total;
              } else {
                this.$message.error(res.msg ? res.msg : "获取数据失败");
              }
            });
          },
          setBunchingCls() {
            var list = [];
            var filterList = [];
            let groupList = this.tableData.map((item) => {
              return item.groupNo;
            });
            groupList = unique(groupList);//数组去重
            groupList = groupList.filter((item, index) => {// 数组去undefind
              return item !== undefined;
            });

            function unique(arr) {
              return Array.from(new Set(arr))
            }

            groupList.forEach((item, index) => {//遍历 成map结构
              // list = [];
              filterList = this.tableData.filter((sonItem, sonIde) => {
                return item === sonItem.groupNo;
              });
              list.push({
                key: item,
                value: filterList
              })
            });
            this.groupNoList = list;
            list.forEach((item) => {
              let itemList = item.value;
              itemList.forEach((sonItem, sonIndex) => {
                if (sonIndex === 0) {
                  sonItem.groupNoCls = 'bunchingUp';
                } else if (sonIndex === itemList.length - 1) {
                  sonItem.groupNoCls = 'bunchingDown';
                } else {
                  sonItem.groupNoCls = 'bunchingCenter';
                }
              })
            });
          },
          setDataAddType() {
            let me = this;
            this.tableData.forEach((item) => {
              // item.type = '';
              me.$set(item, 'type', "")
            });
          },
          getRpRowArr() {
            let tableData = this.tableData;
            this.rpPosition = 0;
            this.RpRowArr = [];
            tableData.forEach((item, index) => {
              item.index = index;
              if (index === 0) {
                this.RpRowArr.push(1);
              } else {
                if (item['recipeCode'] === tableData[index - 1]['recipeCode']) {
                  this.RpRowArr[this.rpPosition] += 1;
                  this.RpRowArr.push(0);
                } else {
                  this.RpRowArr.push(1);
                  this.rpPosition = index;
                }
              }
            });
          },
          //处方合并
          objectSpanMethod({row, column, rowIndex, columnIndex}) {
            if (columnIndex === 1) {
              const _row = this.RpRowArr[rowIndex];
              const _col = _row > 0 ? 1 : 0;
              return {
                rowspan: _row,
                colspan: _col
              }
            }
          },
          //处理成组样式
          cellStyle(row, column, rowIndex, columnIndex) {
            // console.log('row',row.column.property);
            if (row.column.property === "itemName") {
              return {
                // backgroundColor:"red"
              }
            }
          },
          //处理 row 的样式
          rowStyleCls(a) {
            let row = a.row;
            return {
              'rowStyleCls': true,
              'rowSelected': row.type === 'current'
            }
          }
        }
    }
</script>

<style lang="scss" scoped>
.headerCls {
  height: 30px;
  background: rgba(246, 246, 246, 1);
  font-size: 14px;

  font-weight: 400;
  color: rgba(46, 50, 58, 1);
  padding: 0;
}

.rowStyleCls {
  height: 44px;
  font-size: 14px;

  font-weight: 400;
  color: rgba(46, 50, 58, 1);

  > td {
    padding: 0;
  }
}

.rowSelected > td {
  background: rgba(253, 238, 233, 1) !important;
}

.druggieType {
  width: 18px;
  line-height: 18px;
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  border: 1px solid rgba(228, 228, 228, 1);
  font-size: 12px;

  font-weight: 400;
  color: rgba(225, 20, 10, 1);
  display: inline-block;
  text-align: center;
  position: absolute;
  top: -7px;
}

.orange {
  color: rgba(219, 140, 4, 1);
}

.blue {
  color: rgba(19, 71, 150, 1);
}

.cell-text {
  padding-left: 22px;
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

.bunchingSingle {
  color: $l-color-primary;
  display: inline-block;

  &::after {
    content: "】";
  }
}
// 超量提醒  el-pover 样式修正
.popper-class {
  padding: 0;
  border-radius: 2px;
  //border: 1px solid $l-color-primary;

  .hoverContent {
    display: table;
    padding: 10px;

    p {
      line-height: 20px;

      .title {
        font-size: 14px;

        font-weight: 400;
        padding: 0 10px 0 5px;
        width: 74px;
        display: inline-block;
        color: rgba(148, 157, 163, 1);
      }

      .content {
        font-size: 14px;

        font-weight: 400;
        color: rgba(46, 50, 58, 1);
      }
    }
  }
}
</style>
