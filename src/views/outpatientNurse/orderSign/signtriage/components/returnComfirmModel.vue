<template>
  <div v-show="isShow" class="return-comfirm-model">
    <el-dialog
      title="回诊确认"
      :visible.sync="dialogVisible"
      width="985px"
      :before-close="handleClose"
    >
      <div class="return-confirm-middle">
        <div class="patient-info-con common-show">
          <p class="common">患者信息</p>
          <div class="patient-info detail-text-show">
            <p class="line-common">
              <span class="patient-item  first">
                <span class="name">姓名</span>
                <span
                  >{{ currentPatientInfo.patientInfo.patientName }}（{{
                    currentPatientInfo.patientInfo.sex === 0 ? "女" : "男"
                  }}，{{ currentPatientInfo.patientInfo.age }}岁）</span
                >
              </span>
              <span class="patient-item  second">
                <span class="name">门诊号</span>
                <span>{{ currentPatientInfo.patientInfo.outPNum }}</span>
              </span>
              <span class="patient-item  three">
                <span class="name">手机号</span>
                <span>{{ currentPatientInfo.patientInfo.phoneNum }}</span>
              </span>
            </p>
          </div>
        </div>
        <div class="patient-order-con common-show">
          <p class="common">就诊信息</p>
          <div class="order-info detail-text-show">
            <p class="line-common">
              <span class="patient-item  first">
                <span class="name">门诊名称</span>
                <span>{{ currentPatientInfo.orderInfo.outPName }}</span>
              </span>
              <span class="patient-item  second">
                <span class="name">门诊类型</span>
                <span>{{ currentPatientInfo.orderInfo.outPType }}</span>
              </span>
              <span class="patient-item  three">
                <span class="name">专家名称</span>
                <span>{{ currentPatientInfo.orderInfo.expertName }}</span>
              </span>
            </p>
            <p class="line-common">
              <span class="patient-item  first">
                <span class="name">就诊时间</span>
                <span>{{ currentPatientInfo.orderInfo.attendanceTime }}</span>
              </span>
              <span class="patient-item  second">
                <span class="name">缴费时间</span>
                <span>{{ currentPatientInfo.orderInfo.payTime }}</span>
              </span>
            </p>
          </div>
        </div>
        <div class="patient-order-con patient-doc-con common-show">
          <p class="common doc-msg">医技信息</p>
          <el-table
            ref="singleTable"
            :data="tabsList"
            highlight-current-row
            style="width: 100%"
            height="200"
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
              <template slot-scope="scope">
                <template v-if="item.prop === 'status'">
                  <span v-if="scope.row[item.prop] === 0">已取消</span>
                  <span v-if="scope.row[item.prop] === 1" class="status-active"
                    >已发布</span
                  >
                </template>
                <template v-else>
                  <span>{{ scope.row[item.prop] }}</span>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="return-confirm-footer">
        <span class="return-consult-msg">
          回诊信息：患者在{{ nextPatientInfo.queueNum }}号
          {{ nextPatientInfo.nextPatientName }} ({{
            nextPatientInfo.nextSex === 1 ? "男" : "女"
          }}, {{ nextPatientInfo.nextAge + "岁" }}) 后一位
        </span>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleConfirm">确认</el-button>
          <el-button @click="handleCancelOrder">取消</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// 获取 ajax请求方法
import { get } from "@/utils/request";
export default {
  name: "returnComfirmModel",
  props: ["isShow", "patientid"],
  data() {
    return {
      isLoading: false,
      // 下一位患者信息
      nextPatientInfo: {
        nextPatientName: "刘新宇", // 下一位患者姓名
        queueNum: "78", // 排队号
        nextSex: 1, // 1  男 0 女
        nextAge: 29
      },
      // 当前患者信息
      currentPatientInfo: {
        patientInfo: {
          patientName: "张海军",
          sex: 1,
          age: 31,
          outPNum: "00256543", //门诊号
          phoneNum: "15210584911" //手机号
        },
        // 预约信息
        orderInfo: {
          outPName: "泌尿外科", // 门诊名称
          outPType: "专家门诊", // 门诊类型
          expertName: "5210512", // 专家名称
          attendanceTime: "2019-06-29 10:21", // 就诊时间
          payTime: "2019-06-29 11:21" // 缴费时间
        }
      },
      tableColumn: [
        {
          prop: "projectName",
          label: "项目名称",
          width: "40"
        },
        { prop: "count", label: "数量", width: "16" },
        {
          prop: "status",
          label: "状态",
          width: "20"
        },
        {
          prop: "applyByDoc",
          label: "申请医生",
          width: "20"
        },
        { prop: "applyTime", label: "申请时间", width: "50" },
        {
          prop: "reportDoc",
          label: "报告医生",
          width: "20"
        },
        {
          prop: "reportTime",
          label: "报告时间",
          width: "50"
        }
      ],
      // tabel 数据源
      tabsList: [
        {
          projectName: "胸部CT胸部CT胸部CT胸部CT胸部CT胸部CT胸部CT胸部CT",
          count: "1",
          status: 0, //已取消
          applyByDoc: "顾海学",
          applyTime: "2019-01-10 10:20:36",
          reportDoc: "张三",
          reportTime: "2019-01-10 10:56:36"
        },
        {
          projectName: "胸部CT",
          count: "1",
          status: 0, //已取消
          applyByDoc: "顾海学",
          applyTime: "2019-01-10 10:20:36",
          reportDoc: "张三",
          reportTime: "2019-01-10 10:56:36"
        },
        {
          projectName: "胸部CT",
          count: "1",
          status: 0, //已取消
          applyByDoc: "顾海学",
          applyTime: "2019-01-10 10:20:36",
          reportDoc: "张三",
          reportTime: "2019-01-10 10:56:36"
        },
        {
          projectName: "胸部CT",
          count: "1",
          status: 0, //已取消
          applyByDoc: "顾海学",
          applyTime: "2019-01-10 10:20:36",
          reportDoc: "张三",
          reportTime: "2019-01-10 10:56:36"
        },
        {
          projectName: "胸部CT",
          count: "1",
          status: 0, //已取消
          applyByDoc: "顾海学",
          applyTime: "2019-01-10 10:20:36",
          reportDoc: "张三",
          reportTime: "2019-01-10 10:56:36"
        },
        {
          projectName: "胸部CT",
          count: "1",
          status: 0, //已取消
          applyByDoc: "顾海学",
          applyTime: "2019-01-10 10:20:36",
          reportDoc: "张三",
          reportTime: "2019-01-10 10:56:36"
        },
        {
          projectName: "胸部CT",
          count: "0",
          status: 1, //已取消
          applyByDoc: "顾海学",
          applyTime: "2019-01-10 10:20:36",
          reportDoc: "张三",
          reportTime: "2019-01-10 10:56:36"
        }
      ]
    };
  },
  computed: {
    dialogVisible() {
      return this.isShow;
    }
  },
  mounted() {},
  // 组件更新的时候调用
  updated() {
    this.updateData();
  },
  methods: {
    // dialog 右上角删除事件
    handleClose() {
      this.$emit("closeReturnModel");
    },
    updateData() {
      // 请求患者相关接口 获取数据
      // TODO request
      let patientid = this.patientid;
      try {
        // 异步调用接口方法 更新数据 包括
      } catch (error) {}
    },
    // 确定按钮点击事件
    handleConfirm() {
      // 调用后端接口 传递
      try {
        /**
         * 调用回诊确定的方法
         * 异步请求
         */

        // 关闭弹窗的逻辑
        this.handleClose();
        // 成功 tips提示
        this.$notify({
          type: "success",
          title: "回诊确认成功",
          showClose: false,
          position: "bottom-right"
        });
      } catch (error) {}
    },
    // 取消按钮点击事件
    handleCancelOrder() {
      // TODO: 是否有调用接口的逻辑
      try {
        /**
         * TODO 调用 接口的逻辑
         */

        // 关闭弹窗的逻辑
        this.handleClose();
      } catch (error) {}
    }
  }
};
</script>
<style lang="scss" scoped>
.return-comfirm-model {
  .return-confirm-middle {
    padding: 20px;
    .common-show {
      .common {
        height: 24px;
        line-height: 24px;
        font-size: 16px;
        
        font-weight: bold;
        color: rgba(46, 50, 58, 1);
      }
      .status-active {
        color: $l-color-primary;
      }
    }
    .patient-order-con {
      margin-top: 40px;
    }
    .patient-doc-con {
      padding-bottom: 30px;
      .doc-msg {
        margin-bottom: 20px;
      }
    }
    .detail-text-show {
      font-size: 0;
      .line-common {
        margin-top: 20px;
        
        font-weight: 400;
        .patient-item {
          font-size: 14px;
          color: rgba(46, 50, 58, 1);
          line-height: 20px;
          .name {
            
            font-weight: 400;
            color: rgba(148, 157, 163, 1);
          }
        }
        .first {
          display: inline-block;
          width: 244px;
        }
        .second {
          display: inline-block;
          width: 201px;
        }
      }
    }
  }
  .return-confirm-footer {
    .return-consult-msg {
      float: left;
      line-height: 36px;
      font-size: 14px;
      
      font-weight: 500;
      color: #949da3;
    }
  }

  /deep/ .el-dialog__footer {
    padding: 20px;
    border-top: 1px solid rgba(228, 228, 228, 1);
  }
}
</style>
