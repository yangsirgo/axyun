<template>
  <div
    class="box_container height100 clearfix"
    :class="curComponent ? 'shr' : ''"
    ref="page"
  >
    <div class="box_codntent height100">
      <div class="msg_bottom height100">
        <div class="zdlb_box">
          <div class="out_box">
            <diagnosisData
              ref="diagnosisData"
              :patientId="receivePatientData.patientId"
              :inpCode="receivePatientData.treatNo"
              :visitCode="receivePatientData.visitCode"
              :hosType="hosType"
              :receivePatientData="receivePatientData"
              @editTableRow="editTableRow"
              @handleSelectionChange="handleSelectionChange"
              @updateDiagAdds="updateDiagAdds"
            ></diagnosisData>
          </div>
          <div class="operation_button">
            <el-button
              type="primary"
              @click="addConfirm"
              v-hotKey="{ func: 'func_add1' }"
              >展开诊断</el-button
            >
            <el-button type="primary" plain @click="setDiagMainValied"
              >设置主诊断</el-button
            >
            <!-- <el-button type="primary" plain @click="copyTable">复制</el-button> -->
            <el-button
              type="primary"
              plain
              @click="saveAs"
              v-hotKey="{ func: 'func_add2' }"
              >存为模板</el-button
            >
            <el-button
              type="primary"
              plain
              @click="deleteTable"
              v-hotKey="{ func: 'func_delete' }"
              >删除</el-button
            >
          </div>
          <component
            :is="curComponent"
            :aOrE="aOrE"
            :asd="asd"
            :patientId="receivePatientData.patientId"
            :inpCode="receivePatientData.treatNo"
            :visitCode="receivePatientData.visitCode"
            :patientSex="receivePatientData.patientGender"
            :patientBirthday="receivePatientData.birthDate"
            :patientName="receivePatientData.patientName"
            :diagDoctorId="role.userId"
            :diagDoctorName="name"
            :deptId="role.deptId"
            :deptName="role.deptName"
            :clinicType="clinicType"
            :selectArr="multipleSelection"
            :hdm="hasDiagMain"
            :table="diagAdd"
            :hosType="hosType"
            :diagAdds="diagAdds"
            @addDiagHandler="addDiagHandler"
            @dialogVisibleFalse="dialogVisibleFalse"
            @rechargeConfirm="rechargeConfirmAdd"
            @rechargeCancel="rechargeCancelAdd"
            @card-loading="cardLoadChange"
            class="com-box"
          ></component>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { deleteDiag, listCopy, setDiagMian } from "@/api/common/diagnosis";
import diagnosisData from "./components/diagnosisData";
import diaAddEdit from "./components/addEdit";
import saveTem from "./components/saveTem";
import mixins from "./mixins/index";

export default {
  name: "index",
  mixins: [mixins],
  components: {
    diagnosisData,
    diaAddEdit,
    saveTem
  },
  props: ["hosType", "diagReloadData"], // hosType: 1：门诊 2：急诊 3：住院
  data() {
    return {
      multipleSelection: [], //当且选中项数量为1时可以编辑
      asd: {}, //编辑表格数据
      aOrE: true, // 判断新增or编辑
      curComponent: diaAddEdit, // 下部分显示的组件
      receivePatientData: {}, //当前患者信息
      diagAdds: []//诊断表格数据
    };
  },
  /**
   * 复制诊断按钮（copyTable）：
   * 1. 诊断列表多选的数据，有且只能选一条，复制接口

   * 添加诊断按钮（addConfirm）：
   * 1. 将表单组件显示

   * 删除诊断按钮（deleteTable）：
   * 1. 批量删除诊断列表多选的数据

   * 存为模板按钮（saveAs）：
   * 1. 诊断列表多选的数据，有且只能选一条，复制接口

   * 设置主诊断按钮（setDiagMain）：
   * 1. 诊断列表多选的数据，有且只能选一条，设置主诊断接口
   * * */
  methods: {
    //复制诊断
    copyTable() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning("请选择一条诊断!");
        return;
      }
      const dataList = this.multipleSelection.map(item => {
        return {
          ...item,
          diagMain: "0"
        };
      });
      listCopy(dataList)
        .then(res => {
          if (res.code === 1) {
            this.$message.success("复制成功");
            this.changeRef();
            this.$refs.diagnosisData.reLoadData();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {});
    },
    //添加诊断
    addConfirm() {
      this.curComponent = diaAddEdit;
      this.aOrE = true;
    },
    addDiagHandler(res) {
      this.aOrE = res;
    },
    //删除诊断
    deleteTable() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning("请选择要删除的诊断");
        return;
      }
      const flag = this.multipleSelection.some(item => item.diagMain === "1");

      this.$confirm("是否删除所选诊断？", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteDiag(this.multipleSelection)
            .then(async res => {
              if (res.code === 1) {
                this.$message.success("删除成功!");
                this.addConfirm();
                this.changeRef();
                if (this.clinicType === "1") {
                  // 删除诊断维护关系
                  const paramsObj = {
                    enId: this.receivePatientData.visitCode,
                    enTpCd: "01",
                    isHome: "0",
                    diagRelationList: this.multipleSelection.map(item => {
                      return {
                        diagCode: item.diagCode || '',
                        diagName: item.diagName
                      };
                    })
                  };
                  await this.deleteDiagRelationHandler(paramsObj);
                }
                // this.$refs.multipleTable.clearSelection();
                this.$refs.diagnosisData.reLoadData();
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch(err => {});
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //存为模板
    saveAs() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning("请最少选择一条诊断!");
        return;
      }

      if (this.multipleSelection.length !== 1) {
        this.$message.warning("请选择一条诊断!");
        return;
      }
      this.curComponent = saveTem;
    },
    // 校验主诊断是否为自定义
    setDiagMainValied() {
      if (this.multipleSelection.length !== 1) {
        this.$message.warning("请选择一条诊断!");
        return;
      }
      if (this.multipleSelection[0].diagMain === "1") {
        this.$message.warning("此诊断已是主诊断!");
        return;
      }

      if(this.multipleSelection[0].diagCode) {
        this.setDiagMain();
        return;
      }
      let htmls = '<p>主诊断为自定义诊断。</p><p>根据医保报销要求，主诊断为"自定义诊断"可能会影响医保患者的报销比例。</p>'
      this.$confirm(htmls, '请注意', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          dangerouslyUseHTMLString: true
        }).then(() => {
          this.setDiagMain();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消设置！'
          });          
        });
    },
    //设置主诊断
    setDiagMain() {
      this.$showLoading();
      setDiagMian(this.multipleSelection[0])
        .then(res => {
          if (res.code === 1) {
            // this.$refs.multipleTable.clearSelection();
            this.$refs.diagnosisData.reLoadData();
            this.changeRef();
            this.$message.success("设置成功!");
          } else {
            this.$message.error(res.msg);
          }
          this.$hideLoading();
        })
        .catch(err => {
          this.$hideLoading();
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.contain {
  height: auto;
}

.blue-color {
  color: $l-color-fontcolor-2;
}

.box_container {
  overflow: hidden;

  &.shr {
    .out_box {
      height: calc(100% - 297px);
    }
  }
}

.zdlb_box {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: $l-color-white;
  overflow: hidden;
  overflow-y: auto;
}

/deep/ .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 20px;
}

/deep/ .el-tabs--card > .el-tabs__header .el-tabs__nav {
  border: none;
}

/deep/ .el-tabs--card > .el-tabs__header .el-tabs__item {
  border: none;
}

.operation_button {
  text-align: right;

  .el-button--text {
    margin-right: 20px;
    color: $l-color-fontcolor-3;

    i {
      display: inline-block;
      margin-right: 10px;
    }
  }

  .el-button--text,
  .el-button--text:hover {
    color: $l-color-fontcolor-3;
  }
}

.msg_bottom {
  overflow: hidden;
  height: 100%;
}

.box_tabs {
  background-color: $l-color-white;
  width: 34.7%;
  height: 100%;
  padding: 0 20px;
  float: left;
}

.pagination {
  position: relative;
  right: 0;
}

/deep/ .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 20px;
}

.out_box {
  width: 100%;
  height: calc(100% - 57px);
  margin-bottom: 20px;
}

.consultation-tabs {
  position: relative;

  .el-tabs__header {
    height: 40px;
    margin-bottom: 15px;
    background-color: transparent;
  }

  /deep/ .el-tabs__content {
    height: auto;
  }

  .el-tab-pane {
    overflow: hidden;
    overflow-y: auto;
  }

  .allergy-form-btn {
    text-align: right;
  }

  /deep/ .el-form-item {
    margin-bottom: 18px;
  }

  /deep/ .el-form-item--medium .el-form-item__content {
    height: 36px;

    .el-form-item__error {
      padding-top: 3px;
    }
  }
}

.com-box {
  height: 220px;
  padding-top: 20px;
  margin-top: 20px;
  border-top: 1px solid $l-color-bgcolor-11;
  overflow: hidden;
  overflow-y: auto;
}
</style>
