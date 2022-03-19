<template>
  <div class="page height100">
    <el-tabs
      class="leftBarTabs height100"
      @tab-click="handleClick"
      v-model="activeName"
    >
      <el-tab-pane label="在床患者" name="first">
        <l-sidebar-left>
          <template #top>
            <div class="topInner">
              <div class="margin4">
                <el-radio-group
                  v-model="form.patientsType"
                  @change="changeRadio"
                >
                  <el-radio :label="2">本人管辖患者</el-radio>
                  <el-radio :label="1">全部患者</el-radio>
                </el-radio-group>
              </div>
              <div class="margin4">
                <!-- <l-formt-title label="执行时间"> -->
                <el-date-picker
                  style="width: 100%"
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
                <el-button type="primary" plain class="btn" @click="query"
                  >查询</el-button
                >
                <el-button plain class="btn" @click="reset(1)">重置</el-button>
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
      <el-tab-pane label="撤床患者" name="second">
        <l-sidebar-left>
          <template #top>
            <div class="topInner">
              <div class="margin4">
                <el-radio-group
                  v-model="form2.patientsType"
                  @change="changeRadio"
                >
                  <el-radio :label="2">本人管辖患者</el-radio>
                  <el-radio :label="1">全部患者</el-radio>
                </el-radio-group>
              </div>
              <div class="margin4">
                <!-- <l-formt-title label="执行时间"> -->
                <el-date-picker
                  style="width: 100%"
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
                <el-button type="primary" plain class="btn" @click="query(2)"
                  >查询</el-button
                >
                <el-button plain class="btn" @click="reset(2)">重置</el-button>
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

<script>
import patientsList from "./list.vue";
import { getPatients } from "@/api/homeSickbeds/hsDiagTreat/hsDiagTreat.js";
import { getUserId } from "@/utils/auth";
import Base64 from "@/utils/base64.js";
import { mapActions, mapGetters } from "vuex";

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
        patientsType: 2
      },
      form2: {
        timeRange: "",
        search: "",
        patientsType: 2
      },
      datePicker: {
        startPlaceholder: "开始时间",
        endPlaceholder: "结束时间"
      }
    };
  },
  computed: {
    ...mapGetters("homeSickbeds", ["theRefreshLeftLIst"])
  },
  watch: {
    theRefreshLeftLIst: {
      // immediate: true,
      deep: true,
      handler(a) {
        this.getList();
      }
    }
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "homeSickbeds/changeRecPatientData"
    }),
    async handlerRoute(query) {
      let form = this.activeName === "first" ? this.form : this.form2;
      form.search = query.enId;

      await this.getList();
      this.$nextTick(() => {
        const listDom = document.querySelector(
          ".l-table-content .patient-info"
        );

        if (listDom) {
          listDom.click();
        } else {
          this.changeRecPatientData({});
        }
      });
    },
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
      //重置分页数据 pageNo 重置为1
      this.$refs.patientsList.resetPageParams();

      this.search(type);
    },
    getParams() {
      let pageParams = this.$refs.patientsList.pageParams;
      let form = this.activeName === "first" ? this.form : this.form2;
      let condition = form.search ? form.search.replace(/\s*/g, "") : "";

      return {
        ...pageParams,
        ...form,
        ...{
          doctorId: form.patientsType === 1 ? "" : this.userId,
          key: condition,
          search: condition,
          type: 3,
          statusList: this.activeName === "first" ? [1, 2, 5, 6, 7] : [3, 4, 9],
          treatStartTimeRangeStart: form.timeRange
            ? form.timeRange[0] + " 00:00:00"
            : "",
          treatStartTimeRangeEnd: form.timeRange
            ? form.timeRange[1] + " 00:00:00"
            : ""
        }
      };
    },
    async getList() {
      let ajaxData = this.getParams();
      this.patientsLoading = true;
      try {
        let { code, data, msg, pageNo, pageSize, total } = await getPatients(
          ajaxData
        );
        this.patientsLoading = false;
        if (code === 1) {
          this.patientsList = data;
          if (this.$refs.patientsList) {
            await this.$refs.patientsList.setpageParams({
              pageNo,
              pageSize,
              total
            });
            await this.$refs.patientsList.setActiveItem();
          }
        } else {
          this.$message.error(msg || "获取患者列表失败");
        }
        this.patientsLoading = false;
      } catch (error) {
        this.patientsLoading = false;
        this.patientsList = [];
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
      this.changeRadio();
    },
    sizeChangePatientList(a) {
      this.getList();
    },
    setLeftBarForm(type, value) {
      this.form[type] = value;
      this.form2[type] = value;
      this.getList();
    }
  },
  components: { patientsList },
  async mounted() {
    const query = this.$route.query;
    if (query.enId && query.mrTpCd) {
      await this.handlerRoute(query);
    } else {
      await this.getList();
    }
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
