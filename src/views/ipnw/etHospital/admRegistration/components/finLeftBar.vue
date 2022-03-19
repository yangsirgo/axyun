<template>
  <div class="height100">
    <!-- <leftTabs
      @tabs-change="handleClick"
      @read-card="readCard"
      @query="search"
      v-model="formValue"
      :searchPlaceholder="'卡号/姓名'"
      :form-list="formParams"
      :readcard-state="true"
    >
      <template #firstBottom>
        <el-table
          :data="tableData"
          width="100%"
          height="100%"
          stripe
          border
          v-loading="loading"
          :element-loading-text="$t('retreat.loadInfo')"
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
                <span v-if="scope.row['patientGender'] == '1'" class="man">{{ scope.row[item.prop] }}</span>
                <span v-if="scope.row['patientGender'] == '2'" class="woman">{{ scope.row[item.prop] }}</span>
              </template>
              <template v-else-if="item.prop == 'operate'">
                <el-button type="text" @click="rowClick">登记</el-button>
              </template>
              <template v-else>
                <span class="overflow-point">{{ scope.row[item.prop] }}</span>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </leftTabs>-->
    <LSideList @sideEvent="sideEvent">
      <template #formList>
        <div class="margin-bottom-6">
          <l-value-domain
            clearable
            :remoteUrl="'/wadmin/ward-dept?deptId=' + role.deptId"
            type="select"
            :value.sync="formValue.illnessArea"
            remoteShowKey="wardName"
            remoteValueKey="wardCode"
            placeholder="请选择病区"
            @change="search"
          ></l-value-domain>
        </div>
        <div class="margin-bottom-6">
          <el-input
            @keyup.native.enter="sideEvent('query')"
            v-model="formValue.search"
            placeholder="卡号/姓名"
            style="width: 100%"
          >
            <i
              slot="suffix"
              class="el-input__icon el-icon-search"
              @click="sideEvent('query')"
            ></i>
          </el-input>
        </div>
      </template>
      <template #mainCont>
        <l-table
          :paginationSmall="true"
          :total="pageParams.total"
          :pageSize.sync="pageParams.pageSize"
          :page.sync="pageParams.pageNo"
          layout="pager"
          :pagerCount="5"
          paginationAlign="center"
          :singlePageShow="true"
          @changeSize="changeSize"
          :showTotal="true"
        >
          <el-table
            :data="tableData"
            ref="multipleTable"
            width="100%"
            height="100%"
            stripe
            border
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
                  <span
                    v-if="scope.row['patientGender'] == '2'"
                    class="woman"
                    >{{ scope.row[item.prop] }}</span
                  >
                </template>
                <template v-else-if="item.prop == 'operate'">
                  <el-button type="text" @click="rowClick">登记</el-button>
                </template>
                <template v-else>
                  <span class="overflow-point">{{ scope.row[item.prop] }}</span>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </l-table>
      </template>
    </LSideList>
  </div>
</template>

<script>
import leftTabs from "@/components/LSideTabsDoctor.vue";
import { mapGetters, mapActions } from "vuex";
import { getWardByDept } from "@/api/ipnw/leaveHos";
import appointment from "@/api/appointment/appointment";
import { getAdviceMesList } from "@/api/ipnw/etHospital";
import LSideList from "@/views/components/LSideList";

export default {
  components: {
    // leftTabs,
    LSideList
  },
  props: {},
  provide() {
    return {
      getIsCreatRecordBtn: () => 0 // 是否建档按钮:1为有;0为无
    };
  },
  data() {
    return {
      formParams: [
        // "technicalOffices",
        "illnessArea",
        "search"
      ],
      // 表格
      tableParams: [
        {
          prop: "patientName",
          label: "姓名",
          align: "left",
          headerAlign: "center",
          width: "120"
        },
        {
          prop: "patientAge",
          label: "年龄",
          align: "left",
          headerAlign: "center",
          width: "70"
        },
        {
          prop: "operate",
          label: "操作",
          align: "left",
          headerAlign: "center",
          width: "80"
        }
      ],
      tableData: [],
      // loading
      loading: false,
      // 分页in
      pageParams: {
        pageNo: 0,
        pageSize: 20,
        total: 0
      },
      // 选择的病区
      // illnessArea: "",
      patientName: "",
      patientId: "",
      // 选中的值
      formValue: {}
    };
  },
  computed: {
    ...mapGetters(["illnessArea"]),
    ...mapGetters("user", ["role"])
    // tlm_noMore() {
    //   return (
    //     Math.ceil(this.pageParams.total / this.pageParams.pageSize) <=
    //     this.pageParams.pageNo
    //   );
    // }
  },
  watch: {
    // illnessArea: {
    //   handler(val) {
    //     console.log('2222222222222222222',val);
    //     if (val) {
    //       this.search({illnessArea: val});
    //     }
    //   },
    //   immediate: true,
    //   deep: true
    // }
  },
  mounted() {
    // this.search({illnessArea: this.illnessArea});
    this.getApplyPatientlist();
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "base/changeRecPatientData",
      // 保存病区
      changeIllnessArea: "ipnw/changeIllnessArea"
    }),
    //子组件抛出的方法
    sideEvent(sideEvent) {
      let obj = {
        query: "search",
        readCard: "readCard"
      };
      this[obj[sideEvent]]();
    },
    search() {
      this.patientName = this.formValue.search;
      this.patientId = null;
      this.getApplyPatientlist();
    },
    handleClick() {},
    async readCard(val) {
      if (!val.search) {
        this.$message.error("卡号不能为空");
        return;
      }
      try {
        this.$showLoading();
        let res = await appointment.getCardDetailInfo({
          cardNum: val.search || ""
        });
        if (!res.data) {
          this.$message("未查询到患者");
          this.tableData = [];
        } else {
          this.patientId = res.data.patientId;
          this.patientName = null;
          this.getApplyPatientlist();
        }
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "卡号不能为空");
      }
    },
    // 查询所有病区 返回第一个
    async selectIllnessArea() {
      let res = await getWardByDept({
        deptId: this.role.deptId
      });
      this.formValue.illnessArea = res.data[0].wardCode;
      this.changeIllnessArea(res.data[0].wardCode);
      this.search(this.formValue);
    },
    // 获取入院申请列表
    async getApplyPatientlist() {
      this.tableData = [];
      try {
        this.loading = true;
        let obj = {
          patientId: this.patientId || "",
          patientName: this.patientName || "",
          billStatus: "1", // 已申请
          admWard: this.formValue.illnessArea || undefined, // 病区
          pageNo: this.pageParams.pageNo,
          pageSize: this.pageParams.pageSize
        };
        let res = await getAdviceMesList(obj);
        this.tableData = res.data;
        if (this.tableData.length <= 0) {
          this.$message("暂无入院申请");
        }
        this.pageParams.total = res.total;
        // 默认选择第一个
        this.changeRecPatientData(this.tableData[0]);
        this.$refs.multipleTable.setCurrentRow(this.tableData[0]);
      } catch (error) {
        thois.$message.error(error.msg || "获取入院申请患者列表失败");
      } finally {
        this.loading = false;
      }
    },
    changeSize(val) {
      this.pageParams.pageNo = val.page;
      this.pageParams.pageSize = val.pageSize;
      this.search();
    },
    // load
    // load() {
    //   if (this.tlm_noMore) {
    //     return;
    //   }
    //   this.pageParams.pageNo++;
    //   this.search();
    // },
    rowClick(row) {
      this.changeRecPatientData(row); // 选择患者存储到 vuex
    }
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
.margin-bottom-6 {
  margin-bottom: 6px;
}
</style>
