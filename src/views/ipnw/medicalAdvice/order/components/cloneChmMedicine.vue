<template>
  <el-card class="rightMedicalOrder overflow-hidden height100">
    <div class="position-relative overflow-hidden" style=" height: 60%">
      <div>

        <div ref="btnGroup" class="edit-btn-box">
          <span class="cursor-pointer" @click="add" v-hotKey="{ func: 'func_add1' }">
            <i class="iconfont iconxinzeng"></i>
            {{ $t("cis.btn.add") }}
          </span>

          <!-- <span class="cursor-pointer" @click="submitSave" v-hotKey="{ func: 'func_submit' }">
             <i class="iconfont icontijiao1"></i>
             {{ $t("cis.btn.submit") }}
           </span>
           <b class="line"></b>

           <span class="cursor-pointer" @click="deleteHandler" v-hotKey="{ func: 'func_delete' }">
             <i class="iconfont iconshanchu"></i>
             {{ $t("cis.btn.del") }}
           </span>

           <b class="line"></b>
           <span class="cursor-pointer" @click="print" v-hotKey="{ func: 'func_print' }">
             <i class="iconfont icondayin"></i>
             {{ $t("cis.btn.print") }}
           </span>-->
        </div>
        <div
          class="position-absolute"
        >
          <el-table
            v-hotKey="{
              func: ['table_row', 'table_checkbox', 'table_choose'],
              deClass: 'el-table__row',
              curClass: 'current-row'
            }"
            :data="tableList"
            ref="multipleTable"
            stripe
            highlight-current-row
            @current-change="handleCurrentChange"
            @selection-change="handleSelectionChange"
            @select="selectRow"
            height="100%"
            style="width: 100%"
          >

            <template v-for="item in tableColumn">
              <el-table-column :label="item.label" :width="item.width" align="center">
                <template slot-scope="scope">


                  <template v-if="item.prop.indexOf('fryingRemark')>-1">
                    <l-value-domain
                      code="fryingRemark"
                      :value.sync="scope.row[item.prop]"
                      class="select-container"
                    />
                  </template>

                  <template v-else-if="item.prop.indexOf('basicDosage')>-1">
                    <el-input size="mini"
                              @keyup.enter.native="selectColum($event,scope.$index,item.colIndex,item.prop+scope.$index,item.prop)"
                              :key="item.prop+scope.$index" :ref="item.prop+scope.$index"
                              v-model="scope.row[item.prop]"></el-input>
                  </template>


                  <template v-else-if="item.prop.indexOf('name')>-1">
                    <!-- <LInputTable  v-if="scope.row[item.prop]===''"
                                   :popoverWidth="800"
                                   v-model="scope.row[item.prop]"
                                   suffix-icon="el-icon-search"
                                   :tableData="selectOptions"
                                   style="width:200px;"
                                   @query="search(scope.row, item,scope.$index,$event)"
                                   @select="select"
                                   :tableParams="dropColumn"
                                   placeholder="请选择药品"
                     >
                     </LInputTable>
 -->
                    <Linput
                      :popoverWidth="800"
                      suffix-icon="el-icon-search"
                      :tableData="selectOptions"
                      @query="search(scope.row, item,scope.$index,$event)"
                      @select="select"
                      :tableParams="dropColumn"
                      :backDrugName="scope.row[item.prop]"
                      placeholder="请选择药品"
                    ></Linput>

                  </template>


                  <template v-else-if="item.prop.indexOf('basicDocAgeUnit')>-1">
                    <l-value-domain
                      code="BasicDocAgeUnit"
                      :value.sync="scope.row[item.prop]"
                      class="select-container" placeholder=""
                    />
                  </template>

                </template>
              </el-table-column>
            </template>
          </el-table>
        </div>
      </div>

    </div>
    <div style="height: calc(40% - 20px)" class="bottom clearfix">
      <div style="width:150px" class="float-left height100">
        <el-table
          :data="tableData"
          width="100%"
          height="100%"
          highlight-current-row
          @row-click="chmDetails"
          border
        >
          <el-table-column
            prop="adviceNumber"
            label="处方列表"
            min-width="120"
            align="center"
            header-align="center"
          ></el-table-column>
        </el-table>
      </div>
      <div style="width:calc(100% - 150px)" class="float-right height100">
        <el-tabs class="height100 tabs" v-model="activeName">
          <el-tab-pane label="处方概要录入" name="first">
            <chm-bottom-form v-if="activeName === 'first'" ref="chmBottomForm"
                             @initChmTable="initChmTable" :tableList="tableList" :advicePO="advicePO"></chm-bottom-form>
          </el-tab-pane>
          <el-tab-pane label="药品模板" name="second">
            <save-tpl v-if="activeName === 'second'" hosType="3"></save-tpl>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </el-card>
</template>

<script>
  import chmBottomForm from "./cloneChmBottomForm";
  import saveTpl from "./saveTemplate";
  import {temporary, getAdviceItem, getAdvice, getChmAdvice} from "@/api/cis/resident/residentAdvice";
  import {
    getAdviceItemList
  } from '@/api/systemManagement/dataMaintain/adviceItem';
  import {getChmMessage} from "@/api/cis/resident/chm";
  import {mapActions, mapGetters} from "vuex";

  import Linput from "./Linput";

  export default {
    name: "chmMedicine",
    props:{
      moduleType:String,
      default:'cis'
    },
    data() {
      return {
        tableData: [],
        selectOptions: [],
        dropColumn: [
          // 下拉 table 配置表头
          // {
          //   prop: "reimburseName",
          //   label: "报销",
          //   width: 60,
          //   codeTransform: true,
          //   codeTransformCode: "DrugReimbursementType"
          // },
          {
            prop: "name",
            label: "名称",
            align: 'center',
            width: 100
          },
          {
            prop: "spec",
            align: 'center',
            label: "规格"
          },
          {
            prop: "price",
            align: 'center',
            label: "单价",
            width: 100
          },
          // {
          //   prop: "execDeptName",
          //   label: "药房",
          // align: 'center',
          //   width: 100
          // },
          {
            prop: "itemTypeName",
            label: "项目类别",
            align: 'center',
            width: 100,
            // codeTransform: true,
            // codeTransformCode: "category_Code"
          },
          // {
          //   prop: "stockNum",
          //   label: "库存",
          //   width: 100
          // },
          // {
          //   prop: "basicType",
          //   label: "基药",
          //   width: 110,
          //   codeTransform: true,
          //   codeTransformCode: "BasicDrugType"
          // }
        ],
        basicDocAgeUnitList: [
          {
            value: 1,
            label: '钱'
          },
          {
            value: 2,
            label: '克'
          }
        ],
        activeName: 'first',
        fryingRemarkList: [
          {
            value: 1,
            label: '先煎'
          },
          {
            value: 2,
            label: '后下'
          },
          {
            value: 3,
            label: '包煎'
          },
          {
            value: 4,
            label: '另炖或另煎'
          },
          {
            value: 5,
            label: '熔化'
          },
          {
            value: 6,
            label: '泡服'
          },
          {
            value: 7,
            label: '冲服'
          }

        ],
        tableColumn: [
          {
            label: '草药名称',
            prop: 'name1',
            width: 150,
            colIndex: 0
          },
          {
            prop: "basicDosage1",
            label: "数量",
            width: 70,
            colIndex: 1


          },
          {
            prop: "basicDocAgeUnit1",
            label: "单位",
            width: 80,
            colIndex: 2


          },
          {
            prop: "fryingRemark1",
            label: "煎服法",
            width: 80,
            colIndex: 3
          },
          {
            label: '草药名称',
            prop: 'name2',
            width: 150,
            colIndex: 4
          },
          {
            prop: "basicDosage2",
            label: "数量",
            width: 70,
            colIndex: 5

          },
          {
            prop: "basicDocAgeUnit2",
            label: "单位",
            width: 70,
            colIndex: 6


          },
          {
            prop: "fryingRemark2",
            label: "煎服法",
            width: 80,
            colIndex: 7
          },
          {
            label: '草药名称',
            prop: 'name3',
            width: 150,
            colIndex: 8
          },
          {
            prop: "basicDosage3",
            label: "数量",
            width: 70,
            colIndex: 9

          },
          {
            prop: "basicDocAgeUnit3",
            label: "单位",
            width: 70,
            colIndex: 10


          },
          {
            prop: "fryingRemark3",
            label: "煎服法",
            width: 80,
            colIndex: 11
          },
          {
            label: '草药名称',
            prop: 'name4',
            width: 150,
            colIndex: 12
          },
          {
            prop: "basicDosage4",
            label: "数量",
            width: 70,
            colIndex: 13

          },
          {
            prop: "basicDocAgeUnit4",
            label: "单位",

            width: 70,
            colIndex: 14

          },
          {
            prop: "fryingRemark4",
            label: "煎服法",
            width: 80,
            colIndex: 15
          }
        ],
        tableList: [],
        advicePO: {},
        // 分页数据
        currentPage: 1,
        pageSize: 5,
        total: 1,
        queryName: "",
        //  查询条件
        searchForm: {
          visitCode:"", //门诊处方患者列表 门诊号
          categoryCode: 2,
          inpCode: "",
          dateRange: [],
          patientId: "",
          wardId: "",
          bedNo: "",
          name: "", // 医嘱查询关键词
          status: "", //
          //    deptType: "1", //
          adviceType: "3",
          today: "",
          patientName: "",
          property: "",
          attribute: "",
        }
      }
    },
    components: {
      chmBottomForm,
      saveTpl,
      Linput
    },
    methods: {
      select(row) {
        console.log("hdafdha:", row);
        let name = this.searchForm.property;
        let i = name.substr(name.length - 1);
        this.$set(this.tableList[this.searchForm.attribute], name, row.name);
        this.$set(this.tableList[this.searchForm.attribute], 'code' + i, row.itemId);
        this.$set(this.tableList[this.searchForm.attribute], 'execDeptName' + i, row.execDeptName);
        this.$set(this.tableList[this.searchForm.attribute], 'execDeptCode' + i, row.execDeptCode);
        this.$set(this.tableList[this.searchForm.attribute], 'manageType' + i, row.manageType);
        this.$set(this.tableList[this.searchForm.attribute], 'formCode' + i, row.formCode);

        console.log("tab:", this.tableList);
      },
      add(){
        this.initChmTable();
        this.$refs['chmBottomForm'].reset();
      },
      //处方明细
      chmDetails(row){
        this.initChmTable(row);
        let index=6;
        if(row.advicePOList.length<=6){
          index=row.advicePOList.length;
        }
        for(let i=0;i<index;i++){
          this.tableList.unshift({
            name1: row.advicePOList[i].name,
            basicDosage1: row.advicePOList[i].basicDosage,
            fryingRemark1:row.advicePOList[i].fryingRemark,
            basicDocAgeUnit1: row.advicePOList[i].basicDosageUnit
          })
        }
        if(row.advicePOList.length<=9 &&row.advicePOList.length>6){
          addChmData(0,7,row.advicePOList.length-6,row.advicePOList);
//            for(let k=2;i<row.advicePOList.length;k++) {
//              this.$set(this.tableList[0], name + k, row.advicePOList[k-1].name);
//              this.$set(this.tableList[0], basicDosage + k, row.advicePOList[k-1].basicDosage);
//              this.$set(this.tableList[0], fryingRemark + k, row.advicePOList[k-1].fryingRemark);
//              this.$set(this.tableList[0], basicDocAgeUnit + k, row.advicePOList[k-1].basicDosageUnit);
//            }
        }
        if(row.advicePOList.length<=12 &&row.advicePOList.length>9){
          addChmData(0,7,3,row.advicePOList);
          addChmData(1,10,row.advicePOList.length-9,row.advicePOList);
        }
        if(row.advicePOList.length<=15 &&row.advicePOList.length>12){
          addChmData(0,7,3,row.advicePOList);
          addChmData(1,10,3,row.advicePOList);
          addChmData(2,13,row.advicePOList.length-12,row.advicePOList);
        }

        if(row.advicePOList.length<=18 &&row.advicePOList.length>15){
          addChmData(0,7,3,row.advicePOList);
          addChmData(1,10,3,row.advicePOList);
          addChmData(2,13,3,row.advicePOList);
          addChmData(3,16,row.advicePOList.length-15,row.advicePOList);
        }

        if(row.advicePOList.length<=21 &&row.advicePOList.length>18){
          addChmData(0,7,3,row.advicePOList);
          addChmData(1,10,3,row.advicePOList);
          addChmData(2,13,3,row.advicePOList);
          addChmData(3,16,3,row.advicePOList);
          addChmData(4,19,row.advicePOList.length-18,row.advicePOList);
        }

        if(row.advicePOList.length<=24 &&row.advicePOList.length>21){
          addChmData(0,7,3,row.advicePOList);
          addChmData(1,10,3,row.advicePOList);
          addChmData(2,13,3,row.advicePOList);
          addChmData(3,16,3,row.advicePOList);
          addChmData(4,19,3,row.advicePOList);
          addChmData(5,22,row.advicePOList.length-21,row.advicePOList);
        }

        this.advicePO=row.advicePOList[0];
        console.log("tableList：",this.tableList);
      },
      addChmData(m,n,arrLength,list){
        for(let k=0;k<arrLength;k++) {
          let s=k+2;
          this.$set(this.tableList[m], name + s, list[n].name);
          this.$set(this.tableList[m], basicDosage + s, list[n].basicDosage);
          this.$set(this.tableList[m], fryingRemark + s, list[n].fryingRemark);
          this.$set(this.tableList[m], basicDocAgeUnit + s, list[n].basicDosageUnit);
          n++;
        }
      },
      //查询处方列表
      queryChuFang() {
        getChmMessage({
          inpCode: this.receivePatientData.inpCode,
          visitCode: this.receivePatientData.visitCode,
          openSource:'0'
        })
          .then(res => {
            if (res.code == 1) {
              this.tableData=res.data;
              console.log("tableData:",this.tableData);
            } else {
              this.$message.error(msg);
            }
          })
          .catch(err => {
            this.$message.error("网络错误!");
          });
      },

//      async fetchTableList() {
//
//        let data = this.searchForm;
//        let cloneData = Object.assign(data);
//        getChmAdvice(cloneData).then(data => {
//          console.log(data);
//          //debugger
//
//          /*   this.tableList=[]
//
//             for (let i =0;i<data.data.length;i++) {
//               if (i % 4 > 0){
//                 let item = {}
//                 for(let obj in data.data[i]){
//                   item[`${obj}${i%4+1}`] = data.data[i][obj]
//                 }
//                 let _item = this.tableList[parseInt(i/4)]
//                 this.tableList[parseInt(i/4)] = {..._item,...item}
//               }else if (i%4==0) {
//                 let item = {}
//                 for(let obj in data.data[i]){
//                   item[`${obj}${i%4+1}`] = data.data[i][obj]
//                 }
//                 this.tableList.push(item)
//               }
//             }
//             console.log("tableList",this.tableList)*/
//          this.tableList = this.data.data;
//
//
//          if (this.tableList.length == 0) {
//            this.addChmItem(6);
//          } else if (this.tableList.length <= 4) {
//            this.addChmItem(5);
//          } else if (this.tableList.length <= 8) {
//            this.addChmItem(4);
//
//          } else if (this.tableList.length <= 12) {
//            this.addChmItem(3);
//
//          } else if (this.tableList.length <= 16) {
//            this.addChmItem(2);
//
//          } else if (this.tableList.length <= 20) {
//            this.addChmItem(1);
//          }
//
//        });
//      },
      search(query, item, index) {
        console.log("item:", item);
        console.log("index:", index);
        this.searchForm.property = item.prop;
        this.searchForm.attribute = index;

        let pageNo = this.queryName === query ? this.currentPage * 1 + 1 : 0;
        let data = {
          ...{pageNo: pageNo, pageSize: this.pageSize, name: query, activeType: 2}
        };
        getAdviceItemList(data).then(res => {
          if (res.code === 1) {
            let {data} = res;
            let tableData =
              this.currentPage !== 0 ? this.selectOptions : [];
            for (let i = 0; i < data.length; i++) {
              const item = data[i];
              tableData.push({
                itemId: item.itemId || "",
                itemCode: item.itemCode || "",
                name: item.drugName || "",
                production: item.production || "",
                itemType: item.itemType || "",
                itemTypeName: item.itemType || "",
                execDeptCode: item.execDeptCode || "",
                execDeptName: item.execDeptName || "",
                spec: item.spec || "",
                price: new Number(item.price).toFixed(4) || "",
                stClassCode: item.stClassCode || "",
                unit: item.unit || "",
                limitUnit: item.limitUnit || "",
                packQuantity: item.packQty || "",
                dosageUnit: item.defaultDosageUnit || "",
                defaultUsage: item.defaultUsage || "",
                dosage: item.dosage || "",
                firstDayCount: item.firstDayCount || "",
                takeMedicine: item.takeMedicine || "",
                sos: item.sos || "",
                prn: item.prn || "",
                halfUseFlg: item.halfUseFlg || "",
                dosageValue: item.dosageValue || "",
                stockNum: item.stockNum || "",
                manageType: item.manageType || "",
                adviceType: item.adviceType || "",
                formCode: item.formCode || "",
                basicType: item.basicType || "",
                unitSaleFlg: item.unitSaleFlg || "",
                reimburseMark: item.reimburseMark || "",
                reimburseName: item.reimburseName || "",
                clinicMark: item.clinicMark || "", //成组样式
                medicareItemCode: item.medicareItemCode || "",
                medicareItemName: item.medicareItemName || ""
              });
            }
            console.log(tableData);
            this.selectOptions = tableData;
            this.currentPage = res.pageNo;
            this.pageSize = res.pageSize;
            this.total = res.total;
            this.queryName = query;
          } else {
            this.$message.error(res.msg ? res.msg : "获取数据失败");
          }
        });
      },
      handleCurrentChange() {

      },
      handleSelectionChange() {

      },
      selectRow() {

      },
      searchAdv() {
        this.addTableList();
      },
      submitSave() {
        this.$refs['chmBottomForm'].submitApply();
      },
      radioChange() {

      },
      print() {

      },
      deleteHandler() {

      },
      focus(rowIndex, colIndex) {
        console.log(rowIndex, colIndex)
        if (rowIndex > 0 || colIndex > 0) {
          if (colIndex === 0) {
            let column = this.$refs[this.tableColumn[(this.tableColumn.length - 1)]['prop'] + (rowIndex - 1)][0]
            if (column && column.blur) {
              column.blur();
            }
          } else {
            let column = this.$refs[this.tableColumn[(colIndex - 1)]['prop'] + rowIndex][0]
            if (column && column.blur) {
              column.blur();
            }
          }
        }
      },
      selectColum(event, rowIndex, colIndex, name, prop) {

        if (event) {
          event.target.blur();

          if (prop != 'fryingRemark4') {
            if (prop == 'name4') {
              if (rowIndex === (this.tableList.length - 1)) {
                this.addTableList();
              }

            }
            let column = this.$refs[this.tableColumn[(colIndex + 1)].prop + rowIndex][0]
            if (column && column.focus) {
              column.focus();


            }
          } else {
            let column = this.$refs[this.tableColumn[0].prop + (rowIndex + 1)][0]
            if (column && column.focus) {
              column.focus();

            }

          }

        }
      },
      addTableList() {
        this.addChmItem(1)
      },
      addChmItem(index) {
        for (let i = 0; i < index; i++) {
          this.tableList.push({
            name1: '',
            basicDosage1: "",
            fryingRemark1: '',
            basicDocAgeUnit1: '',
            name2: '',
            basicDosage2: "",
            basicDocAgeUnit2: '',
            fryingRemark2: '',
            name3: '',
            basicDosage3: "",
            basicDocAgeUnit3: '',
            fryingRemark3: '',
            name4: '',
            basicDosage4: "",
            basicDocAgeUnit4: '',
            fryingRemark4: ''
          })
        }
      },
      initChmTable(row) {

        this.tableList = [];
        this.addChmItem(6)
        if (!row) {// 单机处方明细 不需要请求处方列表
          this.queryChuFang();
        }

      }
    },
    created() {
//      this.fetchTableList();

      this.initChmTable();
      this.queryChuFang();


    },
    computed: {
      ...mapGetters("base", ["receivePatientData"])
    },
    watch: {
      receivePatientData: {
        handler(c) {

          this.searchForm.inpCode = c.inpCode;
          this.searchForm.patientId = c.patientId;
          this.searchForm.wardId = c.wardId;
          this.searchForm.bedNo = c.bedCode;
          this.searchForm.patientName = c.patientName;
          if (this.moduleType === 'cis') {//门诊号
            this.searchForm.visitCode = c.visitCode;
          }

//          this.fetchTableList();
          this.queryChuFang();
          this.initChmTable();
          this.$refs.bottomForm && this.$refs.bottomForm.hollow(); // 重置表单
        },
        immediate: true
      }
    }
  }
</script>

<style scoped lang="scss">
  .rightMedicalOrder {
    height: 100%;

    .search-box {
      overflow: hidden;
      //line-height: 40px;
      padding-left: 20px;
      margin: 10px 0;

      .radio-group {
        float: left;
        margin-top: 25px;
      }

      .datePicker {
        margin: 15px 0 0 10px;

        // 修复datepicker 的删除按钮位置
        /deep/ .el-date-editor .el-range__close-icon {
          position: unset;
        }
      }

      .select-item {
        margin-top: 15px;
        float: left;
        width: 120px;
        margin-left: 10px;
      }
    }

    .edit-btn-box {
      line-height: 40px;
      padding-left: 20px;
      margin: 10px 0;

      span {
        margin-right: 8px;
        line-height: 24px;
        font-size: 14px;

        i {
          display: inline-block;
          width: 24px;
          height: 24px;
          text-align: center;
          font-size: 14px !important;
        }
      }

      // 撤销按钮 比较大 需要 额外的margin-right
      .chexiaoSpan > i {
        margin-right: 10px;
      }

      .line {
        display: inline-block;
        border-right: 2px solid $l-color-bgcolor-11;
        margin-left: 0px;
        margin-right: 16px;
        height: 18px;
        position: relative;
        top: 5px;
      }
    }

    .disabled {
      color: $l-color-fontcolor-4;
    }

    .state-info {
      position: relative;
      font-size: 14px;
      
      font-weight: 400;
      display: inline-block;
      width: 100%;

      .state-info-icon {
        position: absolute;
        right: 0;
        width: 15px;
        height: 15px;
        display: inline-block;
        color: #ffd2c2;
        top: 0;
        cursor: pointer;
        z-index: 100;
      }
    }

    .detail-table {
      left: 0;
      width: 100%;
      transition: all 0.5s;

      .title {
        background-color: $l-color-bgcolor-18;
        padding-left: 10px;
        line-height: 30px;
        color: $l-color-fontcolor-3;
        font-size: 14px;

        span {
          width: 80px;
          height: 20px;
          text-align: center;
          left: 50%;
          top: 1px;
          transform: translateX(-50%);
          background-color: #fff;
          cursor: pointer;
          border: 1px solid $l-color-bgcolor-11;
          border-radius: 0px 2px 2px 0px;

          i {
            position: relative;
            top: -5px;
            transition: all 0.5s;
          }

          i.active {
            transform: rotate(-180deg);
          }
        }
      }
    }

    .bottom {
      //bottom: 0;
      //right: 0;
      //left: 0;
      height: 30%;
      //position: absolute;
      /deep/ .el-table th.is-leaf, .el-table td {
        height: 40px;
      }

      /deep/ .el-tabs__nav-scroll {
        padding-left: 10px !important;
      }

      .tabs {
        /*padding: 10px 20px 20px 5px;*/

        /deep/ .el-tabs__content {
          height: calc(100% - 50px);
          /*overflow: auto;*/
        }
      }
    }
  }

  .bunchingUp {
    display: inline-block;
    color: $l-color-primary;

    &::after {
      content: "┓";
    }
  }

  .bunchingCenter {
    display: inline-block;
    color: $l-color-primary;

    &::after {
      content: "┫";
    }
  }

  .bunchingDown {
    color: $l-color-primary;
    display: inline-block;

    &::after {
      content: "┛";
    }
  }

  .el-table .cell {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    line-height: 23px;
    padding-left: 1px;
    padding-right: 1px;
  }
</style>
