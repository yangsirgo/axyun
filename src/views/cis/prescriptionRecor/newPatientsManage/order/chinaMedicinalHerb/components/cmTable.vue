<template>
  <div class="main-table height100">
    <el-row :gutter="3" style="display: inline-block;width: 25%;" class="table-header" :key="n" v-for="n in 4">
      <!-- <el-col :span="9" class="title">草药名称</el-col>
      <el-col :span="4" class="title">数量</el-col>
      <el-col :span="5" class="title">单位</el-col>
      <el-col :span="6" class="title">煎服法</el-col> -->
    </el-row>
    <div class="table-body">
      <l-td style="display: inline-block;width: 25%;" 
        ref="lTd" 
        :selectGroup="selectGroup" 
        :dosageValue="dosageValue"
        :herMaskShow="herMaskShow"
        :currentChuFangRow="currentChuFangRow" 
        :data-id="'mainTableTdCls' + n" 
        :key="n" 
        v-for="(item, n) in tdObjectArray"
        :noBorder="!((n + 1)%4)" 
        :lastOne="n === (tdObjectArray.length - 1)" 
        @addNewTr="addNewTr" 
        @deleteTdData="deleteTdDataFunc"
        @computeAmt="computeAmtFunc" 
        :listIndex="n"
        :tdObjectClone="item"></l-td>

      <el-col :span="6" style="width: 380px;height: 50px;border: 1px dashed #C8C9CC;border-radius: 10px;margin-left: 6px;" v-if="!herMaskShow">
        <div :class="addBtnCls" @click="addNewTr">
          <i class="el-icon-plus" style="color: #000000;font-size: 20px;"></i>
        </div>
      </el-col>

    </div>
  </div>

</template>

<script>
  import lTd from "./lTd.vue";
  import {
    getDataIdDom
  } from "@/utils/util.js";
  import {
    mapActions,
    mapGetters
  } from "vuex";
  import {
    deepClone
  } from "@/utils";
  import { amtCalculatFunc } from "@/components/adviceCommon/drugCalculatFunc.js";
import {
  setComponentFocusFunc
} from "@/components/adviceCommon/adviceUtils.js";
  import { validQuoteHerbal } from "@/api/tools/commonDrug.js";
import { validQuoteHerbalChnDrug, getChmUnitFlag } from "./utils";

  const defaultTdNum = 4;
  const singleTdNum = 4;

  export default {
    name: "td",
    props: {
      herMaskShow:{
        type: Boolean
      },
      currentChuFangRow: {
        type: Object,
        default: function() {
          return {};
        }
      },
      tableList: {
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
      return {
        input: "",
        value: "",
        totalTdNum: defaultTdNum,
        tdObjectArray: [],
      };
    },
    created() {
      this.insertArray();
    },

    computed: {
      ...mapGetters("cis", ["commonChnDrugData"]),
      addBtnCls (){
        return {
          "width100": true,
          "height100": true,
          "addNewTrStyle": true,
          // "addBtnDisabled": this.herMaskShow
        }
      }
    },
    mounted() {
      // this.keydownFun();
    },
    methods: {
      // 回车事件
      // keydownFun() {
      //   $(".tdCls").find('.inputStyleNum input').keydown(function(e) {
      //     let that = this;
      //     if (e.which == 13) {
      //       let inputs = $(".tdCls").find('.inputStyle input');
      //       let inputsNum = $(".tdCls").find('.inputStyleNum input');
      //       /* console.log(inputs.length);
      //       console.log(that.value, "打印东西");
      //       console.log(inputs[3].value, "打印东西"); */
      //       for (var i = 0; i < inputsNum.length; i++) {

      //         if (that == inputsNum[i]) {
      //           if(that.value != ''){
      //             inputs[i + 1].focus();
      //             break;
      //           }else{
      //             inputsNum[i].focus();
      //             break;
      //           }
      //         }
      //       }
      //     }
      //   })
      // },
      // 回车事件

      insertChnRpDetails(detailsList) {
        //中草药医嘱明细插入
        return new Promise(async (resolve, reject) => {
          detailsList.filter(item => {
            return this.tdObjectArray.some(tdItem => {
              return tdItem.orderItemId === item.orderItemId;
            });
          });
          let sameDrugList = [];
          let sameDrugNameList = [];
          let noSameDrugList = [];
          let noSameDrugNameList = [];

          for (let i = 0; i < detailsList.length; i++) {
            let item = detailsList[i];
            if (this.validateSameDrug(item)) {
              sameDrugList.push(item);
              sameDrugNameList.push(item.orderItemName);
            } else {
              noSameDrugList.push(item);
              noSameDrugNameList.push(item.orderItemName);
            }
          }

          if (noSameDrugList.length > 0) {
            // 有可以插入的药品
            if (sameDrugList.length > 0) {
              //提示用户 有相同项不插入，插入不同项
              try {
                let actionMessage =
                  "已有" +
                  sameDrugNameList.join(",") +
                  "，不应重复录入,可以录入" +
                  noSameDrugNameList.join(",");
                await this.alertFunc(actionMessage);
              } catch (e) {
                reject();
              }
            }

            let noSameIndex = 0;
            for (let i = 0; i < this.tdObjectArray.length; i++) {
              let item = this.tdObjectArray[i];
              if (noSameIndex < noSameDrugList.length) {
                if (!item.orderItemId) {
                  this.$set(this.tdObjectArray, i, noSameDrugList[noSameIndex]);
                  noSameIndex++;
                }
              } else {
                break;
              }
            }

            resolve(true);
          } else {
            //没有可以插入的药品，提示相同项
            this.$message.error(
              "已有" + sameDrugNameList.join(",") + "，不应重复录入"
            );
            reject();
          }
        });
      },

      alertFunc(text) {
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
      insertSingleDrug(c) {
        return new Promise((resolve, reject) => {
          let getNoOfDrugs = this.getNoOfDrugs(); //药品的数量
          let fillDrugIndex = 0; // 常用药填充位置

          //zhengyawen  如果本行数据已填充完毕，新增一行后再进行填充
          if(this.tdObjectArray.length < getNoOfDrugs + 1) {
            this.addNewTr(true);
            fillDrugIndex = getNoOfDrugs;
          }else if (!this.tdObjectArray[getNoOfDrugs].orderItemId) {
            //如果没有药品，给填充药品
            fillDrugIndex = getNoOfDrugs;
          } else {
            //如果有药品，填充药品在第一个空位
            for (let i = 0; i < this.tdObjectArray; i++) {
              if (!item.orderItemId) {
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
          return item.orderItemId === (row.itemId || row.orderItemId);
        });
      },
      getNoOfDrugs() {
        let drugNumber = 0; //药品的数量
        this.tdObjectArray.forEach((item, index) => {
          // 有药品的数量
          if (item.orderItemId) {
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
      computeAmtHnadler (){
        let singleTotal = 0;
        let allTotal = 0;
        let no = Number(
          document
          .querySelector(".onceDosageInput")
          .querySelector(".el-input__inner").value
        );
        this.tdObjectArray.forEach(item => {
          let unitKey = item.unitKey;
          //数量是 用药剂数 no  * 药品数量 
          let drugQty =
            typeof item.qty != "undefined" ? item.qty * no : 0;

          let price = typeof item.price != "undefined" ? item.price : 0;
          let packQty = item.packQuantity ? item.packQuantity * 1 : 1;

          let unitFlag = getChmUnitFlag(item.limitUnit, item.packUnit, unitKey);
          //  最终数量 * 单价 （大包装是单价除以包装量）
          item.amt = this.amtCalculatFuncWrapper(drugQty, price, packQty, unitFlag);
          // 单个药品  总价 保留两位小数 
          item.amt = Number(item.amt).rewToFixed(2);
          console.log(item.orderItemName, "amt::::::", item.amt);
          //单条医嘱总金额相加
          allTotal = Number(allTotal) + Number(item.amt);
        });

        singleTotal = no != 0 ? Number(allTotal / no).rewToFixed(4) : 0;
        // console.log("singleTotal:::::", singleTotal);
        return {
          singleTotal,
          allTotal
        }
      }, 
      computeAmtFunc() {

        // 处方总金额赋值
        this.$nextTick(() => {
          let {singleTotal, allTotal} = this.computeAmtHnadler();
          try {
            document.getElementById(
              "herRpSingleAmount"
            ).innerText = Number(singleTotal).rewToFixed(4);
          } catch (e) {
            document.getElementById("herRpSingleAmount").innerText = "0.0000";
          }
          let herFryingAmount = 0;
          // 代煎药 费用
          try {
            herFryingAmount = Number(
              document.getElementById("herFryingAmount").innerText
            );
          } catch (error) {}

          let showAmt = herFryingAmount + allTotal;
          document.getElementById("herTotalAmount").innerText = Number(
            showAmt
          ).rewToFixed(2);
        });
      },

      addNewTr(flag) {
        let focusNo = this.tdObjectArray.length;
        //console.log("新增了。。。。");
        // this.totalTdNum = this.totalTdNum + singleTdNum;
        for (let i = 0; i < singleTdNum; i++) {
          this.tdObjectArray.push({});
          // this.tableList.push({
          //   orderItemName:"",
          //   qty:"",
          //   useWay:"",
          //   unitOptions:[]
          // });
        };
        //zhengyawen，如果是右侧的工具栏引用，则不需要选中当前药品输入框的内容
        if(flag) {
          return;
        }
        this.$nextTick(function() {
          // this.keydownFun();
          //聚焦新增行的第一个
          setComponentFocusFunc("mainTableTdCls", focusNo);
        })
      },
      getNearNumber(n) {
        return n % singleTdNum === 0 ?
          n :
          ((n - (n % singleTdNum)) / singleTdNum + 1) * singleTdNum;
      },
      insertArray() {
        if (this.tableList && this.tableList.length > 0) {
          //用户存储了药品信息
          this.tdObjectArray = [];
          let length = this.tableList.length;
          if (length <= this.totalTdNum) {
            //用户存储的药品信息小于24项
            for (let i = 0; i < this.totalTdNum; i++) {
              if (i < length) {
                // this.tdObjectArray.push(this.tableList[i]);
              } else {
                // this.tdObjectArray.push({});
                this.tableList.push({});
              }
            }
          } else {
            //用户存储的药品信息大于24项
            this.totalTdNum = this.getNearNumber(this.tableList.length); //取临近singleTdNum的倍数的数
            for (let i = 0; i < this.totalTdNum; i++) {
              if (i < length) {
                // this.tdObjectArray.push(this.tableList[i]);
              } else {
                // this.tdObjectArray.push({});
                this.tableList.push({});
              }
            }
          }
        } else {
          this.emptyTable();
        }

        this.tdObjectArray = this.tableList;
      },
      emptyTable() {
        this.tdObjectArray = [];
        for (let i = 0; i < this.totalTdNum; i++) {
          // this.tdObjectArray.push({});
          this.tableList.push({});
          //LInput 组件重置值
          this.$nextTick(() => {
            let nodeList = getDataIdDom("div", "data-id", "mainTableTdCls" + i);
            if (nodeList.length > 0) {
              nodeList[0].getElementsByClassName("el-input__inner")[0].value = "";
            }
          });
        }
      },
      resetTable() {
        this.tdObjectArray = [];
        this.totalTdNum = defaultTdNum;
        this.emptyTable();
      },
      validateTypeDrug(row) {
        return row.classCode != this.selectGroup.dosageValue;
      },
      amtCalculatFuncWrapper (drugQty, price, packQty, unitFlag){
        //在计算时 unitFlag 0 是大单位，1 是小单位
        //中草药是 unitFlag 是反的，所以需要处理
        let nUnitFlag = this.reverseUnitFlag(unitFlag);
        return amtCalculatFunc(drugQty, price, packQty, nUnitFlag, 10);
      },
      reverseUnitFlag (unitFlag){
        return unitFlag == "0" ? "1" : "0"
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

          //console.log("药品数据：：：：", c);
          //zhengyawen校验
          let params = [{
            quantity: c.quantity,
            useQty: this.chmForms.useQty || 1,
            orderItemId: c.orderItemId,
            packUnit: c.packUnit,
            unit: c.unit,
            unitKey: c.unit,
            orderItemName: c.orderItemName,
            dispendingMethod: this.selectGroup.dispendingMethod,
            receiveDept: this.selectGroup.takingRoom
          }];
          let flag = await validQuoteHerbalChnDrug(params, "引用失败");
          if(!flag){
            return;
          }
          if(this.currentChuFangRow.orderStatus == '2'){
             this.$message.error("已提交的处方不可再引用药物");
             return;
          }
           //只有没有提交的才可以引用常用药
          //如果没有选中当前处方 提示用户选择处方
          if (Object.keys(this.currentChuFangRow).length === 0) {
            this.$message.warning("请选中或者新增中草药处方");
            return;
          }
          c = {
            ...c,
            ...{
              itemId: c.orderItemId,
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
      },
      tableList: {
        deep: true,
        handler(val) {
          // if (val.length === 0) {
          //   this.totalTdNum = defaultTdNum;
          //   this.resetTable();
          // } else {
          //   this.insertArray();
          // }
          this.tdObjectArray = deepClone(val);
          setTimeout(() => {
            this.computeAmtFunc();
          }, 50);
        }
      }
      // totalTdNum() {
      //   this.insertArray();
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
