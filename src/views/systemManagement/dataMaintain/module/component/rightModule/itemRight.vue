<template>
  <el-tabs
    class="height100 pd10 wrapper"
    v-model="activeName"
    @tab-click="handleClick"
  >
    <el-tab-pane label="医嘱信息" name="first">
      <el-form
        :model="dInfoForm"
        :rules="itemRules"
        ref="itemRuleForm"
        label-width="0"
        class="itemRuleForm"
      >
        <div class="utilCls">
          <div style="margin-bottom: 5px; padding-top: 5px">
            <l-formt-title label="医嘱代码">
              <el-input
                v-model="dInfoForm.code"
                placeholder="请输入内容"
                style="width: 100%"
              ></el-input>
            </l-formt-title>
          </div>
          <div class="marginBT5">
            <el-form-item label="" prop="name" :show-message="false">
              <l-formt-title label="医嘱名称" :required="true">
                <el-input
                  v-model="dInfoForm.name"
                  placeholder="请输入内容"
                  style="width: 100%"
                ></el-input>
              </l-formt-title>
            </el-form-item>
          </div>
          <div class="marginBT5 overflowHidden">
            <el-form-item
              label=""
              prop="pinyin"
              :show-message="false"
              class="fl"
            >
              <l-formt-title label="拼音码" class="pr5">
                <el-input
                  v-model="dInfoForm.pinyin"
                  placeholder="请输入内容"
                  style="width: 100%"
                ></el-input>
              </l-formt-title>
            </el-form-item>
            <div class="fr width50 pl10 displayInline">
              <l-formt-title label="五笔码">
                <el-input
                  v-model="dInfoForm.wubi"
                  placeholder="请输入内容"
                  style="width: 100%"
                ></el-input>
              </l-formt-title>
            </div>
          </div>

          <div class="marginBT5 overflowHidden">
            <el-form-item
              label=""
              prop="bigDoctorAdvice"
              :show-message="false"
              class="width50 fl"
            >
              <l-formt-title label="医嘱大类" class="pr5" :required="true">
                <l-value-domain
                  clearable
                  remoteUrl="/doctorsAdvice/getListOn"
                  type="select"
                  :remoteParams="remoteParams"
                  :value.sync="dInfoForm.bigDoctorAdvice"
                  remoteShowKey="doctorsAdviceName"
                  remoteValueKey="doctorsAdviceCode"
                  @change="doctorsAdviceChange"
                ></l-value-domain>
              </l-formt-title>
            </el-form-item>
            <div class="width50 pl10 fr">
              <el-form-item
                label=""
                prop="sonDoctorAdvice"
                :show-message="false"
              >
                <l-formt-title label="医嘱子类" :required="true">
                  <el-select
                    v-model="dInfoForm.sonDoctorAdvice"
                    placeholder="请选择医嘱子类"
                  >
                    <el-option
                      v-for="item in sonDoctorAdviceList"
                      :key="item.doctorsAdviceCode"
                      :label="item.doctorsAdviceName"
                      :value="item.doctorsAdviceCode"
                    >
                    </el-option>
                  </el-select>
                </l-formt-title>
              </el-form-item>
            </div>
          </div>

          <div class="marginBT5 overflowHidden">
            <el-form-item
              label=""
              prop="unit"
              :show-message="false"
              class="width30 displayInline"
            >
              <l-formt-title label="单位" :required="true" style="width: 175px">
                <!-- <el-select v-model="dInfoForm.unit" placeholder="请选择" style="width: 100%">
                  <el-option
                    v-for="item in units"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value"></el-option>
                </el-select> -->
                <l-value-domain
                  clearable
                  code="DrugUnit"
                  type="select"
                  :remoteParams="remoteUnitParams"
                  :value.sync="dInfoForm.unit"
                  remoteShowKey="name"
                  remoteValueKey="code"
                ></l-value-domain>
              </l-formt-title>
            </el-form-item>
            <el-switch
              class="width30 displayInline"
              style="vertical-align: 10px; padding-left: 20px"
              v-model="dInfoForm.status"
              active-text="激活"
              active-value="0"
              inactive-text="禁用"
              inactive-value="1"
            >
            </el-switch>
          </div>
          <div
            class="fontSize16 rangeCls"
            style="height: 36px; line-height: 36px"
          >
            <!--<span class="displayInline pl10">使用范围</span>-->
            <!--<span class="displayInline" style="width: 80%">-->
            <el-form-item label="" prop="checkedRange">
              <!-- <l-formt-title
                label="使用范围"
                :required="true"
              > -->
              <!-- <l-value-domain
                  clearable
                  code="orderItemRange"
                  type="checkbox"
                  :value.sync="dInfoForm.checkedRange"
                  remoteShowKey="name"
                  remoteValueKey="code"
                  placeholder="请选择使用范围"
                ></l-value-domain> -->
              <div class="itemRange">
                <span class="innerTitle">
                  使用范围 <span class="required">*</span>
                </span>
                <el-checkbox
                  v-for="item in checkList"
                  v-model="dInfoForm[item.code]"
                  :label="item.label"
                  :key="item.label"
                  false-label="0"
                  true-label="1"
                  >{{ item.label }}</el-checkbox
                >
              </div>

              <!-- </l-formt-title> -->
            </el-form-item>
            <!--<el-checkbox-group v-model="dInfoForm.checkedRange" @change="handleCheckedRangesChange">-->
            <!--<el-checkbox v-for="range in ranges" :label="range" :key="range">{{range}}</el-checkbox>-->
            <!--</el-checkbox-group>-->
            <!--</span>-->
          </div>
          <div
            class="marginBT5 height36"
            v-if="checkedCatShow"
            style="padding: 0"
          >
            <!--<div class="fontSize16 rangeCls">-->
            <!--<span class="displayInline pl10">医嘱类别</span>-->
            <!--<span class="displayInline" style="width: 80%">-->
            <l-formt-title label="医嘱类别">
              <l-value-domain
                code="category_Code"
                multiple
                :value.sync="dInfoForm.checkedCat"
                placeholder="请选择医嘱类别"
                @change="handleCheckedCatChange"
              ></l-value-domain>
            </l-formt-title>
            <!--<el-checkbox-group v-model="dInfoForm.checkedCat" @change="handleCheckedCatChange">-->
            <!--<el-checkbox v-for="cat in checkedCats" :label="cat" :key="cat">{{cat}}</el-checkbox>-->
            <!--</el-checkbox-group>-->
            <!--</span>-->
            <!--</div>-->
          </div>
          <div class="marginBT5">
            <l-formt-title label="医嘱提示">
              <el-input
                v-model="dInfoForm.doctorAdviceTip"
                placeholder="请输入内容"
                style="width: 100%"
              ></el-input>
            </l-formt-title>
          </div>
          <div class="marginBT5 fontSize16 height36">
            <el-checkbox
              true-label="0"
              false-label="1"
              v-model="dInfoForm.chargeable"
              :disabled="checkedDisabled"
              @change="handleChecked"
              >无费用医嘱</el-checkbox
            >
            <div class="float-right activeColor">
              <span>金额：</span>
              <!-- {{ dInfoForm.amt | roundingTwo }} -->
              <!-- <template v-if="dInfoForm.chargeable == '0'">
                <span>0.00</span>
              </template>
              <template v-else> -->
              <span>{{ dInfoForm.amt | roundingTwo }}</span>
              <!-- </template> -->
            </div>
          </div>

          <div
            class="marginBT5 height36"
            v-if="checkedCatShow"
            style="padding: 0"
          >
            <!--<div class="fontSize16 rangeCls">-->
            <!--<span class="displayInline pl10">医嘱类别</span>-->
            <!--<span class="displayInline" style="width: 80%">-->
            <l-formt-title label="医嘱类别">
              <l-value-domain
                code="category_Code"
                multiple
                :value.sync="dInfoForm.checkedCat"
                placeholder="请选择医嘱类别"
                @change="handleCheckedCatChange"
              ></l-value-domain>
            </l-formt-title>
            <!--<el-checkbox-group v-model="dInfoForm.checkedCat" @change="handleCheckedCatChange">-->
            <!--<el-checkbox v-for="cat in checkedCats" :label="cat" :key="cat">{{cat}}</el-checkbox>-->
            <!--</el-checkbox-group>-->
            <!--</span>-->
            <!--</div>-->
          </div>

          <div style="text-align: center" class="marginBT5 fontSize16 height36">
            <el-button
              @click="addDepartment"
              :disabled="departDisabled"
              type="primary"
              icon="el-icon-circle-plus-outline"
              >关联收费（药品）项目
            </el-button>
          </div>
        </div>
      </el-form>
      <div class="bottomPart">
        <el-form
          :model="fromData"
          ref="tableFrom"
          class="tableWrapperForm"
          :rules="fromData.rules"
        >
          <el-table
            class="mainTable"
            highlight-current-row
            :data="fromData.tableData"
            border
            @cell-click="cellClick"
            height="100%"
            v-loading="tableLoading"
          >
            <!-- 业务列 -->
            <el-table-column
              v-for="(item, index) in tableParams"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              header-align="center"
              :align="item.align || 'center'"
              :fixed="item.fixed"
            >
              <template slot-scope="scope">
                <!-- 可自定义内容 -->
                <template v-if="item.prop === 'action'">
                  <el-button
                    size="small"
                    type="text"
                    style="width: 100%"
                    icon="el-icon-delete"
                    @click="del(scope.row, false)"
                  ></el-button>
                </template>
                <template v-else-if="item.prop === 'classify'">
                  <el-select
                    v-model="scope.row.classify"
                    :disabled="!!scope.row.id"
                    placeholder="请选择"
                    style="width: 100%"
                    :data-id="scope.row.__targetId__"
                    @change="
                      (value, item) => {
                        classifyChange(value, item, scope.row);
                      }
                    "
                  >
                    <el-option
                      v-for="classify in classifys"
                      :key="classify.val"
                      :label="classify.label"
                      :value="classify.val"
                    >
                    </el-option>
                  </el-select>
                </template>
                <template v-else-if="item.prop === 'itemName'">
                  <el-form-item
                    v-if="!scope.row.id"
                    :prop="'tableData.' + scope.$index + '.itemName'"
                    :rules="fromData.fromDataRules.itemName"
                    :show-message="false"
                  >
                    <!--药品的下拉-->
                    <LInputTable
                      v-if="scope.row.classify == 1"
                      ref="lInputTable"
                      id="bottomFormInputTable"
                      :data-id="'InputTable' + scope.row.__targetId__"
                      :popoverWidth="800"
                      suffix-icon="el-icon-search"
                      :tableData="selectOptions"
                      @query="search($event, scope.row, scope.$index)"
                      @blur="lInputTableBlur"
                      v-model="scope.row.itemName"
                      valueKey="drugName"
                      @select="select"
                      :tableLoading="inputTableLoading"
                      :tableParams="dropColumn"
                      :placeholder="scope.row.itemName || drugDropPlaceHolder"
                    ></LInputTable>
                    <!--收费项目的下拉-->
                    <LInputTable
                      v-else-if="scope.row.classify == 2"
                      ref="lInputTable"
                      id="dropLInputTable"
                      :data-id="'InputTable' + scope.row.__targetId__"
                      :popoverWidth="800"
                      suffix-icon="el-icon-search"
                      :tableData="selectDropOptions"
                      @blur="lInputTableBlur"
                      @query="dropSearch($event, scope.row, scope.$index)"
                      v-model="scope.row.itemName"
                      valueKey="chargeItemName"
                      @select="dropSelect"
                      :tableLoading="inputTableLoading"
                      :tableParams="itemDropColumn"
                      :placeholder="scope.row.itemName || costDropPlaceHolder"
                    ></LInputTable>
                  </el-form-item>
                  <span v-else>{{ scope.row.itemName }}</span>
                </template>
                <template v-else-if="item.prop === 'no'">
                  <el-form-item
                    :prop="'tableData.' + scope.$index + '.no'"
                    :rules="fromData.fromDataRules.no"
                    :show-message="false"
                  >
                    <el-input
                      v-model="scope.row.no"
                      :controls="false"
                      :id="scope.row.__targetId__"
                      @input="handleChange"
                      @keyup.enter.native="addDepartment"
                      @keydown.tab.native="addDepartment"
                      style="width: 100%"
                      :min="1"
                      :max="100"
                      label="描述文字"
                    ></el-input>
                  </el-form-item>
                </template>
                <template v-else-if="item.prop === 'unit'">
                  <template v-if="scope.row.classify == 1">
                    <span
                      :val="scope.row[item.prop]"
                      code="DrugUnit"
                      v-codeTransform
                    ></span>
                  </template>
                  <template v-else>
                    <!-- "scope.row[item.prop]" {{ scope.row[item.prop] }} -->
                    <template v-if="isNaN(scope.row[item.prop])">
                      <span> {{ scope.row[item.prop] }} </span>
                    </template>
                    <template v-else>
                      <span
                        :val="scope.row[item.prop]"
                        code="DrugUnit"
                        v-codeTransform
                      ></span>
                    </template>
                  </template>
                </template>
                <template v-else-if="item.prop === 'originCode'">
                  <div
                    code="Manufacturer"
                    v-codeTransform
                    :val="scope.row[item.prop]"
                  ></div>
                </template>
                <template v-else-if="item.prop === 'price'">
                  <span>{{ scope.row[item.prop] | rounding }}</span>
                </template>
                <template v-else>
                  <span>{{ scope.row[item.prop] || "--" }}</span>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
        <div class="bottomBtn">
          <el-button type="primary" @click="save">保存</el-button>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="执行科室" name="second">
      <exe-department
        @handleSave="save"
        @handleDel="handleDel"
        :execDeptTable="execDeptTable"
      ></exe-department>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import exeDepartment from "./executiveDepartments.vue";
import { getDoctorsAdviceList } from "@/api/systemManagement/dataMaintain/doctorsAdvice";
import {
  addAdviceItem,
  saveAdviceItem,
  saveAdviceChargeRelation,
  getAdviceItemInfo,
  postAdviceItemInfo,
  getAdviceItemTable
} from "@/api/systemManagement/dataMaintain/adviceItem";
import { removeAdviceChargeRelate } from "@/api/systemManagement/dataMaintain/adviceChargeRelation";
import { getDatas } from "@/api/wconf/wparam";
import { getsonDoctorAdviceListFunc } from "./utils";
import { deepClone } from "@/utils";
const checkList = [
  {
    code: "userange",
    label: "门诊"
  },
  {
    code: "emergency",
    label: "急诊"
  },
  {
    code: "physical",
    label: "体检"
  },
  {
    code: "inpLong",
    label: "家床长期"
  },
  {
    code: "inpTemporary",
    label: "家床临时"
  },
  {
    code: "inpOutMedication",
    label: "出院带药"
  }
];

function getCheckListKey() {
  // 处理 使用范围
  let checkListKey = {};
  checkList.forEach(item => {
    checkListKey[item.code] = "0";
  });
  return checkListKey;
}

export default {
  name: "itemRight",
  components: { exeDepartment },
  data() {
    // 修复 医嘱子类 有值但是验证不能通过的问题
    let sDAdviceVlidate = (rule, value, callback) => {
      // console.log(rule, value);
      if (
        this.dInfoForm.sonDoctorAdvice === "" ||
        this.dInfoForm.sonDoctorAdvice === null ||
        typeof this.dInfoForm.sonDoctorAdvice === "undefined"
      ) {
        callback("请输入医嘱子类");
      } else {
        callback();
      }
    };

    return {
      checkList,
      sonDoctorAdviceList: [],
      checkedCatShow: false,
      sonDA: [],
      units: [],
      tableLoading: false,
      remoteUnitParams: {
        page: 1,
        pageSize: 100,
        id: 4078
      },
      remoteParams: { pageSize: 10, status: "0", parentId: "0" }, // 分页参数
      classifyArr: [],
      classifys: [
        {
          val: "2",
          label: "收费"
        },
        {
          val: "1",
          label: "药品"
        }
      ],
      activeName: "first",
      dInfoForm: {
        id: "",
        code: "",
        name: "",
        pinyin: "",
        wubi: "",
        bigDoctorAdvice: "",
        sonDoctorAdvice: "",
        unit: "",
        checkedRange: [],
        status: "0",
        checkedCat: [],
        chargeable: "1",
        doctorAdviceTip: "",
        amt: 0,
        ...getCheckListKey()
      },
      ranges: ["全院", "限门诊", "限急诊", "限家床"],
      checkedCats: ["全部", "长期", "临时", "出院带药"],
      // tableData: [],  // 收费项目列表
      execDeptTable: [], //执行科室列表
      tableParams: [
        {
          prop: "classify",
          label: "分类",
          width: 80
        },
        {
          prop: "itemName",
          width: 150,
          label: "收费项目名称"
        },
        {
          prop: "spec",
          label: "规格"
        },
        {
          prop: "no",
          label: "数量",
          width: 60
        },
        {
          prop: "unit",
          label: "单位"
        },
        {
          prop: "price",
          label: "单价"
        },
        {
          prop: "originCode",
          label: "生产厂家"
        },
        {
          prop: "action",
          label: "操作",
          fixed: "right",
          width: 50
        }
      ],
      selectOptions: [],
      drugDropPlaceHolder: "请输入药品关键字",
      costDropPlaceHolder: "请输入收费关键字",
      selectDropOptions: [],
      inputTableLoading: false, //下拉table组件 loading
      // 分页数据
      currentPage: 0,
      shouFeiCurrentPage: 0,
      pageSize: 10,
      shouFeiPageSize: 10,
      total: 1,
      queryName: "",
      chargeQueryName: "",
      dropColumn: [
        // 收费下拉 table 配置表头
        {
          prop: "classCode",
          label: "项目代码",
          width: 60
        },
        {
          prop: "drugName",
          label: "项目名称",
          width: 120
        },
        {
          prop: "spec",
          label: "规格",
          width: 80
        },
        {
          prop: "drugUnit",
          label: "单位",
          width: 60,
          codeTransform: true,
          codeTransformCode: "DrugUnit"
        },
        {
          prop: "price",
          label: "单价",
          width: 60
        },
        {
          prop: "originCode",
          label: "生产厂家",
          width: 140,
          codeTransform: true,
          codeTransformCode: "Manufacturer"
        }
      ],
      itemDropColumn: [
        // 收费下拉 table 配置表头
        {
          prop: "finClassCode",
          label: "项目代码",
          width: 60
        },
        {
          prop: "chargeItemName",
          label: "项目名称",
          width: 100
        },
        // {
        //   prop: "spec",
        //   label: "规格",
        //   width: 100
        // },
        {
          prop: "chargeUnit",
          label: "单位",
          width: 100
        },
        {
          prop: "chargePrice",
          label: "单价",
          width: 100
        }
      ],
      currentRow: {},
      centerRow: {}, //中间部分选中的tr数据
      itemRules: {
        name: [
          { required: true, message: "医嘱名称不能为空", trigger: "blur" }
        ],
        pinyin: [
          { required: false, message: "拼音码不能为空", trigger: "blur" }
        ],
        bigDoctorAdvice: [
          { required: true, message: "医嘱大类不能为空", trigger: "blur" }
        ],
        sonDoctorAdvice: [{ validator: sDAdviceVlidate, trigger: "blur" }],
        unit: [{ required: true, message: "单位不能为空", trigger: "blur" }]
      },
      fromData: {
        tableData: [],
        fromDataRules: {
          itemName: [
            { required: true, message: "请选择项目名称", trigger: "blur" }
          ],
          no: [
            {
              required: true,
              message: "请填写数量",
              trigger: ["blur", "change"]
            },
            {
              pattern: /^[0-9]+([.]{1}[0-9]{1,2})?$/,
              message: "请输入正确的数量！"
            }
          ]
        }
      }
    };
  },
  created() {
    console.info("created");
    this.init();
  },
  mounted() {
    console.info("mounted");
    let obj = {
      page: 1,
      pageSize: 50,
      id: 4078
    };
    getDatas(obj).then(res => {
      if (res.code === 1) {
        let datas = res.data;
        for (let i = 0; i < datas.length; i++) {
          this.units.push({
            label: datas[i].name,
            value: datas[i].code
          });
        }
      }
    });
    // this.handleCheckedRangesChange(this.dInfoForm.checkedRange);
  },
  filters: {
    // filterRangeCode (code){
    //   let targetObj = checkList.find(item =>{ return code == item.code });
    //  return targetObj.label;
    // },
    rounding(value) {
      value = value !== "" && value !== undefined ? new Number(value) : 0;
      return value.rewToFixed(4);
    },
    roundingTwo(value) {
      value = value !== "" && value !== undefined ? new Number(value) : 0;
      return value.rewToFixed(2);
    }
  },
  methods: {
    //复制 CheckListKey
    copyCheckListKey(copyTo, copyFrom) {
      let keyObj = getCheckListKey();
      for (let key in keyObj) {
        this.$set(copyTo, key, copyFrom[key]);
      }
    },
    isCheckListEmpty(obj) {
      return checkList.every(item => {
        return obj[item.code] == "0";
      });
    },
    identificationTypeChange(val, item) {
      // console.log(val, item);
      // if (val) {
      //   // this.referralForm.patientCardType = item.name;
      // } else {
      //   // this.referralForm.patientCardType = "";
      // }
    },
    init() {
      this.getsonDoctorAdviceListFunc();
      // this.$set(this.fromData, 'tableData', this.fromData.tableData)
    },
    // 获取医嘱子类
    async getsonDoctorAdviceListFunc() {
      let remoteSonParams = {
        pageSize: 10,
        parentCode: this.dInfoForm.doctorsAdviceCode
      };
      try {
        let result = await getsonDoctorAdviceListFunc(remoteSonParams);
        this.sonDoctorAdviceList = result;
        // eslint-disable-next-line no-empty
      } catch (error) {}
    },
    changeBigDA() {
      // this.dInfoForm.sonDoctorAdvice = null;
      // this.remoteSonParams = {...this.remoteSonParams, ...{parentId: this.dInfoForm.bigDoctorAdvice}};
    },
    changeBigLei() {
      // this.dInfoForm.bigDoctorAdvice = null;
      // this.remoteParams = {...this.remoteParams, ...{parentId: this.dInfoForm.bigDoctorAdvice}};
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    handleCheckedRangesChange(value) {
      console.log(
        value,
        "checkedCatShowcheckedCatShowcheckedCatShowcheckedCatShow"
      );
      // if (value === "Outpatient") {
      //   this.checkedCatShow = false;
      // } else
      // if (value === "90" || value === "3") {
      //   this.checkedCatShow = true;
      // } else {
      //   this.checkedCatShow = false;
      //   this.checkedCat = [];
      // }
    },
    doctorsAdviceChange(value, obj) {
      this.dInfoForm.doctorsAdviceCode = obj.doctorsAdviceCode;
      this.dInfoForm.sonDoctorAdvice = "";
      this.getsonDoctorAdviceListFunc();
    },

    handleCheckedCatChange(value) {
      //console.log(value);
    },
    confirmPromise() {
      return new Promise((resolve, reject) => {
        this.$confirm("确定删除吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false,
          type: "warning"
        })
          .then(() => {
            resolve(true);
          })
          .catch(() => {
            reject(false);
          });
      });
    },
    async del(row, flag) {
      console.log("删除了");

      if (!flag) {
        try {
          await this.confirmPromise();
        } catch (error) {
          return;
        }
      }
      // console.log('发送删除接口', row);
      this.tableLoading = true;
      removeAdviceChargeRelate(row).then(res => {
        // console.log(res)
        if (res.code === 1) {
          if (row.__targetId__) {
            this.fromData.tableData = this.fromData.tableData.filter(item => {
              return item.__targetId__ !== row.__targetId__;
            });
          } else {
            this.fromData.tableData = this.fromData.tableData.filter(item => {
              return item.id !== row.id;
            });
          }

          this.$message.success("删除成功！");
          this.computerAmt();
        } else {
          this.$message(res.msg);
        }

        this.tableLoading = false;
      });
    },
    edit(row) {},
    reset() {
      this.dInfoForm = {
        ...getCheckListKey(),
        id: "",
        code: "",
        name: "",
        pinyin: "",
        wubi: "",
        bigDoctorAdvice: "",
        sonDoctorAdvice: "",
        unit: "",
        checkedRange: [],
        status: "0",
        checkedCat: [],
        chargeable: "1",
        doctorAdviceTip: "",
        amt: 0
      };
      this.fromData.tableData = [];
    },
    resetForm() {
      this.reset();
      this.$refs["itemRuleForm"] && this.$refs["itemRuleForm"].resetFields();
      try {
        this.$refs["tableFrom"] && this.$refs["tableFrom"].resetFields();
      } catch (e) {}

      this.centerRow = {};
    },
    //表单的error 信息
    showErrorMsg(errorObj) {
      let self = this;
      for (let key in errorObj) {
        setTimeout(function() {
          if (document.getElementsByClassName("el-message").length === 0) {
            //message 弹窗一次错误
            self.$message.error(errorObj[key][0]);
          }
        }, 0);
      }
    },
    handleDel(data) {
      this.execDeptTable = data;
    },
    // eslint-disable-next-line complexity
    save(sourceData = null) {
      let Flag = false;
      let tableFlag = false;

      // eslint-disable-next-line consistent-return
      this.$refs["itemRuleForm"].validate((valid, error) => {
        if (valid) {
          Flag = true;
        } else {
          this.showErrorMsg(error);
          Flag = false;
          return false;
        }
      });

      this.$refs["tableFrom"].validate((valid, error) => {
        if (valid) {
          tableFlag = true;
        } else {
          this.showErrorMsg(error);
          tableFlag = false;
          return false;
        }
      });

      if (!Flag || !tableFlag) {
        return;
      }

      //医嘱项目 必填
      if (this.isCheckListEmpty(this.dInfoForm)) {
        this.$message.error("请选择医嘱范围！");
        return;
      }

      let checkedRange = this.dInfoForm.checkedRange;
      // let arr = [];
      // if (checkedRange.indexOf('全院') != -1) {
      //   arr.push("0");
      //   arr.push("1");
      //   arr.push("2");
      // } else {
      //   if (checkedRange.indexOf('限门诊') != -1) {
      //     arr.push("0");
      //   } else if (checkedRange.indexOf('限家床') != -1) {
      //     arr.push("1");
      //   } else if (checkedRange.indexOf('限急诊') != -1) {
      //     arr.push("2");
      //   }
      // }

      let checkedCat = this.dInfoForm.checkedCat;
      let adviceType = JSON.stringify(checkedCat);
      let adviceItemId = this.dInfoForm.id;
      let enity = {
        id: adviceItemId,
        adviceItemName: this.dInfoForm.name,
        adviceItemCode: this.dInfoForm.code,
        adviceType: adviceType,
        userange: checkedRange.toString(),
        namePy: this.dInfoForm.pinyin,
        nameWb: this.dInfoForm.wubi,
        majorOrders: this.dInfoForm.bigDoctorAdvice,
        subclassOrders: this.dInfoForm.sonDoctorAdvice,
        // amt: this.dInfoForm.chargeable ? "0" : this.dInfoForm.amt,
        amt: this.dInfoForm.amt,
        unit: this.dInfoForm.unit,
        chargeable: this.dInfoForm.chargeable,
        status: this.dInfoForm.status,
        advicePrompt: this.dInfoForm.doctorAdviceTip,
        chargeUnit: this.dInfoForm.chargeUnit,
        spec: this.dInfoForm.spec,
        orginCode: this.dInfoForm.orginCode,
        drugBasedCode: this.dInfoForm.drugBasedCode,
        dosageTypeId: this.dInfoForm.dosageTypeId,
        chargeItemCode: this.dInfoForm.chargeItemCode,
        specialMedicalMaterialFlag: this.dInfoForm.specialMedicalMaterialFlag,
        show: this.dInfoForm.show
      };

      this.copyCheckListKey(enity, this.dInfoForm);

      let adviceChargeRelationList = [];
      if (this.fromData.tableData.length > 0) {
        for (let i = 0; i < this.fromData.tableData.length; i++) {
          let row = {
            adviceItemId: adviceItemId,
            chargeItemId: this.fromData.tableData[i]["chargeItemId"],
            itemQuantity: this.fromData.tableData[i]["no"],
            itemType: this.fromData.tableData[i]["classify"],
            chargeItemName: this.fromData.tableData[i]["itemName"],
            spec: this.fromData.tableData[i]["spec"],
            unit: this.fromData.tableData[i]["unit"],
            price: this.fromData.tableData[i]["price"],
            originCode: this.fromData.tableData[i]["originCode"]
          };
          adviceChargeRelationList.push(row);
        }
      }

      if (sourceData) {
        this.execDeptTable = deepClone(sourceData);
      }

      let adviceExecRelateList = [];
      for (let i = 0; i < this.execDeptTable.length; i++) {
        let adviceExecRelate = {
          // adviceId: this.bigUtilsFilter.doctorsAdviceCode,
          visitDeptId: this.execDeptTable[i].visitDeptId,
          execDeptId: this.execDeptTable[i].execDeptId,
          isDefault: this.execDeptTable[i].isDefault,
          startTime: this.execDeptTable[i].startTime,
          endTime: this.execDeptTable[i].endTime
        };
        // console.info("adviceExecRelate",adviceExecRelate);
        adviceExecRelateList.push(adviceExecRelate);
      }
      let execDeptIdArr = [];
      execDeptIdArr = adviceExecRelateList.map(item => {
        return item.execDeptId;
      });
      let s = execDeptIdArr.join(",") + ",";
      // console.log("aaaaaaaaa", s);
      for (var i = 0; i < execDeptIdArr.length; i++) {
        if (
          s
            .replace(execDeptIdArr[i] + ",", "")
            .indexOf(execDeptIdArr[i] + ",") > -1
        ) {
          // this.showErrorMsg("执行科室不能重复！")

          // console.log("abbbbbb", execDeptIdArr[i] + ",");
          this.$message("执行科室不能重复");
          return false;
        }
      }
      enity.chargeList = adviceChargeRelationList;
      enity.adviceExecRelateList = adviceExecRelateList;
      enity.dataVersion = this.centerRow.dataVersion;

      saveAdviceItem(enity).then(res => {
        if (res.code === 1) {
          this.$message.success("保存成功");
          let adviceItemPO = res.data;
          adviceItemId = adviceItemPO.id;
          this.dInfoForm.id = adviceItemId;
          // this.addAdviceChargeRelation(adviceItemId);
          if (this.fromData.tableData.length > 0) {
            let adviceChargeRelationList = [];
            for (let i = 0; i < this.fromData.tableData.length; i++) {
              let row = {
                adviceItemId: adviceItemId,
                chargeItemId: this.fromData.tableData[i]["chargeItemId"],
                itemQuantity: this.fromData.tableData[i]["no"],
                itemType: this.fromData.tableData[i]["classify"],
                chargeItemName: this.fromData.tableData[i]["itemName"],
                spec: this.fromData.tableData[i]["spec"],
                unit: this.fromData.tableData[i]["unit"],
                price: this.fromData.tableData[i]["price"],
                originCode: this.fromData.tableData[i]["originCode"]
              };
              adviceChargeRelationList.push(row);
            }
          }

          try {
            this.resetForm(); //保存成功之后重置表单
          } catch (err) {}

          // 刷新中间列表
          this.$emit("save", 2);
          this.execDeptTable = [];
        } else {
          this.$message.error(res.message ? res.message : "保存失败！");
          return false;
        }
      });
    },
    addDepartment() {
      let propList = this.tableParams.map(item => {
        return item.prop;
      });
      let obj = {
        __targetId__: +new Date()
      };
      propList.forEach(item => {
        obj[item] = "";
      });
      //第一行是收费 后面新增都是收费
      obj["classify"] = this.firstIsCharge() ? "2" : "1";
      console.info("tableData", this.fromData.tableData);
      this.fromData.tableData.push(obj);
      // this.classifyArr.push('0');
      //分类获取焦点
      setTimeout(() => {
        let nodeList = this.getDataIdDom(
          "div",
          "data-id",
          String(obj.__targetId__)
        );
        if (nodeList.length > 0) {
          nodeList[0].getElementsByClassName("el-input__inner")[0].focus();
        }
      }, 10);

      this.currentRow = obj;
    },
    loadData(row) {
      this.fromData.tableData = [];
      console.info("======row", row);
      if (!row.id) {
        // this.dInfoForm = {
        //   status: "0",
        //   checked: false,
        //   checkRanges: [],
        //   checkedCat: [],
        //   amt: 0
        // };
        this.reset();
        return;
      }
      let id = row.id;
      let obj = {
        id: id
      };

      this.resetForm(); //重置表单
      this.centerRow = row;
      // eslint-disable-next-line complexity
      postAdviceItemInfo(obj).then(res => {
        if (res.code === 1) {
          let adviceItemDTO = res.data;
          // console.log("adviceItemDTO3aaa");
          // console.log("adviceItemDTO", adviceItemDTO);
          adviceItemDTO.userange =
            null != adviceItemDTO.userange ? adviceItemDTO.userange : "";
          adviceItemDTO.adviceType =
            null != adviceItemDTO.adviceType &&
            (adviceItemDTO.adviceType.indexOf("1") != -1 ||
              adviceItemDTO.adviceType.indexOf("2") != -1 ||
              adviceItemDTO.adviceType.indexOf("3") != -1)
              ? adviceItemDTO.adviceType
              : "";
          let adviceExecRelateList = adviceItemDTO.adviceExecRelateList;
          let chargeList = adviceItemDTO.chargeList;
          console.log("adviceType", adviceItemDTO.adviceType);
          let checkedCat = [];
          if ("" != adviceItemDTO.adviceType) {
            if (adviceItemDTO.adviceType.indexOf("1") != -1) {
              checkedCat.push("1");
            }
            if (adviceItemDTO.adviceType.indexOf("2") != -1) {
              checkedCat.push("2");
            }
            if (adviceItemDTO.adviceType.indexOf("3") != -1) {
              checkedCat.push("3");
            }
          }

          //let checkRanges = "";
          // if (adviceItemDTO.userange.indexOf("all") != -1) {
          //   //checkRanges.push("全院");
          //   checkRanges = "全院";
          // }
          // else  if (adviceItemDTO.userange.indexOf("Outpatient") != -1) {
          //     //checkRanges.push("门诊");
          //     checkRanges = "门诊";
          //   } else if (adviceItemDTO.userange.indexOf("Inpatient") != -1) {
          //     //checkRanges.push("家床");
          //     checkRanges = "家床";
          //   } else if (adviceItemDTO.userange.indexOf("EmergencyTreatment") != -1) {
          //     //checkRanges.push("急诊");
          //     checkRanges = "急诊";
          //   }
          // let checkedCat = [];
          // if (adviceItemDTO.adviceType.indexOf("1") != -1 && adviceItemDTO.adviceType.indexOf("2") != -1 && adviceItemDTO.adviceType.indexOf("3") != -1) {
          //   checkedCat.push("全部");
          // }
          // else {
          //   if (adviceItemDTO.adviceType.indexOf("1") != -1) {
          //     checkedCat.push("1");
          //   } else if (adviceItemDTO.adviceType.indexOf("2") != -1) {
          //     checkedCat.push("临时");
          //   } else if (adviceItemDTO.adviceType.indexOf("3") != -1) {
          //     checkedCat.push("出院带药");
          //   }
          // }

          this.dInfoForm = {
            id: adviceItemDTO.id,
            code: adviceItemDTO.adviceItemCode,
            name: adviceItemDTO.adviceItemName,
            pinyin: adviceItemDTO.namePy,
            wubi: adviceItemDTO.nameWb,
            bigDoctorAdvice: adviceItemDTO.majorOrders,
            sonDoctorAdvice: adviceItemDTO.subclassOrders,
            unit: adviceItemDTO.unit,
            //checkedRange: checkRanges,
            checkedRange: adviceItemDTO.userange,
            //checkedCat:checkedCat,
            checkedCat: checkedCat,
            status: adviceItemDTO.status,
            // chargeable: adviceItemDTO.amt == "0" ? "1" : "0",
            chargeable: adviceItemDTO.chargeable,
            amt: adviceItemDTO.amt,
            doctorAdviceTip: adviceItemDTO.advicePrompt
          };

          this.copyCheckListKey(this.dInfoForm, adviceItemDTO);

          if (null != adviceExecRelateList && adviceExecRelateList.length > 0) {
            this.execDeptTable = [];
            for (let i = 0; i < adviceExecRelateList.length; i++) {
              let adviceExecRelate = adviceExecRelateList[i];
              let row = {
                visitDeptId: adviceExecRelate.visitDeptId,
                execDeptId: adviceExecRelate.execDeptId,
                isDefault: adviceExecRelate.isDefault,
                startTime: adviceExecRelate.startTime,
                endTime: adviceExecRelate.endTime,
                dataVersion: adviceExecRelate.dataVersion,
                id: adviceExecRelate.id
              };
              this.execDeptTable.push(row);
            }
          } else {
            this.execDeptTable = [];
          }
          if (null != chargeList && chargeList.length > 0) {
            for (let i = 0; i < chargeList.length; i++) {
              let charge = chargeList[i];
              let tableRow = {
                classify: charge.itemType,
                itemName: charge.chargeItemName,
                chargeItemId: charge.chargeItemId,
                spec: charge.spec,
                no: charge.itemQuantity,
                unit: charge.unit,
                originCode: charge.originCode,
                price: charge.price,
                id: charge.id
              };
              this.fromData.tableData.push(tableRow);
            }
          } else {
            this.fromData.tableData = [];
          }
          // this.computerAmt();
        } else {
          this.$message("未找到该类别信息");
        }
        //获取子类的列表
        this.getsonDoctorAdviceListFunc();
        // 计算金额
        this.computerAmt();
      });
    },
    // 计算总金额
    computerAmt() {
      let total = 0;
      this.fromData.tableData.forEach(item => {
        total += item.price * item.no;
      });
      this.dInfoForm.amt = new Number(total).rewToFixed(2);
    },
    // 获取 data-id 的dom 元素
    getDataIdDom(tagName, name, value) {
      var selectDom = [];
      var dom = document.getElementsByTagName(tagName);
      for (var i = 0; i < dom.length; i++) {
        if (value === dom[i].getAttribute(name)) {
          selectDom.push(dom[i]);
        }
      }
      return selectDom;
    },
    //调整数量 回调函数
    handleChange(value) {
      if (isNaN(value)) return;
      let tableData = this.fromData.tableData;
      let sum = 0;
      this.$nextTick(() => {
        // tableData.forEach((item, index) => {
        //   // console.log(sum);
        //   // console.log(item.no, item.price);
        //   sum += item.no * item.price;
        // });
        // this.dInfoForm.amt = sum;
        this.computerAmt();
      });
    },
    classifyChange(value, value1, cRow) {
      // console.log(value, value1);
      this.currentRow = cRow;
      this.$nextTick(() => {
        this.$set(this.currentRow, "classify", value);
        this.$set(this.currentRow, "itemName", "");
        this.$set(this.currentRow, "chargeItemId", "");
        this.$set(this.currentRow, "originCode", "");
        this.$set(this.currentRow, "no", "");
        this.$set(this.currentRow, "price", "");
        this.$set(this.currentRow, "spec", "");
        this.$set(this.currentRow, "unit", "");
        let targetId = "InputTable" + this.currentRow.__targetId__;

        console.log("lInputTable", this.$refs.lInputTable);
        this.$refs.lInputTable.forEach(item => {
          if (item.$el.getAttribute("data-id") === targetId) {
            console.log("item::::", item);
            item.clear();
          }
        });
      });
    },
    //第一行是收费 后面新增都是收费
    firstIsCharge() {
      return (
        this.fromData.tableData[0] &&
        this.fromData.tableData[0].classify === "2"
      );
    },
    async handleChecked(val) {
      // let data = this.dInfoForm;
      // if (data) {
      //   this.dInfoForm.amt = "0";
      // }
      //zhengyawen 点击无费用医嘱，判断下面表格数据
      let tableData = this.fromData.tableData;
      if (val && tableData.length) {
        this.$confirm("医嘱已经关联了收费(药品)项目, 是否删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            for (let i in tableData) {
              await this.del(tableData[i], true);
            }
          })
          .catch(async () => {
            this.dInfoForm.chargeable = "1";
          });
      }
    },
    //失去焦点 重置
    lInputTableBlur() {
      this.chargeQueryName = "";
      this.queryName = "";
      this.currentPage = 0;
      this.shouFeiCurrentPage = 0;
    },
    // 查询 药品
    search(query, row, index) {
      let self = this;
      if (this.inputTableLoading) {
        return;
      }
      //增加loading
      this.inputTableLoading = true;
      let pageNo = this.queryName === query ? this.currentPage * 1 + 1 : 0;
      let data = {
        ...{
          pageNo: pageNo,
          pageSize: this.pageSize,
          keyword: query,
          cwFlag: row.classify
        }
      };
      if (this.queryName !== query) {
        this.selectOptions = [];
      }

      getAdviceItemTable(data)
        .then(res => {
          if (res.code === 1) {
            let tableData = this.currentPage !== 0 ? this.selectOptions : [];
            const { data } = res;
            for (let i = 0; i < data.length; i++) {
              const item = data[i];
              tableData.push(item);
            }
            this.selectOptions = tableData;
            this.currentPage = res.pageNo;
            this.pageSize = res.pageSize;
            this.total = res.total;
            this.queryName = query;
          } else {
            this.$message.error(res.msg || "获取数据失败");
          }
          this.inputTableLoading = false; //增加loading
        })
        .catch(res => {
          this.$message.error(res.msg || "获取数据失败");
          this.inputTableLoading = false; //增加loading
        });
    },
    // 查询 收费项目
    dropSearch(query, row, index) {
      let self = this;
      if (this.inputTableLoading) {
        return;
      }
      this.inputTableLoading = true;
      let pageNo =
        this.chargeQueryName === query ? this.shouFeiCurrentPage * 1 + 1 : 0;
      let data = {
        ...{
          pageNo: pageNo,
          pageSize: this.pageSize,
          keyword: query,
          cwFlag: row.classify
        }
      };
      if (this.chargeQueryName !== query) {
        this.selectDropOptions = [];
      }
      // console.log(data);
      getAdviceItemTable(data)
        .then(res => {
          if (res.code === 1) {
            let tableData =
              this.shouFeiCurrentPage !== 0 ? this.selectDropOptions : [];
            const { data } = res;
            // 数据返回传递给selectOptions
            // self.selectDropOptions = res.data;
            for (let i = 0; i < data.length; i++) {
              const item = data[i];
              tableData.push(item);
            }
            this.selectDropOptions = tableData;
            this.shouFeiCurrentPage = res.pageNo;
            this.shouFeiPageSize = res.pageSize;
            this.total = res.total;
            this.chargeQueryName = query;
          } else {
            this.$message.error(res.msg || "获取数据失败");
          }
          this.inputTableLoading = false;
        })
        .catch(res => {
          this.inputTableLoading = false;
          this.$message.error(res.msg || "获取数据失败");
        });
    },
    // 选中 药品 或者 项目
    select(row) {
      // for (let key in row) {
      //   this.currentRow[key] = row[key];
      // }
      console.log(
        "row::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::",
        row
      );

      this.currentRow.itemName = row.drugName;
      // this.currentRow.chargeItemId = row.id;
      //zhengyawen chargeItemId取值：1.药品：drugId；2.收费项目:chargeItemId
      this.currentRow.chargeItemId =
        this.currentRow.classify == "1"
          ? row.drugId
          : this.currentRow.classify == "2"
          ? row.chargeItemId
          : "";
      this.currentRow.spec = row.spec;
      this.currentRow.no = row.availableQuantity;
      this.currentRow.unit = row.drugUnit;
      this.currentRow.price = row.price;
      this.currentRow.originCode = row.originCode;

      // 数量 框 获取焦点
      document.getElementById(this.currentRow.__targetId__).focus();
    },
    dropSelect(row) {
      // console.log("row：：：", row);

      this.currentRow.itemName = row.chargeItemName;
      this.currentRow.chargeItemId = row.chargeItemId;
      // this.currentRow.spec = row.spec;
      this.currentRow.no = row.availableQuantity;
      this.currentRow.unit = row.chargeUnit;
      this.currentRow.price = row.chargePrice;
      // this.currentRow.factory = "";

      // 数量 框 获取焦点
      document.getElementById(this.currentRow.__targetId__).focus();
    },
    cellClick(a, b, c) {
      if (b.property !== "itemName") return;
      this.currentRow = a;
    }
  },
  watch: {},
  computed: {
    checkedDisabled() {
      return this.fromData.tableData.some(item => {
        return typeof item.id !== "undefined";
      });
    },
    departDisabled() {
      return this.dInfoForm.chargeable == "0";
    }
  }
};
</script>

<style scoped lang="scss">
.utilCls {
  font-size: 0;

  .rangeCls {
    vertical-align: 10px;
  }

  .height36 {
    line-height: 36px;
    height: 36px;
    padding: 0 10px;
  }
}

.wrapper {
  background: #fff;
  /deep/ .el-tabs__content {
    overflow: auto !important;
  }

  /deep/ .el-tab-pane {
    // position: relative;
    display: flex;
    flex-direction: column;

    // .itemRuleForm {
    //   flex: 1;
    // }

    .bottomPart {
      flex: 1;
      display: flex;
      flex-direction: column;
      .tableWrapperForm {
        flex: 1;
      }
      .bottomBtn {
        text-align: right;
      }
    }
  }

  .mainTable {
    /deep/ .cell {
      padding: 0;
    }
  }
}

.marginRL5 {
  margin: 0 5px;
}

.marginBT5 {
  margin: 5px 0px;
}

.paddingRL5 {
  padding: 0 5px;
}

.pr5 {
  padding-right: 5px;
}

.pl10 {
  padding-left: 10px;
}

.displayInline {
  display: inline-block;
}

.fontSize16 {
  font-size: 16px;
}

.width50 {
  width: 50%;
}

.width30 {
  width: 30%;
}

.pd10 {
  padding: 10px;
}

.activeColor {
  color: #0000cc;
}

.overflowHidden {
  overflow: hidden;
}

/deep/ .el-form-item__content {
  height: 36px;
}

.required {
  color: #f05a23;
}

.itemRange {
  font-size: 0;
  .innerTitle {
    font-size: 14px;
  }
}
</style>
