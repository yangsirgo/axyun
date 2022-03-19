<template>
  <el-table-column
    :label="handleNameShow(eleList)"
    :prop="eleList.eleId"
    align="center"
  >
    <template
      v-for="(item, index) in eleList.eleList"
    >
    <!-- v-if="showtableItem(item)" -->
      <eleTableColums
        v-if="item.eleList && item.eleList.length"
        :key="index"
        :eleList="item"
        :tableData="tableData"
        @saveFunc="saveFunc"
      ></eleTableColums>
      <template v-else>
        <el-table-column
          v-if="item.elementBaseName == '单选元素' && item.valueLst.length"
          :key="index"
          :label="handleNameShow(item)"
          :prop="item.eleId"
          :min-width="item.width"
          :resizable="item.resizable"
          header-align="center"
          align="center"
        >
          <template v-if="item.valueLst.length == 1 && showtableItem(item)" slot-scope="scope">
            <div @click="valueClick(item, scope.$index, index)">
              <el-radio
                v-model="scope.row[item.eleId].eleValue"
                @click.native="
                  handlerRadioClick(
                    eleList,
                    scope.row,
                    scope.$index,
                    item,
                    index,
                    $event,
                    -1
                  )
                "
                :label="item.valueLst[0].vMean"
                :disabled="
                  item.commonAttributeDto.checkReadonly != '0' || !item.enable
                "
                @change="
                  selectChange(
                    eleList,
                    scope.row,
                    scope.$index,
                    item,
                    index,
                    $event
                  )
                "
                @keyup.tab.native="valueClick(item, scope.$index, index)"
              ></el-radio>
            </div>
          </template>
          <el-table-column
            v-if="item.valueLst.length > 1"
            v-for="(value, key) in item.valueLst"
            :key="key"
            :prop="item.eleId"
            :label="value.vMean"
            :min-width="value.width"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <template v-if="showtableItem(item)">
                <div @click="valueClick(item, scope.$index, index)">
                  <el-radio
                    @click.native="
                      handlerRadioClick(
                        eleList,
                        scope.row,
                        scope.$index,
                        item,
                        index,
                        $event,
                        key
                      )
                    "
                    v-model="scope.row[item.eleId].eleValue"
                    :label="value.vMean"
                    :disabled="
                      item.commonAttributeDto.checkReadonly != '0' ||
                        !item.enable
                    "
                    @change="
                      selectChange(
                        eleList,
                        scope.row,
                        scope.$index,
                        item,
                        index,
                        $event
                      )
                    "
                    @keyup.tab.native="valueClick(item, scope.$index, index)"
                  ></el-radio>
                </div>
              </template>
              <template v-else></template>
            </template>
          </el-table-column>
          <!-- 只有一个选项 代表这个选项就是当前元素的值 -->
        </el-table-column>
        <el-table-column
          v-else-if="item.elementBaseName == '多选元素' && item.valueLst.length"
          :key="index"
          :label="handleNameShow(item)"
          :prop="item.eleId"
          :min-width="item.width"
          :resizable="item.resizable"
          header-align="center"
          align="center"
        >
          <!-- 一个选项的时候 -->
          <template slot-scope="scope" v-if="item.valueLst.length == 1  && showtableItem(item)">
            <div @click="valueClick(item, scope.$index, index)">
              <el-checkbox
                v-model="scope.row[item.eleId].eleValue"
                :label="item.valueLst[0].vMean"
                :disabled="
                  item.commonAttributeDto.checkReadonly != '0' || !item.enable
                "
                @change="
                  selectChange(
                    eleList,
                    scope.row,
                    scope.$index,
                    item,
                    index,
                    $event
                  )
                "
                @keyup.tab.native="valueClick(item, scope.$index, index)"
              ></el-checkbox>
            </div>
          </template>
          <el-table-column
            v-if="item.valueLst.length > 1"
            v-for="(value, key) in item.valueLst"
            :key="key"
            :prop="item.eleId"
            :label="value.vMean"
            :min-width="value.width"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <template v-if="showtableItem(item)">
                <div @click="valueClick(item, scope.$index, index)">
                  <el-checkbox
                    v-model="scope.row[item.eleId].eleValue"
                    :label="value.vMean"
                    :disabled="
                      item.commonAttributeDto.checkReadonly != '0' ||
                        !item.enable
                    "
                    @change="
                      selectChange(
                        eleList,
                        scope.row,
                        scope.$index,
                        item,
                        index,
                        $event
                      )
                    "
                    @keyup.tab.native="valueClick(item, scope.$index, index)"
                  ></el-checkbox>
                </div>
              </template>
              <template v-else></template>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
          v-else-if="item.elementBaseName == '有无元素'"
          :key="index"
          :label="handleNameShow(item)"
          :prop="item.eleId"
          :min-width="item.width"
          :resizable="item.resizable"
          header-align="center"
          align="center"
        >
          <el-table-column
            v-for="(value, key) in item.proprietaryAttributeVoLst"
            :key="key"
            v-if="
              item.proprietaryAttributeVoLst.length &&
                (value.proprietaryCode == '0800' ||
                  value.proprietaryCode == '0801')
            "
            :prop="item.eleId"
            :label="value.proprietaryContent"
            :min-width="value.width"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <template v-if="showtableItem(item)">
                <div @click="valueClick(item, scope.$index, index)">
                  <el-radio
                    v-model="scope.row[item.eleId].eleValue"
                    @click.native="
                      handlerRadioClick(
                        eleList,
                        scope.row,
                        scope.$index,
                        item,
                        index,
                        $event,
                        -1
                      )
                    "
                    :label="value.proprietaryContent"
                    :disabled="
                      item.commonAttributeDto.checkReadonly != '0' ||
                        !item.enable
                    "
                    @change="
                      selectChange(
                        eleList,
                        scope.row,
                        scope.$index,
                        item,
                        index,
                        $event
                      )
                    "
                    @keyup.tab.native="valueClick(item, scope.$index, index)"
                  ></el-radio>
                </div>
              </template>
              <template v-else></template>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
          v-else
          :key="index"
          :label="handleNameShow(item)"
          :prop="item.eleId"
          :min-width="item.width"
          :resizable="item.resizable"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <template v-if="showtableItem(item)">
              <template
                v-if="
                  item.elementBaseName == '标签元素' &&
                    item.commonAttributeDto.nameStyle !== 'hidden'
                "
                >{{ scope.row[item.eleId].eleValue }}</template
              >
              <!-- TODO:思考 标签元素下  是否有要加对应的 input 输入框 -->
              <template v-else-if="item.elementBaseName == '数字元素'">
                <div @click="valueClick(item, scope.$index, index)" style="display:flex;">
                  <div style="flex: 1;">
                    <el-input-number
                      v-model="scope.row[item.eleId].eleValue"
                      controls-position="right"
                      class="width100"
                      :disabled="
                        item.commonAttributeDto.checkReadonly != '0' ||
                          !item.enable
                      "
                      :max="item.maxLengthText"
                      :min="item.minLengthText"
                      :precision="item.precision || 0"
                      @change="inputChange($event)"
                      @focus="inputFocus(item, scope.$index, $event)"
                      @keyup.tab.native="valueClick(item, scope.$index, index)"
                    ></el-input-number>
                  </div>
                  <span style="padding:0 5px" v-if="item.unitShow === '1' && item.unit !== '' && item.unit !== undefined">{{item.unit}}</span>
                </div>
              </template>
              <template
                v-else-if="
                  item.elementBaseName == '文本元素' ||
                    item.elementBaseName == '基本元素'
                "
              >
                <div @click="valueClick(item, scope.$index, index)">
                  <el-input
                    v-model="scope.row[item.eleId].eleValue"
                    type="text"
                    class="width100"
                    :disabled="
                    item.elementBaseName == '基本元素' ||
                      (item.commonAttributeDto.checkReadonly != '0' ||
                        !item.enable)
                    "
                    :maxlength="item.maxLengthText"
                    :minlength="item.minLengthText"
                    :show-password="
                      item.elementCode &&
                        item.commonAttributeDto.checkSecret == '1'
                    "
                    @input="inputChange($event)"
                    @focus="inputFocus(item, scope.$index, $event)"
                    @keyup.tab.native="valueClick(item, scope.$index, index)"
                  ></el-input>
                </div>
              </template>
              <template v-else-if="item.elementBaseName == '有无元素'">
                <div @click="valueClick(item, scope.$index, index)">
                  <el-radio-group
                    v-model="scope.row[item.eleId].eleValue"
                    :disabled="
                      item.commonAttributeDto.checkReadonly != '0' || !item.enable
                    "
                    @change="
                      selectChange(
                        eleList,
                        scope.row,
                        scope.$index,
                        item,
                        index,
                        $event
                      )
                    "
                    @keyup.tab.native="valueClick(item, scope.$index, index)"
                  >
                    <el-radio
                      :label="value.proprietaryContent"
                      @click.native="
                        handlerRadioClick(
                          eleList,
                          scope.row,
                          scope.$index,
                          item,
                          index,
                          $event,
                          -1
                        )
                      "
                      v-for="(value, key) in item.proprietaryAttributeVoLst"
                      :key="key"
                      v-if="
                        value.proprietaryCode == '0800' ||
                          value.proprietaryCode == '0801'
                      "
                      >{{ value.proprietaryContent }}</el-radio
                    >
                  </el-radio-group>
                 </div> 
              </template>
              <template v-else-if="item.elementBaseName == '单选元素'">
                <div
                  v-if="!item.valueLst.length"
                  @click="valueClick(item, scope.$index, index)"
                >
                  <el-radio
                    @click.native="
                      handlerRadioClick(
                        eleList,
                        scope.row,
                        scope.$index,
                        item,
                        index,
                        $event,
                        -1
                      )
                    "
                    v-model="scope.row[item.eleId].eleValue"
                    :label="index + 1"
                    :disabled="
                      item.commonAttributeDto.checkReadonly != '0' ||
                        !item.enable
                    "
                    @change="
                      selectChange(
                        eleList,
                        scope.row,
                        scope.$index,
                        item,
                        index,
                        $event
                      )
                    "
                    @keyup.tab.native="valueClick(item, scope.$index, index)"
                  ></el-radio>
                </div>
                <div
                  v-else
                  class="clearfix"
                  @click="valueClick(item, scope.$index, index)"
                >
                  >
                  <div class="float-left" style="margin-right: 20px">
                    {{ item.elementName }}：
                  </div>
                  <div class="float-left">
                    <el-radio-group
                      v-model="scope.row[item.eleId].eleValue"
                      :disabled="
                        item.commonAttributeDto.checkReadonly != '0' ||
                          !item.enable
                      "
                      @change="
                        selectChange(
                          eleList,
                          scope.row,
                          scope.$index,
                          item,
                          index,
                          $event
                        )
                      "
                      @keyup.tab.native="valueClick(item, scope.$index, index)"
                    >
                      <el-radio
                        :label="value.vMean"
                        v-for="(value, key) in item.valueLst"
                        @click.native="
                          handlerRadioClick(
                            eleList,
                            scope.row,
                            scope.$index,
                            item,
                            index,
                            $event,
                            key
                          )
                        "
                        :key="key"
                        >{{ value.vMean }}</el-radio
                      >
                    </el-radio-group>
                  </div>
                </div>
              </template>
              <template v-else-if="item.elementBaseName == '多选元素'">
                <div
                  v-if="!item.valueLst.length"
                  @click="valueClick(item, scope.$index, index)"
                >
                  <el-checkbox
                    v-model="scope.row[item.eleId].eleValue"
                    :disabled="
                      item.commonAttributeDto.checkReadonly != '0' ||
                        !item.enable
                    "
                    @change="
                      selectChange(
                        eleList,
                        scope.row,
                        scope.$index,
                        item,
                        index,
                        $event
                      )
                    "
                    @keyup.tab.native="valueClick(item, scope.$index, index)"
                  ></el-checkbox>
                </div>
                <div
                  v-else
                  class="clearfix"
                  @click="valueClick(item, scope.$index, index)"
                >
                  >
                  <div class="float-left" style="margin-right: 20px">
                    {{ item.elementName }}：
                  </div>
                  <div class="float-left">
                    <el-checkbox-group
                      v-model="scope.row[item.eleId].eleValue"
                      :disabled="
                        item.commonAttributeDto.checkReadonly != '0' ||
                          !item.enable
                      "
                      @change="
                        selectChange(
                          eleList,
                          scope.row,
                          scope.$index,
                          item,
                          index,
                          $event
                        )
                      "
                      @keyup.tab.native="valueClick(item, scope.$index, index)"
                    >
                      <el-checkbox
                        :label="value.vMean"
                        v-for="(value, key) in item.valueLst"
                        :key="key"
                        >{{ value.vMean }}</el-checkbox
                      >
                    </el-checkbox-group>
                  </div>
                </div>
              </template>
              <template v-else-if="item.elementBaseName == '单选下拉元素'">
                <div
                  class="width100"
                  @click.capture="valueClick(item, scope.$index, index)"
                >
                  <el-select
                    v-model="scope.row[item.eleId].eleValue"
                    class="width100"
                    :disabled="
                      item.commonAttributeDto.checkReadonly != '0' ||
                        !item.enable
                    "
                    filterable
                    clearable
                    :allow-create="item.commonAttributeDto.checkEdit === '1'"
                    @change="
                      selectChange(
                        eleList,
                        scope.row,
                        scope.$index,
                        item,
                        index,
                        $event
                      )
                    "
                    @focus="inputFocus(item, scope.$index, $event)"
                    @keyup.tab.native="valueClick(item, scope.$index, index)"
                  >
                    <el-option
                      v-for="(val, key) in item.valueLst"
                      :key="key"
                      :label="val.vMean"
                      :value="val.vMean"
                    ></el-option>
                  </el-select>
                </div>
              </template>
              <template v-else-if="item.elementBaseName == '多选下拉元素'">
                <div
                  class="width100"
                  @click.capture="valueClick(item, scope.$index, index)"
                >
                  <el-select
                    v-model="scope.row[item.eleId].eleValue"
                    class="width100"
                    multiple
                    :disabled="
                      item.commonAttributeDto.checkReadonly != '0' ||
                        !item.enable
                    "
                    filterable
                    clearable
                    :allow-create="item.commonAttributeDto.checkEdit === '1'"
                    @change="
                      selectChange(
                        eleList,
                        scope.row,
                        scope.$index,
                        item,
                        index,
                        $event
                      )
                    "
                    @focus="inputFocus(item, scope.$index, $event)"
                    @keyup.tab.native="valueClick(item, scope.$index, index)"
                  >
                    <el-option
                      v-for="(val, key) in item.valueLst"
                      :key="key"
                      :label="val.vMean"
                      :value="val.vMean"
                    ></el-option>
                  </el-select>
                </div>
              </template>
              <template v-else-if="item.elementBaseName == '日期元素'">
                <div
                  class="width100"
                  @click.capture="valueClick(item, scope.$index, index)"
                >
                  <template v-if="item.dateFormatType === '3'">
                    <el-time-picker
                      v-model="scope.row[item.eleId].eleValue"
                      :disabled="
                        item.commonAttributeDto.checkReadonly != '0' ||
                          !item.enable
                      "
                      :format="item.dateFormat"
                      :value-format="item.dateFormat"
                      class="width100"
                      clearable
                      :placeholder="item.commonAttributeDto.placeholderText"
                      @keyup.tab.native="valueClick(item, scope.$index, index)"
                    ></el-time-picker>
                  </template>
                  <template v-else>
                    <el-date-picker
                      :type="item.dateFormatType === '2' ? 'date' : 'datetime'"
                      v-model="scope.row[item.eleId].eleValue"
                      :disabled="
                        item.commonAttributeDto.checkReadonly != '0' ||
                          !item.enable
                      "
                      :format="item.dateFormat"
                      :value-format="item.dateFormat"
                      class="width100"
                      clearable
                      :placeholder="item.commonAttributeDto.placeholderText"
                      @keyup.tab.native="valueClick(item, scope.$index, index)"
                    ></el-date-picker>
                  </template>
                </div>
              </template>
              <template v-else-if="item.elementBaseName == '签名元素'">
                <div
                  class="width100"
                  @click.capture="valueClick(item, scope.$index, index)"
                >
                  <retrieve-select
                    :eleValue.sync="scope.row[item.eleId].eleValue"
                    :options="item.nursingList"
                    :disabled="
                      item.commonAttributeDto.checkReadonly != '0' ||
                        !item.enable
                    "
                    @change="
                      selectChange(
                        eleList,
                        scope.row,
                        scope.$index,
                        item,
                        index,
                        $event
                      )
                    "
                    @focus="inputFocus(item, scope.$index, $event)"
                    @keyup.tab.native="valueClick(item, scope.$index, index)"
                  ></retrieve-select>
                </div>
              </template>
              <template v-else></template>
            </template>
            <template v-else></template>
          </template>
        </el-table-column>
      </template>
    </template>
    <template>
      <ModifyEleAttr
        ref="modifyEleAttr"
        :dialogVisible.sync="dialogVisible"
        :createDialogVisible="false"
        :modifyDialogVisible="true"
        :eleDetailInfoProp="eleDetailInfoProp"
        @dialogClose="dialogClose"
        @updateItemData="updateItemData"
      />
    </template>
  </el-table-column>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import eleTableColums from "../components/eleTableColums";

import ModifyEleAttr from "@/views/emrRecord/emr/component/modifyEleAttr.vue";
import { deepClone } from "@/utils/index";

export default {
  name: "eleTableColums",
  components: {
    eleTableColums,
    ModifyEleAttr
  },
  props: ["eleList", "tableData"],
  inject: {
    toolValue: {
      default: () => {
        return () => {};
      }
    },
    checkedElement: {
      default: () => {
        return false;
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      eleDetailInfoProp: {},
      modifyEleAttrProps: {},

      nursingTreeDataSave: [],
      //当前元素
      currentControl: {},
      currentIndex: 0,
      //出入量弹框
      inQuantityDialog: false,
      outQuantityDialog: false,
      //出入量eleId集合
      inQuantityData: [],
      outQuantityData: [],
      inQuantityDataObj: {},
      outQuantityDataObj: {},
      //出入量弹框表格data
      inTableDataProp: {},
      outTableDataProp: {},
      //出入量弹框表格表头数据
      inTableParams: [],
      outTableParams: []
    };
  },
  watch: {
    nursingTreeData: {
      handler(val) {
        this.nursingTreeDataSave = [];
        if (val && val.length > 0) {
          this.nursingTreeDataSave = [...val];
        }
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    ...mapGetters("nurseDocument", ["nursingTreeData"])
  },
  mounted() {
    // console.log(
    //   this.eleList,
    //   this.nursingTreeData,
    //   this.tableData,
    //   "this.eleList,this. nursingTreeData,this.tableData"
    // );
  },
  methods: {
    ...mapActions({
      changeNursingTreeData: "nurseDocument/changeNursingTreeData",
      changeInData: "nurseDocument/changeInData",
      changeOutData: "nurseDocument/changeOutData",
      changeCurrentIndex: "nurseDocument/changeCurrentIndex",
      changeCurrentCtr: "nurseDocument/changeCurrentCtr"
    }),
    dialogClose() {
      this.dialogVisible = false;
    },
    itemValueClick(data) {
      if (this.checkedElement()) {
        this.dialogVisible = true;
        this.eleDetailInfoProp = {};
        // 传入的值是  默认的属性列表 不是可以编辑修改的
        // 把对应的recordValueJson 下面的数据传入
        let obj = deepClone(data.item);
        // console.log(obj, "objobjobj");
        this.eleDetailInfoProp = obj;
        this.modifyEleAttrProps = {
          itemIndex: data.itemIndex,
          index: data.index
        };
      }
    },
    // 执行更新操作
    updateItemData(data) {
      this.nursingTreeDataSave[0].isModify = true;
      this.changeNursingTreeData(this.nursingTreeDataSave);
      // 替换数据
      // 修改recordValueJson对应的数据
      // console.log(this.eleList, this.modifyEleAttrProps, data, "this.eleList");
      // TODO 修改eleList对应的数据
      this.$set(this.eleList.eleList, this.modifyEleAttrProps.index, data);

      // 执行保存操作
      this.dialogVisible = false;
      this.$emit("saveFunc");
    },

    showtableItem(item) {
      return (
        item.eleId &&
        item.commonAttributeDto.checkHidden === "0" &&
        item.visible
      );
    },
    handleNameShow(list) {
      return list.elementBaseName == "基本元素" ||
        list.commonAttributeDto.nameStyle !== "hidden"
        ? (list.elementName || list.commonAttributeDto.placeholderText)
        : "";
    },
    saveFunc() {
      // 执行保存操作
      this.$emit("saveFunc");
    },
    valueClick(item, $index, index) {
      // console.log(item, this.currentIndex, "123", "iiiiiidddd");
      if (this.checkedElement()) {
        this.changeCurrentIndex(this.currentIndex);
      }

      this.currentControl = item;
      this.currentIndex = $index;
      this.itemValueClick({ item, itemIndex: $index, index });
    },
    handlerRadioClick(treeData, row, index, item, itemIndex, e, key) {
      if (e.target.tagName !== "INPUT") {
        return;
      }

      let tableDataItem = this.tableData[index];
      let value = tableDataItem[item.eleId].eleValue;
      if (key >= 0) {
        let vMean = item.valueLst[key].vMean;

        // console.log(value, vMean, key, item);
        if (value && value === vMean) {
          this.$set(row[item.eleId], "eleValue", "");
          this.selectChange(treeData, row, index, item, itemIndex, e);
        }
      } else {
        // 处理单选元素 无子选项的情况
        if (value) {
          this.$set(row[item.eleId], "eleValue", false);
          this.selectChange(treeData, row, index, item, itemIndex, e);
        }
      }
    },
    //控制单选框
    // eslint-disable-next-line complexity
    selectChange(treeData, row, index, item, itemIndex, e) {
      this.$forceUpdate();
      //数值改变加标识
      this.$set(this.tableData[this.currentIndex], "isModify", true);
      let tableDataItem = this.tableData[index];
      let obj = tableDataItem[item.eleId];
      let eleEventList = this.nursingTreeDataSave[0].eleEventList;
      if (
        item.elementBaseName === "单选元素" ||
        item.elementBaseName === "多选元素" ||
        item.elementBaseName === "单选下拉元素" ||
        item.elementBaseName === "多选下拉元素"
      ) {
        // 单选和多选 元素没有子项
        if (!item.valueLst.length) {
          for (let i in tableDataItem) {
            // 单选元素进行互斥
            if (
              item.elementBaseName === "单选元素" &&
              tableDataItem[i].parentId == obj.parentId &&
              i != item.eleId
            ) {
              this.$set(tableDataItem[i], "eleValue", "");
            }
          }
        }
      }
      /* else if (item.elementBaseName === "单选下拉元素") {
        if (
          item.commonAttributeDto.checkEdit === "1" &&
          row[item.eleId].eleValue !== "" &&
          row[item.eleId].eleValue !== undefined
        ) {
          let options = [];
          for (let i in item.valueLst) {
            this.$set(options, options.length, item.valueLst[i]["vCode"]);
          }
          if (options.indexOf(row[item.eleId].eleValue) < 0) {
            this.$set(item.valueLst, item.valueLst.length, {
              vCode: row[item.eleId].eleValue,
              vMean: row[item.eleId].eleValue
            });
          }
        }
      } else if (item.elementBaseName === "多选下拉元素") {
        if (
          item.commonAttributeDto.checkEdit === "1" &&
          row[item.eleId].eleValue.length
        ) {
          let options = [];
          for (let i in item.valueLst) {
            this.$set(options, options.length, item.valueLst[i]["vCode"]);
          }
          for (let i in row[item.eleId].eleValue) {
            if (options.indexOf(row[item.eleId].eleValue[i]) < 0) {
              this.$set(item.valueLst, item.valueLst.length, {
                vCode: row[item.eleId].eleValue[i],
                vMean: row[item.eleId].eleValue[i]
              });
            }
          }
        }
      } */
      this.inputChange(row[item.eleId].eleValue, e);
    },
    // 计算总分展示逻辑
    // eslint-disable-next-line complexity
    handleTotleScore(eveItem, totalVal) {
      let eveList = eveItem.EveList;
      let totalRadioVal = 0;
      let totalCheckboxVal = 0;
      for (let j in eveList) {
        this.findCircle(eveList[j], function(item1) {
          // 找出是哪个单选选项被选中
          let data = item1.eleValue;
          for (let k in item1.valueLst) {
            if (item1.elementBaseName === "单选元素") {
              if (data == item1.valueLst[k].vMean) {
                let score = item1.valueLst[k].score - 0;
                totalRadioVal += score;
              }
            } else if (item1.elementBaseName === "多选元素") {
              Array.isArray(data) &&
                data.forEach((dataItem, index) => {
                  if (dataItem == item1.valueLst[k].vMean) {
                    let score = item1.valueLst[k].score - 0;
                    totalCheckboxVal += score;
                  }
                });
            }
          }
        });
      }
      totalVal += totalRadioVal;
      totalVal += totalCheckboxVal;

      this.findCircle(eveItem.EveTarget, function(item1) {
        item1.eleValue = totalVal;
      });
    },
    // eslint-disable-next-line complexity
    inputChange(value, e) {
      this.$forceUpdate();
      //数值改变加标识
      this.$set(this.tableData[this.currentIndex], "isModify", true);
      let eleEventList = this.nursingTreeDataSave[0].eleEventList;
      for (let i in eleEventList) {
        let item = eleEventList[i];
        if (!item.EveList || !item.EveList.length) {
          continue;
        }
        let indexof = item.EveList.indexOf(this.currentControl.eleId);
        if (indexof > -1) {
          if (item.EveCode == "CDEE_BMI") {
            let BMIVal = "0.00";
            for (let j in item.EveList) {
              // BMI 只有两个计算元素
              if (item.EveList[j] !== this.currentControl.eleId) {
                this.findCircle(item.EveList[j], function(item0) {
                  let data = item0.eleValue;
                  if (data) {
                    let height, weight;
                    // 体重是 第一项  身高是第二项
                    if (indexof == 0) {
                      height =
                        item.EveListObj[1].unit === "m"
                          ? Number(data)
                          : Number(data) * 0.01;
                      weight =
                        item.EveListObj[0].unit === "kg"
                          ? Number(value)
                          : Number(value) * 0.001;
                    } else if (indexof == 1) {
                      height =
                        item.EveListObj[1].unit === "m"
                          ? Number(value)
                          : Number(value) * 0.01;
                      weight =
                        item.EveListObj[0].unit === "kg"
                          ? Number(data)
                          : Number(data) * 0.001;
                    }
                    let total = Number(weight) / Math.pow(Number(height), 2);
                    BMIVal = total.toFixed(2);
                  }
                });
              }
            }
            this.findCircle(item.EveTarget, function(item0) {
              item0.eleValue = BMIVal;
            });
          } else if (item.EveCode == "CDEE_SCORE") {
            //todo
            let total = 0;
            for (let j in item.EveListInit) {
              let EveInitItem = item.EveListInit[j];
              for (let k in EveInitItem) {
                this.findCircle(EveInitItem[k], findItem => {
                  if (
                    findItem.elementBaseName === "单选元素" ||
                    findItem.elementBaseName === "单选下拉元素"
                  ) {
                    if (findItem.valueLst.length) {
                      for (let kk in findItem.valueLst) {
                        if (
                          findItem.eleValue === findItem.valueLst[kk].vMean ||
                          findItem.eleValue === findItem.valueLst[kk].vCode
                        ) {
                          total += Number(findItem.valueLst[kk].score);
                        }
                      }
                    }
                  } else if (
                    findItem.elementBaseName === "多选元素" ||
                    findItem.elementBaseName === "多选下拉元素"
                  ) {
                    let totalCheck = 0;
                    if (findItem.valueLst.length) {
                      let propAttr = findItem.proprietaryAttributeVoLst;
                      let addUp = false;
                      for (let ii in propAttr) {
                        if (
                          findItem.elementBaseName === "多选元素" &&
                          propAttr[ii].proprietaryCode === "0505"
                        ) {
                          addUp =
                            propAttr[ii].proprietaryContent === "1"
                              ? true
                              : false;
                        }
                        if (
                          findItem.elementBaseName === "多选下拉元素" &&
                          propAttr[ii].proprietaryCode === "1305"
                        ) {
                          addUp =
                            propAttr[ii].proprietaryContent === "1"
                              ? true
                              : false;
                        }
                      }
                      for (let kk in findItem.valueLst) {
                        for (let jj in findItem.eleValue) {
                          if (addUp) {
                            if (
                              findItem.eleValue[jj] ===
                                findItem.valueLst[kk].vMean ||
                              findItem.eleValue[jj] ===
                                findItem.valueLst[kk].vCode
                            ) {
                              totalCheck += Number(findItem.valueLst[kk].score);
                            }
                          } else {
                            if (
                              findItem.eleValue[jj] ===
                                findItem.valueLst[kk].vMean ||
                              findItem.eleValue[jj] ===
                                findItem.valueLst[kk].vCode
                            ) {
                              totalCheck = Number(findItem.valueLst[kk].score);
                            }
                          }
                        }
                      }
                    }
                    total += totalCheck;
                  }
                });
              }
            }
            this.findCircle1(
              this.nursingTreeDataSave[0].eleList,
              item.EveTarget,
              function(eveTargetItem) {
                eveTargetItem.eleValue = total;
              }
            );
            this.findCircle(item.EveTarget, function(eveTargetItem) {
              eveTargetItem.eleValue = total;
            });
          } else if (item.EveCode == "CDEE_SetVal") {
            for (let j in item.EveList) {
              const _this = this;
              this.findCircle(item.EveList[j], function(res) {
                let data = res.eleValue;
                for (let k in item.EveContions) {
                  let contionItem = item.EveContions[k];
                  contionItem.EveTarget.forEach(async (item0, index) => {
                    await _this.findCircle1(
                      _this.nursingTreeDataSave[0].eleList,
                      item0.eleId,
                      value => {
                        if (
                          contionItem.judgeCondition === "==" &&
                          data == contionItem.judgeValue
                        ) {
                          value.eleValue = item0.eleValue;
                        }
                        if (
                          contionItem.judgeCondition === "!=" &&
                          data != contionItem.judgeValue
                        ) {
                          value.eleValue = item0.eleValue;
                        }
                        if (
                          contionItem.judgeCondition === ">" &&
                          Number(data) > Number(contionItem.judgeValue)
                        ) {
                          value.eleValue = item0.eleValue;
                        }
                        if (
                          contionItem.judgeCondition === ">=" &&
                          Number(data) >= Number(contionItem.judgeValue)
                        ) {
                          value.eleValue = item0.eleValue;
                        }
                        if (
                          contionItem.judgeCondition === "<" &&
                          Number(data) < Number(contionItem.judgeValue)
                        ) {
                          value.eleValue = item0.eleValue;
                        }
                        if (
                          contionItem.judgeCondition === "<=" &&
                          Number(data) <= Number(contionItem.judgeValue)
                        ) {
                          value.eleValue = item0.eleValue;
                        }
                        if (contionItem.judgeCondition === "()") {
                          let limtMin = contionItem.judgeValue
                            .split(",")[0]
                            .split("(")[1];
                          let limtMax = contionItem.judgeValue
                            .split(",")[1]
                            .split(")")[0];
                          if (
                            Number(data) > Number(limtMin) &&
                            Number(data) < Number(limtMax)
                          ) {
                            value.eleValue = item0.eleValue;
                          }
                        }
                        if (contionItem.judgeCondition === "(]") {
                          let limtMin = contionItem.judgeValue
                            .split(",")[0]
                            .split("(")[1];
                          let limtMax = contionItem.judgeValue
                            .split(",")[1]
                            .split("]")[0];
                          if (
                            Number(data) > Number(limtMin) &&
                            Number(data) <= Number(limtMax)
                          ) {
                            value.eleValue = item0.eleValue;
                          }
                        }
                        if (contionItem.judgeCondition === "[)") {
                          let limtMin = contionItem.judgeValue
                            .split(",")[0]
                            .split("[")[1];
                          let limtMax = contionItem.judgeValue
                            .split(",")[1]
                            .split(")")[0];
                          if (
                            Number(data) >= Number(limtMin) &&
                            Number(data) < Number(limtMax)
                          ) {
                            value.eleValue = item0.eleValue;
                          }
                        }
                        if (contionItem.judgeCondition === "[]") {
                          let limtMin = contionItem.judgeValue
                            .split(",")[0]
                            .split("[")[1];
                          let limtMax = contionItem.judgeValue
                            .split(",")[1]
                            .split("]")[0];
                          if (
                            Number(data) >= Number(limtMin) &&
                            Number(data) <= Number(limtMax)
                          ) {
                            value.eleValue = item0.eleValue;
                          }
                        }
                        if (
                          contionItem.judgeCondition === "包含" &&
                          data.indexOf(contionItem.judgeValue) > -1
                        ) {
                          value.eleValue = item0.eleValue;
                        }
                        if (
                          contionItem.judgeCondition === "不包含" &&
                          data.indexOf(contionItem.judgeValue) < 0
                        ) {
                          value.eleValue = item0.eleValue;
                        }
                        if (
                          contionItem.judgeCondition === "包含于" &&
                          contionItem.judgeValue.indexOf(data) > -1
                          && data.length
                        ) {
                          value.eleValue = item0.eleValue;
                        }
                        _this.$forceUpdate();
                      }
                    );
                    await _this.findCircle(item0.eleId, value => {
                      if (
                        contionItem.judgeCondition === "==" &&
                        data == contionItem.judgeValue
                      ) {
                        value.eleValue = item0.eleValue;
                      }
                      if (
                        contionItem.judgeCondition === "!=" &&
                        data != contionItem.judgeValue
                      ) {
                        value.eleValue = item0.eleValue;
                      }
                      if (
                        contionItem.judgeCondition === ">" &&
                        Number(data) > Number(contionItem.judgeValue)
                      ) {
                        value.eleValue = item0.eleValue;
                      }
                      if (
                        contionItem.judgeCondition === ">=" &&
                        Number(data) >= Number(contionItem.judgeValue)
                      ) {
                        value.eleValue = item0.eleValue;
                      }
                      if (
                        contionItem.judgeCondition === "<" &&
                        Number(data) < Number(contionItem.judgeValue)
                      ) {
                        value.eleValue = item0.eleValue;
                      }
                      if (
                        contionItem.judgeCondition === "<=" &&
                        Number(data) <= Number(contionItem.judgeValue)
                      ) {
                        value.eleValue = item0.eleValue;
                      }
                      if (contionItem.judgeCondition === "()") {
                        let limtMin = contionItem.judgeValue
                          .split(",")[0]
                          .split("(")[1];
                        let limtMax = contionItem.judgeValue
                          .split(",")[1]
                          .split(")")[0];
                        if (
                          Number(data) > Number(limtMin) &&
                          Number(data) < Number(limtMax)
                        ) {
                          value.eleValue = item0.eleValue;
                        }
                      }
                      if (contionItem.judgeCondition === "(]") {
                        let limtMin = contionItem.judgeValue
                          .split(",")[0]
                          .split("(")[1];
                        let limtMax = contionItem.judgeValue
                          .split(",")[1]
                          .split("]")[0];
                        if (
                          Number(data) > Number(limtMin) &&
                          Number(data) <= Number(limtMax)
                        ) {
                          value.eleValue = item0.eleValue;
                        }
                      }
                      if (contionItem.judgeCondition === "[)") {
                        let limtMin = contionItem.judgeValue
                          .split(",")[0]
                          .split("[")[1];
                        let limtMax = contionItem.judgeValue
                          .split(",")[1]
                          .split(")")[0];
                        if (
                          Number(data) >= Number(limtMin) &&
                          Number(data) < Number(limtMax)
                        ) {
                          value.eleValue = item0.eleValue;
                        }
                      }
                      if (contionItem.judgeCondition === "[]") {
                        let limtMin = contionItem.judgeValue
                          .split(",")[0]
                          .split("[")[1];
                        let limtMax = contionItem.judgeValue
                          .split(",")[1]
                          .split("]")[0];
                        if (
                          Number(data) >= Number(limtMin) &&
                          Number(data) <= Number(limtMax)
                        ) {
                          value.eleValue = item0.eleValue;
                        }
                      }
                      if (
                        contionItem.judgeCondition === "包含" &&
                        data.indexOf(contionItem.judgeValue) > -1
                      ) {
                        value.eleValue = item0.eleValue;
                      }
                      if (
                        contionItem.judgeCondition === "不包含" &&
                        data.indexOf(contionItem.judgeValue) < 0
                      ) {
                        value.eleValue = item0.eleValue;
                      }
                      if (
                        contionItem.judgeCondition === "包含于" &&
                        contionItem.judgeValue.indexOf(data) > -1
                        && data.length
                      ) {
                        value.eleValue = item0.eleValue;
                      }
                      this.$forceUpdate();
                    });
                  });
                }
              });
            }
          } else if (item.EveCode == "CDEE_SetEna") {
            for (let j in item.EveList) {
              const _this = this;
              _this.findCircle(item.EveList[j], function(res) {
                let data = res.eleValue;
                for (let k in item.EveContions) {
                  let contionItem = item.EveContions[k];
                  contionItem.EveTarget.forEach(async (item0, index) => {
                    await _this.findCircle1(
                      _this.nursingTreeDataSave[0].eleList,
                      item0.eleId,
                      value => {
                        value.enable =
                          value.commonAttributeDto.checkReadonly == "0";
                        if (
                          contionItem.judgeCondition === "==" &&
                          data == contionItem.judgeValue
                        ) {
                          value.enable = item0.enable;
                        }
                        if (
                          contionItem.judgeCondition === "!=" &&
                          data != contionItem.judgeValue
                        ) {
                          value.enable = item0.enable;
                        }
                        if (
                          contionItem.judgeCondition === ">" &&
                          Number(data) > Number(contionItem.judgeValue)
                        ) {
                          value.enable = item0.enable;
                        }
                        if (
                          contionItem.judgeCondition === ">=" &&
                          Number(data) >= Number(contionItem.judgeValue)
                        ) {
                          value.enable = item0.enable;
                        }
                        if (
                          contionItem.judgeCondition === "<" &&
                          Number(data) < Number(contionItem.judgeValue)
                        ) {
                          value.enable = item0.enable;
                        }
                        if (
                          contionItem.judgeCondition === "<=" &&
                          Number(data) <= Number(contionItem.judgeValue)
                        ) {
                          value.enable = item0.enable;
                        }
                        if (contionItem.judgeCondition === "()") {
                          let limtMin = contionItem.judgeValue
                            .split(",")[0]
                            .split("(")[1];
                          let limtMax = contionItem.judgeValue
                            .split(",")[1]
                            .split(")")[0];
                          if (
                            Number(data) > Number(limtMin) &&
                            Number(data) < Number(limtMax)
                          ) {
                            value.enable = item0.enable;
                          }
                        }
                        if (contionItem.judgeCondition === "(]") {
                          let limtMin = contionItem.judgeValue
                            .split(",")[0]
                            .split("(")[1];
                          let limtMax = contionItem.judgeValue
                            .split(",")[1]
                            .split("]")[0];
                          if (
                            Number(data) > Number(limtMin) &&
                            Number(data) <= Number(limtMax)
                          ) {
                            value.enable = item0.enable;
                          }
                        }
                        if (contionItem.judgeCondition === "[)") {
                          let limtMin = contionItem.judgeValue
                            .split(",")[0]
                            .split("[")[1];
                          let limtMax = contionItem.judgeValue
                            .split(",")[1]
                            .split(")")[0];
                          if (
                            Number(data) >= Number(limtMin) &&
                            Number(data) < Number(limtMax)
                          ) {
                            value.enable = item0.enable;
                          }
                        }
                        if (contionItem.judgeCondition === "[]") {
                          let limtMin = contionItem.judgeValue
                            .split(",")[0]
                            .split("[")[1];
                          let limtMax = contionItem.judgeValue
                            .split(",")[1]
                            .split("]")[0];
                          if (
                            Number(data) >= Number(limtMin) &&
                            Number(data) <= Number(limtMax)
                          ) {
                            value.enable = item0.enable;
                          }
                        }
                        if (
                          contionItem.judgeCondition === "包含" &&
                          data.indexOf(contionItem.judgeValue) > -1
                        ) {
                          value.enable = item0.enable;
                        }
                        if (
                          contionItem.judgeCondition === "不包含" &&
                          data.indexOf(contionItem.judgeValue) < 0
                        ) {
                          value.enable = item0.enable;
                        }
                        if (
                          contionItem.judgeCondition === "包含于" &&
                          contionItem.judgeValue.indexOf(data) > -1
                          && data.length
                        ) {
                          value.enable = item0.enable;
                        }
                        _this.$forceUpdate();
                      }
                    );
                  });
                }
              });
            }
          } else if (item.EveCode == "CDEE_SetVis") {
            for (let j in item.EveList) {
              const _this = this;
              _this.findCircle(item.EveList[j], function(res) {
                let data = res.eleValue;
                for (let k in item.EveContions) {
                  let contionItem = item.EveContions[k];
                  contionItem.EveTarget.forEach(async (item0, index) => {
                    await _this.findCircle1(
                      _this.nursingTreeDataSave[0].eleList,
                      item0.eleId,
                      value => {
                        value.visible =
                          value.commonAttributeDto.checkHidden == "0";
                        console.log("改变了3", value);
                        if (
                          contionItem.judgeCondition === "==" &&
                          data == contionItem.judgeValue
                        ) {
                          value.visible = item0.visible;
                        }
                        if (
                          contionItem.judgeCondition === "!=" &&
                          data != contionItem.judgeValue
                        ) {
                          value.visible = item0.visible;
                        }
                        if (
                          contionItem.judgeCondition === ">" &&
                          Number(data) > Number(contionItem.judgeValue)
                        ) {
                          value.visible = item0.visible;
                        }
                        if (
                          contionItem.judgeCondition === ">=" &&
                          Number(data) >= Number(contionItem.judgeValue)
                        ) {
                          value.visible = item0.visible;
                        }
                        if (
                          contionItem.judgeCondition === "<" &&
                          Number(data) < Number(contionItem.judgeValue)
                        ) {
                          value.visible = item0.visible;
                        }
                        if (
                          contionItem.judgeCondition === "<=" &&
                          Number(data) <= Number(contionItem.judgeValue)
                        ) {
                          value.visible = item0.visible;
                        }
                        if (contionItem.judgeCondition === "()") {
                          let limtMin = contionItem.judgeValue
                            .split(",")[0]
                            .split("(")[1];
                          let limtMax = contionItem.judgeValue
                            .split(",")[1]
                            .split(")")[0];
                          if (
                            Number(data) > Number(limtMin) &&
                            Number(data) < Number(limtMax)
                          ) {
                            value.visible = item0.visible;
                          }
                        }
                        if (contionItem.judgeCondition === "(]") {
                          let limtMin = contionItem.judgeValue
                            .split(",")[0]
                            .split("(")[1];
                          let limtMax = contionItem.judgeValue
                            .split(",")[1]
                            .split("]")[0];
                          if (
                            Number(data) > Number(limtMin) &&
                            Number(data) <= Number(limtMax)
                          ) {
                            value.visible = item0.visible;
                          }
                        }
                        if (contionItem.judgeCondition === "[)") {
                          let limtMin = contionItem.judgeValue
                            .split(",")[0]
                            .split("[")[1];
                          let limtMax = contionItem.judgeValue
                            .split(",")[1]
                            .split(")")[0];
                          if (
                            Number(data) >= Number(limtMin) &&
                            Number(data) < Number(limtMax)
                          ) {
                            value.visible = item0.visible;
                          }
                        }
                        if (contionItem.judgeCondition === "[]") {
                          let limtMin = contionItem.judgeValue
                            .split(",")[0]
                            .split("[")[1];
                          let limtMax = contionItem.judgeValue
                            .split(",")[1]
                            .split("]")[0];
                          if (
                            Number(data) >= Number(limtMin) &&
                            Number(data) <= Number(limtMax)
                          ) {
                            value.visible = item0.visible;
                          }
                        }
                        if (
                          contionItem.judgeCondition === "包含" &&
                          data.indexOf(contionItem.judgeValue) > -1
                        ) {
                          value.visible = item0.visible;
                        }
                        if (
                          contionItem.judgeCondition === "不包含" &&
                          data.indexOf(contionItem.judgeValue) < 0
                        ) {
                          value.visible = item0.visible;
                        }
                        if (
                          contionItem.judgeCondition === "包含于" &&
                          contionItem.judgeValue.indexOf(data) > -1
                          && data.length
                        ) {
                          value.visible = item0.visible;
                        }
                        _this.$forceUpdate();
                      }
                    );
                  });
                }
              });
            }
          }
        }
      }
    },
    //寻找要计算的元素的值,
    findCircle(value, fn) {
      let data = this.tableData;
      for (let i in data) {
        if (i == this.currentIndex) {
          for (let j in data[i]) {
            if (j == value) {
              fn(data[i][j]);
            }
          }
        }
      }
    },
    findCircle1(eleList, eleId, fn) {
      for (let i in eleList) {
        if (eleList[i].eleId == eleId) {
          fn(eleList[i]);
        } else if (eleList[i].eleList && eleList[i].eleList.length) {
          this.findCircle1(eleList[i].eleList, eleId, fn);
        }
      }
    },
    // eslint-disable-next-line complexity
    inputFocus(tableItem, index, e) {
      // console.log(tableItem);
      this.currentControl = tableItem;
      this.currentIndex = index;
      this.changeCurrentIndex(this.currentIndex);
      this.changeCurrentCtr({ currentControl: tableItem, currentIndex: index });
      this.$emit("changeCurrentModeFlag",false)
      this.inTableParams = [];
      this.outTableParams = [];
      let eleEventList = this.nursingTreeDataSave[0].eleEventList || [];
      if (eleEventList.length) {
        for (let i in eleEventList) {
          let item = eleEventList[i];
          if (!item.EveList || !item.EveList.length) {
            continue;
          }
          let indexof = item.EveList.indexOf(this.currentControl.eleId);
          if (indexof > -1) {
            if (item.EveCode == "CDEE_Quantity") {
              if (item.allObj.quantity.editStyle === 2) {
                this.changeInData({});
                this.changeOutData({});
                return;
              } else {
                this.inTableDataProp[this.currentIndex] =
                  this.tableData[this.currentIndex]["inTableDataProp"] || [];
                this.outTableDataProp[this.currentIndex] =
                  this.tableData[this.currentIndex]["outTableDataProp"] || [];
                //将值传给tableType组件
                this.$emit("updateTableDataProp", {
                  inTableDataProp: this.inTableDataProp,
                  outTableDataProp: this.outTableDataProp
                });
                for (let j in item.EveListObj) {
                  for (let k in item.EveListObj[j]) {
                    if (
                      this.currentControl.eleId == item.EveListObj[j][k].eleId
                    ) {
                      if (j == 0) {
                        for (let v in item.EveListObj[0]) {
                          this.inTableParams.push({
                            label:
                              item.EveListObj[0][v].commonAttributeDto
                                .placeholderText ||
                              item.EveListObj[0][v].elementName,
                            prop: item.EveListObj[0][v].eleId,
                            ...item.EveListObj[0][v]
                          });
                          this.inQuantityDataObj[item.EveListObj[0][v].eleId] =
                            "";
                        }
                        this.inQuantityData = [...item.EveListInit[0]];
                        this.inQuantityDialog = true;
                        this.changeInData({
                          inTableParams: this.inTableParams,
                          inQuantityDataObj: this.inQuantityDataObj,
                          inQuantityData: this.inQuantityData,
                          inQuantityDialog: this.inQuantityDialog
                        });
                      } else if (j == 1) {
                        for (let v in item.EveListObj[1]) {
                          this.outTableParams.push({
                            ...item.EveListObj[1][v],
                            label:
                              item.EveListObj[1][v].commonAttributeDto
                                .placeholderText ||
                              item.EveListObj[1][v].elementName,
                            prop: item.EveListObj[1][v].eleId
                          });
                          this.outQuantityDataObj[item.EveListObj[1][v].eleId] =
                            "";
                        }
                        this.outQuantityData = [...item.EveListInit[1]];
                        this.outQuantityDialog = true;
                        this.changeOutData({
                          outTableParams: this.outTableParams,
                          outQuantityDataObj: this.outQuantityDataObj,
                          outQuantityData: this.outQuantityData,
                          outQuantityDialog: this.outQuantityDialog
                        });
                      }
                    }
                  }
                }
                console.log(this.inTableDataProp);
                // debugger
              }
            }
          }
        }
      }
    }
  }
};
</script>

<style scoped lang="scss">
/deep/ .el-radio__label {
  display: none;
}
/deep/ .el-checkbox__label {
  display: none;
}
/deep/ .el-table th > .cell,
/deep/ .el-table td > .cell {
  width: auto;
  padding-left: 2px;
  padding-right: 2px;
}

/deep/
  .l-input-wrap
  .l-input-body
  .l-input-body-main
  .el-date-editor
  .el-input__prefix {
  padding-right: 0;
}
/deep/ .el-input--suffix .el-input__inner {
  padding-right: 20px;
}
/deep/ .l-input-wrap .l-input-body .l-input-body-main {
  padding-left: 0;
}

/deep/ .l-input-wrap .l-input-body .l-input-body-left .l-input-title {
  padding: 0 5px;
}
</style>
