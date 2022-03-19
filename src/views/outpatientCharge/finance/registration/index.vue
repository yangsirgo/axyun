<template>
  <div class="body-div" ref="page" v-loading="loading">
    <div class="width100 height100 clearfix">
      <div class="left-cont height100">
        <el-card class="width100 height100">
          <div style="margin-left: 20px">
            <l-card-title>
              <template slot="left">预约列表</template>
            </l-card-title>
          </div>
          <div style="margin:0 20px">
            <el-date-picker
              v-model="dateTime"
              type="datetimerange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              class="width100"
              @change="getOutpList"
            ></el-date-picker>
          </div>
          <el-table :data="appointmentList" border class="mar-top-10" width="100%" height="calc(100% - 110px)">
            <el-table-column
              v-for="(item,index) in appointmentParams"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              header-align="left"
              :align="item.align || 'left'"
              :fixed="item.fixed"
            >
              <template slot-scope="scope">
                <template>
                  <span class="overflow-point">{{ scope.row[item.prop]}}</span>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
      <div class="center-cont height100">
        <el-card class="box-card width100 padding10">
          <div slot="header" class="clearfix">
            <el-row class="width100">
              <el-col :span="5">
                <el-input
                  v-model="cardNum"
                  placeholder="请读取医保卡、身份证、就诊卡"
                  suffix-icon="el-icon-search"
                ></el-input>
              </el-col>
              <el-col :span="4">
                <!--<el-button class="margin-left-40 button-duka" type="primary" @click="readCard">读卡</el-button>-->
                <el-button type="primary" class="duka-button" @click="readCard"><i class="iconfont iconduka"></i>读卡
                </el-button>
              </el-col>
              <el-col :span="15" class="topClock">
                <span class="float-right">
                  <span class="font">{{windowNum}}</span>
                </span>
                <span class="float-right margin-right-10">|</span>
                <span class="float-right margin-right-10">{{nowTime}}</span>
              </el-col>
            </el-row>
          </div>
          <div class="width100">
            <!--<l-divider title="">基本信息</l-divider>-->
            <div style="margin-left: 20px">
              <l-card-title>
                <template slot="left">基本信息</template>
              </l-card-title>
            </div>
            <div style="margin-left: 14px">
              <el-row :gutter="20">
                <el-col :span="2">
                  <img class="img" alt=""/>
                </el-col>
                <el-col :span="18" style="margin-top:12px;">
                  <el-row :gutter="10">
                    <el-col :span="4">
                      <!--<l-inputwith-title
                        :title="'姓名'"
                        v-model="patientInfo.patientName"
                        class="input-width"
                      ></l-inputwith-title>-->
                      <LFormtTitle label="姓名" labelWidth="48">
                        <el-input v-model="patientInfo.patientName" style="line-height: 34px;"
                                  :disabled="true"></el-input>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="4">
                      <!--<l-inputwith-title-->
                      <!--:title="'真实姓名'"-->
                      <!--v-model="patientInfo.patientFullName"-->
                      <!--class="input-width"-->
                      <!--&gt;</l-inputwith-title>-->
                      <LFormtTitle label="真实姓名" labelWidth="76">
                        <el-input v-model="patientInfo.patientFullName" style="line-height: 34px;"
                                  :disabled="true"></el-input>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="4">
                      <!--<l-select-with-title
                        :title="'性别'"
                        v-model="patientInfo.patientGender"
                        class="input-width"
                      ></l-select-with-title>-->
                      <LFormtTitle label="性别" labelWidth="48">
                        <el-select v-model="patientInfo.patientGender" placeholder="请选择" :disabled="true">
                          <el-option
                            label="男"
                            value="0">
                          </el-option>
                          <el-option
                            label="女"
                            value="1">
                          </el-option>
                        </el-select>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="5">
                      <!--<l-inputwith-title
                        :title="'联系方式'"
                        v-model="patientInfo.mobileNum"
                        class="input-width"
                      ></l-inputwith-title>-->
                      <LFormtTitle label="联系方式" labelWidth="76">
                        <el-input v-model="patientInfo.mobileNum" style="line-height: 34px;"
                                  :disabled="true"></el-input>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="7">
                      <!--<el-input placeholder="请输入内容" v-model="patientInfo.identificationNum">
                        <el-select v-model="identificationType" slot="prepend" style="width:90px;">
                          <el-option
                            v-for="item in identificationTypes"
                            :key="item.key"
                            :label="item.value"
                            :value="item.key"
                          ></el-option>
                        </el-select>
                      </el-input>-->
                      <LFormtTitle label="身份证" labelWidth="76">
                        <el-input v-model="patientInfo.identificationNum" style="line-height: 34px;"
                                  :disabled="true"></el-input>
                      </LFormtTitle>
                    </el-col>
                  </el-row>
                  <el-row :gutter="10" class="mar-top-10">
                    <el-col :span="4">
                      <!-- <el-date-picker
                      class="form-width"
                      v-model="patientForm.birthday"
                      type="date"
                      placeholder="选择日期"
                      ></el-date-picker>-->
                      <!--<l-inputwith-title
                        :title="'出生日期'"
                        v-model="patientInfo.birthDate"
                        class="input-width"
                      ></l-inputwith-title>-->
                      <LFormtTitle label="出生日期" labelWidth="76">
                        <el-date-picker
                          v-model="patientInfo.birthDate"
                          type="date"
                          placeholder="" :disabled="true">
                        </el-date-picker>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="4">
                      <!-- <el-time-picker
                      class="form-width"
                      v-model="patientForm.time"
                      :picker-options="{
                          selectableRange: '18:30:00 - 20:30:00'
                        }"
                      placeholder="出生时间"
                      ></el-time-picker>-->
                      <!--<l-inputwith-title
                        :title="'出生时间'"
                        v-model="patientInfo.birthTime"
                        class="input-width"
                      ></l-inputwith-title>-->
                      <LFormtTitle label="出生时间" labelWidth="76">
                        <el-time-select
                          v-model="patientInfo.birthTime"
                          :picker-options="{
                              start: '08:30',
                              step: '00:15',
                              end: '18:30'
                            }"
                          placeholder="" :disabled="true">
                        </el-time-select>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="4">
                      <!-- <l-inputwith-title
                         :title="'年龄'"
                         v-model="patientInfo.age"
                         class="input-width"
                       ></l-inputwith-title>-->
                      <LFormtTitle label="年龄" labelWidth="48">
                        <el-input v-model="patientInfo.age" style="line-height: 34px;" :disabled="true"></el-input>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="12">
                      <!--<l-inputwith-title :title="'联系地址'" class="input-width"></l-inputwith-title>-->
                      <LFormtTitle label="联系地址" labelWidth="76">
                        <el-input style="line-height: 34px;" :disabled="true"></el-input>
                      </LFormtTitle>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="4" style="margin-top:12px;">
                  <div class="block">
                    <div style="margin-bottom: 10px">账户余额</div>
                    <span class="font">
                      {{balanceMoney}}
                      <el-button size="mini" @click="openRecharge"
                                 style="height:22px;line-height: 22px;padding:0 13px;text-align: center">充值
                      </el-button>
                    </span>
                  </div>
                </el-col>
              </el-row>
            </div>
            <!--<l-divider title="挂号信息" class="l-clearfix:after mar-top-20"></l-divider>-->
            <div style="margin-left:20px">
              <l-card-title>
                <template slot="left">挂号信息</template>
              </l-card-title>
            </div>
            <div style="margin-left: 34px">
              <el-row :gutter="10" class="margin-left-10 l-clearfix:after">
                <el-col :span="5">
                  <LFormtTitle label="挂号科室" labelWidth="76">
                    <el-select v-model="reInfo.ouptDeptId" placeholder="请选择">
                      <el-option
                        v-for="item in ouptDeptIds"
                        :key="item.scheduleId"
                        :label="item.deptName"
                        :value="item.ouptDeptId"
                      ></el-option>
                    </el-select>
                  </LFormtTitle>
                </el-col>
                <el-col :span="5">
                  <LFormtTitle label="挂号类别" labelWidth="76">
                    <el-select v-model="reInfo.diagTreatType"
                               :disabled="reInfo.ouptDeptId?false:true"
                               placeholder="请选择">
                      <el-option
                        v-for="item in docTypes"
                        v-if="item.ouptDeptId==reInfo.ouptDeptId?true:false"
                        :key="item.scheduleId"
                        :label="item.diagTreatTypeName"
                        :value="item.diagTreatType"
                      ></el-option>
                    </el-select>
                  </LFormtTitle>
                </el-col>
                <el-col :span="5">
                  <LFormtTitle label="挂号医生" labelWidth="76">
                    <el-select v-model="reInfo.doctorId"
                               :disabled="reInfo.diagTreatType?false:true"
                               @change="getChargesItem">
                      <el-option
                        v-for="item in doctors"
                        v-if="item.diagTreatType==reInfo.diagTreatType && item.ouptDeptId==reInfo.ouptDeptId?true:false"
                        :key="item.scheduleId"
                        :label="item.doctorName"
                        :value="item.doctorId"
                      ></el-option>
                    </el-select>
                  </LFormtTitle>
                </el-col>
                <el-col :span="9">
                  <el-row style="padding-left:35px">
                    <el-col :span="4">
                      <span class="line-height margin-right-10 guahao-text">挂号即收</span>
                    </el-col>
                    <el-col :span="18">
                      <el-checkbox-group v-model="checkeds" @change="handleCheckedChange">
                        <el-checkbox
                          class="line-height"
                          v-for="item in checkboxs"
                          :label="item.key"
                          :key="item.id"
                        >磁卡费
                        </el-checkbox>
                      </el-checkbox-group>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
            <!--<l-divider title="收费信息" class="mar-top-20"></l-divider>-->
            <div style="margin-left:20px">
              <l-card-title>
                <template slot="left">收费信息</template>
              </l-card-title>
            </div>
            <div style="margin-left: 34px">
              <el-row class="margin-left-10">
                <el-table :data="tableData" width="100%" height="208px" border show-summary>
                  <el-table-column
                    v-for="(item,index) in tableParams"
                    :key="index"
                    :prop="item.prop"
                    :label="item.label"
                    :min-width="item.width"
                    header-align="left"
                    :align="item.align || 'left'"
                  >
                    <template slot-scope="scope">
                      <template>
                        <span class="overflow-point">{{ scope.row[item.prop]}}</span>
                      </template>
                    </template>
                  </el-table-column>
                </el-table>
              </el-row>
            </div>
          </div>
          <div style="margin:140px 0 0 34px">
            <hr
              style="border:1 dashed #E4E4E4"
              width="100%"
              class="mar-top-20"
              color="#E4E4E4"
              size="1"
            />
            <span class="bottom-span">
              今日挂号人数合计
              <span class="font">{{headcount}}</span>人
            </span>
            <span class="bottom-span">
              今日挂号总金额
              <span class="font">{{amount}}</span>
            </span>
            <el-button class="float-right mar-top-10">清空</el-button>
            <el-button
              type="primary"
              class="float-right margin-right-10 mar-top-10"
              @click="openDialog"
            >确认挂号
            </el-button>
          </div>
        </el-card>
      </div>
      <div class="right-cont height100">
        <el-card class="width100 height100">
          <!--<l-divider title="预约挂号列表"></l-divider>-->
          <div style="margin-left:20px">
            <l-card-title>
              <template slot="left"><span v-if="patientInfo.patientName">{{patientInfo.patientName+'，'}}</span>历史挂号记录
              </template>
            </l-card-title>
          </div>
          <div style="margin:0 20px;">
            <el-date-picker
              v-model="hisDateTime"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              class="width100"
              @change="getHisList"
            ></el-date-picker>
          </div>

          <el-table :data="historyReg" width="100%" height="calc(100% - 110px)" border class="mar-top-10">
            <el-table-column
              v-for="(item,index) in historyRegtParams"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              header-align="left"
              :align="item.align || 'left'"
              :fixed="item.fixed"
            >
              <template slot-scope="scope">
                <template>
                  <span class="overflow-point">{{ scope.row[item.prop]}}</span>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </div>

    <!-- 确认挂号弹窗 -->
    <el-dialog title="收费" :visible.sync="dialogVisible" width="35%" :before-close="handleClose">
      <charge :charge.sync="charge"></charge>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="this.charge.warning != ''" @click="submitCharge">确定收费</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 充值弹窗 -->
    <el-dialog title="账户充值" :visible.sync="showRecharge" width="28%">
      <recharge class="width100" :patient.sync="info"></recharge>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitRecharge">确定充值</el-button>
        <el-button @click="showRecharge = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 余额不足 -->
    <el-dialog title="账户充值" :visible.sync="balance" width="28%">
      <span class="balance-top">患者余额不足</span>
      <br/>
      <span class="balance-middle">没有余额，无法进行账户扣款</span>
      <br/>
      <span class="balance-nottom">你要继续吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="balance = false">充值</el-button>
        <el-button @click="balance = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import adHeight from "@/mixins/adHeight";
  import charge from "./components/Charge";
  import recharge from "./components/Recharge";
  import service from "@/api/appointment/appointment";

  // 重写date 格式化方法
  Date.prototype.toLocaleString = function () {
    return (
      this.getFullYear() +
      "-" +
      (this.getMonth() + 1) +
      "-" +
      this.getDate() +
      " " +
      this.getHours() +
      ":" +
      this.getMinutes() +
      ":" +
      this.getSeconds() +
      ""
    );
  };

  export default {
    mixins: [adHeight],
    components: {
      recharge,
      charge
    },
    data() {
      return {
        // 预约列表时间
        dateTime: [],
        // 历史挂号区间
        hisDateTime: [],
        // 账户余额
        balanceMoney: 0.0,
        charge: {
          // 支付方式
          payType: "1",
          // 实收
          realGet: 0,
          // 找零
          backMoney: 0,
          chargeObj: {},
          // 表格数据
          tableData: [],
          // 提示数据
          warning: ""
        },
        // 患者充值相关数据
        info: {},
        // 充值组件
        showRecharge: false,
        // 卡号
        cardNum: "0000444555",
        // 当前时间
        nowTime: "2019-08-12 周二 下午03:00",
        // 窗口号
        windowNum: "1号窗口",
        // 证件类型集合
        identificationTypes: [
          {
            key: 1,
            value: "身份证"
          },
          {
            key: 2,
            value: "护照"
          },
          {
            key: 3,
            value: "..."
          }
        ],
        // 证件类型
        identificationType: 1,
        // 挂号信息
        reInfo: {},
        // 表格表头
        tableParams: [
          {
            prop: "statisticsCode",
            label: "费用类型",
            width: "150",
            align: "left"
          },
          {
            prop: "chargeItemName",
            label: "项目名称",
            width: "200",
            align: "left"
          },
          {
            prop: "num",
            label: "数量",
            width: "120",
            align: "left"
          },
          {
            prop: "chargePrice",
            label: "金额",
            width: "120",
            align: "left"
          },
          {
            prop: "remark",
            label: "备注",
            align: "left"
          }
        ],
        // 表格数据
        tableData: [],
        // 挂号总额
        amount: "1231.00",
        // 挂号总人数
        headcount: 321,
        // 挂号科室集合
        ouptDeptIds: [],
        // 诊疗类型
        docTypes: [],
        // 挂号医生
        doctors: [],
        // 结算弹窗
        dialogVisible: false,
        // 预约挂号列表
        appointmentParams: [
          {
            label: "渠道",
            prop: "appointmentMode",
            width: "80",
            align: "left",
            fixed: "left"
          },
          {
            label: "姓名",
            prop: "patientName",
            width: "100",
            align: "left",
            fixed: false
          },
          {
            label: "科室",
            prop: "ouptDeptId",
            width: "120",
            align: "left",
            fixed: false
          },
          {
            label: "时间",
            prop: "appointmentTime",
            width: "180",
            align: "left",
            fixed: false
          }
        ],
        // 预约挂号列表
        appointmentList: [],
        // 历史挂号记录
        historyRegtParams: [
          {
            prop: "date",
            label: "时间",
            width: "110",
            align: "left",
            fixed: "left"
          },
          {
            prop: "dept",
            label: "科室",
            width: "120",
            align: "left",
            fixed: false
          },
          {
            prop: "result",
            label: "进度",
            width: "70",
            align: "left",
            fixed: false
          }
        ],
        // 历史挂号记录
        historyReg: [
          {
            date: "02-03 12:00",
            dept: "泌尿外科",
            result: "已完成"
          },
          {
            date: "02-03 12:00",
            dept: "泌尿外科",
            result: "已完成"
          },
          {
            date: "02-03 12:00",
            dept: "泌尿外科",
            result: "已完成"
          },
          {
            date: "02-03 12:00",
            dept: "泌尿外科",
            result: "已完成"
          }
        ],
        // 余额不足
        balance: false,
        // 排班集合
        scheduleList: [],
        // 挂号即收选中集合
        checkeds: [],
        // 挂号即收集合
        checkboxs: [
          {
            id: "1",
            key: "1",
            value: "病历本",
            chargePrice: "10",
            statisticsCode: "病历本",
            chargeItemName: "病历本",
            num: "1",
            remark: ""
          },
          {
            id: "2",
            key: "2",
            value: "磁卡费",
            chargePrice: "10",
            statisticsCode: "磁卡费",
            chargeItemName: "磁卡费",
            num: "1",
            remark: ""
          }
        ],
        // 患者信息
        patientInfo: {},
        // 待收费对象集合
        chargePrescriptions: [],
        // 加载
        loading: false,
        // 当前排班
        schdelu: {},
        // 预约挂号对象
        outpObj: {}
      };
    },
    mounted() {
      // 时钟
      let _this = this; // 声明一个变量指向Vue实例this，保证作用域一致
      this.timer = setInterval(() => {
        _this.nowTime = new Date().toLocaleString(); // 修改数据date
      }, 1000);
      // 拿到排班
      this.getSchedele();
      // 拿到预约列表
      this.getOutpList();
    },
    beforeDestroy() {
      if (this.timer) {
        clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
      }
    },
    watch: {
      charge(val) {
        this.charge = val;
      }
    },
    methods: {
      handleClose(done) {
        this.$confirm("确认关闭？")
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
      },
      // 打开弹窗
      async openDialog() {
        var _this = this;
        // 预约挂号
        try {
          this.$showLoading();
          const outp = await service.createOutp({
            visitCode: Math.floor(Math.random()*100000), // 暂时随机生成
            patientId: this.patientInfo.patientId,
            patientName: this.patientInfo.patientName,
            patientGender: this.patientInfo.patientGender,
            birthDate: this.patientInfo.birthDate,
            phoneNum: this.patientInfo.phoneNum,
            identificationType: "1", // 暂时写死身份证
            identificationNum: this.patientInfo.identificationNum,
            patientAddr: this.patientInfo.patientAddr,
            appointmentMode: "1",
            scheduleSerialId: this.schdelu.scheduleId,
            appointmentTime: this.schdelu.dutyStartTime
          });
          this.outpObj = outp.data;
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "标准错误提示");
          this.resetData();
          return;
        }
        // 待收费对象转换
        this.changeObj();
        // 预结算
        try {
          this.$showLoading();
          const {data} = await service.preSettlement({
            ouptDeptId: this.reInfo.ouptDeptId,
            doctorId: this.reInfo.doctorId,
            doctorName: "韦超兵",
            patientName: this.patientInfo.patientName,
            patientId: this.patientInfo.patientId,
            chargeType: "1",
            deptId: "1231",
            chargePrescriptions: this.chargePrescriptions,
            diagTreatActivityId: this.outpObj.appointmentId    // 诊疗活动id
          });
          this.charge.tableData = this.tableData;
          this.$delete(data, "data");
          this.charge.chargeObj = {
            ...data,
            chargePrescriptions: this.chargePrescriptions
          };
          this.dialogVisible = true;
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          // 回滚预约信息
          service.delOutp({
            appointmentId: this.outpObj.appointmentId,
            dataVersion: this.outpObj.dataVersion
          });
          this.resetData();
        }
      },
      // 对象转换
      changeObj() {
        for (let i = 0; i < this.tableData.length; i++) {
          let item = this.tableData[i];
          let obj = {
            orderName: item.chargeItemName,
            dosageUnit: item.chargeUnit,
            quantity: "1",
            price: item.chargePrice,
            orderItemId: item.chargeItemId,
            orderItemCat: item.statisticsCode,
            prescriptionSource: "9",
            deptId: "1231",
            num: "1",
            visitId: this.outpObj.appointmentId,
            ouptDeptId: this.reInfo.ouptDeptId, // 专科id
            groupId: item.groupNo,  // 组号
            groupNo: item.groupNo
          };
          this.chargePrescriptions.push(obj);
        }
      },
      // 打开充值弹窗
      openRecharge() {
        this.showRecharge = true;
      },
      // 确认充值
      async submitRecharge() {
        const {data} = await service.prestore(this.info);
        // 刷新余额
        const accountInfo = await service.getAccountInfo(
          this.patientInfo.patientId
        );
        this.balanceMoney = accountInfo.data.balanceMoney;
        this.showRecharge = false;
      },
      // 确认收费
      async submitCharge() {
        if (this.charge.chargeObj.cashPay == 0) {
          try {
            this.$showLoading();
            const response = await service.settlement(this.charge.chargeObj);
            if (response.code == "1") {
              this.$message({
                message: response.msg,
                type: "success"
              });
              this.resetData();
            }
            this.dialogVisible = false;
            this.$hideLoading();
          } catch (error) {
            this.$hideLoading();
            if (error.code == "0") {
              // 回滚预约信息
              service.delOutp({
                appointmentId: this.outpObj.appointmentId,
                dataVersion: this.outpObj.dataVersion
              });
              this.resetData();
              return;
            }
          }
        } else if (this.charge.chargeObj.cashPay > 0) {
          let prestore = "";
          try {
            this.$showLoading();
            // 充值
            const response = await service.prestore({
              prestoreMoney: this.charge.chargeObj.cashPay,
              patientId: this.patientInfo.patientId,
              patientName: this.patientInfo.patientName,
              prestoreCode: "01",
              businessType: "1",
              payTypeId: "1"
            });
            prestore = response.data.prestoreDetailId;
            this.$hideLoading();
          } catch (error) {
            this.$hideLoading();
            if (error.code == "0") {
              // 回滚预约信息
              service.delOutp({
                appointmentId: this.outpObj.appointmentId,
                dataVersion: this.outpObj.dataVersion
              });
              this.resetData();
              return;
            }
          }
          try {
            this.$showLoading();
            // 结算  （充完值，预结算对象 的值 要不要变）
            const res = await service.settlement({
              ...this.charge.chargeObj,
              prestoreDetailId: prestore
            });
            if (res.code == "1") {
              this.$message({
                message: res.msg,
                type: "success"
              });
              this.resetData();
            }
            this.dialogVisible = false;
            this.$hideLoading();
          } catch (error) {
            this.$hideLoading();
            if (error.code == "0") {
              // 回滚预约信息
              service.delOutp({
                appointmentId: this.outpObj.appointmentId,
                dataVersion: this.outpObj.dataVersion
              });
              this.resetData();
              return;
            }
          }
        }
      },
      // 拿到当前(分上午下午)排班
      async getSchedele() {
        this.$showLoading();
        const hour = new Date().getHours();
        let sDate = "";
        let eDate = "";
        if (hour < 12) {
          sDate =
            new Date().getFullYear() +
            "-" +
            (new Date().getMonth() + 1) +
            "-" +
            new Date().getDate() +
            " " +
            "00:00:00";
          eDate =
            new Date().getFullYear() +
            "-" +
            (new Date().getMonth() + 1) +
            "-" +
            new Date().getDate() +
            " " +
            "12:00:00";
        } else {
          sDate =
            new Date().getFullYear() +
            "-" +
            (new Date().getMonth() + 1) +
            "-" +
            new Date().getDate() +
            " " +
            "12:00:00";
          eDate =
            new Date().getFullYear() +
            "-" +
            (new Date().getMonth() + 1) +
            "-" +
            new Date().getDate() +
            " " +
            "23:59:59";
        }
        // 为了调试数据 日期暂时写死
        const {data} = await service.getScheduleList({
          // startDate: "2019-08-22 01:00:00",
          // stopDate: "2019-08-26 00:00:00"
          startDate: sDate,
          stopDate: eDate
        });
        this.scheduleList = data;
        // 去重 拿到所有科室
        let obj = {};
        let aaa = {};
        let bbb = {};
        let ccc = {};
        for (let i = 0; i < data.length; i++) {
          if (!obj[data[i].ouptDeptId]) {
            this.ouptDeptIds.push(data[i]);
            obj[data[i].ouptDeptId] = true;
          }
          if (!aaa[data[i].diagTreatType]) {
            this.docTypes.push(data[i]);
            aaa[data[i].diagTreatType] = true;
          }
          if (!ccc[data[i].doctorId]) {
            this.doctors.push(data[i]);
            ccc[data[i].doctorId] = true;
          }
        }
        this.$hideLoading();
      },
      // 根据就诊类型 查询收费项目
      async getChargesItem() {
        // 根据医生id 查询职称代码
        for (let i = 0; i < this.scheduleList.length; i++) {
          if (this.scheduleList[i].doctorId == this.reInfo.doctorId) {
            this.$set(this.reInfo, "workCode", this.scheduleList[i].workCode);
          }
        }
        const {data} = await service.getChargesItem(this.reInfo);
        this.tableData.push(data);
        // 设置当前排班
        this.setSchdule();
        // this.getTotalAmount();
      },
      // 设置当前排班
      setSchdule() {
        for (let i = 0; i < this.scheduleList.length; i++) {
          if (
            this.scheduleList[i].ouptDeptId == this.reInfo.ouptDeptId &&
            this.scheduleList[i].diagTreatType == this.reInfo.diagTreatType &&
            this.scheduleList[i].doctorId == this.reInfo.doctorId
          ) {
            this.schdelu = this.scheduleList[i];
          }
        }
      },
      // 计算 总数量，总金额
      getTotalAmount() {
        // let total = "0.00";
        // let num = 0;
        // for (let i = 0; i < this.tableData.length; i++) {
        //   if (this.tableData[i].total) {
        //     this.tableData.splice(i, 1);
        //   }
        // }
        // for (let j = 0; j < this.tableData.length; j++) {
        //   total = parseFloat(this.tableData[j].chargePrice) + parseFloat(total);
        //   num = parseInt(this.tableData[j].num) + parseInt(num);
        // }
        // this.tableData.push({
        //   chargePrice: total,
        //   statisticsCode: "总计",
        //   chargeItemName: "总计",
        //   num: num,
        //   remark: ""
        // });
        // this.charge.getMoney = total;
      },
      // 磁卡费。。
      handleCheckedChange() {
        // for(let i=0;i<this.tableData.length;i++){
        //   if(this.checkeds.indexOf(this.tableData[i] != -1)){
        //     this.tableData.splice(i,1)
        //   }
        // }
        // for(let i=0;i<this.checkeds.length;i++){
        //   this.tableData.push(this.checkeds[i])
        // }
      },
      // 读卡
      async readCard() {
        try {
          this.$showLoading();
          const {data} = await service.getPatientInfo({cardNum: this.cardNum});
          this.patientInfo = {...data};
          if (data) {
            const accountInfo = await service.getAccountInfo(data.patientId);
            this.balanceMoney = accountInfo.data.balanceMoney;
            this.info = {
              ...data,
              ...accountInfo.data
            };
            this.getHisList();
          }
          this.$hideLoading();
        } catch (error) {
          this.$message.error(error.msg || "标准错误提示");
          this.$hideLoading();
        }
      },
      // 重置，清空数据
      resetData() {
        this.reInfo = {};
        this.patientInfo = {};
        this.tableData = [];
        this.outpObj = {};
      },
      // 拿到挂号即收项目
      async getItem() {
        try {
          const response = await service.getItem();
        } catch (error) {
          this.$message.error(error.msg || "标准错误提示");
        }
      },
      // 获取预约列表
      async getOutpList() {
        try {
          this.$showLoading();
          let sDate = '';
          let eDate = '';
          if (this.dateTime && this.dateTime.length > 1) {
            sDate = this.dateTime[0].toLocaleString();
            eDate = this.dateTime[1].toLocaleString();
          }
          const response = await service.getOutpList({
            sDate: sDate,
            eDate: eDate
          });
          this.appointmentList = response.data;
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "标准错误提示");
        }
      },
      // 获取历史收费记录
      async getHisList() {
        try {
          this.$showLoading();
          let sDate = '';
          let eDate = '';
          if (this.hisDateTime && this.hisDateTime.length > 1) {
            sDate = this.hisDateTime[0].toLocaleString();
            eDate = this.hisDateTime[1].toLocaleString();
          }
          const response = await service.getHisList({
            patientId: this.patientInfo.patientId,
            sDate: sDate,
            eDate: eDate
          });
          this.historyReg = response.data;
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "标准错误提示");
        }
      },
    }
  };
</script>


<style lang="scss" scoped>
  .guahao-text {
    font-size: $l-font-size;
    
    font-weight: 400;
    color: $l-color-fontcolor-4;
  }

  .body-div {
    .left-cont {
      width: 292px;
      float: left;
    }

    .center-cont {
      width: calc(100% - 580px);
      margin-left: 20px;
      float: left;
      overflow-y: auto;
    }

    .right-cont {
      width: 248px;
      float: right;
    }

    .topClock {
      span:not(.font)  {
        color: #949da3;
        font-size: 14px;
        line-height: 20px;

        .font {
          font-weight: $l-font-weight;
          color: #2e323a;
          font-size: 20px;
        }
      }
    }

    .center {
      // padding-right: 250px;
    }

    .mar-top-20 {
      margin-top: 20px;
    }

    .mar-top-10 {
      margin-top: 10px;
    }

    .input-width {
      width: 100%;
    }

    .img {
      width: 80px;
      height: 102px;
      background: rgba(245, 245, 245, 1);
      border-radius: 2px;
      border: 1px solid rgba(228, 228, 228, 1);
      margin-left: 24px;
    }

    .block {
      width: 100%;
      height: 82px;
      background: rgba(245, 245, 245, 1);
      border-radius: 2px;
      padding-top: 20px;
      text-align: center;

      span:not(.font)  {
        color: #949da3;
        font-size: $l-font-weight;
      }

      .font {
        color: $l-color-primary;
        font-weight: $l-font-weight;
        font-size: 20px;
      }
    }

    .line-height {
      line-height: 40px;
    }

    .count {
      width: 100%;
      height: 42.6px;
      border-bottom: 1px solid #e4e4e4;
    }

    .bottom-span {
      line-height: 50px;
      margin-right: 30px;
      color: #949da3;
      font-size: $l-font-size;

      .font {
        font-weight: $l-font-weight;
        color: #2e323a;
        margin-left: 5px;
        margin-right: 5px;
        font-size: 20px;
      }
    }

    .dialog {
      width: 400px;
      height: 600px;
    }

    .payType {
      width: 100%;
    }

    .el-dialog__body {
      padding-top: 0px !important;
      padding-bottom: 10px !important;
    }

    .el-card__header {
      padding-top: 10px;
      padding-bottom: 10px;
    }

    .balance-middle {
      font-size: 14px;
      font-weight: 400;
      color: rgba(61, 125, 251, 1);
      line-height: 30px;
    }

    .balance-top {
      font-size: 16px;
      font-weight: 400;
      color: rgba(46, 50, 58, 1);
      line-height: 34px;
    }

    .balance-bottom {
      font-size: 14px;
      font-weight: 400;
      color: rgba(148, 157, 163, 1);
      line-height: 30px;
    }
  }

  .box-card {
    overflow-y: auto;

    .duka-button {
      width: 200px;
      height: 36px;
      margin-left: 10px;
      border: none;
      border-radius: 2px;
      float: left;

      i {
        display: inline-block;
        margin-right: 10px;
      }
    }
  }
</style>
