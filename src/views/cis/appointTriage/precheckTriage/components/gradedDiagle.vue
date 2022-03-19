<template>
  <div class="dialog-con">
    <el-dialog
      title="格拉斯哥昏迷评分量表"
      :visible.sync="dialogVisible"
      width="620px"
      :before-close="handleClose"
    >
      <div class="sign-confirm-middle">
        <el-table
          :data="tableData"
          :span-method="objectSpanMethod"
          border
          style="width: 100%; margin-top: 20px"
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
              <template v-if="item.prop === 'right'">
                <el-radio
                  @change="changeGraded"
                  v-if="scope.row.id === 1"
                  v-model="radioOne"
                  :label="scope.row.right"
                  >{{ scope.row.labelName }}</el-radio
                >
                <el-radio
                  @change="changeGraded"
                  v-else-if="scope.row.id === 2"
                  v-model="radioTwo"
                  :label="scope.row.right"
                  >{{ scope.row.labelName }}</el-radio
                >
                <el-radio
                  @change="changeGraded"
                  v-else
                  v-model="radioThree"
                  :label="scope.row.right"
                  >{{ scope.row.labelName }}</el-radio
                >
              </template>
              <template v-else>
                <span>{{ scope.row[item.prop] }}</span>
              </template>
            </template>
          </el-table-column>
        </el-table>
        <p class="graged-con">
          评分
          <span class="graged-detail" v-show="gradeLevel != 0"
            >{{ gradeLevel }}分</span
          >
        </p>
      </div>
      <div slot="footer" class="sign-confirm-footer">
        <span class="dialog-footer">
          <el-button type="primary" @click="handleConfirm">确认</el-button>
          <el-button @click="handleClear">清空</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "gradedDiagle",
  methods: {
    // 关闭弹窗
    handleClose() {
      this.$emit("closeModel");
    },
    // 确认 按钮
    handleConfirm() {
      this.$emit("getGrade", {
        gradeLevel: this.gradeLevel
      });
      // 关闭弹窗
      this.handleClose();
    },
    // 清空 按钮
    handleClear() {
      if (this.gradeLevel == 0) {
        return;
      }
      this.gradeLevel = 0;
      this.radioOne = 0;
      this.radioTwo = 0;
      this.radioThree = 0;
    },
    // 合并列的选项
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
      return;
    },
    getSpanArr(data) {
      let pos;
      for (let i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1);
          pos = 0;
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].id === data[i - 1].id) {
            this.spanArr[pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            pos = i;
          }
        }
      }
    },
    changeGraded() {
      this.gradeLevel = this.calculate();
    },
    // 计算评分
    calculate() {
      return this.radioOne + this.radioTwo + this.radioThree;
    }
  },
  mounted: function() {
    // 组件创建完后获取数据，
    this.getSpanArr(this.tableData);
  },
  components: {},
  props: ["show"],
  data() {
    return {
      gradeLevel: 0,
      spanArr: [],
      radioOne: 0,
      radioTwo: 0,
      radioThree: 0,
      tableColumn: [
        {
          prop: "checkProject",
          label: "检查项目",
          width: "100"
        },
        {
          prop: "patientResponse",
          label: "患者反映",
          width: "150"
        },
        {
          prop: "graded",
          label: "评分",
          width: "100"
        },
        {
          prop: "right",
          label: "勾选",
          width: "50"
        }
      ],
      tableData: [
        {
          id: 1,
          checkProject: "睁眼反应",
          patientResponse: "任何刺激不睁眼",
          graded: "1",
          right: 1,
          labelName: ""
        },
        {
          id: 1,
          checkProject: "睁眼反应",
          patientResponse: "疼痛刺激睁眼",
          graded: "2",
          right: 2,
          labelName: ""
        },
        {
          id: 1,
          checkProject: "睁眼反应",
          patientResponse: "语言刺激时睁眼",
          graded: "3",
          right: 3,
          labelName: ""
        },
        {
          id: 1,
          checkProject: "睁眼反应",
          patientResponse: "自己睁眼",
          graded: "4",
          right: 4,
          labelName: ""
        },
        {
          id: 2,
          checkProject: "言语反应",
          patientResponse: "无语言",
          graded: "1",
          right: 1,
          labelName: ""
        },
        {
          id: 2,
          checkProject: "言语反应",
          patientResponse: "难以理解",
          graded: "2",
          right: 2,
          labelName: ""
        },
        {
          id: 2,
          checkProject: "言语反应",
          patientResponse: "能理解，不连贯",
          graded: "3",
          right: 3,
          labelName: ""
        },
        {
          id: 2,
          checkProject: "言语反应",
          patientResponse: "对话含糊",
          graded: "4",
          right: 4,
          labelName: ""
        },
        {
          id: 2,
          checkProject: "言语反应",
          patientResponse: "正常",
          graded: "5",
          right: 5,
          labelName: ""
        },
        {
          id: 3,
          checkProject: "非偏瘫侧运动反应",
          patientResponse: "对任何疼痛无运动反应",
          graded: "1",
          right: 1,
          labelName: ""
        },
        {
          id: 3,
          checkProject: "非偏瘫侧运动反应",
          patientResponse: "痛刺激时有伸展反应",
          graded: "2",
          right: 2,
          labelName: ""
        },
        {
          id: 3,
          checkProject: "非偏瘫侧运动反应",
          patientResponse: "痛刺激时有屈曲反应",
          graded: "3",
          right: 3,
          labelName: ""
        },
        {
          id: 3,
          checkProject: "非偏瘫侧运动反应",
          patientResponse: "痛刺激有逃避反应",
          graded: "4",
          right: 4,
          labelName: ""
        },
        {
          id: 3,
          checkProject: "非偏瘫侧运动反应",
          patientResponse: "痛刺激时能拨开医生的手",
          graded: "5",
          right: 5,
          labelName: ""
        },
        {
          id: 3,
          checkProject: "非偏瘫侧运动反应",
          patientResponse: "正常（执行指令）",
          graded: "6",
          right: 6,
          labelName: ""
        }
      ]
    };
  },
  computed: {
    dialogVisible() {
      return this.show;
    }
  }
};
</script>

<style lang='scss' scoped>
.dialog-con {
  .sign-confirm-middle {
    padding: 20px;
    .graged-con {
      margin-top: 20px;
      line-height: 30px;
      font-size: 14px;
      font-weight: 400;
      color: rgba(148, 157, 163, 1);
      .graged-detail {
        font-size: 16px;
        font-weight: bold;
        color: rgba(61, 125, 251, 1);
      }
    }
  }
  /deep/ .el-dialog__footer {
    padding: 20px;
    border-top: 1px solid rgba(228, 228, 228, 1);
  }
}
</style>
