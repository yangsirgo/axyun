<template>
  <div class="template-con">
    <div class="box-card">
      <el-tabs v-model="activeName" @tab-click="handleClickTab">
        <el-tab-pane
          :label="item.labelName"
          :key="index"
          :name="item.name"
          v-for="(item, index) in tabDateList"
        >
          <el-table
            header-cell-class-name="headerCls"
            row-class-name="rowStyleCls"
            ref="singleTable"
            :data="item.tabelList"
            highlight-current-row
            style="width: 100%"
            height="100%"
            v-loadmore="load"
            stripe
            border
            v-loading="item.isLoading"
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
              <!-- 操作列 处理 -->
              <template slot-scope="scope">
                <template v-if="item.prop === 'operation'">
                  <span class="operation-con" @click="openDetail(scope.row.id)"
                    >操作</span
                  >
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
    <el-dialog title="常用收费类" :visible.sync="dialogVisible" width="620px">
      <div class="tabel-con">
        <el-table
          header-cell-class-name="headerCls"
          row-class-name="rowStyleCls"
          ref="singleTable"
          :data="asyncTableData"
          height="250"
          highlight-current-row
          style="width: 100%"
          v-loadmore="load"
          stripe
          border
          v-loading="isLoading"
          element-loading-text="加载中..."
        >
          <el-table-column
            v-for="item in commonTableColumn"
            :key="item.label"
            :label="item.label"
            :prop="item.prop"
            align="left"
            show-overflow-tooltip
            header-align="left"
            :min-width="item.width"
          >
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="sign-confirm-footer">
        <el-button type="primary" @click="handleConfirm">使用</el-button>
        <el-button @click="handleCancelOrder">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "costTemplate",
  data() {
    return {
      load: false,
      isLoading: false,
      dialogVisible: false, // 控制弹窗显示
      activeName: "personage", // tab默认展示项
      // 表格的数据源
      tabDateList: [
        {
          labelName: "个人",
          name: "personage",
          tabelList: [
            {
              id: 1,
              templateName: "模板名称",
              remark: "1234",
              operation: "明细"
            },
            {
              id: 1,
              templateName: "模板名称",
              remark: "1234",
              operation: "明细"
            },
            {
              id: 1,
              templateName: "模板名称",
              remark: "1234",
              operation: "明细"
            },
            {
              id: 1,
              templateName: "模板名称",
              remark: "1234",
              operation: "明细"
            }
          ]
        },
        {
          labelName: "科室",
          name: "office",
          tabelList: [
            {
              id: 1,
              templateName: "模板名称",
              remark: "1234",
              operation: "明细"
            },
            {
              id: 1,
              templateName: "模板名称",
              remark: "1234",
              operation: "明细"
            },
            {
              id: 1,
              templateName: "模板名称",
              remark: "1234",
              operation: "明细"
            },
            {
              id: 1,
              templateName: "模板名称",
              remark: "1234",
              operation: "明细"
            }
          ]
        },
        {
          labelName: "全院",
          name: "hospitalWide",
          tabelList: [
            {
              templateName: "模板名称",
              remark: "1234",
              operation: "明细"
            },
            {
              templateName: "模板名称",
              remark: "1234",
              operation: "明细"
            },
            {
              templateName: "模板名称",
              remark: "1234",
              operation: "明细"
            },
            {
              templateName: "模板名称",
              remark: "1234",
              operation: "明细"
            }
          ]
        }
      ],
      // 表头配置
      tableColumn: [
        {
          prop: "templateName",
          label: "模板名称",
          width: "20"
        },
        {
          prop: "remark",
          label: "备注",
          width: "60"
        },
        {
          prop: "operation",
          label: "操作",
          width: "15"
        }
      ],
      // 常用收费类 表头配置
      commonTableColumn: [
        {
          prop: "name",
          label: "名称",
          width: "40"
        },
        {
          prop: "standard",
          label: "规格",
          width: "80"
        },
        {
          prop: "number",
          label: "数量",
          width: "30"
        }
      ],
      // 异步获取 弹出框 列表数据asyncTableData
      asyncTableData: [
        {
          id: 0,
          name: "胶皮条",
          standard: "1条",
          number: "1"
        },
        {
          id: 1,
          name: "静脉输液费",
          standard: "每次",
          number: "1"
        }
      ]
    };
  },
  methods: {
    // 点击tabs处理
    handleClickTab() {},
    // 打开具体某项收费详情
    openDetail(id) {
      console.log(id);
      let somethingid = id;
      // 请求接口 获取具体详情 和规格

      // 展示弹窗
      this.dialogVisible = true;
    },
    // 点击使用按钮  异步调用接口
    handleConfirm() {
      try {
        // 弹窗
        this.$confirm("确认使用此收费内容？", {
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
              title: "划价成功！",
              showClose: false,
              position: "bottom-right"
            });
          })
          .catch(() => {
            // 关闭弹窗
          });
        this.dialogVisible = false;
      } catch (error) {}
    },
    // 关闭弹窗
    handleCancelOrder() {
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.template-con {
  .box-card {
    padding: 20px 20px 20px 10px;
  }
  .operation-con {
    color: #3d7dfb;
    cursor: pointer;
  }
  .tabel-con {
    padding: 20px;
  }
  /deep/ .el-dialog__footer {
    padding: 20px;
    border-top: 1px solid rgba(228, 228, 228, 1);
  }
}
</style>
