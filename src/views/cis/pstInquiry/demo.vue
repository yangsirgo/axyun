<template>
  <div class="invoice-list height100">
    <!-- 表头的值,自己单独写的 -->
    <ul class="invoice-header">
      <li
        :style="styleCls(item)"
        class="invoice-item"
        v-for="(item, index) in tableParams"
        :key="index"
      >{{ item.label }}</li>
    </ul>
    <el-tree
      class="main-tree"
      :props="props"
      :data="nTableData"
      default-expand-all
      ref="treeData"
    >
      <!-- 使用自定义,需要加slot-scope,返回两个值,node是当前节点指定的对象
        data是当前节点的数据 -->
      <div
        class="custom-tree-node"
        slot-scope="{ node, data }"
      >
        <div
          class="total_info_box clearfix"
          v-if="data.isParentNode"
        >
          <span>{{data.recipeCode}}</span>
          <!-- 210702100，西药/慢病处方，52.90元    ||    患者A，男，29岁    ||  张医生，全科门诊     -->
          <!-- c {{ data.recipeCat }} -->
          <span
            columns="doctors_advice_name"
            :conditionMap="{ doctors_advice_code: data.recipeCat }"
            tableName="cnf_doctors_advice"
            v-tableTransform
          ></span>
          <span v-if="data.diseaseType">
            <!-- <span>/</span> -->
            <span v-if="data.diseaseType == '0'">普通门诊</span>
            <span v-else-if="data.diseaseType == '1'">慢病</span>
            <span v-else-if="data.diseaseType == '2'">特病</span>
          </span>
          <span> {{data.patientName}} </span>
          <span
            :val="data.patientGender"
            code="GENDER_CODE"
            v-codeTransform
          ></span>
          <span> {{data.patientAge}} </span>
          <span> {{data.doctorName}}</span>
          <span> {{data.ouptDeptName}}</span>
        </div>
        <span
          v-else
          class="table_info_node"
        >
          <span
            :style="styleCls(item)"
            class="table_info_item ellipsis"
            v-for="(item, index) in tableParams"
            :key="index"
          >
            <tempalte v-if="item.prop == 'useWay'">
              <!-- 西药 -->
              <span
                v-if="data['orderCat'] == 10"
                :val="data[item.prop]"
                code="MedicationRouteCode"
                v-codeTransform
              ></span>
              <!-- 中草药 -->
              <span
                v-else-if="data['orderCat'] == 11"
                :val="data[item.prop]"
                code="fryingRemark"
                v-codeTransform
              ></span>
            </tempalte>
            <template v-else-if="item.prop == 'chargeStatus'">
              <span
                :val="data[item.prop]"
                code="ChargeStatus"
                v-codeTransform
              ></span>
            </template>
            <!-- 单次剂量 -->
            <template v-else-if="item.prop == 'onceDosage'">
              {{ data[item.prop] }}
              <span v-if="isNaN(data['dosageUnit']) || data['dosageUnit'] == ''">{{ data['dosageUnit'] }}</span>
              <span
                v-else
                :val="data['dosageUnit']"
                code="DrugDoseUnit"
                v-codeTransform
              ></span>
            </template>
            <!-- 数量 -->
            <template v-else-if="item.prop == 'quantity'">
              {{ data[item.prop] }}
              <span
                v-if="!isNaN(data['unit'])"
                :val="data['unit']"
                code="DrugUnit"
                v-codeTransform
               ></span>
               <span v-else> {{ data['unit'] }} </span>
            </template>
            <!-- 其他 -->
            <template v-else>
              <span :title="data[item.prop]">
                {{ data[item.prop] }}
              </span>
            </template>
          </span>
        </span>
      </div>
    </el-tree>
    <div class="totalShowCls">
      总金额：{{ totalObj.amt }}元 单据：{{ totalObj.billNum }}张  服务：{{ totalObj.patientNum }}人次
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: ["tableData", "totalObj"],
  data() {
    return {
      props: {
        label: "recipeCode", // 需要指定的节点渲染对象属性
        children: "adviceList" // 指定的子级
      },
      nTableData: [],
      tableParams: [
        {
          prop: "noShow",
          label: "序号",
          width: 56
        },
        {
          prop: "diagnosisTime",
          label: "开单日期",
          width: 150
        },
        {
          prop: "orderItemName",
          label: "项目名称",
          width: 300
        },
        {
          prop: "spec",
          label: "规格"
        },
        {
          prop: "onceDosage",
          label: "用量",
          width: 120
        },
        {
          prop: "useWay",
          label: "用法"
        },
        {
          prop: "frequencyCode",
          label: "频次"
        },
        {
          prop: "useDay",
          label: "天数",
          width: 50
        },
        {
          prop: "quantity",
          label: "数量",
          width: 110
        },
        {
          prop: "amt",
          label: "金额",
          width: 70
        },
        {
          prop: "chargeStatus",
          label: "收费状态"
        }
      ]
    };
  },
  mounted() {},
  components: {},
  // 方法集合
  methods: {
    styleCls(item) {
      let { width } = item;
      return width ? "flex: 0 0" + width + "px" : "";
    }
  },
  watch: {
    tableData: {
      deep: true,
      immediate: true,
      handler(n, o){
        if (Array.isArray(n)) {
          for (let index = 0; index < n.length; index++) {
            const { adviceList = [] } = n[index];
            // 父节点 标识
            n[index]["isParentNode"] = true;
            adviceList.forEach((adviceItem, adviceIndex) => {
              adviceItem["noShow"] = adviceIndex + 1;
            });
          }
          this.nTableData = n;
        }
        
      }
    }
  }
};
</script>

<style scoped lang="scss">
.invoice-list {
  border: 1px solid #ebeef5;
  // margin-top: 10px;
  display: flex;
  flex-direction: column;
  .invoice-header {
    // background-color: #f8f8f9;
    background-color: #808fb5;

    display: flex;
    // padding-left: 63px;
    // border-bottom: 1px solid #ebeef5;
    // border: 1px solid #ebeef5;
    border: 1px solid grey;
    .invoice-item {
      padding: 10px;
      padding-right: 0;
      flex: 1;
      border-left: 1px solid #ebeef5;
      // padding-left: 10px;
      font-size: 14px;
      color: #fff;
      text-align: center;
    }
  }
  .main-tree {
    flex: 1;
    min-height: 0;
    overflow: auto;
  }
  .totalShowCls {
    text-align: center;
    line-height: 30px;
    font-weight: bolder;
    background-color: #fff;
  }
  //父节点高度设置
  /deep/.el-tree-node > .el-tree-node__content {
    // background: #f2f2f2;
    // height: 40px;
    height: 40px;
    padding-left: 0 !important;
  }
  // 子节点 高度设置
  /deep/.el-tree-node__children > .el-tree-node > .el-tree-node__content {
    height: 26px !important;
    // 子节点的 expand icon 设置
    > .el-tree-node__expand-icon {
      display: none;
    }
  }
  //   .el-tree-node__children {
  //     .el-tree-node__content {
  //       background: #fff;
  //       border-bottom: 1px solid #ebeef5;
  //     }
  //   }
  .custom-tree-node {
    width: 100%;
    height: 100%;
    .total_info_box {
      background: #f2f2f2;
      height: 100%;
      display: flex;
      align-items: center;
      //   line-height: 40px;
      span {
        float: left;
        font-size: 16px;
        margin: 0 15px;
        i {
          display: inline-block;
          margin-right: 3px;
          font-style: normal !important;
        }
      }
    }
    .table_info_node {
      display: flex;
      height: 100%;
      .table_info_item {
        flex: 1;
        flex-wrap: nowrap;
        height: 100%;
        border: 0.5px solid #ebeef5;
        padding-left: 10px;
        align-items: center;
        display: flex;
        // line-height: 40px;
      }
    }
  }
}

.ellipsis {
  overflow:hidden; //超出的文本隐藏
  text-overflow:ellipsis; //溢出用省略号显示
  white-space:nowrap; //溢出不换行
}
</style>
