<template>
  <div class="costsTabs width100 height100">
    <div class="height100" v-loading="loading">
      <!--<div class="depart-select">
      <LFormtTitle label="就诊科室">
        <el-select v-model="depart"
                   placeholder="请选择科室"
                   @change="departChange">
          <el-option
            v-if="departList != []"
            v-for="item in departList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </LFormtTitle>
    </div>-->
      <div class="title">
        <l-card-title>
          <span slot="left">总费用</span>
          <span slot="right">
              <el-button type="primary" @click="charge1">缴费</el-button>
            </span>
        </l-card-title>
        <div class="title-cont">
          <el-row style="margin-bottom:10px">
            <el-col :span="6">
              <el-col :span="6">西药费</el-col>
              <el-col :span="18">{{visitCosts.wesMedicine || '--'}}</el-col>
            </el-col>
            <el-col :span="6">
              <el-col :span="6">中药费</el-col>
              <el-col :span="18">{{visitCosts.eastMedicine || '--'}}</el-col>
            </el-col>
            <el-col :span="6">
              <el-col :span="6">治疗费</el-col>
              <el-col :span="18">{{visitCosts.treatment || '--'}}</el-col>
            </el-col>
            <el-col :span="6">
              <el-col :span="6">检查费</el-col>
              <el-col :span="18">{{visitCosts.check || '--'}}</el-col>
            </el-col>
          </el-row>
          <el-row style="margin-bottom:10px">
            <el-col :span="6">
              <el-col :span="6">挂号费</el-col>
              <el-col :span="18">{{visitCosts.yuyue || '--'}}</el-col>
            </el-col>
            <el-col :span="6">
              <el-col :span="6">检验费</el-col>
              <el-col :span="18">{{visitCosts.examine || '--'}}</el-col>
            </el-col>
            <el-col :span="6">
              <el-col :span="6">采血费</el-col>
              <el-col :span="18">{{visitCosts.caixue || '--'}}</el-col>
            </el-col>
            <el-col :span="6">
              <el-col :span="6">其他费</el-col>
              <el-col :span="18">{{visitCosts.other || '--'}}</el-col>
            </el-col>
          </el-row>
          <el-row style="margin-bottom:10px">
            <el-col :span="6">
              <el-col :span="6">合计</el-col>
              <el-col :span="18">{{visitCosts.allCost || '--'}}</el-col>
            </el-col>
            <el-col :span="6">
              <el-col :span="6">已收</el-col>
              <el-col :span="18">{{visitCosts.receivedCost || '--'}}</el-col>
            </el-col>
            <el-col :span="6">
              <el-col :span="6">待收</el-col>
              <el-col :span="18">{{visitCosts.unreceivedCost || '--'}}</el-col>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="check" v-for="(value,key) in dataList" :key="key">
        <l-card-title>
          <span slot="left">{{value.title || '--'}}</span>
        </l-card-title>
        <div class="check-cont">
          <el-table
            :data="value.list"
            ref="multipleTable"
            border
            stripe
            width="100%"
            @select="checkSelection"
            @select-all="checkSelectionAll(value.list,key)"
            @selection-change="selectionChange"
          >
            <el-table-column
              type="selection"
              align="center"
              header-align="center"
              :selectable='selectInit'
              width="55">
            </el-table-column>
            <el-table-column
              v-for="(item,index) in value.params"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              :align="item.align || 'left'"
              :header-align="item.headerAlign || 'left'"
              :fixed="item.fixed"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <!-- 可自定义内容 -->
                <template v-if="item.prop === 'proName'">
                  <span>{{ scope.row[item.prop]}} <i
                    class="change-color">{{ scope.row["toCharge"] == 1 ? '(未缴清)': ''}}</i></span>
                </template>

                <!-- 收费数量 （小单位 需要换算）-->
                <template v-else-if="item.prop == 'num' && scope.row['orderItemCat'] <5">
                  <span>{{scope.row["bigUnitNum"]}}</span>
                  <span
                    :val="scope.row['packUnit']"
                    code="DrugUnit"
                    v-codeTransform
                    class="special-color"
                  ></span>
                  <span
                    v-if="scope.row['unitSaleFlg']!='0' &&scope.row['minUnitNum']!='0'">{{scope.row["minUnitNum"]}}</span>
                  <span v-if="scope.row['unitSaleFlg']!='0'  &&scope.row['minUnitNum']!='0'"
                        :val="scope.row['units']"
                        code="DrugUnit"
                        v-codeTransform
                        class="special-color"
                  ></span>
                </template>
                <!--<template v-else-if="item.prop=='units' && scope.row['orderItemCat'] < 5">-->
                <!--<span :val="scope.row['units']" code="DrugUnit" v-codeTransform></span>-->
                <!--</template>-->
                <template v-else>
                  <span>{{ scope.row[item.prop]}}</span>
                </template>


              </template>
            </el-table-column>
          </el-table>
          <div class="check-subtotal">
            小计：<i>{{value.total|| '--'}}</i>
          </div>
        </div>
      </div>
    </div>
    <!-- 预结算弹窗 -->
    <el-dialog title="收费" :visible.sync="dialogVisible" width="35%">
      <charge :charge.sync="charge"></charge>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="this.charge.warning != ''" @click="submitCharge">确定收费</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex';
  import charge from "@/views/cis/appointTriage/registrationOne/components/Charge";
  import {getCostInfo, preSettlement, settlement} from '@/api/cost/cost.js';
  import {getApptByVisitCode} from '@/api/arch/arch.js';
  import appointment from "@/api/appointment/appointment";
  import {transformCode, getTableData} from "@/api/directive/directiveRequest";
  import {blukToOutfit} from "@/utils/drugManagement";

  export default {
    name: "costsTabs",
    components: {
      charge
    },
    data() {
      return {
        //科室选择项
        depart: '',
        departList: [],
        loading: false,
        //门诊费用概况
        visitCosts: {},
        //门诊治疗费表头数据
        treatmentParams: [
          {
            prop: "proName",
            label: "项目名称",
            align: "left",
            headerAlign: "left",
            width: "80",
            fixed: "left"
          }, {
            prop: "unitPrice",
            label: "单价",
            align: "right",
            headerAlign: "left",
            width: "80",
            fixed: "left"
          }, {
            prop: "num",
            label: "数量",
            align: "left",
            headerAlign: "left",
            width: "80",
            fixed: "left"
          }, {
            prop: "units",
            label: "单位",
            align: "left",
            headerAlign: "left",
            width: "80",
            fixed: "left"
          }, {
            prop: "allCost",
            label: "合计",
            align: "right",
            headerAlign: "left",
            width: "80",
            fixed: "left"
          }
        ],
        //门诊治疗费数据
        treatmentList: [],
        //门诊治疗总费用
        treatmentTotal: 0,
        //门诊检查费表头数据
        checkParams: [
          {
            prop: "proName",
            label: "项目名称",
            align: "left",
            headerAlign: "left",
            width: "80",
            fixed: "left"
          }, {
            prop: "unitPrice",
            label: "单价",
            align: "right",
            headerAlign: "left",
            width: "80",
            fixed: "left"
          }, {
            prop: "num",
            label: "数量",
            align: "left",
            headerAlign: "left",
            width: "80",
            fixed: "left"
          }, {
            prop: "units",
            label: "单位",
            align: "left",
            headerAlign: "left",
            width: "80",
            fixed: "left"
          }, {
            prop: "allCost",
            label: "合计",
            align: "right",
            headerAlign: "left",
            width: "80",
            fixed: "left"
          }
        ],
        // //门诊检查费数据
        // checkList: [],
        // //门诊检查总费用
        // checkTotal: 0,
        // //治疗选项
        // treatmentSelections: [],
        // //begin 不添加表头
        // //门诊西药费数据
        // wMedicineList: [],
        // //门诊西药总费用
        // wMedicineTotal: 0,
        // //西药选项
        // wMedicineSelections: [],
        // //2
        // //门诊中药费数据
        // chMedicineList: [],
        // //门诊中药总费用
        // chMedicineTotal: 0,
        // //中药选项
        // chMedicineSelections: [],
        // //4
        // //门诊检验费数据
        // inspectionList: [],
        // //门诊检验总费用
        // inspectionTotal: 0,
        // //检验选项
        // inspectionSelections: [],
        // //
        // // 门诊预约费数据
        // yuyueList: [],
        // //检验选项
        // yuyueSelections: [],
        // //
        // //门诊采血费数据
        // caixueList: [],
        // //门诊检验总费用
        // caixueTotal: 0,
        // //检验选项
        // caixueSelections: [],
        // //
        // //门诊其他费数据
        // otherList: [],
        // //门诊其他总费用
        // otherTotal: 0,
        // yuyueTotal: 0,
        //其他选项
        otherSelections: [],
        //end
        resourceData: {
          wesMedicine: '',
          eastMedicine: '',
          treatment: '',
          check: '',
          examine: '',
          other: '',
          yuyue: '',
          allCost: '',
          receivedCost: '',
          unreceivedCost: '',
          //门诊治疗费数据
          treatmentInfo: {
            treatmentList: [],
            total: 0,
            toCharge: 0
          },
          //门诊检查费数据
          checkInfo: {
            checkList: [],
            total: 0,
            toCharge: 0
          },
          //门诊西药费数据
          wMedicineInfo: {
            wMedicineList: [],
            total: 0,
            toCharge: 0
          },
          //门诊中药费数据
          chMedicineInfo: {
            chMedicineList: [],
            total: 0,
            toCharge: 0
          },
          //门诊检验费数据
          inspectionInfo: {
            inspectionList: [],
            total: 0,
            toCharge: 0
          },
          //门诊采血费数据
          caixueInfo: {
            caixueList: [],
            total: 0,
            toCharge: 0
          },
          //门诊预约费数据
          yuyueInfo: {
            yuyueList: [],
            total: 0,
            toCharge: 0
          },
          //门诊其他费数据
          otherInfo: {
            otherList: [],
            total: 0,
            toCharge: 0
          }
        },
        /*xy--*/
        /*dataList: [
          {
            name: 'xi',
            title: "西药费",
            params: [
              {
                prop: "proName",
                label: "项目名称",
                align: "left",
                headerAlign: "left",
                width: "80",
                fixed: "left"
              }, {
                prop: "unitPrice",
                label: "单价",
                align: "right",
                headerAlign: "right",
                width: "80",
                fixed: "left"
              }, {
                prop: "num",
                label: "数量",
                align: "left",
                headerAlign: "left",
                width: "80",
                fixed: "left"
              }, {
                prop: "units",
                label: "单位",
                align: "left",
                headerAlign: "left",
                width: "80",
                fixed: "left"
              }, {
                prop: "allCost",
                label: "合计",
                align: "right",
               headerAlign: "left",
                width: "80",
                fixed: "left"
              }
            ],
            list: [],
            total: '',
            toCharge: 0
          },
          {
            name: 'zhong',
            title: "中药费",
            params: [
              {
                prop: "proName",
                label: "项目名称",
                align: "left",
                headerAlign: "left",
                width: "80",
                fixed: "left"
              }, {
                prop: "unitPrice",
                label: "单价",
                align: "right",
                headerAlign: "right",
                width: "80",
                fixed: "left"
              }, {
                prop: "num",
                label: "数量",
                align: "left",
                headerAlign: "left",
                width: "80",
                fixed: "left"
              }, {
                prop: "units",
                label: "单位",
                align: "left",
                headerAlign: "left",
                width: "80",
                fixed: "left"
              }, {
                prop: "allCost",
                label: "合计",
                align: "right",
                headerAlign: "left",
                width: "80",
                fixed: "left"
              }
            ],
            list: [],
            total: '',
            toCharge: 0
          },
          {
            name: 'zhi',
            title: "治疗费",
            params: [
              {
                prop: "proName",
                label: "项目名称",
                align: "left",
                headerAlign: "left",
                width: "80",
                fixed: "left"
              }, {
                prop: "unitPrice",
                label: "单价",
                align: "right",
                headerAlign: "right",
                width: "80",
                fixed: "left"
              }, {
                prop: "num",
                label: "数量",
                align: "left",
                headerAlign: "left",
                width: "80",
                fixed: "left"
              }, {
                prop: "units",
                label: "单位",
                align: "left",
                headerAlign: "left",
                width: "80",
                fixed: "left"
              }, {
                prop: "allCost",
                label: "合计",
                align: "right",
                headerAlign: "left",
                width: "80",
                fixed: "left"
              }
            ],
            list: [],
            total: '',
            toCharge: 0
          },
          {
            name: 'cha',
            title: "检查费",
            params: [
              {
                prop: "proName",
                label: "项目名称",
                align: "left",
                headerAlign: "left",
                width: "80",
                fixed: "left"
              }, {
                prop: "unitPrice",
                label: "单价",
                align: "right",
                headerAlign: "right",
                width: "80",
                fixed: "left"
              }, {
                prop: "num",
                label: "数量",
                align: "left",
                headerAlign: "left",
                width: "80",
                fixed: "left"
              }, {
                prop: "units",
                label: "单位",
                align: "left",
                headerAlign: "left",
                width: "80",
                fixed: "left"
              }, {
                prop: "allCost",
                label: "合计",
                align: "right",
               headerAlign: "left",
                width: "80",
                fixed: "left"
              }
            ],
            list: [],
            total: '',
            toCharge: 0
          },
          {
            name: 'yu',
            title: "预约费",
            params: [
              {
                prop: "proName",
                label: "项目名称",
                align: "left",
                headerAlign: "left",
                width: "80",
                fixed: "left"
              }, {
                prop: "unitPrice",
                label: "单价",
                align: "right",
                headerAlign: "right",
                width: "80",
                fixed: "left"
              }, {
                prop: "num",
                label: "数量",
                align: "left",
                headerAlign: "left",
                width: "80",
                fixed: "left"
              }, {
                prop: "units",
                label: "单位",
                align: "left",
                headerAlign: "left",
                width: "80",
                fixed: "left"
              }, {
                prop: "allCost",
                label: "合计",
                align: "right",
                headerAlign: "left",
                width: "80",
                fixed: "left"
              }
            ],
            list: [],
            total: '',
            toCharge: 0
          },
          {
            name: 'cai',
            title: "采血费",
            params: [
              {
                prop: "proName",
                label: "项目名称",
                align: "left",
                headerAlign: "left",
                width: "80",
                fixed: "left"
              }, {
                prop: "unitPrice",
                label: "单价",
                align: "right",
                headerAlign: "right",
                width: "80",
                fixed: "left"
              }, {
                prop: "num",
                label: "数量",
                align: "left",
                headerAlign: "left",
                width: "80",
                fixed: "left"
              }, {
                prop: "units",
                label: "单位",
                align: "left",
                headerAlign: "left",
                width: "80",
                fixed: "left"
              }, {
                prop: "allCost",
                label: "合计",
                align: "right",
                headerAlign: "left",
                width: "80",
                fixed: "left"
              }
            ],
            list: [],
            total: '',
            toCharge: 0
          },
          {
            name: 'yan',
            title: "检验费",
            params: [
              {
                prop: "proName",
                label: "项目名称",
                align: "left",
                headerAlign: "left",
                width: "80",
                fixed: "left"
              }, {
                prop: "unitPrice",
                label: "单价",
                align: "right",
                headerAlign: "right",
                width: "80",
                fixed: "left"
              }, {
                prop: "num",
                label: "数量",
                align: "left",
                headerAlign: "left",
                width: "80",
                fixed: "left"
              }, {
                prop: "units",
                label: "单位",
                align: "left",
                headerAlign: "left",
                width: "80",
                fixed: "left"
              }, {
                prop: "allCost",
                label: "合计",
                align: "right",
                headerAlign: "left",
                width: "80",
                fixed: "left"
              }
            ],
            list: [],
            total: '',
            toCharge: 0
          },
          {
            name: 'qi',
            title: "其他费",
            params: [
              {
                prop: "proName",
                label: "项目名称",
                align: "left",
                headerAlign: "left",
                width: "80",
                fixed: "left"
              }, {
                prop: "unitPrice",
                label: "单价",
                align: "right",
                headerAlign: "right",
                width: "80",
                fixed: "left"
              }, {
                prop: "num",
                label: "数量",
                align: "left",
                headerAlign: "left",
                width: "80",
                fixed: "left"
              }, {
                prop: "units",
                label: "单位",
                align: "left",
                headerAlign: "left",
                width: "80",
                fixed: "left"
              }, {
                prop: "allCost",
                label: "合计",
                align: "right",
                headerAlign: "left",
                width: "80",
                fixed: "left"
              }
            ],
            list: [],
            total: '',
            toCharge: 0
          }
        ]*/
        dataList: [],
        //检查选项
        selection: [],
        // checkSelectionsCopy: {},
        checkSelections: {},
        //弹框
        dialogVisible: false,
        // 预结算数据
        charge: {
          // 支付方式
          payType: "1",
          // 实收
          realGet: 0,
          // 找零
          backMoney: 0,
          chargeObj: {},
          // 提示数据
          warning: ""
        },
        visitCodeList: [],
        visitCode: '',
        charge1Data: [],
        // 账户dataVersion
        accountDataVersion: ''
      }
    },
    computed: {
      ...mapGetters("patientMaster", ["receivePatientData", "hisRecordData"])
    },
    watch: {
      "receivePatientData": {
        async handler(n) {
          this.clearData();
          this.clearData1();
          if (JSON.stringify(n) !== "{}") {
            if (n.patientId) {
              /*let departList = n.ouptDeptId != null ? n.ouptDeptId.split(',') : [];
              for (var i in departList) {
                this.departList.push({
                  index: i,
                  label: await this.transformTable("org_nm", {org_type: '_DEPT_', id: departList[i]}, "sys_org"),
                  value: departList[i] + i
                })
              }
              this.visitCodeList = n.visitCode != null ? n.visitCode.split(',') : [];
              this.visitCode = this.visitCodeList.length > 0 ? this.visitCodeList[0] : '';
              this.depart = this.departList.length > 0 ? this.departList[0].value : '';
              this.getVisitInfo();*/
            } else {
              this.$message("该患者未建档，请开始建档");
              this.$router.push('/patientMaster/recordCreate');
            }
          }
        },
        immediate: true,
        deep: true
      },
      "hisRecordData": {
        async handler(n) {
          this.clearData();
          this.clearData1();
          if (JSON.stringify(n) !== "{}") {
            if (n.visitCode) {
              this.getVisitInfo();
            }
          }
        },
        immediate: true,
        deep: true
      }
    },
    methods: {
      //选择科室改变
      /*async departChange(data) {
        this.clearData();
        // console.info("changeData:" + data);
        let index = 0;
        for (let i in this.departList) {
          if (this.departList[i].value === data) {
            index = i;
            break;
          }
        }
        this.visitCode = this.visitCodeList[index];
        await this.getVisitInfo();
      },*/
      async getAccountInfo() {
        try {
          const accountInfo = await appointment.getAccountInfo(this.hisRecordData.patientId);
          if (accountInfo.code == 1) {
            this.accountDataVersion = accountInfo.data.dataVersion;
          } else {
            this.$message.error(accountInfo.message || '获取账户信息失败！');
          }
        } catch (error) {
          this.$message.error(error.msg || '获取账户信息失败！');
        }
      },
      //默认选择按钮不可点
      selectInit(row, index) {
        if (row.toCharge == 1) {
          return true;
        } 
          return false;
        
      },
      clearData() {
        this.resourceData = {
          wesMedicine: '',
          eastMedicine: '',
          treatment: '',
          check: '',
          examine: '',
          other: '',
          yuyue: '',
          allCost: '',
          receivedCost: '',
          unreceivedCost: '',
          //门诊治疗费数据
          treatmentInfo: {
            treatmentList: [],
            total: 0,
            toCharge: 0
          },
          //门诊检查费数据
          checkInfo: {
            checkList: [],
            total: 0,
            toCharge: 0
          },
          //门诊西药费数据
          wMedicineInfo: {
            wMedicineList: [],
            total: 0,
            toCharge: 0
          },
          //门诊中药费数据
          chMedicineInfo: {
            chMedicineList: [],
            total: 0,
            toCharge: 0
          },
          //门诊检验费数据
          inspectionInfo: {
            inspectionList: [],
            total: 0,
            toCharge: 0
          },
          //门诊采血费数据
          caixueInfo: {
            caixueList: [],
            total: 0,
            toCharge: 0
          },
          //门诊预约费数据
          yuyueInfo: {
            yuyueList: [],
            total: 0,
            toCharge: 0
          },
          //门诊其他费数据
          otherInfo: {
            otherList: [],
            total: 0,
            toCharge: 0
          }
        };
        this.visitCosts = {};
        this.dataList = [];
        this.checkSelections = {};
        this.selection = [];
        // this.treatmentList = [];
        // this.checkList = [];
        // this.wMedicineList = [];
        // this.chMedicineList = [];
        // this.inspectionList = [];
        // this.caixueList = [];
        // this.yuyueList = [];
        // this.otherList = [];
        // this.treatmentTotal = '';
        // this.checkTotal = '';
        // this.wMedicineTotal = '';
        // this.chMedicineTotal = '';
        // this.inspectionTotal = '';
        // this.caixueTotal = '';
        // this.yuyueTotal = '';
        // this.otherTotal = '';
      },
      clearData1() {
        this.departList = [];
        this.depart = '';
        this.visitCodeList = [];
        this.visitCode = '';
      },
      //获取门诊收费信息
      async getVisitInfo() {
        this.loading = true;
        try {
          if (this.hisRecordData.visitCode != "") {
            let resource = await getCostInfo({
              visitCode: this.hisRecordData.visitCode
            });
            if (resource.data != null && resource.data.length > 0) {
              this.handleData(resource.data);
              //
              // console.info("this.resourceData:" + JSON.stringify(this.resourceData));
              this.visitCosts = this.resourceData;
            } else {
              this.$message(resource.message || "未获取到门诊收费信息");
            }
          }
          this.loading = false;
        } catch (error) {
          this.loading = false;
          this.$message.error(error.message || '获取门诊收费信息失败');
        }
      },
      handleData(data) {
        let receivedCost = 0;
        let unreceivedCost = 0;
        let allCost = 0;
        let toCharge = 0;//已经缴费
        data.map((item, index) => {
          if (item.orderItemCat == "1" || item.orderItemCat == "2") {
            //西药费
            let detail = [];
            item.outpChargeDetailVO.map((e, i) => {
              if (e.hasOwnProperty("id")) {
                toCharge = 1;//未缴费
              } else {
                toCharge = 0;
              }
              this.resourceData.wMedicineInfo.total += parseFloat(e.amt);
              this.tempQuantity = this.calcQuantity(e);
              console.info("tempQuantity" + JSON.stringify(this.tempQuantity));
              if (toCharge == 0) {

                detail.push({
                  orderItemCat: item.orderItemCat,
                  orderItemId: e.orderItemId,
                  no: e.no,
                  prescriptionSource: e.prescriptionSource,
                  proName: e.orderItemName,
                  unitPrice: parseFloat(e.price).toFixed(2),
                  packQuantity: e.packQuantity,
                  num: e.orderItemCat < 5 ? e.quantity / (e.packQuantity || 1) : e.quantity,
                  units: e.unit,
                  allCost: parseFloat(e.amt).toFixed(2),
                  toCharge: toCharge,
                  receiveDept: e.receiveDept || '',
                  id: e.id || '',
                  dataVersion: e.dataVersion || '',
                  recipeId: e.recipeId || '',
                  rDataVersion: e.rDataVersion || '',
                  quantity: e.quantity,
                  minUnitNum: this.tempQuantity.bl,
                  bigUnitNum: this.tempQuantity.out,
                  packUnit: e.packUnit,
                  unitSaleFlg: e.unitSaleFlg
                });
              } else {
                detail.unshift({
                  orderItemCat: item.orderItemCat,
                  orderItemId: e.orderItemId,
                  no: e.no,
                  prescriptionSource: e.prescriptionSource,
                  proName: e.orderItemName,
                  unitPrice: parseFloat(e.price).toFixed(2),
                  packQuantity: e.packQuantity,
                  num: e.orderItemCat < 5 ? e.quantity / (e.packQuantity || 1) : e.quantity,
                  units: e.unit,
                  allCost: parseFloat(e.amt).toFixed(2),
                  toCharge: toCharge,
                  receiveDept: e.receiveDept || '',
                  dataVersion: e.dataVersion || '',
                  id: e.id || '',
                  recipeId: e.recipeId || '',
                  rDataVersion: e.rDataVersion || '',
                  quantity: e.quantity,
                  minUnitNum: this.tempQuantity.bl,
                  bigUnitNum: this.tempQuantity.out,
                  packUnit: e.packUnit,
                  unitSaleFlg: e.unitSaleFlg
                });
              }
            });
            this.resourceData.wMedicineInfo.total = parseFloat(this.resourceData.wMedicineInfo.total).toFixed(2);
            this.resourceData.wMedicineInfo.wMedicineList = detail;
            this.resourceData.wMedicineInfo.toCharge = item.toCharge > 0 ? 1 : 0;
            this.resourceData.wesMedicine = this.resourceData.wMedicineInfo.total;

            this.dataList.push({
              name: 'xi',
              title: "西药费",
              params: [
                {
                  prop: "proName",
                  label: "项目名称",
                  align: "left",
                  headerAlign: "left",
                  width: "200",
                  fixed: "left"
                }, {
                  prop: "unitPrice",
                  label: "单价",
                  align: "right",
                  headerAlign: "left",
                  width: "80",
                  fixed: "left"
                },
                {
                  prop: "num",
                  label: "数量",
                  align: "left",
                  headerAlign: "left",
                  width: "80",
                  fixed: "left"
                },
                // {
                //   prop: "units",
                //   label: "单位",
                //   align: "left",
                //   headerAlign: "left",
                //   width: "80",
                //   fixed: "left"
                // },
                {
                  prop: "allCost",
                  label: "合计",
                  align: "right",
                  headerAlign: "left",
                  width: "80",
                  fixed: "left"
                }
              ],
              list: detail,
              total: parseFloat(this.resourceData.wMedicineInfo.total).toFixed(2),
              toCharge: item.toCharge > 0 ? 1 : 0
            });
          } else if (item.orderItemCat == "3") {
            //中药费
            let detail = [];
            item.outpChargeDetailVO.map((e, i) => {
              if (e.hasOwnProperty("id")) {
                toCharge = 1;//未缴费
              } else {
                toCharge = 0;
              }
              this.tempQuantity = this.calcQuantity(e);
              this.resourceData.chMedicineInfo.total += parseFloat(e.amt);
              if (toCharge == 0) {
                detail.push({
                  orderItemCat: item.orderItemCat,
                  orderItemId: e.orderItemId,
                  prescriptionSource: e.prescriptionSource,
                  no: e.no,
                  proName: e.orderItemName,
                  unitPrice: parseFloat(e.price).toFixed(2),
                  packQuantity: e.packQuantity,
                  num: e.orderItemCat < 5 ? e.quantity / (e.packQuantity || 1) : e.quantity,
                  units: e.unit,
                  allCost: parseFloat(e.amt).toFixed(2),
                  toCharge: toCharge,
                  receiveDept: e.receiveDept || '',
                  dataVersion: e.dataVersion || '',
                  id: e.id || '',
                  recipeId: e.recipeId || '',
                  rDataVersion: e.rDataVersion || '',
                  quantity: e.quantity,
                  minUnitNum: this.tempQuantity.bl,
                  bigUnitNum: this.tempQuantity.out,
                  packUnit: e.packUnit,
                  unitSaleFlg: e.unitSaleFlg
                })
              } else {
                detail.unshift({
                  orderItemCat: item.orderItemCat,
                  orderItemId: e.orderItemId,
                  prescriptionSource: e.prescriptionSource,
                  no: e.no,
                  proName: e.orderItemName,
                  unitPrice: parseFloat(e.price).toFixed(2),
                  packQuantity: e.packQuantity,
                  num: e.orderItemCat < 5 ? e.quantity / (e.packQuantity || 1) : e.quantity,
                  units: e.unit,
                  allCost: parseFloat(e.amt).toFixed(2),
                  toCharge: toCharge,
                  receiveDept: e.receiveDept || '',
                  dataVersion: e.dataVersion || '',
                  id: e.id || '',
                  recipeId: e.recipeId || '',
                  rDataVersion: e.rDataVersion || '',
                  quantity: e.quantity,
                  minUnitNum: this.tempQuantity.bl,
                  bigUnitNum: this.tempQuantity.out,
                  packUnit: e.packUnit,
                  unitSaleFlg: e.unitSaleFlg
                })
              }

            });
            this.resourceData.chMedicineInfo.total = parseFloat(this.resourceData.chMedicineInfo.total).toFixed(2);
            this.resourceData.chMedicineInfo.chMedicineList = detail;
            this.resourceData.chMedicineInfo.toCharge = item.toCharge > 0 ? 1 : 0;
            this.resourceData.eastMedicine = this.resourceData.chMedicineInfo.total;
            this.dataList.push({
              name: 'zhong',
              title: "中药费",
              params: [
                {
                  prop: "proName",
                  label: "项目名称",
                  align: "left",
                  headerAlign: "left",
                  width: "200",
                  fixed: "left"
                }, {
                  prop: "unitPrice",
                  label: "单价",
                  align: "right",
                  headerAlign: "left",
                  width: "80",
                  fixed: "left"
                }, {
                  prop: "num",
                  label: "数量",
                  align: "left",
                  headerAlign: "left",
                  width: "80",
                  fixed: "left"
                },
                // {
                //   prop: "units",
                //   label: "单位",
                //   align: "left",
                //   headerAlign: "left",
                //   width: "80",
                //   fixed: "left"
                // },
                {
                  prop: "allCost",
                  label: "合计",
                  align: "right",
                  headerAlign: "left",
                  width: "80",
                  fixed: "left"
                }
              ],
              list: detail,
              total: parseFloat(this.resourceData.chMedicineInfo.total).toFixed(2),
              toCharge: item.toCharge > 0 ? 1 : 0
            });
          } else if (item.orderItemCat == "7") {
            //治疗费
            let detail = [];
            item.outpChargeDetailVO.map((e, i) => {
              if (e.hasOwnProperty("id")) {
                toCharge = 1;//未缴费
              } else {
                toCharge = 0;
              }
              this.resourceData.treatmentInfo.total += parseFloat(e.amt);
              if (toCharge == 0) {
                detail.push({
                  orderItemCat: item.orderItemCat,
                  orderItemId: e.orderItemId,
                  prescriptionSource: e.prescriptionSource,
                  no: e.no,
                  proName: e.orderItemName,
                  unitPrice: parseFloat(e.price).toFixed(2),
                  packQuantity: e.packQuantity,
                  num: e.orderItemCat < 5 ? e.quantity / (e.packQuantity || 1) : e.quantity,
                  units: e.unit,
                  allCost: parseFloat(e.amt).toFixed(2),
                  toCharge: toCharge,
                  receiveDept: e.receiveDept || '',
                  dataVersion: e.dataVersion || '',
                  id: e.id || '',
                  recipeId: e.recipeId || '',
                  rDataVersion: e.rDataVersion || '',
                  quantity: e.quantity
                })
              } else {
                detail.unshift({
                  orderItemCat: item.orderItemCat,
                  orderItemId: e.orderItemId,
                  prescriptionSource: e.prescriptionSource,
                  no: e.no,
                  proName: e.orderItemName,
                  unitPrice: parseFloat(e.price).toFixed(2),
                  packQuantity: e.packQuantity,
                  num: e.orderItemCat < 5 ? e.quantity / (e.packQuantity || 1) : e.quantity,
                  units: e.unit,
                  allCost: parseFloat(e.amt).toFixed(2),
                  toCharge: toCharge,
                  receiveDept: e.receiveDept || '',
                  dataVersion: e.dataVersion || '',
                  id: e.id || '',
                  recipeId: e.recipeId || '',
                  rDataVersion: e.rDataVersion || '',
                  quantity: e.quantity
                })
              }
            });
            this.resourceData.treatmentInfo.total = parseFloat(this.resourceData.treatmentInfo.total).toFixed(2);
            this.resourceData.treatmentInfo.treatmentList = detail;
            this.resourceData.treatmentInfo.toCharge = item.toCharge > 0 ? 1 : 0;
            this.resourceData.treatment = this.resourceData.treatmentInfo.total;
            this.dataList.push({
              name: 'zhi',
              title: "治疗费",
              params: [
                {
                  prop: "proName",
                  label: "项目名称",
                  align: "left",
                  headerAlign: "left",
                  width: "200",
                  fixed: "left"
                }, {
                  prop: "unitPrice",
                  label: "单价",
                  align: "right",
                  headerAlign: "left",
                  width: "80",
                  fixed: "left"
                }, {
                  prop: "num",
                  label: "数量",
                  align: "left",
                  headerAlign: "left",
                  width: "80",
                  fixed: "left"
                }, {
                  prop: "units",
                  label: "单位",
                  align: "left",
                  headerAlign: "left",
                  width: "80",
                  fixed: "left"
                }, {
                  prop: "allCost",
                  label: "合计",
                  align: "right",
                  headerAlign: "left",
                  width: "80",
                  fixed: "left"
                }
              ],
              list: detail,
              total: parseFloat(this.resourceData.treatmentInfo.total).toFixed(2),
              toCharge: item.toCharge > 0 ? 1 : 0
            });
          } else if (item.orderItemCat == "5") {
            //检查费
            let detail = [];
            item.outpChargeDetailVO.map((e, i) => {
              if (e.hasOwnProperty("id")) {
                toCharge = 1;//未缴费
              } else {
                toCharge = 0;
              }
              this.resourceData.checkInfo.total += parseFloat(e.amt);
              if (toCharge == 0) {
                detail.push({
                  orderItemCat: item.orderItemCat,
                  orderItemId: e.orderItemId,
                  prescriptionSource: e.prescriptionSource,
                  no: e.no,
                  proName: e.orderItemName,
                  unitPrice: parseFloat(e.price).toFixed(2),
                  packQuantity: e.packQuantity,
                  num: e.orderItemCat < 5 ? e.quantity / (e.packQuantity || 1) : e.quantity,
                  units: e.unit,
                  allCost: parseFloat(e.amt).toFixed(2),
                  toCharge: toCharge,
                  receiveDept: e.receiveDept || '',
                  dataVersion: e.dataVersion || '',
                  id: e.id || '',
                  recipeId: e.recipeId || '',
                  rDataVersion: e.rDataVersion || '',
                  quantity: e.quantity
                })
              } else {
                detail.unshift({
                  orderItemCat: item.orderItemCat,
                  orderItemId: e.orderItemId,
                  prescriptionSource: e.prescriptionSource,
                  no: e.no,
                  proName: e.orderItemName,
                  unitPrice: parseFloat(e.price).toFixed(2),
                  packQuantity: e.packQuantity,
                  num: e.orderItemCat < 5 ? e.quantity / (e.packQuantity || 1) : e.quantity,
                  units: e.unit,
                  allCost: parseFloat(e.amt).toFixed(2),
                  toCharge: toCharge,
                  receiveDept: e.receiveDept || '',
                  dataVersion: e.dataVersion || '',
                  id: e.id || '',
                  recipeId: e.recipeId || '',
                  rDataVersion: e.rDataVersion || '',
                  quantity: e.quantity
                })
              }
            });
            this.resourceData.checkInfo.total = parseFloat(this.resourceData.checkInfo.total).toFixed(2);
            this.resourceData.checkInfo.checkList = detail;
            this.resourceData.checkInfo.toCharge = item.toCharge > 0 ? 1 : 0;
            this.resourceData.check = this.resourceData.checkInfo.total;
            this.dataList.push({
              name: 'cha',
              title: "检查费",
              params: [
                {
                  prop: "proName",
                  label: "项目名称",
                  align: "left",
                  headerAlign: "left",
                  width: "200",
                  fixed: "left"
                }, {
                  prop: "unitPrice",
                  label: "单价",
                  align: "right",
                  headerAlign: "left",
                  width: "80",
                  fixed: "left"
                }, {
                  prop: "num",
                  label: "数量",
                  align: "left",
                  headerAlign: "left",
                  width: "80",
                  fixed: "left"
                }, {
                  prop: "units",
                  label: "单位",
                  align: "left",
                  headerAlign: "left",
                  width: "80",
                  fixed: "left"
                }, {
                  prop: "allCost",
                  label: "合计",
                  align: "right",
                  headerAlign: "left",
                  width: "80",
                  fixed: "left"
                }
              ],
              list: detail,
              total: parseFloat(this.resourceData.checkInfo.total).toFixed(2),
              toCharge: item.toCharge > 0 ? 1 : 0
            });
          } else if (item.orderItemCat == "10" || item.orderItemCat == "87" || item.orderItemCat == "88") {
            //采血费
            let detail = [];
            item.outpChargeDetailVO.map((e, i) => {
              if (e.hasOwnProperty("id")) {
                toCharge = 1;//未缴费
              } else {
                toCharge = 0;
              }
              this.resourceData.caixueInfo.total += parseFloat(e.amt);
              if (toCharge == 0) {
                detail.push({
                  orderItemCat: item.orderItemCat,
                  orderItemId: e.orderItemId,
                  no: e.no,
                  prescriptionSource: e.prescriptionSource,
                  proName: e.orderItemName,
                  unitPrice: parseFloat(e.price).toFixed(2),
                  packQuantity: e.packQuantity,
                  num: e.orderItemCat < 5 ? e.quantity / (e.packQuantity || 1) : e.quantity,
                  units: e.unit,
                  allCost: parseFloat(e.amt).toFixed(2),
                  toCharge: toCharge,
                  receiveDept: e.receiveDept || '',
                  dataVersion: e.dataVersion || '',
                  id: e.id || '',
                  recipeId: e.recipeId || '',
                  rDataVersion: e.rDataVersion || '',
                  quantity: e.quantity
                })
              } else {
                detail.unshift({
                  orderItemCat: item.orderItemCat,
                  orderItemId: e.orderItemId,
                  prescriptionSource: e.prescriptionSource,
                  no: e.no,
                  proName: e.orderItemName,
                  unitPrice: parseFloat(e.price).toFixed(2),
                  packQuantity: e.packQuantity,
                  num: e.orderItemCat < 5 ? e.quantity / (e.packQuantity || 1) : e.quantity,
                  units: e.unit,
                  allCost: parseFloat(e.amt).toFixed(2),
                  toCharge: toCharge,
                  receiveDept: e.receiveDept || '',
                  dataVersion: e.dataVersion || '',
                  id: e.id || '',
                  recipeId: e.recipeId || '',
                  rDataVersion: e.rDataVersion || '',
                  quantity: e.quantity
                })
              }
            });
            this.resourceData.caixueInfo.total = parseFloat(this.resourceData.caixueInfo.total).toFixed(2);
            this.resourceData.caixueInfo.caixueList = detail;
            this.resourceData.caixueInfo.toCharge = item.toCharge > 0 ? 1 : 0;
            this.resourceData.caixue = this.resourceData.caixueInfo.total;
            this.dataList.push({
              name: 'cai',
              title: "采血费",
              params: [
                {
                  prop: "proName",
                  label: "项目名称",
                  align: "left",
                  headerAlign: "left",
                  width: "200",
                  fixed: "left"
                }, {
                  prop: "unitPrice",
                  label: "单价",
                  align: "right",
                  headerAlign: "left",
                  width: "80",
                  fixed: "left"
                }, {
                  prop: "num",
                  label: "数量",
                  align: "left",
                  headerAlign: "left",
                  width: "80",
                  fixed: "left"
                }, {
                  prop: "units",
                  label: "单位",
                  align: "left",
                  headerAlign: "left",
                  width: "80",
                  fixed: "left"
                }, {
                  prop: "allCost",
                  label: "合计",
                  align: "right",
                  headerAlign: "left",
                  width: "80",
                  fixed: "left"
                }
              ],
              list: detail,
              total: parseFloat(this.resourceData.caixueInfo.total).toFixed(2),
              toCharge: item.toCharge > 0 ? 1 : 0
            });
          } else if (item.orderItemCat == "8") {
            //检验费
            let detail = [];
            item.outpChargeDetailVO.map((e, i) => {
              if (e.hasOwnProperty("id")) {
                toCharge = 1;//未缴费
              } else {
                toCharge = 0;
              }
              this.resourceData.inspectionInfo.total += parseFloat(e.amt);
              if (toCharge == 0) {
                detail.push({
                  orderItemCat: item.orderItemCat,
                  orderItemId: e.orderItemId,
                  prescriptionSource: e.prescriptionSource,
                  no: e.no,
                  proName: e.orderItemName,
                  unitPrice: parseFloat(e.price).toFixed(2),
                  packQuantity: e.packQuantity,
                  num: e.orderItemCat < 5 ? e.quantity / (e.packQuantity || 1) : e.quantity,
                  units: e.unit,
                  allCost: parseFloat(e.amt).toFixed(2),
                  toCharge: toCharge,
                  receiveDept: e.receiveDept || '',
                  id: e.id || '',
                  dataVersion: e.dataVersion || '',
                  orderCat: e.orderCat || '',
                  recipeId: e.recipeId || '',
                  rDataVersion: e.rDataVersion || '',
                  quantity: e.quantity
                })
              } else {
                detail.unshift({
                  orderItemCat: item.orderItemCat,
                  orderItemId: e.orderItemId,
                  prescriptionSource: e.prescriptionSource,
                  no: e.no,
                  proName: e.orderItemName,
                  unitPrice: parseFloat(e.price).toFixed(2),
                  packQuantity: e.packQuantity,
                  num: e.orderItemCat < 5 ? e.quantity / (e.packQuantity || 1) : e.quantity,
                  units: e.unit,
                  allCost: parseFloat(e.amt).toFixed(2),
                  toCharge: toCharge,
                  receiveDept: e.receiveDept || '',
                  id: e.id || '',
                  dataVersion: e.dataVersion || '',
                  orderCat: e.orderCat || '',
                  recipeId: e.recipeId || '',
                  rDataVersion: e.rDataVersion || '',
                  quantity: e.quantity
                })
              }
            });
            this.resourceData.inspectionInfo.total = parseFloat(this.resourceData.inspectionInfo.total).toFixed(2);
            this.resourceData.inspectionInfo.inspectionList = detail;
            this.resourceData.inspectionInfo.toCharge = item.toCharge > 0 ? 1 : 0;
            this.resourceData.examine = this.resourceData.inspectionInfo.total;
            this.dataList.push({
              name: 'yan',
              title: "检验费",
              params: [
                {
                  prop: "proName",
                  label: "项目名称",
                  align: "left",
                  headerAlign: "left",
                  width: "200",
                  fixed: "left"
                }, {
                  prop: "unitPrice",
                  label: "单价",
                  align: "right",
                  headerAlign: "left",
                  width: "80",
                  fixed: "left"
                }, {
                  prop: "num",
                  label: "数量",
                  align: "left",
                  headerAlign: "left",
                  width: "80",
                  fixed: "left"
                }, {
                  prop: "units",
                  label: "单位",
                  align: "left",
                  headerAlign: "left",
                  width: "80",
                  fixed: "left"
                }, {
                  prop: "allCost",
                  label: "合计",
                  align: "right",
                  headerAlign: "left",
                  width: "80",
                  fixed: "left"
                }
              ],
              list: detail,
              total: parseFloat(this.resourceData.inspectionInfo.total).toFixed(2),
              toCharge: item.toCharge > 0 ? 1 : 0
            });
          } else if (item.orderItemCat == "86" || item.orderItemCat == "85") {
            //挂号费
            let detail = [];
            item.outpChargeDetailVO.map((e, i) => {
              if (e.hasOwnProperty("id")) {
                toCharge = 1;//未缴费
              } else {
                toCharge = 0;
              }
              this.resourceData.yuyueInfo.total += e.amt;
              if (toCharge == 0) {
                detail.push({
                  orderItemCat: item.orderItemCat,
                  orderItemId: e.orderItemId,
                  prescriptionSource: e.prescriptionSource,
                  no: e.no,
                  proName: e.orderItemName,
                  unitPrice: parseFloat(e.price).toFixed(2),
                  packQuantity: e.packQuantity,
                  num: e.orderItemCat < 5 ? e.quantity / (e.packQuantity || 1) : e.quantity,
                  units: e.unit,
                  allCost: parseFloat(e.amt).toFixed(2),
                  toCharge: toCharge,
                  receiveDept: e.receiveDept || '',
                  visitId: e.visitId || '',
                  dataVersion: e.dataVersion || '',
                  id: e.id || '',
                  recipeId: e.recipeId || '',
                  rDataVersion: e.rDataVersion || '',
                  quantity: e.quantity
                })
              } else {
                detail.unshift({
                  orderItemCat: item.orderItemCat,
                  orderItemId: e.orderItemId,
                  prescriptionSource: e.prescriptionSource,
                  no: e.no,
                  proName: e.orderItemName,
                  unitPrice: parseFloat(e.price).toFixed(2),
                  packQuantity: e.packQuantity,
                  num: e.orderItemCat < 5 ? e.quantity / (e.packQuantity || 1) : e.quantity,
                  units: e.unit,
                  allCost: parseFloat(e.amt).toFixed(2),
                  toCharge: toCharge,
                  receiveDept: e.receiveDept || '',
                  visitId: e.visitId || '',
                  dataVersion: e.dataVersion || '',
                  id: e.id || '',
                  recipeId: e.recipeId || '',
                  rDataVersion: e.rDataVersion || '',
                  quantity: e.quantity
                })
              }
            });
            // debugger;
            this.resourceData.yuyueInfo.total = parseFloat(this.resourceData.yuyueInfo.total).toFixed(2);
            this.resourceData.yuyueInfo.yuyueList = detail;
            this.resourceData.yuyueInfo.toCharge = item.toCharge > 0 ? 1 : 0;
            this.resourceData.yuyue = this.resourceData.yuyueInfo.total;
            this.dataList.push({
              name: 'yu',
              title: "预约费",
              params: [
                {
                  prop: "proName",
                  label: "项目名称",
                  align: "left",
                  headerAlign: "left",
                  width: "200",
                  fixed: "left"
                }, {
                  prop: "unitPrice",
                  label: "单价",
                  align: "right",
                  headerAlign: "left",
                  width: "80",
                  fixed: "left"
                }, {
                  prop: "num",
                  label: "数量",
                  align: "left",
                  headerAlign: "left",
                  width: "80",
                  fixed: "left"
                }, {
                  prop: "units",
                  label: "单位",
                  align: "left",
                  headerAlign: "left",
                  width: "80",
                  fixed: "left"
                }, {
                  prop: "allCost",
                  label: "合计",
                  align: "right",
                  headerAlign: "left",
                  width: "80",
                  fixed: "left"
                }
              ],
              list: detail,
              total: this.resourceData.yuyueInfo.total,
              toCharge: item.toCharge > 0 ? 1 : 0
            });
          } else {
            //其他费
            let detail = [];
            item.outpChargeDetailVO.map((e, i) => {
              if (e.hasOwnProperty("id")) {
                toCharge = 1;//未缴费
              } else {
                toCharge = 0;
              }
              this.resourceData.otherInfo.total += e.amt;
              if (toCharge == 0) {
                detail.push({
                  orderItemCat: item.orderItemCat,
                  orderItemId: e.orderItemId,
                  no: e.no,
                  prescriptionSource: e.prescriptionSource,
                  proName: e.orderItemName,
                  unitPrice: parseFloat(e.price).toFixed(2),
                  packQuantity: e.packQuantity,
                  num: e.orderItemCat < 5 ? e.quantity / (e.packQuantity || 1) : e.quantity,
                  units: e.unit,
                  allCost: parseFloat(e.amt).toFixed(2),
                  toCharge: toCharge,
                  receiveDept: e.receiveDept || '',
                  dataVersion: e.dataVersion || '',
                  id: e.id || '',
                  recipeId: e.recipeId || '',
                  rDataVersion: e.rDataVersion || '',
                  quantity: e.quantity
                })
              } else {
                detail.unshift({
                  orderItemCat: item.orderItemCat,
                  orderItemId: e.orderItemId,
                  no: e.no,
                  prescriptionSource: e.prescriptionSource,
                  proName: e.orderItemName,
                  unitPrice: parseFloat(e.price).toFixed(2),
                  packQuantity: e.packQuantity,
                  num: e.orderItemCat < 5 ? e.quantity / (e.packQuantity || 1) : e.quantity,
                  units: e.unit,
                  allCost: parseFloat(e.amt).toFixed(2),
                  toCharge: toCharge,
                  receiveDept: e.receiveDept || '',
                  dataVersion: e.dataVersion || '',
                  id: e.id || '',
                  recipeId: e.recipeId || '',
                  rDataVersion: e.rDataVersion || '',
                  quantity: e.quantity
                })
              }
            });
            this.resourceData.otherInfo.total = parseFloat(this.resourceData.otherInfo.total).toFixed(2);
            this.resourceData.otherInfo.otherList = detail;
            this.resourceData.otherInfo.toCharge = item.toCharge > 0 ? 1 : 0;
            this.resourceData.other = this.resourceData.otherInfo.total;
            this.dataList.push({
              name: 'qi',
              title: "其他费",
              params: [
                {
                  prop: "proName",
                  label: "项目名称",
                  align: "left",
                  headerAlign: "left",
                  width: "200",
                  fixed: "left"
                }, {
                  prop: "unitPrice",
                  label: "单价",
                  align: "right",
                  headerAlign: "left",
                  width: "80",
                  fixed: "left"
                }, {
                  prop: "num",
                  label: "数量",
                  align: "left",
                  headerAlign: "left",
                  width: "80",
                  fixed: "left"
                }, {
                  prop: "units",
                  label: "单位",
                  align: "left",
                  headerAlign: "left",
                  width: "80",
                  fixed: "left"
                }, {
                  prop: "allCost",
                  label: "合计",
                  align: "right",
                  headerAlign: "left",
                  width: "80",
                  fixed: "left"
                }
              ],
              list: detail,
              total: this.resourceData.otherInfo.total,
              toCharge: item.toCharge > 0 ? 1 : 0
            });
          }
          // debugger;
          //已收
          receivedCost += parseFloat(item.charge);
          //代收
          unreceivedCost += parseFloat(item.toCharge);
        });
        this.dataList = this.bubbleSort(this.dataList);
        this.resourceData.receivedCost = parseFloat(receivedCost).toFixed(2);
        //待收
        this.resourceData.unreceivedCost = parseFloat(unreceivedCost).toFixed(2);
        //合计
        this.resourceData.allCost = parseFloat(receivedCost + unreceivedCost).toFixed(2);

        this.handleDataDisable();
      },
      handleDataDisable() {
        let dataList = this.dataList;
        this.$nextTick(() => {
          // document.getElementsByClassName('el-table__header')[0].getElementsByClassName('el-table__header el-checkbox__inner')[0].classList.add('is-disabled');
          // document.getElementsByClassName('el-checkbox__original')[0].disabled = true
          // document.getElementsByClassName('common-table-header')[0].addEventListener('click', function () {
          //   event.stopImmediatePropagation()
          // }, true)
        })
      },
      //治疗选项改变
      treatmentSelection(selections) {
        this.treatmentSelections = selections;
      },
      //检查选项改变
      checkSelection(data, row) {
        if (data != []) {
          this.checkSelections[row.orderItemCat] = data;
        } else {
          this.checkSelections[data[0].orderItemCat] = data;
        }
      },
      checkSelectionAll(data, key) {
        let num = 0;
        for (let i in data) {
          if (data[i].toCharge != 1) {
            num++;
          }
        }
        if (num == data.length) {
          this.$refs.multipleTable[key].clearSelection();
        }
        if (this.selection == []) {
          this.checkSelections[data[0].orderItemCat] = [];
        } else {
          this.checkSelections[data[0].orderItemCat] = this.selection;
        }
        // console.log(this.checkSelections);
      },
      selectionChange(data) {
        this.selection = data;
        console.info(data);
      },
      //预结算接口
      async charge1() {
        // console.log('this.checkSelections', this.checkSelections);
        let checkSelections = [];
        let checkSelectionsNew = [];
        for (let i in this.checkSelections) {
          checkSelections = checkSelections.concat(this.checkSelections[i])
        }
        // console.log('checkSelections:',checkSelections);
        checkSelections.map((e, i) => {
          checkSelectionsNew.push({
            orderItemName: e.proName || '',
            price: e.unitPrice || '',
            // quantity: e.num || '',
            quantity: e.orderItemCat < 5 ? e.num * e.packQuantity : e.num,
            unit: e.units || '',
            amt: e.allCost || '',
            toCharge: e.toCharge || '',
            orderItemCat: e.orderItemCat || '',
            orderItemId: e.orderItemId || '',
            prescriptionSource: e.prescriptionSource || '',
            ouptDeptId: e.ouptDeptId || '', // 专科Id 必传
            id: e.id || '',
            dataVersion: e.dataVersion || '',
            rDataVersion: e.rDataVersion || '',
            recipeId: e.recipeId || '',
            orderCat: e.orderCat || '',
            receiveDept: e.receiveDept || '',
            visitId: e.visitId || ''
          });
        });
        //获取预约信息
        await this.getApptByVisitCoder();
        if (checkSelectionsNew.length > 0) {
          this.param = {
            ...this.charge1Data,
            diagTreatActivityId: this.charge1Data.appointmentId,
            chargePrescriptions: checkSelectionsNew
          };
          this.loading = true;
          try {
            //预结算接口
            let res = await preSettlement(this.param);
            //this.getVisitInfo();
            if (res.code === 1) {
              this.charge.chargeObj = {
                ...res.data,
                chargePrescriptions: checkSelectionsNew
              };
              this.dialogVisible = true;
            } else {
              this.$message.error(res.message || "预结算请求失败");
            }
            this.loading = false;
          } catch (error) {
            this.loading = false;
            this.$message.error(error.message || '预结算请求失败');
          }
        } else {
          this.$message.error('结算清单为空');
        }
      },
      // 弹窗提示
      handleClose(done) {
        this.$confirm("确认关闭？")
          .then(_ => {
            done();
          }).catch(_ => {
        });
      },
      // 确认收费
      async submitCharge() {
        this.$showLoading();
        await this.getAccountInfo();
        this.$set(this.charge.chargeObj, 'chargeType', '2')
        if (this.charge.chargeObj.cashPay == 0) {
          try {
            const response = await appointment.settlement(this.charge.chargeObj);
            if (response.code == "1") {
              this.$message({
                message: response.msg,
                type: "success"
              });
            } else {
              this.$message.error(response.message || "缴费失败");
            }
            this.dialogVisible = false;
            this.$hideLoading();
            this.clearData();
            await this.getVisitInfo();
            return;
          } catch (error) {
            this.$hideLoading();
            this.$message.error(error.msg || "缴费失败");
          }
        } else if (this.charge.chargeObj.cashPay > 0) {
          let prestore = "";
          try {
            // 充值
            const response = await appointment.prestore({
              prestoreMoney: this.charge.chargeObj.cashPay,
              patientId: this.hisRecordData.patientId,
              patientName: this.hisRecordData.patientName,
              prestoreCode: "01",
              businessType: "1",
              payTypeId: "1",
              dataVersion: this.accountDataVersion
            });
            prestore = response.data.prestoreDetailId;
          } catch (error) {
            this.$hideLoading();
            this.$message.error(error.msg || "充值失败");
          }
          try {
            // 结算  （充完值，预结算对象 的值 要不要变）
            const res = await appointment.settlement({
              ...this.charge.chargeObj,
              prestoreDetailId: prestore
            });
            if (res.code == "1") {
              this.$message({
                message: res.msg,
                type: "success"
              });
              //刷新页面
              this.clearData();
              await this.getVisitInfo();
            } else {
              this.$message.error(res.message || "结算失败");
            }
            this.dialogVisible = false;
          } catch (error) {
            this.$hideLoading();
            this.$message.error(error.msg || "结算失败");
          }
        }
        this.dialogVisible = false;
        this.$hideLoading();
      },
      //获取预约信息
      async getApptByVisitCoder() {
        this.loading = true;
        try {
          let res = await getApptByVisitCode({
            visitCode: this.hisRecordData.visitCode
          });
          if (res.code === 1) {
            this.charge1Data = res.data[0];
          } else {
            this.$message.error(res.message || "获取预约信息失败");
          }
          this.loading = false;
        } catch (error) {
          this.loading = false;
          this.$message.error(error.message || '获取预约信息失败');
        }
      },
      //数组排序方法
      bubbleSort(arr) {
        for (let i = 0; i < arr.length - 1; i++) {
          for (let j = 0; j < arr.length - 1 - i; j++) {
            if (arr[j].toCharge < arr[j + 1].toCharge) {
              let tem = arr[j];
              arr[j] = arr[j + 1];
              arr[j + 1] = tem;
            }
          }
        }
        return arr;
      },
      calcQuantity(item) {
        let unitInfo = blukToOutfit(item.quantity, item.packQuantity);
        console.info("unitInfo," + item.quantity + "," + item.packQuantity + JSON.stringify(unitInfo));
        return unitInfo;
      },
      //表数据反显
      async transformTable(columns, conditionMap, tableName) {
        try {
          let data = {
            tableName: tableName || '',
            columns: columns || '',
            conditionMap: conditionMap || {}
          };
          let resData = await getTableData(data);
          if (resData.code === 1 && resData.data != []) {
            // this.depName = resData.data[0][columns];
            return Promise.resolve(resData.data[0][columns]);
          } 
            // this.depName = '默认科室';
            return '默认';
          
        } catch (error) {
          // this.depName = '默认科室';
          return '默认';
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .costsTabs {
    .depart-select {
      width: 260px;
      //margin: 0 0 0 0;
    }

    .title {
      .title-cont {
        margin-left: 14px;
      }
    }

    .treatment {
      .treatment-subtotal {
        height: 35px;
        margin-top: 20px;
        padding: 5px;
        border-bottom: 1px solid $l-color-bgcolor-11;

        i {
          font-style: normal;
          color: $l-color-primary;
        }
      }
    }

    .check {
      .check-subtotal {
        height: 35px;
        margin-top: 20px;
        padding: 5px;
        border-bottom: 1px solid $l-color-bgcolor-11;

        i {
          font-style: normal;
          color: $l-color-primary;
        }
      }
    }

    .change-color {
      font-style: normal;
      color: $l-color-primary;
    }
  }
</style>
