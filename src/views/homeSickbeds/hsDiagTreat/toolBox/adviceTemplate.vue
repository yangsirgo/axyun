/* eslint-disable complexity */
/* eslint-disable complexity */
/* eslint-disable complexity */
<template>
  <div class="temp">
    <div class="top-container">
      <el-radio-group v-model="cateogry" class="align-center" @change="typeChange">
        <el-radio :label="item.code" v-for="item in classification" :key="item.code">{{item.name}}</el-radio>
      </el-radio-group>
      <el-input placeholder="请输入检索条件" v-model="keyword" @change="keywordUpdate" style="margin-top:8px;">
        <el-button slot="append" icon="el-icon-search" @click="keywordUpdate"></el-button>
      </el-input>
    </div>
    <!-- <div class="content">
      <el-table
        ref="tableElem"
        :data="tableData"
        border
        tooltip-effect="dark"
        style="width: 100%;"
        height="100%"
        v-loadmore="loadNextPage"
        element-loading-text="加载中..."
      >
        <el-table-column prop="templName" label="模板名" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span
              class="act-word cursor-pointer"
              @click="showDetail(scope.row)"
            >{{ scope.row.templName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="templ_remark" label="备注" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.templ_remark }}</template>
        </el-table-column>
        <el-table-column label="操作" min-width="80" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span class="act-word cursor-pointer" @click="operation(row)">明细</span>
          </template>
        </el-table-column>
      </el-table>
    </div>-->
    <div class="content overflow-scroll-vertical" v-loading="contentLoading">
      <div class="list" v-infinite-scroll="loadNextPage" infinite-scroll-disabled="tlm_noMore">
        <el-collapse v-model="activeNames">
          <l-collapse-item sty="2" v-for="(item, index) in tableData" :key="'list' + index" :name="index">
            <template slot="title">
              <div class="width100" @click="openStyle(item.templetDetail,item.templetName)">
                <span class="templetName" :title="item.templetName">{{item.templetName}}</span>
                <!-- <div v-if="activeNames.indexOf(index) != -1" @click.stop="quoteFunc(item)" class="float-right quote-button mini-button"
                  type="primary">{{$t('base.quote')}}</div> -->
              </div>
            </template>
            <!-- <template slot="content">
              <el-table ref="tableElem" :data="item.templetDetail" border tooltip-effect="dark" style="width: 100%;">
                <el-table-column prop="itemName" :label="$t('base.toolBox.projectName')" min-width="102"
                  show-overflow-tooltip fixed></el-table-column>
                <el-table-column prop="spec" :label="$t('base.toolBox.spec')" min-width="102" v-if="!showOrderCat"></el-table-column>
                <el-table-column prop="itemCat" label="医嘱类型" min-width="102" v-if="showOrderCat">
                  <template slot-scope="scope">
                    <span columns="doctors_advice_name" :conditionMap="{doctors_advice_code: scope.row.itemCat}"
                      tableName="cnf_doctors_advice" v-tableTransform></span>
                  </template>
                </el-table-column> -->
                <!--<el-table-column label="操作" min-width="85">
                <template>
                  <span class="mini-button" @click="quote">{{$t('base.quote')}}</span>
                </template>
                </el-table-column>-->
              <!-- </el-table>
            </template> -->
          </l-collapse-item>
          <p v-if="tlm_isLoading" class="load-list-bottom">{{$t('base.loading')}}</p>
          <p v-if="!tlm_isLoading && tlm_noMore" class="load-list-bottom">{{$t('base.noMore')}}</p>
        </el-collapse>
      </div>
    </div>
    <el-dialog :title="templeteName" :visible.sync="dialogVisible" width="600px">
      <div style="padding:5px;">
        <el-table :data="templeteTableData" border>
          <el-table-column v-for="(item,index) in templeteTableParams" :key="index" :prop="item.prop" :label="item.label"
            :min-width="item.width"></el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="quoteFunc">引 用</el-button>
      </span>
    </el-dialog>

    <!-- 新的弹窗  start   -->
    <el-dialog
      :title="typeNameStyle"
      :visible.sync="dialogVisibleStyle"
      width="70%"
      :before-close="openStyleClose" append-to-body>
      <div v-if="dialogVisibleStyle"><dialogStyle ref="dialogStyle" :templetDetailporso="templetDetailporso"></dialogStyle></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="openStyleClose">取 消</el-button>
        <el-button :loading="quoteBtnLoading" type="primary" @click="openStyleSaveWrapper">引 用</el-button>
      </span>
    </el-dialog>

    <!-- 新的弹窗  end   -->


  </div>
</template>

<script>
  import {
    getByTypeAndName
  } from "@/api/cis/toolBox/toolBox";
  import dialogStyle from "./components/dialogStyle.vue";
  import {
    getRecipeCode,
    saveOrdersByTemp,
    cisTempSave,
    outpatientNonDrugPageList,
    getClassification
  } from "@/api/cis/order/order";
  import {
   templateRef
  } from '@/api/homeSickbeds/hsPatientManagement/hsPatientManagement';
  import {
    mapActions,
    mapGetters
  } from "vuex";
  import {
    deepClone,
    Throttle
  } from "@/utils/index.js";

  import { getWholeChmDataStructure, getDiagnose } from "@/views/homeSickbeds/hsDiagTreat/chmTreat/components/utils.js"

  import {
    saveChmTepOrder
  } from "@/api/homeSickbeds/hsDiagTreat/hsChmRecipe.js";
  import { showTipAlert } from "@/views/homeSickbeds/hsDiagTreat/order/module/adviceUtil/util.js";
  import { alertFunc } from "@/views/homeSickbeds/hsDiagTreat/chmTreat/components/utils.js";

  export default {
    name: "prescriptionTemp",
    components:{
      dialogStyle
    },
    data() {
      return {
        contentLoading: false,
        quoteBtnLoading: false,
        templetDetailporso:[],
        dialogVisibleStyle:false,
        showOrderCat: false,
        // 检索关键词
        keyword: "",
        // 类型值
        cateogry: "2",

        // 列表数据
        tableData: [],
        // 分页控制参数
        pageParams: {
          pageNo: 1, // 当前页数
          total: 5, // 总共页数
          pageSize: 20 // 每页数据条数
        },
        // table 分页加载必须定义字段
        tlm_isLoading: false,
        // 模板数据
        templeteName: "",
        templeteTableData: [{
          name: "阿莫西林胶囊",
          spec: "一盒24粒",
          formCode: "5",
          drugUnit: "g"
        }],
        // 表格数据
        templeteTableParams: [{
            prop: "ITEM_NAME",
            label: "名称",
            width: "100"
          },
          {
            prop: "SPEC",
            label: "规格",
            width: "100"
          },
          {
            prop: "FORM_CODE",
            label: "剂量",
            width: "50"
          },
          {
            prop: "UNIT",
            label: "剂量单位",
            width: "50"
          }
        ],
        dialogVisible: false,
        activeNames: [],
        classification: [],
        templateRefData:{
          treatId : "",
          type :"1",
          list:[],
          pharmacyId:'',
        },
        typeNameStyle:'',
      };
    },
    computed: {
      ...mapGetters("cis", ["leaveAppLoadKey"]),
      ...mapGetters("homeSickbeds", ["receivePatientData", "currentTabsWrapper", "chmCurrentRow"]),
      ...mapGetters("homeSickbeds", ["treatId"]),
      ...mapGetters("adviceCommon", [ "westPharmacyObject"]),
      ...mapGetters("adviceCommon", [ "chmPharmacyObject"]),
      tlm_noMore() {
        return (
          Math.ceil(this.pageParams.total / this.pageParams.pageSize) <=
          this.pageParams.pageNo
        );
      }
    },
    mounted() {
      this.loadTable();
      this.getClassificationAjax();
    },
    methods: {
      ...mapActions({
        setLeaveAppLoadKey: "cis/changeAdditionalOrderLoadKey",
        changeTemplateQuoteKey: "cis/changeTemplateQuoteKey",
        changeChmMedicineQuote: "cis/changeChmMedicineQuote"
      }),

      //打开弹窗  start
      async openStyle(item,a){
        let { id } = this.receivePatientData;
        // let { id } = this.chmCurrentRow;
        if(id == '' || typeof id == "undefined"){
          this.$message.warning("请选择患者");
          return false;
        }

        //校验中医诊断
        switch (this.currentTabsWrapper) {
          case "chmMedicine":
            this.contentLoading = true;
            try {
              let result = await getDiagnose({
                inpCode: this.receivePatientData.treatNo,
                // diagType: 3,
                cwFlag: 2
              });
              this.contentLoading = false;
            } catch (error) {
              this.contentLoading = false;
              return false;
            }
            break;
        }

        this.dialogVisibleStyle = true;
       this.templetDetailporso = item;
       this.typeNameStyle = a;
       console.log(item);
      },
      openStyleSaveWrapper: Throttle(function () {
          this.templateRefData.list = this.$refs.dialogStyle.treatIdList;

          if(this.templateRefData.treatId == ''){
            this.$message.warning("请选择患者");
            return false;
          }
          if(this.templateRefData.list.length == '0'){
            this.$message.warning("请选择至少一条模板");
            return false;
          }

          switch (this.currentTabsWrapper) {
            case "chmMedicine":
              this.openStyleSaveChm();
              break;
            default :
              this.openStyleSave();
              break;
          }
          return null;
      }, 1000),
      // eslint-disable-next-line consistent-return
      async openStyleSaveChm (){


        // if(typeof this.chmCurrentRow.row_id != "undefined" && typeof this.chmCurrentRow.id == "undefined"){
        //   try {
        //     await alertFunc("引用会删除当前有正在编辑的医嘱，是否继续？");
        //   } catch (error) {
        //      this.$message.info("取消引用");
        //     return false;
        //   }
        // }

        if ( this.quoteBtnLoading ) {return false;}

        let ajaxData = {};
        let templateDetailIds = this.$refs.dialogStyle.treatIdList;
          if (Object.keys(this.chmCurrentRow).length == 0) {
            ajaxData = getWholeChmDataStructure("", 0, []);
            ajaxData.treatId = this.templateRefData.treatId;
          } else {
            if (this.chmCurrentRow.status != "0" && this.chmCurrentRow.status != "1" ){
                this.$message.warning("只有暂存和新增的医嘱可以引用医嘱！");
                return false;
            }
            ajaxData = {
              ...deepClone(this.chmCurrentRow)
            };

          }
          ajaxData.templateDetailIds = templateDetailIds;
          ajaxData.pharmacyId = this.chmPharmacyObject.selected.deptId;
          console.log("ajaxData", ajaxData);
        try {
          this.quoteBtnLoading = true;
          let { code, msg, data, tips } = await saveChmTepOrder(ajaxData);
          if (code == 1) {
            this.$message.success("模板引用成功！");


            this.dialogVisibleStyle = false;
                          console.log("data", data);
            try {
              await showTipAlert(tips);
            // eslint-disable-next-line no-empty
            } catch (error) {

            }

            this.changeChmMedicineQuote(data);
          } else {
            this.$message.error(msg || "模板引用失败！");
          }
          this.quoteBtnLoading = false;

        } catch (error) {
          this.quoteBtnLoading = false;
          this.$message.error("模板引用失败！")
        }
      },
     async openStyleSave(){
        // this.templateRefData.treatId = this.receivePatientData.treatId;
        this.templateRefData.list = this.$refs.dialogStyle.treatIdList;

        // if(this.templateRefData.treatId == ''){
        //   this.$message.error("请选择患者");
        //   return false;
        // }
        // if(this.templateRefData.list.length == '0'){
        //   this.$message.error("请选择至少一条模板");
        //   return false;
        // }


        // 引用到医嘱列表中
        let reps = await templateRef(this.templateRefData);
        if (reps.code === 1) {
          this.dialogVisibleStyle = false;
          this.$message.success(reps.msg ? reps.msg : "医嘱模板引用成功");
          console.log("=========引用成功后=========出发emit事件回调参数message");
          let strList = reps.tips;
          if(null == strList || strList.length <= 0){
          }else{
            let str ='';
            for(let i=0;i<strList.length;i++){
                 str +='<span>'+strList[i]+'</span></br>'
            }
            this.$alert(str, '提示', { dangerouslyUseHTMLString: true});
          }
        } else {
          this.$message.error(reps.msg ? reps.msg : "医嘱模板引用失败");
        }
        this.$emit("message");
      },
      openStyleClose(){
        this.dialogVisibleStyle = false;
      },

      // 打开弹窗  end
      quoteFunc: Throttle(function(item) {
          this.quote(item);
      }, 1000),

      //获取当前患者医嘱列表
      async getTreatMedicine() {
        return new Promise(async (resolve, reject) => {
          let visitCode =
            typeof this.receivePatientData["visitCode"] !== "undefined" ?
            this.receivePatientData["visitCode"] :
            "all"; //获取患者就诊ID
          let ajaxData = {
            ...{
              pageNo: 1,
              pageSize: 99999,
              visitCode: visitCode,
              types: "2", //医嘱类别   如果有多个类别，用“,”拼接。
              itemType: 2
            }
          };
          try {
            let result = await outpatientNonDrugPageList(ajaxData, true);
            if (result.code === 1) {
              let {
                data
              } = result;
              resolve(data);
            } else {
              reject(result.msg || "治疗医嘱列表获取失败");
            }
          } catch (error) {
            reject("治疗医嘱列表获取失败");
          }
        });
      },

      checkDupFunc(val, dataList) {
        // 判断是否添加相同医嘱
        let haveDup = dataList.find(item => item.orderItemId === val.itemId);
        return new Promise((resolve, reject) => {
          if (haveDup) {
            this.$confirm("已有相同医嘱, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              })
              .then(() => {
                resolve(true);
              })
              .catch(() => {
                reject(false);
              });
          } else {
            resolve(true);
          }
        });
      },

      getClassificationAjax() {
        getClassification().then(data => {
          if (data.code === 1) {
            this.classification = data.data;
          }
        });
      },
      // table加载下一页
      loadNextPage() {
        if (this.tlm_noMore) {
          return;
        }

        this.pageParams.pageNo++;
        this.loadTable();
      },
      // 加载table数据
      async loadTable() {
        try {
          this.tlm_isLoading = true;
          let params = {
            type: this.cateogry,
            name: this.keyword,
            pageNum: this.pageParams.pageNo,
            pageSize: this.pageParams.pageSize
          };
          switch (this.currentTabsWrapper) {
            case "chmMedicine":
              params.itemCat = 9998;
              this.showOrderCat = false;
              break;
            default :
              params.itemCat = 9999;
              this.showOrderCat = false;
              break;
          }
          let response = await getByTypeAndName(params);
          if (response.pageNo === 1) {
            this.tableData = response.data;
          } else {
            this.tableData = this.tableData.concat(response.data);
          }
          this.pageParams = { ...response.pageParams
          };
          this.tlm_isLoading = false;
        } catch (error) {
          this.tlm_isLoading = false;
          this.$message.error(error.msg);
        }
      },
      // 搜索关键词
      keywordUpdate() {
        console.log("keywordUpdate", this.keyword);
        this.loadTable();
      },
      // 分类切换
      typeChange() {
        this.pageParams = {
          pageNo: 1, // 当前页数
          total: 5, // 总共页数
          pageSize: 20 // 每页数据条数
        };
        this.activeNames = [];
        this.loadTable();
      },
      // 显示诊断详情
      showDetail(data) {
        this.templeteName = "";
        this.dialogVisible = true;
        this.templeteTableData = data.templetDetail;
      },
      // 引用
      async quote(item) {
        // 获取引用历次处方
        let result = [];
        let patient = this.receivePatientData;
        let rpData = this.$store.state.cis.RpTableData;
        let detailData = [];
        if (
          typeof patient === "undefined" ||
          typeof patient.visitCode === "undefined" ||
          patient.visitCode === ""
        ) {
          this.$message.warning("请选择患者后才能引用医嘱模板！");
          return false;
        }

        // 获取处方号
        let rep = await getRecipeCode({
          visitCode: patient.visitCode
        });
        // console.info(rep);
        // 处方号
        let rpNo = "";
        if (rep.code === 1) {
          rpNo = rep.data;
          for (let i = 0; i < item.templetDetail.length; i++) {
            let data = item.templetDetail;
            if (data[i].itemId === null || data[i].itemId === "") {
              this.$message.error("处方模板有误！引用失败");
              return false;
            }
            detailData.push({
              recipeCode: rpNo,
              patientId: patient.patientId,
              patientName: patient.patientName,
              visitCode: patient.visitCode,
              diagnosisTime: data[i].diagnosisTime || "",
              useWay: data[i].useWay || "", //用法
              quantity: data[i].quantity || "", //数量
              frequencyCode: data[i].frequencyCode || "", //频率
              frequencyTimes: data[i].frequencyTimes || "",
              frequencyUnit: data[i].frequencyUmit || "",
              onceDosage: data[i].oneDosage || "", //单次计量
              skinTest: data[i].skinTest || "", //皮试
              stSolutionType: data[i].stSolutionType || "", //皮试
              dropRate: data[i].dropRate || "", //滴速
              administrationTimeCode: data[i].administrationTimeCode || "", // 给药时间
              orderItemName: data[i].itemName || "",
              spec: data[i].spec || "",
              orderCat: data[i].itemCat,
              price: data[i].price,
              dosage: data[i].dosage,
              packQuantity: data[i].packQuantity,
              dosageUnit: data[i].dosageUnit,
              orderItemId: data[i].itemId,
              orderItemCat: data[i].itemCat,
              classCode: data[i].classCode,
              receiveDept: data[i].executeDepartmentId,
              manageType: data[i].manageType,
              formCode: data[i].formCode,
              unitSaleFlg: data[i].unitSaleFlg,
              unit: data[i].unit,
              packUnit: data[i].packageUnit,
              unitFlag: data[i].unitFlag,
              stClassCode: data[i].stClassCode || "",
              amt: data[i].amt,
              day: data[i].day || "",
              useDay: data[i].useDay || "",
              isMajor: data[i].isMajor,
              groupNo: data[i].groupNo || "",
              remark: data[i].remark || "",
              excessReason: data[i].excessReason || "",
              execDeptId: data[i].executeDepartmentId,
              execDeptName: data[i].executeDepartmentName
            });
          }
        } else {
          this.$message.error(rep.msg || " 获取处方号失败！");
          return false;
        }

        // 引用到医嘱列表中
        let reps = await saveOrdersByTemp(detailData);
        if (reps.code === 1) {
          /* // 更新医嘱列表
          for (let i = 0; i < detailData.length; i++) {
            // 直接赋值处方号，可解决异步为获取处方号bug
            detailData[i].recipeCode = rpNo;
            rpData.push(detailData[i]);
          }*/
          // console.info("================rpData",rpData);
          // this.$store.state.cis.RpTableData = rpData;
          this.dialogVisible = false;
          this.$message.success(reps.msg ? reps.msg : "医嘱模板引用成功");
          this.$emit("message");
          // save btn 存储 数据
          this.$emit("save");
        } else {
          this.$message.error(reps.msg ? reps.msg : "医嘱模板引用失败");
        }
      }
    },
    watch: {
      currentTabsWrapper() {
        this.pageParams.pageNo = 1;
        this.loadTable();
      },
      leaveAppLoadKey(n) {
        if (String(n).indexOf("CHANGEFORM") > -1) {
          let formObj = {};
          let urlString = n.substring(n.indexOf("?") + 1);
          let urlArray = urlString.split("&");
          for (let i = 0, len = urlArray.length; i < len; i++) {
            let urlItem = urlArray[i];
            let item = urlItem.split("=");
            if (item[0] === "radio") {
              this.cateogry = item[1];
            }
          }
        }
        this.loadTable();
      },
      receivePatientData:{
        immediate: true,
        deep: true,
        handler(a) {
         console.log(this.receivePatientData,"=-=0===0000000000000000000000");
         this.templateRefData.treatId = this.receivePatientData.id ? this.receivePatientData.id : '';
         this.templateRefData.type = this.treatId.treatId ? this.treatId.treatId:"1";
         this.loadTable();
        }
      },
      treatId:{
          immediate: true,
          deep: true,
          handler(a) {
          this.templateRefData.type = this.treatId.treatId ? this.treatId.treatId:"1";
          console.log(this.treatId);
          }
      },
      westPharmacyObject:{
        immediate: true,
        deep: true,
        handler(a) {
            console.log(this.westPharmacyObject.selected.deptId,"你好");
            this.templateRefData.pharmacyId = this.westPharmacyObject.selected.deptId;
        }
      }
    }
  };


</script>
<style lang='scss' scoped>
  .temp {
    // width: 298px;
    // height: 500px;
    width: 100%;
    height: 100%;
    background-color: #fff;

    .top-container {
      height: 80px;
      padding: 10px 0;
      // text-align: center;
    }
   /deep/ .el-collapse-item__arrow{
      display: none;
    }
    .content {
      width: 100%;
      height: calc(100% - 80px);

      .templetName {
        max-width: 126px;
        height: 40px;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: bottom;
      }
    }

    .act-word {
      color: $l-color-fontcolor-2;
    }

    .quote-button {
      margin-top: 8px;
    }
  }
</style>
