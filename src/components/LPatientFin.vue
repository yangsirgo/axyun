<template>
  <div>
    <div class="msg_header clearfix" v-if="type == 'outp'">
      <el-row :gutter="10" class="width100 height100">
        <el-col :span="5" class="height100" v-if="viewReadCard">
          <!-- <div> -->
          <l-read-card @readCard="readCard" class="margin-left-10"></l-read-card>
          <!-- </div> -->
        </el-col>
        <el-col :span="18">
          <div v-if="item.patientName" class="msg_header_inner">
            <div v-if="!widthMin" class="person">
              <span class="person_number">{{ item.patientCode }}</span>
              <span>{{ item.patientName }}</span>
              <span
                :val="item.patientGender"
                code="GENDER_CODE"
                v-codeTransform
                v-if="item.patientGender"
              ></span>
              <!--<span v-if="item.age">{{item.age}} 岁</span>-->
              <span>{{ item.patientAge }}</span>
              <span class="pad20">{{ item.settlementType || "自费" }}</span>
              <span class="money">预存余额：{{ formatNumber(balanceMoney)}} （元）</span>
              <span class="money">授权透支金额：{{ formatNumber(grantOverdrawMoney)}} （元）</span>
            </div>
            <div v-if="widthMin" class="person">
              <el-popover ref="popover" placement="bottom" width="500" trigger="click">
                <div>
                  <el-row :gutter="10" class="margin-top-10">
                    <el-col :span="12">
                      <span class="patientInfo">姓名：{{ item.patientName }}</span>
                    </el-col>
                    <el-col :span="12">
                      <span class="patientInfo">性别：</span>
                      <span
                        class="patientInfo"
                        :val="item.patientGender"
                        code="GENDER_CODE"
                        v-codeTransform
                        v-if="item.patientGender"
                      ></span>
                    </el-col>
                  </el-row>
                  <el-row :gutter="10" class="margin-top-10">
                    <el-col :span="12">
                      <span class="patientInfo">年龄：{{ item.patientAge }}</span>
                    </el-col>
                    <el-col :span="12">
                      <span class="patientInfo">结算类型：{{ item.settlementType || "自费"}}</span>
                    </el-col>
                  </el-row>
                  <el-row :gutter="10" class="margin-top-10">
                    <el-col :span="12">
                      <span class="patientInfo">门诊预存余额：{{ formatNumber(balanceMoney) }}（元）</span>
                    </el-col>
                    <el-col :span="12">
                      <span class="patientInfo">授权透支金额：{{ formatNumber(grantOverdrawMoney) }}（元）</span>
                    </el-col>
                  </el-row>
                </div>
              </el-popover>
              <el-button type="text" v-popover:popover>
                {{ item.patientName }}
                <i class="el-icon-caret-bottom"></i>
              </el-button>
              <span
                :val="item.patientGender"
                code="GENDER_CODE"
                v-codeTransform
                v-if="item.patientGender"
              ></span>
              <!--<span v-if="item.age">{{item.age}} 岁</span>-->
              <span>{{ item.patientAge }}</span>
            </div>
          </div>
          <div v-else class="noneData">
            <div class="person">
              <span class="person_number">0000000000</span>
              <span>姓名</span>
              <span>性别</span>
              <span>年龄</span>
              <span v-if="!widthMin">预存余额：0.00</span>
              <span v-if="!widthMin">授权透支金额：0.00</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="msg_header clearfix" v-if="type == 'inp'">
      <el-row :gutter="10" class="width100 height100">
        <el-col :span="6" class="height100" v-if="viewReadCard">
          <el-row :gutter="10">
            <el-col :span="18" class="margin-left-10">
              <el-input placeholder="请输入内容" v-model="inpValue" class="input-with-select">
                <el-select v-model="select" slot="prepend" placeholder="请选择" style="width:90px;">
                  <el-option label="就诊卡" value="1"></el-option>
                  <el-option label="住院号" value="2"></el-option>
                  <el-option label="床位号" value="3"></el-option>
                </el-select>
              </el-input>
            </el-col>
            <el-col :span="5">
              <el-button type="primary" v-if="select == '1'" @click="selInp">读卡</el-button>
              <el-button type="primary" v-if="select == '2'" @click="selInp">查询</el-button>
              <el-button type="primary" v-if="select == '3'" @click="selInpByBed">查询</el-button>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="18">
          <div v-if="item.patientName" class="msg_header_inner">
            <div v-if="!widthMin" class="person">
              <span class="person_number">{{ item.inpCode }}</span>
              <!-- <span>{{ item.patientName }}</span> -->
              <el-popover ref="popover" placement="bottom" width="500" trigger="click">
                <div>
                  <el-row :gutter="10" class="margin-top-10">
                    <el-col :span="12">
                      <span class="patientInfo">姓名：{{ item.patientName }}</span>
                    </el-col>
                    <el-col :span="12">
                      <span class="patientInfo">性别：</span>
                      <span
                        class="patientInfo"
                        :val="item.patientGender"
                        code="GENDER_CODE"
                        v-codeTransform
                        v-if="item.patientGender"
                      ></span>
                    </el-col>
                  </el-row>
                  <el-row :gutter="10" class="margin-top-10">
                    <el-col :span="12">
                      <span class="patientInfo">年龄：{{ item.patientAge }}</span>
                    </el-col>
                    <el-col :span="12">
                      <span class="patientInfo">结算类型：</span>
                      <span
                        :val="item.settlementType"
                        code="MEDICAL_INSURANCE_CODE"
                        v-codeTransform
                      >自费</span>
                    </el-col>
                  </el-row>
                  <el-row :gutter="10" class="margin-top-10">
                    <el-col :span="12">
                      <span class="patientInfo">预交款余额：{{ formatNumber(item.prepayBalance) }}（元）</span>
                    </el-col>
                    <el-col :span="12">
                      <span class="patientInfo">授权透支金额：{{ formatNumber(item.freePayOverdrawAmount) }}（元）</span>
                    </el-col>
                  </el-row>
                </div>
              </el-popover>
              <el-button type="text" v-popover:popover>
                {{ item.patientName }}
                <i class="el-icon-caret-bottom"></i>
              </el-button>
              <span
                :val="item.patientGender"
                code="GENDER_CODE"
                v-codeTransform
                v-if="item.patientGender"
              ></span>
              <!--<span v-if="item.age">{{item.age}} 岁</span>-->
              <span>{{ item.patientAge }}</span>
              <!-- <span class="pad20">{{ item.settlementType || "自费" }}</span> -->
              <span
                class="pad20"
                :val="item.settlementType"
                code="MEDICAL_INSURANCE_CODE"
                v-codeTransform
              >自费</span>
              <span class="money">预交款余额：{{ formatNumber(item.prepayBalance)}} （元）</span>
              <span class="money">授权透支金额：{{ formatNumber(item.freePayOverdrawAmount)}} （元）</span>
            </div>
            <div v-if="widthMin" class="person">
              <el-popover ref="popover" placement="bottom" width="500" trigger="click">
                <div>
                  <el-row :gutter="10" class="margin-top-10">
                    <el-col :span="12">
                      <span class="patientInfo">姓名：{{ item.patientName }}</span>
                    </el-col>
                    <el-col :span="12">
                      <span class="patientInfo">性别：</span>
                      <span
                        class="patientInfo"
                        :val="item.patientGender"
                        code="GENDER_CODE"
                        v-codeTransform
                        v-if="item.patientGender"
                      ></span>
                    </el-col>
                  </el-row>
                  <el-row :gutter="10" class="margin-top-10">
                    <el-col :span="12">
                      <span class="patientInfo">年龄：{{ item.patientAge }}</span>
                    </el-col>
                    <el-col :span="12">
                      <span class="patientInfo">结算类型：</span>
                      <span
                        :val="item.settlementType"
                        code="MEDICAL_INSURANCE_CODE"
                        v-codeTransform
                      >自费</span>
                    </el-col>
                  </el-row>
                  <el-row :gutter="10" class="margin-top-10">
                    <el-col :span="12">
                      <span class="patientInfo">预交款余额：{{ formatNumber(item.prepayBalance) }}（元）</span>
                    </el-col>
                    <el-col :span="12">
                      <span class="patientInfo">授权透支金额：{{ formatNumber(item.freePayOverdrawAmount) }}（元）</span>
                    </el-col>
                  </el-row>
                </div>
              </el-popover>
              <el-button type="text" v-popover:popover>
                {{ item.patientName }}
                <i class="el-icon-caret-bottom"></i>
              </el-button>
              <span
                :val="item.patientGender"
                code="GENDER_CODE"
                v-codeTransform
                v-if="item.patientGender"
              ></span>
              <!--<span v-if="item.age">{{item.age}} 岁</span>-->
              <span>{{ item.patientAge }}</span>
            </div>
          </div>
          <div v-else class="noneData">
            <div class="person">
              <span class="person_number">0000000000</span>
              <span>姓名</span>
              <span>性别</span>
              <span>年龄</span>
              <span v-if="!widthMin">预交款余额：0.00</span>
              <span v-if="!widthMin">授权透支金额：0.00</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import LReadCard from "@/components/LReadCard";
  import {mapGetters, mapActions} from "vuex";
  import service from "@/api/financeManagement/prestoreGrant";
  import appointment from "@/api/appointment/appointment";

  export default {
    components: {LReadCard},
    props: {
      viewReadCard: {
        type: Boolean,
        default: false
      },
      widthMin: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        default: 'outp'
      },
      isInPatient: {
        type: String,
        default: '0'
      },
      usePublicPData: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        // 预存余额
        balanceMoney: "",
        // 授权透支金额
        grantOverdrawMoney: "",
        //住院号卡号。。
        inpValue: '',
        select: '2',
        // 当前患者
        item: {}
      };
    },
    computed: {
      ...mapGetters("base", ["receivePatientData"]),
      ...mapGetters("finPublicPData", ["finPatientInfo"])
    },
    watch: {
      receivePatientData: {
        handler(val) {
          if(this.usePublicPData){
            this.item = {
              ...val
            };
            this.getPatientPrestore();
          }
        },
        immediate: true,
        deep: true
      },
      finPatientInfo: {
        handler(val) {
          if(!this.usePublicPData){
            this.item = {
              ...val
            };
            this.getPatientPrestore();
          }
        },
        immediate: true,
        deep: true
      }
    },
    methods: {
      ...mapActions({
        changeRecPatientData: "base/changeRecPatientData"
      }),
      readCard(data) {
        this.item = {
          ...data
        };
        this.changeRecPatientData(this.item);
      },
      // 查询患者账户信息
      async getPatientPrestore() {
        try {
          if (!this.item || !this.item.patientId) {
            return;
          }
          let res = await service.getPatientPrestore({
            patientId: this.item.patientId
          });
          this.balanceMoney = res.data.balanceMoney;
          this.grantOverdrawMoney = res.data.grantOverdrawMoney;
        } catch (error) {
          console.info(error);
          this.$message.error(error.msg || "查询患者账户信息失败");
        }
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
      // 住院读卡
      selInp() {
        if (!this.inpValue) {
          this.$message.error("请输入卡号");
          return;
        }
        if (this.select == '1') {
          this.getPatient();
        } else {
          this.getInpPatient({});
        }
      },
      // 读卡查询患者
      async getPatient() {
        try {
          this.$showLoading();
          let res = await appointment.getCardDetailInfo({
            cardNum: this.inpValue || ""
          });
          if (!res.data.patientId) {
            this.$message("未查询到患者");
          }else{
            this.$hideLoading();
            this.getInpPatient(res.data);
          }
          this.item = res.data;
          this.changeRecPatientData(res.data);

        } catch (error) {
          this.$hideLoading();
          console.info(error);
          this.$message.error("读卡失败");
        }
      },
      // 根据就诊号床位号查询患者
      async getInpPatient(cardData) {
        try {
          this.$showLoading();
          let obj = {
            patientId: this.item.patientId,
            inpCode: null,
            bedCOde: null
          }
          if (this.select == '2') {
            obj.inpCode = this.inpValue
          } else if (this.select == '3') {
            obj.bedCOde = this.inpValue
          }
          let res;
          if (this.isInPatient === '1') {
            //撤床
            res = await service.getInpOutInfo(obj);
            if (!res.data.length) {
              this.$message("未查询到患者");
            } else {
              res.data[0].patientAge = this.item.patientAge;
              this.item = res.data[0];
              this.changeRecPatientData({
                ...cardData,
                ...res.data[0]
              });
            }
          } else {
            res = await service.getInpInfo(obj);
            if (!res.data || !res.data.patientId) {
              this.$message("未查询到患者");
              // this.changeRecPatientData(res.data);
              // this.$hideLoading();
              // return;
            }
            res.data.patientAge = this.item.patientAge;
            this.item = res.data;
            this.changeRecPatientData({
              ...cardData,
              ...res.data
            });
          }
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          console.info(error);
          this.$message.error("读卡失败");
        }
      },
      // 根据床位号查询患者
      async selInpByBed() {
        try {
          this.$showLoading();
          let obj = {}
          if (this.select == '3') {
            obj.bedCode = this.inpValue
          }
          let res;
          if (this.isInPatient === '1') {
            //撤床
            res = await service.getInpOutInfo(obj);
            if (!res.data.length) {
              this.$message("未查询到患者");
            } else {
              this.item = res.data[0];
              this.changeRecPatientData({...res.data[0]});
            }
          } else {
            res = await service.getInpPatientByBed(obj);
            if (!res.data || !res.data.patientId) {
              this.$message("未查询到患者");
            }
            this.item = res.data;
            this.changeRecPatientData(res.data);
          }
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          console.info(error);
          this.$message.error("读卡失败");
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  .patientInfo {
  }

  .margin-top-10 {
    margin-top: 10px;
  }

  .msg_header {
    line-height: 66px;
    height: 66px;
    background-color: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    margin-bottom: 10px;
    border-radius: 4px;
    overflow: hidden;

    .readCard {
      width: 300px;
      height: 66px;
    }

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
  }

  .money {
    color: $l-color-primary;
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
</style>
