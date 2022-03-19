<template>
  <div :class="tdCls">
    {{ tdObjectClone.itemName }}
    {{ tdObjectClone.quantity }}
    <div class="tdClsStylel">
      <el-row :gutter="3">
        <el-form
          :inline="true"
          :model="tdObjectClone"
          :show-message="false"
          ref="validateForm"
          class="demo-form-inline styleObj"
        >
          <el-col
            :span="12"
            class="inputStyle"
          >
            <lInputTable
              v-selectInner
              ref="lInput"
              :popoverWidth="800"
              suffix-icon="el-icon-search"
              :tableData="selectOptions"
              @query="search"
              v-model="tdObjectClone.itemName"
              @select="select"
              :inputName="tdObjectClone.itemName"
              :tableLoading="inputTableLoading"
              :placeholder="tdObjectClone.itemName"
              :tableParams="dropColumn"
              valueKey="name"
            >
            </lInputTable>
          </el-col>
          <el-col
            :span="6"
            class="inputStyleNum"
            style="margin: 0px 5px"
          >
            <el-form-item
              prop="quantity"
              label=""
              :rules="qtyRules"
            >
              <el-input-number
                v-selectInner
                class="qtyCls"
                ref="qtyInput"
                :min="0"
                :max="9999"
                style="width: 100%"
                :controls="false"
                @change="computeAmt"
                @keydown.enter.native="addNewTr"
                v-model="tdObjectClone.quantity"
                placeholder="数量"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col
            :span="2"
            class="elCol2 innerCenter"
            v-if="tdObjectClone.unit"
          >
            <el-select
              v-model="tdObjectClone.unit"
              placeholder=""
              @change="unitChange"
              :disabled="true"
            >
              <el-option
                v-for="item in tdObjectClone.unitOptions"
                :label="item.label"
                :key="item.value"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col
            :span="4"
            class="innerCenter"
          >
            <useWaySelect v-model="tdObjectClone.useWay"></useWaySelect>
          </el-col>
        </el-form>
        <div class="td-mask" v-if="herMaskShow"></div>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getUnitTextAjax } from "./utils.js";
import { singleTdNum, totalTdNum, dropColumn } from "./variable.js";
import lInputNumber from "@/components/adviceCommon/lInputNumber.vue";
import { herbalItemPage } from "@/api/homeSickbeds/hsDiagTreat/hsChmRecipe.js";
import { deepClone } from "@/utils/index.js";

import {
  deleteByIdWithVersion,
  single,
  validHerbalAdviceItem
} from "@/api/cis/order/order";
import { amtCalculatFunc } from "@/components/adviceCommon/drugCalculatFunc.js";
import { setComponentFocusFunc } from "@/components/adviceCommon/adviceUtils.js";
import useWaySelect from "@/views/cis/prescriptionRecor/newPatientsManage/order/chinaMedicinalHerb/components/useWaySelect.vue";
import directives from "@/components/adviceCommon/adviceDirectives.js";
import {newAuthorityVerifByItem} from "../../order/module/adviceUtil/util.js"
import { mapActions, mapGetters } from "vuex";

export default {
  name: "lTd",
  directives: {
    ...directives
  },
  props: {
    herMaskShow: {
      type: Boolean
    },
    currentChuFangRow: {
      type: Object,
      default: function() {
        return {
          orderStatus: ""
        };
      }
    },
    selectGroup: {
      type: Object,
      default: function() {
        return {};
      }
    },
    dosageValue: {
      type: String,
      default: function() {
        return "";
      }
    },
    noBorder: {
      default: false
    },
    lastOne: {
      default: false
    },
    tdObjectClone: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  components: {
    lInputNumber,
    useWaySelect
  },

  data() {
    var checkQty = (rule, value, callback) => {
      // debugger
      if (this.tdObjectClone.itemId) {
        if (value === 0) {
          callback(new Error("数量不可为0!"));
        } else if (!value) {
          callback(new Error("数量不可为空!"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      aaa: "",
      //数量校验
      qtyRules: { validator: checkQty, trigger: ["blur", "change"] },
      // divEditStyle
      // divEditStyle:true,
      drugItem: {},
      inputTableLoading: false, //下拉table组件 loading
      // tdObjectClone: this.tdObject,
      input: "",
      value: "",
      selectOptions: [],
      dropColumn,
      // 分页数据
      currentPage: 1,
      pageSize: 10,
      total: 1,
      queryName: "",
      //  查询条件
      searchForm: {
        visitCode: "", //门诊处方患者列表 门诊号
        categoryCode: 2,
        inpCode: "",
        dateRange: [],
        patientId: "",
        wardId: "",
        bedNo: "",
        itemName: "", // 医嘱查询关键词
        status: "", //
        //    deptType: "1", //
        adviceType: "3",
        today: "",
        patientName: "",
        property: "",
        attribute: ""
      }
    };
  },

  methods: {
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
    validateTdForm() {
      return new Promise((resolve, reject) => {
        this.$refs["validateForm"].validate((valid, error) => {
          if (valid) {
            resolve(true);
          } else {
            this.showErrorMsg(error);
            reject(error);
            return false;
          }
        });
      });
    },
    clearValidate() {
      this.$nextTick(() => {
        this.$refs["validateForm"].clearValidate();
      });
    },
    unitChange(value) {
      // this.$set(this.tdObjectClone, 'unit', this.getLabel(this.tdObjectClone.unitOptions, value));
      // this.computeAmt();
      this.$emit("computeAmt");
    },
     clearCurrentDrugs (){
                this.clearSelectKeysFunc();
                this.$nextTick(()=>{
                  //清空当前行
                  this.$refs.lInput.clear();
                  this.$refs.lInput.focus();
                });
              },
    // 计算金额
    computeAmt() {
      this.$nextTick(() => {
        // this.$emit("computeAmt");
        // let curObj = deepClone(this.tdObjectClone);
        // // let orderItem = { ...curObj, ...this.drugItem };
        // let unit = curObj.unit;
        // let quantity =
        //   typeof curObj.quantity != "undefined" ? curObj.quantity : 0;
        // let price = typeof curObj.price != "undefined" ? curObj.price : 0;
        // let packQty = curObj.packQuantity ? curObj.packQuantity * 1 : 1;
        // let unitFlag = getUnitFlag(curObj.packUnit, unit);
        // let amt = amtCalculatFunc(quantity, price, packQty, unitFlag, 4);
        // //单条医嘱明细四舍五入保留两位小数之后，再求和
        // // amt = amt ? amt.rewToFixed(2) : 0;
        // // console.log("packQty", packQty, "price", price);
        // this.$set(this.tdObjectClone, 'amt', amt);
        // this.$emit("computeAmt");
      });
    },
    getLabel(optList, key) {
      let obj = optList.find(item => {
        return item.value === key;
      });
      return obj.label;
    },
    addNewTr() {
      if (this.lastOne) {
        // setTimeout(()=>{
        this.$emit("addNewTr");
        // },0)
      }
    },
    clearSelectKeys() {
      return [
        "itemName",
        "code",
        "execDeptName",
        "execDeptCode",
        "manageType",
        "formCode",
        "amt",
        "classCode",
        "execDeptName",
        "orderCat",
        "orderItemCat",
        "orderName",
        "itemId",
        "reimburseMark",
        "reimburseName",
        "medicalInsuranceCat",
        "price",
        "packQuantity",
        "receiveDept",
        "unitSaleFlg",
        "unit",
        "packUnit",
        "unit",
        "orderId",
        "stType",
        "stSolutionType",
        "validTime",
        "positiveDispense",
        "applicationRange",
        "execDeptName",
        "spec",
        "dosage",
        "formCode",
        "stockNum",
        "stClassCode",
        "stType",
        "useWay", //煎服法
        "quantity", //数量
        "id",
        "row_id",
        "patientId"
      ];
    },

    async deleteTdData() {
      // debugger
      if (
        this.tdObjectClone.orderStatus === "4" ||
        this.tdObjectClone.orderStatus === "2"
      ) {
        this.$message.warning("已收费和提交的医嘱不能删除！");
        return;
      }
      if (this.tdObjectClone.id) {
        try {
          await this.deleteConfirm("确认删除本条数据吗？");
          this.$set(this.tdObjectClone, "deletedStatus", "");
          deleteByIdWithVersion(this.tdObjectClone)
            .then(res => {
              if (res.code === 1) {
                // this.clearSelectKeysFunc();
                this.$emit("deleteTdData", this.tdObjectClone);
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              }
            })
            .catch(() => {
              this.$message({
                type: "error",
                message: "删除失败"
              });
            });
        } catch (e) {}
      } else {
        // this.clearSelectKeysFunc();
        this.$emit("deleteTdData", this.tdObjectClone);
      }

      this.clearValidate();
    },
    clearSelectKeysFunc() {
      let clearSelectKeys = this.clearSelectKeys();
      for (let i = 0; i < clearSelectKeys.length; i++) {
        if (clearSelectKeys[i] === "quantity") {
          this.$set(this.tdObjectClone, clearSelectKeys[i], undefined);
        } else {
          this.$set(this.tdObjectClone, clearSelectKeys[i], "");
        }
      }
    },
    deleteConfirm(text) {
      return new Promise((resolve, reject) => {
        this.$confirm(text, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            //继续选中操作
            resolve(true);
          })
          .catch(() => {
            //取消操作
            reject(false);
          });
      });
    },
    async selectColum(row) {
      try {
        let res = await validHerbalAdviceItem(row);
        if (res.code == 1) {
          return true;
        } else {
          return false;
        }
      } catch (e) {
        return false;
      }
    },
    //库存校验
    async valiedStockNum(row) {
      let params = {
        itemName: row.itemName,
        itemId: row.itemId
      };
      try {
        let res = await validHerbalAdviceItem(params);
        if (res.code == 1) {
          return true;
        }
        this.$message.error(res.msg);
        return false;
      } catch (e) {
        this.$message.error(e.msg);
        return false;
      }
    },
   async select(row) {
     this.resetInputTableParams();
     console.log(row,"返现数据newAuthorityVerifByItem")
     // 权限验证
     try {

       let { siLimitCode } = await newAuthorityVerifByItem(row,this);
       // debugger
       console.log("limitCode", siLimitCode);
       if (siLimitCode != undefined){
         this.$set(this.tdObjectClone, "miRestriction", siLimitCode);
       }
     } catch (error) {
       // this.clearCurrentDrugs();
        console.log(error,"报错信息")
       return;
     }
     //校验重复录入
     let sameDrug = this.$parent.validateSameDrug(row);
     if (sameDrug) {
       this.$message.error("已有" + row.name + "，不应重复录入");
       this.$refs.lInput.clearInputValue();
       return;
     }

     //zhengyawen 无库存并且发药方式不等于配送，提示库存为0
     // if (!row.stockNum && this.selectGroup.dispendingMethod != "2") {
     //   this.$message.error(row.name + "库存为0");
     //   this.$refs.lInput.clearInputValue();
     //   return;
     // }

     // //校验
     // let isStockNum = await this.valiedStockNum(row);
     // if (!isStockNum) {
     //   this.$refs.lInput.clearInputValue();
     //   return;
     // }
     await this.selectData(row);
   },
    async selectData(row) {
      this.$set(this.tdObjectClone, "item", row);
      this.$set(this.tdObjectClone, "itemId", row.id);
      this.$set(this.tdObjectClone, "itemName", row.name);
      this.$set(this.tdObjectClone, "unit", row.limitUnit);

      try {
        let unitOptions = await getUnitTextAjax([row.limitUnit, row.pkgUnit]);
        this.$set(this.tdObjectClone, "unitOptions", unitOptions);
      } catch (error) {

      }

      // 单剂金额赋值
      this.$nextTick(() => {
        // console.log("qtyInput", this.$refs.qtyInput);
        this.$refs.qtyInput.focus();
      });

    },
    resetInputTableParams (){
      this.selectOptions = [];
      this.currentPage = 1;
      this.pageSize = 10;
      this.total = 1;
    },

    async search(query, isPage) {
      //用户搜索 删除 药品和药品id
      this.$set(this.tdObjectClone, "itemId", "");
      this.$set(this.tdObjectClone, "itemName", query);

      // debugger
      let pageNo = 1;
      let tableData = [];
      // console.log("query:::::::", query);
      if (isPage) {
        tableData = this.selectOptions;
        pageNo = Number(this.currentPage) + 1;
        if (Number(pageNo) > Number(this.total) / Number(this.pageSize)) {
          return;
        }
      } else {
        tableData = [];
        pageNo = 1;
      }
      let ajaxData = {
        pageNo: pageNo,
        pageSize: this.pageSize,
        key: query,
        pharmacyId: this.chmPharmacyObject.selected.deptId,
        drugClassCode: this.dosageValue
      };
      this.inputTableLoading = true; //增加loading
      // eslint-disable-next-line complexity
      try {
        let { data, msg, code, pageNo, total, pageSize } = await herbalItemPage(
          ajaxData
        );
        if (code == 1) {
          data.forEach((item) => {
            tableData.push(item);
          });
          this.selectOptions = tableData;
          this.currentPage = pageNo;
          this.pageSize = pageSize;
          this.total = total;
          this.queryName = query;
        } else {
          this.$message.error(msg ? msg : "获取数据失败");
          this.selectOptions = [];
        }
        this.inputTableLoading = false; //增加loading
      } catch (error) {
        this.$message.error("获取数据失败");
        this.inputTableLoading = false; //增加loading
      }
    }
  },
  watch: {
    // tdObject: {
    //   deep: true,
    //   handler() {
    //     this.tdObjectClone = this.tdObject;
    //     // console.log("this.tdObject", this.tdObject);
    //     // this.$set(
    //     //   this.tdObjectClone,
    //     //   "orderItemNameCopy",
    //     //   this.tdObjectClone.orderItemNameCopy || this.tdObjectClone.itemName
    //     // );
    //     // this.clearValidate();
    //   }
    // }
  },
  computed: {
    ...mapGetters("adviceCommon", ["chmPharmacyObject"]),
    ...mapGetters("homeSickbeds", ["receivePatientData"]),
    tdCls() {
      return {
        tdCls: true,
        noBorder: this.noBorder
      };
    },
    showClearBtn() {
      return !!this.tdObjectClone.id || !!this.tdObjectClone.patientId;
    }
  }
};
</script>

<style scoped lang="scss">
.tdCls {
  position: relative;
  font-size: 0;
  padding: 3px 5px;
  .styleObj {
    display: flex;
    align-items: center;
    justify-content: left;
  }
  // border-right: 1px solid #ccc;
  .tdClsStylel {
    padding: 10px;
    background-color: #f5f7fa;
    border-radius: 8px;
    /deep/ .el-input__icon {
      display: none;
    }
    .elCol2 /deep/ .el-input__inner {
      border: none;
      text-align: center;
      padding: 0;
    }
    .elCol2 {
      // border: 1px solid #EBEEF5;
      /deep/ .el-input.is-disabled .el-input__inner {
        // background-color: #FFFFFF;
      }
    }
    .divEditStyle {
      position: absolute;
      top: 0px;
      left: 0px;
      width: 100%;
      height: 100%;
      background: #f5f7fa;
      line-height: 32px;
      text-align: center;
    }
  }
  .demo-form-inline {
    /deep/.el-form-item {
      margin-right: 0 !important;
      margin-bottom: 0 !important;
    }

    .qtyCls {
      /deep/.el-input__inner {
        //解决数量输入框太小的问题
        padding: 0px !important;
      }
    }
  }
}

.noBorder {
  border-right: none !important;
}

.innerCenter {
  display: flex;
  justify-content: center;
  align-items: center;
}


.td-mask {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 99;
    background-color: #f5f7fa;
    opacity: 0.3;
    cursor: not-allowed;
}
</style>
