<template>
  <div class="page height100">
        <l-sidebar-left>
          <template #top>
            <div class="topInner">
              <div class="margin4">
                <el-radio-group v-model="patientsType" @change="changeRadio">
                  <el-radio :label="1">全部患者</el-radio>
                  <el-radio :label="2">本人管辖患者</el-radio>
                </el-radio-group>
              </div>
              <div class="read-card margin4">
                <l-formt-title class="l-input-wrap-new">
                  <el-input v-model="form.searchValue" :maxlength="100" placeholder="姓名/身份证号/家床号" @keyup.enter.native="query">
                    <i class="el-icon-search el-input__icon" slot="suffix" @click="query(1)">
                    </i>
                  </el-input>
                </l-formt-title>
              </div>
              <div class="btns-contain margin4">
                <el-button type="primary" plain class="btn" @click="query">查询</el-button>
                <el-button plain class="btn" @click="reset(1)">重置</el-button>
              </div>
            </div>

          </template>
          <template #bottom>
            <patientsList ref="patientsList" v-loading="patientsLoading" :data="patientsList"
              @sizeChangePatientList="sizeChangePatientList" class="patientsList"></patientsList>
          </template>
        </l-sidebar-left>
  </div>
</template>

<script type="text/ecmascript-6">
  import patientsList from "./list.vue";
  import {
    getAllInpPatientInfo
  } from '@/api/homeSickbeds/hsPatientManagement/hsPatientManagement';
  import {
    getUserId
  } from "@/utils/auth";
  import Base64 from "@/utils/base64.js";

  export default {
    data() {
      return {
        patientsLoading: false,
        userId: Base64.decode(getUserId()),
        patientsList: [],
        patientsType:1,
        form: {
          searchValue: '',
          statusList: ["2","6","7"],
          managerUserId: '', //责任人
          inStartDate: '', //入院时间
          inStopDate: '' //出院时间
        },
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
        this.form.managerUserId =  this.patientsType == 1 ? "" : this.userId;
        
        let searchValue = this.form.searchValue ? this.form.searchValue.replace(/\s*/g,"") : "";
        return {
          ...pageParams,
          ...this.form,
          searchValue
        };
      },
      async getList() {
        let ajaxData = this.getParams();
        this.patientsLoading = true;
        try {
          let {
            code,
            data,
            msg,
            pageNo,
            pageSize,
            total
          } = await getAllInpPatientInfo(ajaxData);
          this.patientsLoading = false;
          if (code === 1) {
            this.patientsList = data;
            this.$nextTick(()=>{
              this.$refs.patientsList.setpageParams({
                pageNo,
                pageSize,
                total
              });
            })
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

          this.form = {
            search: "",
            patientsType: 1
          };

      },
      sizeChangePatientList(a) {
        this.getList();
      },

    },
    components: {
      patientsList
    },
    created() {

    },
    mounted() {
        this.getList();
    }
  };
</script>

<style scoped lang="scss">
  .page {
    padding: 4px 0;

    .leftBarTabs>/deep/.el-tabs__header {
      padding-left: 16px;
    }

    .leftBarTabs>/deep/.el-tabs__content {
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
