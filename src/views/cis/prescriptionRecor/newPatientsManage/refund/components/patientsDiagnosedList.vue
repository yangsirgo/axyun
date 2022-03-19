<template>
  <el-card class="center-card" ref="card">
    <div class="wrapper" ref="filter">
      <l-card-title class="clearfix card-header" ref="header">
        <span slot="left">已诊患者列表</span>
      </l-card-title>
      <el-input
        class="input"
        placeholder="卡号、档案号、回车查询"
        suffix-icon="el-icon-search"
        v-model="searchValue"
        style="width: 247px"
        v-on:keyup.native.enter="selectPatientBySth"
      >
      </el-input>
      <span class="readCard"><i class="icon iconfont iconduka"></i>读卡</span>
      <div class="horizontalLine"></div>
      <div class="box-body">
        <div class="filter" ref="filter">
          <span @click="filterChange(1)" class="date0_">当天</span>
          <span @click="filterChange(3)"  class="date0_ active">近3天</span>
          <span @click="filterChange(7)"  class="date0_">近7天</span>
          <span @click="filterChange(30)"  class="date0_">近30天</span>
          <el-date-picker
            v-model="dateTime"
            style="width: 235px;margin-left: 16px"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="getTableList">
          </el-date-picker>
        </div>
 <el-table
      @row-click="getApplyList"
      header-cell-class-name="headerCls"
      row-class-name="rowStyleCls"
      ref="singleTable"
      :data="tabsList"
      highlight-current-row
      style="width: 100%"
      v-loadmore="load"
      stripe
      height="400"
      v-loading="tlm_isLoading"
      element-loading-text="加载中..."
    >
      <el-table-column v-for="item in tableColumn"
                       :key="item.label"
                       :label="item.label"
                       :prop="item.prop"
                       align="center"
                       show-overflow-tooltip
                       header-align="center"
                       :min-width="item.width">
        <template slot-scope="scope">
          <!-- <template v-if="item.prop === 'recordStatus'">
            <span v-if="scope.row[item.prop] === 0">待配</span>
            <span v-if="scope.row[item.prop] === 1" class="activeCell">已执行</span>
          </template> -->
          <template >
            <span>{{scope.row[item.prop]}}</span>
          </template>
        </template>
      </el-table-column>
    </el-table>
      </div>
    </div>
   
  </el-card>
</template>

<script>
  import { addClass, removeClass, hasClass,getEleByCls } from "@/utils/util";
  import service from "@/api/cis/refund/refund";
  

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
          {
            prop: 'visitCode',
            label: "门诊号",
            width: "20"
          },
          {
            prop: 'recordStatus',
            label: "状态",
            width: "20"
          },
          {
            prop: 'patientName',
            label: "患者",
            width: "20"
          },
          {
            prop: 'patientGender',
            label: "性别",
            width: "20"
          },
          {
            prop: 'patientAge',
            label: "年龄",
            width: "20"
          },
          {
            prop: 'pNo',
            label: "票据号",
            width: "20"
          },
          {
            prop: 'totalMoney',
            label: "金额",
            width: "20"
          }
        ]
      }
    },
    methods: {
      async filterChange (e){
        let target = e.target;
        let filter = this.$refs.filter;
        let list = getEleByCls (filter,'date0_');
        for (let i = 0;i < list.length;i++) {
          removeClass(list[i],'active');
        }
        addClass(target,'active');
        let date = new Date();
        let sDate = '';
        let eDate = date.getFullYear()+"-" + (date.getMonth()+1) + "-" + date.getDate() + " " + "23:59:59";
        if(e == 1){
          sDate = date.getFullYear()+"-" + (date.getMonth()+1) + "-" + date.getDate() + " " + "00:00:00";
        }else{
          date = new Date() - e*24*60*60*1000;
          sDate = new Date(date).getFullYear()+"-" + (new Date(date).getMonth()+1) + "-" + new Date(date).getDate() + " " + "00:00:00";
        }
        //下面写获取数据方法
        try {
         this.$showLoading();
          const response = await service.getList({
            sDate:sDate,
            eDate:eDate,
            pageNo:1,
            pageSize:10
          });
          this.tabsList = response.data;
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "标准错误提示");
        }
      },
      //患者列表patient 的高度计算
      setHeightCalc() {
        // let header = this.$refs['header'].$el;
        let filter = this.$refs['filter'];
        let card = this.$refs['card'].$el;
        this.heightCalc = card.clientHeight - filter.clientHeight;
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
          _this.tabsList = list.concat(arr);
          _this.tlm_isLoading = false
        }, 2000)
      },
      // 根据时间查询待审核患者列表
      async getTableList(date){
        try {
         this.$showLoading();
          let sDate = '';
          let eDate = '';
          if (this.dateTime && this.dateTime.length > 1) {
            sDate = this.dateTime[0].toLocaleString();
            eDate = this.dateTime[1].toLocaleString();
          }
          const response = await service.getList({
            sDate:sDate,
            eDate:eDate,
            pageNo:1,
            pageSize:10
          });
          this.tabsList = response.data;
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "标准错误提示");
        }
      },
      // 拿到退费申请列表
      getApplyList(row){
        this.$emit('getApply',row)
      }
    },
    mounted() {
      let me = this;
      this.$nextTick(() => {
        setTimeout (function (){
          me.setHeightCalc();
        },0)
      })

      // 获取列表
      this.getTableList();
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
      font-weight:bold  !important;
    }
    .activeCell {
      color: $l-color-primary !important;
    }
  }
</style>
