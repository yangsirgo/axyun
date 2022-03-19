<template>
  <div class="page height100">
    <el-tabs
      class="leftBarTabs height100"
      @tab-click="handleClick"
      v-model="activeName"
    >
      <el-tab-pane
        label="在床患者"
        name="first"
      >
        <l-sidebar-left>
          <template #top>
            <div class="topInner">
              <div class="margin4">
                <el-radio-group
                  v-model="form.patientsType"
                  @change="changeRadio"
                >
                  <el-radio :label="1">全部患者</el-radio>
                  <el-radio :label="2">本人管辖患者</el-radio>
                </el-radio-group>
              </div>
              <div class="margin4">
                <!-- <l-formt-title label="执行时间"> -->
                <el-date-picker
                  style="width:100%"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  v-model="form.timeRange"
                  type="daterange"
                  range-separator="至"
                  @change="search(1)"
                  :default-time="['00:00:00', '23:59:59']"
                  :start-placeholder="datePicker.startPlaceholder"
                  :end-placeholder="datePicker.endPlaceholder"
                ></el-date-picker>
                <!-- </l-formt-title> -->
              </div>

              <div class="read-card margin4">
                <l-formt-title class="l-input-wrap-new">
                  <el-input
                    v-model="form.search"
                    :maxlength="100"
                    placeholder="姓名/身份证号/家床号"
                    @keyup.enter.native="query"
                  >
                    <i
                      class="el-icon-search el-input__icon"
                      slot="suffix"
                      @click="query(1)"
                    >
                    </i>
                  </el-input>
                </l-formt-title>
              </div>
              <div class="btns-contain margin4">
                <el-button
                  type="primary"
                  plain
                  class="btn"
                  @click="query"
                >查询</el-button>
                <el-button
                  plain
                  class="btn"
                  @click="reset(1)"
                >重置</el-button>
              </div>
            </div>

          </template>
          <template #bottom>
            <patientsList
              ref="patientsList"
              v-if="activeName === 'first'"
              v-loading="patientsLoading"
              :data="patientsList"
              @sizeChangePatientList="sizeChangePatientList"
              class="patientsList"
            ></patientsList>
          </template>
        </l-sidebar-left>
      </el-tab-pane>
      <el-tab-pane
        label="撤床患者"
        name="second"
      >

        <l-sidebar-left>
          <template #top>
            <div class="topInner">
              <div class="margin4">
                <el-radio-group
                  v-model="form2.patientsType"
                  @change="changeRadio"
                >
                  <el-radio :label="1">全部患者</el-radio>
                  <el-radio :label="2">本人管辖患者</el-radio>
                </el-radio-group>
              </div>
              <div class="margin4">
                <!-- <l-formt-title label="执行时间"> -->
                <el-date-picker
                  style="width:100%"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  v-model="form2.timeRange"
                  type="daterange"
                  range-separator="至"
                  @change="search(2)"
                  :default-time="['00:00:00', '23:59:59']"
                  :start-placeholder="datePicker.startPlaceholder"
                  :end-placeholder="datePicker.endPlaceholder"
                ></el-date-picker>
                <!-- </l-formt-title> -->
              </div>

              <div class="read-card margin4">
                <l-formt-title class="l-input-wrap-new">
                  <el-input
                    v-model="form2.search"
                    placeholder="姓名/身份证号/家床号"
                    @keyup.enter.native="query"
                  >
                    <i
                      class="el-icon-search el-input__icon"
                      slot="suffix"
                      @click="query"
                    >
                    </i>
                  </el-input>
                </l-formt-title>
              </div>
              <div class="btns-contain margin4">
                <el-button
                  type="primary"
                  plain
                  class="btn"
                  @click="query(2)"
                >查询</el-button>
                <el-button
                  plain
                  class="btn"
                  @click="reset(2)"
                >重置</el-button>
              </div>
            </div>

          </template>
          <template #bottom>
            <patientsList
              ref="patientsList"
              v-if="activeName === 'second'"
              v-loading="patientsLoading"
              :data="patientsList"
              @sizeChangePatientList="sizeChangePatientList"
              class="patientsList"
            ></patientsList>
          </template>
        </l-sidebar-left>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import patientsList from "./list.vue";
import { getPatients } from "@/api/homeSickbeds/hsDiagTreat/hsDiagTreat.js";
import { getUserId } from "@/utils/auth";
import Base64 from "@/utils/base64.js";

export default {
  data() {
    return {
      patientsLoading: false,
      userId: Base64.decode(getUserId()),
      patientsList: [],
      patientsList_Second: [],
      activeName: "first",
      form: {
        timeRange: "",
        search: "",
        patientsType: 1
      },
      form2: {
        timeRange: "",
        search: "",
        patientsType: 1
      },
      datePicker: {
        startPlaceholder: "开始时间",
        endPlaceholder: "结束时间"
      }
    };
  },
  methods: {
    handleClick() {
      this.getList();
    },
    changeRadio() {
      this.getList();
    },
    search(type) {
      this.getList();
    },
    query(type) {
      this.search(type);
    },
    getParams() {
      let pageParams = this.$refs.patientsList.pageParams;
      let form = this.activeName === "first" ? this.form : this.form2;

      return {
        ...pageParams,
        ...form,
        ...{
          doctorId: form.patientsType === 1 ? "" : this.userId,
          key: form.search,
          type: 3,
          status: this.activeName === "first" ? 1 : 0,
          startTime: form.timeRange ? form.timeRange[0] + " 00:00:00" : "",
          endTime: form.timeRange ? form.timeRange[1] + " 00:00:00" : ""
        }
      };
    },
    async getList() {
      let ajaxData = this.getParams();
      this.patientsLoading = true;
      try {
        let { code, data, msg, pageNo, pageSize,  total} = await getPatients(ajaxData);
        this.patientsLoading = false;
        if (code === 1) {
          this.patientsList = data;
          this.$refs.patientsList.setpageParams({pageNo, pageSize, total});
        } else {
          this.$message.error(msg || "获取患者列表失败");
        }
        this.patientsLoading = false;
      } catch (error) {
        this.patientsLoading = false;
        this.$message.error("获取患者列表失败");
      }
    },
    reset(type) {
      if (type === 1) {
        this.form = {
          timeRange: "",
          search: "",
          patientsType: 1
        };
      } else {
        this.form2 = {
          timeRange: "",
          search: "",
          patientsType: 1
        };
      }
    },
    sizeChangePatientList(a) {
      this.getList();
    },
    setLeftBarForm (type, value){
      this.form[type] = value;
      this.form2[type] = value;
      this.getList();
    }
  },
  components: { patientsList },
  mounted() {
    this.getList();
  }
};
</script>

<style scoped lang="scss">
.page {
  padding: 4px 0;

  .leftBarTabs > /deep/.el-tabs__header {
    padding-left: 16px;
  }

  .leftBarTabs > /deep/.el-tabs__content {
    overflow: unset;
  }

  .topInner {
    padding: 4px 8px;
    .margin4 {
      margin: 4px 0;
    }
  }

  .btns-contain {
    display: flex;
    margin-bottom: $l-margin-default-4;
    justify-content: space-between;
    .btn {
      width: 100px;
    }
  }

  .patientsList {
    padding: 0 8px;
  }
}
</style>
