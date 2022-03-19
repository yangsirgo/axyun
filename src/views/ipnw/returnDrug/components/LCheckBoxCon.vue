<template>
  <div class="l-checkbox-con">
    <div class="top-level">
      <el-checkbox v-model="radio"></el-checkbox>
      <span class="number">05</span>
      床
      <span class="name">刘明</span>
      <span class="sex">男</span>
      <span class="age">23岁</span>
    </div>
    <div class="second-level">
      <el-collapse v-model="activeNames" @change="handleChange">
        <l-collapse-item
          v-for="(parentItem, $index) in collapseData"
          :name="$index"
          :key="$index"
        >
          <div slot="title">
            <span class="title-item">{{ parentItem.title }} </span>
          </div>
          <div slot="content">
            <div class="table-wrapper">
              <el-table
                header-cell-class-name="headerCls"
                row-class-name="rowStyleCls"
                ref="singleTable"
                :data="parentItem.itemData"
                highlight-current-row
                style="width: 100%"
                stripe
                border
                element-loading-text="加载中..."
              >
                <el-table-column type="selection" width="40"> </el-table-column>
                <el-table-column
                  v-for="item in collapseTableColumn"
                  :key="item.label"
                  :label="item.label"
                  :prop="item.prop"
                  align="left"
                  show-overflow-tooltip
                  header-align="left"
                  :min-width="item.width"
                >
                  <template slot-scope="scope">
                    <template v-if="item.prop === 'checkNum'">
                      <el-checkbox-group v-model="scope.row.checkValue">
                        <el-checkbox
                          v-for="checkItem in scope.row.checkList"
                          :label="checkItem.label"
                          :key="checkItem.label"
                          >{{ checkItem.time }}</el-checkbox
                        >
                      </el-checkbox-group>
                    </template>
                    <template v-else>
                      <span>{{ scope.row[item.prop] }}</span>
                    </template>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </l-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import LCollapseItem from "@/components/LCollapseItem.vue";
export default {
  name: "LCheckBoxCon",
  methods: {
    handleChange() {},
    initData(id) {
      // 异步获取数据
    }
  },
  components: {
    LCollapseItem
  },
  mounted() {
    this.initData();
  },
  data() {
    return {
      radio: "",
      activeNames: [0],
      collapseTableColumn: [
        {
          prop: "status",
          label: "状态",
          width: "10"
        },
        {
          prop: "adviceProperty",
          label: "医嘱属性",
          width: "15"
        },
        {
          prop: "startDate",
          label: "开始时间",
          width: "25"
        },
        {
          prop: "projectName",
          label: "名称",
          width: "40"
        },
        {
          prop: "singleUse",
          label: "单次剂量",
          width: "20"
        },
        {
          prop: "usage",
          label: "用法",
          width: "20"
        },
        {
          prop: "frequency",
          label: "频次",
          width: "10"
        },
        {
          prop: "applyNum",
          label: "申领数量",
          width: "15"
        },
        {
          prop: "returnNum",
          label: "已退数量",
          width: "20"
        },
        {
          prop: "checkNum",
          label: "清退数量",
          width: "50"
        }
      ],
      collapseData: [
        {
          applicationDate: "2018-02-03 12:00",
          title:
            "0.9%氯化钠注射液+长春西汀注射液（可退药：3，可取消退药数：1）",
          itemData: [
            {
              status: "未发药",
              adviceProperty: "长期", //项目名称
              startDate: "2019-06-11 18:11",
              projectName: "0.9%氧化钠注射液",
              singleUse: "100ml", //单次用量
              usage: "静脉滴注", //单位
              frequency: "bid",
              applyNum: "4 支",
              returnNum: "2 （12:00）",
              checkNum: "（13:00）",
              checkValue: [],
              checkList: [
                {
                  label: 3,
                  time: "2（13:00）"
                },
                {
                  label: 6,
                  time: "2（15:00）"
                },
                {
                  label: 9,
                  time: "2（18:00）"
                }
              ],
              id: 1111 //id
            },
            {
              status: "未发药",
              adviceProperty: "长期", //项目名称
              startDate: "2019-06-11 18:11",
              projectName: "0.9%氧化钠注射液",
              singleUse: "100mg", //单次用量
              usage: "静脉滴注", //单位
              frequency: "bid",
              applyNum: "4 支",
              returnNum: "2 （12:00）",
              checkNum: "（13:00）",
              checkValue: [],
              checkList: [
                {
                  label: 3,
                  time: "2（13:00）"
                },
                {
                  label: 6,
                  time: "2（15:00）"
                }
              ],
              id: 2222 //id
            }
          ]
        }
      ]
    };
  }
};
</script>

<style lang='scss' scoped>
.l-checkbox-con {
  margin-top: 20px;
  width: 100%;
  .top-level {
    width: 100%;
    padding: 9px;
    background: $l-color-bgcolor-18;
    font-size: 14px;
    
    font-weight: 400;
    color: rgba(46, 50, 58, 1);
    .number {
      margin-left: 10px;
      font-size: 20px;
      
    }
    .name {
      margin-left: 15px;
    }
    .sex {
      margin-left: 20px;
    }
    .age {
      margin-left: 20px;
    }
  }
  .second-level {
    margin-top: 10px;
    padding-left: 36px;
    .table-wrapper {
      margin-top: 10px;
      padding-right: 0;
      width: 100%;
    }
    .el-collapse {
      border: 0;
    }
  }
  /deep/ .el-date-editor .el-range__icon {
    float: right;
  }
}
</style>
