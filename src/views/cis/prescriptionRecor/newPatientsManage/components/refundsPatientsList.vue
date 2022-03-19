<template>
  <el-table
    @row-click="getApplyList"
    header-cell-class-name="headerCls"
    row-class-name="rowStyleCls"
    ref="singleTable"
    :data="tabsList"
    highlight-current-row
    style="width: 100%"
    height='100%'
    stripe
    v-loading="tlm_isLoading"
    element-loading-text="加载中..."
  >
    <el-table-column v-for="item in tableColumn"
                     :key="item.label"
                     :label="item.label"
                     :prop="item.prop"
                     align="center"
                     :fixed="item.fixed"
                     show-overflow-tooltip
                     header-align="center"
                     :min-width="item.width">
      <template slot-scope="scope">
        <template v-if="item.prop == 'recordStatus'">
          <span v-if="scope.row[item.prop] == '1'">可退</span>
          <span v-if="scope.row[item.prop] == '2'">已退</span>
        </template>
        <template v-else-if="item.prop == 'patientGender'">
          <span :val="scope.row[item.prop]" code="GENDER_CODE" v-codeTransform ></span>
        </template>
        <template v-else>
          <span>{{scope.row[item.prop]}}</span>
        </template>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  import {addClass, removeClass, hasClass, getEleByCls} from "@/utils/util";
  import { mapActions, mapGetters } from 'vuex';
  import service from "@/api/cis/refund/refund";

// 重写date 格式化方法
Date.prototype.toLocaleString = function() {
  return (
    this.getFullYear() +
    "-" +
    (this.getMonth() + 1) +
    "-" +
    this.getDate() +
    " " +
    this.getHours() +
    ":" +
    this.getMinutes() +
    ":" +
    this.getSeconds() +
    ""
  );
};

  export default {
    name: "patientsDiagnosedList",
    data() {
      return {
        searchValue: '',
        heightCalc: 100,
        tlm_isLoading: false, // 请求数据中，
        tlm_noMore: false, // 没有更多数据， 禁用加载
        dateTime: [],
        tabsList: [],
        tableColumn: [
          // {
          //   prop: 'visitCode',
          //   label: "门诊号",
          //   width: "80",
          //   fixed : true,
          // },
          
          {
            prop: 'patientName',
            label: "患者",
            width: "80"
          },
          {
            prop: 'patientGender',
            label: "性别",
            width: "50"
          },
          {
            prop: 'patientAge',
            label: "年龄",
            width: "70"
          },
          {
            prop: 'recordStatus',
            label: "状态",
            width: "60"
          },
          {
            prop: 'pNo',
            label: "票据号",
            width: "100"
          },
          {
            prop: 'totalMoney',
            label: "金额",
            width: "100"
          }
        ]
      }
    },
    methods: {
      ...mapActions({
        changeRecPatientData: 'base/changeRecPatientData'
      }),
      async filterChange(e) {
        // let target = e.target;
        // let filter = this.$refs.filter;
        // let list = getEleByCls(filter, 'date0_');
        // for (let i = 0; i < list.length; i++) {
        //   removeClass(list[i], 'active');
        // }
        // addClass(target, 'active');
        // let date = new Date();
        // let sDate = '';
        // let eDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + "23:59:59";
        // if (e == 1) {
        //   sDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + "00:00:00";
        // } else {
        //   date = new Date() - e * 24 * 60 * 60 * 1000;
        //   sDate = new Date(date).getFullYear() + "-" + (new Date(date).getMonth() + 1) + "-" + new Date(date).getDate() + " " + "00:00:00";
        // }
        // //下面写获取数据方法
        // try {
        //   this.$showLoading();
        //   const response = await service.getList({
        //     sDate: sDate,
        //     eDate: eDate,
        //     pageNo: 1,
        //     pageSize: 10
        //   });
        //   this.tabsList = response.data;
        //   this.$hideLoading();
        // } catch (error) {
        //   this.$hideLoading();
        //   this.$message.error(error.msg || "标准错误提示");
        // }
      },
      //患者列表patient 的高度计算
      setHeightCalc() {
        // let header = this.$refs['header'].$el;
        // let filter = this.$refs['filter'];
        // let card = this.$refs['card'].$el;
        // this.heightCalc = card.clientHeight - filter.clientHeight;
      },
      load() {
        const _this = this;
        this.page++;
        setTimeout(function () {
          let list = _this.tabsList
          let arr = [
            {
              bedNum: 1111,
              name: "en",
              gender: "男",
              age: "1"
            }
          ]
          if (_this.page >= 6) {
            _this.tlm_noMore = true
          }
          // _this.tabsList = list.concat(arr);
          _this.tlm_isLoading = false
        }, 2000)
      },
      // 根据时间查询待审核患者列表
      async getTableList(queryData) {
        try {
          let data = {
            patientName: queryData.search || '',
            ouptDeptId: queryData.technicalOffices || '',
            appointmentChannel: queryData.channelWay || undefined,
            sDate: '',
            eDate: ''
          }
          this.$showLoading();
          if (queryData && queryData.timeRange && queryData.timeRange.length > 1) {
            data.sDate = queryData.timeRange[0].toLocaleString();
            data.eDate = queryData.timeRange[1].toLocaleString();
          }
          const response = await service.getList({
            ...data,
            pageNo: 1,
            pageSize: 10
          });
          this.tabsList = response.data;
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "标准错误提示");
        }
      },
      // 拿到退费申请列表
      getApplyList(row) {
        // this.$emit('getApply', row)
        this.changeRecPatientData(row);
      },
      // 读卡
      async readCard(val){
        try {
          if (val.search == "") {
            this.$message.warning("请输入卡号");
            return;
          }
          this.$showLoading();
          const { data } = await service.getCardDetailInfo({
            cardNum: val.search || ""
          });
          if(!data.patientId || data.patientId == null){
            this.$hideLoading();
            this.$message("未查询到患者");
            return;
          }
          this.tabsList = [];
          this.tabsList.push(data);
          // this.changeRecPatientData(data)
          this.$hideLoading();
        } catch (error) {
          this.$message.error(error.msg);
          this.$hideLoading();
        }
      }
    },
    mounted() {
      // let me = this;
      // this.$nextTick(() => {
      //   setTimeout(function () {
      //     me.setHeightCalc();
      //   }, 0)
      // })

      // 获取列表
      this.getTableList({});
    }
  }
</script>

<style scoped lang="scss">
  .center-card {
    height: 100%;

    .wrapper {
      padding: 0 20px 20px 20px;

      .readCard {
        width: 206px;
        height: 38px;
        // background: rgba(19, 71, 150, 1);
        border-radius: 2px;
        display: inline-block;
        cursor: pointer;
        background: #057af2;
        color: #fff;
        line-height: 36px;
        text-align: center;
        font-size: 14px;
        
        font-weight: 500;
      }

      .horizontalLine {
        margin: 20px 0;
        width: 460px;
        height: 1px;
        background: rgba(228, 228, 228, 1);
      }

      .filter {
        font-size: 0;

        span + span {
          margin-left: 20px;
          display: inline-block;
          line-height: 28px;
        }

        span {
          user-select: none;
          cursor: pointer;
          font-size: 14px;
          
          font-weight: 400;
          color: rgba(148, 157, 163, 1);
          line-height: 20px;
        }


      }

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
    }

    .active {
      color: $l-color-primary !important;
      font-weight: bold !important;
    }

    .activeCell {
      color: $l-color-primary !important;
    }
  }
</style>
