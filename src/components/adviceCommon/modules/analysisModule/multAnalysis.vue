<template>
  <div class="page">
    <el-table
      :key="tableKey"
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      border
      max-height="100%"
      height="100%"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      :cell-class-name="cellStyle"
      :row-class-name="tableRowClassName"
    >
      <el-table-column
        :selectable="checkSelectable"
        type="selection"
        width="55"
      >
      </el-table-column>
      <el-table-column
        v-for="item in tableColumn"
        :key="item.prop"
        :type="item.type"
        :prop="item.prop"
        :label="item.label"
        :min-width="item.width"
        header-align="center"
        :align="item.align || 'center'"
        :fixed="item.fixed"
        :showOverflowTooltip="item.showToolTip"
      >
        <!-- :show-overflow-tooltip="item.showToolTip" -->
        <template slot-scope="scope">
          <!-- 校验结果 -->
          <template v-if="item.prop === 'valid_analysisResult'">
            <div
              v-for="(sItem, index) in scope.row.valid_tipInfo"
              :key="index"
              :class="tableLineCls(scope.row.valid_tipInfo)"
            >
              <div class="innerCellCls">
                <i
                  v-if="sItem.valid_analysisResult == 'success'"
                  class="el-icon-success verticalMiddle"
                  style="color: #70B603;font-size: 24px"
                ></i>
                <i
                  v-else-if="sItem.valid_analysisResult == 'error'"
                  class="el-icon-error verticalMiddle"
                  style="color: red;font-size: 24px"
                ></i>
                <i
                  v-else
                  class="el-icon-remove verticalMiddle"
                  style="color: yellow; font-size: 24px"
                ></i>
              </div>
            </div>
          </template>
          <!-- 提示信息 -->
          <template v-else-if="item.prop === 'valid_tipInfo'">
            <div
              v-for="(sItem, index) in scope.row.valid_tipInfo"
              :key="index"
              :class="tableLineCls(scope.row.valid_tipInfo)"
            >
              <div
                class="innerCellCls ellipsisCls"
                :title="sItem.valid_showText"
                v-if="sItem.valid_tipType == 'confirm'"
              >

                <span>【请确认】</span>
                <span>
                  {{ sItem.valid_showText }}
                </span>

              </div>
              <div
                class="innerCellCls ellipsisCls"
                :title="sItem.valid_showText"
                v-else-if="sItem.valid_tipType == 'error'"
              >
                <span>【错误信息】</span>
                <span>
                  {{ sItem.valid_showText }}
                </span>
              </div>
              <div
                class="innerCellCls ellipsisCls"
                :title="sItem.valid_showText"
                v-else-if="sItem.valid_tipType == 'tip'"
              >
                <span>【温馨提示】</span>
                <span>
                  {{ sItem.valid_showText }}
                </span>
              </div>
              <div
                class="innerCellCls ellipsisCls"
                v-else
                :title="sItem.valid_showText"
              >
                <span>
                  {{ sItem.valid_showText }}
                </span>
              </div>

            </div>
          </template>
          <!-- 操作 -->
          <template v-else-if="item.prop === 'action'">
            <div
              v-for="(sItem, index) in scope.row.valid_tipInfo"
              :key="index"
              :class="tableLineCls(scope.row.valid_tipInfo)"
            >
              <div
                class="innerCellCls"
                v-if="sItem.valid_actionType == 'yiBao'"
              >
                <el-radio-group
                  v-model="sItem.valid_btnSelected"
                  @change="
                        (value, b) => {
                          yiBaoBtnChange(value, sItem, scope.row);
                        }
                      "
                >
                  <el-radio-button label="1">是（医保使用）</el-radio-button>
                  <el-radio-button label="0">否（自费使用）</el-radio-button>
                </el-radio-group>
              </div>
              <div
                class="innerCellCls"
                v-else-if="item.valid_actionType == 'normal'"
              >
                <el-radio-group
                  v-model="sItem.valid_btnSelected"
                  @change="
                        (value, b) => {
                          btnChange(value, sItem, scope.row);
                        }
                      "
                >
                  <el-radio-button label="1">是</el-radio-button>
                  <el-radio-button label="0">否</el-radio-button>
                </el-radio-group>
              </div>
              <div
                class="innerCellCls"
                v-else
              >

              </div>
            </div>
          </template>
          <template v-else>
            {{ scope.row[item.prop] }}
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { deepClone, Throttle } from "@/utils/index.js";

export default {
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    mType: {
      // 治疗医嘱  treatMedicine
      type: String,
      default() {
        return "common";
      }
    }
  },
  created() {
    // 治疗医嘱 不显示规格
    if (this.mType == "treatMedicine") {
      this.tableColumn = [
        {
          prop: "orderItemName",
          label: "医嘱名称",
          align: "left",
          showToolTip: true
        },
        // {
        //   prop: "spec",
        //   label: "规格",
        //   width: 50,
        //   showToolTip: true
        // },
        {
          prop: "valid_analysisResult",
          label: "校验结果",
          width: 20,
          showToolTip: false
        },
        {
          prop: "valid_tipInfo",
          label: "提示信息",
          showToolTip: true
        },
        {
          prop: "action",
          label: "操作",
          showToolTip: false,
          width: 110
        }
      ];
    }
  },
  data() {
    return {
      tableKey: 1,
      tableData: [],
      tableColumn: [
        {
          prop: "orderItemName",
          label: "医嘱名称",
          align: "left",
          showToolTip: true
        },
        {
          prop: "spec",
          label: "规格",
          width: 50,
          showToolTip: true
        },
        {
          prop: "valid_analysisResult",
          label: "校验结果",
          width: 20,
          showToolTip: false
        },
        {
          prop: "valid_tipInfo",
          label: "提示信息",
          showToolTip: true
        },
        {
          prop: "action",
          label: "操作",
          showToolTip: false,
          width: 110
        }
      ],

      multipleSelection: []
    };
  },
  watch: {
    data: {
      immediate: true,
      deep: true,
      handler(val) {
        this.refreshTable();
        this.tableData = this.tipInfoHandler(deepClone(val));
        this.$nextTick(() => {
          this.toggleRowSelection();
        });
      }
    }
  },
  methods: {
    // 没次需要重新渲染表格布局的时候调这个方法就行了  修正表格宽度
    refreshTable () {
      this.tableKey ++;
      console.log("this.tableKey::::", this.tableKey);
      // this.$nextTick(() => {
      //   this.tableKey = true
      // })
    },    
    // 提交检验方法
    validateSubmit() {
      return new Promise((resolve, reject) => {
        let selectList = this.getMultipleSelection();
        let isError = selectList.some(item => {
          let innerVal = item.valid_tipInfo.some(
            sItem =>
              sItem.valid_actionType == "yiBao" &&
              sItem.valid_btnSelected === "noSelect"
          );
          return innerVal;
        });
        console.log("开始校验！！！", isError);
        // debugger;
        if (isError) {
          this.$message.error("请确认信息");
          reject(false);
        } else {
          resolve(true);
        }
      });
    },

    // 整理数据 格式 如下
    //       {
    //         valid_analysisResult: "success",  //校验结果栏目 x 对勾，有error 信息，就是X
    //         valid_tipType: "error", // tip  【温馨提示】   error  【错误信息】 confirm  【请确认】
    //         valid_showText: "啊的啊手动阀锁定发",
    //         valid_btnSelected: "",
    //         valid_actionType: "normal"
    //       },
    yiBaoBtnChange(a, item, row) {
      // 医保 用户选了 就是 对勾
      if (a == "1" || a == "0") {
        item.valid_analysisResult = "success";
        // 医生审核 limitResultCode 字段
        let confirmCode = a == "1" ? "1" : "0";
        this.$set(row, "limitResultCode", confirmCode);
      } else if (a == "noSelect") {
        item.valid_analysisResult = "noSelectWarning";
        this.$set(row, "limitResultCode", null);
      } else {
        item.valid_analysisResult = "error";
      }

      this.$set(row, "limitResultCode", a);
      console.log(row);
    },
    tipInfoHandler(list = []) {
      let nTableData = [];
      for (let index = 0; index < list.length; index++) {
        let element = list[index];

        this.$set(element, "valid_tipInfo", []);
        // 请确认信息
        if (element.limitMsg) {
          element.limitMsg.forEach(cItem => {
            element.valid_tipInfo.push({
              valid_analysisResult: "noSelectWarning", // error 错误  noSelectWarning 警告(用在没有选择的时候，图标的显示)  success 成功
              valid_tipType: "confirm", // tip  【温馨提示】   error  【错误信息】 confirm  【请确认】 pass 不写
              valid_showText: cItem, // 显示的信息
              valid_btnSelected: "noSelect", // 初始都为 0 (否) ，用户操作后 处理 0 1(是) 问题   noSelect 没有选择
              valid_actionType: "yiBao" // normal 没选-  选否×，选是对勾    yiBao （选择了就是 success）  noBtn  没有操作
            });
          });
        }

        if (element.error) {
          element.error.forEach(eItem => {
            element.valid_tipInfo.push({
              valid_analysisResult: "error",
              valid_tipType: "error",
              valid_showText: eItem,
              valid_btnSelected: "noBtn", // 初始都为 0 ，用户操作后 处理 0 1 问题
              valid_actionType: "noBtn" // 没有操作
            });
          });
        }

        if (element.warning) {
          element.warning.forEach(wItem => {
            element.valid_tipInfo.push({
              valid_analysisResult: "success",
              valid_tipType: "tip",
              valid_showText: wItem,
              valid_btnSelected: "noBtn", // 初始都为 0 ，用户操作后 处理 0 1 问题
              valid_actionType: "noBtn" // 没有操作
            });
          });
        }

        if (!element.warning && !element.error && !element.limitMsg) {
          element.valid_tipInfo.push({
            valid_analysisResult: "success",
            valid_tipType: "pass",
            valid_showText: "",
            valid_btnSelected: "noBtn", // 初始都为 0 ，用户操作后 处理 0 1 问题
            valid_actionType: "noBtn" // 没有操作
          });
        }
        nTableData.push(element);
      }
      console.log("nTableData:::::::::::::", nTableData);
      return nTableData;
    },
    tableRowClassName({ row }) {
      // let { error } = row;
      if (row.error && row.error.length > 0) {
        return "disabledRow";
      }
      return "";
    },
    checkSelectable(row) {
      if (row.error && row.error.length > 0) {
        return 0; //禁用
      }
      return 1; // 启用
    },
    toggleRowSelection() {
      let data = this.tableData;
      for (let i = 0; i < data.length; i++) {
        let row = data[i];
        if (typeof row.error === "undefined") {
          this.$refs.multipleTable.toggleRowSelection(row, true);
        }
      }
    },
    btnChange(a, item, row) {
      // 没选-  选否×，选是对勾
      if (a == "0") {
        item.valid_analysisResult = "error";
      } else if (a == "1") {
        item.valid_analysisResult = "success";
      } else {
        item.valid_analysisResult = "noSelectWarning";
      }
    },
    cellStyle(rowWrap, a, b, c) {
      let { column, row } = rowWrap;
      let { align, property } = column;
      let alignCss = "";
      if (
        property === "valid_analysisResult" ||
        property === "valid_tipInfo" ||
        property === "action"
      ) {
        alignCss += " nonePaddingCell"; // 免费处方 处方名称 字体变蓝
      }
      return alignCss;
    },
    tableLineCls(valid_tipInfo = []) {
      return {
        noBottomBorder: valid_tipInfo.length <= 1,
        tableLineCls: true
      };
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 获取用户选中
    getMultipleSelection() {
      return this.multipleSelection;
    }
  }
};
</script>
<style scoped lang="scss">
.verticalMiddle {
  vertical-align: middle;
}

.tableLineCls {
  height: 100%;
}

.tableLineCls .innerCellCls {
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #e4e4e4;
}

.noBottomBorder .innerCellCls {
  border-bottom: none !important;
}

/deep/.nonePaddingCell > div.cell {
  padding: 0px !important;
  height: 100%;
}

.page {
  min-height: 400px;
  max-height: 60vh;
  overflow: auto;
}

.ellipsisCls {
  overflow: hidden; //超出的文本隐藏
  text-overflow: ellipsis; //溢出用省略号显示
  white-space: nowrap; //溢出不换行
}
</style>
