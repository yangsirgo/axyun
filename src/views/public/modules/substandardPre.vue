<template>
  <div class="height100">
    <div class="infinite-list-wrapper height100" style="overflow:auto">
      <ul class="list" v-infinite-scroll="loadData" infinite-scroll-disabled="disabled">
        <li v-for="(item, index) in list" :key="index" class="list-item">
          <el-card shadow="hover" class="card width100">
            <div class="show">
              <div class="left">
                <el-row class="number">{{ item.recipeCode }}</el-row>
                <el-row>
                  {{ item.patientName }}
                  <span class="vertical-line">|</span><br />
                  <span class="value">金额：{{ formatNum(item.prescriptionAmt) }}</span>
                </el-row>
              </div>
              <div class="right" @click="shrinkHandler(item, index)">{{ index === curIndex ? "收起" : "展开" }}</div>
            </div>
            <div class="no-show" v-show="index === curIndex">
              <el-row>
                <el-col :span="7">
                  <div>诊断</div>
                </el-col>
                <el-col :span="17">
                  <div class="row-data">{{ curInfo.clinicDiag || "--" }}</div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="7">
                  <div>开单科室</div>
                </el-col>
                <el-col :span="17">
                  <div class="row-data">{{ curInfo.deptName || "--" }}</div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="7">
                  <div>开单医生</div>
                </el-col>
                <el-col :span="17">
                  <div class="row-data">{{ curInfo.doctorUserName || "--" }}</div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="7">
                  <div>收费人员</div>
                </el-col>
                <el-col :span="17">
                  <div class="row-data">{{ curInfo.chargeUserName || "--" }}</div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="7">
                  <div>收费时间</div>
                </el-col>
                <el-col :span="17">
                  <div class="row-data">{{ curInfo.chargeTime || "--" }}</div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="7">
                  <div>配方人员</div>
                </el-col>
                <el-col :span="17">
                  <div class="row-data">{{ curInfo.dispenseUserName || "--" }}</div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="7">
                  <div>发药人员</div>
                </el-col>
                <el-col :span="17">
                  <div class="row-data">{{ curInfo.deliveryUserName || "--" }}</div>
                </el-col>
              </el-row>
              <div class="drug-list" v-for="drug in curInfo.recipeDVOList" :key="drug.id">
                <el-row class="row-data">{{ drug.drugName }}</el-row>
                <el-row class="row-data">
                  <div style="float:left">{{ drug.spec }}</div>
                  <div style="float:right">{{ drug.packQuantity + drug.packUnit }}</div>
                </el-row>
              </div>
            </div>
          </el-card>
        </li>
      </ul>
      <p class="text-align-center" v-if="loading">加载中...</p>
      <p class="text-align-center" v-if="!loading && noMore">没有更多了</p>
    </div>
  </div>
</template>

<script>
  import {
    mapGetters
  } from "vuex";
  import opha from "@/api/hmm/opha";
  import {
    create
  } from "@/api/emr/typeGroup";
  import formatNum from "@/utils/formatPrice.js";

  export default {
    name: "substandardPre",
    data() {
      return {
        list: [],
        pageParams: {
          pageNo: 0,
          total: 0,
          pageSize: 20
        },
        loading: false,
        status: {
          "0": "未发药",
          "1": "已发药"
        },
        curIndex: null,
        curInfo: {}
      };
    },
    computed: {
      noMore() {
        return (
          Math.ceil(this.pageParams.total / this.pageParams.pageSize) <=
          this.pageParams.pageNo
        );
      }
    },
    created() {
      this.loadData();
    },
    methods: {
      formatNum(num) {
        return formatNum(num);
      },
      loadData() {
        this.loading = true;
        this.pageParams.pageNo++;
        opha
          .list({
            pageNo: this.pageParams.pageNo,
            pageSize: this.pageParams.pageSize,
            checkState: "2"
          })
          .then(res => {
            if (res.code === 1) {
              if (this.pageParams.pageNo === 1) {
                this.list = res.data;
              } else {
                this.list = this.list.concat(res.data);
              }
              this.pageParams = res.pageParams;
            }
            this.loading = false;
          })
          .catch(err => {
            this.loading = false;
          });
      },
      shrinkHandler(item, index) {
        if (this.curIndex === index) {
          this.curIndex = null;
          return;
        }
        this.curIndex = index;
        this.curInfo = this.$options.data().curInfo;
        opha
          .get(item.id)
          .then(res => {
            if (res.code === 1) {
              this.curInfo = res.data;
            }
          })
          .catch(err => {});
      }
    }
  };
</script>

<style lang="scss" scoped>
  .card {
    position: relative;
    // height: 63px;
    padding: 10px;
    font-size: 14px;

    font-weight: 400;
    color: rgba(148, 157, 163, 1);
    margin-bottom: 20px;
    background: rgba(246, 246, 246, 1);

    .row-data {

      color: rgba(46, 50, 58, 1);
    }

    .show {
      position: relative;
      height: 85px;

      .left {
        float: left;
        color: rgba(46, 50, 58, 1);
        width: 123px;
        .number {
          font-size: 16px;

          font-weight: bold;
          color: rgba(46, 50, 58, 1);
          margin-bottom: 7px;
        }

        .vertical-line {
          color: #e4e4e4;
        }

        .value {

          color: $l-color-primary;
        }
      }

      .right {
        cursor: pointer;
        margin-top: 1px;
        float: right;
        color: #3d7dfb;
      }
    }

    .no-show {
      position: relative;
      padding-top: 10px;
      border-top: 1px solid #e4e4e4;

      .el-row {
        margin-bottom: 10px;
      }
    }
  }

  .text-align-center {
    text-align: center;
  }
</style>
