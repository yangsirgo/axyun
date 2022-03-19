<!--<template>
  <div class="height100">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="true"
      patientCardType="hospital"
      @message="messageHandler"
    >
      <template #list>
        <left-bar type="recall" :Multiple="false"></left-bar>
      </template>
      <template #content>
        <el-card class="height100">
          <div class="recall-content-box height100">
            <div class="height-button-main">
              <ul>
                <li>
                  <p>
                    <span class="black em">{{receivePatientData.bedCode || '&#45;&#45;'}}床</span>
                    <span class="black em">{{receivePatientData.patientName || '&#45;&#45;'}}</span>
                    <span
                      v-if="receivePatientData.patientGender"
                      class="black em"
                      :val="receivePatientData.patientGender"
                      code="GENDER_CODE"
                      v-codeTransform
                    >&#45;&#45;</span>
                    <span class="black em">{{receivePatientData.patientAge || '&#45;&#45;'}}</span>
                    <span class="blue em">{{receivePatientData.inpCode || '&#45;&#45;'}}</span>
                  </p>
                </li>
              </ul>

              <div class="user-info">
                <div class="title">
                  <i></i>
                  <b>患者信息</b>
                </div>
                <div class="info">
                  <div>
                    <p v-for="(item, i) in patientInfoKey" :key="i">
                      <span class="babel">{{item.label}}</span>
                      <span
                        v-if="item.key === 'patientGender'"
                        :val="patientInfo[item.key]"
                        code="GENDER_CODE"
                        v-codeTransform
                      ></span>
                      <span
                        v-else-if="item.key == 'prepayBalance'"
                        class="color2"
                      >{{patientInfo[item.key]}}</span>
                      <span
                        v-else-if="item.key == 'inpCode'"
                        class="color1"
                      >{{patientInfo[item.key]}}</span>
                      <span
                        v-else-if="item.key === 'settlementType'"
                        :val="patientInfo[item.key]"
                        code="MEDICAL_INSURANCE_CODE"
                        v-codeTransform
                      >-</span>
                      &lt;!&ndash;                      <span&ndash;&gt;
                      &lt;!&ndash;                        v-else-if="item.key === 'wdeptAdmissionTime'"&ndash;&gt;
                      &lt;!&ndash;                        :val="patientInfo[item.key]"&ndash;&gt;
                      &lt;!&ndash;                        v-codeTransform&ndash;&gt;
                      &lt;!&ndash;                      ></span>&ndash;&gt;
                      <span v-else-if="item.key == 'patientAge'">{{receivePatientData.patientAge}}</span>
                      <span v-else-if="item.key === 'inpSdeptId'">
                        <span
                          v-if="item.inpSdeptId"
                          tableName="sys_org"
                          :conditionMap="{org_type: '_DEPT_', id: item.inpSdeptId || ''}"
                          columns="org_nm"
                          v-tableTransform
                        ></span>
                        <span v-else></span>
                      </span>
                      <span v-else :style="item.style">{{patientInfo[item.key]}}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div class="out-info">
                <div class="title">
                  <i></i>
                  <b>召回信息</b>
                </div>
                <div class="info" style="margin-bottom: 0;">
                  <p>
                    <l-formt-title label="出院日期">
                      <el-date-picker
                        v-model="form.wdeptDischargeTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                        placeholder="选择日期时间"
                      ></el-date-picker>
                    </l-formt-title>
                  </p>
                  <p>
                    <l-formt-title label="出院病情">
                      <l-value-domain
                        code="dischargeSituation"
                        :value.sync="form.dischargeSituation"
                        class="select-container"
                        placeholder="请选择"
                      />
                    </l-formt-title>
                  </p>
                </div>
              </div>
              <div class="out-info">
                <l-formt-title label="召回说明" style="width: 490px">
                  <el-input v-model="form.dischargeInstructions" placeholder></el-input>
                </l-formt-title>
              </div>
            </div>
          </div>
          <div class="height-button-bottom text-align-right">
            &lt;!&ndash; <el-button type="primary" style="border-radius: 2px;" @click="check">预出院检查</el-button> &ndash;&gt;
            <el-button
              type="primary"
              style="border-radius: 2px;"
              v-hotKey="{func:'func_submit', flag: 'isLoading'}"
              @click="confirm"
            >确认召回
            </el-button>
            &lt;!&ndash; <el-button type="primary" plain @click="cancel">取 消</el-button> &ndash;&gt;
          </div>
        </el-card>
      </template>
    </l-layout>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from "vuex";
  import {getPatientInfo, recallPatient} from "@/api/ipnw/leaveHos";
  import LeftBar from "../../components/nursingLeftBar";

  export default {
    name: "recall",
    data() {
      return {
        isLoading: false,
        formParams: [
          "CourtyardArea",
          "technicalOffices",
          "illnessArea",
          "patientsType",
          "patientsState",
          "search"
        ], // 左侧搜索条件
        form: {
          wdeptDischargeTime: null,
          dischargeSituation: "",
          dischargeInstructions: ""
        },
        patientInfo: {
          status: ""
        },
        patientInfoKey: [
          {
            label: "住院号",
            key: "inpCode",
            style: {
              color: ""
            }
          },
          {
            label: "姓名",
            key: "patientName",
            style: {}
          },
          {
            label: "性别",
            key: "patientGender",
            style: {}
          },
          {
            label: "年龄",
            key: "patientAge",
            style: {}
          },
          {
            label: "床号",
            key: "bedCode",
            style: {}
          },
          {
            label: "当前科室",
            key: "inpSdeptId",
            style: {}
          },
          {
            label: "结算类型",
            key: "settlementType",
            style: {}
          },
          {
            label: "身份证号",
            key: "identificationNum",
            style: {}
          },
          {
            label: "登记日期",
            key: "finAdmissionTime",
            style: {}
          },
          {
            label: "出院日期",
            key: "wdeptAdmissionTime",
            style: {}
          },
          {
            label: "住院状态",
            key: "status",
            style: {}
          },
          {
            label: "费用总额",
            key: "freePayAmount",
            style: {
              fontWeight: "bold"
            }
          },
          {
            label: "预交金",
            key: "selfPayPrepay",
            style: {
              fontWeight: "bold"
            }
          },
          {
            label: "余额",
            key: "prepayBalance",
            style: {
              fontWeight: "bold"
            }
          }
        ],
        toolBoxs: ["leaveCost"]
      };
    },
    components: {
      LeftBar
    },
    computed: {
      ...mapGetters("base", ["receivePatientData"])
    },
    methods: {
      ...mapActions({
        changeSearchAgainKey: "base/changeSearchAgainKey"
      }),
      async getInfo(info) {
        try {
          let {code, data, msg} = await getPatientInfo(info.inpCode);
          if (code === 1) {
            // console.log(data);
            this.patientInfo = {
              ...this.patientInfo,
              ...data
            };
          } else {
            this.$message.error(msg);
          }
        } catch (error) {
        }
      },
      handleClick() {
        // tab 的切换方法
      },
      search(form) {
        // 查询方法
        // console.log("form:", form);
      },
      readCard() {
        // 读卡方法
      },
      confirm() {
        // 出院召回
        // 出院召回
        this.$confirm("是否召回此病人？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = "执行中...";
              recallPatient({
                ...this.receivePatientData,
                ...this.form,
                finAdId: "1",
                turnType: "1"
              })
                .then(res => {
                  done();
                  instance.confirmButtonLoading = false;
                  if (res.code === 1) {
                    this.$message.success("召回成功");
                  } else {
                    this.$message.error(res.msg || "召回失败");
                  }
                })
                .catch(err => {
                  done();
                  instance.confirmButtonLoading = false;
                  this.$message.error(err.msg || "召回失败");
                });
            } else {
              done();
              this.$message.info("取消召回");
            }
          }
        }).then();
      },
      cancel() {
        // 取消操作按钮
      },
      check() {
        // 预出院检查按钮
      },
      messageHandler() {
      }
    },
    watch: {
      receivePatientData: {
        //深度监听，可监听到对象、数组的变化
        handler(val) {
          this.patientInfo = {
            status: ""
          };
          if (JSON.stringify(val) != "{}") {
            this.getInfo(val);
          }
        },
        immediate: true,
        deep: true
      }
    }
  };
</script>

<style lang="scss" scoped>
  .color1 {
    color: $l-color-primary;
  }

  .color2 {
    color: $l-color-fontcolor-2;
  }

  .height-button-bottom {
    border-top: 1px solid $l-color-bgcolor-18;
    padding: 19px 20px 0;
  }

  .recall-content-box {
    // border-top: 1px solid #E4E4E4;
    height: calc(100% - 75px);
    padding: 0 20px;

    .title {
      font-size: 16px;
      
      font-weight: 500;
      color: $l-color-fontcolor-3;

      i {
        display: inline-block;
        width: 4px;
        height: 20px;
        background: $l-color-primary1;
        margin-right: 5px;
        position: relative;
        top: 4px;
      }
    }

    ul {
      li {
        height: 60px;
        font-size: 16px;
        
        font-weight: bold;
        color: $l-color-fontcolor-3;
        line-height: 24px;

        p {
          margin: 0;
          line-height: 60px;

          span {
            padding: 0 5px;
          }

          .black {
            color: $l-color-fontcolor-3;
          }

          .blue {
            color: $l-color-fontcolor-2;
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
      }
    }

    .user-info {
      .info {
        margin: 10px 0;

        & > div {
          overflow: hidden;

          p {
            width: 240px;
            font-size: 14px;
            line-height: 20px;
            margin: 10px 0;
            float: left;

            .babel {
              color: $l-color-fontcolor-4;
              display: inline-block;
              width: 56px;
              margin-right: 10px;
            }
          }
        }
      }
    }

    .out-info {
      .title {
        margin-bottom: 20px;
      }

      .info {
        margin: 20px 0;
        overflow: hidden;

        & > p {
          width: 240px;
          height: 36px;
          line-height: 36px;
          /*border: 1px solid #e4e4e4;*/
          border-radius: 2px;
          margin-right: 10px;
          margin-bottom: 10px;
          float: left;
          color: $l-color-fontcolor-3;
          background: $l-color-bgcolor-14;

          .babel {
            color: $l-color-fontcolor-4;
            margin-left: 10px;
            margin-right: 10px;
            padding-right: 10px;
            border-right: 1px solid $l-color-fontcolor-4;
          }
        }

        & > p:first-child {
          margin-left: 0px;
        }
      }
    }
  }
</style>-->
<template>
  <div class="height100">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="false"
      patientCardType="hospital"
      @message="messageHandler"
    >
      <template #list>
        <recallLeftBar @updateRecord="updateRecord"></recallLeftBar>
      </template>
      <template #content>
        <el-card class="height100">
          <div class="recall-content-box height100">
            <div class="height-button-main">
              <ul>
                <li>
                  <p>
                    <span class="blue em">住院号：{{patientInfo.inpCode || '--'}}</span>
                    <span class="black em">{{patientInfo.patientName || '--'}}</span>
                    <span
                      v-if="patientInfo.patientGender"
                      class="black em"
                      :val="patientInfo.patientGender"
                      code="GENDER_CODE"
                      v-codeTransform
                    >--</span>
                    <span class="black em">{{patientInfo.patientAge || '--'}}</span>
                    <span class="black em">预缴金余额：{{formatNumber(patientInfo.prepayBalance) || '--'}}</span>
                    <span class="black em">授权透支金额：{{formatNumber(patientInfo.freePayOverdrawAmount) || '--'}}</span>
                  </p>
                </li>
              </ul>

              <div class="user-info">
                <l-card-title>
                  <template slot="left">住院信息</template>
                </l-card-title>
                <div class="info">
                  <div>
                    <p v-for="(item, i) in patientInfoKey" :key="i">
                      <span class="babel">{{item.label}}：</span>
                      <span
                        v-if="item.key == 'inpCode'"
                        class="color1"
                      >{{patientInfo[item.key]}}</span>
                      <span
                        v-else-if="item.key == 'admissionSdeptId'"
                        tableName="sys_org"
                        :conditionMap="{
                            org_type: '_DEPT_',
                            id: patientInfo[item.key]
                          }"
                        columns="org_nm"
                        v-tableTransform
                      >--</span>
                      <span
                        v-else-if="item.key == 'admissionWdeptId'"
                        tableName="sys_ward"
                        :conditionMap="{ward_code: patientInfo[item.key]}"
                        columns="ward_name"
                        v-tableTransform
                      >--</span>
                      <span
                        v-else-if="item.key == 'admissionSituation'"
                        :val="patientInfo[item.key]"
                        code="EntranceCode"
                        v-codeTransform
                      ></span>
                      <span v-else :style="item.style">{{patientInfo[item.key] || '--'}}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div class="user-info">
                <l-card-title>
                  <template slot="left">结算信息</template>
                </l-card-title>
                <div class="info">
                  <div>
                    <p v-for="(item, i) in settleInfoKey" :key="i">
                      <span class="babel">{{item.label}}：</span>
                      <span :style="item.style">{{formatNumber(patientInfo[item.key]) || '--'}}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="height-button-bottom text-align-right">
            <el-button
              type="primary"
              style="border-radius: 2px;"
              v-hotKey="{func:'func_submit', flag: 'isLoading'}"
              @click="confirm"
            >出院召回
            </el-button>
          </div>
        </el-card>
      </template>
    </l-layout>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from "vuex";
  import {getPatientInfo, recallPatient, getInpPatientReceipt, backPatient} from "@/api/ipnw/leaveHos";
  import recallLeftBar from "@/views/ipnw/components/recallLeftBar";

  export default {
    name: "recall",
    components: {
      recallLeftBar
    },
    data() {
      return {
        isLoading: false,
        formParams: [
          "CourtyardArea",
          "technicalOffices",
          "illnessArea",
          "patientsType",
          "patientsState",
          "search"
        ], // 左侧搜索条件
        form: {
          wdeptDischargeTime: null,
          dischargeSituation: "",
          dischargeInstructions: ""
        },
        patientInfo: {
          status: ""
        },
        patientInfoKey: [
          {
            label: "住院号",
            key: "inpCode",
            style: {}
          }, {
            label: "住院科室",
            key: "admissionSdeptId",
            style: {}
          }, {
            label: "住院病区",
            key: "admissionWdeptId",
            style: {}
          },
          {
            label: "床位号",
            key: "bedCode",
            style: {}
          },
          {
            label: "主管医师",
            key: "manageDoctorName",
            style: {}
          }, {
            label: "主管护士",
            key: "manageNurseName",
            style: {}
          }, {
            label: "治疗组",
            key: "medGpId",
            style: {}
          }, {
            label: "病种类型",
            key: "singleDiseaseType",
            style: {}
          }, {
            label: "入院主诊断",
            key: "admissionDiag",
            style: {}
          }, {
            label: "入院情况",
            key: "admissionSituation",
            style: {}
          }, {
            label: "首次入院时间",
            key: "firstAdmissionTime",
            style: {}
          }, {
            label: "入院登记时间",
            key: "finAdmissionTime",
            style: {}
          }, {
            label: "病区入院时间",
            key: "wdeptAdmissionTime",
            style: {}
          }, {
            label: "病区出院时间",
            key: "wdeptDischargeTime",
            style: {}
          }, {
            label: "财务结算时间",
            key: "finSettlementTime",
            style: {}
          }
        ],
        settleInfoKey: [
          {
            label: "总费用",
            key: "total1",
            style: {}
          }, {
            label: "总自付金额",
            key: "selfPayAmount",
            style: {}
          }, {
            label: "总记账金额",
            key: "freePayAmount",
            style: {}
          }, {
            label: "减免总额",
            key: "derateAmount",
            style: {}
          }, {
            label: "预缴款",
            key: "selfPayPrepay",
            style: {}
          }, {
            label: "现金结算金额",
            key: "total6",
            style: {}
          }
        ],
        toolBoxs: ["leaveCost"],
        //当前住院记录
        currentRecord: {}
      };
    },
    computed: {
      ...mapGetters("base", ["receivePatientData"])
    },
    watch: {
      /*receivePatientData: {
        handler(val) {
          this.patientInfo = {
            status: ""
          };
          if (JSON.stringify(val) != "{}") {
            this.getInfo();
          }
        },
        immediate: true,
        deep: true
      }*/
    },
    methods: {
      ...mapActions({
        changeSearchAgainKey: "base/changeSearchAgainKey"
      }),
      updateRecord(data) {
        this.currentRecord = data;
        this.patientInfo = data;
      },
      async getInfo() {
        try {
          let {code, data, msg} = await getPatientInfo(this.receivePatientData.inpCode);
          if (code === 1) {
            this.patientInfo = {
              ...this.patientInfo,
              ...data
            };
          } else {
            this.$message.error(msg);
          }
        } catch (error) {
        }
      },
      // 该出院记录是否有打印发票
      async confirm() {
        if (JSON.stringify(this.currentRecord) != "{}") {
          try {
            this.$showLoading();
            let res = await getInpPatientReceipt({inpCode: this.receivePatientData.inpCode});
            if (res.code == 1) {
              if (res.data) {
                this.$confirm('确认是否已收回发票?', '提示', {
                  confirmButtonText: '是',
                  cancelButtonText: '否',
                  type: 'warning'
                }).then(() => {
                  this.reCall();
                }).catch(() => {
                  this.$hideLoading();
                });
              } else {
                this.reCall();
              }
            } else {
              this.$hideLoading();
            }
          } catch (e) {
            this.$hideLoading();
          }
        } else {
          this.$message.info('请先选择一条出院记录');
        }
      },
      //出院召回
      async reCall() {
        try {
          let params = this.currentRecord;
          let res = await backPatient(params);
          if (res.code == '1') {
            this.$message.success('出院召回成功');
          } else {
            this.$message.error('出院召回失败');
          }
          this.$hideLoading();
        } catch (e) {
          this.$hideLoading();
          this.$message.error('出院召回失败');
        }
      },
      confirm1() {
        this.$confirm("是否召回此病人？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = "执行中...";
              recallPatient({
                ...this.receivePatientData,
                ...this.form,
                finAdId: "1",
                turnType: "1"
              })
                .then(res => {
                  done();
                  instance.confirmButtonLoading = false;
                  if (res.code === 1) {
                    this.$message.success("召回成功");
                  } else {
                    this.$message.error(res.msg || "召回失败");
                  }
                })
                .catch(err => {
                  done();
                  instance.confirmButtonLoading = false;
                  this.$message.error(err.msg || "召回失败");
                });
            } else {
              done();
              this.$message.info("取消召回");
            }
          }
        }).then();
      },
      // 千位分隔
      formatNumber(a) {
        if (!a) {
          return "0.00";
        }
        let res = a
          .toFixed(2)
          .toString()
          .replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
            return $1 + ",";
          });
        return res;
      },
      messageHandler() {
      }
    }
  };
</script>

<style lang="scss" scoped>
  .color1 {
    color: $l-color-primary;
  }

  .color2 {
    color: $l-color-fontcolor-2;
  }

  .height-button-bottom {
    border-top: 1px solid $l-color-bgcolor-18;
    padding: 19px 20px 0;
  }

  .recall-content-box {
    height: calc(100% - 75px);

    .height-button-main {
      padding: 0 20px;
    }

    ul {
      li {
        height: 60px;
        font-size: 16px;
        
        font-weight: bold;
        color: $l-color-fontcolor-3;
        line-height: 24px;

        p {
          margin: 0;
          line-height: 60px;

          span {
            padding: 0 5px;
          }

          .black {
            color: $l-color-fontcolor-3;
          }

          .blue {
            color: $l-color-fontcolor-2;
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
      }
    }

    .user-info {
      .info {
        & > div {
          overflow: hidden;

          p {
            width: 300px;
            font-size: 14px;
            line-height: 20px;
            margin: 10px 0;
            float: left;

            .babel {
              color: $l-color-fontcolor-4;
              display: inline-block;
              width: 100px;
              margin-right: 10px;
              text-align: right;
            }
          }
        }
      }
    }
  }
</style>

