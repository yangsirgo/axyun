<template>
  <div class="height100">
    <el-table
      :data="tableData"
      border
      v-loading="tableLoading"
      height="100%"
    >
      <!-- 业务列 -->
      <el-table-column
        v-for="(item,index) in tableParams"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :min-width="item.width"
        header-align="center"
        :align="item.align || 'left'"
        :fixed="item.fixed"
      >
        <template slot-scope="scope">
          <!-- 可自定义内容 -->
          <template v-if="item.prop == 'price'">
            <span>{{ scope.row[item.prop] | rounding }}</span>
          </template>
          <template v-else-if="
            item.prop==='amt'">
            <span>{{ scope.row[item.prop] | roundingTwo }}</span>
          </template>
          <template v-else-if="
            item.prop==='execDeptName'">
            <span
              tableName="
            sys_org"
              :conditionMap="{
                  org_type: '_DEPT_',
                  id: scope.row.receiveDept || ''
                }"
              columns="org_nm"
              v-tableTransform
            >--</span>
          </template>
          <template v-else>
            <span>{{ scope.row[item.prop]}}</span>
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { getOrder, pageAttachOrder } from "@/api/cis/order/order";
export default {
  name: "additionalOrder",
  components: {},
  data() {
    return {
      tableLoading: false,
      tableData: [],
      tableParams: [
        {
          prop: "orderItemName",
          label: "医嘱名称"
        },
        {
          prop: "price",
          label: "单价(元)"
        },
        {
          prop: "quantity",
          label: "数量"
        },
        {
          prop: "amt",
          label: "总金额(元)"
        },
        {
          prop: "execDeptName",
          label: "执行科室"
        }
      ]
    };
  },
  created() {},
  watch: {
    receivePatientData: {
      immediate: true,
      deep: true,
      handler(val) {
        this.getList(false);
      }
    },
    additionalOrderLoadKey() {
      this.getList(false);
    }
  },
  computed: {
    ...mapGetters("base", ["receivePatientData", "additionalOrderLoadKey"]),
    ...mapGetters("cis", ["additionalOrderLoadKey"])
  },
  mounted() {
    this.getList(false);
  },
  filters: {
    rounding(value) {
      value = value !== "" ? new Number(value) : 0;
      return value.rewToFixed(4);
    },
    roundingTwo(value) {
      value = value !== "" ? new Number(value) : 0;
      return value.rewToFixed(2);
    }
  },
  methods: {
    getList(flag) {
      console.log("getList 执行了");
      let visitCode =
        typeof this.$store.state.base.receivePatientData["visitCode"] !==
        "undefined"
          ? this.$store.state.base.receivePatientData["visitCode"]
          : "all"; //获取患者就诊ID
      let data = {
        ...{
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          visitCode: visitCode,
          types: "0" //医嘱类别   如果有多个类别，用“,”拼接。
        }
      };
      this.tableLoading = true;
      pageAttachOrder(data, flag).then(res => {
        if (res.code === 1) {
          let { data } = res;
          // console.log(data, "返回的表格数据");
          let tableData = [];
          for (let i = 0; i < data.length; i++) {
            let item = data[i];
            tableData.push({
              visitCode: item.visitCode || "",
              orderItemId: item.orderItemId || "",
              category: item.category || "",
              medicalInsuranceCat: item.medicalInsuranceCat || "",
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
              relation: item.relation || undefined,
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
              packQuantity: item.packQuantity || "",
              skinTest: item.skinTest || "",
              amt: item.amt || "",
              day: item.day || "",
              useDay: item.useDay || "",
              remark: item.remark || "",
              orderItemName: item.orderItemName || "",
              id: item.id,
              manageType: item.manageType,
              formCode: item.formCode,
              dropRate: item.dropRate || "",
              administrationTimeCode: item.administrationTimeCode || "",
              excessReason: item.excessReason || "",
              diagnosisTime: item.diagnosisTime,
              isMajor: item.isMajor,
              groupNo: item.groupNo,
              no: item.no,
              execDeptId: item.receiveDept,
              execDeptName: item.receiveDeptName,
              receiveDept: item.receiveDept,
              orderStatus: item.orderStatus || "",
              chargeStatus: item.chargeStatus || "",
              dataVersion: item.dataVersion || 0,
              rDataVersion: item.rDataVersion || 0
            });
          }

          // 初始化处方状态
          this.tableData = [];
          this.tableData = tableData;

          this.currentPage = res.pageNo;
          this.pageSize = res.pageSize;
          this.total = res.total;
        } else {
          this.$message.error(res.msg ? res.msg : "获取数据失败");
        }
        this.tableLoading = false;
      });
    }
  }
};
</script>

<style scoped lang="scss">
</style>
