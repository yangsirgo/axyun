<template>
  <div class="right-card">
    <div class="top-con">
      <p class="title-con">
        <span class="title-text">
          医嘱类别
        </span>
        <span>
          <el-radio v-model="radio" label="1">长期</el-radio>
          <el-radio v-model="radio" label="2">临时</el-radio>
          <el-radio v-model="radio" label="3">出院带药</el-radio>
        </span>
        <LSelectWithTitle
          style="margin-left:20px;width:300px;"
          filterable
          allow-create
          multiple
          :value="optionThree"
          :title="title"
        >
          <template>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </template>
        </LSelectWithTitle>
      </p>
      <div class="table-con-top">
        <el-table
          header-cell-class-name="headerCls"
          row-class-name="rowStyleCls"
          ref="singleTable"
          :data="tabsList"
          highlight-current-row
          style="width: 100%"
          v-loadmore="load"
          stripe
          border
          v-loading="isLoading"
          element-loading-text="加载中..."
        >
          <el-table-column
            v-for="item in tableColumn"
            :key="item.label"
            :label="item.label"
            :prop="item.prop"
            align="left"
            show-overflow-tooltip
            header-align="left"
            :min-width="item.width"
          >
            <!-- 状态列 处理 -->
            <template slot-scope="scope">
              <template v-if="item.prop === 'status'">
                <span class="special-class">{{
                  scope.row[item.prop] === 0 ? "停止" : "开始"
                }}</span>
              </template>
              <!-- 门诊号列 处理 -->
              <template v-else-if="item.prop === 'type'">
                <span>{{ scope.row[item.prop] === 0 ? "短期" : "长期" }}</span>
              </template>
              <template v-else>
                <span>{{ scope.row[item.prop] }}</span>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="center-con">
      <l-card-title class="clearfix card-header" ref="header">
        <span slot="left">[一级护理] 费用明细</span>
      </l-card-title>
      <p>
        <span>
          <el-radio v-model="radioOne" label="1"
            ><strong style="color:#2E323A">仅看可退</strong></el-radio
          >
        </span>
        <span class="tips">
          注:点击蓝色数字，查看已退明细
        </span>
      </p>
      <div class="middel-table-con">
        <el-table
          header-cell-class-name="headerCls"
          row-class-name="rowStyleCls"
          ref="singleTable"
          :data="tabsListTwo"
          highlight-current-row
          style="width: 100%"
          height="500px"
          v-loadmore="load"
          stripe
          border
          v-loading="isLoading"
          element-loading-text="加载中..."
        >
          <el-table-column
            v-for="item in tableColumnTwo"
            :key="item.label"
            :label="item.label"
            :prop="item.prop"
            align="left"
            show-overflow-tooltip
            header-align="left"
            :min-width="item.width"
            >>
            <template slot-scope="scope">
              <template v-if="item.prop === 'returnNum'">
                <popTable
                  ref="popTable"
                  :value="scope.row[item.prop]"
                  :showTableFlag="showTableFlag"
                  :tableData="showTableData"
                  :tableParams="showTableColumn"
                >
                  <!-- <span class="return-num"  @click="returnNum(scope.row.id)">{{

                  }}</span> -->
                </popTable>
              </template>
              <template v-else-if="item.prop === 'operate'">
                <span class="return-cost" @click="returnCost(scope.row.id)"
                  >退费</span
                >
              </template>
              <template v-else-if="item.prop === 'checkReturnNum'">
                <el-input-number
                  style="width: 100px"
                  v-model="scope.row.checkReturnNum"
                  controls-position="right"
                  @change="handleChange"
                ></el-input-number>
              </template>
              <template v-else>
                <span>{{ scope.row[item.prop] }}</span>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import LSelectWithTitle from "@/components/LSelectWithTitle.vue";
import popTable from "./popTable.vue";
export default {
  name: "",
  methods: {
    handleChange() {},
    // 弹窗
    returnNum(id) {
      console.log(id);
      // 异步获取数据
      this.showTableFlag = true;
    },
    // 退费按钮点击事件
    returnCost(id) {
      try {
        // 弹窗
        this.$confirm("确认退费", {
          dangerouslyUseHTMLString: true,
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          showClose: false,
          type: "warning"
        })
          .then(() => {
            // TODO: 取消预约相关逻辑 调用后台接口

            // 弹窗显示
            this.$notify({
              type: "success",
              title: "退费成功！",
              showClose: false,
              position: "bottom-right"
            });
          })
          .catch(() => {
            // 关闭弹窗
          });
      } catch (error) {}
    }
  },
  components: {
    LSelectWithTitle,
    popTable
  },
  data() {
    return {
      showTableFlag: false,
      title: "来源科室",
      radio: "1",
      radioOne: "1",
      optionThree: "1",
      load: false,
      isLoading: false,
      options: [{ value: "1", label: "泌尿外科" }],
      tableColumn: [
        {
          prop: "status",
          label: "状态",
          width: "20"
        },
        {
          prop: "type",
          label: "类型",
          width: "20"
        },
        {
          prop: "startDate",
          label: "开始时间",
          width: "50"
        },
        {
          prop: "stopDate",
          label: "停止时间",
          width: "50"
        },
        {
          prop: "name",
          label: "名称",
          width: "50"
        },
        {
          prop: "specification",
          label: "规格",
          width: "20"
        },
        {
          prop: "number",
          label: "数量",
          width: "20"
        },
        {
          prop: "doctorName",
          label: "开嘱人",
          width: "20"
        },
        {
          prop: "office",
          label: "开嘱科室",
          width: "20"
        },
        {
          prop: "execOffice",
          label: "执行科室",
          width: "20"
        }
      ],
      tabsList: [
        {
          id: 0,
          status: 0, // 停止
          type: 1, // 长期
          startDate: "2019-06-11 08:11",
          stopDate: "2019-07-20 18:00",
          name: "一级护理",
          specification: "每次",
          number: "12",
          doctorName: "王杰",
          office: "泌尿外科",
          execOffice: "泌尿外科"
        },
        {
          id: 1,
          status: 0, // 停止
          type: 1, // 长期
          startDate: "2019-06-11 08:11",
          stopDate: "2019-07-20 18:00",
          name: "一级护理",
          specification: "每次",
          number: "12",
          doctorName: "王杰",
          office: "泌尿外科",
          execOffice: ""
        }
      ],
      tableColumnTwo: [
        {
          prop: "costDate",
          label: "费用日期",
          width: "50"
        },
        {
          prop: "unitPrice",
          label: "单价",
          width: "50"
        },
        {
          prop: "amount",
          label: "数量",
          width: "50"
        },
        {
          prop: "returnNum",
          label: "已退数量",
          width: "50"
        },
        {
          prop: "checkReturnNum",
          label: "清退数量",
          width: "50"
        },
        {
          prop: "operate",
          label: "操作",
          width: "50"
        }
      ],
      tabsListTwo: [
        {
          id: 2,
          costDate: "2019-07-20 08:00",
          unitPrice: 10,
          amount: 5,
          returnNum: -2,
          checkReturnNum: 1
        }
      ],
      // 弹窗展示表格数据
      showTableData: [
        {
          id: 12,
          number: -1,
          operateTime: "2019-07-20 16:11",
          operater: "张静"
        },
        {
          id: 12,
          number: -2,
          operateTime: "2019-07-20 16:11",
          operater: "张静"
        }
      ],
      showTableColumn: [
        {
          prop: "number",
          label: "数量",
          width: "30"
        },
        {
          prop: "operateTime",
          label: "操作时间",
          width: "70"
        },
        {
          prop: "operater",
          label: "操作人",
          width: "40"
        },
        {
          prop: "operate",
          label: "操作",
          width: "30"
        }
      ]
    };
  }
};
</script>

<style lang='scss' scoped>
.right-card {
  padding: 20px;

  .table-con-top {
    margin-top: 20px;
    .special-class {
      color: $l-color-primary;
    }
  }
  .center-con {
    margin-top: 20px;
    height: 100%;
    .tips {
      margin-left: 20px;
      color: $l-color-primary;
    }
    .middel-table-con {
      margin-top: 20px;
      height: 100%;

      .return-cost {
        display: inline-block;
        width: 50px;
        text-align: center;
        border-radius: 2px;
        border: 1px solid rgba(228, 228, 228, 1);
        cursor: pointer;
      }
    }
  }
}
</style>
