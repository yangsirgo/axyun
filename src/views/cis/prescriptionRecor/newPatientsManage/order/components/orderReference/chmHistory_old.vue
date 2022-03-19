<template>
  <el-card class="height100 padding8">
    <l-card-title>
      <template slot="left">历史医嘱</template>
    </l-card-title>
    <div
      style="height: calc(100% - 24px)"
      class="main"
    >
      <el-form
        ref="form"
        :model="form"
        class="main-form margin-top-8 margin-bottom-8"
      >
        <!--<el-form-item label="医嘱类别">-->
        <!--<el-select  v-model="form.checkedCat" @change="handleCheckedCatChange" placeholder="请选择医嘱类别">-->
        <!--<el-option-->
        <!--label="药品医嘱"-->
        <!--value="1">-->
        <!--</el-option>-->
        <!--<el-option-->
        <!--label="全部"-->
        <!--value="2">-->
        <!--</el-option>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="开嘱医生">-->
        <!--<el-select v-model="form.doctor" clearable placeholder="请选择开嘱医生">-->
        <!--<el-option-->
        <!--label="本人"-->
        <!--value="1">-->
        <!--</el-option>-->
        <!--<el-option-->
        <!--label="本科"-->
        <!--value="2">-->
        <!--</el-option>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item label="">
          <el-row :gutter="5">
            <el-col :span="18">
              <l-formt-title label="医嘱名称">
                <el-input v-model="form.name"></el-input>
              </l-formt-title>
            </el-col>
            <el-col :span="6">
              <el-button
                size="mini"
                @click="onSubmit"
              >查询</el-button>
              <el-button
                type="primary"
                size="mini"
                @click="copyHandler"
              >引用</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div
        class="main-table"
        v-loading="loading"
      >
        <el-table
          @row-click="rowClick"
          :data="tableData"
          border
          v-loading="tableLoading"
          @selection-change="handleSelectionChange"
          height="100%"
        >
          <!-- 需要列 -->
          <el-table-column
            type="selection"
            :selectable='isCheckboxDisabled'
            width="32"
            header-align="center"
            align="center"
          ></el-table-column>
          <!-- 业务列 -->
          <el-table-column
            v-for="(item,index) in tableParams"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            header-align="center"
            :align="item.align || 'center'"
            :fixed="item.fixed"
          >
            <template slot-scope="scope">
              <template v-if="item.prop === 'dosageUnit'">
                <span
                  :val="scope.row.dosageUnit"
                  code="DrugDoseUnit"
                  v-codeTransform
                ></span>
              </template>
              <template v-else-if="item.prop === 'frequencyCode'">
                <span
                  columns="FREQUENCY_NAME"
                  :conditionMap="{FREQUENCY_CODE: scope.row.frequencyCode}"
                  tableName="hrp_frequency"
                  v-tableTransform
                ></span>
              </template>
              <template v-else-if="item.prop === 'useWay'">
                <span
                  :val="scope.row.useWay"
                  code="fryingRemark"
                  v-codeTransform
                ></span>
              </template>
              <template v-else-if="item.prop === 'unit'">
                <span
                  :val="scope.row.unit"
                  code="DrugUnit"
                  v-codeTransform
                ></span>
              </template>
              <template v-else>
                <!-- 可自定义内容 -->
                <span>{{ scope.row[item.prop] || '--'}}</span>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        v-if="currentPage !== 1"
        :total="totalPage"
      >
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
import { getOrdersByVisit } from "@/api/systemManagement/dataMaintain/adviceItem";
import { getRecipeCode, saveOrders } from "@/api/cis/order/order";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "history",
  components: {},
  data() {
    return {
      tableLoading: false,
      form: {
        checkedCat: "1",
        doctor: "",
        name: ""
      },
      multipleSelection: [],
      tableData: [],
      tableParams: [
        {
          prop: "oderItemName",
          label: "中草药名称",
          width: 120
        },
        {
          prop: "quantity",
          label: "数量"
        },
        {
          prop: "price",
          label: "单价"
        },
        {
          prop: "unit",
          label: "单位"
        },
        {
          prop: "frequencyCode",
          label: "用药频次"
        },
        {
          prop: "spec",
          label: "规格"
        },
        {
          prop: "frequencyCode",
          label: "频率"
        },
        {
          prop: "useWay",
          label: "煎服法"
        }
      ],
      parentRow: {},
      pageSize: 10,
      totalPage: 50,
      currentPage: 1,
      loading: false
    };
  },
  created() {},
  mounted() {},
  methods: {
    isCheckboxDisabled(row) {
      if (row.isDisabled) {
        return false;
      }
      return true;
    },
    //后台接收数据后，转化成前台需要的数据类型
    convertData(data) {
      if (!data) return [];
      let listData = [];
      let codeData = [];
      let timeData = [];
      // 数据处理
      // for (let i in data) {
      //   if (codeData.indexOf(data[i].recipeCode) === -1) {
      //     codeData.push(data[i].recipeCode);
      //   }
      // }
      // for (let s in codeData) {
      let recipeData = [];
      for (let i = 0; i < data.length; i++) {
        // if (data[i].recipeCode === codeData[s]) {
        recipeData.push({
          recipeId: data[i].recipeId,
          diagnosisTime: data[i].diagnosisTime || "",
          useWay: data[i].useWay || "", //用法
          quantity: data[i].quantity || "", //数量
          frequencyCode: data[i].frequencyCode || "", //频率
          onceDosage: data[i].onceDosage || "", //单次计量
          skinTest: data[i].skinTest || "", //皮试
          skinTestType: data[i].skinTestType || "", //皮试
          dropRate: data[i].dropRate || "", //滴速
          administrationTimeCode: data[i].administrationTimeCode || "", // 给药时间
          oderItemName: data[i].oderItemName || "",
          spec: data[i].spec || "",
          orderCat: data[i].orderCat || "",
          price: data[i].price || "",
          dosage: data[i].dosage || "",
          packQuantity: data[i].packQuantity || "",
          dosageUnit: data[i].dosageUnit || "",
          orderItemId: data[i].orderItemId || "",
          orderItemCat: data[i].orderItemCat || "",
          classCode: data[i].classCode || "",
          receiveDept: data[i].receiveDept || "",
          manageType: data[i].manageType || "",
          formCode: data[i].formCode || "",
          unitSaleFlg: data[i].unitSaleFlg || "",
          // unit: data[i].unit || "",
          unitFlag: data[i].unitFlag || "",
          unit: data[i].unit || "",
          day: data[i].day || "",
          stClassCode: data[i].stClassCode || "",
          amt: data[i].amt || "",
          remark: data[i].remark || "",
          excessReason: data[i].excessReason || "",
          execDeptId: data[i].execDeptId || "",
          frequencyTimes: data[i].frequencyTimes || "",
          frequencyUnit: data[i].frequencyUnit || "",
          useDay: data[i].useDay || "",
          execDeptName: data[i].execDeptName || ""
        });
        // }
      }
      // timeData.push(recipeData);
      // }

      // for (let i = 0; i < timeData.length; i++) {
      //   listData.push({
      //     title: timeData[i][0].diagnosisTime,
      //     tableData: timeData[i]
      //   });
      // }
      return recipeData;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    reloadTableData(row) {
      this.resetField();
      this.parentRow = row;
      this.getAdviceItemFun();
    },
    handleCheckedCatChange(value) {
      console.log(value);
    },
    onSubmit() {
      if (this.parentRow.visitCode) {
        this.getAdviceItemFun();
      } else {
        this.$message.error("请选择一名患者！");
      }
    },

    async copyHandler() {
      if (this.multipleSelection.length === 0) {
        this.$message.error("请选择一项！");
        return;
      }

      this.$emit("copy", this.multipleSelection);
    },
    rowClick(row) {},
    handleCurrentChange(val) {
      this.search();
    },
    getParams() {
      let obj = {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        visitCode: this.parentRow.visitCode || "",
        // itemType:this.form.checkedCat === '1' ? this.form.checkedCat : ""
        itemType: 11
      };
      return { ...obj, ...this.form };
    },
    search() {
      this.getAdviceItemFun(this.getParams());
    },
    handleSizeChange(val) {
      this.search();
    },
    resetField() {
      this.$nextTick(() => {
        this.$refs.form.resetFields();
        this.form.name = "";
      });
    },
    //相同药品 除去第一个以外，禁用其他项
    setSomeDrugsTargetFunc(list = []) {
      let resultList = this.organizingData(list);
      // console.log(resultList);
      resultList.forEach(item => {
        item.value.forEach((sItem, sIndex) => {
          if (sIndex != 0) {
            sItem.isDisabled = true;
          } else {
            sItem.isDisabled = false;
          }
        });
      });
    },
    organizingData(list = []) {
      var olist = [];
      var filterList = [];
      let orderItemIdList = this.getOrderItemIdList(list);
      // console.log(orderItemIdList);
      orderItemIdList.forEach((item, index) => {
        //遍历 成map结构
        filterList = list.filter((sonItem, sonIde) => {
          return item === sonItem.orderItemId;
        });
        olist.push({
          key: item,
          value: filterList
        });
      });
      return olist;
    },
    // 获取药品的id的列表 并去重
    getOrderItemIdList(list = []) {
      let idList = list.map(item => {
        return item.orderItemId;
      });
      idList = Array.from(new Set(idList));
      return idList;
    },
    getAdviceItemFun() {
      let obj = this.getParams();
      this.tableLoading = true;
      getOrdersByVisit(obj).then(res => {
        if (res.code === 1) {
          let list = [];
          console.log(res.data);
          // res.data.forEach((item)=>{
          //   if (Array.isArray(item)) {
          //     item.forEach((sonItem)=>{
          //       list.push(sonItem);
          //     })
          //   }
          // });
          // this.tableData = this.convertData(list);
          // console.log(list);
          this.setSomeDrugsTargetFunc(res.data);
          this.tableData = res.data;
        } else {
          this.$message("查询失败");
        }
        this.tableLoading = false;
      });
    }
  },
  watch: {},
  computed: {
    ...mapGetters("base", ["receivePatientData"])
  }
};
</script>

<style scoped lang="scss">
.main {
  display: flex;
  flex-direction: column;
}
.main-table {
  flex: 1;
}
</style>
