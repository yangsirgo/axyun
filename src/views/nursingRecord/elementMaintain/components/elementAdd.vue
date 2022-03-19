<template>
  <div class="eleAdd">
    <div class="cont">
      <el-form :model="eleAddForm" :rules="rules" ref="eleAddForm">
        <l-card-title>
          <span slot="left">元素类型</span>
        </l-card-title>
        <el-row class="margin-bottom-20 common-padding">
          <LFormtTitle label="元素类型" required>
            <el-form-item prop="elementControl">
              <l-value-domain-emr
                type="select"
                code="CareDocControlType"
                :value.sync="eleAddForm.elementControl"
                placeholder="请选择"
                @change="changeEleType"
                clearable
              ></l-value-domain-emr>
              <!--<span v-else>{{ eleAddForm.elementType }}</span>-->
            </el-form-item>
          </LFormtTitle>
        </el-row>
        <l-card-title>
          <span slot="left">基本属性</span>
        </l-card-title>
        <el-row class="margin-bottom-20 common-padding">
          <LFormtTitle label="元素编码" disabled>
            <el-form-item prop="elementCode">
              <el-input
                v-model="eleAddForm.elementCode"
                style="line-height: 34px; width: 100%"
                placeholder="自动生成，不可编辑"
                disabled
              >
              </el-input>
            </el-form-item>
          </LFormtTitle>
        </el-row>
        <el-row class="margin-bottom-20 common-padding">
          <LFormtTitle label="元素名称" required>
            <el-form-item prop="elementName">
              <el-input
                v-model="eleAddForm.elementName"
                style="line-height: 34px; width: 100%"
                placeholder="请输入"
                clearable
              >
              </el-input>
            </el-form-item>
          </LFormtTitle>
        </el-row>
        <el-row class="margin-bottom-20 common-padding">
          <LFormtTitle label="显示名称">
            <el-form-item prop="elementShowname">
              <el-input
                v-model="eleAddForm.elementShowname"
                placeholder="请输入"
                clearable
              ></el-input>
            </el-form-item>
          </LFormtTitle>
        </el-row>
        <!-- 元素单位 -->
        <el-row
          v-if="eleAddForm.elementControl == '1'"
          class="margin-bottom-20 common-padding"
        >
          <LFormtTitle label="名称后缀">
            <l-value-domain-emr
              code="VitalItemUnit"
              type="select"
              :value.sync="eleAddForm.elementUnit"
              placeholder="请输入"
              clearable
            ></l-value-domain-emr>
          </LFormtTitle>
        </el-row>
        <l-card-title>
          <span slot="left">专有属性</span>
        </l-card-title>
        <div class="sub-attr common-padding" v-if="eleAddForm.elementControl">
          <!--标签-->
          <div class="label-type" v-if="eleAddForm.elementControl == '0'">
            <el-row class="margin-bottom-20">
              <el-form-item prop="loadEle">
                <checkboxCode
                  :value.sync="eleAddForm.loadEle"
                  label="加载根元素"
                />
              </el-form-item>
            </el-row>
          </div>
          <!--文本框-->
          <div class="text-type" v-else-if="eleAddForm.elementControl == '1'">
            <div class="margin-bottom-10">
              <el-form-item prop="multiLine">
                <el-col :span="7">
                  <el-checkbox
                    @change="changeTextValue"
                    v-model="eleAddForm.multiLineFlag"
                    >允许多行
                  </el-checkbox>
                </el-col>
                <el-col :span="6">
                  <el-input
                    type="number"
                    min="0"
                    :disabled="!eleAddForm.multiLineFlag"
                    v-model="eleAddForm.multiLine"
                  ></el-input>
                </el-col>
              </el-form-item>
            </div>
            <div class="text-type-cont width100">
              <div class="margin-bottom-10">
                <el-form-item prop="isNum">
                  <el-checkbox v-model="eleAddForm.isNum">纯数字</el-checkbox>
                </el-form-item>
              </div>

              <!-- 小数位数 -->
              <div class="margin-bottom-10">
                <LFormtTitle label="小数位数">
                  <el-form-item prop="nums">
                    <el-select
                      style="width: 100%"
                      clearable
                      :disabled="!eleAddForm.isNum"
                      v-model="eleAddForm.nums"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in numOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </LFormtTitle>
              </div>
              <!-- 值域范围 -->
              <div class="margin-bottom-10">
                <LFormtTitle label="值域范围">
                  <el-form-item prop="num">
                    <el-col :span="11">
                      <el-input
                        :disabled="!eleAddForm.isNum"
                        type="number"
                        v-model="eleAddForm.scopeOne"
                        style="line-height: 34px; width: 100%"
                        placeholder="请输入"
                      >
                      </el-input>
                    </el-col>
                    <el-col :span="2">～</el-col>
                    <el-col :span="11">
                      <el-input
                        :disabled="!eleAddForm.isNum"
                        type="number"
                        v-model="eleAddForm.scopeTwo"
                        style="line-height: 34px; width: 100%"
                        placeholder="请输入"
                      >
                      </el-input>
                    </el-col>
                  </el-form-item>
                </LFormtTitle>
              </div>
              <!-- 正常范围 -->
              <div>
                <LFormtTitle label="正常范围">
                  <el-form-item prop="commonScope">
                    <el-col :span="11">
                      <el-input
                        :disabled="!eleAddForm.isNum"
                        type="number"
                        v-model="eleAddForm.commonScopeOne"
                        style="line-height: 34px; width: 100%"
                        placeholder="请输入"
                      >
                      </el-input>
                    </el-col>
                    <el-col :span="2">～</el-col>
                    <el-col :span="11">
                      <el-input
                        :disabled="!eleAddForm.isNum"
                        type="number"
                        v-model="eleAddForm.commonScopeTwo"
                        style="line-height: 34px; width: 100%"
                        placeholder="请输入"
                      >
                      </el-input>
                    </el-col>
                  </el-form-item>
                </LFormtTitle>
              </div>
            </div>
          </div>
          <!--单选框-->
          <div class="radio-type" v-else-if="eleAddForm.elementControl == '2'">
            <div class="radio-type-table">
              <el-row class="margin-bottom-10">
                <el-col :span="7">
                  <el-form-item style="display: inline-block" prop="showInput">
                    <checkboxCode
                      :value.sync="eleAddForm.showInput"
                      label="显示录入框"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item style="display: inline-block" prop="isChoosed">
                    <el-checkbox v-model="eleAddForm.isChoosed"
                      >默认选中
                    </el-checkbox>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item
                    style="display: inline-block"
                    prop="isChoosedScore"
                  >
                    <el-checkbox
                      @change="changeRadioScore"
                      v-model="eleAddForm.isChoosedScore"
                      >分值
                    </el-checkbox>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item style="display: inline-block" prop="radioScore">
                    <el-input
                      type="number"
                      min="0"
                      :disabled="!eleAddForm.isChoosedScore"
                      v-model="eleAddForm.radioScore"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <div class="margin-bottom-20">
                <LFormtTitle label="打印值">
                  <el-form-item prop="radioPrint">
                    <el-col :span="11">
                      <el-input
                        v-model="eleAddForm.radioChoosedFalse"
                        style="line-height: 34px; width: 100%"
                        placeholder="未选"
                        clearable
                      >
                      </el-input>
                    </el-col>
                    <el-col :span="2">～</el-col>
                    <el-col :span="11">
                      <el-input
                        v-model="eleAddForm.radioChoosedTrue"
                        style="line-height: 34px; width: 100%"
                        placeholder="已选"
                        clearable
                      >
                      </el-input>
                    </el-col>
                  </el-form-item>
                </LFormtTitle>
              </div>
            </div>
          </div>
          <!--复选框-->
          <div class="date-type" v-else-if="eleAddForm.elementControl == '3'">
            <div class="radio-type-table">
              <el-row class="margin-bottom-10">
                <el-col :span="7">
                  <el-form-item
                    style="display: inline-block"
                    prop="checkShowInput"
                  >
                    <checkboxCode
                      :value.sync="eleAddForm.checkShowInput"
                      label="显示录入框"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item
                    style="display: inline-block"
                    prop="checkIsChoosed"
                  >
                    <el-checkbox v-model="eleAddForm.checkIsChoosed"
                      >默认选中
                    </el-checkbox>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item
                    style="display: inline-block"
                    prop="checkIsChoosedScore"
                  >
                    <el-checkbox
                      @change="changeCheckScore"
                      v-model="eleAddForm.checkIsChoosedScore"
                      >分值
                    </el-checkbox>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item style="display: inline-block" prop="checkScore">
                    <el-input
                      type="number"
                      min="0"
                      :disabled="!eleAddForm.checkIsChoosedScore"
                      v-model="eleAddForm.checkScore"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <div class="margin-bottom-20">
                <LFormtTitle label="打印值">
                  <el-form-item prop="checkPrint">
                    <el-col :span="11">
                      <el-input
                        v-model="eleAddForm.checkChoosedFalse"
                        style="line-height: 34px; width: 100%"
                        placeholder="未选"
                        clearable
                      >
                      </el-input>
                    </el-col>
                    <el-col :span="2">～</el-col>
                    <el-col :span="11">
                      <el-input
                        v-model="eleAddForm.checkChoosedTrue"
                        style="line-height: 34px; width: 100%"
                        placeholder="已选"
                        clearable
                      >
                      </el-input>
                    </el-col>
                  </el-form-item>
                </LFormtTitle>
              </div>
            </div>
          </div>
          <!-- 下拉单选 -->
          <div class="date-type" v-else-if="eleAddForm.elementControl == '4'">
            <div class="margin-bottom-10 clearfix">
              <div class="float-left">
                <el-form-item prop="range">
                  <el-checkbox
                    @change="changeDiyOption('range', eleAddForm.range)"
                    v-model="eleAddForm.range"
                    >自定义选项
                  </el-checkbox>
                </el-form-item>
              </div>
              <div class="float-right">
                <el-button type="text" @click="radioDataAdd">+ 添加</el-button>
              </div>
            </div>
            <div class="radio-type-table">
              <el-table
                :data="eleAddForm.radioData"
                width="100%"
                :stripe="true"
                border
              >
                <el-table-column
                  v-for="(item, index) in choosedParams"
                  :key="index"
                  :prop="item.prop"
                  :label="item.label"
                  :min-width="item.width"
                  :align="item.align || 'left'"
                  :header-align="item.headerAlign || 'left'"
                  :fixed="item.fixed"
                >
                  <template slot-scope="scope">
                    <template v-if="item.prop == 'orderNumber'">
                      <span>{{ scope.$index + 1 }}</span>
                    </template>
                    <template v-else-if="item.prop == 'showValue'">
                      <input
                        type="text"
                        v-model="scope.row['showValue']"
                        class="inputStyle"
                      />
                    </template>
                    <template v-else-if="item.prop == 'showValue'">
                      <input
                        type="text"
                        v-model="scope.row['showValue']"
                        class="inputStyle"
                      />
                    </template>
                    <template v-else-if="item.prop == 'printValue'">
                      <input
                        type="text"
                        v-model="scope.row['printValue']"
                        class="inputStyle"
                      />
                    </template>
                    <template v-else-if="item.prop == 'gradeValue'">
                      <input
                        type="text"
                        v-model="scope.row['gradeValue']"
                        class="inputStyle"
                      />
                    </template>
                    <template v-else-if="item.prop == 'defaultValue'">
                      <el-radio
                        class="special-class"
                        @change="changeRadioValue(scope.$index)"
                        :label="scope.$index"
                        v-model="scope.row['defaultValue']"
                      ></el-radio>
                    </template>
                    <template v-else-if="item.prop == 'operate'">
                      <el-row :gutter="10">
                        <el-button
                          type="text"
                          @click="radioDel(scope.$row, scope.$index)"
                          >删除
                        </el-button>
                        <el-button
                          type="text"
                          @click="radioUp(scope.$row, scope.$index)"
                          >上移
                        </el-button>
                        <el-button
                          type="text"
                          @click="radioDown(scope.$row, scope.$index)"
                          >下移
                        </el-button>
                      </el-row>
                    </template>
                    <template v-else>{{ scope.row[item.prop] }}</template>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <!--下拉多选-->
          <div class="multi-type" v-else-if="eleAddForm.elementControl == '5'">
            <div class="margin-bottom-10 clearfix">
              <div class="float-left">
                <el-form-item prop="multiRange">
                  <el-checkbox
                    @change="
                      changeDiyOption('multiRange', eleAddForm.multiRange)
                    "
                    v-model="eleAddForm.multiRange"
                    >自定义选项
                  </el-checkbox>
                </el-form-item>
              </div>
              <div class="float-right">
                <el-button type="text" @click="multiDataAdd">+ 添加</el-button>
              </div>
            </div>
            <div class="radio-type-table">
              <el-table
                :data="eleAddForm.multiData"
                width="100%"
                :stripe="true"
                border
              >
                <el-table-column
                  v-for="(item, index) in choosedParams"
                  :key="index"
                  :prop="item.prop"
                  :label="item.label"
                  :min-width="item.width"
                  :align="item.align || 'left'"
                  :header-align="item.headerAlign || 'left'"
                  :fixed="item.fixed"
                >
                  <template slot-scope="scope">
                    <template v-if="item.prop == 'orderNumber'">
                      <span>{{ scope.$index + 1 }}</span>
                    </template>
                    <template v-else-if="item.prop == 'showValue'">
                      <input
                        type="text"
                        v-model="scope.row['showValue']"
                        class="inputStyle"
                      />
                    </template>
                    <template v-else-if="item.prop == 'printValue'">
                      <input
                        type="text"
                        v-model="scope.row['printValue']"
                        class="inputStyle"
                      />
                    </template>
                    <template v-else-if="item.prop == 'gradeValue'">
                      <input
                        type="text"
                        v-model="scope.row['gradeValue']"
                        class="inputStyle"
                      />
                    </template>
                    <template v-else-if="item.prop == 'defaultValue'">
                      <el-checkbox
                        v-model="scope.row['defaultValue']"
                      ></el-checkbox>
                    </template>
                    <template v-else-if="item.prop == 'operate'">
                      <el-row :gutter="10">
                        <el-button
                          type="text"
                          @click="multiDel(scope.$row, scope.$index)"
                          >删除
                        </el-button>
                        <el-button
                          type="text"
                          @click="multiUp(scope.$row, scope.$index)"
                          >上移
                        </el-button>
                        <el-button
                          type="text"
                          @click="multiDown(scope.$row, scope.$index)"
                          >下移
                        </el-button>
                      </el-row>
                    </template>
                    <template v-else>{{ scope.row[item.prop] }}</template>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <!--日期时间-->
          <div class="date-type" v-else-if="eleAddForm.elementControl == '6'">
            <el-form-item prop="dateFormat">
              <LFormtTitle label="格式">
                <l-value-domain-emr
                  code="DatetimeFormat"
                  type="select"
                  :value.sync="eleAddForm.dateFormat"
                  placeholder="请选择"
                  clearable
                ></l-value-domain-emr>
              </LFormtTitle>
            </el-form-item>
            <el-form-item prop="isTime">
              <checkboxCode
                :value.sync="eleAddForm.isTime"
                label="是记录时间"
              />
            </el-form-item>
          </div>
          <!--图片-->
          <div class="img-type" v-else-if="eleAddForm.elementControl == '7'">
            <LFormtTitle label="图片类型">
              <el-form-item prop="imgType">
                <l-value-domain-emr
                  code="CareDocGraphic"
                  type="select"
                  :value.sync="eleAddForm.imgType"
                  placeholder="请选择"
                  clearable
                ></l-value-domain-emr>
              </el-form-item>
            </LFormtTitle>
          </div>
          <!-- 表格 -->
          <div class="table-type" v-else-if="eleAddForm.elementControl == '8'">
            <el-form-item prop="tableDisable">
              <el-col :span="24">
                <checkboxCode
                  :value.sync="eleAddForm.tableDisable"
                  label="显示根元素"
                />
              </el-col>
            </el-form-item>
            <el-row>
              <el-form-item class="margin-bottom-10" prop="loadRowsFlag">
                <el-col :span="7">
                  <el-checkbox
                    @change="changeNumberRow"
                    v-model="eleAddForm.loadRowsFlag"
                    >加载固定行数
                  </el-checkbox>
                </el-col>
                <el-col :span="6">
                  <el-input
                    type="number"
                    min="0"
                    :disabled="!eleAddForm.loadRowsFlag"
                    v-model="eleAddForm.loadRowsNum"
                  ></el-input>
                </el-col>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item prop="loadcolumnFlag">
                <el-col :span="7">
                  <el-checkbox
                    @change="changeNumberColumn"
                    v-model="eleAddForm.loadcolumnFlag"
                    >加载固定列数
                  </el-checkbox>
                </el-col>
                <el-col :span="6">
                  <el-input
                    type="number"
                    min="0"
                    :disabled="!eleAddForm.loadcolumnFlag"
                    v-model="eleAddForm.loadColumnsNum"
                  ></el-input>
                </el-col>
              </el-form-item>
            </el-row>
          </div>
        </div>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer clearfix">
      <div class="float-right">
        <el-button
          type="primary"
          @click="addConfirm"
          v-if="eleAddForm.add == '1'"
          >保存并新增
        </el-button>
        <el-button type="primary" @click="addSave" v-if="eleAddForm.add == '1'"
          >保存
        </el-button>
        <el-button type="primary" @click="confirm" v-if="eleAddForm.add == '0'"
          >确认
        </el-button>
        <el-button type="primary" plain @click="cancel">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import {get} from "@/utils/requestEmr";

  import checkboxCode from "./checkboxCode";
  import {saveOrUpdateDocInfo} from "@/api/emrRecord/nursingRecord/docInfoMaintain";
  import {
    saveOrUpdateDocElement,
    getDocElementByPage,
    batchDeleteDocInfo
  } from "@/api/emrRecord/nursingRecord/elementMaintain";

  let unitUrl = '/wdata/dic/single/VitalItemUnit'
  export default {
    name: "docInfoAdd",
    components: {
      checkboxCode
    },
    data() {
      return {
        eleAddForm: {},
        rules: {
          elementControl: [{
            required: true, message: "请选择元素类型", trigger: "change"
          }],
          elementName: [
            {required: true, message: "请输入元素名称", trigger: "blur"}
          ]
        },
        /*单选框table*/
        choosedParams: [
          {
            prop: "orderNumber",
            label: "序号",
            align: "left",
            headerAlign: "left",
            fixed: "left",
            width: "80"
          },
          {
            prop: "showValue",
            label: "显示值",
            align: "left",
            headerAlign: "left",
            fixed: "left",
            width: "80"
          },
          {
            prop: "printValue",
            label: "打印值",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "80"
          },
          {
            prop: "gradeValue",
            label: "分值",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "80"
          },
          {
            prop: "defaultValue",
            label: "默认值",
            align: "center",
            headerAlign: "left",
            fixed: false,
            width: "80"
          },
          {
            prop: "operate",
            label: "操作",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "150"
          }
        ],
        // 小数位数
        numOptions: [{
          label: '0',
          value: 0
        }, {
          label: '1',
          value: 1
        }, {
          label: '2',
          value: 2
        }],
        flag: '0',
        // 后缀集合
        unitData: []
      };
    },
    props: ["form"],
    watch: {
      form: {
        handler(n) {
          this.eleAddForm = {
            ...n
          };
          // 修改时候回填弹窗数据
          if (this.eleAddForm.add == "0" || this.eleAddForm.add == "2") {
            let elementAttribute = this.transformAttr(
              this.eleAddForm.elementAttribute
            );
            this.handleAttr(elementAttribute);

          }
          console.log(this.eleAddForm, "eleAddForm---");
        },
        deep: true,
        immediate: true
      }
    },
    created() {
      this.unitRequest(unitUrl);

    },
    methods: {
      async unitRequest(url) {
        let params = {};

        try {
          let {data} = await get(url, params);
          this.unitData = data;
          if (this.eleAddForm.elementControl === '1') {
            let obj = this.unitData.find(item => item.name === this.eleAddForm.elementSuffname);
            this.$set(this.eleAddForm, 'elementUnit', obj.code)
          }
        } catch (error) {
          this.$message.error(error.msg || '获取单位接口报错')
        }

      },
      changeTextValue(data) {
        if (!data) {
          this.eleAddForm.multiLine = '';
        }
      },
      changeCheckScore(data) {
        if (!data) {
          this.eleAddForm.checkScore = 0;
        }
      },
      changeRadioScore(data) {
        if (!data) {
          this.eleAddForm.radioScore = 0;
        }
      },
      changeNumberColumn(data) {
        if (!data) {
          this.eleAddForm.loadColumnsNum = 0
        }
      },
      changeNumberRow(data) {
        if (!data) {
          this.eleAddForm.loadRowsNum = 0
        }
      },
      changeDiyOption(type, flag) {
        // 下拉单选
        if (type === 'range') {
          if (!flag) this.eleAddForm.radioData = [];
        } else {
          if (!flag) this.eleAddForm.multiData = [];
        }
      },
      // 传参字段转换
      mapParams(obj) {
        // 新增
        let params = {
          id: '',
          elementCode: '',
          elementControl: "", // 元素对应的code
          elementName: "", // 元素名称
          elementShowname: "", // 显示名称
          elementSuffname: "", // 显示后缀 mg
          elementAttribute: []
        };
        let list = [];
        params.id = obj.id || '';
        params.elementCode = obj.elementCode || '';
        params.elementControl = obj.elementControl;
        params.elementName = obj.elementName || "";
        params.elementShowname = obj.elementShowname || "";
        // elementControl
        switch (obj.elementControl) {
          //  0 标签
          case "0":
            params.elementAttribute.push({
              AttrCode: "CDEA0002",
              AttrName: "加载根元素",
              AttrVal: obj.loadEle
            });
            break;
          case "1":
            let unitObj = this.unitData.find(item => item.code == obj.elementUnit)
            params.elementSuffname = obj.elementUnit ? unitObj.name : '';
            params.elementAttribute.push({
              AttrCode: "CDEA0018",
              AttrName: "元素占行数",
              AttrVal: obj.multiLine
            }, {
              AttrCode: "CDEA0019",
              AttrName: "纯数字",
              AttrVal: obj.isNum ? {
                IsNum: '1',
                PointCount: obj.nums,
                InputRange: `${obj.scopeOne}|${obj.scopeTwo}`,
                NormalRange: `${obj.commonScopeOne}|${obj.commonScopeTwo}`
              } : ''
            });
            break;
          // 单选框
          case "2":
            params.elementAttribute.push({
              AttrCode: "CDEA0015",
              AttrName: "显示录入框",
              AttrVal: obj.showInput
            }, {
              AttrCode: "CDEA0007",
              AttrName: "评估分值",
              AttrVal: obj.radioScore
            }, {
              AttrCode: "CDEA0008",
              AttrName: "默认值",
              AttrVal: obj.isChoosed ? '1' : '0'
            }, {
              AttrCode: "CDEA0006",
              AttrName: "打印值",
              AttrVal: `${obj.radioChoosedFalse}|${obj.radioChoosedTrue}`
            });
            break;
          case "3":
            params.elementAttribute.push({
              AttrCode: "CDEA0015",
              AttrName: "显示录入框",
              AttrVal: obj.checkShowInput
            }, {
              AttrCode: "CDEA0007",
              AttrName: "评估分值",
              AttrVal: obj.checkScore
            }, {
              AttrCode: "CDEA0008",
              AttrName: "默认值",
              AttrVal: obj.checkIsChoosed ? '1' : '0'
            }, {
              AttrCode: "CDEA0006",
              AttrName: "打印值",
              AttrVal: `${obj.checkChoosedFalse}|${obj.checkChoosedTrue}`
            });
            break;
          // 下拉单选
          case "4":
            if (obj.range) {
              list = obj.radioData.map((item, index) => {
                return {
                  Sort: index + 1,
                  ShowValue: item.showValue,
                  PrintValue: item.printValue,
                  Score: item.gradeValue,
                  IsDefaultVal: item.defaultValue > -1 ? "1" : "0"
                };
              });
            }
            params.elementAttribute.push({
              AttrCode: "CDEA0004",
              AttrName: "自定义选项",
              AttrVal: list
            });
            break;
          // 下拉多选
          case "5":
            if (obj.multiRange) {
              list = obj.multiData.map((item, index) => {
                return {
                  Sort: index + 1,
                  ShowValue: item.showValue,
                  PrintValue: item.printValue,
                  Score: item.gradeValue,
                  IsDefaultVal: item.defaultValue ? "1" : "0"
                };
              });
            }
            params.elementAttribute.push({
              AttrCode: "CDEA0004",
              AttrName: "自定义选项",
              AttrVal: list
            });
            break;
          // 日期
          case "6":
            params.elementAttribute.push({
              AttrCode: "CDEA0011",
              AttrName: "时间格式",
              AttrVal: obj.dateFormat
            }, {
              AttrCode: "CDEA0010",
              AttrName: "记录时间",
              AttrVal: obj.isTime
            })
            break;
          case "7":
            params.elementAttribute.push({
              AttrCode: "CDEA0016",
              AttrName: "图片格式",
              AttrVal: obj.imgType
            })
            break;
          // 表格
          case "8":
            params.elementAttribute.push({
              AttrCode: "CDEA0002",
              AttrName: "加载根元素",
              AttrVal: obj.tableDisable
            }, {
              AttrCode: "CDEA0003",
              AttrName: "元素占列数",
              AttrVal: obj.loadcolumnFlag ? obj.loadColumnsNum : 0
            }, {
              AttrCode: "CDEA0017",
              AttrName: "加载固定行数",
              AttrVal: obj.loadRowsFlag ? obj.loadRowsNum : 0
            })
            break;
        }
        return params;
      },
      // celementAttribute 转换
      transformAttr(attrObj) {
        let str = attrObj;
        let list = JSON.parse(str);
        return list;
      },
      handleAttr(attrObj) {
        switch (this.eleAddForm.elementControl) {
          case "0":
            this.eleAddForm.loadEle = attrObj.find(item => item.AttrCode).AttrVal;
            break;
          case '1':

            attrObj.forEach((item, index) => {
              if (item.AttrCode === 'CDEA0018') {
                this.$set(this.eleAddForm, "multiLine", item.AttrVal);
                this.$set(this.eleAddForm, "multiLineFlag", item.AttrVal !== '' || Number.parseInt(item.AttrVal) > 0);
              } else if (item.AttrCode === 'CDEA0019') {

                this.$set(this.eleAddForm, 'isNum', item.AttrVal !== '');
                if (item.AttrVal !== '') {
                  let valueList = item.AttrVal.InputRange.split('|');
                  let commonList = item.AttrVal.NormalRange.split('|');
                  this.$set(this.eleAddForm, 'nums', item.AttrVal.PointCount || '');
                  this.$set(this.eleAddForm, 'scopeOne', valueList[0] || '');
                  this.$set(this.eleAddForm, 'scopeTwo', valueList[1] || '');
                  this.$set(this.eleAddForm, 'commonScopeOne', commonList[0] || '');
                  this.$set(this.eleAddForm, 'commonScopeTwo', commonList[1] || '');
                }

              }
            })
            break;
          case '2':
            attrObj.forEach((item, index) => {
              if (item.AttrCode === 'CDEA0015') {
                this.eleAddForm.showInput = item.AttrVal;
              } else if (item.AttrCode === 'CDEA0007') {
                // 强制vue 检测 el-check中的选中值变化
                this.$set(this.eleAddForm, 'isChoosedScore', Number.parseInt(item.AttrVal) > 0);
                this.$set(this.eleAddForm, 'radioScore', item.AttrVal);
              } else if (item.AttrCode === 'CDEA0008') {
                this.$set(this.eleAddForm, 'isChoosed', item.AttrVal === '1');
              } else if (item.AttrCode === 'CDEA0006') {
                let list = item.AttrVal.split('|');
                this.$set(this.eleAddForm, 'radioChoosedFalse', list[0] || '');
                this.$set(this.eleAddForm, 'radioChoosedTrue', list[1] || '');
              }
            })
            break;
          case '3':
            attrObj.forEach((item, index) => {
              if (item.AttrCode === 'CDEA0015') {
                this.eleAddForm.checkShowInput = item.AttrVal;
              } else if (item.AttrCode === 'CDEA0007') {
                // 强制vue 检测 el-check中的选中值变化
                this.$set(this.eleAddForm, 'checkIsChoosedScore', Number.parseInt(item.AttrVal) > 0);
                this.$set(this.eleAddForm, 'checkScore', item.AttrVal);
              } else if (item.AttrCode === 'CDEA0008') {
                this.$set(this.eleAddForm, 'checkIsChoosed', item.AttrVal === '1');
              } else if (item.AttrCode === 'CDEA0006') {
                let list = item.AttrVal.split('|');
                this.$set(this.eleAddForm, 'checkChoosedFalse', list[0] || '');
                this.$set(this.eleAddForm, 'checkChoosedTrue', list[1] || '');
              }
            })
            break;
          case '4':
            let radioOptions = attrObj[0];
            // 自定义选项
            if (radioOptions.AttrCode === 'CDEA0004') {
              if (Array.isArray(radioOptions.AttrVal) && radioOptions.AttrVal.length > 0) {
                this.eleAddForm.range = true;
                this.eleAddForm.radioData = radioOptions.AttrVal.map((item, index) => {
                  return {
                    defaultValue: item.IsDefaultVal == '0' ? -1 : index,
                    showValue: item.ShowValue,
                    printValue: item.PrintValue,
                    gradeValue: item.Score
                  }
                })
              } else {
                this.eleAddForm.range = false;
                this.eleAddForm.radioData = [];
              }
            }
            break;
          case '5':
            let multiOptions = attrObj[0];
            // 自定义选项
            if (multiOptions.AttrCode === 'CDEA0004') {
              if (Array.isArray(multiOptions.AttrVal) && multiOptions.AttrVal.length > 0) {
                this.eleAddForm.multiRange = true;
                this.eleAddForm.multiData = multiOptions.AttrVal.map((item, index) => {
                  return {
                    defaultValue: item.IsDefaultVal == '1',
                    showValue: item.ShowValue,
                    printValue: item.PrintValue,
                    gradeValue: item.Score
                  }
                })
              } else {
                this.eleAddForm.multiRange = false;
                this.eleAddForm.multiData = [];
              }
            }
            break;
          case '6':
            attrObj.forEach((item, index) => {
              // 时间格式
              if (item.AttrCode === 'CDEA0011') {
                this.eleAddForm.dateFormat = item.AttrVal
              } else if (item.AttrCode === 'CDEA0010') {
                this.eleAddForm.isTime = item.AttrVal
              }
            })
            break;
          case '7':
            let imgObj = attrObj[0];
            if (imgObj.AttrCode === 'CDEA0016') {
              this.eleAddForm.imgType = imgObj.AttrVal;
            }

            break;
          case '8':
            attrObj.forEach((item, index) => {
              if (item.AttrCode === 'CDEA0002') {
                this.eleAddForm.tableDisable = item.AttrVal;
              } else if (item.AttrCode === 'CDEA0003') {
                // 强制vue 检测 el-check中的选中值变化
                this.$set(this.eleAddForm, 'loadcolumnFlag', Number.parseInt(item.AttrVal) > 0);
                this.$set(this.eleAddForm, 'loadColumnsNum', item.AttrVal);
              } else if (item.AttrCode === 'CDEA0017') {
                this.$set(this.eleAddForm, 'loadRowsFlag', Number.parseInt(item.AttrVal) > 0);
                this.$set(this.eleAddForm, 'loadRowsNum', item.AttrVal);
              }
            })
            break;
        }
        console.log(this.eleAddForm, 'this.eleAddForm。。。')
      },
      // 表格内单选框 value 发生变化
      changeRadioValue(index) {
        // 遍历列表
        this.eleAddForm.radioData.forEach((item, idx) => {
          if (idx != index) {
            item.defaultValue = -1;
          }
        });
      },
      // 切换元素类型 新增
      changeEleType(data) {
        // 当元素是标签的时候
        if (data === "0") {
          this.eleAddForm = Object.assign({}, this.eleAddForm, {
            elementControl: data,
            loadEle: "1"
          });
          // 文本框
        } else if (data === "1") {
          this.eleAddForm = Object.assign({}, this.eleAddForm, {
            elementControl: data,
            multiLineFlag: false,
            multiLine: '',
            isNum: false,
            nums: '',
            scopeOne: '',
            scopeTwo: '',
            commonScopeOne: '',
            commonScopeTwo: ''
          });
          // 单选框
        } else if (data === "2") {
          this.eleAddForm = Object.assign({}, this.eleAddForm, {
            elementControl: data,
            showInput: '0',
            radioScore: '',
            isChoosedScore: false,
            isChoosed: false,
            radioChoosedFalse: '',
            radioChoosedTrue: ''
          });
          // 当 元素类型是 下拉单选的时候
        }// 复选框
        else if (data === "3") {
          this.eleAddForm = Object.assign({}, this.eleAddForm, {
            elementControl: data,
            checkShowInput: '0',
            checkScore: '',
            checkIsChoosedScore: false,
            checkIsChoosed: false,
            checkChoosedFalse: '',
            checkChoosedTrue: ''
          });
          // 当 元素类型是 下拉单选的时候
        } else if (data === "4") {
          // 重置eleAddFormmultiData 对象
          this.eleAddForm = Object.assign({}, this.eleAddForm, {
            elementControl: data,
            range: false,
            radioData: []
          });
        } else if (data === "5") {
          this.eleAddForm = Object.assign({}, this.eleAddForm, {
            elementControl: data,
            multiRange: false,
            multiData: []
          });
        } else if (data === "8") {
          this.eleAddForm = Object.assign({}, this.eleAddForm, {
            elementControl: data,
            tableDisable: '1',
            loadRowsFlag: true,
            loadRowsNum: 1,
            loadcolumnFlag: true,
            loadColumnsNum: 1
          });
        } else {
          this.eleAddForm = Object.assign({}, this.eleAddForm, {
            elementControl: data
          });
        }

        console.log(this.eleAddForm, "changeEleType");
      },
      //新增接口
      async add(flag) {
        await this.$refs["eleAddForm"].validate(async valid => {
          if (valid) {
            this.$showLoading();
            try {
              console.log(this.eleAddForm, 'this.eleAddForm')
              let params = this.mapParams(this.eleAddForm);
              console.log(params, "...form");
              let data = await saveOrUpdateDocElement(params);
              if (data.code == "1") {
                this.$message("保存成功");
                this.flag = "1";
                await this.$refs["eleAddForm"].resetFields();
                if(flag === 1){
                  await this.$emit("eleAddConfirmFalse", false);
                }else if(flag === 2){
                  await this.$emit("eleAddConfirm", false);
                }
              } else {
                this.$message.error(data.msg || "保存失败");
                this.flag = "0";
              }
              this.$hideLoading();
            } catch (error) {
              console.log(error)
              this.$hideLoading();
              this.$message.error(error.msg || "保存失败");
              this.flag = "0";
            }
          } else {
            this.flag = "0";
          }
        });
      },
      //保存并新增
      async addConfirm() {
        let flag = 1;
        await this.add(flag);
      },
      //保存
      async addSave() {
        let flag = 2;
        await this.add(flag);
      },
      //确认修改接口
      async confirm() {
        let flag = 2;
        await this.add(flag);
      },
      //取消
      cancel() {
        this.$emit("eleAddCancel", false);
        this.$refs["eleAddForm"].resetFields();
      },
      //单选框属性表格操作
      radioDataAdd() {
        // 没有选择自定义属性则不添加
        if (!this.eleAddForm.range) {
          return;
        }

        this.eleAddForm.radioData.push({
          defaultValue: -1,
          showValue: '',
          printValue: '',
          gradeValue: ''
        });

      },
      //单选框表格删除、上移、下移
      radioDel(row, index) {
        this.delCommon(this.eleAddForm.radioData, index);
      },
      radioUp(row, index) {
        this.upCommon("radioData", index);
      },
      radioDown(row, index) {
        this.downCommon("radioData", index);
      },
      //多选框属性表格操作
      multiDataAdd() {
        // 没有选择自定义属性则不添加
        if (!this.eleAddForm.multiRange) return;

        this.eleAddForm.multiData.push({
          defaultValue: false,
          showValue: '',
          printValue: '',
          gradeValue: ''
        });
      },
      //单选框表格删除、上移、下移
      multiDel(row, index) {
        this.delCommon(this.eleAddForm.multiData, index);
      },
      multiUp(row, index) {
        this.upCommon("multiData", index);
      },
      multiDown(row, index) {
        this.downCommon("multiData", index);
      },
      /*start-表格删除、上移、下移公共方法*/
      delCommon(arr, index) {
        this.$delete(arr, index);
      },
      upCommon(arr, index) {
        let radioData = [...this.eleAddForm[arr]];
        if (index != 0) {
          radioData[index] = radioData.splice(index - 1, 1, radioData[index])[0];
        } else {
          radioData.push(radioData.shift());
        }
        this.eleAddForm[arr] = [...radioData];
      },
      downCommon(arr, index) {
        let radioData = [...this.eleAddForm[arr]];
        if (index != radioData.length - 1) {
          radioData[index] = radioData.splice(index + 1, 1, radioData[index])[0];
        } else {
          radioData.unshift(radioData.splice(index, 1)[0]);
        }
        this.eleAddForm[arr] = [...radioData];
      }
      /*end-表格删除、上移、下移公共方法*/
    }
  };
</script>

<style scoped lang="scss">
.eleAdd {
  .margin-bottom-20 {
    margin-bottom: 20px;
  }

  .inputStyle {
    width: 100%;
  }

  .el-form {
    width: 100%;
  }

  .margin-bottom-10 {
    margin-bottom: 10px;
  }

  .cont {
    padding: 0 20px 40px 20px;
    max-height: 625px;
    overflow-y: auto;

    .sub-attr {
      .text-type {
        .text-type-cont {
          padding: 10px 20px 20px 20px;
          background: $l-color-bgcolor-18;
          border-radius: 2px;
        }
      }

      .radio-type {
        .radio-type-table {
        }
      }
    }
  }

  .common-padding {
    padding: 0 14px;
  }

  /deep/ .el-radio__label {
    font-size: 0;
  }

  .dialog-footer {
    padding: 20px;
    border-top: 1px solid $l-color-bgcolor-11;
  }
}
</style>
