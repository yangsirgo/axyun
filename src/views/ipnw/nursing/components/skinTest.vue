<template>
  <div class="height100 drug" v-loading="isLoading">
    <div class="right height100 position-relative" style="margin-left: 0px;">
      <div class="content padding20">
        <div class="top-table">
          <el-table
            :data="skinTestTableList.data"
            @row-click="selectRow"
            highlight-current-row
            border
            height="100%"
            style="width: 100%"
          >
            <el-table-column
              v-for="(item, index) in skinTestTableList.column"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
            >
              <template slot-scope="scope">
                <div v-if="!scope.row.startTime && item.prop === 'startTime'">
                  <el-button type="text" class="color2" @click="handleskintestStart(item)">执行皮试</el-button>
                </div>
                <div v-else-if="item.prop === 'status'" class="color1">
                  <span>{{statusArr[scope.row.status]}}</span>
                </div>
                <div v-else-if="item.prop === 'uses'" class="color1">
                  <span :val="scope.row[item.prop]" code="MedicationRouteCode" v-codeTransform></span>
                </div>
                <div v-else-if="item.prop === 'duration'" class="color1">
                  <span v-if="scope.row[item.prop]">{{scope.row[item.prop]}}分钟</span>
                  <span v-else></span>
                </div>
                <div
                  v-else-if="item.prop === 'stType'"
                  class="color1"
                >{{stTypeArr[scope.row[item.prop]]}}</div>
                <div v-else-if="item.prop === 'registerResult'" class="color1">
                  <span>{{registerResultArr[scope.row.registerResult]}}</span>
                </div>
                <div v-else-if="item.prop === 'deptCode'">
                  <span
                    tableName="sys_org"
                    :conditionMap="{org_type: '_DEPT_', id: scope.row[item.prop]}"
                    columns="org_nm"
                    v-tableTransform
                  ></span>
                </div>
                <div v-else>{{scope.row[item.prop]}}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="overflow-y: auto">
          <l-card-title>
            <span slot="left">皮试详情</span>
          </l-card-title>
          <div class="overflow-hidden detail">
            <div class="float-left">
              <span class="label">皮试药品</span>
              {{skinTestDetail.drugName || "-"}}
            </div>
            <div class="float-left">
              <span class="label">规格</span>
              {{skinTestDetail.spec || "-"}}
            </div>
            <div class="float-left">
              <span class="label">剂量</span>
              {{skinTestDetail.onceDosage || "-"}}
            </div>
            <div class="float-left">
              <span class="label">皮试类型</span>
              {{stTypeArr[skinTestDetail.stType] || "-"}}
            </div>
            <div class="float-left">
              <span class="label">皮试开始时间</span>
              {{skinTestDetail.executeTime || "-"}}
            </div>
            <div class="float-left">
              <span class="label">皮试结束时间</span>
              {{skinTestDetail.registerTime || "-"}}
            </div>
            <div class="float-left">
              <span class="label">皮试结果</span>
              {{registerResultArr[skinTestDetail.registerResult] || "-"}}
            </div>
            <!-- <div class="float-left">
              <span class="label">实验方式</span>
              {{skinTestDetail.testWay || "-"}}
            </div>-->
            <!-- <div class="float-left">
              <span class="label">过敏原</span>
              {{skinTestDetail.allergyName || "-"}}
            </div>-->
            <div class="float-left">
              <span class="label">症状描述</span>
              {{skinTestDetail.symptomDescription || "-"}}
            </div>
            <div class="float-left">
              <span class="label">备注</span>
              {{skinTestDetail.remark || "-"}}
            </div>
            <div class="float-left">
              <span class="label">皮试人</span>
              {{skinTestDetail.executorName || "-"}}
            </div>
            <div class="float-left">
              <span class="label">审核人</span>
              {{skinTestDetail.registerName || "-"}}
            </div>
          </div>
        </div>
      </div>

      <div class="bottom-box position-relative box1">
        <div class="execute-content float-left" style="width: 285px;padding: 0 20px;">
          <div class="overflow-hidden" style="padding-top: 0px;">
            <l-card-title>
              <span slot="left">执行皮试</span>
            </l-card-title>
            <div style="margin-bottom:15px">
              <LFormtTitle label="皮试时长">
                <el-input v-model="form.duration" style="line-height: 34px;" placeholder="请输入皮试时长" type="number" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))">
                  <template slot="append">分钟</template>
                </el-input>
              </LFormtTitle>
            </div>
            <div>
              <LFormtTitle label="开始时间">
                <el-date-picker
                  v-model="form.executeTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="请选择开始时间"
                ></el-date-picker>
              </LFormtTitle>
            </div>
            <el-button class="position-absolute exec-btn" @click="handleSkinTest">执行皮试</el-button>
          </div>
        </div>
        <div class="overflow-hidden height100 res-box">
          <el-form :rules="rules" ref="ruleForm" label-width="0px" :model="skinTestResForm">
            <l-card-title>
              <span slot="left">皮试结果</span>
            </l-card-title>
            <div class="float-left width100" style="margin-bottom:10px">
              <el-row style="margin-bottom:15px" :gutter="15">
                <el-col :span="6">
                  <el-form-item prop="registerResult">
                    <span class="label">皮试结果</span>
                    <el-radio v-model="skinTestResForm.registerResult" label="2">阴性</el-radio>
                    <el-radio v-model="skinTestResForm.registerResult" label="1">阳性</el-radio>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item prop="registerTime">
                    <LFormtTitle class="float-left" label="登记时间" style="width: 100%;">
                      <el-date-picker
                        v-model="skinTestResForm.registerTime"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间"
                      ></el-date-picker>
                    </LFormtTitle>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20" style="margin-bottom:15px">
                <el-col :span="12">
                  <el-form-item prop="symptomDescription1">
                    <span class="label float-left">症状描述</span>
                    <div class="more-selected" style="margin-left: 70px;">
                      <l-value-domain
                        remoteShowKey="name"
                        remoteValueKey="code"
                        :multiple="true"
                        code="AllergSymptomCode"
                        :value.sync="skinTestResForm.symptomDescription1"
                        placeholder="请选择"
                        @change="selectDescription"
                      ></l-value-domain>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <span class="label">备注</span>
                  <el-input
                    style="width:calc(100% - 45px)"
                    placeholder="备注"
                    v-model="skinTestResForm.remark"
                  ></el-input>
                </el-col>
              </el-row>
              <!-- <div class="float-left">
                <el-input
                  v-model="skinTestResForm.symptomDescription"
                  style="width: 200px;margin-left: 10px;"
                  placeholder="请输入其他描述"
                ></el-input>
              </div>-->
              <div
                class="overflow-hidden position-absolute"
                style="text-align: right;right: 20px;bottom: 20px;"
              >
                <el-button
                  type="primary"
                  style="border-radius: 2px;"
                  @click="submitForm('ruleForm')"
                >保存</el-button>
              </div>
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <el-dialog title="退回申请" width="600px" :visible.sync="dialogSkinTestVisible">
      <div class="padding20">
        <div style="margin: 10px auto 20px">
          <l-formt-title label="退回原因">
            <el-input v-model="reCallReason" placeholder="请输入退回原因"></el-input>
          </l-formt-title>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" style="border-radius: 2px;" @click="recall">退回</el-button>
        <el-button type="primary" plain @click="dialogSkinTestVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import patients from "../../components/PatientList";
import { skinTestList2, executeTest2, saveTestRes2 } from "@/api/ipnw/nursing";
export default {
  name: "skinTest",
  components: {
    patients
  },
  data() {
    return {
      isLoading: false, // 当前页面加载状态
      toolBoxs: ["AuxiliaryDiagnosis", "Hotkey"],

      SkinTestVisible: false, // 皮试开始dialog 显示隐藏
      ResInputVisible: false, // 皮试结果录入修改dialog 显示隐藏

      dialogSkinTestVisible: false, // 退回申请 dialog
      reCallReason: "", // 退回申请原因

      form: {
        // 开始皮试信息
        duration: "",
        executeTime: ""
      },

      testType: [
        // 试验方式list
        {
          label: "皮下注射",
          value: "1"
        }
      ],
      /*
       *  皮试执行
       */
      statusArr: {
        0: "未执行",
        1: "执行中",
        2: "已执行",
        /* 0: "暂存",
        1: "提交",
        2: "删除", */
        3: "审核",
        4: "停止",
        5: "作废",
        9: "打回",
        10: "审核停止",
        11: "审核停止通过",
        12: "审核停止打回",
        13: "未执行",
        14: "执行中",
        15: "已执行"
      },
      /*
       *  皮试结果
       */
      registerResultArr: {
        1: "阳性",
        2: "阴性"
      },
      /*
       *  皮试类型
       */
      stTypeArr: {
        0: "非必须皮试",
        1: "必须皮试"
      },
      item: {
        // 当前皮试执行患者基本信息
        patientId: 83274583745,
        queueUpNum: "05",
        patientName: "张一二",
        age: 22,
        patientGender: "男",
        settlementType: "医保",
        allergic: "头孢唑林钠过敏",
        res: "肾结石"
      },
      skinTestRes: false, // 皮试是否完成
      skinTestTableList: {
        column: [
          {
            prop: "status",
            label: "状态",
            width: 80
          },
          {
            prop: "registerResult",
            label: "皮试结果",
            width: 100
          },
          {
            prop: "duration",
            label: "皮试时长",
            width: 120
          },
          {
            prop: "executeTime",
            label: "皮试开始时间",
            width: 120
          },
          {
            prop: "drugName",
            label: "皮试药品",
            width: 150
          },
          {
            prop: "spec",
            label: "规格",
            width: 80
          },
          {
            prop: "onceDosage",
            label: "剂量",
            width: 80
          },
          {
            prop: "uses",
            label: "用药途径",
            width: 80
          },
          {
            prop: "stType",
            label: "皮试类型",
            width: 100
          },
          {
            prop: "remark",
            label: "备注",
            width: 150
          },
          {
            prop: "doctorName",
            label: "开嘱医生",
            width: 100
          },
          {
            prop: "diagnosisTime",
            label: "开嘱时间",
            width: 120
          },
          {
            prop: "inpDeptName",
            label: "开嘱科室",
            width: 100
          }
        ],
        data: []
      },
      skinTestDetail: {
        type: "", // 医嘱类型
        spec: "", // 规格
        onceDosage: "", // 剂量
        stType: "", // 皮试类型
        allergen: "", // 过敏原
        executeTime: "", // 皮试开始时间
        endTime: "", // 皮试结束时间
        registerResult: "", // 皮试结果
        testType: "", // 实验方式
        symptom: "", // 症状
        remark: "", // 备注
        skinTestUser: "", // 皮试人
        examineUser: "", // 审核人
        allergyName: "" // 过敏原
      },
      // skinTestDetail: null, // 当前所选
      skinTestResForm: {
        // 皮试结果录入、编辑Form
        timeRange: "",
        registerResult: "",
        symptomDescription1: [],
        remark: "",
        registerTime: "",
        symptomDescription: "",
        type: "",
        allergen: "",
        symptomIds: "" // 症状code
      }
    };
  },
  computed: {
    ...mapGetters(["receivePatientData"]),
    rules() {
      if (this.skinTestResForm.registerResult == 2) {
        return {
          timeRange: [
            {
              type: "array",
              required: true,
              message: "请选择日期",
              trigger: "blur"
            }
          ],
          /* registerResult: [
            { required: true, message: "请选择皮试结果", trigger: "change" }
          ], */
          /* registerTime: [
            {
              type: "date",
              required: true,
              message: "请选择时间",
              trigger: "change"
            }
          ], */
          type: [
            { required: true, message: "请选择试验方式", trigger: "change" }
          ]
        };
      } else {
        return {
          timeRange: [
            {
              type: "array",
              required: true,
              message: "请选择日期",
              trigger: "blur"
            }
          ],
          /* registerResult: [
            { required: true, message: "请选择皮试结果", trigger: "change" }
          ], */
          /* registerTime: [
            {
              type: "date",
              // required: true,
              message: "请选择时间",
              trigger: "change"
            }
          ], */
          symptomDescription: [
            {
              type: "array",
              required: true,
              message: "请选择症状",
              trigger: "change"
            }
          ],
          type: [
            { required: true, message: "请选择试验方式", trigger: "change" }
          ],
          allergen: [
            { required: true, message: "请选择过敏原", trigger: "change" }
          ]
        };
      }
    }
  },
  created() {
    this.fetchExecuteList(this.receivePatientData);
  },
  methods: {
    selectDescription(item, curItem) {
      console.log(item, curItem);
      let desStr = ""; // 症状
      let desStrCode = ""; // 症状code
      if (curItem.length > 0) {
        desStr = curItem[0].name;
        desStrCode = curItem[0].code;
      }
      if (curItem.length > 1) {
        for (let index = 1; index < curItem.length; index++) {
          desStr = desStr + "," + curItem[index].name;
          desStrCode = desStrCode + "," + curItem[index].code;
        }
      }
      this.skinTestResForm.symptomDescription = desStr;
      this.skinTestResForm.symptomIds = desStrCode;
      console.log(this.skinTestResForm, "this.skinTestResForm");
    },
    execute() {
      //
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    },
    recall() {
      // 退回
      this.dialogSkinTestVisible = true;
    },
    selectRow(row) {
      this.skinTestDetail = row;
      /* this.form.duration = row.duration;
      this.form.executeTime = row.executeTime; */
      console.log(this.skinTestDetail, "row - this.skinTestDetail");
      console.log(this.skinTestDetail, "this.skinTestDetail");
    },
    async handleSkinTest() {
      // 执行皮试
      if (this.skinTestDetail.status !== "0") {
        this.$message.warning("该状态下不能执行皮试");
        return;
      }
      if (
        this.form.duration === undefined ||
        this.form.executeTime === undefined
      ) {
        this.$message.warning("请填写皮试信息！");
        return;
      }
      if (!this.skinTestDetail.drugName) {
        this.$message.warning("请选择皮试药品！");
        return;
      }
      if (!this.receivePatientData.inpCode) {
        this.$message.warning("请选择患者！");
        return;
      }
      this.isLoading = true;
      let params = {
        ...this.form,
        allergyInfoId: this.skinTestDetail.allergyInfoId,
        orderIds: this.skinTestDetail.drugName,
        inpCode: this.receivePatientData.inpCode,
        id: this.skinTestDetail.id
      };
      try {
        let { code, data, msg } = await executeTest2(params);
        if (code === 1) {
          this.fetchExecuteList(this.receivePatientData);
          this.$message.success(msg);
        } else {
          this.$message.error(msg);
        }
        this.form.duration = "";
        this.form.executeTime = "";
        this.isLoading = false;
      } catch (error) {
        // this.$message.error()
        this.form.duration = "";
        this.form.executeTime = "";
        this.isLoading = false;
      }
    },
    handleskintestStart(item) {
      this.item = item;
      this.SkinTestVisible = true;
      this.ResInputVisible = false;
    },
    submitForm(formName) {
      // 确认执行皮试
      if (this.skinTestDetail.status !== "1") {
        this.$message.warning("该状态下不能执行不能保存");
        return;
      }
      if (!this.skinTestDetail.drugName) {
        this.$message.warning("请选择皮试药品！");
        return;
      }
      if (!this.skinTestResForm.registerResult) {
        this.$message.warning("请选择皮试结果！");
        return;
      }
      if (!this.receivePatientData.inpCode) {
        this.$message.warning("请选择患者！");
        return;
      }
      this.$confirm("皮试结果不可更改，是否确认保存", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.isLoading = true;
          this.$refs[formName].validate(async valid => {
            if (valid) {
              let params = {};
              params = {
                ...params,
                allergyInfoId: this.skinTestDetail.allergyInfoId,
                registerResult: this.skinTestResForm.registerResult,
                registerTime: this.skinTestResForm.registerTime,
                remark: this.skinTestResForm.remark,
                drugName: this.skinTestDetail.name,
                drugId: this.skinTestDetail.code,
                inpCode: this.receivePatientData.inpCode,
                id: this.skinTestDetail.id,
                symptomDescription: this.skinTestResForm.symptomDescription,
                symptomIds: this.skinTestResForm.symptomIds
              };
              console.log(params, "params");
              let { code, data, msg } = await saveTestRes2(params);
              if (code === 1) {
                this.skinTestResForm = {
                  timeRange: "",
                  registerResult: "",
                  symptomDescription1: [],
                  remark: "",
                  registerTime: "",
                  symptomDescription: "",
                  type: "",
                  allergen: ""
                };
                this.fetchExecuteList(this.receivePatientData);
                this.$message.success(msg);
              } else {
                this.skinTestResForm = {
                  timeRange: "",
                  registerResult: "",
                  symptomDescription1: [],
                  remark: "",
                  registerTime: "",
                  symptomDescription: "",
                  type: "",
                  allergen: ""
                };
                this.$message.error(msg);
              }
              this.isLoading = false;
            } else {
              this.skinTestResForm = {
                timeRange: "",
                registerResult: "",
                symptomDescription1: [],
                remark: "",
                registerTime: "",
                symptomDescription: "",
                type: "",
                allergen: ""
              };
              this.isLoading = false;
              return false;
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    timeEndcb() {
      // 皮试时间到回调
    },
    handleGetResult() {
      // 倒计时结束后 会 变成  查看皮试结果 button   是 点击button的事件
    },
    handleSkinTestPass() {
      // 皮试审核通过
    },
    skinTestResSave() {
      // 保存皮试结果
    },
    reset() {
      this.skinTestDetail = {
        type: "", // 医嘱类型
        spec: "", // 规格
        onceDosage: "", // 剂量
        stType: "", // 皮试类型
        allergen: "", // 过敏原
        executeTime: "", // 皮试开始时间
        endTime: "", // 皮试结束时间
        registerResult: "", // 皮试结果
        testType: "", // 实验方式
        symptom: "", // 症状
        remark: "", // 备注
        skinTestUser: "", // 皮试人
        examineUser: "", // 审核人
        allergyName: "" // 过敏原
      };
    },
    async fetchExecuteList(args) {
      console.log(args, "args");
      this.isLoading = true;
      this.reset();
      let status = [];
      let params = {};
      if (!args.inpCode && !args.visitCode) {
        // 未选中患者停止调用接口
        this.skinTestTableList.data = [];
        this.skinTestDetail = {};
        this.isLoading = false;
        return;
      }
      if (args.inpCode) {
        let inpCode = args.inpCode;
        params = {
          inpCode: [inpCode],
          status: []
        };
      } else if (args.visitCode) {
        let visitCode = args.visitCode;
        params = {
          visitCode: [visitCode],
          status: []
        };
      }
      try {
        let { code, data, msg } = await skinTestList2(params);
        if (code === 1) {
          this.grouping(data).then(res => {
            this.skinTestTableList.data = res;
          });
        } else {
          this.$message.error(msg);
          this.isLoading = false;
        }
      } catch (e) {
        this.isLoading = false;
      }
      this.isLoading = false;
    },
    grouping(list1) {
      // table 数据 成组操作
      // 将list 分组
      return new Promise((resolve, reject) => {
        let list = [];
        let groupList = [];
        let filterList = [];
        let tableList = [];
        groupList = list1.map(item => {
          // 获取所有组
          return item.groupNo;
        });

        groupList = Array.from(new Set(groupList));
        groupList = groupList.filter((item, index) => {
          // 数组去undefind
          return item !== undefined && item != "";
        });

        groupList.forEach((item, index) => {
          //遍历 成map结构 分组
          // list = [];
          filterList = list1.filter((sonItem, sonIde) => {
            return item === sonItem.groupNo;
          });
          list.push({
            key: item,
            value: filterList
          });
        });
        list.forEach(item => {
          // 将有组item添加class
          let itemList = item.value;
          if (itemList.length == 1) return;
          itemList.forEach((sonItem, sonIndex) => {
            if (sonIndex === 0) {
              sonItem.groupNoCls = "bunchingUp";
            } else if (sonIndex === itemList.length - 1) {
              sonItem.groupNoCls = "bunchingDown";
            } else {
              sonItem.groupNoCls = "bunchingCenter";
            }
          });
        });
        list.map(item => {
          // 更改list格式
          item.value.map(val => {
            tableList.push(val);
          });
        });
        list1.map(item => {
          // 补充未成组项
          if (!item.groupNo) {
            tableList.push(item);
          }
        });
        resolve(tableList);
      });
    },
    messageHandler() {
      consle.log("工具箱消息");
    },
    toolBoxMessage(moduleName, data) {
      if (moduleName != "PreviousPrescriptions") {
        return;
      }
    }
  },
  watch: {
    receivePatientData: {
      //深度监听，可监听到对象、数组的变化
      handler(val) {
        this.fetchExecuteList(val); // 监听 患者 ID 变化 触发事件
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
.color1 {
  color: $l-color-primary1;
}
.color2 {
  color: $l-color-fontcolor-2;
}
.color3 {
  color: $l-color-fontcolor-3;
}
.color6 {
  color: $l-color-border-6;
}
.color15 {
  color: $l-color-bgcolor-15;
}
.res-box {
  margin-left: 270px;
  border-left: 1px solid $l-color-bgcolor-11;
  padding: 0 20px;
}
.box1 {
  overflow-y: auto;
  border-top: 1px solid $l-color-bgcolor-11;
}
.exec-btn {
  border-radius: 2px;
  border-color: $l-color-primary1;
  color: $l-color-primary1;
  left: 150px;
  bottom: 20px;
}
.date-icon {
  top: 10px;
  right: 10px;
  color: $l-color-fontcolor-4;
}
.label {
  color: $l-color-fontcolor-4;
  margin-right: 10px;
}
.right {
  .detail {
    & > div {
      color: $l-color-fontcolor-3;
      line-height: 28px;
      min-width: 300px;
      .label {
        color: $l-color-fontcolor-4;
        margin-right: 10px;
        // min-width: 60px;
        display: inline-block;
      }
    }
  }
}
.normal {
  border-color: $l-color-primary;
  color: $l-color-primary;
  border-radius: 2px;
}
.top-table {
  height: calc(100% - 185px);
}
.allergydis {
  width: calc(100% - 210px);
}
.bottom-box {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  transition: all 0.5s;
  z-index: 1000;
  height: 260px;
  background-color: $l-color-white;
}
.content {
  height: calc(100% - 255px);
  overflow-y: auto;
}
.more-selected {
  /deep/ .el-select__tags {
    height: 33px;
    overflow: hidden;
    overflow-y: auto;
  }
}
</style>
