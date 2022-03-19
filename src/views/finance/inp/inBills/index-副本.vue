<template>
  <div class="inBills height100">
    <l-patient-fin class="width100" viewReadCard :type="'inp'" isInPatient="1"></l-patient-fin>
    <el-card class="bill-cont">
      <div class="bill-navBar clearfix">
        <div class="float-left" style="width:360px">
          <l-formt-title label="出院时间">
            <el-date-picker
              v-model="outTime"
              type="datetimerange"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              @change="dateChange">
            </el-date-picker>
          </l-formt-title>
        </div>
        <div class="float-right">
          <el-button type="primary" plain style="width:100px;margin-right: 10px" @click="getNextReceiptNum">刷新
          </el-button>
          <span>当前票号：<span
            style="min-width: 80px;display: inline-block;">{{this.nextReceiptNumOutPO.receiptNum || ''}}</span></span>
          <el-button type="primary" plain style="width:100px;margin-left: 10px" @click="jumpCode">跳号</el-button>
          <el-button type="primary" plain style="width:100px;" @click="billsUse">票据启用</el-button>
        </div>
      </div>
      <el-tabs class="bill-cont-tabs" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane name="name1" label="未打印">
          <el-table
            ref="leftTable"
            :data="leftTableData"
            width="100%"
            height="80%"
            border
            v-loading="loading1"
            highlight-current-row
            @row-click="leftRowClick"
          >
            <el-table-column
              v-for="(item, index) in leftParams"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              :align="item.align || 'left'"
              :header-align="item.headerAlign || 'left'"
              :fixed="item.fixed"
            >
              <template slot-scope="scope">
                <template v-if="item.prop === 'wardId'">
                  <span
                    tableName="sys_ward"
                    :conditionMap="{ward_code: scope.row[item.prop]}"
                    columns="ward_name"
                    v-tableTransform
                  >--</span>
                </template>
                <template v-else-if="item.prop === 'settlementType'">
                  <span
                    :val="scope.row[item.prop]"
                    code="MEDICAL_INSURANCE_CODE"
                    v-codeTransform
                  >-</span>
                </template>
                <template v-else-if="item.prop === 'dischargeDivisionCode'">
                  <span
                    :val="scope.row[item.prop]"
                    code="DIVISION_CODE"
                    v-codeTransform
                  >-</span>
                </template>
                <template
                  v-else-if="item.prop === 'inpCode' || item.prop === 'patientName'|| item.prop === 'bedCode'|| item.prop === 'dischargeTime'|| item.prop === 'settlementTime'">
                  {{scope.row[item.prop]}}
                </template>
                <template v-else>{{formatNumber(scope.row[item.prop])}}</template>
              </template>
            </el-table-column>
          </el-table>
           <el-pagination
              class="float-right page margin-top-20"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageParams.pageNo"
              :page-sizes="[5, 40, 60, 100,300,500,1000,3000,5000,10000]"
              :page-size="pageParams.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pageParams.total" 
        ></el-pagination>


          <div class="button-cont clearfix">
            <el-button type="primary" class="float-right" @click="billPrint">发票打印</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane name="name2" label="已打印">
          <el-table
            ref="rightTable"
            :data="rightTableData"
            width="100%"
            height="calc(100% - 56px)"
            border
            v-loading="loading2"
            highlight-current-row
            @row-click="rightRowClick"
          >
            <el-table-column
              v-for="(item, index) in rightParams"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              :align="item.align || 'left'"
              :header-align="item.headerAlign || 'left'"
              :fixed="item.fixed"
            >
              <template slot-scope="scope">
                <template v-if="item.prop === 'wardId'">
                  <span
                    tableName="sys_ward"
                    :conditionMap="{ward_code: scope.row[item.prop]}"
                    columns="ward_name"
                    v-tableTransform
                  >--</span>
                </template>
                <template v-else-if="item.prop === 'settlementType'">
                  <span
                    :val="scope.row[item.prop]"
                    code="MEDICAL_INSURANCE_CODE"
                    v-codeTransform
                  >-</span>
                </template>
                <template v-else-if="item.prop === 'dischargeDivisionCode'">
                  <span
                    :val="scope.row[item.prop]"
                    code="DIVISION_CODE"
                    v-codeTransform
                  >-</span>
                </template>
                <template
                  v-else-if="item.prop === 'inpCode' || item.prop === 'patientName'|| item.prop === 'bedCode'|| item.prop === 'dischargeTime'|| item.prop === 'settlementTime'|| item.prop === 'receiptNum'">
                  {{scope.row[item.prop]}}
                </template>
                <template v-else>{{formatNumber(scope.row[item.prop])}}</template>
              </template>
            </el-table-column>
          </el-table>
             <el-pagination
              class="float-right page margin-top-20"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageParams.pageNo"
              :page-sizes="[5, 40, 60, 100,300,500,1000,3000,5000,10000]"
              :page-size="pageParams.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pageParams.total" 
        ></el-pagination>

          <div class="button-cont clearfix">
            <el-button type="primary" plain class="float-right" style="margin-left: 10px" @click="newPrint">新票重打
            </el-button>
            <el-button type="primary" plain class="float-right" @click="oldPrint">原票补打</el-button>
            <el-button type="primary" plain class="float-right" @click="emptyPrint">白纸重打</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog title="票据启用" :visible.sync="dialogVisible" width="1500px" :before-close="getNextReceiptNum">
      <div class="width100 padding10">
        <useSelect :inBillForm="inBillForm" style="height:600px"></useSelect>
      </div>
    </el-dialog>
    <el-dialog title="住院收费票据" :visible.sync="dialogVisible1" width="1000px">
      <billsContent :receiptContent="receiptContent"></billsContent>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible1 = false">确定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  let dzData = {
    '1': '1',
    '21': '2',
    '16': '3',
    '12': '4',
    '2': '5',//
    '15': '6',
    '10': '7',
    '20': '8',
    '3': '9',
    '19': '10',//
    '11': '11',
    '33': '12'
  };
  import useSelect from "@/views/finance/receiptManager/components/useSelect";
  import billsContent from "@/views/finance/inp/inBills/components/billsContent";
  import {
    getLeftTableData,
    receiptPrint,
    getReceiptContent,
    reReceiptPrint
  } from "@/api/systemManagement/inBIlls/inBills";
  import {getDatas} from "@/api/wconf/wparam";
  import {mapGetters, mapActions} from "vuex";
  import service from "@/api/cis/receiptPrint/receiptPrint";
  // import {onPreview, onPrint} from '@/utils/print';
  import {print, preview, onPreview} from '@/utils/print';

  export default {
    name: "index",
    components: {
      useSelect,
      billsContent
    },
    data() {
      return {
        finCodeList: {},
        activeName: 'name1',
        outTime: '',//出院时间
        loading1: false,
        loading2: false,
        leftTableData: [],
        leftTableDataUnit: [],
        leftParams: [
          {
            prop: "inpCode",
            label: "住院号",
            align: "left",
            headerAlign: "center",
            fixed: false,
            width: "120"
          },
          {
            prop: "patientName",
            label: "姓名",
            align: "left",
            headerAlign: "center",
            fixed: false,
            width: "120"
          }, {
            prop: "wardId",
            label: "病区",
            align: "left",
            headerAlign: "center",
            fixed: false,
            width: "120"
          }, {
            prop: "bedCode",
            label: "床位号",
            align: "left",
            headerAlign: "center",
            fixed: false,
            width: "120"
          }, {
            prop: "settlementType",
            label: "结算类型",
            align: "left",
            headerAlign: "center",
            fixed: false,
            width: "120"
          }, {
            prop: "dischargeTime",
            label: "出院时间",
            align: "left",
            headerAlign: "center",
            fixed: false,
            width: "150"
          }, {
            prop: "settlementTime",
            label: "结算时间",
            align: "left",
            headerAlign: "center",
            fixed: false,
            width: "150"
          }, {
            prop: "dischargeDivisionCode",
            label: "出院院区",
            align: "left",
            headerAlign: "center",
            fixed: false,
            width: "120"
          }, {
            prop: "selfPayPrepay",
            label: "自付预缴款",
            align: "left",
            headerAlign: "center",
            fixed: false,
            width: "120"
          }, {
            prop: "selfPayAmount",
            label: "总自付金额",
            align: "left",
            headerAlign: "center",
            fixed: false,
            width: "120"
          }, {
            prop: "freePayAmount",
            label: "总记账金额",
            align: "left",
            headerAlign: "center",
            fixed: false,
            width: "120"
          }, {
            prop: "cashChange",
            label: "现金结算",
            align: "left",
            headerAlign: "center",
            fixed: false,
            width: "120"
          }, {
            prop: "cashierCheckChange",
            label: "支票结算",
            align: "left",
            headerAlign: "center",
            fixed: false,
            width: "120"
          }
        ],
        rightTableData: [],
        rightTableDataUnit: [],
        rightParams: [
          {
            prop: "receiptNum",
            label: "票据号",
            align: "left",
            headerAlign: "center",
            fixed: false,
            width: "80"
          }, {
            prop: "inpCode",
            label: "住院号",
            align: "left",
            headerAlign: "center",
            fixed: false,
            width: "120"
          },
          {
            prop: "patientName",
            label: "姓名",
            align: "left",
            headerAlign: "center",
            fixed: false,
            width: "120"
          }, {
            prop: "wardId",
            label: "病区",
            align: "left",
            headerAlign: "center",
            fixed: false,
            width: "120"
          }, {
            prop: "bedCode",
            label: "床位号",
            align: "left",
            headerAlign: "center",
            fixed: false,
            width: "120"
          }, {
            prop: "settlementType",
            label: "结算类型",
            align: "left",
            headerAlign: "center",
            fixed: false,
            width: "120"
          }, {
            prop: "dischargeTime",
            label: "出院时间",
            align: "left",
            headerAlign: "center",
            fixed: false,
            width: "150"
          }, {
            prop: "settlementTime",
            label: "结算时间",
            align: "left",
            headerAlign: "center",
            fixed: false,
            width: "150"
          }, {
            prop: "dischargeDivisionCode",
            label: "出院院区",
            align: "left",
            headerAlign: "center",
            fixed: false,
            width: "120"
          }, {
            prop: "selfPayPrepay",
            label: "自付预缴款",
            align: "left",
            headerAlign: "center",
            fixed: false,
            width: "120"
          }, {
            prop: "selfPayAmount",
            label: "总自付金额",
            align: "left",
            headerAlign: "center",
            fixed: false,
            width: "120"
          }, {
            prop: "freePayAmount",
            label: "总记账金额",
            align: "left",
            headerAlign: "center",
            fixed: false,
            width: "120"
          }, {
            prop: "cashChange",
            label: "现金结算",
            align: "left",
            headerAlign: "center",
            fixed: false,
            width: "120"
          }, {
            prop: "cashierCheckChange",
            label: "支票结算",
            align: "left",
            headerAlign: "center",
            fixed: false,
            width: "120"
          }
        ],
        leftRow: {},
        rightRow: {},
        //下一章票据号
        nextReceiptNumOutPO: {},
        //票据启用
        dialogVisible: false,
        inBillForm: {
          outType: '1',//出库类型
          receiveUserId: '',//领用人员
          receiptType: '3',//票据类型
          abortStatus: '0'//终止标识
        },
        //发票内容
        dialogVisible1: false,
        receiptContent: {
          siCardNum: '',
          bussessTradeCode: '',
          orgType: '',
          emrNum: '',
          adNum: '',
          startDate: '',
          endDate: '',
          inDays: '',
          receiptNum: '',
          patientName: '',
          patientGender: '',
          companyName: '',
          socialSecurityNum: '',
          totalAmt: '',
          totalPrepayAmt: '',
          paymentAmount: '',
          refundAmount: '',
          userId: '',
          employeeCode: '',
          userName: '',
          remainedDepositAmt: '',
          remainedCreditAmt: '',
          prepayReceiptCount: '',
          printTime: ''
        },
          // 分页
      pageParams: {
        pageNo: 0,
        pageSize: 5,
        total: 0
      }
      }
    },
    computed: {
      ...mapGetters("base", ["receivePatientData"])
    },
    watch: {
      receivePatientData: {
        handler() {
          this.dateChange();
        },
        immediate: true,
        deep: true
      }
    },
    async created() {
      await this.getFinCodeList();
      await this.getNextReceiptNum();
    },
    methods: {
      //获取财务分类码主数据
      async getFinCodeList() {
        this.finCodeList = {};
        let resData = await getDatas({
          pageSize: 100,
          page: 1,
          id: 4280
        });
        if (resData.code == 1) {
          let data = resData.data;
          let obj = {};
          for (let i in data) {
            obj[i] = data[i];
          }
          this.finCodeList = obj;
        } else {
          this.finCodeList = {};
        }
      },
      handleClick() {
        this.dateChange();
      },
      async dateChange() {
        this.pageParams.pageNo = 1;
        if (this.activeName === 'name1') {
          await this.getLeftTableData();
        } else if (this.activeName === 'name2') {
          await this.getRightTableData();
        }
      },
      async getLeftTableData() {
        this.loading1 = true;
        await this.getTableData();
        this.leftRow = this.leftTableData[0];
        this.$refs.leftTable.setCurrentRow(this.leftTableData[0]);
        this.loading1 = false;
      },
      async getRightTableData() {
        this.loading2 = true;
        await this.getTableData();
        this.rightRow = this.rightTableData[0];
        this.$refs.rightTable.setCurrentRow(this.rightTableData[0]);
        this.loading2 = false;
      },
      //查询票据
      async getTableData() {
        try {
          let startDischargeTime = '';
          let endDischargeTime = '';
          if (this.outTime.length === 2) {
            startDischargeTime = this.outTime[0];
            endDischargeTime = this.outTime[1];
          }
          let params = {
            startDischargeTime: startDischargeTime,
            endDischargeTime: endDischargeTime,
            inpCode: this.receivePatientData.inpCode || '',
            cardType: this.receivePatientData.cardType || '',
            cardData: this.receivePatientData.cardData || '',
            queryType: this.activeName == 'name1' ? '0' : '1',
            pageNo: this.pageParams.pageNo, // 页码
            pageSize: this.pageParams.pageSize, // 页码大小
          };
          let res = await getLeftTableData(params);
          if (res.code == 1) {
            if (this.activeName == 'name1') {
              this.leftTableData = res.data;
              
            } else if (this.activeName == 'name2') {
              this.rightTableData = res.data;
            }
            this.pageParams.total = res.total;
          } else {
            this.$message.error('获取打印数据失败');
          }
        } catch (e) {
          this.$message.error(e.msg || '获取打印数据失败');
        }
      },
      leftRowClick(row) {
        this.leftRow = row;
      },
      rightRowClick(row) {
        this.rightRow = row;
      },
      // 获取下一张票据号
      async getNextReceiptNum(done) {
        try {
          let res = await service.getNextReceiptNum({
            receiptType: '3'
          });
          if (!res.data) {
            this.$message.error("未找到当前登录人的领用票据信息");
            return;
          }
          this.nextReceiptNumOutPO = res.data;
        } catch (error) {
          this.$message.error(error.msg || "获取下一张票据号失败");
        }
        if(done){
          done();
        }
      },
      //跳号
      async jumpCode() {
        try {
          let obj = {
            outId: this.nextReceiptNumOutPO.outId,
            receiptStartNum: this.nextReceiptNumOutPO.nextReceiptNum,
            receiptStopNum: this.nextReceiptNumOutPO.nextReceiptNum + 1
          };
          let res = await service.receiptJumpNum(obj);
          if (res.code == '1') {
            this.$message({type: 'success', message: '跳号成功'});
          } else {
            this.$message.error(res.msg || "跳号失败");
          }
        } catch (error) {
          this.$message.error(error.msg || "跳号失败");
        }
      },
      //票据启用
      billsUse() {
        this.dialogVisible = true;
      },
      //发票打印
      async billPrint() {
        await this.receiptPrint();
        await this.GetReceiptContent();
        await this.getNextReceiptNum();
        await this.getLeftTableData();
      },
      //新票重打
      async newPrint() {
        await this.reReceiptPrint();
        await this.GetReceiptContent();
        await this.getNextReceiptNum();
        await this.getRightTableData();
      },
      //原票补打
      async oldPrint() {
        this.loading2 = true;
        await this.GetReceiptContent();
        this.handlePrintData();
        this.loading2 = false;
      },
      //白纸重打
      async emptyPrint() {
        this.loading2 = true;
        await this.GetReceiptContent();
        this.handlePrintData();
        this.loading2 = false;
      },
      //发票打印接口
      async receiptPrint() {
        this.loading1 = true;
        try {
          let params = {
            receiptNum: this.nextReceiptNumOutPO.receiptNum,//票据号
            finAdId: this.leftRow.finAdId,//财务住院id
            outId: this.nextReceiptNumOutPO.outId
          };
          let res = await receiptPrint(params);
          if (res.code == 1) {
            this.$message.success('发票打印成功');
          } else {
            this.$message.error('发票打印失败');
          }
          this.loading1 = false;
        } catch (e) {
          this.loading1 = false;
          this.$message.error(e.msg || '发票打印失败');
        }
      },
      //票据补打
      async reReceiptPrint() {
        this.loading2 = true;
        try {
          let params = {
            oldReceiptNum: this.rightRow.receiptNum,
            finAdId: this.rightRow.finAdId,
            outId: this.nextReceiptNumOutPO.outId,
            receiptNum: this.nextReceiptNumOutPO.receiptNum
          };
          let res = await reReceiptPrint(params);
          if (res.code == 1) {
            this.$message.success('发票补打成功');
          } else {
            this.$message.error('发票补打失败');
          }
          this.loading2 = false;
        } catch (e) {
          this.loading2 = false;
          this.$message.error(e.msg || '发票补打失败');
        }
      },
      //获取发票内容
      async GetReceiptContent() {
        try {
          let params = {
            receiptNum: this.rightRow.receiptNum
          };
          let res = await getReceiptContent(params);
          if (res.code == 1) {
            /* 医保卡号 */
            /*private String siCardNum;
            /!* 业务流水号 *!/
            private String bussessTradeCode;
            /!* 医疗机构类型 *!/
            private String orgType;
            /!* 病历号 - 同 住院号*!/
            private String emrNum;
            /!* 住院号 *!/
            private String adNum;
            /!* 住院时间 - 开始 有病区入院时间，取病区入院时间；无病区入院时间，取财务入院时间 *!/
            private Date startDate;
            /!* 住院时间 - 结束 有病区出院时间，取病区出院时间；无病区出院时间，取财务出院时间 *!/
            private Date endDate;
            /!* 住院天数 结束时间 - 开始时间 *!/
            private Integer inDays;
            /!* 收据号 *!/
            private Long receiptNum;
            /!* 姓名 *!/
            private String patientName;
            /!* 性别 *!/
            private String patientGender;
            /!* 医保类型 *!/
            private String companyName;
            /!* 社会保障号码 *!/
            private String socialSecurityNum;
            /!* 合计金额 *!/
            private BigDecimal totalAmt;
            /!* 预缴金额 *!/
            private BigDecimal totalPrepayAmt;
            /!* 补缴金额 *!/
            private BigDecimal paymentAmount;
            /!* 退款金额 *!/
            private BigDecimal refundAmount;
            /!* 操作员ID *!/
            private Long userId;
            /!* 操作员工号 *!/
            private String employeeCode;
            /!* 操作员姓名 *!/
            private String userName;
            /!* 结存金额 *!/
            private BigDecimal remainedDepositAmt;
            /!* 结欠金额 *!/
            private BigDecimal remainedCreditAmt;
            /!* 预缴小票张数 *!/
            private Long prepayReceiptCount;
            /!* 打印时间 *!/
            private Date printTime;*/
            /*let data = {
              siCardNum: '',
              bussessTradeCode: '',
              orgType: '',
              emrNum: '',
              adNum: '',
              startDate: '',
              endDate: '',
              inDays: '',
              receiptNum: '',
              patientName: '',
              patientGender: '',
              companyName: '',
              socialSecurityNum: '',
              totalAmt: '',
              totalPrepayAmt: '',
              paymentAmount: '',
              refundAmount: '',
              userId: '',
              employeeCode: '',
              userName: '',
              remainedDepositAmt: '',
              remainedCreditAmt: '',
              prepayReceiptCount: '',
              printTime: ''
            };*/
            let data = res.data;
            this.receiptContent = data;
          } else {
            this.$message.error('获取发票失败');
          }
        } catch (e) {
          this.$message.error(e.msg || '获取发票失败');
        }
      },
      //金额format
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
      //处理打印数据
      handlePrintData() {
        /*this.receiptContent = {
          "createdAt": "2019-11-11 11:40:51",
          "createdBy": "2c9180866df7dd21016dfdd6b690036a",
          "createdByName": "lixiang",
          "inpCode": "INP191126001",
          "inpFeeClassSumDTOS": [
            {
              "chargeAmount": 26569.20,
              "classCode": "1"
            },
            {
              "chargeAmount": 170.00,
              "classCode": "2"
            },
            {
              "chargeAmount": 1360.00,
              "classCode": "3"
            }
          ],
          "patientName": "寒冰",
          "receiptNum": "H8T",
          "selfPayPrepay": 50.00,
          bussessTradeCode: '1112',
          orgType: 'orgType',
          emrNum: 'emrNum',
          adNum: 'adNum',
          startDate: '2020-01-22 02:56:59',
          endDate: '2020-04-19 04:00:45',
          printTime: '2020-04-19 04:00:45',
          inDays: '30',
          name: '小可爱',
          sex: '女',
          companyName: 'companyName',
          socialSecurityNum: 'socialSecurityNum',
          totalAmt: '25.00',
          totalPrepayAmt: '20.00',
          paymentAmount: '15.00',
          refundAmount: '69.00',
          unit: '空港医院',
          userName: '李想',
          remainedCreditAmt: '200.00',
          remainedDepositAmt: '15.00'
        };*/
        let startDateYear = this.receiptContent.startDate ? this.receiptContent.startDate.split('-')[0] : '';
        let startDateMon = this.receiptContent.startDate ? this.receiptContent.startDate.split('-')[1] : '';
        let startDateDay = this.receiptContent.startDate ? this.receiptContent.startDate.split('-')[2].split(' ')[0] : '';
        let endDateYear = this.receiptContent.endDate ? this.receiptContent.endDate.split('-')[0] : '';
        let endDateMon = this.receiptContent.endDate ? this.receiptContent.endDate.split('-')[1] : '';
        let endDateDay = this.receiptContent.endDate ? this.receiptContent.endDate.split('-')[2].split(' ')[0] : '';
        let printTimeYear = this.receiptContent.printTime ? this.receiptContent.printTime.split('-')[0] : '';
        let printTimeMon = this.receiptContent.printTime ? this.receiptContent.printTime.split('-')[1] : '';
        let printTimeDay = this.receiptContent.printTime ? this.receiptContent.printTime.split('-')[2].split(' ')[0] : '';
        let printData = {
          bussessTradeCode: this.receiptContent.bussessTradeCode || '',
          orgType: this.receiptContent.orgType || '',
          emrNum: this.receiptContent.emrNum || '',
          adNum: this.receiptContent.adNum || this.receiptContent.inpCode || '',
          startDateYear: startDateYear,
          startDateMon: startDateMon,
          startDateDay: startDateDay,
          endDateYear: endDateYear,
          endDateMon: endDateMon,
          endDateDay: endDateDay,
          inDays: this.receiptContent.inDays || '',
          receiptNum: this.receiptContent.receiptNum || '',
          name: this.receiptContent.patientName || '',
          sex: this.receiptContent.patientGender || '',
          companyName: this.receiptContent.companyName || '',
          socialSecurityNum: this.receiptContent.socialSecurityNum || '',
          totalAmt: this.formatNumber(this.receiptContent.totalAmt) || '0.00',
          totalPrepayAmt: this.formatNumber(this.receiptContent.totalPrepayAmt) || '0.00',
          paymentAmount: this.formatNumber(this.receiptContent.paymentAmount) || '0.00',
          refundAmount: this.formatNumber(this.receiptContent.refundAmount) || '0.00',
          selfPayMoney: this.formatNumber(this.receiptContent.selfPayPrepay) || '0.00',
          RMB: this.changeRMB(this.receiptContent.refundAmount) || '零',
          remainedCreditAmt: this.formatNumber(this.receiptContent.remainedCreditAmt) || '0.00',
          remainedDepositAmt: this.formatNumber(this.receiptContent.remainedDepositAmt) || '0.00',
          unit: this.receiptContent.unit || '',
          userName: this.receiptContent.userName || '',
          printTimeYear: printTimeYear,
          printTimeMon: printTimeMon,
          printTimeDay: printTimeDay
        };
        let inpFeeClassSumDTOS = this.receiptContent.inpFeeClassSumDTOS || [];
        let arr = [];
        for (let i in inpFeeClassSumDTOS) {
          if (Number(i) % 3 === 0) {
            let obj = {
              product1: this.finCodeList[inpFeeClassSumDTOS[i].classCode].name || '',
              price1: this.formatNumber(inpFeeClassSumDTOS[i].chargeAmount) || '0.00',
              selfPrice1: this.formatNumber(inpFeeClassSumDTOS[i].chargeAmount) || '0.00'
            };
            if ((Number(i + 1)) < inpFeeClassSumDTOS.length) {
              obj.product2 = inpFeeClassSumDTOS[Number(i) + 1].classCode ? (this.finCodeList[inpFeeClassSumDTOS[Number(i) + 1].classCode].name || '') : '';
              let price2 = inpFeeClassSumDTOS[Number(i) + 1].classCode ? inpFeeClassSumDTOS[Number(i) + 1].chargeAmount : '0.00';
              obj.price2 = this.formatNumber(price2);
              obj.selfPrice2 = this.formatNumber(price2);
            }
            if ((Number(i + 2)) < inpFeeClassSumDTOS.length) {
              obj.product3 = inpFeeClassSumDTOS[Number(i) + 2].classCode ? (this.finCodeList[inpFeeClassSumDTOS[Number(i) + 2].classCode].name || '') : '';
              let price3 = inpFeeClassSumDTOS[Number(i) + 2].classCode ? inpFeeClassSumDTOS[Number(i) + 2].chargeAmount : '0.00';
              obj.price3 = this.formatNumber(price3);
              obj.selfPrice3 = this.formatNumber(price3);
            }
            arr.push(obj);
          }
        }
        printData.inBillsData = arr;
        onPreview(printData, "住院收费票据");
      },
      changeRMB (n) {
        var fraction = ['角', '分'];
        var digit = [
          '零', '壹', '贰', '叁', '肆',
          '伍', '陆', '柒', '捌', '玖'
        ];
        var unit = [
          ['元', '万', '亿'],
          ['', '拾', '佰', '仟']
        ];
        var IsNum = Number(n);
        if (!isNaN(IsNum)) {
          var head = n < 0 ? '欠' : '';
          n = Math.abs(n);
          var s = '';
          for (var i = 0; i < fraction.length; i++) {
            s += (digit[Math.floor(n * 100/10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
          }
          s = s || '整';
          n = Math.floor(n);
          for (var i = 0; i < unit[0].length && n > 0; i++) {
            var p = '';
            for (var j = 0; j < unit[1].length && n > 0; j++) {
              p = digit[n % 10] + unit[1][j] + p;
              n = Math.floor(n / 10);
            }
            s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
          }
          return head + s.replace(/(零.)*零元/, '元')
            .replace(/(零.)+/g, '零')
            .replace(/^整$/, '零元整');
        }
        else {
          return "";
        }
      },
        // 分页
    handleSizeChange(val) {
      this.pageParams.pageSize = val;
      this.getTableData();
    },
     handleCurrentChange(val) {
      this.pageParams.pageNo = val;
      this.getTableData();
    },
    }
  }
</script>

<style scoped lang="scss">
  .inBills {
    .bill-cont {
      height: calc(100% - 76px);
      margin-top: 10px;
      padding: 20px;

      .bill-cont-tabs {
        height: calc(100% - 50px);
        margin-top: 10px;

        .button-cont {
          height: 56px;
          padding: 20px 0 0 20px;
        }

        /deep/ .el-tabs__content {
          height: calc(100% - 50px);
        }
      }
    }
  }
</style>
