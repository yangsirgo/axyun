<template>
  <div class="listContent height100">
    <div class="table-wrap" v-loading="loading">
      <el-card v-for="(item,index) in showData" :key="index">
        <div class="listItem" @click="recPatientHandler(item)">
          <div class="one">
            <div>{{item.patientName}}</div>
            <div v-if="params.activityName==='first'">
                    <span tableName="sys_org"
                          :conditionMap="{org_type: '_DEPT_',id: item['ouptDeptId']}"
                          columns="org_nm"
                          v-tableTransform
                    ></span>
            </div>
            <!--<div class="patientCode" v-else-if="params.activityName==='second'">{{item.patientCode}}</div>-->
          </div>
          <div class="one" v-if="params.activityName==='first'">
            <div>医生: {{item.doctorName || '--'}}</div>
            <div>
              <span :val="item.diagTreatType" code="DIAG_TREAT_TYPE" v-codeTransform></span>
            </div>
          </div>
          <div class="two" v-if="params.activityName==='first'">就诊时间: {{item.attendTime || '--'}}</div>
          <!--<div class="two" v-if="params.activityName==='second'">
            <div>{{item.patientGender=='1'?'男':'女'}}</div>
            <div>{{item.birthDate}}</div>
            <div>{{item.mobileNum}}</div>
          </div>
          <div class="three" v-if="params.activityName==='second'">身份证号：{{item.identificationNum}}</div>-->
        </div>
      </el-card>
      <div class="noData" v-if="!showData.length">暂无数据</div>
    </div>
  </div>
</template>

<script>
  import {saveSign, updateSign, findByPatientId} from "@/api/cis/order/order";
  import {getIMUserID} from "@/api/admin/synUser";
  import {getPatients, receive, findAllergy, selectPatientBySth} from "@/api/cis/visit/visit";
  import {mapActions, mapGetters} from 'vuex'

  export default {
    props: ['params'],
    data() {
      return {
        loading: false,
        activeName: 'second',
        showData: []
      }
    },
    computed: {
      ...mapGetters("base", ["receivePatientData"])
    },
    methods: {
      ...mapActions({
        changeRecPatientData: 'base/changeRecPatientData'
      }),
      async loadData() {
        // this.showData = [];

        let form = this.params;
        let startDate = "";
        let stopDate = "";

        if (form.timeRange) {
          startDate = form.timeRange && form.timeRange.length ? form.timeRange[0] : '';
          stopDate = form.timeRange && form.timeRange.length ? form.timeRange[1] : '';
        }

        let params = {
          type: 'third',
          pricedChecked: form.pricedChecked,
          patientIds: form.searchReasult,
          startDate: startDate,
          stopDate: stopDate,
          visitCode: form.search
        };
        try {
          this.loading = true;
          let res = await getPatients(params);
          if (res.code == 1) {
            this.showData = res.data;
          } else {
            this.$message.error("获取数据失败");
          }
          this.loading = false;
        } catch (e) {
          this.loading = false;
          this.$message.error("获取数据失败");
        }
      },
      recPatientHandler(row) {
        this.changeRecPatientData(row);
      }
    }
  }

</script>

<style scoped lang="scss">
  /deep/ .headerCls {
    height: 30px;
    background: rgba(246, 246, 246, 1);
    font-size: 14px;
    
    font-weight: 400;
    color: rgba(46, 50, 58, 1);
    padding: 0;
  }

  /deep/ .rowStyleCls {
    height: 40px;
    font-size: 14px;
    
    font-weight: 400;
    color: rgba(46, 50, 58, 1);

    > td {
      padding: 0;
    }
  }

  /deep/ .disabledRowStyleCls {
    /*background-color: #1f2d3d;*/
    color: #565656;
    background-color: #F5F7FA;
  }

  .pa {
    width: 32px;
    height: 21px;
    border-radius: 2px;
    border: 1px solid rgba(228, 228, 228, 1);
    font-size: 12px;
    
    font-weight: 500;
    color: $l-color-primary;
    line-height: 17px;
  }

  .wz {
    width: 32px;
    height: 21px;
    border-radius: 2px;
    border: 1px solid rgba(228, 228, 228, 1);
    font-size: 12px;
    
    font-weight: 500;
    color: rgba(19, 71, 150, 1);
    line-height: 17px;
  }

  .other {
    width: 32px;
    height: 21px;
    border-radius: 2px;
    border: 1px solid rgba(228, 228, 228, 1);
    font-size: 12px;
    
    font-weight: 500;
    color: rgba(225, 20, 10, 1);
    line-height: 15px;
  }

  .pricedCheckbox {
    height: 40px;
    line-height: 40px;
    text-align: center;
  }

  .listItem {
    padding: 10px;

    .one {
      line-height: 2;
      display: flex;
      justify-content: space-between;

      .patientCode {
        color: #0000ff;
        text-decoration: underline;
      }
    }

    .two {
      line-height: 2;
      display: flex;
      justify-content: space-between;
    }

    .three {
      line-height: 2;
    }
  }

  .noData {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #909399;
  }

  .table-wrap {
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
  }

  .listContent {
    height: 100%;
    overflow: auto;
    margin-top: 10px;
    border: 1px solid #e4e4e4;
  }
</style>
