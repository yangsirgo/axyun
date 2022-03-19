<template>
  <div class="outDailyReportCom" ref="tableCont">
    <div class="title">{{ orgName }}</div>
    <div class="title">{{ hosName }} 收费汇总</div>
    <div class="table-cont">
      <div v-for="(item, index) in list" :key="index">
        <template v-if="!item.isTree">
          <div :style="item.style" :title="item.data">{{ item.data }}</div>
        </template>
        <div v-else class="clearfix">
          <div v-for="(val, key) in item.list" :key="key">
            <template v-if="!val.isTree"
              ><div :style="val.style" :title="val.data">{{ val.data }}</div></template
            >
            <div v-else class="clearfix" :style="val.style">
              <div v-for="(v, k) in val.list" :key="k" :style="v.style" :title="v.data">
                {{ v.data }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="table-bottom">
      <div class="table-bottom-item">
        制表：
        <span>{{
          printData.hasOwnProperty("turnInOperatorName")
            ? printData.turnInOperatorName
            : ""
        }}</span>
      </div>
      <div class="table-bottom-item">审核： <span></span></div>
      <div class="table-bottom-item">
        制表日期：
        <span>{{
          printData.hasOwnProperty("turnInTime")
            ? printData.turnInTime
            : dayjs(new Date()).format("YYYY年MM月DD日")
        }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { deepClone } from "@/utils/index";
import utils from "../utils/utils.js";

let commonStyle = {
  "text-align": "center",
  "border-right": "1px solid #ccc",
  "border-bottom": "1px solid #ccc",
  height: "35px",
  "line-height": "35px",
  padding: "0 5px"
};
let listInit = [
  {
    prop: "title",
    data: "",
    isTree: false,
    style: {
      ...commonStyle,
      height: "40px",
      "line-height": "40px",
      "font-size": "18px"
    }
  },
  {
    prop: "chargeUserNameList",
    data: "",
    isTree: true,
    list: [
      {
        prop: "chargeUserNameTitle",
        data: "收费员",
        isTree: false,
        style: {
          ...commonStyle,
          width: "30%",
          float: "left",
          color: "#666c70"
        }
      },
      {
        prop: "chargeUserName",
        data: "",
        isTree: false,
        style: {
          ...commonStyle,
          width: "70%",
          float: "left",
          "overflow-y": "auto",
          "line-height": "34px"
        }
      }
    ]
  },
  {
    prop: "dateList",
    data: "",
    isTree: true,
    list: [
      {
        prop: "dateTitle",
        data: "收款日期",
        isTree: false,
        style: {
          ...commonStyle,
          width: "30%",
          float: "left",
          color: "#666c70"
        }
      },
      {
        prop: "date",
        data: "",
        isTree: false,
        style: {
          ...commonStyle,
          width: "70%",
          float: "left"
        }
      }
    ]
  },
  {
    prop: "",
    data: "",
    isTree: true,
    list: [
      {
        prop: "",
        data: "项目名称",
        isTree: false,
        style: {
          ...commonStyle,
          width: "30%",
          float: "left",
          color: "#666c70"
        }
      },
      {
        prop: "",
        data: "金额",
        isTree: false,
        style: {
          ...commonStyle,
          width: "20%",
          float: "left",
          color: "#666c70"
        }
      },
      {
        prop: "",
        data: "项目名称",
        isTree: false,
        style: {
          ...commonStyle,
          width: "30%",
          float: "left",
          color: "#666c70"
        }
      },
      {
        prop: "",
        data: "金额",
        isTree: false,
        style: {
          ...commonStyle,
          width: "20%",
          float: "left",
          color: "#666c70"
        }
      }
    ]
  },
  {
    prop: "turnInFeeFeeClassSumDTOList",
    data: "",
    isTree: true,
    list: [
      {
        prop: "feeClassName",
        data: "",
        isTree: false,
        style: {
          ...commonStyle,
          width: "30%",
          float: "left"
        }
      },
      {
        prop: "totalFeeClassAmt",
        data: "",
        isTree: false,
        isMoney: true,
        style: {
          ...commonStyle,
          width: "20%",
          float: "left",
          color: "#f05a23"
        }
      },
      {
        prop: "feeClassName1",
        data: "",
        isTree: false,
        style: {
          ...commonStyle,
          width: "30%",
          float: "left"
        }
      },
      {
        prop: "totalFeeClassAmt1",
        data: "",
        isTree: false,
        isMoney: true,
        style: {
          ...commonStyle,
          width: "20%",
          float: "left",
          color: "#f05a23"
        }
      }
    ]
  },
  {
    prop: "",
    data: "",
    isTree: true,
    list: [
      {
        prop: "outTypes",
        data: "类别",
        isTree: false,
        style: {
          ...commonStyle,
          width: "30%",
          float: "left",
          color: "#666c70"
        }
      },
      {
        prop: "",
        data: "参保类别",
        isTree: false,
        style: {
          ...commonStyle,
          width: "40%",
          float: "left",
          color: "#666c70"
        }
      },
      {
        prop: "",
        data: "金额",
        isTree: false,
        style: {
          ...commonStyle,
          width: "30%",
          float: "left",
          color: "#666c70"
        }
      }
    ]
  },
  {
    prop: "turnInFeePersonClassSumDTOList",
    data: "",
    isTree: true,
    list: [
      {
        prop: "clinicName",
        data: "",
        isTree: false,
        style: {
          ...commonStyle,
          width: "30%",
          float: "left"
        }
      },
      {
        prop: "finClassName",
        data: "",
        isTree: false,
        style: {
          ...commonStyle,
          width: "40%",
          float: "left"
        }
      },
      {
        prop: "totalAmt",
        data: "",
        isTree: false,
        isMoney: true,
        style: {
          ...commonStyle,
          width: "30%",
          float: "left",
          color: "#f05a23"
        }
      }
    ]
  },
  {
    prop: "",
    data: "",
    isTree: true,
    list: [
      {
        prop: "",
        data: "划价合计",
        isTree: false,
        style: {
          ...commonStyle,
          width: "30%",
          float: "left",
          color: "#666c70"
        }
      },
      {
        prop: "totalFeeAmt",
        data: "",
        isTree: false,
        isMoney: true,
        style: {
          ...commonStyle,
          width: "70%",
          float: "left",
          color: "#f05a23"
        }
      }
    ]
  },
  {
    prop: "",
    data: "",
    isTree: true,
    list: [
      {
        prop: "",
        data: "大写金额",
        isTree: false,
        style: {
          ...commonStyle,
          width: "30%",
          float: "left",
          color: "#666c70"
        }
      },
      {
        prop: "totalFeeAmtRMB",
        data: "",
        isTree: false,
        style: {
          ...commonStyle,
          width: "70%",
          float: "left"
        }
      }
    ]
  },
  {
    prop: "",
    data: "",
    isTree: true,
    list: [
      {
        prop: "",
        data: "现金",
        isTree: false,
        style: {
          ...commonStyle,
          width: "30%",
          float: "left",
          color: "#666c70"
        }
      },
      {
        prop: "",
        data: "POS机",
        isTree: false,
        style: {
          ...commonStyle,
          width: "20%",
          float: "left",
          color: "#666c70"
        }
      },
      {
        prop: "",
        data: "支票",
        isTree: false,
        style: {
          ...commonStyle,
          width: "30%",
          float: "left",
          color: "#666c70"
        }
      },
      {
        prop: "",
        data: "货币误差",
        isTree: false,
        style: {
          ...commonStyle,
          width: "20%",
          float: "left",
          color: "#666c70"
        }
      }
    ]
  },
  {
    prop: "",
    data: "",
    isTree: true,
    list: [
      {
        prop: "cash",
        data: "0.00",
        isTree: false,
        isMoney: true,
        style: {
          ...commonStyle,
          width: "30%",
          float: "left",
          color: "#f05a23"
        }
      },
      {
        prop: "",
        data: "0.00",
        isTree: false,
        isMoney: true,
        style: {
          ...commonStyle,
          width: "20%",
          float: "left",
          color: "#f05a23"
        }
      },
      {
        prop: "cheque",
        data: "0.00",
        isTree: false,
        isMoney: true,
        style: {
          ...commonStyle,
          width: "30%",
          float: "left",
          color: "#f05a23"
        }
      },
      {
        prop: "currencyBalance",
        data: "0.00",
        isTree: false,
        isMoney: true,
        style: {
          ...commonStyle,
          width: "20%",
          float: "left",
          color: "#f05a23"
        }
      }
    ]
  },
  {
    prop: "",
    data: "",
    isTree: true,
    list: [
      {
        prop: "",
        data: "微信支付",
        isTree: false,
        style: {
          ...commonStyle,
          width: "30%",
          float: "left",
          color: "#666c70"
        }
      },
      {
        prop: "",
        data: "支付宝支付",
        isTree: false,
        style: {
          ...commonStyle,
          width: "20%",
          float: "left",
          color: "#666c70"
        }
      },
      {
        prop: "",
        data: "医疗保险",
        isTree: false,
        style: {
          ...commonStyle,
          width: "30%",
          float: "left",
          color: "#666c70"
        }
      },
      {
        prop: "",
        data: "记账",
        isTree: false,
        style: {
          ...commonStyle,
          width: "20%",
          float: "left",
          color: "#666c70"
        }
      }
    ]
  },
  {
    prop: "",
    data: "",
    isTree: true,
    list: [
      {
        prop: "wxpay",
        data: "0.00",
        isTree: false,
        isMoney: true,
        style: {
          ...commonStyle,
          width: "30%",
          float: "left",
          color: "#f05a23"
        }
      },
      {
        prop: "alipay",
        data: "0.00",
        isTree: false,
        isMoney: true,
        style: {
          ...commonStyle,
          width: "20%",
          float: "left",
          color: "#f05a23"
        }
      },
      {
        prop: "totalSiAmt",
        data: "0.00",
        isTree: false,
        isMoney: true,
        style: {
          ...commonStyle,
          width: "30%",
          float: "left",
          color: "#f05a23"
        }
      },
      {
        prop: "keepAccountAmt",
        data: "0.00",
        isTree: false,
        isMoney: true,
        style: {
          ...commonStyle,
          width: "20%",
          float: "left",
          color: "#f05a23"
        }
      }
    ]
  },
  {
    prop: "",
    data: "",
    isTree: true,
    list: [
      {
        prop: "receiptNumList1",
        data: "",
        isTree: false,
        style: {
          ...commonStyle,
          height: "80px",
          width: "80%",
          float: "left",
          "text-align": "left",
          /* overflow: "hidden",
          "text-overflow": "ellipsis" */
          "overflow-y": "auto",
          "word-break": "break-all"
        }
      },
      {
        prop: "receiptQuantity",
        data: "",
        isTree: false,
        style: {
          ...commonStyle,
          height: "80px",
          width: "20%",
          float: "left"
        }
      }
    ]
  },
  {
    prop: "",
    data: "",
    isTree: true,
    list: [
      {
        prop: "",
        data: "作废发票",
        isTree: false,
        style: {
          ...commonStyle,
          height: "120px",
          width: "30%",
          float: "left",
          color: "#666c70"
        }
      },
      {
        prop: "",
        data: "",
        isTree: true,
        style: {
          ...commonStyle,
          height: "120px",
          width: "70%",
          float: "left",
          border: "none",
          padding: 0
        },
        list: [
          {
            prop: "obsoleteRecepitQuantity",
            data: "",
            isTree: true,
            style: {
              ...commonStyle,
              height: "30px",
              width: "100%",
              float: "left"
            }
          },
          {
            prop: "receiptNumList2",
            data: "",
            isTree: true,
            style: {
              ...commonStyle,
              height: "90px",
              width: "100%",
              "text-align": "left",
              float: "left",
              /* overflow: "hidden",
              "text-overflow": "ellipsis" */
              "overflow-y": "auto",
              "word-break": "break-all"
            }
          }
        ]
      }
    ]
  }
];
export default {
  name: "outDailyReportCom",
  props: ["printData"],
  data() {
    return {
      list: deepClone(listInit),
      hosName: "",
      orgName: ""
    };
  },
  async created() {
    // console.log(localStorage.getItem("pamars"));
    this.hosName = JSON.parse(localStorage.getItem("pamars")).hosName || "";
    this.orgName = JSON.parse(localStorage.getItem("pamars")).orgName || "罗湖医院集团";
  },
  watch: {
    printData: {
      deep: true,
      immediate: true,
      async handler(val) {
        this.list = deepClone(listInit);
        this.handlePrintData(val);
      }
    }
  },
  mounted() {},
  methods: {
    // 处理新接口数据
    handlePrintData(obj) {
      let data = deepClone(obj);
      data.title = obj.opIpFlag == "0" ? "门诊收费员日报表" : "住院收费员日报表";
      data.outTypes = obj.opIpFlag == "0" ? "门诊类别" : "住院类别";
      data.date = `${data.settleStartTime || ""} ~ ${data.settleEndTime || ""}`;
      data.receiptQuantity = `共${data.receiptQuantity || 0}张`;
      data.obsoleteRecepitQuantity = `张数：${data.obsoleteRecepitQuantity ||
        0} 作废金额：${utils.outputmoney(data.totalObsoleteRecepitAmt || 0)}`;
      data.totalFeeAmtRMB = utils.changeRMB(data.totalFeeAmt);
      // 遍历支付
      for (let i in data.turnInSettleAmtSumDTOList) {
        data[data.turnInSettleAmtSumDTOList[i]["payTypeCode"]] =
          data.turnInSettleAmtSumDTOList[i].totalSettleAmt;
      }

      // 遍历发票
      let receiptNumList1 = [];
      let receiptNumList2 = [];
      for (let i in data.turnInReceiptSumDTOList) {
        if (data.turnInReceiptSumDTOList[i].statisticsReceiptType == "0") {
          receiptNumList1.push(data.turnInReceiptSumDTOList[i].receiptNum);
        } else if (
          data.turnInReceiptSumDTOList[i].statisticsReceiptType == "1" ||
          data.turnInReceiptSumDTOList[i].statisticsReceiptType == "2"
        ) {
          receiptNumList2.push(data.turnInReceiptSumDTOList[i].receiptNum);
        }
      }
      data.receiptNumList1 = "发票号：" + receiptNumList1.join(",");
      data.receiptNumList2 = receiptNumList2.join(",");

      // 遍历项目
      let arr = data.turnInFeeFeeClassSumDTOList;
      let newArr = [];
      for (let i in arr) {
        let obj = {};
        let a = Math.floor(parseFloat(i / 2));
        var b = parseInt(i % 2);
        if (b == 0) {
          obj = { ...arr[i] };
          newArr.push({
            ...obj,
            feeClassName1: "",
            totalFeeClassAmt1: ""
          });
        } else if (Number(i) - 1 > -1) {
          for (let j in arr[i]) {
            newArr[a][j + "1"] = arr[i][j];
          }
        }
      }

      let exampleObj = this.list[4];
      let num = 4;
      for (let i in newArr) {
        let exObj = deepClone(exampleObj);
        // if(i < newArr.length - 1) {
        for (let j in exObj.list) {
          if (
            exObj.list[j].hasOwnProperty("isMoney") &&
            exObj.list[j].isMoney
          ) {
            exObj.list[j].data = newArr[i][exObj.list[j]["prop"]] === "" ? "" : utils.outputmoney(
              newArr[i][exObj.list[j]["prop"]]
            );
          } else {
            exObj.list[j].data = newArr[i][exObj.list[j]["prop"]];
          }
        }
        this.list.splice(num, 0, exObj);
        num++;
        // }
      }
      if(num > 4) {
        this.list.splice(num,1);
      }

      // 遍历类别
      let turnInPersonList = data.turnInFeePersonClassSumDTOList;
      let num0 = 6 + newArr.length - 1;
      let exampleObj0 = this.list[num0];
      for (let i in turnInPersonList) {
        let exObj = deepClone(exampleObj0);
        // if(i < turnInPersonList.length - 1) {
        for (let j in exObj.list) {
          if (
            exObj.list[j].hasOwnProperty("isMoney") &&
            exObj.list[j].isMoney
          ) {
            exObj.list[j].data = utils.outputmoney(
              turnInPersonList[i][exObj.list[j]["prop"]]
            );
          } else {
            exObj.list[j].data = turnInPersonList[i][exObj.list[j]["prop"]];
          }
        }
        this.list.splice(num0, 0, exObj);
        num0++;
        // }
      }
      if(num0 > 6 + newArr.length - 1) {
        this.list.splice(num0,1);
      }
      // console.log("this.listthis.list",this.list)

      // 填充数据
      let list = this.list;
      for (let i in list) {
        let item = list[i];
        if (item.prop && data.hasOwnProperty(item.prop)) {
          if (item.hasOwnProperty("isMoney") && item.isMoney) {
            item.data = utils.outputmoney(data[item.prop]);
          } else {
            item.data = data[item.prop];
          }
        }
        if (!item.hasOwnProperty("list")) {
          continue;
        }
        for (let j in item.list) {
          let value = item.list[j];
          if (value.prop && data.hasOwnProperty(value.prop)) {
            if (value.hasOwnProperty("isMoney") && value.isMoney) {
              value.data = utils.outputmoney(data[value.prop]);
            } else {
              value.data = data[value.prop];
            }
          }
          if (!value.hasOwnProperty("list")) {
            continue;
          }
          for (let k in value.list) {
            let vv = value.list[k];
            if (vv.prop && data.hasOwnProperty(vv.prop)) {
              if (vv.hasOwnProperty("isMoney") && vv.isMoney) {
                vv.data = utils.outputmoney(data[vv.prop]);
              } else {
                vv.data = data[vv.prop];
              }
            }
          }
        }
      }
    }
  }
};
</script>
<style lang="scss">
.title {
  text-align: center;
  font-size: 18px;
  line-height: 40px;
  font-weight: 600;
}
.table-cont {
  height: auto;
  border-left: 1px solid #ccc;
  border-top: 1px solid #ccc;
}
.table-bottom {
  width: 700px;
  display: flex;
  margin-top: 10px;
  justify-content: space-around;
}
</style>
