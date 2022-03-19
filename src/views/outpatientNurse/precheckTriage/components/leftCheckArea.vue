<template>
  <div class="check-area">444
    <div class="top-con">
      <el-input
        class="input"
        placeholder="医保卡号、身份证、就诊卡"
        suffix-icon="el-icon-search"
        v-model="searchValue"
        style="width: calc(100% - 140px)"
        v-on:keyup.native.enter="selectPatientBySth"
      >
      </el-input>
      <span class="readCard" @click="readPatientInfo"
        ><em class="icon iconfont iconduka"></em>读卡</span
      >
      <el-button
        icon="iconfont iconshaixuan"
        ref="dropBtn"
        style="width:36px;height:36px;padding: 5px 0px; margin-left:10px;"
        @click="handleFilter"
      ></el-button>
    </div>
    <div class="middle-con">
      <el-tabs v-model="activeName" @tab-click="handleClickTab">
        <el-tab-pane
          :label="item.labelName"
          :key="index"
          :name="item.labelkey"
          v-for="(item, index) in tabDataList"
        >
          <el-table
            header-cell-class-name="headerCls"
            row-class-name="rowStyleCls"
            ref="singleTable"
            :data="item.tabsList"
            highlight-current-row
            style="width: 100%"
            v-loadmore="load"
            stripe
            v-loading="item.isLoading"
            element-loading-text="加载中..."
          >
            <el-table-column
              v-for="(item, idx) in tableColumn"
              :key="idx"
              :label="item.label"
              :prop="item.prop"
              align="left"
              show-overflow-tooltip
              header-align="left"
              :min-width="item.width"
            >
              <!-- 状态列 处理 -->
              <template slot-scope="scope">
                <!-- 门诊号列 处理 -->
                <template v-if="item.prop === 'outPatientNum'">
                  <span class="outPatientNum-color">{{
                    scope.row[item.prop]
                  }}</span>
                </template>
                <template v-else>
                  <span>{{ scope.row[item.prop] }}</span>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: "leftCheckArea",
  methods: {
    // 回车查询  TODO: 异步查询
    selectPatientBySth() {
      try {
      } catch (error) {}
    },
    mounted() {
      this.initTabelData();
    },
    // 筛选按钮 点击事件
    handleFilter() {
      try {
      } catch (error) {}
    },
    // 读卡 按钮点击操作
    readPatientInfo() {},
    // 点击tabs切换 触发的事件
    handleClickTab() {},
    // 初始化表格数据 TODO: 异步请求
    initTabelData() {
      try {
      } catch (error) {}
    }
  },
  components: {},
  data() {
    return {
      searchValue: "", // 搜索项
      activeName: "noneCheck", // 未预检
      load: false,
      tableColumn: [
        {
          prop: "outpatientNumber",
          width: "40",
          label: "门诊号"
        },
        {
          prop: "patientName",
          width: "20",
          label: "患者"
        },
        {
          prop: "sex",
          width: "10",
          label: ""
        },
        {
          prop: "age",
          width: "10",
          label: ""
        },
        {
          prop: "office",
          width: "40",
          label: "科室"
        }
      ],
      // 表格数据源
      tabDataList: [
        {
          labelName: "未预检",
          labelkey: "noneCheck",
          isLoading: false,
          tabsList: [
            {
              outpatientNumber: "0024093612",
              patientName: "吴兰",
              sex: 0, // 0 女 1 男
              age: 23,
              office: "发热门诊"
            },
            {
              outpatientNumber: "0024093612",
              patientName: "吴兰",
              sex: 0, // 0 女 1 男
              age: 23,
              office: "发热门诊"
            },
            {
              outpatientNumber: "0024093612",
              patientName: "吴兰",
              sex: 0, // 0 女 1 男
              age: 23,
              office: "发热门诊"
            }
          ]
        },
        {
          labelName: "已预检",
          labelkey: "checked",
          isLoading: false,
          tabsList: [
            {
              outpatientNumber: "0024093612",
              patientName: "吴兰",
              sex: 0, // 0 女 1 男
              age: 23,
              office: "发热门诊"
            },
            {
              outpatientNumber: "0024093612",
              patientName: "吴兰",
              sex: 0, // 0 女 1 男
              age: 23,
              office: "发热门诊"
            },
            {
              outpatientNumber: "0024093612",
              patientName: "吴兰",
              sex: 0, // 0 女 1 男
              age: 23,
              office: "发热门诊"
            }
          ]
        }
      ]
    };
  }
};
</script>

<style lang='scss' scoped>
.check-area {
  height: 100%;
  .top-con {
    padding: 20px;
    font-size: 0;
    border-bottom: 1px solid #e4e4e4;
    .readCard {
      display: inline-block;
      margin-left: 10px;
      width: 80px;
      height: 38px;
      background: rgba(19, 71, 150, 1);
      border-radius: 2px;
      cursor: pointer;
      color: #fff;
      line-height: 38px;
      text-align: center;
      font-size: 14px;
      
      font-weight: 500;
    }
    .middle-con {
      padding-left: 20px;
      padding-top: 20px;
      .outPatientNum-color {
        color: #3d7dfb;
      }
    }
  }
  /deep/ .el-tabs__nav-wrap.is-top {
    padding-left: 20px;
  }
}
</style>
