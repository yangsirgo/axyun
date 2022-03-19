<template>
  <!-- 档案来源信息工具栏 -->
  <div class="assist-container width100 height100" v-loading="loading">
    <el-card class="archives-card" v-if="JSON.stringify(sourceInfo) !== '{}'">
      <div class="top">
        <!-- 新 -->
        <el-row class="record-title">档案</el-row>
        <el-row>
          <div class="row-title">创建时间</div>
          <div class="row-data createTime">{{sourceInfo.createTime || "--"}}</div>
        </el-row>
        <el-row>
          <div class="row-title">创建机构</div>
          <div class="row-data"><span
            tableName="sys_org"
            :conditionMap="{org_type: '_HOS_', id: sourceInfo.createOrg}"
            columns="org_nm"
            v-tableTransform
          ></span></div>
        </el-row>
        <el-row>
          <div class="row-title">创建人</div>
          <div class="row-data">{{sourceInfo.createName || "--"}}</div>
        </el-row>
      </div>
      <div class="down">
        <el-row>
          <div class="row-title">最近就诊科室</div>
          <div class="row-data">
            <span v-if="sourceInfo.lastDepartment !='-1'"
                  tableName="sys_org"
                  :conditionMap="{org_type: '_DEPT_', id: sourceInfo.lastDepartment}"
                  columns="org_nm"
                  v-tableTransform
            ></span>


          </div>
        </el-row>
        <el-row>
          <div class="row-title">最近就诊医生</div>
          <div class="row-data">{{sourceInfo.lastDoctor || "--"}}</div>
        </el-row>

        <el-row>
          <div class="row-title">是否有慢性病</div>
          <div class="row-data">{{sourceInfo.chronicStatus=='1'?'是':'否'}}</div>
        </el-row>
      </div>
    </el-card>
  </div>
</template>
<script>
  import {mapActions, mapGetters} from "vuex";

  import {getMedicalRecord} from '@/api/arch/arch';

  export default {
    data() {
      return {
        sourceInfo: {},
        loading: false
      };
    },
    computed: {
      ...mapGetters("patientMaster", ["recordData"])
    },
    watch: {
      recordData: {
        handler(n) {
          this.sourceInfo = {};
          if (n !== undefined && JSON.stringify(n) !== "{}" && n.patientId) {
            this.getSourceInfo();
          } else {
            this.sourceInfo = {};
          }
        },
        immediate: true,
        deep: true
      }
    },
    created() {
      // this.getSourceInfo();
    },
    methods: {
      //获取来源信息
      async getSourceInfo() {
        this.loading = true;
        try {
          //获取来源信息接口
          // let result = await getSourceInfo(this.recordData.patientId && 其他参数);
          // if(result.code == 1){
          // this.sourceInfo = result.data;
          // }else{
          //   this.$message.error(result.message || "获取来源信息失败");
          // }

          let result = await getMedicalRecord({patientIds: this.recordData.patientId})
          console.log("result", result);
          console.log("aa", this.recordData)
          this.sourceInfo = {
            createTime: this.recordData.createdAt,
            createOrg: this.recordData.hosId,
            createName: this.recordData.createdByName,
            chronicStatus: this.recordData.chronicStatus,
            lastDepartment: "-1",
            lastDoctor: ""
          };

          if (result.code == '1') {
            if (result.data.length > 0) {

              this.sourceInfo["lastDepartment"] = result.data[0].ouptDeptId;
              this.sourceInfo["lastDoctor"] = result.data[0].doctorName;
            }
          } else {
            this.$message.error(result.msg || "获取来源信息失败");
          }
          this.loading = false;
        } catch (error) {
          this.loading = false;
          this.$message.error(error.msg || "获取来源信息失败");
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  .assist-container {
    overflow-y: auto;

    .is-always-shadow {
      box-shadow: 0 0 0 0 transparent;
    }

    .archives-card {
      padding: 20px;
      margin-bottom: 10px;
      background-color: $l-color-bgcolor-18;

      .top {
        border-bottom: 1px solid #e4e4e4;
        padding-bottom: 10px;

        .el-row {
          margin-bottom: 10px;
          font-size: 14px;
          font-weight: 400;

          div {
            float: left;
          }

          .row-title {
            width: 56px;
            margin-right: 10px;
            color: #949da3;
          }

          .row-data {
            color: #2e323a;
          }

          .createTime {
            font-weight: 400;
          }
        }

        .record-title {
          height: 24px;
          font-size: 16px;
          font-weight: bold;
          color: rgba(46, 50, 58, 1);
          line-height: 24px;
        }
      }

      .down {
        .el-row {
          font-size: 14px;
          margin-top: 20px;
        }

        .row-title {
          color: #949da3;
          margin-bottom: 4px;
        }

        .row-data {
          color: #2e323a;
        }
      }
    }
  }
</style>
