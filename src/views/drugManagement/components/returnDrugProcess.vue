<template>
  <div style="height:85%;margin-top:5px" v-loading="loading">
    <el-steps direction="vertical" :active="+info.recordStatus" finish-status="success">
      <el-step icon="filter-item iconfont icon-dianziyizhujiaohu1">
        <p class="title" slot="title">退药申请</p>
        <div slot="description">
          <el-row>
            <el-col :span="8">
              <div>申请人员</div>
            </el-col>
            <el-col :span="16">
              <div class="row-data">{{ info.applyUserName || "--" }}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <div>申请科室</div>
            </el-col>
            <el-col :span="16">
              <div class="row-data">{{ info.deptName }}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <div>申请时间</div>
            </el-col>
            <el-col :span="16">
              <div class="row-data">{{ info.applyTime || "--" }}</div>
            </el-col>
          </el-row>
        </div>
      </el-step>
      <el-step icon="filter-item iconfont icon-dianziyizhujiaohu1">
        <p class="title" slot="title">药房退药</p>
        <div slot="description">
          <el-row>
            <el-col :span="8">
              <div>退药人员</div>
            </el-col>
            <el-col :span="16">
              <div class="row-data">{{ info.retreatUserName || "--" }}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <div>退药时间</div>
            </el-col>
            <el-col :span="16">
              <div class="row-data">{{ info.retreatTime || "--" }}</div>
            </el-col>
          </el-row>
        </div>
      </el-step>
      <el-step icon="filter-item iconfont icon-dianziyizhujiaohu1">
        <p class="title" slot="title">财务退费</p>
        <div slot="description">
          <el-row>
            <el-col :span="8">
              <div>退费人员</div>
            </el-col>
            <el-col :span="16">
              <div class="row-data">{{ info.reChargeUserName || "--" }}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <div>退费时间</div>
            </el-col>
            <el-col :span="16">
              <div class="row-data">{{ info.reChargeTime || "--" }}</div>
            </el-col>
          </el-row>
        </div>
      </el-step>
      <el-step icon="filter-item iconfont icon-dianziyizhujiaohu1">
        <p class="title" slot="title">流程结束</p>
        <div slot="description"></div>
      </el-step>
    </el-steps>
  </div>
</template>
<script>
  import {
    mapGetters
  } from "vuex";
  import stockApi from "@/api/hmm/stock.js";

  export default {
    name: "returnDrugProcess",
    data() {
      return {
        loading: false,
        info: {
          recordStatus: "0",
          applyUserName: "",
          applyTime: "",
          retreatUserName: "",
          retreatTime: "",
          deptName: ""
        },
        applyStatus: {
          "0": "未提交",
          "1": "已提交"
        }
      };
    },
    computed: {
      ...mapGetters("drugManagement", ["currentDrug"])
    },
    watch: {
      currentDrug: {
        immediate: true,
        deep: true,
        handler(val) {
          if (val && val.refundApplyOrderChargeDetailId && val.recipeCode) {
            this.loadData(val);
          } else {
            this.info = this.$options.data().info;
          }
        }
      }
    },
    methods: {
      loadData(data) {
        this.loading = true;
        this.info = this.$options.data().info;
        stockApi
          .getDrugRefundFlow({
            refundApplyOrderChargeDetailId: data.refundApplyOrderChargeDetailId,
            recipeCode: data.recipeCode
          })
          .then(res => {
            if (res.code === 1) {
              let datainFo = res.data || this.$options.data().info;
              Object.assign(this.info,datainFo);

              if(!this.info.applyUserName && this.info.applyUserName == ''){
                  this.info.recordStatus = '0';
                }else{
                   this.info.recordStatus = '0';
                }
                if(this.info.retreatUserName){
                  if(this.info.retreatUserName == ''){
                       this.info.recordStatus = '0';
                  }else{
                    this.info.recordStatus = '1';
                  }
                }else{
                  this.info.recordStatus = '0';
                }
              if(this.info.reChargeUserName){
                if(this.info.reChargeUserName == ''){
                    this.info.recordStatus = '1';
                }else{
                  this.info.recordStatus = '3'
                }
              }else{
                this.info.recordStatus = '1';
              }

              this.info.deptName = this.currentDrug.deptName;
            }
            this.loading = false;
          })
          .catch(err => {
            this.loading = false;
          });
      }
    }
  };
</script>
<style lang="scss" scoped>
  .el-steps {
    /deep/ .el-step__icon-inner.iconfont {
      font-size: 20px !important;
    }
  }

  .el-step {
    .title {
      font-size: 16px;

      font-weight: bold;
      color: $l-color-fontcolor-3;
    }

    .el-row {
      margin-bottom: 10px;

      div {
        font-size: 14px;

        font-weight: 400;
        color: $l-color-fontcolor-4;
      }

      .row-data {

        color: $l-color-fontcolor-3;
      }
    }

    /deep/ .el-step__description {
      padding-right: 0;
    }

    /deep/ .el-step__head.is-success {
      border-color: $l-color-primary;

      .el-step__line {
        background-color: $l-color-primary;
      }

      .el-step__icon-inner.is-status {
        background-color: $l-color-primary;
        border-radius: 12px;
        padding: 2px;
        color: $l-color-white;
      }
    }

    /deep/ .el-step__head.is-process {
      color: $l-color-primary;
    }
  }
</style>
