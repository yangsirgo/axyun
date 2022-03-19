<template>
  <div class="left-card">
    <div class="top-con">
      <el-input
        class="card-input"
        placeholder="医保卡号、身份证、就诊卡"
        suffix-icon="el-icon-search"
        v-model="searchValue"
        style="width: 280px; height:38px"
        v-on:keyup.native.enter="selectPatientBySth"
      >
      </el-input>
      <span class="readCard" @click="readPatientInfo"
        ><i class="icon iconfont iconduka"></i>读卡</span
      >
    </div>
    <div class="visit-message-con">
      <l-card-title class="clearfix card-header" ref="header">
        <span slot="left">就诊信息</span>
      </l-card-title>
      <div class="visit-msg-con">
        <div class="visit-msg">
          <el-row class="width100">
            <div class="colOne"><img class="img" :src="srcUrl" alt=""/></div>
            <div class="colOne col-style">
              <el-row class="width50 con-left-text">
                结算类型
              </el-row>
              <el-row class="width50 con-left-text top-distance">
                姓名
              </el-row>
              <el-row class="width50 con-left-text top-distance">
                年龄
              </el-row>
            </div>
            <div class="colOne col-style">
              <el-row class="width100 con-right-text">
                本地自费
              </el-row>
              <el-row class="width100 con-right-text top-distance">
                刘明海
              </el-row>
              <el-row class="width100 con-right-text top-distance">
                27岁
              </el-row>
            </div>
            <div class="colOne col-style">
              <el-row class="width50 con-left-text">
                卡片类型
              </el-row>
              <el-row class="width50 con-left-text top-distance">
                真实姓名
              </el-row>
              <el-row class="width50 con-left-text top-distance">
                出生日期
              </el-row>
            </div>
            <div class="colOne col-style">
              <el-row class="width100 con-right-text">
                院内就诊卡
              </el-row>
              <el-row class="width100 con-right-text top-distance">
                刘明海
              </el-row>
              <el-row class="width100 con-right-text top-distance">
                1997-11-11
              </el-row>
            </div>
            <div class="colOne col-style">
              <el-row class="width50 con-left-text"> </el-row>
              <el-row class="width50 con-left-text top-distance">
                性别
              </el-row>
              <el-row class="width50 con-left-text top-distance">
                账户余额
              </el-row>
            </div>
            <div class="colOne col-style">
              <el-row class="width100 con-right-text"> </el-row>
              <el-row class="width100 con-right-text top-distance">
                男
              </el-row>
              <el-row
                class="width100 con-right-text special-color top-distance"
              >
                0元
              </el-row>
            </div>
          </el-row>
          <el-row class="width100">
            <div class="colOne col-style col-left-one">
              <el-row class="width50 con-left-text"> </el-row>
              <el-row class="width50 con-left-text top-distance">
                联系电话
              </el-row>
              <el-row class="width50 con-left-text top-distance">
                就诊科室
              </el-row>
            </div>
            <div class="colOne col-style">
              <el-row class="width100 con-right-text top-distance">
                15311884811</el-row
              >
              <el-row class="width100 con-right-text top-distance">
                急诊内科
              </el-row>
            </div>
            <div class="colOne col-style col-left-two">
              <el-row class="width50 con-left-text"> </el-row>
              <el-row class="width50 con-left-text top-distance">
                身份证
              </el-row>
              <el-row class="width50 con-left-text top-distance">
                就诊医生
              </el-row>
            </div>
            <div class="colOne col-style">
              <el-row class="width100 con-right-text top-distance">
                410108198898762121</el-row
              >
              <el-row class="width100 con-right-text top-distance">
                胡敏
              </el-row>
            </div>
            <div class="col-style colOne">
              <el-row class="width50 con-left-text"> </el-row>
              <el-row class="width50 con-left-text top-distance">
                联系地址
              </el-row>
              <el-row class="width50 con-left-text top-distance">
                急诊分级
              </el-row>
            </div>
            <div class="colOne col-style">
              <el-row class="width100 con-right-text top-distance">
                上海市闵行区华中路大坪商厦</el-row
              >
              <el-row class="width100 con-right-text top-distance">
                二级
              </el-row>
            </div>
          </el-row>
        </div>
      </div>
      <l-card-title class="clearfix card-header" ref="header">
        <span slot="left">费用明细</span>
      </l-card-title>
      <div class="table-cost-con">
        <el-table
          ref="singleTable"
          highlight-current-row
          :data="tableData"
          height="300"
          border
          show-summary
          style="width: 100%"
        >
          <el-table-column
            v-for="item in tableColumn"
            :key="item.label"
            :label="item.label"
            :prop="item.prop"
            align="left"
            :min-width="item.width"
          >
            <template slot-scope="scope">
              <template v-if="item.prop === 'operate'">
                <span @click="handleDelItem(scope.row.id)" class="operate-click"
                  >删除</span
                >
              </template>

              <template v-else>
                <span>{{ scope.row[item.prop] }}</span>
              </template>
            </template>
          </el-table-column>
        </el-table>
        <div class="sign-confirm-footer">
          <el-button type="primary" @click="handlePost">提交划格</el-button>
          <el-button @click="handleKeep">暂存</el-button>
        </div>
      </div>
      <!-- 输入框插件 -->
      <LInputTable
        id="bottomFormInputTable"
        :popoverWidth="1000"
        v-model="autoComIpt"
        suffix-icon="el-icon-search"
        style="width:200px;"
        border
        :tableData="selectDrop.selectOptions"
        @query="search"
        @select="selectItem"
        :tableParams="selectDrop.tableColumn"
        placeholder="请输入"
      ></LInputTable>
    </div>
  </div>
</template>

<script>

export default {
  name: "leftCard",
  data() {
    return {
      autoComIpt: "",
      searchValue: "", // 异步查询需要携带的参数
      srcUrl: "", // 图片路径
      tableColumn: [
        {
          prop: "recipe",
          label: "处方",
          width: "10"
        },
        {
          prop: "projectType",
          label: "项目类型",
          width: "20"
        },
        {
          prop: "projectName",
          label: "项目名称",
          width: "40"
        },
        {
          prop: "group",
          label: "组套名",
          width: "10"
        },
        {
          prop: "standard",
          label: "规格",
          width: "10"
        },
        {
          prop: "unit",
          label: "单位",
          width: "10"
        },
        {
          prop: "price",
          label: "单价",
          width: "20"
        },
        {
          prop: "number",
          label: "数量",
          width: "10"
        },
        {
          prop: "cost",
          label: "金额",
          width: "20"
        },
        {
          prop: "executionTime",
          label: "执行时间",
          width: "20"
        },
        {
          prop: "operate",
          label: "操作",
          width: "10"
        }
      ],
      // 数据源
      tableData: [
        {
          id: 1,
          recipe: "1",
          projectType: "检验费",
          projectName: "尿常规",
          group: "-",
          standard: "每次",
          unit: "次",
          price: "50.00",
          number: 1,
          cost: "50.00",
          executionTime: "门诊检验科"
        },
        {
          id: 2,
          recipe: "2",
          projectType: "检验费",
          projectName: "尿常规",
          group: "-",
          standard: "每次",
          unit: "次",
          price: "50.00",
          number: 1,
          cost: "50.00",
          executionTime: "门诊检验科"
        },
        {
          id: 3,
          recipe: "3",
          projectType: "检验费",
          projectName: "尿常规",
          group: "-",
          standard: "每次",
          unit: "次",
          price: "50.00",
          number: 1,
          cost: "50.00",
          executionTime: "门诊检验科"
        }
      ],
      // 下拉table 配置的数据
      selectDrop: {
        drugItem: {}, // 选中医嘱信息
        displayList: [
          {
            title: "药品名称",
            prop: "orderItemName",
            value: ""
          },
          {
            title: "规格",
            prop: "spec",
            value: ""
          },
          {
            prop: "price",
            title: "单价",
            value: 0
          },
          {
            prop: "drugDosage",
            title: "剂量",
            value: ""
          },
          {
            prop: "amt",
            title: "金额",
            value: 0
          },
          {
            prop: "execDeptName",
            title: "执行科室",
            value: ""
          },
          {
            prop: "drugStock",
            title: "库存",
            value: ""
          },
          {
            prop: "stockNum",
            title: "预减库存",
            value: ""
          }
        ],
        tableColumn: [
          {
            prop: "recipe",
            label: "处方",
            width: "10"
          },
          {
            prop: "projectType",
            label: "项目类型",
            width: "20"
          },
          {
            prop: "projectName",
            label: "项目名称",
            width: "40"
          },
          {
            prop: "group",
            label: "组套名",
            width: "10"
          },
          {
            prop: "standard",
            label: "规格",
            width: "10"
          },
          {
            prop: "unit",
            label: "单位",
            width: "10"
          },
          {
            prop: "price",
            label: "单价",
            width: "20"
          },
          {
            prop: "number",
            label: "数量",
            width: "10"
          },
          {
            prop: "cost",
            label: "金额",
            width: "20"
          },
          {
            prop: "executionTime",
            label: "执行时间",
            width: "20"
          }
        ],
        unitOptions: [],
        selectOptions: [
          {
            id: 4,
            recipe: "4",
            projectType: "检验费",
            projectName: "尿常规",
            group: "-",
            standard: "每次",
            unit: "次",
            price: "50.00",
            number: 1,
            cost: "50.00",
            executionTime: "门诊检验科"
          },
          {
            id: 5,
            recipe: "5",
            projectType: "检验费",
            projectName: "尿常规",
            group: "-",
            standard: "每次",
            unit: "次",
            price: "50.00",
            number: 1,
            cost: "50.00",
            executionTime: "门诊检验科"
          },
          {
            id: 6,
            recipe: "6",
            projectType: "检验费",
            projectName: "尿常规",
            group: "-",
            standard: "每次",
            unit: "次",
            price: "50.00",
            number: 1,
            cost: "50.00",
            executionTime: "门诊检验科"
          }
        ]
      }
    };
  },
  methods: {
    // TODO: 执行搜索方法
    search() {
      // 执行搜索接口
      // this.selectDrop.selectOptions = req.data;
    },
    // 组件item选择 方法
    selectItem(row) {
      // 选中的数据添加到table中
      this.tableData.push(row);
    },
    readPatientInfo() {
      console.log("读卡操作");
    },
    // TODO: 回车异步查询
    selectPatientBySth() {
      // 非空检验
      if (this.searchValue.trim() === "") {
        return;
      }
      let searchValue = this.searchValue;

      // 回车查询
    },
    handleDelItem(id) {
      // 删除具体某项
      console.log(id);
      let tableIndex = this.tableData.findIndex((item, index) => {
        return item.id === id;
      });
      console.log(tableIndex);
      this.tableData.splice(tableIndex, 1);
    },
    handlePost() {
      //  提交划格
    },
    // 暂存方法
    handleKeep() {}
  }
};
</script>

<style lang="scss" scoped>
.left-card {
  .top-con {
    padding: 20px;
    border-bottom: 1px solid #e4e4e4;
    .card-input {
      font-size: 14px;
      
      .el-input__inner {
        height: 38px !important;
      }
    }
    .readCard {
      display: inline-block;
      margin-left: 10px;
      width: 170px;
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
  }
  .visit-message-con {
    .card-header {
      margin-left: 20px;
    }
    .visit-msg-con {
      margin-bottom: 20px;
      .visit-msg {
        font-size: 0;
        .colOne {
          display: inline-block;
          vertical-align: bottom;
        }
        .img {
          width: 80px;
          height: 102px;
          background: rgba(245, 245, 245, 1);
          border-radius: 2px;
          border: 1px solid rgba(228, 228, 228, 1);
          margin-left: 20px;
        }
        .col-style {
          margin-left: 20px;
        }
        .con-right-text {
          font-size: 14px;
          
          font-weight: 400;
          color: rgba(46, 50, 58, 1);
          line-height: 20px;
        }
        .con-left-text {
          font-size: 14px;
          
          font-weight: 400;
          color: rgba(148, 157, 163, 1);
          line-height: 20px;
        }
        .top-distance {
          margin-top: 20px;
        }
        .special-color {
          color: $l-color-primary;
        }

        .col-left-one {
          margin-left: 20px;
        }
        .col-left-two {
          margin-left: 30px;
        }
      }
    }
    .table-cost-con {
      padding: 0 20px;
      .operate-click {
        display: inline-block;
        width: 100%;
        text-align: center;
        background: rgba(245, 245, 245, 1);
        border-radius: 2px;
        border: 1px solid rgba(228, 228, 228, 1);
        cursor: pointer;
      }
      .sign-confirm-footer {
        margin-top: 20px;
        float: right;
      }
    }
  }
}
</style>

