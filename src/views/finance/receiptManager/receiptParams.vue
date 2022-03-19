<template>
  <el-card class="schedulsParams height100">
    <div class="left float-left height100">
      <div class="sche-collapse">
        <el-collapse v-model="collapseValue">
          <el-collapse-item :name="receiptList.name">
            <template slot="title">{{receiptList.title}}</template>
            <p :class="{'list-item':true, 'select':item.isSelect}"
               v-for="(item,index) in receiptList.list" :key="index"
               @click="unListClick(item,index)"
            >
              {{item.receiptName}}
            </p>
          </el-collapse-item>
          <!-- <el-collapse-item :name="paramList.name">
            <template slot="title">{{paramList.title}}</template>
            <p :class="{'list-item':true, 'select':item.isSelect}"
               v-for="(item,index) in paramList.list" :key="index"
               @click="inListClick(item,index)"
            >
              {{item.receiptName}}
            </p>
          </el-collapse-item> -->
        </el-collapse>
      </div>
    </div>
    <div class="right float-right height100">
      <receiptIn v-if="receiptList.list[0].isSelect"></receiptIn>
      <receiptOut v-else-if="receiptList.list[1].isSelect"></receiptOut>
      <useSelect v-else-if="receiptList.list[2].isSelect"></useSelect>
      <!-- <receiptVerification v-else-if="receiptList.list[3].isSelect"></receiptVerification> -->
      <receiptDict v-else-if="paramList.list[0].isSelect"></receiptDict>
    </div>
  </el-card>
</template>

<script>
  import receiptIn from "./components/receiptIn";
  import receiptOut from "./components/receiptOut";
  import receiptVerification from "./components/receiptVerification";
  import useSelect from "./components/useSelect";
  import receiptDict from "./components/receiptDict";

  export default {
    name: "receiptParams",
    components: {
      receiptIn,
      receiptOut,
      useSelect,
      receiptDict
    },
    data() {
      return {
        //展开列表
        collapseValue: ['receiptList', 'paramList'],
        //诊室管理
        receiptList: {
          name: 'receiptList',
          title: '票据管理',
          list: [
            {
              receiptName: '登记入库',
              isSelect: false
            },
            {
              receiptName: '领用出库',
              isSelect: false
            },
            {
              receiptName: '出库记录查询',
              isSelect: false
            }
          ]
        },
        //参数管理
        paramList: {
          name: 'paramList',
          title: '票据配置维护',
          list: [
            {
              receiptName: '字典目录',
              isSelect: false
            }
          ]
        },
        selectData: {}
      }
    },
    mounted() {
      this.receiptList['list'][0]['isSelect'] = true;
    },
    methods: {
      //点击listItem
      unListClick(item, index) {
        this.resetData();
        this.receiptList['list'][index]['isSelect'] = true;
        this.selectData = {
          ...this.receiptList['list'][index]
        };
      },
      inListClick(item, index) {
        this.resetData();
        this.paramList['list'][index]['isSelect'] = true;
        this.selectData = {
          ...this.paramList['list'][index]
        };
      },
      //所有选中数据还原
      resetData() {
        this.selectData = {};
        let uns = this.receiptList['list'];
        let ins = this.paramList['list'];
        for (let i in uns) {
          uns[i]['isSelect'] = false;
        }
        for (let i in ins) {
          ins[i]['isSelect'] = false;
        }
      }
    }
  }
</script>

<style lang="scss">
  .schedulsParams {
    .left {
      width: 287px;
      padding: 20px;
      border-right: 1px solid $l-color-bgcolor-11;

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
    }

    .right {
      width: calc(100% - 288px);
    }
  }
</style>
