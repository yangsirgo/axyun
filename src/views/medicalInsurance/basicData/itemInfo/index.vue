<template>
  <div class="width100 height100">
    <flow-menu>
      <slot name="content">
        <div class="main">
          <el-tabs
            style="margin-bottom: 16px"
            v-model="activeName"
            @tab-click="handleClick"
          >
            <el-tab-pane
              v-for="(item, index) in projectList"
              :key="index"
              :label="item.name"
              :name="item.code"
            ></el-tab-pane>
          </el-tabs>
          <div class="search">
            <el-row :gutter="10">
              <el-col :span="4">
                <l-formt-title label="医保类别">
                  <l-value-domain
                    :value.sync="searchParams.medicareType"
                    remoteUrl="/finance-si/dict/getDictListBySiDictCatalogId?medicareType=0000&siDictCatalogCode=0000"
                    remoteShowKey="dictName"
                    remoteValueKey="dictCode"
                    placeholder="请选择医保类别"
                  ></l-value-domain>
                </l-formt-title>
              </el-col>
              <!-- <el-col :span="4">
                <l-formt-title label="项目类型">
                  <el-select v-model="searchParams.itemType" placeholder="请选择">
                    <el-option
                      v-for="item in projectList"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </l-formt-title>
              </el-col> -->
              <el-col :span="4">
                <l-formt-title label="社保目录编码">
                  <el-input
                    v-model="searchParams.itemCode"
                    placeholder="请输入内容"
                  ></el-input>
                </l-formt-title>
              </el-col>
              <el-col :span="4">
                <l-formt-title label="社保目录名称">
                  <el-input
                    v-model="searchParams.itemName"
                    placeholder="请输入内容"
                  ></el-input>
                </l-formt-title>
              </el-col>
              <el-col :span="12" class="align-right">
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="primary" plain @click="reset">重置</el-button>
              </el-col>
            </el-row>
          </div>
          <div class="table">
            <el-table
              ref="rightTable"
              :data="tableData"
              v-loading="loading"
              border
              stripe
              width="100%"
              height="100%"
              highlight-current-row
            >
              <el-table-column
                v-for="(item, index) in tableHeaderRight"
                :key="index"
                :prop="item.prop"
                :label="item.label"
                header-align="center"
                :align="item.align || 'left'"
                :width="item.width || item.label.length * 20 + 20"
                :fixed="item.fixed"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <template v-if="item.prop === 'medicareType'">
                    <span> {{ medicareTypeList[scope.row[item.prop]] }}</span>
                  </template>
                  <template v-else-if="item.prop === 'aka111'">
                    <span> {{ typeCodeList[scope.row[item.prop]] }}</span>
                  </template>
                  <template v-else-if="item.prop === 'aka070'">
                    <span> {{ dosageTypeList[scope.row[item.prop]] }}</span>
                  </template>
                  <template v-else-if="item.prop === 'ake003'">
                    <span> {{ controlItemsLists[scope.row[item.prop]] }}</span>
                  </template>
                  <template v-else-if="item.prop === 'aka031'">
                    <span> {{ drugTypeList[scope.row[item.prop]] }}</span>
                  </template>
                  <template v-else-if="item.prop === 'aka065'">
                    <span>
                      {{ chargeItemLevelList[scope.row[item.prop]] }}</span
                    >
                  </template>
                  <template v-else-if="item.prop === 'ake004'">
                    <span> {{ orginType[scope.row[item.prop]] }}</span>
                  </template>
                  <!--  -->
                  <template v-else-if="item.prop === 'bkm100'">
                    <span> {{ bkm100[scope.row[item.prop]] }}</span>
                  </template>
                  <template v-else-if="item.prop === 'bkm101'">
                    <span> {{ bkm101[scope.row[item.prop]] }}</span>
                  </template>
                  <template v-else-if="item.prop === 'bkm102'">
                    <span> {{ bkm102[scope.row[item.prop]] }}</span>
                  </template>
                  <template v-else-if="item.prop === 'ckm107'">
                    <span> {{ ckm107[scope.row[item.prop]] }}</span>
                  </template>
                  <template v-else-if="item.prop === 'bkm032'">
                    <span> {{ bkm032[scope.row[item.prop]] }}</span>
                  </template>
                  <template v-else-if="item.prop === 'ckm102'">
                    <span> {{ ckm102[scope.row[item.prop]] }}</span>
                  </template>
                  <template v-else-if="item.prop === 'bkm031'">
                    <span> {{ bkm031[scope.row[item.prop]] }}</span>
                  </template>
                  <!--  -->
                  <template
                    v-else-if="
                      item.prop == 'cka321' ||
                      item.prop == 'bkm054' ||
                      item.prop == 'aka064' ||
                      item.prop == 'aka022' ||
                      item.prop == 'bkm035' ||
                      item.prop == 'bkm038' ||
                      item.prop == 'bkm041' ||
                      item.prop == 'bkm044' ||
                      item.prop == 'bkm047' ||
                      item.prop == 'ama011' ||
                      item.prop == 'ala011' ||
                      item.prop == 'bla052' ||
                      item.prop == 'ckm104' ||
                      item.prop == 'ckm105' ||
                      item.prop == 'ckm106' ||
                      item.prop == 'ckm113' ||
                      item.prop == 'bla056' ||
                      item.prop == 'aka036'
                    "
                  >
                    <span>{{ scope.row[item.prop]==1?'是':'否' }}</span>
                  </template>
                  <template
                    v-else-if="
                      item.prop === 'bkm082' ||
                      item.prop === 'bkm083' ||
                      item.prop === 'bkm080' ||
                      item.prop === 'bkm081' ||
                      item.prop === 'bkm090' ||
                      item.prop === 'bkm095' ||
                      item.prop === 'aka068' ||
                      item.prop === 'cka320' ||
                      item.prop === 'bkm059' ||
                      item.prop === 'bkm097' ||
                      item.prop === 'bkm098' ||
                      item.prop === 'bkm099' ||
                      item.prop === 'bkm056' ||
                      item.prop === 'bkm057' ||
                      item.prop === 'bkm058' ||
                      item.prop === 'bkm096' ||
                      item.prop === 'bkm092' ||
                      item.prop === 'bkm093' ||
                      item.prop === 'bkm094' ||
                      item.prop === 'bkm091' ||
                      item.prop === 'bkm091' ||
                      item.prop === 'bkm016' ||
                      item.prop === 'bkm055' ||
                      item.prop === 'bkm014' ||
                      item.prop === 'bkm015'
                    "
                  >
                    <span>{{ formatNumber(scope.row[item.prop]) }}</span>
                  </template>
                  <span v-else>{{ scope.row[item.prop] }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="page align-right">
            <el-pagination
              background
              @size-change="changeSize"
              @current-change="changePage"
              :current-page="pageParams.pageNo"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="pageParams.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pageParams.total"
            ></el-pagination>
          </div>
        </div>
      </slot>
    </flow-menu>
  </div>
</template>

<script>
import FlowMenu from "@/components/FlowMenu";
import {
  getPageItemList,
  getPagemd,
  getChargeItemLevel,
  getDosageType,
  getDrugType,
  getTypeCode,
  getPageHosChargeList,
  getMatchItem,
  getPageItemMatchDTOList,
  cancelMatchById,
} from "@/api/medicalInsurance/index.js";
export default {
  name: "drugCatalog",
  components: {
    FlowMenu,
  },
  data() {
    return {
      bkm100: {
        10: "限二级及以上",
        11: "限三级",
      },
      bkm101: {
        10: "限综合医院",
        11: "限专科医院",
      },
      bkm102: {
        10: "限肿瘤",
        11: "限精神病",
      },
      ckm107: {
        1: "不限制",
        2: "限门诊",
        3: "限住院",
      },
      bkm032: {
        "01": "基本记帐",
        "02": "地补记帐",
        "03": "重疾记账",
        '99': "自费",
      },
      ckm102: {
        1: "国家",
        2: "广东省",
        3: "深圳市",
      },
      bkm031: {
        1: "综合医疗服务",
        2: "医技诊疗",
        3: "临床诊疗及手术项目类",
        4: "中医及民族医诊疗",
        9: "其它",
      },
      drugTypeList: {},
      activeName: "1",
      typeCodeList: {},
      dosageTypeList: {},
      controlItemsLists: {},
      chargeItemLevelList: {},
      // 查询条件
      searchParams: {
        medicareType: "",
        itemType: "1",
        itemCode: "",
        itemName: "",
      },
      isTrue: {
        0: "否",
        1: "是",
      },
      isUpload: {
        0: "未上传",
        1: "已上传",
        "": "未上传",
      },
      orginType: {
        1: "国内",
        2: "国外",
      },
      // 医保中心下拉
      careCenterList: [],
      // 项目类型下拉
      projectList: [
        {
          code: "1",
          name: "药品项目",
        },
        {
          code: "2",
          name: "诊疗项目",
        },
        {
          code: "3",
          name: "材料项目",
        },
      ],
      // 分页
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
      },
      // 表格加载loading
      loading: false,
      // 表头
      tableHeaderRight: [
        {
          prop: "medicareType",
          label: "医保类别",
          align: "left",
          headerAlign: "center",
          width: "120",
          fixed: "left",
        },
        {
          prop: "itemType",
          label: "项目类型",
          align: "left",
          headerAlign: "center",
          width: "120",
          fixed: "left",
        },
        {
          prop: "itemCode",
          label: "项目编码",
          align: "left",
          headerAlign: "center",
          width: "120",
          fixed: "left",
        },
        {
          prop: "itemName",
          label: "项目名称",
          align: "left",
          headerAlign: "center",
          width: "120",
          fixed: "left",
        },
        {
          prop: "itemGeneralName",
          label: "项目通用名称",
          align: "left",
          headerAlign: "center",
          width: "120",
          fixed: "left",
        },
        {
          prop: "itemStandardName",
          label: "项目商品名称",
          align: "left",
          headerAlign: "center",
          width: "120",
          fixed: "left",
        },
        {
          prop: "itemStandardPrice",
          label: "项目商品价格",
          align: "left",
          headerAlign: "center",
          width: "120",
          fixed: "left",
        },
        {
          prop: "itemEnName",
          label: "项目英文名称",
        },
        {
          prop: "pyCode",
          label: "拼音码",
        },
        {
          prop: "wbCode",
          label: "五笔码",
        },
        {
          prop: "feeType",
          label: "收费类别",
        },
        {
          prop: "itemLevel",
          label: "项目等级",
        },
        {
          prop: "rxFlag",
          label: "处方药标志",
        },
        {
          prop: "dosageType",
          label: "剂型",
        },
        {
          prop: "dosage",
          label: "剂量",
        },
        {
          prop: "dosageUnit",
          label: "剂量单位",
        },
        {
          prop: "oneUseLevel",
          label: "每次用量",
        },
        {
          prop: "frequency",
          label: "使用频率",
        },
        {
          prop: "unit",
          label: "单位",
        },
        {
          prop: "spec",
          label: "规格",
        },
        {
          prop: "useWay",
          label: "用法",
        },
        {
          prop: "limitDays",
          label: "限定天数",
        },
        {
          prop: "limitComment",
          label: "限制说明",
        },
        {
          prop: "beginDate",
          label: "开始时间",
        },
        {
          prop: "endDate",
          label: "终止时间",
        },
        {
          prop: "recordStatus",
          label: "有效标识",
        },
        {
          prop: "remark",
          label: "备注",
        },
        {
          prop: "siUpdateDate",
          label: "医保更新时间",
        },
        {
          prop: "childUseFlag",
          label: "少儿使用标志",
        },
        {
          prop: "maxPrice",
          label: "最高跟价",
        },
        {
          prop: "selfPayRate",
          label: "自付比例",
        },
        {
          prop: "employeeInjuryItemLevel",
          label: "工伤项目等级",
          width: 120,
        },
        {
          prop: "maternityItemLevel",
          label: "生育项目等级",
          width: 120,
        },
        {
          prop: "onlyAccountUseFlag",
          label: "只账户使用标志",
          width: 130,
        },
        {
          prop: "withinBigDiseaseExpense",
          label: "是否进入大病补充报销",
        },

        {
          prop: "factory",
          label: "厂家",
        },
        {
          prop: "nds",
          label: "国药标准",
        },
        {
          prop: "siDeleteFlag",
          label: "删除标志",
        },
        {
          prop: "approvalFlag",
          label: "是否需要审批标志",
        },
        {
          prop: "secondReimburese",
          label: "是否二次报销",
          width: 120,
        },
        {
          prop: "partSelfPayAccessOverallFlag",
          label: "自理部分进入统筹标志",
        },
        {
          prop: "partSelfPayAccessAssistMedicareFlag",
          label: "自理部分进入救助医疗标志",
        },
        {
          prop: "specialExamProduceFlag",
          label: "特检特制标志",
        },
        {
          prop: "retireSecondClassMaxPrice",
          label: "离休二乙最高价格",
        },
        {
          prop: "prePayLimiePrice",
          label: "先付限价",
        },
        {
          prop: "domesticLimitPrice",
          label: "国产限价",
        },
        {
          prop: "outPatientSelfPayRate",
          label: "门诊自付比例",
        },
        {
          prop: "inPatientSelfPayRate",
          label: "住院自付比例",
        },
        {
          prop: "retireSelfPayRate",
          label: "离休自付比例",
        },
        {
          prop: "employeeInjurySelfPayRate",
          label: "工伤自付比例",
        },
        {
          prop: "maternitySelfPayRate",
          label: "生育自付比例",
        },
        {
          prop: "secondClassSelfPayRate",
          label: "二乙自付比例",
        },
        {
          prop: "companySelfPayRate",
          label: "单位自付比例",
        },
        {
          prop: "familyMemberSelfPayRate",
          label: "家属子女自付比例",
        },
        {
          prop: "importDifferencyPriceSelfPayRate",
          label: "进口差价自付比例",
        },
        {
          prop: "hosAssistFlag",
          label: "医院绑定标志",
        },
        {
          prop: "hosNo",
          label: "定点医疗机构编号",
        },
        {
          prop: "customCode",
          label: "自定义码",
        },
        {
          prop: "operator",
          label: "经办人",
        },
        {
          prop: "operatorDate",
          label: "经办日期",
        },
        {
          prop: "limitRange",
          label: "限制使用范围",
        },
        {
          prop: "stateDrugCatalogFlag",
          label: "国家基本药品目录标志",
        },
        {
          prop: "sdcPrimaryHosUseFlag",
          label: "国家基本药品目录集成卫生医疗机构用药标志",
        },
        {
          prop: "residentUserFlag",
          label: "居民使用标志",
        },
        {
          prop: "hosPreparationFlag",
          label: "院内制剂标志",
        },
        {
          prop: "minHosLevel",
          label: "最小医院等级",
        },
        {
          prop: "minDoctorLevel",
          label: "最小医师等级",
        },
        {
          prop: "bidItemName",
          label: "招标商品名",
        },
        {
          prop: "bidDosageType",
          label: "招标剂型",
        },
        {
          prop: "bidDurgFlag",
          label: "招标药品标志",
        },
        {
          prop: "bidPrice",
          label: "招标价格",
        },
        {
          prop: "supplyPrice",
          label: "供应价",
        },
        {
          prop: "retailPrice",
          label: "零售价",
        },
        {
          prop: "specialDrugFlag",
          label: "特药标志",
        },
        {
          prop: "nationCode",
          label: "国家目录编码",
        },
        {
          prop: "origionType",
          label: "产地属性",
        },
        {
          prop: "medicineInstituteApprovalNo",
          label: "药检部门批文号",
        },
        {
          prop: "priceApprovalNo",
          label: "物价批文号",
        },
        {
          prop: "packageMaterial",
          label: "包装材质",
        },
        {
          prop: "classCode",
          label: "分类编码",
        },
        {
          prop: "supplier",
          label: "供应商",
        },
      ],
      // 表格数据
      tableData: [],
      medicareTypeList: {},
    };
  },
  created() {
    this.getMedicareType();
    this.getTypeCode();
    this.getDrugType();
    this.getChargeItemLevel();
    this.getDosageType();
    this.getControlItemsList();
    this.changeTableHeaderRight();
  },
  methods: {
    // 千位分隔
    formatNumber(a, b) {
      if (!a) {
        return "0.00";
      }
      if (!b) {
        b = 2;
      }
      let res = a
        .toFixed(b)
        .toString()
        .replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
          return $1 + ",";
        });
      return res;
    },
    getChargeItemLevel() {
      getChargeItemLevel().then((res) => {
        if (res.code === 1) {
          res.data.forEach((item) => {
            this.chargeItemLevelList[item.dictCode] = item.dictName;
          });
        }
      });
    },
    getDosageType() {
      getDosageType().then((res) => {
        if (res.code === 1) {
          res.data.forEach((item) => {
            this.dosageTypeList[item.dictCode] = item.dictName;
          });
        }
      });
    },
    getControlItemsList() {
      this.projectList.forEach((i) => {
        this.controlItemsLists[i.code] = i.name;
      });
    },
    // 获取医保类别
    getDrugType() {
      getDrugType().then((res) => {
        if (res.code === 1) {
          res.data.forEach((item) => {
            this.drugTypeList[item.dictCode] = item.dictName;
          });
        }
      });
    },
    getTypeCode() {
      getTypeCode().then((res) => {
        if (res.code === 1) {
          res.data.forEach((item) => {
            this.typeCodeList[item.dictCode] = item.dictName;
          });
        }
      });
    },
    getMedicareType() {
      getPagemd().then((res) => {
        if (res.code === 1) {
          res.data.forEach((item) => {
            this.medicareTypeList[item.dictCode] = item.dictName;
          });
        }
      });
    },
    // 查询
    search() {
      if (!this.searchParams.medicareType) {
        this.$message.warning("请选择医保类别!");
        return;
      }
      if (!this.searchParams.itemType) {
        this.$message.warning("请选择项目类型!");
        return;
      }
      this.pageParams.pageNo = 1;
      this.loadTable();
    },
    // 重置查询条件
    reset() {
      this.searchParams = this.$options.data().searchParams;
    },
    // 加载表格数据
    loadTable() {
      const params = {
        ...this.searchParams,
        pageNo: this.pageParams.pageNo,
        pageSize: this.pageParams.pageSize,
      };
      this.loading = true;
      getPageItemList(params)
        .then((res) => {
          if (res.code === 1) {
            this.pageParams.total = res.total;
            this.tableData = res.data;
          }
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    // 分页回调
    changeSize(val) {
      this.pageParams.pageSize = val;
      this.loadTable();
    },
    changePage(val) {
      this.pageParams.pageNo = val;
      this.loadTable();
    },
    changeTableHeaderRight() {
      if (this.searchParams.itemType === "1") {
        this.tableHeaderRight = [
          {
            prop:'ake001',
            label:"社保目录编码"
          },
          {
            prop:'aka061',
            label:"社保目录名称"
          },
          {
            prop:'ckm113',
            label:"门诊慢病药品标识"
          },
          {
            prop:'bkm017',
            label:"药品本位码"
          },
          {
            prop:'aka074',
            label:"规格"
          },
          {
            prop:'bka053',
            label:"厂家"
          },
          {
            prop:'bkm007',
            label:"批准文号"
          },
          {
            prop:'aka070',
            label:"剂型"
          },
          {
            prop:'ckm099',
            label:"限制性说明"
          },
          {
            prop:'aka068',
            label:"医保支付上限"
          },
          {
            prop:'bkm032',
            label:"记账标志"
          },
          {
            prop:'akc222',
            label:"省药品编码"
          },
          {
            prop:'ake002',
            label:"社保目录名称"
          },
          {
            prop:'ake003',
            label:"目录类别"
          },
          {
            prop:'bke111',
            label:"分类编码"
          },
          {
            prop:'aka062',
            label:"英文名称"
          },
          {
            prop:'bkm030',
            label:"别名（简称）"
          },
          {
            prop:'ckm097',
            label:"炮制方法"
          },
          {
            prop:'ckm098',
            label:"药用部位"
          },
          {
            prop:'aka020',
            label:"拼音简码"
          },
          {
            prop:'aka111',
            label:"大类代码"
          },
          {
            prop:'aka036',
            label:"限制使用标记"
          },
          {
            prop:'bkm100',
            label:"限医院级别"
          },
          {
            prop:'bkm101',
            label:"限协议机构类别"
          },
          {
            prop:'bkm102',
            label:"限协议机构专科类别"
          },
          {
            prop:'ckm107',
            label:"记账途径"
          },
          {
            prop:'bkm008',
            label:"批准文号备注"
          },
          {
            prop:'bkm009',
            label:"批准日期"
          },
          {
            prop:'aka067',
            label:"计价单位"
          },
          {
            prop:'bka640',
            label:"单位时间限量"
          },
          {
            prop:'aka065',
            label:"收费项目等级"
          },
          {
            prop:'aka031',
            label:"药品类别"
          },
          {
            prop:'bkm054',
            label:"医院制剂标志"
          },
          {
            prop:'akb020',
            label:"制剂所属协议机构编码"
          },
          {
            prop:'aka064',
            label:"处方药标志"
          },
          {
            prop:'aka022',
            label:"基本医疗保险启用标志"
          },
          {
            prop:'bkm033',
            label:"基本医疗保险启用"
          },
          {
            prop:'bkm034',
            label:"基本医疗保险终止日期"
          },
          {
            prop:'bkm035',
            label:"家属统筹医疗启用标志"
          },
          {
            prop:'bkm036',
            label:"家属统筹医疗启用日期"
          },
          {
            prop:'bkm037',
            label:"家属统筹医疗终止日期"
          },
          {
            prop:'bkm038',
            label:"地方补充医疗保险启用标志"
          },
          {
            prop:'bkm039',
            label:"地方补充医疗保险启用日期"
          },
          {
            prop:'bkm040',
            label:"地方补充医疗保险终止日期"
          },
          {
            prop:'bkm041',
            label:"预防接种启用标志"
          },
          {
            prop:'bkm042',
            label:"预防接种启用日期"
          },
          {
            prop:'bkm043',
            label:"预防接种终止日期"
          },
          {
            prop:'bkm044',
            label:"打七折启用标志"
          },
          {
            prop:'bkm045',
            label:"打七折启用日期"
          },
          {
            prop:'bkm046',
            label:"打七折终止日期"
          },
          {
            prop:'bkm047',
            label:"少儿医疗启用标志"
          },
          {
            prop:'bkm048',
            label:"少儿医疗启用日期"
          },
          {
            prop:'bkm049',
            label:"少儿医疗终止日期"
          },
          {
            prop:'ama011',
            label:"生育保险启用标志"
          },
          {
            prop:'bma030',
            label:"生育保险启用日期"
          },
          {
            prop:'bma031',
            label:"生育保险终止日期"
          },
          {
            prop:'ala011',
            label:"工伤医疗启用标志"
          },
          {
            prop:'bla050',
            label:"工伤医疗启用日期"
          },
          {
            prop:'bla051',
            label:"工伤医疗终止日期"
          },
          {
            prop:'bla052',
            label:"工伤康复启用标志"
          },
          {
            prop:'bla053',
            label:"工伤康复启用日期"
          },
          {
            prop:'bla054',
            label:"工伤康复终止日期"
          },
          {
            prop:'ckm104',
            label:"大病药标志"
          },
          {
            prop:'ckm105',
            label:"慈善援助药品标志"
          },
          {
            prop:'ckm106',
            label:"重疾补充医保药品标志"
          },
          {
            prop:'bkm080',
            label:"数量限额(支/盒)",
            align:"right"
          },
          {
            prop:'bkm081',
            label:"医保记帐周期(月)",
            align:"right"
          },
          {
            prop:'bkm082',
            label:"慈善援助周期(月)",
            align:"right"
          },
          {
            prop:'bkm083',
            label:"记帐循环周期(月)",
            align:"right"
          },
          {
            prop:'bkm090',
            label:"医保谈判价格",
            align:"right"
          },
          {
            prop:'ckm102',
            label:"医保谈判价格所属行政级别"
          },
          {
            prop:'bkm095',
            label:"医保最高价",
            align:"right"
          },
          {
            prop:'aae396',
            label:"更新日期"
          },
          {
            prop:'aae013',
            label:"备注1"
          },
          {
            prop:'cke900',
            label:"备注2"
          },
          {
            prop:'cke901',
            label:"备注3"
          },
          {
            prop:'cke902',
            label:"备注4"
          },
          {
            prop:'cke903',
            label:"备注5"
          },
          {
            prop:'cke904',
            label:"备注6"
          },
        ];
      } else if (this.searchParams.itemType === "2") {
        this.tableHeaderRight = [
          {
            prop:'ake001',
            label:"社保目录编码"
          },
          {
            prop:'ake002',
            label:"社保目录名称"
          },
          {
            prop:'akc222',
            label:"省药品编码"
          },
          {
            prop:'ake003',
            label:"目录类别"
          },
          {
            prop:'bke111',
            label:"分类编码"
          },
          {
            prop:'aka111',
            label:"大类代码"
          },
          {
            prop:'aka036',
            label:"限制使用标记"
          },
          {
            prop:'ckm099',
            label:"限制性说明"
          },
          {
            prop:'bkm100',
            label:"限医院级别"
          },
          {
            prop:'bkm101',
            label:"限协议机构类别"
          },
          {
            prop:'bkm102',
            label:"限协议机构专科类别"
          },
          {
            prop:'ckm107',
            label:"记账途径"
          },
          {
            prop:'ckm108',
            label:"自主定价项目标识"
          },
          {
            prop:'ckm109',
            label:"加收项目标识"
          },
          {
            prop:'bkm031',
            label:"诊疗项目类别"
          },
          {
            prop:'bkm010',
            label:"项目内涵"
          },
          {
            prop:'bkm011',
            label:"除外内容"
          },
          {
            prop:'bka956',
            label:"说明"
          },
          {
            prop:'aka067',
            label:"计价单位"
          },
          {
            prop:'bka640',
            label:"单位时间限量"
          },
          {
            prop:'bkm032',
            label:"记账标志"
          },
          {
            prop:'aka022',
            label:"基本医疗保险启用标志"
          },
          {
            prop:'bkm033',
            label:"基本医疗保险启用"
          },
          {
            prop:'bkm034',
            label:"基本医疗保险终止日期"
          },
          {
            prop:'bkm035',
            label:"家属统筹医疗启用标志"
          },
          {
            prop:'bkm036',
            label:"家属统筹医疗启用日期"
          },
          {
            prop:'bkm037',
            label:"家属统筹医疗终止日期"
          },
          {
            prop:'bkm038',
            label:"地方补充医疗保险启用标志"
          },
          {
            prop:'bkm039',
            label:"地方补充医疗保险启用日期"
          },
          {
            prop:'bkm040',
            label:"地方补充医疗保险终止日期"
          },
          {
            prop:'bkm044',
            label:"打七折启用标志"
          },
          {
            prop:'bkm045',
            label:"打七折启用日期"
          },
          {
            prop:'bkm046',
            label:"打七折终止日期"
          },
          {
            prop:'bkm047',
            label:"少儿医疗启用标志"
          },
          {
            prop:'bkm048',
            label:"少儿医疗启用日期"
          },
          {
            prop:'bkm049',
            label:"少儿医疗终止日期"
          },
          {
            prop:'ama011',
            label:"生育保险启用标志"
          },
          {
            prop:'bma030',
            label:"生育保险启用日期"
          },
          {
            prop:'bma031',
            label:"生育保险终止日期"
          },
          {
            prop:'ala011',
            label:"工伤医疗启用标志"
          },
          {
            prop:'bla050',
            label:"工伤医疗启用日期"
          },
          {
            prop:'bla051',
            label:"工伤医疗终止日期"
          },
          {
            prop:'bla052',
            label:"工伤康复启用标志"
          },
          {
            prop:'bla053',
            label:"工伤康复启用日期"
          },
          {
            prop:'bla054',
            label:"工伤康复终止日期"
          },
          {
            prop:'bkm014',
            label:"政府指导价格（一档）"
          },
          {
            prop:'bkm015',
            label:"政府指导价格（二档）"
          },
          {
            prop:'bkm016',
            label:"政府指导价格（三档）"
          },
          {
            prop:'bkm055',
            label:"政府指导价格（四档）"
          },
          {
            prop:'bkm091',
            label:"医保谈判价格（一档）"
          },
          {
            prop:'bkm092',
            label:"医保谈判价格（二档）"
          },
          {
            prop:'bkm093',
            label:"医保谈判价格（三档）"
          },
          {
            prop:'bkm094',
            label:"医保谈判价格（四档）"
          },
          {
            prop:'ckm102',
            label:"医保谈判价格所属行政级别"
          },
          {
            prop:'bkm096',
            label:"医保最高价（一档）"
          },
          {
            prop:'bkm097',
            label:"医保最高价（二档）"
          },
          {
            prop:'bkm098',
            label:"医保最高价（三档）"
          },
          {
            prop:'bkm099',
            label:"医保最高价（四档）"
          },
          {
            prop:'bkm056',
            label:"医保支付上限（一档）"
          },
          {
            prop:'bkm057',
            label:"医保支付上限（二档）"
          },
          {
            prop:'bkm058',
            label:"医保支付上限（三档）"
          },
          {
            prop:'bkm059',
            label:"医保支付上限（四档）"
          },
          {
            prop:'aae396',
            label:"更新日期"
          },
          {
            prop:'aae013',
            label:"备注1"
          },
          {
            prop:'cke900',
            label:"备注2"
          },
          {
            prop:'cke901',
            label:"备注3"
          },
          {
            prop:'cke902',
            label:"备注4"
          },
          {
            prop:'cke903',
            label:"备注5"
          },
          {
            prop:'cke904',
            label:"备注6"
          },
        ];
      } else {
        this.tableHeaderRight = [
          {
            prop:'ake001',
            label:"社保目录编码"
          },
          {
            prop:'ake002',
            label:"社保目录名称"
          },
          {
            prop:'akc222',
            label:"省材料编码"
          },
          {
            prop:'ake003',
            label:"目录类别"
          },
          {
            prop:'bke111',
            label:"分类编码"
          },
          {
            prop:'aka111',
            label:"大类代码"
          },
          {
            prop:'aka036',
            label:"限制使用标记"
          },
          {
            prop:'ckm099',
            label:"限制性说明"
          },
          {
            prop:'bkm100',
            label:"限医院级别"
          },
          {
            prop:'bkm101',
            label:"限协议机构类别"
          },
          {
            prop:'bkm102',
            label:"限协议机构专科类别"
          },
          {
            prop:'ckm107',
            label:"记账途径"
          },
          {
            prop:'ake004',
            label:"产地标志"
          },
          {
            prop:'bka053',
            label:"厂家"
          },
          {
            prop:'ala026',
            label:"产地"
          },
          {
            prop:'bkm090',
            label:"医保谈判价格"
          },
          {
            prop:'ckm102',
            label:"医保谈判价格所属行政级别"
          },
          {
            prop:'bkm095',
            label:"医保最高价"
          },
          {
            prop:'aka068',
            label:"医保支付上限"
          },
          {
            prop:'bkm032',
            label:"记账标志"
          },
          {
            prop:'aka022',
            label:"基本医疗保险启用标志"
          },
          {
            prop:'bkm033',
            label:"基本医疗保险启用"
          },
          {
            prop:'bkm034',
            label:"基本医疗保险终止日期"
          },
          {
            prop:'bkm035',
            label:"家属统筹医疗启用标志"
          },
          {
            prop:'bkm036',
            label:"家属统筹医疗启用日期"
          },
          {
            prop:'bkm037',
            label:"家属统筹医疗终止日期"
          },
          {
            prop:'bkm038',
            label:"地方补充医疗保险启用标志"
          },
          {
            prop:'bkm039',
            label:"地方补充医疗保险启用日期"
          },
          {
            prop:'bkm040',
            label:"地方补充医疗保险终止日期"
          },
          {
            prop:'bkm044',
            label:"打七折启用标志"
          },
          {
            prop:'bkm045',
            label:"打七折启用日期"
          },
          {
            prop:'bkm046',
            label:"打七折终止日期"
          },
          {
            prop:'bkm047',
            label:"少儿医疗启用标志"
          },
          {
            prop:'bkm048',
            label:"少儿医疗启用日期"
          },
          {
            prop:'bkm049',
            label:"少儿医疗终止日期"
          },
          {
            prop:'ama011',
            label:"生育保险启用标志"
          },
          {
            prop:'bma030',
            label:"生育保险启用日期"
          },
          {
            prop:'bma031',
            label:"生育保险终止日期"
          },
          {
            prop:'ala011',
            label:"工伤医疗启用标志"
          },
          {
            prop:'bla050',
            label:"工伤医疗启用日期"
          },
          {
            prop:'bla051',
            label:"工伤医疗终止日期"
          },
          {
            prop:'bla052',
            label:"工伤康复启用标志"
          },
          {
            prop:'bla053',
            label:"工伤康复启用日期"
          },
          {
            prop:'bla054',
            label:"工伤康复终止日期"
          },
          {
            prop:'bla055',
            label:"辅助器具启用标志"
          },
          {
            prop:'bla056',
            label:"辅助器具启用日期"
          },
          {
            prop:'bla057',
            label:"辅助器具终止日期"
          },
          {
            prop:'aae396',
            label:"更新日期"
          },
          {
            prop:'aae013',
            label:"备注1"
          },
          {
            prop:'cke900',
            label:"备注2"
          },
          {
            prop:'cke901',
            label:"备注3"
          },
          {
            prop:'cke902',
            label:"备注4"
          },
          {
            prop:'cke903',
            label:"备注5"
          },
          {
            prop:'cke904',
            label:"备注6"
          },
        ];
        
      }
      this.$nextTick(() => {
        this.$refs.rightTable.doLayout();
      });
    },
    handleClick() {
      this.searchParams.itemType = this.activeName;
      this.tableData = [];
      this.pageParams = {
        pageNo: 1,
        pageSize: 20,
        total: 0,
      };
      this.changeTableHeaderRight();
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  overflow: hidden;
}
.main {
  width: 100%;
  height: 100%;
  padding: 16px;
  background-color: $l-color-white;
  padding-top: 8px;
}
.align-right {
  text-align: right;
}
.table {
  height: calc(100% - 120px);
  margin: 8px 0;
}
.page {
  .el-pagination {
    padding: 0;
    /deep/ .el-pagination__editor.el-input .el-input__inner {
      height: 100% !important;
    }
    /deep/ .el-pager .number{
      width:auto;
    }
    /deep/ .el-pagination__editor.el-input{
      width:auto;
    }
  }
}
</style>
