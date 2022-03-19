<template>
  <div class="wrapperCls">
    <el-row class="btnPart">
      <el-col :span="12" style="text-align: center">
        <el-button size="mini">撤 销</el-button>
      </el-col>
      <el-col :span="12" style="text-align: center">
        <el-button size="mini">刷 新</el-button>
      </el-col>
    </el-row>
    <div class="infinite-list-wrapper" v-loading="loading">
      <div
        class="list-container overflow-scroll-vertical"
        v-infinite-scroll="loadNextPage"
        :infinite-scroll-disabled="listDisabled"
      >
        <div
          :class="curSelectedIndex === i ? 'list-item active' : 'list-item'"
          v-for="(item, i) in purchaseList"
          :key="i"
          @click="handleSelectedItem(i, item)"
        >
          <!--申请单状态-->
          <div :class="item.status == 2 ? 'status' : 'status status-active'">
            <span>皮试中</span>
          </div>

          <el-row class="item-label">
            <el-col :span="24">
              <span class="rep">{{ item.purchaseNum }}</span>
            </el-col>
          </el-row>

          <el-row class="item-label">
            <el-col :span="24">
              <span class="label margin-right-6">姓名:</span>
              <span>{{item.name}}</span>
            </el-col>
          </el-row>

          <el-row class="item-label">
            <el-col :span="10">
              <span class="label margin-right-6">年龄:</span>
              <span>{{item.age}}</span>
            </el-col>
            <el-col :span="14">
              <span class="label margin-right-6">性别:</span>
              <span>{{item.sex}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="14">
              <count-down  :start-time="item.serverTime"
                           @time-end="callback">
              </count-down>
            </el-col>
          </el-row>
        </div>
        <p v-if="!loading && noMore" class="load-list-bottom">{{ $t("base.noMore") }}</p>
      </div>
    </div>


  </div>
</template>

<script>

  import countDown from "./Countdown.vue"
  
  import {findPatientTimeListExecutoryContractByExecType, findPatientRightListExecutoryContractByExecType} from "@/api/cis/visit/visit";

  export default {
    name: "skinTesting",
    props: ['params'],
    components: { countDown },
    data() {
      return {
        testBtnShow:true,
        loading:false,
        pageParams: {
          pageNo: 1, // 当前页数
          total: 0, // 总共条数
          pageSize: 5 // 每页数据条数
        },
        // 分页数据
        // pagination: {
        //   currentPage: 1,
        //   pageSize: 10,
        //   total: 1
        // },
        curSelectedIndex: 0,
        purchaseList: [{
          purchaseNum:'112233',
          name:"测试人员",
          age:"88",
          sex:"男",
          serverTime:1200 * 1000 //毫秒数
        },{
          purchaseNum:'112233',
          name:"测试人员",
          age:"88",
          sex:"男",
          serverTime:600 * 1000 //毫秒数
        }],
      };
    },
    created() {

    },
    mounted() {

    },
    methods: {
      callback () {
        console.log("到点儿了");
      },
      // 加载下一页
      loadNextPage() {
        if (this.noMore) {
          return;
        }
        this.pageParams.pageNo++;
        this.loadTable();
      },
      handleSelectedItem(i, item) {
        if (!item) return;
        this.curSelectedIndex = i;
        this.$emit("selectIdChange", item);
      },
      loadTable() {
        this.loading = true;
        // let queryData = { ...this.pageParams };
        
        let param = {
          patientIds: this.params.hasOwnProperty('searchReasult') ? this.params.searchReasult : '',
          startDate: this.params.hasOwnProperty('startDate') ? this.params.startDate : '',
          stopDate: this.params.hasOwnProperty('stopDate') ? this.params.stopDate : '',
          type: this.activeName,
          technicalOffices: this.params.hasOwnProperty('technicalOffices') ? this.params.technicalOffices : '',
          visitCode: this.params.hasOwnProperty('searchValue') ? this.params.searchValue : '',
          areaId: this.params.areaId,
          roomId: this.params.roomId,
          appointmentMode: this.params.appointmentMode,
          execType: 2,
          execStatus: 1,
          patientName: this.params && this.params.hasOwnProperty('searchValue') ? this.params.searchValue : '',
        }
        let params = {
          pageNo: this.pageParams.pageNo,
          pageSize: this.pageParams.pageSize,
          ...param
        };
        console.log("findPatientTimeListExecutoryContractByExecType",params)
        // queryData.orderBy = this.orderBy;
        // queryData.sDate =
        //   (this.formSearch.entryTime && this.formSearch.entryTime[0]) || ""; //开始日期
        // queryData.eDate =
        //   (this.formSearch.entryTime && this.formSearch.entryTime[1]) || ""; //结束日期
        // queryData.status = this.formSearch.status || ""; //单据状态
        // queryData.num = this.formSearch.purchaserNum; //采购单号
        // queryData.supplierCode = this.formSearch.supplierCode; //供应商
        // queryData.storageCode = this.formSearch.storageCode; //采购药库
        findPatientTimeListExecutoryContractByExecType(params, false).then(res => {
            this.loading = false;
            if (res.code == 1) {
              let list = res.data.map(item => {
                let estr = item.entryTime ? item.entryTime.split(":") : "";
                let sstr = item.submitPersonTime
                  ? item.submitPersonTime.split(":")
                  : "";
                return {
                  ...item,
                  entryTime: estr ? estr[0] + ":" + estr[1] : estr,
                  submitPersonTime: sstr ? sstr[0] + ":" + sstr[1] : sstr
                };
              });
              if (this.pageParams.pageNo === 1) {
                this.purchaseList = list;
                this.handleSelectedItem(0, this.purchaseList[0] || {});
              } else {
                this.purchaseList = this.purchaseList.concat(list);
              }
              this.pageParams = res.pageParams;
            } else {
              this.$message.error(res.msg || "获取数据失败");
            }
            this.pageParams = res.pageParams;
          })
          .catch(res => {
            this.loading = false;
            this.$message.error(res.msg || "查询失败");
          });
      },
    },
    watch: {},
    computed: {
      listDisabled() {
        return this.loading || this.noMore;
      },
      noMore() {
        return (
          Math.ceil(this.pageParams.total / this.pageParams.pageSize) <=
          this.pageParams.pageNo
        );
      }
    },
  }
</script>

<style scoped lang="scss">
  .wrapperCls {
    .btnPart {
      margin: 10px 0;
    }
    .infinite-list-wrapper {
      width: 100%;
    }
    .list-container {
      height: 100%;
      .list-item {
        padding: 6px 14px;
        position: relative;

        .status {
          position: absolute;
          right: 10px;
          top: 10px;
          z-index: 999;
        }

        .status-active {
          color: $l-color-primary;
        }

        .item-label {
          line-height: 28px;
          color: $l-color-fontcolor-3;
          .el-col {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            span {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              &.rep {
                width: 100% !important;
                font-weight: bold;
              }
            }
            &:first-child {
              span {
                &:first-child {
                  width: 60px;
                  text-align-last: justify;
                  -moz-text-align-last: justify; //兼容firefox
                  text-align: justify;
                  text-justify: distribute-all-lines; //兼容ie
                  display: block; //ie下需设为block
                }
              }
            }
          }
          .label {
            float: left;
            color: $l-color-fontcolor-4;
            font-size: $l-font-size;
            white-space: nowrap;
          }
          .label2 {
            float: left;
            width: 230px;
          }

          .minwidth {
            min-width: 80px;
            display: inline-block;
          }
        }
      }

      .delicon {
        cursor: pointer;
        display: inline-block;
        font-size: 16px;
        color: #949da3;
        .el-icon-delete {
          vertical-align: middle;
        }
      }

      .delicon:hover {
        i {
          color: $l-color-primary;
        }
      }

      .list-item:nth-child(even) {
        background: $l-color-bgcolor-18;
      }

      .active {
        background-color: $l-color-bgcolor-12 !important;
      }
    }
  }
</style>
