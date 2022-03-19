<template>
  <el-card class="height100">
    <!-- <leftTabs
      @tabs-change="handleClick"
      @read-card="readCard"
      @query="search"
      v-model="formValue"
      :searchPlaceholder="'卡号/姓名'"
      :form-list="formParams"
      :readcard-state="false"
    >
    <template #firstBottom>-->
    <div class="form-list clearfix padding10">
      <!--  <l-card-title>
        <template slot="left">患者列表</template>
      </l-card-title>-->
      <!--病区-->
      <LFormtTitle label="病区" labelWidth="76">
        <l-value-domain
          clearable
          :remoteUrl="illnessAreaUrl"
          type="select"
          :value.sync="illnessArea"
          remoteShowKey="wardName"
          remoteValueKey="wardCode"
          :placeholder="'请选择病区'"
          @change="search"
        ></l-value-domain>
      </LFormtTitle>
      <el-input
        placeholder="请输入内容"
        v-model="inpValue"
        class="margin-top-6"
        clearable
      >
        <el-select
          v-model="select"
          slot="prepend"
          placeholder="请选择"
          style="width: 90px"
          @change="selectChange"
        >
          <el-option label="就诊卡" value="1"></el-option>
          <el-option label="住院号" value="2"></el-option>
          <el-option label="床位号" value="3"></el-option>
          <el-option label="姓名" value="4"></el-option>
        </el-select>
      </el-input>
      <el-button
        v-if="select == '1'"
        type="primary"
        class="width100"
        style="margin-top: 10px"
        @click="readCard"
      >
        <i class="iconfont iconduka"></i>读卡
      </el-button>
      <el-button
        v-if="select == '2' || select == '3' || select == '4'"
        type="primary"
        class="width100"
        style="margin-top: 10px"
        @click="search"
        >查询</el-button
      >
    </div>
    <div class="table-cont">
      <l-table
        :total="pageParams.total"
        :pageSize.sync="pageParams.pageSize"
        :page.sync="pageParams.pageNo"
        layout="pager"
        :pagerCount="5"
        paginationAlign="center"
        :singlePageShow="true"
        @changeSize="changeSize"
      >
        <el-table
          :data="tableData"
          width="100%"
          height="100%"
          border
          v-loading="loading"
          highlight-current-row
          @row-click="rowClick"
        >
          <el-table-column
            v-for="(item, index) in tableParams"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            :align="item.align || 'left'"
            :header-align="item.headerAlign || 'left'"
            :fixed="item.fixed"
          >
            <template slot-scope="scope">
              <template v-if="item.prop == 'patientName'">
                <span v-if="scope.row['patientGender'] == '1'" class="man">{{
                  scope.row[item.prop]
                }}</span>
                <span v-if="scope.row['patientGender'] == '2'" class="woman">{{
                  scope.row[item.prop]
                }}</span>
              </template>
              <template v-else>
                <span class="overflow-point">{{ scope.row[item.prop] }}</span>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </l-table>
    </div>
    <!--</leftTabs>-->
  </el-card>
</template>

<script>
// import leftTabs from "@/components/LSideTabsDoctor.vue";
import { mapGetters, mapActions } from "vuex";
import { getWardByDept, getInpPatientList } from "@/api/ipnw/leaveHos";
import appointment from "@/api/appointment/appointment";
export default {
  // components: {
  //   leftTabs
  // },
  props: {},
  data() {
    return {
      formParams: [
        // // "technicalOffices",
        // "illnessArea",
        // "search"
      ],
      // 表格
      tableParams: [
        {
          prop: "bedCode",
          label: "床号",
          align: "left",
          headerAlign: "center",
          width: "80"
        },
        {
          prop: "patientName",
          label: "姓名",
          align: "left",
          headerAlign: "center",
          width: "110"
        },
        {
          prop: "inpCode",
          label: "住院号",
          align: "left",
          headerAlign: "center",
          width: "100"
        }
      ],
      tableData: [],
      // loading
      loading: false,
      // 分页in
      pageParams: {
        pageNo: 1,
        pageSize: 15,
        total: 0
      },
      // 选择的病区
      illnessArea: "",
      patientName: "",
      patientId: "",
      bedCode: "",
      inpCode: "",
      // 选中的值
      formValue: {},
      // 查询方式
      select: "2",
      // 输入的值
      inpValue: ""
    };
  },
  computed: {
    ...mapGetters(["illnessArea"]),
    ...mapGetters("user", ["role"]),
    /* tlm_noMore() {
      return (
        Math.ceil(this.pageParams.total / this.pageParams.pageSize) <=
        this.pageParams.pageNo
      );
    }, */
    illnessAreaUrl() {
      let deptId = this.role.deptId;
      return "/wadmin/ward-dept?deptId=" + deptId;
    }
  },
  watch: {},
  created() {},
  updated() {},
  mounted() {
    this.getInpPatientlist();
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "base/changeRecPatientData",
      // 保存病区
      changeIllnessArea: "ipnw/changeIllnessArea"
    }),
    changeSize(val) {
      this.pageParams.pageNo = val.page;
      this.pageParams.pageSize = val.pageSize;
      this.getInpPatientlist();
    },
    search() {
      this.tableData = [];
      this.patientId = null;
      this.getInpPatientlist();
    },
    handleClick() {},
    // 读卡
    async readCard() {
      if (!this.inpValue) {
        this.$message.error("卡号不能为空");
        return;
      }
      try {
        this.$showLoading();
        let res = await appointment.getCardDetailInfo({
          cardNum: this.inpValue || ""
        });
        if (!res.data) {
          this.$message("未查询到患者");
          this.tableData = [];
        } else {
          this.patientId = res.data.patientId;
          this.patientName = null;
          this.getInpPatientlist();
        }
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "卡号不能为空");
      }
    },
    // // 查询所有病区 返回第一个
    // async selectIllnessArea() {
    //   let res = await getWardByDept({
    //     deptId: this.role.deptId
    //   });
    //   this.formValue.illnessArea = res.data[0].wardCode;
    //   this.changeIllnessArea(res.data[0].wardCode);
    //   this.search(this.formValue);
    // },
    // 获取住院患者列表
    async getInpPatientlist() {
      try {
        this.loading = true;
        let obj = {
          patientId: this.patientId || "",
          patientName: null || "",
          recordStatus: "3", // 预出院
          wdeptId: this.illnessArea || undefined, // 病区
          inpCode: null,
          bedCode: null,
          pageNo: this.pageParams.pageNo,
          pageSize: this.pageParams.pageSize
        };
        if (this.select == "2") {
          obj.inpCode = this.inpValue;
        } else if (this.select == "3") {
          obj.bedCode = this.inpValue;
        } else if (this.select == "4") {
          obj.patientName = this.inpValue;
        }
        let res = await getInpPatientList(obj);
        this.tableData = res.data;
        if (this.tableData.length <= 0) {
          this.$message("暂无可出院患者");
          this.changeRecPatientData({}); // 此处需要病区在院患者才可预出院（防止已结算出院出院的患者带过来）
        }
        this.pageParams.total = res.total;
        // 默认选择第一个
        this.changeRecPatientData(this.tableData[0]);
        this.loading = false;
      } catch (error) {
        console.info(error);
        this.loading = false;
        this.$message.error(error.msg || "获取住院患者列表失败");
      }
    },
    // load
    load() {
      if (this.tlm_noMore) {
        return;
      }
      this.pageParams.pageNo++;
      this.getInpPatientlist();
    },
    rowClick(row) {
      this.changeRecPatientData(row); // 选择患者存储到 vuex
    },
    // 选中查询条件
    selectChange(val) {}
  }
};
</script>
<style lang="scss" scoped>
.man {
  // patientGender = 1 男
  color: #2d97fd;
}
.woman {
  // patientGender = 2 女
  color: #fc8cbe;
}
.margin-top-6 {
  margin-top: 6px;
}
.table-cont {
  padding: 10px;
  height: calc(100% - 146px);
}
</style>
