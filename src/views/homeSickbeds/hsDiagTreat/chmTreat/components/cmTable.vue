<template>
  <div class="main-table height100">
    <el-row
      :gutter="3"
      style="display: inline-block;width: 25%;"
      class="table-header"
      :key="n"
      v-for="n in 4"
    >
      <!-- <el-col :span="9" class="title">草药名称</el-col>
      <el-col :span="4" class="title">数量</el-col>
      <el-col :span="5" class="title">单位</el-col>
      <el-col :span="6" class="title">煎服法</el-col> -->
    </el-row>
    <div class="table-body">
      <l-td
        :herMaskShow="herMaskShow"
        style="display: inline-block;width: 25%;"
        ref="lTd"
        :selectGroup="selectGroup"
        :dosageValue="dosageValue"
        :currentChuFangRow="currentChuFangRow"
        :data-id="'mainTableTdCls' + n"
        :key="n"
        v-for="(item, n) in tdObjectArray"
        :noBorder="!((n + 1)%4)"
        :lastOne="n === (tdObjectArray.length - 1)"
        @addNewTr="addNewTr"
        @deleteTdData="deleteTdDataFunc"
        @computeAmt="computeAmtFunc"
        :tdObjectClone="item"
      ></l-td>
      <el-col
        :span="6"
        style="width: 380px;height: 50px;border: 1px dashed #C8C9CC;border-radius: 10px;margin-left: 6px;"
        v-if="!herMaskShow"
      >
        <div
          class="width100 height100 addNewTrStyle"
          @click="addNewTr"
        >
          <i
            class="el-icon-plus"
            style="color: #000000;font-size: 20px;"
          ></i>
        </div>
      </el-col>

    </div>
  </div>

</template>

<script>
import { singleTdNum, totalTdNum, dropColumn } from "./variable.js";
import lTd from "./lTd.vue";
import { getDataIdDom } from "@/utils/util.js";
import { mapActions, mapGetters } from "vuex";
import { deepClone } from "@/utils";

import {
  setComponentFocusFunc,
  getUnitFlag
} from "@/components/adviceCommon/adviceUtils.js";
import { validQuoteHerbal } from "@/api/tools/commonDrug.js";
import { validQuoteHerbalChnDrug, creatSomeEmptyList } from "./utils";


export default {
  name: "td",
  props: {
    herMaskShow: {
      type: Boolean
    },
    currentChuFangRow: {
      type: Object,
      default: function() {
        return {};
      }
    },
    tdObjectArray: {
      type: Array,
      default: function() {
        return [];
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
    chmForms: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  components: {
    lTd
  },
  data() { 
    // let tdObjectArray = creatSomeEmptyList();
    return {
      input: "",
      value: "",
      // tdObjectArray
    };
  },
  created() {},

  computed: {
    //...mapGetters("cis", ["commonChnDrugData"])
  },
  mounted() {
    this.keydownFun();
  },
  methods: {
    // 回车事件
    keydownFun() {
      $(".tdCls")
        .find(".inputStyleNum input")
        .keydown(function(e) {
          let that = this;
          if (e.which == 13) {
            let inputs = $(".tdCls").find(".inputStyle input");
            let inputsNum = $(".tdCls").find(".inputStyleNum input");
            /* console.log(inputs.length);
            console.log(that.value, "打印东西");
            console.log(inputs[3].value, "打印东西"); */
            for (var i = 0; i < inputsNum.length; i++) {
              if (that == inputsNum[i]) {
                if (that.value != "") {
                  inputs[i + 1].focus();
                  break;
                } else {
                  inputsNum[i].focus();
                  break;
                }
              }
            }
          }
        });
    },

    insertSingleDrug(c) {
      return new Promise((resolve, reject) => {
        let getNoOfDrugs = this.getNoOfDrugs(); //药品的数量
        let fillDrugIndex = 0; // 常用药填充位置

        if (!this.tdObjectArray[getNoOfDrugs].itemId) {
          //如果没有药品，给填充药品
          fillDrugIndex = getNoOfDrugs;
        } else {
          //如果有药品，填充药品在第一个空位
          for (let i = 0; i < this.tdObjectArray; i++) {
            if (!item.itemId) {
              fillDrugIndex = i;
              break;
            }
          }
        }

        this.$nextTick(() => {
          let lTdRefList = this.$refs.lTd;
          // lTdRefList[fillDrugIndex].select(c);
          lTdRefList[fillDrugIndex].selectData(c);
          resolve(true);
        });
      });
    },
    // insertQtyAnd
    validateSameDrug(row) {
      if (Object.keys(row).length === 0) {
        return false;
      }
      return this.tdObjectArray.some(function(item) {
        return item.itemId === row.id;
      });
    },
    getNoOfDrugs() {
      let drugNumber = 0; //药品的数量
      this.tdObjectArray.forEach((item, index) => {
        // 有药品的数量
        if (item.itemId) {
          drugNumber++;
        }
      });
      return drugNumber;
    },
    // eslint-disable-next-line complexity
    deleteTdDataFunc(deleteObj) {
      if (deleteObj.id || deleteObj.delete_id) {
        let targetId = deleteObj.id || deleteObj.delete_id;
        let targetKey = deleteObj.id ? "id" : "delete_id";
        let cloneList = deepClone(this.tdObjectArray);
        for (let i = 0; i < cloneList.length; i++) {
          let item = cloneList[i];
          if (item[targetKey] && item[targetKey] === targetId) {
            this.tdObjectArray.splice(i, 1, {});
            break;
          }
        }

        // console.log(this.tdObjectArray);
        // console.log(this.tableList);
        if (deleteObj.id) {
          //删除服务器数据 需要load 处方列表

          //删除源数据  服务端数据删除后 本地数据也要删除
          let originList = this.currentChuFangRow.drugList;
          for (let i = 0; i < originList.length; i++) {
            let item = originList[i];
            if (item[targetKey] && item[targetKey] === targetId) {
              originList.splice(i, 1);
              break;
            }
          }

          if (this.getNoOfDrugs() === 0) {
            //删除最后一条明细 需要刷新处方列表
            this.$emit("loadChuFang");
          }
        }
      } else {
        this.$message.error("删除有问题！");
      }
    },
    // computeAmtHnadler() {
    //   let singleTotal = 0;
    //   let allTotal = 0;
    //   let no = Number(
    //     document
    //       .querySelector(".onceDosageInput")
    //       .querySelector(".el-input__inner").value
    //   );
    //   this.tdObjectArray.forEach(item => {
    //     let unitKey = item.unitKey;
    //     //数量是 用药剂数 no  * 药品数量
    //     let drugQty = typeof item.qty != "undefined" ? item.qty : 0;

    //     let price = typeof item.price != "undefined" ? item.price : 0;
    //     let packQty = item.packQuantity ? item.packQuantity * 1 : 1;

    //     let unitFlag = getUnitFlag(item.packUnit, unitKey);
    //     //  最终数量 * 单价 （大包装是单价除以包装量）
    //     item.amt = amtCalculatFunc(drugQty, price, packQty, unitFlag, 10);
    //     singleTotal = Number(singleTotal) + Number(item.amt);
    //     console.log("item.amt::", item.amt);
    //     console.log("drugQty::", drugQty);
    //     let amtClone = Number(item.amt * no).rewToFixed(2);
    //     console.log("amtClone", amtClone);
    //     //单条医嘱总金额 * 开药剂数
    //     allTotal = Number(allTotal) + Number(amtClone);
    //   });
    //   return {
    //     singleTotal,
    //     allTotal
    //   };
    // },
    computeAmtFunc() {
      // this.$emit(computeAmtFunc, this.tdObjectArray);
      // 处方总金额赋值
      // this.$nextTick(() => {
      //   let { singleTotal, allTotal } = this.computeAmtHnadler();
      //   try {
      //     document.getElementById(
      //       "herRpSingleAmount"
      //     ).innerText = singleTotal.rewToFixed(4);
      //   } catch (e) {
      //     document.getElementById("herRpSingleAmount").innerText = "0.0000";
      //   }
      //   let herFryingAmount = 0;
      //   // 代煎药 费用
      //   try {
      //     herFryingAmount = Number(
      //       document.getElementById("herFryingAmount").innerText
      //     );
      //   } catch (error) {}

      //   let showAmt = herFryingAmount + allTotal;
      //   document.getElementById("herTotalAmount").innerText = Number(
      //     showAmt
      //   ).rewToFixed(2);
      // });
    },

    addNewTr() {
      // this.totalTdNum = this.totalTdNum + singleTdNum;
      for (let i = 0; i < singleTdNum; i++) {
        this.tdObjectArray.push({});
        // this.tableList.push({});
      }
      this.$nextTick(function() {
        this.keydownFun();
      });
    },
    validateTypeDrug(row) {
      return row.classCode != this.selectGroup.dosageValue;
    }
  },
  watch: {
    //常用药引入
    commonChnDrugData: {
      deep: true,
      async handler(c) {
        //zhengyawen剂型校验
        let typeDrug = this.validateTypeDrug(c);
        if (typeDrug) {
          this.$message.error(c.orderItemName + "剂型不符，请重新选择");
          return;
        }

        //zhengyawen相同药品校验
        let sameDrug = this.validateSameDrug(c);
        if (sameDrug) {
          this.$message.error("已有" + c.orderItemName + "，不应重复录入");
          return;
        }
        //zhengyawen校验
        let params = [
          {
            quantity: c.quantity,
            useQty: this.chmForms.useQty || 1,
            itemId: c.itemId,
            orderItemName: c.orderItemName,
            dispendingMethod: this.selectGroup.dispendingMethod,
            receiveDept: this.selectGroup.takingRoom
          }
        ];
        let flag = await validQuoteHerbalChnDrug(params, "引用失败");
        if (!flag) {
          return;
        }
        if (this.currentChuFangRow.orderStatus == "2") {
          this.$message.error("已提交的处方不可再引用药物");
        } else {
          //只有没有提交的才可以引用常用药
          //如果没有选中当前处方 提示用户选择处方
          if (Object.keys(this.currentChuFangRow).length === 0) {
            this.$message.warning("请选中或者新增中草药处方");
            return;
          }

          c = {
            ...c,
            ...{
              itemId: c.itemId,
              limitUnit: c.unit,
              itemType: c.orderCat,
              execDeptCode: c.receiveDept,
              unit: c.packUnit,
              delete_id: +new Date(),
              row_id: this.currentChuFangRow.row_id,
              recipeCode: this.currentChuFangRow.recipeCode,
              orderStatus: this.currentChuFangRow.orderStatus
            }
          };
          // this.tdObjectArray.splice(this.tableList.length,1,{});
          this.insertSingleDrug(c);
        }
      }
    },
    // tdObjectArray: {
    //   deep: true,
    //   handler(val) {
    //     console.log("val", val);
    //   }
    // }
  }
};
</script>

<style scoped lang="scss">
.main-table {
  height: 100%;

  .table-header {
    padding: 4px 0;

    .title {
      display: inline-block;
      font-size: 14px;
      text-align: center;
    }
  }

  .table-body {
    height: calc(100% - 24px);
    font-size: 0;
    overflow: auto;

    .addNewTrStyle {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
