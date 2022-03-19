<template>
    <div style="width: 100%;height: 100%;">
      <div style="height: 100%;width: 55%;float: left;">
        <el-card style="width: 100%;height: 50%;" id="homePage">
          <div style="width: 100%;height: 40px;">
            <div class="fangkuai"></div>
            <span style="line-height: 40px;margin-left: 5px;font-weight: bold;font-size: 16px">病案首页</span>
            <el-button class="detail" @click="$router.push({path:'/ipnw/ipIntegratedEmr/ipMedicalRecord'})">详情</el-button>
          </div>
          <div style="width: 100%;height: 82%;overflow-y: auto;overflow-x: hidden">

            <!--<div :style="{'height':hpHeight+'px','overflow':'hidden'}">-->
              <mr-homepage :style="{'transform': 'scale('+scaleVal+')','transform-origin': '0 0'}"></mr-homepage>
              <!--</div>-->

          </div>
        </el-card>
        <el-card style="width: 100%;height: 50%;margin-top: 10px" id="report">
          <div style="width: 100%;height: 40px;" class="aaa">
            <div class="fangkuai"></div>
            <el-select v-model="reportType" style="width: 110px;margin-left: 5px;" @change="changeReportType">
              <el-option
                v-for="item in reportTypeOpts"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-button class="detail" @click="reportDetail">详情</el-button>
          </div>
          <div style="height: 85%;float: left;overflow: auto;padding: 0px 20px">
            <component ref="timeLine" :patien="receivePatientData.patientId" @detail="showDetail" :is="timeLine"></component>
          </div>
          <div style="height: 80%;margin: 20px 20px 20px 368px;padding-left:20px;overflow: auto;border-left: 1px solid #E4E4E4">
            <div v-if="reportType==='0'">
              <img src="@/views/cis/integratedEmr/3.png" style="zoom: 0.8;" alt=""/>
            </div>
            <div v-else>
              <!--<el-table-->
                <!--:data="testReport"-->
                <!--border-->
                <!--:height="testRecTableHeight"-->
                <!--style="width: 100%">-->
                <!--<el-table-column-->
                  <!--type="index"-->
                  <!--label="序号"-->
                  <!--width="50">-->
                <!--</el-table-column>-->
                <!--<el-table-column-->
                  <!--prop="project"-->
                  <!--label="检验项目"-->
                  <!--width="100">-->
                <!--</el-table-column>-->
                <!--<el-table-column-->
                  <!--prop="testResult"-->
                  <!--label="测定结果"-->
                  <!--width="100">-->
                <!--</el-table-column>-->
                <!--<el-table-column-->
                  <!--prop="unit"-->
                  <!--label="单位"-->
                  <!--width="100">-->
                <!--</el-table-column>-->
                <!--<el-table-column-->
                  <!--label="结果"-->
                  <!--width="100">-->
                  <!--<template slot-scope="scope">-->
                    <!--<i :class="resIcon(scope.row.result)" ></i>-->
                  <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column-->
                  <!--prop="scope"-->
                  <!--label="参考范围"-->
                  <!--width="100">-->
                <!--</el-table-column>-->
              <!--</el-table>-->
              <el-table
                :data="tabsList"
                highlight-current-row
                style="width: 100%"
                :height="testRecTableHeight"
                border
                v-loading="tlm_isLoading"
              >
                <el-table-column
                  v-for="(item,index) in tableParams"
                  :key="index"
                  :prop="item.prop"
                  :label="item.label"
                  :min-width="item.width"
                  header-align="center"
                  :align="item.align || 'left'"
                  :fixed="item.fixed"
                >
                  <template slot-scope="scope">
                    <span v-if="item.prop === 'result'">
                      <i
                        v-if="scope.row['assayResult'] > scope.row['referenceValue'].split('-')[1]"
                        class="iconfont iconshangsheng"
                      ></i>
                      <i
                        v-else-if="scope.row['assayResult'] < scope.row['referenceValue'].split('-')[0]"
                        class="iconfont iconxiajiang"
                      ></i>
                    </span>
                    <span v-else>{{ scope.row[item.prop]}}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-card>
      </div>
      <div style="height: 100%;margin-left: 56%">
        <el-card style="width: 100%;height: 30%;" id="diagnosticRec">
          <div style="width: 100%;height: 40px;">
            <div class="fangkuai"></div>
            <span style="line-height: 40px;margin-left: 5px;font-weight: bold;font-size: 16px">诊断记录</span>
            <!--<el-select v-model="diagnosticType" style="width: 110px;margin-left: 5px;">-->
              <!--<el-option-->
                <!--v-for="item in diagnosticTypeOpts"-->
                <!--:key="item.value"-->
                <!--:label="item.label"-->
                <!--:value="item.value">-->
              <!--</el-option>-->
            <!--</el-select>-->
            <l-value-domain code="DiseaseDiagnosisCategoryCode"  :value.sync="diagnosticType" placeholder="请选择" @change="diagnosticTypeChange" style="width: 110px;margin-left: 5px;"/>
            <el-button class="detail" @click="$router.push({path:'/ipnw/orderRecord/ipnw_diagnosis'})">详情</el-button>
          </div>
          <el-table
            :data="diagnosticRec"
            border
            :height="diagnosticRecHeight"
            v-loading="diagnosticRecTableLoading"
            style="width: 100%">
            <el-table-column
              prop="diagTime"
              label="时间"
              width="200">
            </el-table-column>
            <el-table-column
              prop="diagTypeName"
              label="诊断类型"
              width="200">
            </el-table-column>
            <el-table-column
              prop="diagName"
              label="诊断名称">
            </el-table-column>
          </el-table>
        </el-card>
        <el-card style="width: 100%;height: 40%;margin-top: 5px" id="prescriptionRec">
          <div style="width: 100%;height: 40px;">
            <div class="fangkuai"></div>
            <span style="line-height: 40px;margin-left: 5px;font-weight: bold;font-size: 16px">医嘱记录</span>
            <el-radio v-model="prescriptionRecCondition" label="1" style="margin-left: 5px">长期</el-radio>
            <el-radio v-model="prescriptionRecCondition" label="2" style="margin-left: 5px">临时</el-radio>
            <el-radio v-model="prescriptionRecCondition" label="3" style="margin-left: 5px">出院带药</el-radio>
            <el-button class="detail" @click="$router.push({path:'/ipnw/ipIntegratedEmr/ipMedicalOrder'})">详情</el-button>
          </div>
          <div style="width: 100%;overflow: auto">
            <el-table
              :data="prescriptionRec"
              border
              :height="prescriptionRecTableHeight"
              :span-method="rowSpanMethod"
              v-loading="prescriptionRecTableLoading"
              style="width: 100%">
              <el-table-column
                prop="index"
                label="序号"
                width="50">
              </el-table-column>
              <el-table-column
                prop="type"
                label="类型"
                width="100">
              </el-table-column>
              <el-table-column
                prop="date"
                label="时间"
                width="180">
              </el-table-column>
              <el-table-column
                prop="drugName"
                label="药品名称"
                width="200">
              </el-table-column>
              <el-table-column
                prop="dose"
                label="规格剂量"
                width="150">
              </el-table-column>
              <el-table-column
                prop="dosage"
                label="用量"
                width="150">
              </el-table-column>
              <el-table-column
                label="组"
                width="50">
                <template slot-scope="scope">
                  <span :class="scope.row.groupNoCls"></span>
                </template>
              </el-table-column>
              <el-table-column
                label="用法频次">
                <template slot-scope="scope">
                  <span :val="scope.row.uses" code="MedicationRouteCode" v-codeTransform></span> x
                  <span columns="FREQUENCY_NAME" :conditionMap="{FREQUENCY_CODE: scope.row.frequency}" tableName="hrp_frequency" v-tableTransform></span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
        <el-card style="width: 100%;height: 30%;margin-top: 5px">
          <div style="width: 100%;height: 40px;">
            <div class="fangkuai"></div>
            <span style="line-height: 40px;margin-left: 5px;font-weight: bold;font-size: 16px">文书记录</span>
            <el-button class="detail" @click="$router.push({path:'/ipnw/ipIntegratedEmr/ipMedicalRecord'})">详情</el-button>
          </div>
          <div style="overflow: auto;height: 65%" v-loading="mrLoading">
            <div style="border-bottom: 1px solid #E4E4E4;padding: 10px" v-for="(item,index) in insRecList" :key="index">
              <p style="display: inline;font-weight: bold">{{item.title}}</p><p style="display: inline;margin-left: 10px;font-weight: bold">{{item.date.format('yyyy-MM-dd hh:mm')}}</p>
              <p style="margin-top: 10px;color: #949DA3;"> {{item.content}}</p>
            </div>
          </div>
        </el-card>
      </div>
    </div>
</template>

<script>
    import mrHomepage from '@/views/ipnw/IntegratedEmr/component/mrHomepage.vue'
    import timeLine from '@/views/cis/integratedEmr/component/timeLine.vue'
    import timeLine1 from '@/views/public/reportCenter/component/List.vue'
    import timeLine2 from '@/views/public/reportCenter/component/insList.vue'
    import {mapGetters } from 'vuex'
    import { getReportData } from "@/api/reportCenter/report";

    import {
      getDiaByClinicType
    } from "@/api/common/diagnosis.js"

    import {
      getAdvice
    } from "@/api/cis/resident/residentAdvice.js"

    import {byPatientList,byIdList} from '@/api/emr/instrument.js'
    import {getParagraphContent} from '@/utils/axeditor'
    import { getTableDatas,transformCode,transformCodeList } from "@/api/directive/directiveRequest";

    export default {
        name: "introduction",
        components: {
          mrHomepage,
          timeLine,
          timeLine1,
          timeLine2
        },
        data(){
          return{
            tableParams: [
              {
                prop: "assayName",
                label: "检验项目"
              },
              {
                prop: "assayResult",
                label: "测定结果"
              },
              {
                prop: "assayUnit",
                label: "单位"
              },
              {
                prop: "result",
                label: "结果"
              },
              {
                prop: "referenceValue",
                label: "参考范围"
              }
            ],
            tabsList: [],
            tlm_isLoading: false,
            detail: '',
            reportType: '0',
            reportTypeOpts: [
              {
                label: '检查报告',
                value: '0'
              },
              {
                label: '检验报告',
                value: '1'
              }
            ],
            diagnosticType: '',
            diagnosticTypeOpts: [
              {
                value: '0',
                label: '入院诊断'
              }
            ],
            long: false,
            temporary: false,
            dischange: false,
            prescriptionRecCondition: '1',
            insRecList: [],
            testReport: [
              {
                project: '白细胞计数',
                testResult: '13.00',
                unit: '10^9/L',
                result: 'up',
                scope: '4.00~10.0'
              },
              {
                project: '中性粒细胞百分比',
                testResult: '62.4',
                unit: '%',
                result: 'flat',
                scope: '50.0~70.0'
              },
              {
                project: '淋巴细胞百分比',
                testResult: '10',
                unit: '%',
                result: 'down',
                scope: '20.0~40'
              }
            ],
            testRecTableHeight: 100,
            detailList1: [
              {
                date: new Date("2019-9-24"),
                project: '血常规',
                detail: 'XM001，检验科，已发布',
                value: true
              },
              {
                date: new Date("2019-9-20"),
                project: '血常规',
                detail: 'XM001，检验科，已发布',
                value: false
              }
            ],
            detailList2: [
              {
                date: new Date("2019-9-24"),
                project: '头部CT（CR/DR)',
                detail: 'XM001，CT室，已发布',
                value: true
              },
              {
                date: new Date("2019-9-15"),
                project: '腹部CT（CR/DR)',
                detail: 'XM001，CT室，已发布',
                value: false
              }
            ],
            diagnosticRec: [],
            diagnosticRecHeight: 100,
            diagnosticRecTableLoading: false,
            prescriptionRec: [],
            prescriptionRecTableHeight: 100,
            prescriptionRecTableLoading: false,
            orderTypeMap: new Map([['1','长期'],['2','短期'],['3','出院带药']]),
            mrLoading: false,
            timeLine: 'timeLine2',
            scaleVal: 1,
            hpHeight: 2700
          }
        },
        methods: {
          showDetail(data){
            this.detail = data
          },
          loadData() {
            this.tlm_isLoading = true;
            getReportData({
              assayPublishId: this.publishId
            })
              .then(res => {
                if (res.code === 1) {
                  this.tabsList = res.data;
                }
                this.tlm_isLoading = false;
              })
              .catch(err => {
                this.tlm_isLoading = false;
                //this.$message.error(err);
              });
          },
          rowSpanMethod({ row, column, rowIndex, columnIndex }){
            if (columnIndex === 0 || columnIndex === 7){
              if (row.groupNoCls == 'bunchingUp') {
                let length = 1
                do {
                  length++
                }while (this.prescriptionRec[++rowIndex].groupNoCls == 'bunchingCenter')
                return [length,1]
              }else if (row.groupNoCls === ''){
                return [1,1]
              }
              return [0,0]
            }
            return [1,1]
          },
          resIcon(result){
            switch (result) {
              case 'up':
                return 'iconfont iconshangsheng'
              case 'down':
                return 'iconfont iconxiajiang'
              case 'flat':
                return 'flat'
            }
            return ''
          },
          changeReportType(){
            if (this.reportType === "0"){
              //this.$refs.timeLine.detailList = this.detailList2
              this.timeLine = 'timeLine2'
            } else{
              this.timeLine = 'timeLine1'
              //this.$refs.timeLine.detailList = this.detailList1
            }
          },
          reportDetail(){
            if (this.reportType === "0") {
              this.$router.push({path: '/ipnw/ipIntegratedEmr/ipTestReport'})
            }else {
              this.$router.push({path: '/ipnw/ipIntegratedEmr/ipExamReport'})
            }
          },
          diagnosticTypeChange(){
            this.loadDiagnosticRecTable()
          },
          loadDiagnosticRecTable(){
            this.diagnosticRecTableLoading = true
            getDiaByClinicType({/*inpCode: this.receivePatientData.inpCode*/patientId: this.receivePatientData.patientId,diagType: this.diagnosticType}).then(res=>{
              this.diagnosticRec = []
              if (res.code == 1){
                let arr = []
                res.data.forEach(item=>{
                  if (arr.indexOf(item.diagType) < 0) {
                    arr.push(item.diagType)
                  }
                })
                let params = []
                arr.forEach(xxx=>{
                  let param = {
                    field: 'name',
                    code: 'DiseaseDiagnosisCategoryCode',
                    val: xxx,
                    key: xxx
                  }
                  params.push(param)
                })
                transformCodeList(params).then(yyy=>{
                  if (yyy.code == 1){
                    res.data.forEach(sss=>{
                      sss.diagTypeName = yyy.data[sss.diagType]
                    })
                    this.diagnosticRec = res.data
                  }
                })
                this.diagnosticRecTableLoading = false
              }
            })
          },
          loadPrescriptionRecTable(){
            this.prescriptionRec = []
            this.prescriptionRecTableLoading = true
            let no = 0

            let searchForm = {
              categoryCode: this.prescriptionRecCondition,
                inpCode: this.receivePatientData.inpCode,
                dateRange: [],
                patientId: this.receivePatientData.patientId,
                bedNo: this.receivePatientData.bedCode,
                name: "", // 医嘱查询关键词
                status: "", //
                deptType: "1", //
                adviceType: "1",
                today: "" //
            }
            getAdvice(searchForm).then(res=>{
              this.prescriptionRec = []
              if (res.code == 1){
                for(let i = 0;i < res.data.length;i++){
                  let pre = i - 1 >= 0 ? res.data[i - 1] : null
                  let now = res.data[i]
                  let next = i + 1 < res.data.length ? res.data[i + 1] : null
                  let row = {
                    index: no,
                    type: this.orderTypeMap.get(now.categoryCode),
                    date: now.adviceTime,
                    drugName: now.name,
                    dose: now.spec,
                    dosage: now.onceDosage + now.basicDosageUnit,
                    groupNoCls: '',
                    uses : now.uses,
                    frequency: now.frequency
                  }
                  if ((!pre || pre.groupNo != now.groupNo) && (next && next.groupNo == now.groupNo)){
                    row.groupNoCls = "bunchingUp"
                    row.index++
                    no++
                  }
                  else if (pre && pre.groupNo == now.groupNo && (next && next.groupNo == now.groupNo)){
                    row.groupNoCls = 'bunchingCenter'
                  }
                  else if (pre && pre.groupNo == now.groupNo && (!next || next.groupNo != now.groupNo)){
                    row.groupNoCls = 'bunchingDown'
                  }
                  else{
                    row.index++
                    no++
                  }
                  this.prescriptionRec.push(row)
                }
                this.prescriptionRecTableLoading = false
              }
            })
            // getOrdersByVisit({visitCode: this.receivePatientData.visitCode}).then(res=>{
            //   if (res.code == 1){
            //     res.data.forEach(item=>{
            //       if (!item){
            //         return false
            //       }
            //       let firstIndex = this.prescriptionRec.length == 0 ? 0 : this.prescriptionRec.length - 1
            //       for (let i = 0;i < item.orderGroup.length;i++){
            //         let x = item.orderGroup[i]
            //         let row = {
            //           type:'',
            //           date: x.createdAt,
            //           drugName: x.oderItemName,
            //           dose: x.spec,
            //           dosage: x.onceDosage + x.dosageUnit,
            //           groupNoCls: '',
            //           frequency: x.useWay + ' x ' + x.frequencyCode
            //         }
            //         if (x.isMajor === '0'){
            //           row.groupNoCls = 'bunchingUp'
            //           this.prescriptionRec.splice(firstIndex,0,row)
            //         }else {
            //           row.groupNoCls = 'bunchingCenter'
            //           this.prescriptionRec.push(row)
            //         }
            //       }
            //       if (item.orderGroup.length == 1){
            //         this.prescriptionRec[this.prescriptionRec.length - 1].groupNoCls = ''
            //       } else{
            //         this.prescriptionRec[this.prescriptionRec.length - 1].groupNoCls = 'bunchingDown'
            //       }
            //       return true
            //     })
            //     this.prescriptionRecTableLoading = false
            //   }
            // })
          },
          mrListLoad(){
            if(this.receivePatientData.inpCode != undefined && this.receivePatientData.inpCode != null && this.receivePatientData.inpCode != ''){
              this.mrLoading = true;
              byIdList({id: this.receivePatientData.inpCode,dnFlag: 1,visitType: '04'}).then(res=>{
                this.insRecList = []
                if (res.code == 1){
                  res.data.forEach(item=>{
                    let content = getParagraphContent(item.docMsg,'zs,xbs')
                    let aaa = {
                      date: new Date(item.visitDtime),
                      title: item.nm + " " + item.submitNm,
                      content: (content.zs.title ? content.zs.title + ':' + content.zs.content + ' ' : '') +
                        (content.xbs.title ? content.xbs.title + ':' + content.xbs.content : '')
                    }
                    this.insRecList.push(aaa)
                  })
                  this.mrLoading = false
                }
              })
            }
          }
        },
        mounted(){
          this.$refs.timeLine.detailList = this.detailList2
          setTimeout(()=>{
            this.scaleVal = (document.getElementById("homePage").offsetWidth - 20) / 1142
            this.hpHeight = this.scaleVal * 2700
            console.log('hpHeight:',this.hpHeight)
            this.testRecTableHeight = document.getElementById("report").offsetHeight - 90
            this.diagnosticRecHeight = document.getElementById("diagnosticRec").offsetHeight - 40
            this.prescriptionRecTableHeight = document.getElementById("prescriptionRec").offsetHeight - 40
          })
        },
        computed: {
          ...mapGetters("base", ["receivePatientData"]),
          publishId() {
            return this.detail.assayPublishId;
          }
        },
        watch: {
          receivePatientData: {
            handler(n){
              this.loadDiagnosticRecTable()
              this.loadPrescriptionRecTable()
              this.mrListLoad()
            },
            deep: true,
            immediate: true
          },
          publishId: {
            handler(n){
              this.loadData()
            },
            immediate: true
          },
          prescriptionRecCondition: {
            handler(n){
              this.loadPrescriptionRecTable()
            }
          }
        }
    }
</script>

<style lang="scss" scoped>
  .bunchingUp {
    display: inline-block;
    color: $l-color-primary;

  &::after {
     content: '┓';
   }
  }

  .bunchingCenter {
    display: inline-block;
    color: $l-color-primary;

  &::after {
     content: '┫';
   }
  }

  .bunchingDown {
    color: $l-color-primary;
    display: inline-block;

  &::after {
     content: '┛';
   }
  }

  .flat{
    color: $l-color-primary;
    display: inline-block;

    &::after {
      content: '-';
    }
  }

  .iconshangsheng {
    color: #e1140a;
  }
  .iconxiajiang {
    color: #3d7dfb;
  }

  .aaa{
    /deep/.el-input--medium .el-input__inner{
      border: 0px;
      font-weight: bold;
      font-size: 16px;
    }
  }

  .detail{
    width: 44px;
    height: 24px;
    padding: 5px;
    float: right;
    margin-top: 10px;
    margin-right: 20px;
  }

  .fangkuai{
    margin-left:10px;
    margin-top:10px;
    width: 5px;
    height: 20px;
    background-color: $l-color-primary;
    float: left
  }
</style>
