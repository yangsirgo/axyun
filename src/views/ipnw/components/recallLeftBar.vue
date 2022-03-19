<template>
  <el-card class="recallLeftBar height100">
    <div class="form-list clearfix">
      <el-input
        placeholder="请输入内容"
        v-model="inpValue"
        class="input-with-select"
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
        v-if="select == '2' || select == '3'"
        type="primary"
        class="width100"
        style="margin-top: 10px"
        @click="search"
        >查询</el-button
      >
    </div>
    <div class="table-cont">
      <l-table
        :total="total"
        :pageSize.sync="pageSize"
        :page.sync="pageNo"
        layout="pager"
        :pagerCount="5"
        paginationAlign="center"
        :singlePageShow="true"
        @changeSize="changeSize"
      >
        <el-table
          :data="recordsData"
          ref="multipleTable"
          border
          width="100%"
          height="100%"
          v-loading="tlm_isLoading"
          highlight-current-row
          @row-click="rowClick"
        >
          <el-table-column
            v-for="(item, index) in recordsParams"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            :align="item.align || 'left'"
            :fixed="item.fixed"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <template v-if="item.prop === 'inpSdeptId'">
                <span
                  tableName="sys_org"
                  :conditionMap="{
                    org_type: '_DEPT_',
                    id: scope.row[item.prop],
                  }"
                  columns="org_nm"
                  v-tableTransform
                  >--</span
                >
              </template>
              <template v-else-if="item.prop === 'wardId'">
                <span
                  tableName="sys_ward"
                  :conditionMap="{ ward_code: scope.row[item.prop] }"
                  columns="ward_name"
                  v-tableTransform
                  >--</span
                >
              </template>
              <template v-else-if="item.prop === 'settlementType'">
                <span
                  :val="scope.row[item.prop]"
                  code="MEDICAL_INSURANCE_CODE"
                  v-codeTransform
                ></span>
              </template>
              <template v-else>{{ scope.row[item.prop] }}</template>
            </template>
          </el-table-column>
        </el-table>
      </l-table>
    </div>
  </el-card>
</template>

<script>
import { getLeaveHosPatient } from "@/api/ipnw/leaveHos";
import { swipe } from "@/api/arch/arch";
import { fetchPatientsList } from "@/api/ipnw/etHospital";
import { mapGetters, mapActions } from "vuex";
import readCardMixin from "@/mixins/readCard.js"

export default {
  name: "recallLeftBar",
  mixins: [readCardMixin],
  data() {
    return {
      inpValue: "",
      select: "1",
      recordsParams: [
        {
          prop: "inpSdeptId",
          label: "住院科室",
          align: "left",
          width: "85",
          fixed: false
        },
        {
          prop: "wardId",
          label: "住院病区",
          align: "left",
          width: "85",
          fixed: false
        },
        {
          prop: "bedCode",
          label: "床位号",
          align: "left",
          width: "85",
          fixed: false
        },
        {
          prop: "settlementType",
          label: "结算类型",
          align: "left",
          width: "85",
          fixed: false
        },
        {
          prop: "dischargeTime",
          label: "出院时间",
          align: "left",
          width: "85",
          fixed: false
        }
      ],
      recordsData: [],
      recordsDataUnit: [],
      tlm_isLoading: false,
      //分页信息
      pageNo: 1,
      pageSize: 20,
      total: 0
    };
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"]),
    totalPage() {
      return Math.ceil(this.total / this.pageSize);
    }
  },
  async created() {
    if (JSON.stringify(this.receivePatientData) != "{}") {
      this.select = "2";
      this.inpValue = this.receivePatientData.inpCode;
      await this.search();
    }
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "base/changeRecPatientData"
    }),
    changeSize(val) {
      this.pageNo = val.page;
      this.pageSize = val.pageSize;
      this.search();
    },
    selectChange() {
      this.inpValue = "";
    },
    getPatientCodeListFuc(obj) {
      this.inpValue = obj.siCardNum;
      this.search(obj.patientCode);
    },
    //读卡
    /* async readCard() {
      if (!this.inpValue) {
        this.$message.error("未获得卡号");
      } else {
        this.tlm_isLoading = true;
        try {
          let res = await swipe({ cardNum: this.inpValue });
          if (res.code == "1") {
            let patientId = res.data.patientId;
            await this.getRecords(patientId);
            this.recordsData = this.recordsDataUnit;
            this.$refs.multipleTable.setCurrentRow(this.recordsData[0]);
            this.$emit("updateRecord", this.recordsData[0]);
            let data = this.recordsData.length ? this.recordsData[0] : {};
            this.changeRecPatientData(data);
            // await this.getPatient();
          } else {
            this.tlm_isLoading = false;
            this.$message.error(res.msg || '"读卡请求失败"');
          }
        } catch (e) {
          this.tlm_isLoading = false;
          this.$message.error(e.msg || '"读卡请求失败"');
        }
      }
    }, */
    async search(patientId) {
      await this.getRecords(patientId);
      this.$refs.multipleTable.setCurrentRow(this.recordsData[0]);
      this.$emit("updateRecord", this.recordsData[0]);
      let data = this.recordsData.length ? this.recordsData[0] : {};
      this.changeRecPatientData(data);
      // await this.getPatient();
    },
    async getRecords(patientId) {
      this.tlm_isLoading = true;
      try {
        let params;
        if (this.select === "1") {
          params = {
            patientId: patientId,
            selectParam: patientId,
            pageNo: this.pageNo,
            pageSize: this.pageSize
          };
        } else if (this.select === "2") {
          params = {
            inpCode: this.inpValue,
            pageNo: this.pageNo,
            pageSize: this.pageSize
          };
        } else if (this.select === "3") {
          params = {
            bedCode: this.inpValue,
            pageNo: this.pageNo,
            pageSize: this.pageSize
          };
        }
        let res = await getLeaveHosPatient(params);
        if (res.code == 1) {
          if (res.data.length) {
            this.recordsData = res.data;
            this.total = res.total;
          } else {
            this.recordsData = [];
            this.total = 0;
          }
        } else {
          this.$message.error(res.msg || "获取患者住院记录失败");
        }
        this.tlm_isLoading = false;
      } catch (e) {
        this.tlm_isLoading = false;
        this.$message.error(e.msg || "获取患者住院记录失败");
      }
    },
    /* load() {
      const _this = this;
      this.pageNo++;
      setTimeout(async () => {
        let recordsData = [..._this.recordsData];
        if (_this.pageNo > _this.totalPage) {
          _this.tlm_noMore = true;
          _this.pageNo = _this.totalPage;
        } else {
          let params;
          if (_this.select === "1") {
            params = {
              patientId: patientId,
              pageNo: _this.pageNo,
              pageSize: _this.pageSize
            };
          } else if (_this.select === "2") {
            params = {
              inpCode: _this.inpValue,
              pageNo: _this.pageNo,
              pageSize: _this.pageSize
            };
          } else if (this.select === "3") {
            params = {
              bedCode: _this.inpValue,
              pageNo: _this.pageNo,
              pageSize: _this.pageSize
            };
          }
          await _this.getRecords(params);
          _this.recordsData = [...recordsData.concat(_this.recordsDataUnit)];
          _this.$refs.multipleTable.setCurrentRow(_this.recordsData[0]);
          _this.$emit("updateRecord", _this.recordsData[0]);
          let data = _this.recordsData.length ? _this.recordsData[0] : {};
          _this.changeRecPatientData(data);
          // await _this.getPatient();
        }
        _this.tlm_isLoading = false;
      }, 2000);
    }, */
    //获取病人信息
    /*async getPatient() {
        try {
          let params = {
            isNurse: 1,
            pageNo: 1,
            pageSize: 1000000,
            illnessArea: this.recordsData[0].wardId,
            search: this.recordsData[0].patientId
          };
          let res = await fetchPatientsList(params);
          if (res.code == '1') {
            this.changeRecPatientData(res.data[0]);
          }
        } catch (e) {
          console.log(e);
        }
      },*/
    rowClick(row) {
      this.$emit("updateRecord", row);
    }
  }
};
</script>

<style scoped lang="scss">
.recallLeftBar {
  .form-list {
    padding: 20px;
  }

  .table-cont {
    padding: 10px;
    height: calc(100% - 122px);
  }
}
</style>
