<template>
  <div class="height100" style="margin: 0 20px;">
    <el-table
      element-loading-text="加载中..."
      stripe
      border
      height="100%"
      :data="retreatList"
      @row-click="getRetreatInfo"
      highlight-current-row
      v-loading="tlm_isLoading"
      v-loadmore="loadNextPage"
    >
      <el-table-column
        v-for="(item, index) in retreatParams"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :min-width="item.width"
        :align="item.align || 'left'"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <template v-if="item.prop === 'ouptDeptId'">
            <span
              tableName="sys_org"
              :conditionMap="{
                org_type: '_DEPT_',
                id: scope.row['ouptDeptId']
              }"
              columns="org_nm"
              v-tableTransform
            ></span>
          </template>
          <template v-else>
            <span class="overflow-point">{{ scope.row[item.prop] }}</span>
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import service from "@/api/appointment/retreat";
import { mapActions, mapGetters } from "vuex";
import appointmentService from "@/api/appointment/appointment";

// 重写date 格式化方法
Date.prototype.toLocaleString = function() {
  return (
    this.getFullYear() +
    "-" +
    (this.getMonth() + 1) +
    "-" +
    this.getDate() +
    " " +
    this.getHours() +
    ":" +
    this.getMinutes() +
    ":" +
    this.getSeconds() +
    ""
  );
};

export default {
  name: "patientInfo",
  data() {
    return {
      tlm_isLoading: false,
      // 账户余额
      balanceMoney: 0,
      retreatList: [],
      // 收费信息
      chargeInfo: {},
      // 患者信息
      patientInfo: {},
      // 就诊信息
      outpInfo: {},
      info: {},
      pageParams: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      // 待收费
      retreatParams: [
        {
          label: "姓名",
          prop: "patientName",
          width: "50",
          align: "left"
        },
        {
          label: "科室",
          prop: "ouptDeptId",
          width: "50",
          align: "left"
        },
        {
          label: "时间",
          prop: "appointmentTime",
          width: "50",
          align: "left"
        }
      ]
    };
  },
  components: {},
  mounted() {
    this.getRetreatList({});
  },
  computed: {
    tlm_noMore() {
      return (
        Math.ceil(this.pageParams.total / this.pageParams.pageSize) <=
        this.pageParams.pageNo
      );
    }
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "base/changeRecPatientData"
    }),
    loadNextPage() {
      if (this.tlm_noMore) {
        return;
      }
      this.pageParams.pageNo++;
      this.getRetreatList({}, true);
    },
    getRetreatList(queryData, isLoad = false,patientId) {
      this.tlm_isLoading = true;
      let data = {
        patientId:patientId || undefined,
        ...this.pageParams,
        name: queryData.search || "",
        ouptDeptId: queryData.technicalOffices || ""
      };
      if(data.patientId){
        data.name = undefined;
      }
      if (queryData && queryData.timeRange && queryData.timeRange.length > 1) {
        data.sDate = queryData.timeRange[0].toLocaleString();
        data.eDate = queryData.timeRange[1].toLocaleString();
      }
      service
        .getList(data)
        .then(res => {
          if (res.data && res.data.length > 0) {
            this.changeRecPatientData(res.data[0]);
          }else{
            this.changeRecPatientData(queryData); // 放入患者信息
          }
          if (isLoad) {
            this.retreatList.push(...res.data);
          } else {
            this.retreatList = res.data;
          }
          this.pageParams = res.pageParams;

          this.tlm_isLoading = false;
        })
        .catch(err => {
          this.tlm_isLoading = false;
          this.$message.error(err.msg || "标准错误提示");
        });
    },
    async readCard(val){
       try {
          if (val.search == "") {
            this.$message.warning("请输入卡号");
            return;
          }
          this.$showLoading();
          const { data } = await appointmentService.getCardDetailInfo({
            cardNum: val.search || ""
          });
          if(!data.patientId || data.patientId == null){
            this.$hideLoading();
            this.$message("未查询到患者");
            return;
          }
          await this.getRetreatList(
            {
              ...val,
              ...data
            },
            false,
            data.patientId
          )
          // this.changeRecPatientData(data)
          this.$hideLoading();
        } catch (error) {
          this.$message.error(error.msg);
          this.$hideLoading();
        }
    },
    // 拿到患者就诊信息 及待收费数据
    getRetreatInfo(item) {
      this.changeRecPatientData(item);
    }
  }
};
</script>

<style scoped lang="scss">
</style>
