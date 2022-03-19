<template>
  <div class="schePublish">
    <div class="title">排班发布情况记录</div>
    <!--<div class="search">
      <LFormtTitle label="周次"></LFormtTitle>
    </div>-->
    <div class="sche-collapse" v-loading="loading">
      <el-collapse v-model="collapseValue">
        <el-collapse-item :name="unDeptList.name">
          <template slot="title">{{unDeptList.title}}</template>
          <p :class="{'list-item':true, 'select':item.isSelect}"
             v-for="(item,index) in unDeptList.list" :key="index"
             @click="unListClick(item,index)"
          >
             <span
               tableName="sys_org"
               :conditionMap="{
                org_type: '_DEPT_',
                id: item.deptName
              }"
               columns="org_nm"
               v-tableTransform
             ></span>
          </p>
        </el-collapse-item>
        <el-collapse-item :name="inDeptList.name">
          <template slot="title">{{inDeptList.title}}</template>
          <p :class="{'list-item':true, 'select':item.isSelect}"
             v-for="(item,index) in inDeptList.list" :key="index"
             @click="inListClick(item,index)"
          >
            <span
              tableName="sys_org"
              :conditionMap="{
                org_type: '_DEPT_',
                id: item.deptName
              }"
              columns="org_nm"
              v-tableTransform
            ></span>
          </p>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="publish-all">
      <el-button type="primary" @click="publishAll" class="width100">发布所有</el-button>
    </div>
  </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex';
  import scheManagement from "@/api/schedule/scheduleManagement.js";

  export default {
    name: "schePublish",
    data() {
      return {
        loading: false,
        //展开列表
        collapseValue: ['unDeptList', 'inDeptList'],
        //未发布科室
        unDeptList: {
          name: 'unDeptList',
          title: '待发布科室',
          list: []
        },
        //已发布科室
        inDeptList: {
          name: 'inDeptList',
          title: '已发布科室',
          list: []
        },
        //选中的数据
        selectData: {}
      }
    },
    watch: {
      "sDept": {
        async handler(n) {
          this.$set(this.unDeptList, 'list', []);
          this.$set(this.inDeptList, 'list', []);
          if (n) {
            this.getDeptList();
          }
        },
        immediate: true,
        deep: true
      }
    },
    computed: {
      ...mapGetters("base", ["sDept"])
    },
    methods: {
      //获取各科室
      async getDeptList() {
        this.loading = true;
        try {
          let params = {
            startDate: this.sDept.startDate + ' 00:00:00',
            stopDate: this.sDept.stopDate + ' 23:59:59'
          };
          let data = await scheManagement.selectScheduleByStatus(params);
          if (data.code == "1") {
            await this.handleData(data.data);
          } else {
            this.$message.error(data.msg || "获取列表失败");
          }
          this.loading = false;
        } catch (error) {
          this.loading = false;
          this.$message.error(error.msg || "获取列表失败");
        }
      },
      //处理数据
      handleData(data) {
        let dataNew = JSON.parse(JSON.stringify(data));
        for (let i in dataNew) {
          if (dataNew[i] == '2') {
            this.unDeptList.list.push({
              deptName: i,
              isSelect: false
            });
          } else if (dataNew[i] == '1') {
            this.inDeptList.list.push({
              deptName: i,
              isSelect: false
            });
          }
        }
      },
      //点击listItem
      unListClick(item, index) {
        this.resetData();
        this.unDeptList['list'][index]['isSelect'] = true;
        this.selectData = {
          ...this.unDeptList['list'][index]
        };
      },
      inListClick(item, index) {
        this.resetData();
        this.inDeptList['list'][index]['isSelect'] = true;
        this.selectData = {
          ...this.inDeptList['list'][index]
        };
      },
      //所有选中数据还原
      resetData() {
        this.selectData = {};
        let uns = this.unDeptList['list'];
        let ins = this.inDeptList['list'];
        for (let i in uns) {
          uns[i]['isSelect'] = false;
        }
        for (let i in ins) {
          ins[i]['isSelect'] = false;
        }
      },
      //发布所有
      async publishAll() {
        this.loading = true;
        try {
          let params = {
            startDate: this.sDept.startDate + ' 00:00:00',
            stopDate: this.sDept.stopDate + ' 23:59:59'
          };
          let data = await scheManagement.releaseAllSchedule(params);
          if (data.code == "1") {
            this.$set(this.unDeptList, 'list', []);
            this.$set(this.inDeptList, 'list', []);
            await this.getDeptList();
          } else {
            this.$message.error(data.msg || "发布失败");
          }
          this.loading = false;
        } catch (error) {
          this.loading = false;
          this.$message.error(error.msg || "发布失败");
        }
      }
    }
  }
</script>

<style lang="scss">
  .schePublish {
    .title {
      margin: 20px 0 20px 10px;
      font-size: 18px;
      
      font-weight: bold;
      color: $l-color-fontcolor-3;
    }

    .sche-collapse {
      .el-collapse-item__header {
        font-size: $l-font-size;
        
        font-weight: bold;
        color: $l-color-fontcolor-3;
      }

      .el-collapse-item__content {
        padding: 0;
      }

      .list-item {
        height: 44px;
        padding-left: 10px;
        font-size: $l-font-size;
        
        font-weight: 400;
        color: $l-color-fontcolor-3;
        line-height: 44px;
        cursor: pointer;
      }

      .select {
        
        font-weight: bold;
        background-color: $l-color-bgcolor-12;
      }
    }

    .publish-all {
      width: calc(100% - 20px);
      margin: 20px 10px 0 10px;
    }
  }
</style>
