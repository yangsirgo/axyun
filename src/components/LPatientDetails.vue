<template>
  <div>
    <div class="msg_header clearfix" v-if="type === 'default'">
      <div v-if="item.patientName" class="msg_header_inner">
        <div class="person fl">
          <span class="person_num">{{ item.appointmentCode | fillZero }}</span>
          <span class="person_number">{{ filterPatientCode }}</span>
          <span>{{ item.patientName }}</span>
          <span
            :val="item.patientGender"
            code="GENDER_CODE"
            v-codeTransform
            v-if="item.patientGender"
          ></span>
          <!--<span v-if="item.age">{{item.age}} 岁</span>-->
          <span>{{ item.patientAge }}</span>
          <span class="pad20"
                :val="item.settlementType"
                code="settlementType"
                v-codeTransform
                v-if="item.settlementType">
          </span>
          <span :val="item.rediagStatus" code="FirstOrNo" v-codeTransform v-if="item.rediagStatus"></span>
        </div>
        <div class="fl nav-gap-wrap" v-if="item.symptomDescription || item.diagName">
          <div class="nav-gap"></div>
        </div>
        <!--        <div class="docter fl" v-if="item.symptomDescription || item.diagName">-->
        <!--          <span :title="item.symptomDescription" class="error padding-right-10 ellipsis">{{item.symptomDescription}}</span>-->
        <span
          :title="item.allergyName"
          class="error padding-right-10 ellipsis"
          style="font-size: 14px;padding: 0 10px"
          v-if="item.allergyName"
        >{{ item.allergyName }}</span>
        <span
          class="ellipsis"
          :title="item.diagName"
          style="font-size: 14px;padding: 0 10px"
        >{{ item.diagName }}</span>
        <!-- 诊疗信息 -->

        <!--<span>肾结石</span>-->
        <!--<span>血尿查因</span>-->
        <!--        </div>-->
        <el-button
          v-if="isOverCis(item)"
          type="primary"
          class="fr overCisButton"
          @click="finishClinic"
        >结束就诊</el-button>
        <span v-else-if="isOverCisText(item)" class="fr margin-right-20">已结束诊疗</span>
        <l-st-countdown
          v-if="item.executeTime"
          :start-time="time"
          @time-end="callback"
          @btn-click="getResult"
          class="fr"
        ></l-st-countdown>
      </div>
      <div class="noneData" v-else>
        <div class="person fl">
          <span class="person_num">00</span>
          <span class="person_number">0000000000</span>
          <!--<span>姓名</span>-->
          <!--<span>性别</span>-->
          <!--<span>年龄</span>-->
          <span> -- </span>
          <span> -- </span>
          <span> -- </span>
        </div>
        <!--<div class="fl nav-gap-wrap">
          <div class="nav-gap"></div>
        </div>
        <div class="docter fl">
          <span class="padding-right-10">过敏信息</span>
          <span>诊断信息</span>
        </div>-->
      </div>
    </div>
    <!--结算部分患者卡片-->
    <div v-if="type === 'settleAccount'" class="clearfix hospital">
      <div v-if="item.patientName" class="msg_header_inner">
        <div class="person fl">
          <span class="person_num">{{ item.appointmentCode | fillZero }}</span>
          <span class="person_number">{{ filterPatientCode }}</span>
          <span>{{ item.patientName }}</span>
          <span
            :val="item.patientGender"
            code="GENDER_CODE"
            v-codeTransform
            v-if="item.patientGender"
          ></span>
          <span>{{ item.patientAge }}</span>
          <span class="pad20"
                :val="item.settlementType"
                code="settlementType"
                v-codeTransform
                v-if="item.settlementType">
          </span>
          <span :val="item.rediagStatus" code="FirstOrNo" v-codeTransform v-if="item.rediagStatus"></span>
          <span class="padding-right-10 ellipsis">余额:1225.43</span>
        </div>
        <div class="fl nav-gap-wrap" v-if="item.symptomDescription || item.diagName">
          <div class="nav-gap"></div>
        </div>
        <el-button
          type="primary"
          class="fr overCisButton"
          @click="goPay"
        >去充值</el-button>
      </div>
      <div class="noneData" v-else>
        <div class="person fl">
          <span class="person_num">00</span>
          <span class="person_number">0000000000</span>
          <!--<span>姓名</span>-->
          <!--<span>性别</span>-->
          <!--<span>年龄</span>-->
          <span> -- </span>
          <span> -- </span>
          <span> -- </span>
        </div>
        <el-button
          type="primary"
          class="fr overCisButton"
          @click="goPay"
        >去充值</el-button>
        <!--<div class="fl nav-gap-wrap">
          <div class="nav-gap"></div>
        </div>
        <div class="docter fl">
          <span class="padding-right-10">过敏信息</span>
          <span>诊断信息</span>
        </div>-->
      </div>
    </div>
    <div v-if="type === 'hospital'" class="clearfix hospital">
      <div v-if="item.patientName" style="line-height: 65px">
        <div class="person fl">
          <!--<span>-->
          <span class="person_num">{{ item.bedCode || "00" }}</span>
          <span class="person_number">{{ item.inpCode || "0000000000" }}</span>
          <span v-if="item.patientName">{{ item.patientName }}</span>
          <span v-if="item.identificationNum">
            {{
            item.identificationNum
            }}
          </span>
          <span v-if="item.patientAge">
            {{
            isNaN(item.patientAge) ? item.patientAge : item.patientAge + "岁"
            }}
          </span>
          <span :val="item.patientGender" code="GENDER_CODE" v-codeTransform>
            {{
            item.patientGender
            }}
          </span>
          <!--</span>-->
        </div>
        <div class="docter fl">
          <div class="docter_box">
            <div class="box_item">
              <span class="label">主治医师：</span>
              <span class="margin-right-20">
                {{
                item.manageDoctorName | displayEmpty
                }}
              </span>
              <span class="label">登记日期：</span>
              <span>
                {{
                (item.finAdmissionTime) | displayEmpty
                }}
              </span>
            </div>
            <div class="box_item">
              <span
                :title="item.allergyName"
                class="error margin-right-20 ellipsis"
              >{{ item.allergyName | displayEmpty }}</span>
              <span :title="item.admissionDiag" class="ellipsis">
                {{
                item.admissionDiag | displayEmpty
                }}
              </span>
            </div>
          </div>
        </div>
        <el-button
          type="primary"
          v-if="item.recordStatus === '2'&&isLeave(item)"
          class="fr overCisButton"
          @click="aa"
        >撤床</el-button>
        <el-button
          type="primary"
          class="fr overCisButton"
          disabled
          v-else-if="item.recordStatus === '7'&&isLeave(item)"
        >预撤床</el-button>
        <div class="fr right" style="display: none">
          <span class="te">特</span>
          <span class="pu">普食</span>
        </div>
      </div>
      <div v-else class="111">
        <div class="person fl">
          <!--<span>-->
          <span class="person_num">00</span>
          <span class="person_number">0000000000</span>
          <!--<span>姓名</span>-->
          <!--<span>年龄</span>-->
          <!--<span>性别</span>-->
          <span> -- </span>
          <span> -- </span>
          <span> -- </span>
          <!--</span>-->
        </div>
        <div class="docter fl">
          <div class="docter_box">
            <div class="box_item">
              <span class="label">主治医师：</span>
              <span class="margin-right-20">--</span>
              <span class="label">入院日期：</span>
              <span>--</span>
            </div>
            <div class="box_item">
              <span class="error margin-right-20 ellipsis">过敏信息</span>
              <span class="ellipsis">诊断信息</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="撤床医嘱" :visible.sync="dialogFormVisible" @close="closeLeave">
      <el-form ref="ruleForm" :rules="rules" class="ruleForm" :model="form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item prop="leaveDate">
              <l-formt-title label="撤床日期" required>
                <!-- <el-date-picker
                  v-model="form.leaveDate"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="选择日期时间"
                ></el-date-picker>-->
                <el-select v-model="form.leaveDate" placeholder="请选择">
                  <el-option label="今日撤床" value="今日撤床"></el-option>
                  <el-option label="明日出院" value="明日出院"></el-option>
                </el-select>
              </l-formt-title>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="leaveExplain">
              <l-formt-title label="出院病情" required>
                <l-value-domain
                  code="dischargeSituation"
                  :value.sync="form.leaveExplain"
                  class="select-container"
                  placeholder="请选择"
                />
              </l-formt-title>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item prop="leaveNillness">
          <l-formt-title label="出院说明" required>
            <el-input v-model="form.leaveNillness" placeholder></el-input>
          </l-formt-title>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="leaveConfirm" :loading="leaveLoad">确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { finish, getDiaByClinicType } from "@/api/cis/visit/visit";
import { leaveHospital,leaveHospitalJudge } from "@/api/cis/resident/residentAdvice";
import { mapActions } from "vuex";

export default {
  name: "patientinfDetails",
  props: {
    type: {
      type: String,
      default: "default"
    }
  },
  data() {
    return {
      time: 5,
      percentage: 100,
      item: {},
      // 出院填写信息
      form: {
        leaveDate: "",
        leaveExplain: "",
        leaveNillness: ""
      },
      rules: {
        leaveDate: [
          {
            required: true,
            message: "请选择出院时间",
            trigger: "change"
          }
        ],
        leaveExplain: [
          { required: true, message: "请选择出院病情", trigger: "change" }
        ],
        leaveNillness: [
          { required: true, message: "请输入出院说明", trigger: "blur" }
        ]
      },
      dialogFormVisible: false,
      leaveLoad: false
    };
  },
  filters: {
    displayEmpty(data) {
      return data ? data : "--";
    },
    fillZero(str, len) {
      if (!str) {
        return "00";
      }
      return (
        Array(Math.abs(("" + str).length - ((len || 2) + 1))).join(0) + str
      );
    }
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "base/changeRecPatientData",
      // setReloadKey: 'cis/setReloadKey',
      setReloadKey: "base/changeSearchAgainKey"
    }),
    goPay (){
      alert("去充值！");
    },
    isOverCis(item) {
      // 结束就诊按钮必须在 二级菜单是病历处方 才能出现
      // console.log("this.$router::::::",this.$router.currentRoute.fullPath);
      let isRpPage =
        this.$router.currentRoute.fullPath.indexOf("/cisOne/cisThree") > -1;
      return isRpPage && item.recordStatus !== "5";
    },
    isLeave(item) {
      // 结束就诊按钮必须在 二级菜单是病历处方 才能出现
      // console.log("this.$router::::::",this.$router.currentRoute.fullPath);
      let isRpPage =
        this.$router.currentRoute.fullPath.indexOf("/ipnw/orderRecord") > -1;
      return isRpPage && item.recordStatus !== "5";
    },

    isOverCisText(item) {
      let isRpPage =
        this.$router.currentRoute.fullPath.indexOf("/cisOne/cisThree") > -1;
      return isRpPage && item.recordStatus === "5";
    },
    callback() {
      console.log("时间结束了");
    },
    getResult() {
      console.log("皮试结果 查询 事件");
    },
    async finishClinic() {
      // 是否有诊断校验
      let rep = await getDiaByClinicType({ visitCode: this.item.visitCode });
      if (rep.code === 1 && rep.data.length === 0) {
        this.$confirm("", "", {
          showClose: "false",
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          dangerouslyUseHTMLString: "true",
          message: "未填写诊断，是否继续？",
          type: "warning"
        })
          .then(() => {
            finish(this.item)
              .then(res => {
                this.changeRecPatientData(res.data);
                this.$message.success("结束就诊成功");
                this.setReloadKey(+new Date()); // 更新 vuex 里的 ReloadKey  使最下测 模块刷新
              })
              .catch(() => {
                this.$message.error("结束就诊失败");
              });
          })
          .catch(() => {
            this.$message.warning("已取消");
          });
      } else {
        finish(this.item)
          .then(res => {
            this.changeRecPatientData(res.data);
            this.$message.success("结束就诊成功");
            this.setReloadKey(+new Date()); // 更新 vuex 里的 ReloadKey  使最下测 模块刷新
          })
          .catch(() => {
            this.$message.error("结束就诊失败");
          });
      }
    },
    leaveConfirm() {

      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.finishClinic_hospital();
        }
      });
    },
    closeLeave() {
      this.$refs.ruleForm.resetFields();
    },
     aa(){
      try {
        // let rep =
        leaveHospitalJudge({
          inpCode: this.item.inpCode,
          patientId: this.item.patientId
        }).then(res=>{
          console.log(res,"res")
          if (res.code === 1) {
            this.dialogFormVisible = true;
          } else {
            this.$message.error(res.msg || "预出院失败！");
          }
        });
        // if (rep.code === 1) {
        //   this.dialogFormVisible = true;
        //   this.closeLeave();
        // } else {
        //   console.log(rep,"req")
        //   alert(rep.code);
        //   this.$message.error(rep.msg || "预出院失败！");
        // }
      } catch (err) {
        this.$message.error(err.msg || "预出院失败！");
        this.leaveLoad = false;
      }

    },
    async finishClinic_hospital() {
      this.leaveLoad = true;
      try {
        let rep = await leaveHospital({
          inpCode: this.item.inpCode,
          patientId: this.item.patientId,
          ...this.form
        });
        if (rep.code === 1) {
          this.$message.success(rep.msg || "预出院成功！");

          // 刷新左下侧列表 拼接成 CHANGEFORM?key=value 格式的字符串
          let loadString = String(+new Date()) + "CHANGEFORM?" + "hospState=4";
          this.setReloadKey(loadString);
          this.dialogFormVisible = false;
          this.closeLeave();
        } else {
          this.$message.error(rep.msg || "预出院失败！");
        }
      } catch (err) {
        this.$message.error(err.msg || "预出院失败！");
        this.leaveLoad = false;
      }
    },
    getRemainingTime(patientData) {
      //executeTime 皮试的开始时间 时间戳
      //duration  皮试时长  分钟数
      let duration = patientData.duration || 5;
      if (!patientData.executeTime) {
        this.time = duration * 1000 * 60;
      } else {
        this.time =
          duration * 1000 * 60 - (+new Date() - patientData.executeTime);
      }
    }
  },
  mounted() {},
  created() {},
  computed: {
    ...mapGetters("base", ["receivePatientData"]),
    ...mapGetters("user", ["role"]),

    // 门诊号多个 需要匹配 当前部门的相同的门诊号
    filterVisitCode() {
      let value = this.item.visitCode;
      let newVisitCode = "";
      let deptId = this.role.deptId;
      let outDeptId = this.receivePatientData.ouptDeptId;
      if (outDeptId && value && value.indexOf(",") > -1) {
        let index = outDeptId.split(",").indexOf(String(deptId));
        newVisitCode = this.receivePatientData.visitCode.split(",")[index];
        return newVisitCode;
      } else {
        return value;
      }
    },
    // 20200622,不再用门诊号，统一改为病人编号
    filterPatientCode() {
      let value = this.item.patientCode;
      // let newVisitCode = "";
      // let deptId = this.role.deptId;
      // let outDeptId = this.receivePatientData.ouptDeptId;
      // if (outDeptId && value && value.indexOf(",") > -1) {
      //   let index = outDeptId.split(",").indexOf(String(deptId));
      //   newVisitCode = this.receivePatientData.visitCode.split(",")[index];
      //   return newVisitCode;
      // } else {
        return value;
      // }
    }
  },
  watch: {
    receivePatientData: {
      handler(val) {
        // console.log("ttttttttttttttt")
        // console.log(JSON.stringify(val));
        this.item = {
          //...this.item,
          ...val
        };

        if (this.type !== "hospital" && this.type) {
          //门诊医生站 有值才会计算
          let cisData = {
            appointmentCode: "1212",
            visitCode: "121212",
            patientName: "121212",
            patientGender: "121212",
            age: "121212",
            settlementType: "121212",
            rediagStatus: "121212",
            admissionDiag: "12121212",
            allergic: "121212",
            diagName: "1212121212",
            symptomDescription: "12121212"
          };
          this.item = {
            //...cisData,
            ...val
          };
          if (this.item.diagName) {
            this.item.diagName = this.item.diagName.split(",")[0];
          }
          this.getRemainingTime(val); //计算剩余时间
        }

        console.log("this.item:", this.item);
      },
      immediate: true,
      deep: true
    }
  }
};
</script>

<style scoped lang="scss">
// 门诊部分
.msg_header {
  line-height: 66px;
  height: 66px;
  background-color: #ffffff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  border-radius: 4px;
  overflow: hidden;
  font-size: 0;

  .person {
    text-align: left;
    min-width: 60px;

    & > span {
      display: inline-block;
      vertical-align: top;
      padding: 0 10px;
      line-height: 66px;
      height: 66px;
      font-size: 14px;
    }

    .person_num {
      // font-family: "DINPro-Medium", serif;
      font-size: 34px;
      color: #f7a820;
      min-width: 54px;
      text-align: center;
      background-color: #fef6e8;
      display: inline-block;
    }

    .person_number {
      font-size: 18px;
      /*color: #3D7DFB;*/
      padding: 0 10px 0 20px;
      display: inline-block;
    }

    .pad20 {
      padding: 0 20px;
    }
  }

  .nav-gap-wrap {
    // height: inherit;
    height: 66px;
  }

  .nav-gap {
    position: relative;
    width: 1px;
    height: inherit;
    padding: 0 10px;

    &:before {
      content: "";
      position: absolute;
      top: calc(50% - 8px);
      width: 1px;
      height: 16px;
      background: #ebebeb;
    }
  }

  .error {
    font-size: 14px;
    // font-family: SourceHanSansSC;
    font-weight: 400;
    color: rgba(225, 20, 10, 1);
  }

  .docter {
    /*height: 60px;*/
    /*line-height: 60px;*/
    .docter_box {
      height: 100%;
      border-left: 1px solid #c5cbcf;
      padding-left: 20px;
      font-size: 12px;

      .box_item {
        line-height: 20px;
      }
    }
  }

  .noneData {
    color: #949da3;
    font-size: 0;
    > .person > span:not(.person_num):not(.person_number) {
      font-size: 14px;
    }
    > .docter > span {
      font-size: 14px;
      padding: 0 10px;
    }

    .nav-gap-wrap {
      .nav-gap {
        padding: 0 10px !important;
      }
    }
  }

  .overCisButton {
    margin-top: 14px;
    margin-right: 15px;
  }
}

//限制字符的数量  超出...
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 140px;
  display: inline-block;
}

//住院部分
.hospital {
  height: 65px;
  background-color: #ffffff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  font-size: 0;
  border-radius: 4px;
  overflow: hidden;
  .person {
    line-height: 65px;
    height: 65px;
    > span:not(.person_num):not(.person_number) {
      font-size: 16px;
      // font-family: SourceHanSansSC-Regular, SourceHanSansSC;
      font-weight: 400;
      color: rgba(46, 50, 58, 1);
      padding: 0 10px;
    }
    > span {
      vertical-align: top;
      line-height: 65px;
      display: inline-block;
    }
    .person_num {
      // font-family: "DINPro-Medium";
      background-color: #fef6e8;
      display: inline-block;
      font-size: 36px;
      padding: 0 18px;
      margin-right: 10px;
      // font-family: DINPro-Medium, DINPro;
      font-weight: 500;
      color: rgba(247, 168, 32, 1);
      /deep/ .el-select {
        vertical-align: bottom;
      }

      /deep/ .el-input__inner {
        border: 0;
        background-color: #fef6e8;
        // font-family: "DINPro-Medium";
        font-size: 34px;
        color: #f7a820;
        height: 100%;
        /* line-height: 79px; */
        vertical-align: -8px;
      }

      /deep/ .el-select-dropdown__item:nth-child(even) {
        background: rgba(245, 245, 245, 1);
      }
    }

    .person_number {
      padding: 0 10px;
      display: inline-block;
      vertical-align: top;
      line-height: 65px;
      font-size: 18px;
      // font-family: DINPro-Bold, DINPro;
      font-weight: bold;
      /*color:rgba(61,125,251,1);*/
    }

    .pad20 {
      padding: 0 20px;
    }
  }

  .docter {
    padding: 12px 10px;

    .docter_box {
      height: 100%;
      border-left: 1px solid #c5cbcf;
      padding-left: 20px;
      font-size: 12px;

      .box_item {
        line-height: 20px;

        .label {
          font-size: 12px;
          // font-family: SourceHanSansSC;
          font-weight: 400;
          color: rgba(148, 157, 163, 1);
        }

        .error {
          font-size: 12px;
          // font-family: SourceHanSansSC;
          font-weight: 400;
          color: rgba(225, 20, 10, 1);
        }
      }
    }
  }

  .right {
    line-height: 65px;
    margin-right: 20px;

    > span {
      display: inline-block;
      line-height: 20px;
      text-align: center;
      color: #fff;
    }

    .te {
      width: 20px;
      line-height: 20px;
      background: rgba(225, 20, 10, 1);
      border-radius: 2px;
      margin-right: 10px;
      font-size: 12px;
      // font-family: PingFangSC-Regular, PingFangSC;
      font-weight: 400;
      vertical-align: middle;
    }

    .pu {
      width: 32px;
      line-height: 20px;
      background: rgba(189, 193, 195, 1);
      border-radius: 2px;
      font-size: 12px;
      // font-family: PingFangSC-Regular, PingFangSC;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      vertical-align: middle;
    }
  }

  .overCisButton {
    margin-top: 14px;
    margin-right: 15px;
  }
  .btnText {
    display: inline-block;
    font-size: 14px;
    vertical-align: top;
    margin-top: 0;
  }
}
.ruleForm {
  padding: 20px;
  padding-bottom: 0;
  /deep/ .el-form-item__content {
    height: 36px;
    margin-bottom: 18px;
  }
}
</style>
