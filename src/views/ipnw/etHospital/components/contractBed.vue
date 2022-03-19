<template>
  <div class="height100">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="false"
      patientCardType="hospital"
      pageName="contractBed"
      @message="messageHandler"
    >
      <template #list>
        <left-bar type="hos" :Multiple="false"></left-bar>
      </template>
      <template #content>
        <el-card
          class="height100 padding20 position-relative"
          :style="{paddingTop: '0px', paddingBottom: baseInfo.finAdId?'80px':'10px'}"
          v-loading="isLoading"
        >
          <div class="height100">
            <div :style="{height: baseInfo.finAdId?'60%':'100%'}">
              <l-card-title>
                <span slot="left">床位分配</span>
              </l-card-title>
              <div class="list-card clearfix">
                <el-col
                  class="float-left margin-left-20"
                  style="width: 287px;"
                  v-for="(item, index) in bedList"
                  :key="index"
                >
                  <el-card
                    :class="contractBedList.includes(index)?'list-card-item active':`list-card-item 1${index}`"
                    :style="{border: (currentBed_green == index && currentBed_green !== '')?'2px solid #67C23A':''}"
                    @click.native="handle_selectPatient(index)"
                  >
                    <span class="label" v-if="item.isNew">新入</span>
                    <span class="label" v-if="item.adNum==''">空床</span>
                    <span class="label" v-if="item.recordStatus=='7'">预出</span>
                    <div class="title">
                      <i class="item-color1">{{item.bedCode}}</i>床
                      <i class="item-color2">{{item.adNum}}</i>
                    </div>
                    <template v-if="item.adNum!=''&&item.adNum">
                      <div class="info">
                        <span>
                          {{item.name}}
                          <i style="font-style: normal;margin-left: 15px">
                            <span :val="item.gender" code="GENDER_CODE" v-codeTransform></span>
                          </i>
                          <i style="font-style: normal;margin-left: 15px">{{item.age}}</i>
                        </span>
                        <span style="display: block;">
                          <i class="item-color">主治医生</i>
                          {{item.doctorName}}
                        </span>
                        <span>
                          <i class="item-color">诊断信息</i>
                          {{item.diagName}}
                        </span>
                      </div>
                      <div class="icons">
                        <span class="te">特</span>
                        <span class="pushi">普食</span>
                        <span class="babyicon" v-if="item.childrenNum > 0">
                          <i
                            class="iconfont iconyinger"
                            style="margin-right: 5px;"
                            v-for="i in item.childrenNum"
                            :key="i"
                          ></i>
                        </span>
                      </div>
                    </template>
                  </el-card>
                </el-col>
              </div>
            </div>
            <div v-if="baseInfo.finAdId" style="height: 40%;">
              <div class="box-bg">
                <h3 style="margin-top: 20px;">分配信息</h3>
                <el-form :model="form" :rules="rules" ref="ruleForm" label-width="0px">
                  <div style="margin-top: 20px;height: 36px;">
                    <!-- <div class="float-left" style="width: 240px">
                  <el-form-item prop="bedId">
                    <l-formt-title label="选择床位">
                      <el-select v-model="form.bedId" @change="changeBed" placeholder="请选择">
                        <el-option
                          v-for="item in bedList"
                          :key="item.value"
                          :label="`${item.bedCode}床`"
                          :disabled="item.disabled"
                          :value="item.bedId"
                    >-->
                    <!--<div class="list-item">-->
                    <!--<div class="head">-->
                    <!--<span>{{item.code}}</span><span>{{item.doctor}}</span><span style="width: 34%;">{{item.nurse}}</span>-->
                    <!--</div>-->
                    <!--</div>-->
                    <!-- </el-option>
                      </el-select>
                    </l-formt-title>
                  </el-form-item>
                    </div>-->
                    <div class="float-left margin-left-10" style="width: 240px;">
                      <el-form-item prop="manageDoctorId">
                        <l-formt-title label="主治医生">
                          <el-select
                            v-model="form.manageDoctorId"
                            @change="changeDocInfo"
                            placeholder="请选择"
                          >
                            <el-option
                              v-for="item in doctorList"
                              :key="item.manageDoctorId"
                              :label="item.manageDoctorName"
                              :disabled="item.disabled"
                              :value="item.manageDoctorId"
                            ></el-option>
                          </el-select>
                        </l-formt-title>
                      </el-form-item>
                    </div>
                    <div class="float-left margin-left-10" style="width: 240px;">
                      <el-form-item prop="manageNurseId">
                        <l-formt-title label="主管护士">
                          <el-select
                            v-model="form.manageNurseId"
                            @change="changeNurInfo"
                            placeholder="请选择"
                          >
                            <el-option
                              v-for="item in nurseList"
                              :key="item.manageNurseId"
                              :label="item.manageNurseName"
                              :disabled="item.disabled"
                              :value="item.manageNurseId"
                            ></el-option>
                          </el-select>
                        </l-formt-title>
                      </el-form-item>
                    </div>
                    <div class="float-left margin-left-10" style="width: 240px;">
                      <el-form-item prop="food">
                        <l-formt-title label="饮食">
                          <l-value-domain
                            :code="selectCode.food"
                            @change="changeFoodInfo"
                            :value.sync="form.food"
                          ></l-value-domain>
                        </l-formt-title>
                      </el-form-item>
                    </div>
                    <div class="float-left margin-left-10" style="width: 240px;">
                      <el-form-item prop="nursingLevel">
                        <l-formt-title label="护理级别">
                          <l-value-domain
                            :code="selectCode.nursingLevel"
                            @change="changeNursingInfo"
                            :value.sync="form.nursingLevel"
                          ></l-value-domain>
                        </l-formt-title>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="overflow-hidden" style="margin-top: 20px;">
                    <div class="padding20" style="width: 50%;float: left;padding-left:0">
                      <div class="title">
                        <el-checkbox v-model="isHasWristband">分配后打印腕带</el-checkbox>
                      </div>
                      <div class="info" style="height: 70px;">
                        <p>
                          <span class="black em">{{baseInfo.bedCode || '-'}}床</span>
                          <span class="black em">{{baseInfo.patientName || '-'}}</span>
                          <span
                            class="black em"
                            :val="baseInfo.patientGender"
                            code="GENDER_CODE"
                            v-codeTransform
                          >-</span>
                          <span class="black em">{{baseInfo.ageInfo || '-'}}</span>
                          <span class="gray">科室</span>
                          <span class="black">{{role.deptName || '-'}}</span>
                          <span class="gray">住院号</span>
                          <span class="black">{{baseInfo.inpCode || '-'}}</span>
                        </p>
                        <p>
                          <img src alt="" />
                        </p>
                      </div>
                    </div>
                    <div class="padding20" style="width: 50%;float: right;padding-right: 0;">
                      <div class="title">
                        <el-checkbox v-model="isHasBedCard">分配后打印床头卡</el-checkbox>
                      </div>
                      <div class="info" style="border: none">
                        <table cellspacing="0" class="table-box">
                                        <!-- 修改质量管理的bug 无实际用处 START -->
              <caption></caption>
              <tr style="display:none">
                <th  scope="col"></th>
              </tr>
              <!-- 修改质量管理的bug 无实际用处 END -->
                          <tr>
                            <td colspan="4">
                              <span>{{baseInfo.bedCode || '-'}}床</span>
                              <span>{{baseInfo.patientName || '-'}}</span>
                              <span
                                :val="baseInfo.patientGender"
                                code="GENDER_CODE"
                                v-codeTransform
                              >-</span>
                              <span>{{baseInfo.ageInfo || '-'}}</span>
                            </td>
                          </tr>
                          <tr>
                            <td>入院时间</td>
                            <td>{{baseInfo.wdeptAdmissionTime || '-'}}</td>
                            <td>科室</td>
                            <td>{{role.deptName || '-'}}</td>
                          </tr>
                          <tr>
                            <td>住院号</td>
                            <td>{{baseInfo.inpCode || '-'}}</td>
                            <td>饮食</td>
                            <td>
                              <span :val="baseInfo.dietType" code="food" v-codeTransform>-</span>
                            </td>
                          </tr>
                          <tr>
                            <td>过敏史</td>
                            <td>{{baseInfo.allergyName || '-'}}</td>
                            <td>护理级别</td>
                            <td>
                              <span
                                :val="baseInfo.nursingLevel"
                                code="nursingLevel"
                                v-codeTransform
                              >-</span>
                            </td>
                          </tr>
                          <tr>
                            <td>主治医生</td>
                            <td>{{baseInfo.manageDoctorName || '-'}}</td>
                            <td>主管护士</td>
                            <td>{{baseInfo.manageNurseName || '-'}}</td>
                          </tr>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div class="position-absolute padding20 bottom-box">
                    <!-- <el-button
                      class="float-right margin-left-10"
                      style="border-radius: 2px;border-color:#F05A23;color:#F05A23;"
                    >取 消
                    </el-button>-->
                    <el-button
                      type="primary"
                      class="float-right"
                      @click="assingnConfirm('ruleForm')"
                      v-hotKey="{func: 'func_submit', flag: 'isLoading'}"
                      style="border-radius: 2px;"
                    >确认包床</el-button>
                  </div>
                </el-form>
              </div>
            </div>
          </div>
        </el-card>
      </template>
    </l-layout>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import store from "@/store";
import {
  fetchEmptyBedInfo,
  fetchUserByDept,
  assingnBed,
  getBedInfList,
  doctorList,
  nurseList
} from "@/api/ipnw/etHospital";
import LeftBar from "../../components/nursingLeftBar";

export default {
  name: "contractBed",
  components: {
    LeftBar
  },
  data() {
    return {
      isLoading: false,
      activePatients: "first", // 左侧tab列表
      formParams: [
        "CourtyardArea",
        "technicalOffices",
        "illnessArea",
        "patientsType",
        "patientsState",
        "search"
      ], // 左侧搜索条件
      form: {
        // 分配床位form
        bedId: "",
        manageNurseId: "1",
        manageDoctorId: "1",
        food: "1",
        nursingLevel: "1"
      },
      rules: {
        manageNurseId: [
          { required: true, message: "请选择主管护士", trigger: "change" }
        ],
        manageDoctorId: [
          { required: true, message: "请选择主管医生", trigger: "change" }
        ],
        food: [{ required: true, message: "请选择饮食", trigger: "change" }],
        nursingLevel: [
          { required: true, message: "请选择护理等级", trigger: "change" }
        ]
      },
      //l-value-domin组件code码
      selectCode: {
        food: "food",
        nursingLevel: "nursingLevel"
      },
      currentBed: "", // 当前自己床位
      contractBedList: [], // 包床列表
      baseInfo: {
        // 患者基本信息 用于打印床头卡、腕带
        nursingLevel: "", // 护理级别
        food: "", // 饮食
        admissionMode: "",
        admissionSdeptId: "",
        admissionSituation: "",
        ageInfo: "-",
        bedId: "",
        birthDate: "-",
        finAdId: "",
        finAdmissionTime: "-",
        inpCount: 0,
        medicalInsuranceType: "",
        medicalType: "",
        patientGender: "-",
        patientName: "-",
        deptName: "-"
      },
      isHasWristband: false, // 是否打印腕带
      isHasBedCard: false, // 是否打印床头卡
      toolBoxs: ["historyHosi", "Hotkey"],
      bedList: [],
      doctorList: [],
      nurseList: []
    };
  },
  computed: {
    ...mapGetters(["receivePatientData", "role"]),
    ...mapGetters(["illnessArea"])
  },
  created() {
    this.getDoctorList();
    this.getNurseList();
    this.getBedList();
  },
  methods: {
    handle_selectPatient(index) {
      // 选择床位
      // this.currentBed = index;
      if (this.contractBedList.includes(index)) {
        this.contractBedList = this.contractBedList.filter(
          item => item != index
        );
      } else {
        this.contractBedList.push(index);
      }
    },

    /*
     * 当前科室的护士*/

    async getNurseList() {
      let _self = this;
      _self.nurseList = [];
      if (store.user.state.role.deptId) {
        let result = await nurseList(store.user.state.role.deptId);
        if (result.code == "1") {
          result.data.forEach(function(item) {
            _self.nurseList.push({
              manageNurseId: item.uid,
              manageNurseName: item.uname
            });
          });

          if (_self.nurseList.length > 0) {
            _self.form.manageNurseId = _self.nurseList[0].manageNurseId;
          }
        }
      }
    },
    /*
     * 获取当前科室下的医生
     */
    async getDoctorList() {
      let _self = this;
      _self.doctorList = [];
      if (store.user.state.role.deptId) {
        let result = await doctorList(store.user.state.role.deptId);
        if (result.code == "1") {
          result.data.forEach(function(item) {
            _self.doctorList.push({
              manageDoctorId: item.uid,
              manageDoctorName: item.uname
            });
          });
          if (this.doctorList.length > 0)
            _self.form.manageDoctorId = this.doctorList[0].manageDoctorId;
        }
      }
    },
    /*
     *  请求数据
     * */
    async getBedList() {
      let result = await getBedInfList({wardCode: this.illnessArea});
      let _self = this;
      this.bedList = [];
      if (result.code == "1") {
        result.data.forEach(function(item) {
          _self.bedList.push({
            ...item,
            isNew: item.wdeptAdmissionTime == 0 ? true : false, // 是否为新入院
            collection: false, // 收藏状态
            bedCode: item.bedCode, // 床号
            bedId: item.bedId,
            adNum: item.inpCode, // 住院号
            name: item.patientName, // 云医院
            gender: item.patientGender, // 性别
            age: item.patientAge, // 年龄
            doctorName: item.manageDoctorName, // 主治医生
            executiveNurse: "", // 主管护师
            responsibilityNurse: item.manageNurseName, // 责任护师
            inDate: item.finAdmissionTime, // 入院时间
            dayNum: item.wdeptAdmissionTime, // 入院天数
            admissionDiag: item.admissionDiag,
            allergyName: item.allergyName,
            diagName: item.diagName,
            recordStatus: item.recordStatus,
            childrenNum: 0 // 婴儿数
          });
        });
        this.checkPatientBed();
      }
    },
    checkPatientBed() {
      if (!this.receivePatientData.bedCode) {
        this.bedList.map((item, index) => {
          if (item.adNum == "" || !item.adNum) {
            this.currentBed = this.currentBed || index;
          }
        });
      } else {
        this.bedList.map((item, index) => {
          if (item.bedCode == this.receivePatientData.bedCode) {
            this.handle_selectPatient(index);
            this.currentBed_green = index;
          }
        });
      }
    },
    /*
     *   组件func
     * */
    handleClick() {
      // tab 的切换方法
    },
    search(form) {
      // 查询方法
      let refs = "";
      if (this.activePatients == "first") {
        refs = "patients1";
      } else if (this.activePatients == "second") {
        refs = "patients2";
      } else {
        refs = "patients3";
      }
      this.$refs[refs].search(form);
    },
    readCard() {
      // 读卡方法
    },
    handleClickTabChange() {
      // 左侧列表tab切换
    },
    /*
     *   页面操作
     * */
    assingnConfirm(formName) {
      // 确认分配

      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (!this.baseInfo.finAdId) {
            this.$message.warning("请选择一名患者!");
            return false;
          }
          this.isLoading = true;
          try {
            let params = {
              actionType: "1",
              allergyName: "",
              bedId: this.receivePatientData.bedId,
              dietType: this.form.food,
              finAdId: this.baseInfo.finAdId,
              manageDoctorId: this.form.manageDoctorId || 1,
              manageNurseId: this.form.manageNurseId || 1,
              nursingLevel: this.form.nursingLevel,
              patientId: this.baseInfo.patientId || 1,
              turnType: 3
            };
            let { code, data, msg } = await assingnBed(params);
            if (code === 1) {
              this.$message.success("分配成功!");
              this.isLoading = false;
            } else {
              this.$message.error(msg);
              this.isLoading = false;
            }
          } catch (e) {
            this.isLoading = false;
          }
        } else {
          console.log("error submit!!");
          this.isLoading = false;
          return false;
        }
      });
    },
    changeDocInfo(val) {
      // 主治医生变更
      let current = this.doctorList.filter(item => item.manageDoctorId == val);
      this.baseInfo.manageDoctorName = current[0].manageDoctorName;
    },
    changeNurInfo(val) {
      // 护士变更
      let current = this.nurseList.filter(item => item.manageNurseId == val);
      this.baseInfo.manageNurseName = current[0].manageNurseName;
    },
    changeFoodInfo(item, val) {
      // 饮食变更
      this.baseInfo.dietType = item;
    },
    changeNursingInfo(item, val) {
      // 护理级别变更
      this.baseInfo.nursingLevel = item;
    },
    changeUserInfo(info = {}) {
      // 患者信息变更func
      this.baseInfo = {
        // ...this.baseInfo,
        ...info
      };
      this.form.manageDoctorId = info.manageDoctorId || '';
      this.form.manageNurseId = info.manageNurseId || '';
    },
    messageHandler() {
      consle.log("工具箱消息");
    }
  },
  watch: {
    receivePatientData: {
      //深度监听，可监听到对象、数组的变化
      handler(val) {
        // 监听 患者 ID 变化 触发事件
        this.changeUserInfo(val);
        this.checkPatientBed();
      },
      immediate: true,
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
.box-bg {
  height: 100%;
  overflow-y: auto;
  background: $l-color-white;
}
.table-box {
  width: 440px;
  border-color: $l-color-bgcolor-11;
  height: 204px;
}
.bottom-box {
  bottom: 0;
  left: 0;
  width: 100%;
  border-top: 1px solid $l-color-bgcolor-11;
}
.list-item {
  width: 220px;
  height: 34px;
  border-left: 1px solid $l-color-border-4;

  .head {
    span {
      width: 33%;
      display: inline-block;
      height: 34px;
      text-align: left;
      border-right: 1px solid $l-color-border-4;
      border-bottom: 1px solid $l-color-border-4;
    }
  }

  span {
    padding-left: 5px;
    width: 33%;
    display: inline-block;
    height: 34px;
    text-align: left;
    border-right: 1px solid $l-color-border-4;
    border-bottom: 1px solid $l-color-border-4;
  }
}

.el-select-dropdown__item:first-child .list-item {
  border-top: 1px solid $l-color-border-4;
}

.info {
  border: 1px solid $l-color-bgcolor-11;
  margin-top: 10px;

  table {
    border: 1px solid $l-color-bgcolor-11;

    tr {
      td {
        border-top: 1px solid $l-color-bgcolor-11;
        border-right: 1px solid $l-color-bgcolor-11;
        padding: 0 10px;
        font-size: 14px;
      }

      td:last-child {
        border-right: none;
      }

      td:first-child,
      td:nth-child(3) {
        width: 86px;
        color: $l-color-fontcolor-4;
      }

      td:nth-child(2),
      td:nth-child(4) {
        width: 148px;
        color: $l-color-fontcolor-3;
      }
    }

    tr:first-child td {
      font-weight: 600;
      text-align: center;
      color: $l-color-fontcolor-3;
      border: none;
    }
  }

  p {
    margin: 0;
    padding-left: 20px;
    line-height: 70px;

    span {
      padding: 0 5px;
    }

    .black {
      color: $l-color-fontcolor-3;
    }

    .gray {
      color: $l-color-fontcolor-4;
    }

    .em {
      font-weight: 600;
    }

    img {
      width: 60px;
    }
  }

  p:first-child {
    float: left;
    min-width: 60%;
  }

  p:last-child {
    float: right;
  }
}

.list-card {
  overflow-y: auto;
  height: calc(100% - 63px);

  .list-card-item {
    border: 2px solid transparent;
    position: relative;
    width: 287px;
    height: 253px;
    border-radius: 4px;
    padding: 47px 0 0 20px;
    font-size: 16px;
    
    font-weight: bold;
    color: $l-color-fontcolor-3;
    margin-bottom: 20px;
    /*line-height: 24px;*/
    .label {
      position: absolute;
      left: 0;
      top: 0;
      width: 44px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      background: $l-color-bgcolor-18;
      font-size: 12px;
      
      font-weight: 500;
      color: $l-color-primary1;
    }

    .collection {
      position: absolute;
      right: 10px;
      top: 10px;
    }

    .title {
      margin-bottom: 20px;

      .item-color1 {
        font-style: normal;
        font-size: 24px;
        
        font-weight: bold;
      }

      .item-color2 {
        padding-left: 5px;
        margin-right: 25px;
        border-left: 1px solid $l-color-bgcolor-11;
        display: inline-block;
        font-size: 18px;
        
        font-weight: bold;
        color: $l-color-fontcolor-2;
        font-style: normal;
        /*line-height:23px;*/
      }

      .item-color3 {
        height: 18px;
        font-size: 18px;
        
        font-weight: bold;
        color: $l-color-primary;
        font-style: normal;
        /*line-height:23px;*/
      }
    }

    .info {
      margin-bottom: 30px;
      font-size: 16px;
      
      font-weight: 400;
      color: $l-color-fontcolor-3;
      border: none;
      /*line-height:24px;*/
      span {
        // display: block;
        margin-top: 10px;

        i {
          font-style: normal;
        }

        .item-color {
          color: $l-color-fontcolor-4;
        }
      }
    }

    .icons {
      font-size: 12px;
      
      font-weight: 400;
      color: $l-color-white;

      .te {
        width: 20px;
        height: 20px;
        display: inline-block;
        background-color: $l-color-bgcolor-15;
        text-align: center;
        line-height: 20px;
      }

      .pushi {
        width: 40px;
        height: 20px;
        margin-right: 10px;
        display: inline-block;
        background-color: $l-color-bgcolor-16;
        text-align: center;
        line-height: 20px;
      }

      .babyicon {
        border-left: 1px solid $l-color-bgcolor-11;
        color: $l-color-border-6;
        padding-left: 10px;
      }
    }
  }

  .active {
    border: 2px solid $l-color-primary;
  }
}
</style>
