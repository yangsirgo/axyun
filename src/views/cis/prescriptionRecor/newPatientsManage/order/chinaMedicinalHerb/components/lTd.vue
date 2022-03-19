<template>
  <div :class="tdCls">
    <div class="tdClsStylel">
      <el-row :gutter="3">
        <el-form
          :inline="true"
          :model="tdObjectClone"
          :show-message="false"
          ref="validateForm"
          class="demo-form-inline styleObj"
        >
          <!-- :disabled="currentChuFangRow.orderStatus==2" -->
          <el-col :span="12" class="inputStyle">
            <lInputTable
              v-selectInner
              ref="lInput"
               v-axShotcut
              :popoverWidth="800"
              suffix-icon="el-icon-search"
              :tableData="selectOptions"
              @query="search"
              v-model="tdObjectClone.orderItemName"
              @select="select"
              :shotindex="shotcutIndexHandler(tdObjectClone, 'orderItemName')"
              :shotready="shotreadyHandler(tdObjectClone, 'orderItemName')"
              :tableLoading="inputTableLoading"
              :inputName="tdObjectClone.orderItemName"
              :tableParams="dropColumn"
              :placeholder="tdObjectClone.orderItemName"
              valueKey="orderItemName"
            >
              <!-- @clear="deleteTdData" -->
              <!-- :showClear="showClearBtn" -->
            </lInputTable>
          </el-col>
          <el-col :span="6" class="inputStyleNum" style="margin: 0px 5px">
            <el-form-item prop="qty" label="" :rules="qtyRules">
              <!-- <el-tooltip class="item" effect="dark" :content="tdObjectClone.qty" placement="top-start"> @keyup.enter.native="selectColum"  -->
              <!-- <el-col :span="12"> -->
              <!-- <el-input-number -->
            <div  :class="qtyCls(tdObjectClone.qty)">
              <lInputNumber
                v-selectInner
                 v-axShotcut
                :shotindex="shotcutIndexHandler(tdObjectClone, 'qty')"
                :shotready="shotreadyHandler(tdObjectClone, 'qty')"
                ref="qtyInput"
                :min="0"
                :max="9999"
                style="width: 100%"
                :controls="false"
                @input="computeAmt"
                @keydown.enter.native="addNewTr"
                v-model="tdObjectClone.qty"
                placeholder="数量"
              ></lInputNumber>
            </div>
              <!-- </el-col> -->
              <!-- <el-col :span="12" class="elCol2" v-if="tdObjectClone.unitKey">
                      <el-select v-model="tdObjectClone.unitKey" placeholder="g" @change="unitChange" :disabled="true">
                        <el-option v-for="item in tdObjectClone.unitOptions" :label="item.label" :key="item.value" :value="item.value"></el-option>
                      </el-select>
                 </el-col> -->
              <!-- </el-tooltip> -->
            </el-form-item>
          </el-col>
          <el-col
            :span="2"
            class="elCol2 innerCenter"
            v-if="tdObjectClone.unitKey"
          >
            <el-select
              v-model="tdObjectClone.unitKey"
              placeholder=""
              @change="unitChange"
              :disabled="true"
            >
              <el-option
                v-for="item in tdObjectClone.unitOptions"
                :label="item.label"
                :key="item.value"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="4" class="innerCenter">
            <!-- <el-form-item prop="useWay" label="" :rules="{ required: tdObjectClone.orderItemId? true : false, message: '煎服法', trigger: ['change','blur'] }">
                    <l-value-domain code="fryingRemark" @focus="fryingRemark" @keydown.tab.native="addNewTr" :value.sync="tdObjectClone.useWay" class="select-container"></l-value-domain>
                    <div class="el-icon-edit divEditStyle" v-if="divEditStyle" @click="divEditStyleFun"></div>
                  </el-form-item> -->
            <useWaySelect v-model="tdObjectClone.useWay"></useWaySelect>
          </el-col>
        </el-form>
      
        <div class="td-mask" v-if="herMaskShow"></div>
      </el-row>
      
    </div>
  </div>
</template>

<script>
  import lInput from "./Linput.vue";
  import {
    getAdviceItemList,
    drugItemListWithStorge
  } from '@/api/systemManagement/dataMaintain/adviceItem';
  import {
    deepClone
  } from "@/utils/index.js";
  import {
    totalNoOfJump,
    dropColumn,
    chmDrugsKey
  } from "./variable.js";
  import {
    getArrayList
  } from "@/api/wconf/wparam";
  import {
    deleteByIdWithVersion,single,validHerbalAdviceItem
  } from "@/api/cis/order/order";
import { amtCalculatFunc } from "@/components/adviceCommon/drugCalculatFunc.js";
import {
  setComponentFocusFunc,
  isOrderItemNameShotReady,
  setLInputTableShotReady,
  getUnitFlag
} from "@/components/adviceCommon/adviceUtils.js";
import useWaySelect from "./useWaySelect.vue";
import directives from "@/components/adviceCommon/adviceDirectives.js";
import { doctorPsReviewLimit } from "@/views/cis/prescriptionRecor/newPatientsManage/order/components/presModule/modules/adviceUtils.js";
import lInputNumber from "@/components/adviceCommon/lInputNumber.vue"

  export default {
    name: "lTd",
    directives:{
      ...directives
    },
    props: {
      herMaskShow: {
        type: [Boolean]
      },
      listIndex: {
        type: [String,Number]
      },
      currentChuFangRow: {
        type: Object,
        default: function() {
          return {
            orderStatus: ""
          };
        }
      },
      selectGroup: {
        type: Object,
        default: function() {
          return {};
        }
      },
      dosageValue: {
        type: String,
        default: function() {
          return "";
        }
      },
      noBorder: {
        default: false
      },
      lastOne: {
        default: false
      },
      // tdObject: {
      //   type: Object,
      //   default: function() {
      //     return {}
      //   }
      // }
      tdObjectClone: {
        type: Object,
        default: function() {
          return {}
        }
      },
    },
    components: {
      lInput,
      lInputNumber,
      useWaySelect
    },

    data() {
      var checkQty = (rule, value, callback) => {
        // debugger
        if(this.tdObjectClone.orderItemId){
          if (value === 0) {
            callback(new Error('数量不可为0!'));
          } else if (!value) {
            callback(new Error('数量不可为空!'));
          } else {
            callback();
          }
        } else {
          callback();
        }

      };
      return {
        //数量校验
        qtyRules: { validator: checkQty , trigger: ['blur','change'] },
        // divEditStyle
        // divEditStyle:true,
        drugItem: {},
        inputTableLoading: false, //下拉table组件 loading
        // tdObjectClone: {},
        input: '',
        value: '',
        selectOptions: [],
        dropColumn,
        // 分页数据
        currentPage: 1,
        pageSize: 10,
        total: 1,
        queryName: "",
        //  查询条件
        searchForm: {
          visitCode: "", //门诊处方患者列表 门诊号
          categoryCode: 2,
          inpCode: "",
          dateRange: [],
          patientId: "",
          wardId: "",
          bedNo: "",
          orderItemName: "", // 医嘱查询关键词
          status: "", //
          //    deptType: "1", //
          adviceType: "3",
          today: "",
          patientName: "",
          property: "",
          attribute: "",
        }
      };
    },

    methods: {
      // 累加的基数
      getBaseIndex (){
        return (this.listIndex + 10) * totalNoOfJump;
      },
      shotcutIndexHandler (row, name){
        // 表单的次序
        let index = Number(chmDrugsKey.indexOf(name));
        let baseIndex = this.getBaseIndex();
        return baseIndex + index;
      },
      shotreadyHandler (row, name){
        if (name === "orderItemName") {
          return isOrderItemNameShotReady(row);
        }
        return true;
      },
      //表单的error 信息
      showErrorMsg(errorObj) {
        let self = this;
        for (let key in errorObj) {
          setTimeout(function() {
            if (document.getElementsByClassName('el-message').length === 0) { //message 弹窗一次错误
              self.$message.error(errorObj[key][0]);
            }
          }, 0)
        }
      },
      validateTdForm() {
        return new Promise((resolve, reject) => {
          this.$refs["validateForm"].validate((valid, error) => {
            if (valid) {
              resolve(true);
            } else {
              this.showErrorMsg(error);
              reject(error);
              return false;
            }
          });
        });
      },
      clearValidate() {
        this.$nextTick(() => {
          this.$refs["validateForm"].clearValidate();
        });
      },
      unitChange(value) {
        // this.$set(this.tdObjectClone, 'unit', this.getLabel(this.tdObjectClone.unitOptions, value));
        // this.computeAmt();
        this.$emit("computeAmt");
      },
      qtyCls(value){
        let warnClsFlag = false;
        if (value !== '' && (value < 1 || value > 100) ){
          warnClsFlag = true;
        } else {
          warnClsFlag = false;
        }
        return {
          qtyCls: true,
          warnCls: warnClsFlag
        }
      },
      // 计算金额
      computeAmt() {
        this.$nextTick(() => {
          this.$emit("computeAmt");
          // let curObj = deepClone(this.tdObjectClone);
          // // let orderItem = { ...curObj, ...this.drugItem };
          // let unitKey = curObj.unitKey;
          // let qty =
          //   typeof curObj.qty != "undefined" ? curObj.qty : 0;

          // let price = typeof curObj.price != "undefined" ? curObj.price : 0;
          // let packQty = curObj.packQuantity ? curObj.packQuantity * 1 : 1;

          // let unitFlag = getUnitFlag(curObj.packUnit, unitKey);
          // let amt = amtCalculatFunc(qty, price, packQty, unitFlag, 4);
          // //单条医嘱明细四舍五入保留两位小数之后，再求和
          // // amt = amt ? amt.rewToFixed(2) : 0;
          // // console.log("packQty", packQty, "price", price);
          // this.$set(this.tdObjectClone, 'amt', amt);
          // this.$emit("computeAmt");
        })
      },
      getLabel(optList, key) {
        let obj = optList.find(item => {
          return item.value === key;
        });
        return obj.label;
      },
      addNewTr() {
        if (this.lastOne) {
          // setTimeout(()=>{
          this.$emit("addNewTr");
          // },0)
        }
      },
      clearSelectKeys() {
        return [
          'orderItemName',
          'code',
          'execDeptName',
          'execDeptCode',
          'manageType',
          'formCode',
          'amt',
          'classCode',
          'execDeptName',
          'orderCat',
          'orderItemCat',
          'orderName',
          'orderItemId',
          'reimburseMark',
          'reimburseName',
          'medicalInsuranceCat',
          'price',
          'packQuantity',
          'receiveDept',
          'unitSaleFlg',
          'unit',
          'packUnit',
          'unitKey',
          'orderId',
          'stType',
          'stSolutionType',
          'validTime',
          'positiveDispense',
          'applicationRange',
          'execDeptName',
          'spec',
          'dosage',
          'formCode',
          'stockNum',
          'stClassCode',
          'stType',
          'useWay', //煎服法
          'qty', //数量
          'id',
          'row_id',
          'patientId',
          "limitResultCode",
          "ChronicDisease",
          "ChronicDiseaseName"
        ]
      },

      async deleteTdData() {
        // debugger
        if (this.tdObjectClone.orderStatus === '4' || this.tdObjectClone.orderStatus === '2') {
          this.$message.warning("已收费和提交的医嘱不能删除！");
          return;
        }
        if (this.tdObjectClone.id) {
          try {
            await this.deleteConfirm("确认删除本条数据吗？");
            this.$set(this.tdObjectClone, 'deletedStatus', "");
            deleteByIdWithVersion(this.tdObjectClone)
              .then(res => {
                if (res.code === 1) {
                  // this.clearSelectKeysFunc();
                  this.$emit('deleteTdData', this.tdObjectClone);
                  this.$message({
                    type: "success",
                    message: "删除成功!"
                  });
                }
              })
              .catch(() => {
                this.$message({
                  type: "error",
                  message: "删除失败"
                });
              });
          } catch (e) {

          }
        } else {
          // this.clearSelectKeysFunc();
          this.$emit('deleteTdData', this.tdObjectClone);
        }

        this.clearValidate();
      },
      clearSelectKeysFunc() {
        let clearSelectKeys = this.clearSelectKeys();
        for (let i = 0; i < clearSelectKeys.length; i++) {
          if (clearSelectKeys[i] === "qty") {
            this.$set(this.tdObjectClone, clearSelectKeys[i], undefined);
          } else if (clearSelectKeys[i] === "orderItemName") {
            this.$set(this.tdObjectClone, clearSelectKeys[i], undefined);
          } else {
            this.$set(this.tdObjectClone, clearSelectKeys[i], "");
          }
        }
      },
      deleteConfirm(text) {
        return new Promise((resolve, reject) => {
          this.$confirm(text, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(async () => { //继续选中操作
            resolve(true);
          }).catch(() => { //取消操作
            reject(false);
          });
        })
      },
      async selectColum(row) {
          try{
            let res = await validHerbalAdviceItem(row);
            if(res.code == 1){
              return true;
            }else{
              return false;
            }
          }catch(e){
            return false;
          }
      },
      //库存校验
      async valiedStockNum(row){
        return new Promise(async (resolve, reject)=>{
          let params = {
            orderItemName: row.orderItemName,
            orderItemId: row.itemId
          }
          try{
            let { data, code, msg } = await validHerbalAdviceItem(params);
            if(code == 1){
              resolve(data);
              // return true;
            } else {
              this.$message.error(msg);
              reject(false);
            }
            
            // return false;
          }catch(e){
            this.$message.error(e.msg);
            // return false;
            reject(false);
          }
        });
      },

      async select(row) {
        this.resetInputTableParams();
        //校验重复录入
        let sameDrug = this.$parent.validateSameDrug(row);
        if (sameDrug) {
          this.$message.error("已有" + row.orderItemName + "，不应重复录入");
          // this.$refs.lInput.clearInputValue();
          this.clearCurrentDrugs();
          return;
        }

        //zhengyawen 无库存并且发药方式不等于配送，提示库存为0
        if(!row.stockNum && this.selectGroup.dispendingMethod != "2") {
          this.$message.error(row.orderItemName + "库存为0");
          // this.$refs.lInput.clearInputValue();
          this.clearCurrentDrugs();
          return;
        }

        //校验
        try {
          let isStockNum = await this.valiedStockNum(row);
          // 医生审核弹窗
          let { limitMsg, limitResultCode } = isStockNum;
          if (limitResultCode == 1) {// 弹窗
            try {
              let { confirmCode } = await doctorPsReviewLimit(limitMsg);
              if (confirmCode == 1) {
                //审批通过
                console.log("是 审批通过");
              } else if(confirmCode == 0) {
                // 否（自费使用）
                console.log("否 自费使用");
              }
              this.$set(row, "limitResultCode", confirmCode);
            } catch (error) {
              console.log("清空当前行");
              //清空当前行
              this.clearCurrentDrugs();
              return;
            } 
          } else {
            this.$set(row, "limitResultCode", null);
          }
        } catch (error) {
          this.clearCurrentDrugs();
          return;
        }
        

        await this.selectData(row);
      },
      clearCurrentDrugs (){
        this.clearSelectKeysFunc();
        this.$nextTick(()=>{
          //清空当前行
          this.$refs.lInput.clear();
        });
      },
      async selectData(row) {
        let {
          patientCode,
          patientId,
          visitCode,
          patientName
        } = this.$store.state.base.receivePatientData; //获取患者信息
        // this.$set(this.tdObjectClone, 'orderItemNameCopy', row.orderItemName);
        this.$set(this.tdObjectClone, 'patientName', patientName);
        this.$set(this.tdObjectClone, 'patientId', patientId);
        this.$set(this.tdObjectClone, 'visitCode', visitCode);
        this.$set(this.tdObjectClone, 'patientCode', patientCode);
        this.$set(this.tdObjectClone, 'orderItemName', row.orderItemName);
        this.$set(this.tdObjectClone, 'code', row.itemId);
        this.$set(this.tdObjectClone, 'execDeptName', row.execDeptName);
        this.$set(this.tdObjectClone, 'execDeptCode', row.execDeptCode);
        this.$set(this.tdObjectClone, 'manageType', row.manageType);
        this.$set(this.tdObjectClone, 'formCode', row.formCode);
        this.$set(this.tdObjectClone, 'amt', row.price);
        this.$set(this.tdObjectClone, 'classCode', row.classCode);
        this.$set(this.tdObjectClone, 'execDeptName', row.execDeptName);
        this.$set(this.tdObjectClone, 'orderCat', row.itemType);
        this.$set(this.tdObjectClone, 'orderItemCat', row.itemType);
        this.$set(this.tdObjectClone, 'orderName', row.orderItemName);
        this.$set(this.tdObjectClone, 'orderItemId', row.itemId);
        this.$set(this.tdObjectClone, 'reimburseMark', row.reimburseMark);
        this.$set(this.tdObjectClone, 'reimburseName', row.reimburseName);
        this.$set(this.tdObjectClone, 'medicalInsuranceCat', row.reimburseName);
        this.$set(this.tdObjectClone, 'price', row.price);
        this.$set(this.tdObjectClone, 'packQuantity', row.packQuantity);
        this.$set(this.tdObjectClone, 'receiveDept', row.execDeptCode);
        this.$set(this.tdObjectClone, 'unitSaleFlg', row.unitSaleFlg);
        //删除标识
        this.$set(this.tdObjectClone, 'delete_id', +new Date());

        // if (!row.row_id) {
        //   this.$set(this.tdObjectClone, 'dataVersion', row.dataVersion);
        // }

        this.$set(this.tdObjectClone, 'limitUnit', row.limitUnit);
        this.$set(this.tdObjectClone, 'packUnit', row.unit);
        this.$set(this.tdObjectClone, 'unitKey', row.limitUnit);
        this.$set(this.tdObjectClone, 'orderId', row.relateItemId);
        this.$set(this.tdObjectClone, 'stType', row.stType);
        this.$set(this.tdObjectClone, 'stSolutionType', row.stSolutionType);
        this.$set(this.tdObjectClone, 'validTime', row.validTime);
        this.$set(this.tdObjectClone, 'positiveDispense', row.positiveDispense);
        this.$set(this.tdObjectClone, 'applicationRange', row.applicationRange);
        this.$set(this.tdObjectClone, 'execDeptName', row.execDeptName);
        this.$set(this.tdObjectClone, 'spec', row.spec);
        this.$set(this.tdObjectClone, 'dosage', row.dosage);
        this.$set(this.tdObjectClone, 'formCode', row.formCode);
        this.$set(this.tdObjectClone, 'stockNum', row.stockNum);
        this.$set(this.tdObjectClone, 'stClassCode', row.stClassCode);
        this.$set(this.tdObjectClone, 'stType', row.stType);
        this.$set(this.tdObjectClone, 'limitResultCode', row.limitResultCode);

        // 单剂金额赋值
        this.$nextTick(() => {
          // let price =  row.price !== "" ? new Number(row.price) : 0;
          // document.getElementById("herRpSingleAmount").innerText = price.rewToFixed(4);
          this.$refs.qtyInput.focus();
        });

        setLInputTableShotReady(
          "on",
          this.tdObjectClone,
          this
        );

        await this.getQtyUnitAjax(row).then(res => {
          this.$set(this.tdObjectClone, 'unitOptions', res);
        });

        // for(let i=0;i<this.tdObjectClone.unitOptions.length;i++){
        //       if(this.tdObjectClone.unitOptions[i].value == row.limitUnit){
        //         this.$set(this.tdObjectClone, 'unitKey', this.tdObjectClone.unitOptions[i].label);
        //       }
        // }
      },

      // code 获取数量单位 中文
      async getQtyUnitAjax() {
        let data = this.tdObjectClone;
        // 获取单位数据
        let param = [];
        let shows = [];
        let unitOptions = [];
        shows.push(data.limitUnit);
        shows.push(data.packUnit);
        // 判断药品是否可拆零
        // if (
        //   data.unitSaleFlg === "1" ||
        //   (data.unitSaleFlg === undefined && data.unit)
        // ) {
        //   shows.push(data.unit);
        // }
        param.push({
          code: "DrugUnit",
          field: "code",
          shows: shows
        });

        return new Promise((resolve, reject) => {
          getArrayList(param).then(async (res) => { //继续选中操作
            if (res.code === 1) {
              for (let i = 0; i < res.data.DrugUnit.length; i++) {
                if (res.data.DrugUnit[i].name) {
                  unitOptions.push({
                    label: res.data.DrugUnit[i].name,
                    value: res.data.DrugUnit[i].code
                  });
                }
              }
              resolve(unitOptions);
            } else {
              this.$message.error(
                res.msg ? res.msg : "获取药品单位有误，请确认无误后再选择！"
              );
              resolve(false);
            }
          }).catch(() => {
            reject(false);
          });
        })
      },
      resetInputTableParams (){
        this.selectOptions = [];
        this.currentPage = 1;
        this.pageSize = 10;
        this.total = 1;
      },
      search(query, isPage) {
        setLInputTableShotReady(
          "off",
          this.tdObjectClone,
          this
        );
        // 清空当前选中的药品
        this.$set(this.tdObjectClone, 'orderItemName', query);
        this.$set(this.tdObjectClone, 'orderItemId', '');
        // this.$set(this.tdObjectClone, 'orderItemNameCopy', query);
        // this.tdObjectClone.orderItemNameCopy = query;
        let pageNo = 1;
        let tableData = [];
        if (isPage) {
            tableData = this.selectOptions;
            pageNo = Number(this.currentPage) + 1;
            if(Number(pageNo) > Number(this.total) / Number(this.pageSize)){
              return;
            }
        } else {
          tableData = [];
          pageNo = 1;
        }
        let data = {
          pageNo: pageNo,
          pageSize: this.pageSize,
          name: query,
          activeType: "11",
          execDept: this.selectGroup.takingRoom || "",
          classCode: this.dosageValue
        };
        this.inputTableLoading = true; //增加loading
        // eslint-disable-next-line complexity
        drugItemListWithStorge(data).then(res => {
          if (res.code === 1) {
            let {
              data
            } = res;
            // let tableData =
            //   this.currentPage !== 0 ? this.selectOptions : [];
            // let tableData = []; //取消药品分页
            for (let i = 0; i < data.length; i++) {
              const item = data[i];
              tableData.push({
                itemId: item.itemId || "",
                itemCode: item.itemCode || "",
                orderItemName: item.drugName || "",
                production: item.production || "",
                itemType: item.itemType || "",
                itemTypeName: item.itemType || "",
                execDeptCode: item.execDeptCode || "",
                execDeptName: item.execDeptName || "",
                spec: item.spec || "",
                price: new Number(item.price).rewToFixed(4) || "",
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
                stockNum: item.stockNum || 0,
                manageType: item.manageType || "",
                adviceType: item.adviceType || "",
                formCode: item.formCode || "",
                basicType: item.basicType || "",
                unitSaleFlg: item.unitSaleFlg || "",
                reimburseMark: item.reimburseMark || "",
                reimburseName: item.reimburseName || "",
                clinicMark: item.clinicMark || "", //成组样式
                medicareItemCode: item.medicareItemCode || "",
                classCode: item.classCode || "",
                medicareItemName: item.medicareItemName || ""
              });
            }
            this.selectOptions = tableData;
            this.currentPage = res.pageNo;
            this.pageSize = res.pageSize;
            this.total = res.total;
            this.queryName = query;
          } else {
            this.$message.error(res.msg ? res.msg : "获取数据失败");
          }
          this.inputTableLoading = false; //增加loading
        });
      }
    },
    watch: {
      // tdObject: {
      //   deep: true,
      //   handler  () {
      //     // console.log("watch执行次数", this.tdObject);
      //     // watch 执行次数很多 尽量不要写别的逻辑
      //     this.tdObjectClone = this.tdObject;
      //     // this.$set(this.tdObjectClone, "orderItemNameCopy", this.tdObjectClone.orderItemNameCopy || this.tdObjectClone.orderItemName);
      //     // this.clearValidate();
      //   }
      // }
    },
    computed: {
      tdCls() {
        return {
          tdCls: true,
          noBorder: this.noBorder
        }
      },
      showClearBtn() {
        return (!!this.tdObjectClone.id || !!this.tdObjectClone.patientId);
      }
    }
  }
</script>

<style scoped lang="scss">
.tdCls {
  position: relative;
  font-size: 0;
  padding: 3px 5px;
  .styleObj {
    display: flex;
    align-items: center;
    justify-content: left;
  }
  // border-right: 1px solid #ccc;
  .tdClsStylel {
    padding: 10px;
    background-color: #f5f7fa;
    border-radius: 8px;
    /deep/ .el-input__icon {
      display: none;
    }
    .elCol2 /deep/ .el-input__inner {
      border: none;
      text-align: center;
      padding: 0;
    }
    .elCol2 {
      // border: 1px solid #EBEEF5;
      /deep/ .el-input.is-disabled .el-input__inner {
        // background-color: #FFFFFF;
      }
    }
    .divEditStyle {
      position: absolute;
      top: 0px;
      left: 0px;
      width: 100%;
      height: 100%;
      background: #f5f7fa;
      line-height: 32px;
      text-align: center;
    }
  }
  .demo-form-inline {
    /deep/.el-form-item {
      margin-right: 0 !important;
      margin-bottom: 0 !important;
    }

    // .qtyCls {
      // /deep/.el-input__inner {
      //   //解决数量输入框太小的问题
      //   padding: 0px !important;
      // }
    // }

    .warnCls {
      /deep/.el-input__inner {
        //解决数量输入框太小的问题
        color: red !important;
      }
    }
  }
}

.noBorder {
  border-right: none !important;
}

.innerCenter {
  display: flex;
  justify-content: center;
  align-items: center;
}

.td-mask {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 99;
    background-color: #f5f7fa;
    opacity: 0.3;
    cursor: not-allowed;
}
</style>
