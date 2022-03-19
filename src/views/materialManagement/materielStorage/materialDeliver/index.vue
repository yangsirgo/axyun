<template>
  <div class="wrapper">
    <div class="float-left main">
      <div class="main_wrap" >
        <flow-menu :patientCardType="patientCardType">
          <slot name="content">
            <l-main ref="main"  @search="search" :wareinfo="wareinfo" :recordStatusList="recordStatusList" :supplierList="supplierList"></l-main>
          </slot>
        </flow-menu>
      </div>
    </div>

    <div class="float-left left">
      <left ref="left" @selectIdChange="selectIdChange" @newAdd="newAdd" :recordStatusList="recordStatusList"
            :storageTypeList="storageTypeList" :storageNameList="storageNameList"  :supplierList="supplierList"></left>
    </div>
  </div>
</template>

<script>
import FlowMenu from "@/components/FlowMenu";
import left from "./left.vue";
import lMain from "./warehousing.vue";
//import stockPurchaseAPI from "@/api/drugStorage/stock/purchase";
import hmmBaseApi from "@/api/hmm/base";
import localForage from "localforage";
import {deltaImportGoodsQuery} from "../../../../api/admin/role";

export default {
  components: {
    FlowMenu,
    left,
    lMain
  },
  props: {
    // 患者卡片类型
    patientCardType: {
      type: String
    },


  },
  data() {
    return {
      wareinfo: {},
      // boxs: ["historyWarehousing", "Hotkey"], //工具箱
      boxs:[],
      defaultBoxName: "",
      supplierList: [], //供应商数据源
      recordStatusList: [{
        name: "全部",
        code: ""
      },{
        name: "未提交",
        code: "0"
      },
        {
          name: "已提交",
          code: "1"
        }
      ], // 筛选 单据状态列表
      storageTypeList: [{
        name: "全部",
        code: ""
      },

        {
          name: "科室领用",
          code: "21"
        },
        {
          name: "机构间调拨入库",
          code: "22"
        },
        {
          name: "盘亏出库",
          code: "23"
        },
        {
          name: "其他出库",
          code: "24"
        }
      ],
      storageNameList: [],//入库类型数据源
    };
  },
  watch: {

  },
  created() {
    this.getSupplierList();
    window.sessionStorage.setItem("findStyle",false);
    let param = {}
    param.deptId = JSON.parse(window.localStorage.getItem('role')).deptId
    param.deptName = JSON.parse(window.localStorage.getItem('role')).deptName
    this.storageNameList.push(param)
  },
  methods: {
    async GetDrugData() {
      try {
        // drugUpdateTime
        const drugUpdateTime = await localForage.getItem("goodsUpdateTime");
        // let cloneUpdateTime = this.dayjs("2021-08-11")
        //   .clone()
        //   .valueOf();
        // let now = this.dayjs("2021-08-16").valueOf();
        // console.log(`cloneUpdateTime`, cloneUpdateTime);
        // console.log(`now`, now);
        // if (cloneUpdateTime < now) {
        //   console.log(`111111111`, 111111111);
        //   drugUpdateTime = null;
        //   // localForage
        //   //   .removeItem("drugUpdateTime")
        //   //   .then(function() {
        //   //     // 当值被移除后，此处代码运行
        //   //     console.log("drugUpdateTime is cleared!");
        //   //   })
        //   //   .catch(function(err) {
        //   //     // 当出错时，此处代码运行
        //   //     console.log("drugUpdateTime", err);
        //   //   });
        //   // localForage
        //   //   .removeItem("AllDrugData")
        //   //   .then(function() {
        //   //     // 当值被移除后，此处代码运行
        //   //     console.log("AllDrugData is cleared!");
        //   //   })
        //   //   .catch(function(err) {
        //   //     // 当出错时，此处代码运行
        //   //     console.log("AllDrugData", err);
        //   //   });
        // }

        let tempUpdateTime = "";
        if (drugUpdateTime === null) {
          tempUpdateTime = "";
        } else {
          tempUpdateTime = drugUpdateTime;
        }
        console.log(`tempUpdateTime`, tempUpdateTime);
        const res = await deltaImportGoodsQuery({ updateTime: "" });

        if (tempUpdateTime === "") {
          console.log(`GetGoodsData 新增--------`, res.data);
          this.setLocalForage("AllGoodsData", res.data);
        } else {
          console.log(`GetGoodsData 更新--------`, res.data);
          if (res.data === undefined) {
            return;
          }
          const AllDrugData = await localForage.getItem("AllGoodsData");
          const a = this.updateLogicReuse(res.data, AllGoodsData, "goodsCode");
          this.setLocalForage("AllGoodsData", a);
        }
        this.setLocalForage(
          "goodsUpdateTime",
          this.dayjs(new Date()).format("YYYY-MM-DD")
        );
      } catch (err) {
        console.log("GetGoodsData失败", err);
        console.log(err);
      }
    },
    /*  toolBoxMessage(data) {
      this.$emit("message", data);
    }, */
    selectIdChange(wareinfo_left) {
      this.wareinfo = wareinfo_left;
    },
    newAdd() {
      this.wareinfo = {};
      this.$refs.main.newAdd();
    },
    search() {
      this.$refs.left.search();
    },
    //获取供货商数据
    getSupplierList() {
      hmmBaseApi
        .getSupplier()
        .then(res => {
          if (res.code == 1) {
            this.supplierList = res.data;
          } else {
            this.$message.error(res.msg || "获取供应商数据失败");
          }
          if (res.data.length == 0) {
            this.$message.error("暂无供应商数据");
          }
        })
        .catch(res => {
          this.$message.error(res.msg || "获取供应商数据失败");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.patient-card-container {
  margin-bottom: 20px;
  height: 66px;
  width: 100%;
}

.wrapper {
  padding: 0;
  height: 100%;
  overflow: hidden;

  .main {
    width: 100%;
    height: 100%;

    .main_wrap {
      margin: 0 0 0 350px;
      height: 100%;
    }
  }

  .left {
    width: 340px;
    height: 100%;
    margin-left: -100%;
  }

  .right {
    width: 287px;
    height: 100%;
    margin-left: -287px;
  }
}
</style>
