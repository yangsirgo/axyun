<template>
  <div class="base-info height100">
    <div class="top-con">
      <ul class="top-show">
        <li
          class="icon-item clearfix"
          v-for="(item, index) in iconList"
          :key="index"
        >
          <div class="left-con" :style="{ backgroundColor: item.bgColor }">
            <i class="iconfont" :class="[item.iconClass]"></i>
          </div>
          <div class="right-con">
            <p class="tips">{{ item.tips }}</p>
            <p class="num">{{ item.num }}</p>
          </div>
        </li>
      </ul>
    </div>
    <div class="body-con">
      <div class="left">
        <div class="title">
          <l-card-title>
            <template slot="left"
              >今日纳入路径病人一览</template
            >
          </l-card-title>
        </div>
        <div class="contain">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="入径" name="enterHospital">
              <el-table
                height="300"
                element-loading-text="加载中..."
                stripe
                border
                :data="tableList"
                highlight-current-row
              >
                <el-table-column
                  v-for="(item, index) in tableParams"
                  :key="index"
                  :prop="item.prop"
                  :label="item.label"
                  :min-width="item.width"
                  :align="item.align || 'left'"
                  :fixed="item.fixed"
                  show-overflow-tooltip
                >
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="退出" name="return">配置管理</el-tab-pane>
            <el-tab-pane label="完成" name="done">角色管理</el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div class="right">
        <div class="title">
          <l-card-title>
            <template slot="left"
              >七日路径使用情况</template
            >
          </l-card-title>
        </div>
        <div class="tain-con">
          <echartTable />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import echartTable from "./echartTable";

export default {
  name: "baseInfo",
  methods: {
    handleClick() {}
  },
  components: {
    echartTable
  },
  data() {
    return {
      tableList: [
        {
          office: "泌尿外科",
          ouptDeptId: "2389423",
          patientName: "李明"
        }
      ],
      tableParams: [
        {
          label: "科室",
          prop: "office",
          width: "100",
          align: "left",
          fixed: true
        },
        {
          label: "住院号",
          prop: "ouptDeptId",
          width: "100",
          align: "left",
          fixed: false
        },
        {
          label: "姓名",
          prop: "patientName",
          width: "180",
          align: "left",
          fixed: false
        }
      ],
      activeName: "enterHospital",
      iconList: [
        {
          iconClass: "iconjinriruyuanhuanzhe",
          bgColor: "#F05B23",
          num: "239人",
          tips: "今日入院人数"
        },
        {
          iconClass: "iconjinrichuyuanhuanzhe",
          bgColor: "#134796",
          num: "34人",
          tips: "今日出院人数"
        },
        {
          iconClass: "iconqianjin",
          bgColor: "#F05B23",
          num: "21人",
          tips: "进入路径人数"
        },
        {
          iconClass: "iconhoutui",
          bgColor: "#134796",
          num: "71人",
          tips: "退出路径人数"
        },
        {
          iconClass: "icondianzishenqing",
          bgColor: "#2f3239",
          num: "12人",
          tips: "完成路径人数"
        }
      ]
    };
  }
};
</script>

<style lang='scss' scoped>
.base-info {
  padding: 20px;
  .top-con {
    width: 100%;
    height: 80px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    .top-show {
      display: flex;
      height: 100%;
      justify-content: space-around;
      align-items: center;
      .icon-item {
        width: 15%;
        .left-con {
          margin-left: 15px;
          float: left;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 46px;
          height: 46px;
          border-radius: 4px;
          .iconfont {
            color: #fff;
          }
        }
        .right-con {
          float: left;
          margin-left: 20px;
          
          .num {
            font-size: 20px;
            font-weight: bold;
            color: rgba(46, 50, 58, 1);
            line-height: 29px;
          }
          .tips {
            font-size: 14px;
            font-weight: 400;
            color: rgba(148, 157, 163, 1);
            line-height: 20px;
          }
        }
      }
    }
  }
  .body-con {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    .title {
      width: 100%;
      padding-left: 20px;
      border-bottom: 1px solid #e4e4e4;
    }
    .left {
      width: 320px;
      .contain {
        height: calc(100% - 100px);
      }
    }
    .right {
      margin-left: 20px;
      flex: 1;
      .tain-con {
        width: 100%;
        height: 100%;
      }
    }
  }

  .iconfont {
    font-size: 30px;
  }
}
</style>
