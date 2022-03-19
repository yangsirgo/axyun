<template>
  <div class="box">
    <el-input
      placeholder="搜索病人"
      suffix-icon="el-icon-search"
      @keyup.enter.native="search"
      v-model="pageParams.orderItemName"
    ></el-input>
    <div class="mains"
         v-infinite-scroll="load"
         infinite-scroll-disabled="disabled"
         infinite-scroll-immediate="true"
         infinite-scroll-distance="10">
      <div class="main" v-for="(item,index) in dataList" :key="index">
        <div class="searchhospital">{{item.ouptDeptName}} ({{item.diagnosisTime}})</div>
        <el-collapse>
          <el-collapse-item>
            <template slot="title">
             {{item.recipeCode}}
            </template>
            <div v-for="(value,key) in item.orders"
                 :key="key">
              {{value.orderItemName}}
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="more">
        <p v-if="loading" class="bottom-container">加载中...</p>
        <!--<p v-if="noMore" class="bottom-container">没有更多了</p>-->
      </div>
    </div>
  </div>
</template>
<script>
  import {getHistoryByPatient} from "@/api/tools/PreviousPrescriptions";
  import {mapActions, mapGetters} from 'vuex';

  export default {
    data() {
      return {
        dataList: [],
        preDataList: [],
        dataListUnit: [],
        // 加载更多
        loading: false,
        // 分页控制参数
        pageParams: {
          orderItemName: '',
          pageNo: 1, // 当前页数
          // total: 5, // 总共页数
          pageSize: 10 // 每页数据条数
        },
        total: 0
      };
    },
    watch: {
      "receivePatientData": {
        async handler(n) {
          this.dataList = [];
          if (JSON.stringify(n) !== "{}" && n.patientId) {
            this.dataList = [];
            this.search();
          } else {
            this.dataList = [];
            /*this.$message("该患者未建档，请开始建档");
            this.$router.push('/patientMaster/recordCreate');*/
          }
        },
        immediate: true,
        deep: true
      }
    },
    computed: {
      ...mapGetters("patientMaster", ["receivePatientData"]),
      disabled() {
        return this.loading || this.noMore;
      },
      noMore() {
        return Math.ceil(this.total / this.pageParams.pageSize) <= this.pageParams.pageNo;
      }
    },
    methods: {
      //搜索
      async getList() {
        this.loading = true;
        try {
          let params = {
            ...this.pageParams,
            patientId: this.receivePatientData.patientId
          };
          if (params.patientId) {
            let res = await getHistoryByPatient(params);
            /*this.dataList = [
              {
                hospital: "上海第一人民医院",
                time: "2019-10-23",
                recipe: [{recipeContent: "处方一"}, {recipeContent: "处方二"}]
              },
              {
                hospital: "上海第二人民医院",
                time: "2019-10-23",
                recipe: [{recipeContent: "处方一"}, {recipeContent: "处方二"}]
              }
            ];*/
            if(res.code == 1){
              this.dataListUnit = res.data;
              this.total = res.total;
            }else{
              this.$message.error(res.message || "获取就诊处方列表失败");
            }
          }
          this.loading = false;
        } catch (error) {
          this.loading = false;
          this.$message.error(error.message || "获取就诊处方列表失败");
        }
      },
      async search() {
        // debugger
        this.pageParams.pageNo = 1;
        await this.getList();
        this.preDataList = [...this.dataListUnit];
        this.dataList = this.handleData(this.preDataList);
      },
      // 触发加载函数
      async load() {
        if (this.noMore) {
          return;
        }
        this.pageParams.pageNo++;
        await this.getList();
        this.preDataList = this.preDataList.concat(this.dataListUnit);
        this.dataList = this.handleData(this.preDataList);
      },
      //处理数据
      handleData(arr) {
        var map = {},
          dest = [];
        for (var i = 0; i < arr.length; i++) {
          var ai = arr[i];
          if (!map[ai.recipeCode]) {
            dest.push({
              recipeCode: ai.recipeCode,
              diagnosisTime: ai.diagnosisTime,
              ouptDeptName: ai.ouptDeptName,
              orders: [ai]
            });
            map[ai.recipeCode] = ai;
          } else {
            for (var j = 0; j < dest.length; j++) {
              var dj = dest[j];
              if (dj.recipeCode == ai.recipeCode) {
                dj.orders.push(ai);
                break;
              }
            }
          }
        }
        return dest;
      }
    }
  };
</script>
<style lang="scss" scoped>
  .box {
    height: calc(100% - 40px);
  }

  .searchhospital {
    height: 40px;
    font-size: 14px;
    font-weight: bold;
    color: rgba(46, 50, 58, 1);
    line-height: 40px;
  }

  .mains {
    height: calc(100% - 36px);
    overflow-y: auto;

    .more {
      margin-top: 10px;
    }
  }
</style>
