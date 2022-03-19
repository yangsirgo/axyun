<template>
  <div
    class="table-contaion-con"
    :title="
      item.eleId
        ? item.commonAttributeDto.placeholderText || item.elementName
        : ''
    "
  >
    <div v-if="item.elementBaseName == '标签元素'" class="width100">
      <!-- v-if="item.commonAttributeDto.nameStyle !== 'hidden'" -->
      <div class="width100" @click.capture="valueClick1(item, index)">
        <!-- <el-tooltip :content="item.elementName" placement="right"> -->
        <!-- <div> -->
        <div
          class="label-cont width100"
          :style="{
            'text-align':
              item.commonAttributeDto.nameStyle === 'hidden'
                ? 'center'
                : item.commonAttributeDto.nameStyle,
          }"
        >
          {{
            item.commonAttributeDto.checkHidden !== "1" &&
            item.commonAttributeDto.nameStyle !== "hidden"
              ? item.elementName
              : ""
          }}
        </div>
        <!-- </div> -->
        <!-- </el-tooltip> -->
      </div>
    </div>
    <div
      v-if="item.elementBaseName == '数字元素'"
      @click.capture="valueClick1(item, index)"
      class="width100"
    >
      <LFormtTitle
        :label="item.elementName"
        :displayMode="item.commonAttributeDto.nameStyle"
        :disabled="item.commonAttributeDto.checkReadonly != '0' || !item.enable"
        class="width100"
      >
        <div style="display:flex;">
          <div style="flex: 1;">
            <el-input-number
              v-model="item.eleValue"
              class="width100"
              controls-position="right"
              :placeholder="item.commonAttributeDto.placeholderText"
              :disabled="
                item.commonAttributeDto.checkReadonly != '0' || !item.enable
              "
              :max="item.maxLengthText"
              :min="item.minLengthText"
              :precision="item.precision || 0"
              @change="inputChange(item.eleValue, $event)"
              @focus="inputFocus($event)"
              @keyup.tab.native="inputEnter(item, index)"
            >
            </el-input-number>
          </div>
          <span style="padding:0 5px" v-if="item.unitShow === '1' && item.unit !== '' && item.unit !== undefined">{{item.unit}}</span>
        </div>
      </LFormtTitle>
    </div>
    <div
      v-else-if="
        item.elementBaseName == '文本元素' || item.elementBaseName == '基本元素'
      "
      @click.capture="valueClick1(item, index)"
      class="width100"
    >
      <LFormtTitle
        :label="item.elementName"
        :displayMode="
          item.elementBaseName == '基本元素'
            ? 'left'
            : item.commonAttributeDto.nameStyle
        "
        :disabled="item.elementBaseName == '基本元素' || (item.commonAttributeDto.checkReadonly != '0' || !item.enable)"
      >
        <el-input
          v-model="item.eleValue"
          class="width100"
          type="text"
          :placeholder="item.commonAttributeDto.placeholderText"
          :disabled="
            item.elementBaseName == '基本元素' ||
            (item.commonAttributeDto.checkReadonly != '0' || !item.enable)
          "
          :maxlength="item.maxLengthText"
          :minlength="item.minLengthText"
          :show-password="
            item.elementCode && item.commonAttributeDto.checkSecret == '1'
          "
          @input="inputChange(item.eleValue, $event)"
          @focus="inputFocus($event)"
          @keyup.tab.native="inputEnter(item, index)"
        ></el-input>
      </LFormtTitle>
    </div>
    <div
      @click.capture="valueClick1(item, index)"
      v-else-if="item.elementBaseName == '有无元素'"
      class="width100 select-ele"
    >
      <LChooseComp
        :label="item.elementName"
        :displayMode="item.commonAttributeDto.nameStyle"
        :disabled="item.commonAttributeDto.checkReadonly != '0' || !item.enable"
      >
        <el-radio-group
          v-model="item.eleValue"
          :disabled="
            item.commonAttributeDto.checkReadonly != '0' || !item.enable
          "
          @change="selectChange(treeData, item, index, $event)"
          @keyup.tab.native="inputEnter(item, index)"
        >
          <el-radio
            v-for="(value, key) in item.proprietaryAttributeVoLst"
            :key="key"
            :label="value.proprietaryContent"
            @click.native="handlerRadioClick(treeData, item, index, $event, -1)"
            v-if="
              value.proprietaryCode == '0800' || value.proprietaryCode == '0801'
            "
            >{{ value.proprietaryContent }}</el-radio
          >
        </el-radio-group>
      </LChooseComp>
    </div>
    <div
      v-else-if="item.elementBaseName == '单选元素'"
      @click.capture="valueClick1(item, index)"
      class="width100"
    >
      <div v-if="!item.valueLst.length" class="select-ele">
        <el-radio
          v-model="item.eleValue"
          :label="index"
          @click.native="handlerRadioClick(treeData, item, index, $event, -1)"
          :disabled="
            item.commonAttributeDto.checkReadonly != '0' || !item.enable
          "
          @change="selectChange(treeData, item, index, $event)"
          @keyup.tab.native="inputEnter(item, index)"
          >{{ item.elementName }}</el-radio
        >
      </div>
      <div v-else class="select-ele">
        <div class v-if="item.commonAttributeDto.checkHidden === '0'">
          <LChooseComp
            :label="item.elementName"
            :displayMode="item.commonAttributeDto.nameStyle"
            :disabled="
              item.commonAttributeDto.checkReadonly != '0' || !item.enable
            "
          >
            <el-radio-group
              v-model="item.eleValue"
              :disabled="
                item.commonAttributeDto.checkReadonly != '0' || !item.enable
              "
              @change="selectChange(treeData, item, index, $event)"
              @keyup.tab.native="inputEnter(item, index)"
            >
              <el-radio
                :label="value.vMean"
                v-for="(value, key) in item.valueLst"
                @click.native="
                  handlerRadioClick(treeData, item, index, $event, key)
                "
                :key="key"
                >{{ value.vMean }}</el-radio
              >
            </el-radio-group>
          </LChooseComp>
        </div>
      </div>
    </div>
    <div
      @click.capture="valueClick1(item, index)"
      v-else-if="item.elementBaseName == '多选元素'"
      class="width100"
    >
      <div v-if="!item.valueLst.length" class="select-ele">
        <el-checkbox
          v-model="item.eleValue"
          :disabled="
            item.commonAttributeDto.checkReadonly != '0' || !item.enable
          "
          @change="selectChange(treeData, item, index, $event)"
          @keyup.tab.native="inputEnter(item, index)"
          >{{ item.elementName }}</el-checkbox
        >
      </div>
      <div v-else class="select-ele">
        <div class v-if="item.commonAttributeDto.checkHidden === '0'">
          <LChooseComp
            :label="item.elementName"
            :displayMode="item.commonAttributeDto.nameStyle"
            :disabled="
              item.commonAttributeDto.checkReadonly != '0' || !item.enable
            "
          >
            <el-checkbox-group
              v-model="item.eleValue"
              :disabled="
                item.commonAttributeDto.checkReadonly != '0' || !item.enable
              "
              @change="selectChange(treeData, item, index, $event)"
              @keyup.tab.native="inputEnter(item, index)"
            >
              <el-checkbox
                :label="value.vMean"
                v-for="(value, key) in item.valueLst"
                :key="key"
                >{{ value.vMean }}</el-checkbox
              >
            </el-checkbox-group>
          </LChooseComp>
        </div>
      </div>
    </div>
    <div
      @click.capture="valueClick1(item, index)"
      v-else-if="item.elementBaseName == '单选下拉元素'"
      class="width100"
    >
      <LFormtTitle
        :label="item.elementName"
        :displayMode="item.commonAttributeDto.nameStyle"
        :disabled="item.commonAttributeDto.checkReadonly != '0' || !item.enable"
      >
        <el-select
          v-model="item.eleValue"
          class="width100"
          :placeholder="item.commonAttributeDto.placeholderText"
          :disabled="
            item.commonAttributeDto.checkReadonly != '0' || !item.enable
          "
          filterable
          clearable
          :allow-create="item.commonAttributeDto.checkEdit === '1'"
          @change="selectChange(treeData, item, index, $event)"
          @keyup.tab.native="inputEnter(item, index)"
        >
          <el-option
            v-for="(val, key) in item.valueLst"
            :key="key"
            :label="val.vMean"
            :value="val.vMean"
          ></el-option>
        </el-select>
      </LFormtTitle>
    </div>
    <div
      @click.capture="valueClick1(item, index)"
      v-else-if="item.elementBaseName == '多选下拉元素'"
      class="width100"
    >
      <LFormtTitle
        :label="item.elementName"
        :displayMode="item.commonAttributeDto.nameStyle"
        :disabled="item.commonAttributeDto.checkReadonly != '0' || !item.enable"
      >
        <el-select
          v-model="item.eleValue"
          class="width100"
          :placeholder="item.commonAttributeDto.placeholderText"
          multiple
          filterable
          clearable
          :allow-create="item.commonAttributeDto.checkEdit === '1'"
          :disabled="
            item.commonAttributeDto.checkReadonly != '0' || !item.enable
          "
          @change="selectChange(treeData, item, index, $event)"
          @keyup.tab.native="inputEnter(item, index)"
        >
          <el-option
            v-for="(val, key) in item.valueLst"
            :key="key"
            :label="val.vMean"
            :value="val.vMean"
          ></el-option>
        </el-select>
      </LFormtTitle>
    </div>
    <div
      @click.capture="valueClick1(item, index)"
      v-else-if="item.elementBaseName == '日期元素'"
      class="width100"
    >
      <!-- {{ item.eleValue }} -->
      <LFormtTitle
        :label="item.elementName"
        :displayMode="item.commonAttributeDto.nameStyle"
        :disabled="
          !item.commonAttributeDto.checkReadonly != '0' || !item.enable
        "
      >
        <template v-if="item.dateFormatType === '3'">
          <el-time-picker
            v-model="item.eleValue"
            :placeholder="item.commonAttributeDto.placeholderText"
            class="width100"
            :disabled="
              !item.commonAttributeDto.checkReadonly != '0' || !item.enable
            "
            :format="item.dateFormat"
            :value-format="item.dateFormat"
            clearable
            @focus="selectChange(treeData, item, index, $event)"
            @change="selectChange(treeData, item, index, $event)"
            @blur="selectChange(treeData, item, index, $event)"
            @keyup.tab.native="inputEnter(item, index)"
          ></el-time-picker>
        </template>
        <template v-else>
          <el-date-picker
            v-model="item.eleValue"
            :placeholder="item.commonAttributeDto.placeholderText"
            :type="item.dateFormatType === '2' ? 'date' : 'datetime'"
            class="width100"
            :disabled="
              !item.commonAttributeDto.checkReadonly != '0' || !item.enable
            "
            :format="item.dateFormat"
            :value-format="item.dateFormat"
            clearable
            @focus="selectChange(treeData, item, index, $event)"
            @change="selectChange(treeData, item, index, $event)"
            @blur="selectChange(treeData, item, index, $event)"
            @keyup.tab.native="inputEnter(item, index)"
          ></el-date-picker>
        </template>
      </LFormtTitle>
    </div>
    <div
      @click.capture="valueClick1(item, index)"
      v-else-if="item.elementBaseName == '签名元素'"
      class="width100"
    >
      <LFormtTitle
        :label="item.elementName"
        :displayMode="item.commonAttributeDto.nameStyle"
        :disabled="item.commonAttributeDto.checkReadonly != '0' || !item.enable"
      >
        <retrieve-select
          :eleValue.sync="item.eleValue"
          :placeholder="item.commonAttributeDto.placeholderText"
          :disabled="
            item.commonAttributeDto.checkReadonly != '0' || !item.enable
          "
          :options="item.nursingList"
          @change="selectChange(treeData, item, index, $event)"
          @keyup.tab.native="inputEnter(item, index)"
        ></retrieve-select>
      </LFormtTitle>
    </div>
    <div
      v-else
      @click.capture="valueClick1(item, index)"
      class="width100"
    ></div>
  </div>
</template>

<script>
export default {
  name: "",
  props: {
    nursingTreeDataSave: {
      type: Array,
      default: () => {
        return [];
      }
    },
    treeData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    item: {
      type: Object,
      default: () => {
        return {};
      }
    },
    index: {
      type: Number,
      default: 0
    },
    currentControl: {
      type: Object,
      default: () => {
        return {};
      }
    },
    /* tableDataInit: {
      type: Array,
      default: () => {
        return [];
      }
    },
    currentIndex: {
      type: Number,
      default: () => {
        return -1;
      }
    } */
  },
  components: {},
  data() {
    return {};
  },
  methods: {
    inputFocus(value, e) {},
    valueClick1(item, index) {
      // console.log("点击某一个元素", item, index);
      this.$emit("tableContainClick", {
        item,
        index
      });
    },
    async inputChange(value, e) {
      this.$forceUpdate();
      this.commonChange(value);
    },
    /* findCircle1(value, fn) {
      let data = this.tableDataInit;
      for (let i in data) {
        if (this.currentIndex >= 0 && i == this.currentIndex) {
          for (let j in data[i]) {
            if (j == value) {
              fn(data[i][j]);
            }
          }
        }
      }
    }, */
    //寻找要计算的元素的值
    findCircle(eleList, eleId, fn) {
      for (let i in eleList) {
        if (eleList[i].eleId == eleId) {
          fn(eleList[i]);
        } else if (eleList[i].eleList && eleList[i].eleList.length) {
          this.findCircle(eleList[i].eleList, eleId, fn);
        }
      }
    },
    handlerRadioClick(treeData, item, index, e, key) {
      if (e.target.tagName !== "INPUT") {
        return;
      }

      if (item.eleValue !== "") {
        this.$set(item, "eleValue", "");
      }

      this.selectChange(treeData, item, index, e);
    },
    //控制单选框
    selectChange(treeData, item, index, e) {
      this.$forceUpdate();
      this.commonChange(item.eleValue);
    },
    async commonChange(value) {
      const _this = this;
      let eleEventList = this.nursingTreeDataSave[0].eleEventList;
      for (let i in eleEventList) {
        let item = eleEventList[i];
        if (!item.EveList || !item.EveList.length) {
          continue;
        }
        let indexof = item.EveList.indexOf(this.currentControl.eleId);
        if (indexof > -1) {
          if (item.EveCode == "CDEE_BMI") {
            for (let j in item.EveList) {
              if (item.EveList[j] != this.currentControl.eleId) {
                let BMIVal = "";
                let _this = this;
                await this.findCircle(
                  _this.nursingTreeDataSave[0].eleList,
                  item.EveList[j],
                  function(item0) {
                    let data = item0.eleValue;
                    if (data) {
                      if (indexof == 0) {
                        let weight =
                        item.EveListObj[0].unit === "kg"
                          ? Number(value)
                          : Number(value) * 0.001;
                      let height =
                        item.EveListObj[1].unit === "m"
                          ? Number(data)
                          : Number(data) * 0.01;
                        BMIVal = (
                          weight / Math.pow(height, 2)
                        ).toFixed(2);
                      } else if (indexof == 1) {
                        let weight =
                        item.EveListObj[0].unit === "kg"
                          ? Number(data)
                          : Number(data) * 0.001;
                      let height =
                        item.EveListObj[1].unit === "m"
                          ? Number(value)
                          : Number(value) * 0.01;
                        BMIVal = (
                          weight / Math.pow(height, 2)
                        ).toFixed(2);
                      }
                    }
                  }
                );
                await this.findCircle(
                  _this.nursingTreeDataSave[0].eleList,
                  item.EveTarget,
                  function(item) {
                    item.eleValue = BMIVal;
                  }
                );
              }
            }
          } else if (item.EveCode == "CDEE_SCORE") {
            let total = 0;
            for(let j in item.EveListInit){
              let EveInitItem = item.EveListInit[j];
              for(let k in EveInitItem){
                this.findCircle(this.nursingTreeDataSave[0].eleList,EveInitItem[k],(findItem)=>{
                  if (findItem.elementBaseName === "单选元素" || findItem.elementBaseName === "单选下拉元素"){
                    if(findItem.valueLst.length){
                      for (let kk in findItem.valueLst) {
                        if(findItem.eleValue === findItem.valueLst[kk].vMean || findItem.eleValue === findItem.valueLst[kk].vCode){
                          total += Number(findItem.valueLst[kk].score);
                        }
                      }
                    }
                  } else if (findItem.elementBaseName === "多选元素" || findItem.elementBaseName === "多选下拉元素"){
                    let totalCheck = 0;
                    if(findItem.valueLst.length){
                      let propAttr = findItem.proprietaryAttributeVoLst;
                      let addUp = false;
                      for(let ii in propAttr){
                        if(findItem.elementBaseName === "多选元素" && propAttr[ii].proprietaryCode === "0505"){
                          addUp = propAttr[ii].proprietaryContent === "1" ? true : false;
                        }
                        if(findItem.elementBaseName === "多选下拉元素" && propAttr[ii].proprietaryCode === "1305"){
                          addUp = propAttr[ii].proprietaryContent === "1" ? true : false;
                        }
                      }
                      for (let kk in findItem.valueLst) {
                        for(let jj in findItem.eleValue){
                          if(addUp){
                            if(findItem.eleValue[jj] === findItem.valueLst[kk].vMean || findItem.eleValue[jj]  === findItem.valueLst[kk].vCode){
                              totalCheck += Number(findItem.valueLst[kk].score);
                            }
                          }else{
                            if(findItem.eleValue[jj]  === findItem.valueLst[kk].vMean || findItem.eleValue[jj]  === findItem.valueLst[kk].vCode){
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
            this.findCircle(this.nursingTreeDataSave[0].eleList,item.EveTarget, (eveTargetItem)=> {
              eveTargetItem.eleValue = total;
            });
          } else if (item.EveCode == "CDEE_SetVal") {
            for (let j in item.EveList) {
              const _this = this;
              await this.findCircle(
                this.nursingTreeDataSave[0].eleList,
                item.EveList[j],
                (res)=> {
                  let data = res.eleValue;
                  for (let k in item.EveContions) {
                    let contionItem = item.EveContions[k];
                    contionItem.EveTarget.forEach(async (item0, index) => {
                      await _this.findCircle(
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
                          if (contionItem.judgeCondition === ">=" && Number(data) >= Number(contionItem.judgeValue) ) { value.eleValue = item0.eleValue; }
                          if (contionItem.judgeCondition === "<" && Number(data) < Number(contionItem.judgeValue) ) { value.eleValue = item0.eleValue; }
                          if (contionItem.judgeCondition === "<=" && Number(data) <= Number(contionItem.judgeValue) ) { value.eleValue = item0.eleValue; }
                          if (contionItem.judgeCondition === "()") {
                             let limtMin = contionItem.judgeValue.split(",")[0].split("(")[1];
                             let limtMax = contionItem.judgeValue.split(",")[1].split(")")[0];
                              if(Number(data) > Number(limtMin) && Number(data) < Number(limtMax)){
                                 value.eleValue = item0.eleValue;
                              }
                          }
                          if (contionItem.judgeCondition === "(]") {
                             let limtMin = contionItem.judgeValue.split(",")[0].split("(")[1];
                             let limtMax = contionItem.judgeValue.split(",")[1].split("]")[0];
                              if(Number(data) > Number(limtMin) && Number(data) <= Number(limtMax)){
                                 value.eleValue = item0.eleValue;
                              }
                          }
                          if (contionItem.judgeCondition === "[)") {
                             let limtMin = contionItem.judgeValue.split(",")[0].split("[")[1];
                             let limtMax = contionItem.judgeValue.split(",")[1].split(")")[0];
                              if(Number(data) >= Number(limtMin) && Number(data) < Number(limtMax)){
                                 value.eleValue = item0.eleValue;
                              }
                          }
                          if (contionItem.judgeCondition === "[]") {
                             let limtMin = contionItem.judgeValue.split(",")[0].split("[")[1];
                             let limtMax = contionItem.judgeValue.split(",")[1].split("]")[0];
                              if(Number(data) >= Number(limtMin) && Number(data) <= Number(limtMax)){
                                 value.eleValue = item0.eleValue;
                              }
                          }
                          if (contionItem.judgeCondition === "包含" && data.indexOf(contionItem.judgeValue)>-1 ) { value.eleValue = item0.eleValue; }
                          if (contionItem.judgeCondition === "不包含" && data.indexOf(contionItem.judgeValue)<0 ) { value.eleValue = item0.eleValue; }
                          if (contionItem.judgeCondition === "包含于" && contionItem.judgeValue.indexOf(data)>-1 && data.length) { value.eleValue = item0.eleValue; }
                          _this.$forceUpdate();
                        }
                      );
                      /* await _this.findCircle1(
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
                          if (contionItem.judgeCondition === ">=" && Number(data) >= Number(contionItem.judgeValue) ) { value.eleValue = item0.eleValue; }
                          if (contionItem.judgeCondition === "<" && Number(data) < Number(contionItem.judgeValue) ) { value.eleValue = item0.eleValue; }
                          if (contionItem.judgeCondition === "<=" && Number(data) <= Number(contionItem.judgeValue) ) { value.eleValue = item0.eleValue; }
                          if (contionItem.judgeCondition === "()") {
                             let limtMin = contionItem.judgeValue.split(",")[0].split("(")[1];
                             let limtMax = contionItem.judgeValue.split(",")[1].split(")")[0];
                              if(Number(data) > Number(limtMin) && Number(data) < Number(limtMax)){
                                 value.eleValue = item0.eleValue;
                              }
                          }
                          if (contionItem.judgeCondition === "(]") {
                             let limtMin = contionItem.judgeValue.split(",")[0].split("(")[1];
                             let limtMax = contionItem.judgeValue.split(",")[1].split("]")[0];
                              if(Number(data) > Number(limtMin) && Number(data) <= Number(limtMax)){
                                 value.eleValue = item0.eleValue;
                              }
                          }
                          if (contionItem.judgeCondition === "[)") {
                             let limtMin = contionItem.judgeValue.split(",")[0].split("[")[1];
                             let limtMax = contionItem.judgeValue.split(",")[1].split(")")[0];
                              if(Number(data) >= Number(limtMin) && Number(data) < Number(limtMax)){
                                 value.eleValue = item0.eleValue;
                              }
                          }
                          if (contionItem.judgeCondition === "[]") {
                             let limtMin = contionItem.judgeValue.split(",")[0].split("[")[1];
                             let limtMax = contionItem.judgeValue.split(",")[1].split("]")[0];
                              if(Number(data) >= Number(limtMin) && Number(data) <= Number(limtMax)){
                                 value.eleValue = item0.eleValue;
                              }
                          }
                          if (contionItem.judgeCondition === "包含" && data.indexOf(contionItem.judgeValue)>-1 ) { value.eleValue = item0.eleValue; }
                          if (contionItem.judgeCondition === "不包含" && data.indexOf(contionItem.judgeValue)<0 ) { value.eleValue = item0.eleValue; }
                          if (contionItem.judgeCondition === "包含于" && contionItem.judgeValue.indexOf(data)>-1 && data.length) { value.eleValue = item0.eleValue; }
                          _this.$forceUpdate();
                        }
                      ); */
                    });
                  }
                }
              );
            }
          } else if (item.EveCode == "CDEE_SetEna") {
            for (let j in item.EveList) {
              const _this = this;
              await this.findCircle(
                this.nursingTreeDataSave[0].eleList,
                item.EveList[j],
                res => {
                  let data = res.eleValue;
                  for (let k in item.EveContions) {
                    let contionItem = item.EveContions[k];
                    contionItem.EveTarget.forEach(async (item0, index) => {
                      await _this.findCircle(
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
                          if (contionItem.judgeCondition === ">=" && Number(data) >= Number(contionItem.judgeValue) ) { value.enable = item0.enable; }
                          if (contionItem.judgeCondition === "<" && Number(data) < Number(contionItem.judgeValue) ) { value.enable = item0.enable; }
                          if (contionItem.judgeCondition === "<=" && Number(data) <= Number(contionItem.judgeValue) ) { value.enable = item0.enable; }
                          if (contionItem.judgeCondition === "()") {
                             let limtMin = contionItem.judgeValue.split(",")[0].split("(")[1];
                             let limtMax = contionItem.judgeValue.split(",")[1].split(")")[0];
                              if(Number(data) > Number(limtMin) && Number(data) < Number(limtMax)){
                                 value.enable = item0.enable;
                              }
                          }
                          if (contionItem.judgeCondition === "(]") {
                             let limtMin = contionItem.judgeValue.split(",")[0].split("(")[1];
                             let limtMax = contionItem.judgeValue.split(",")[1].split("]")[0];
                              if(Number(data) > Number(limtMin) && Number(data) <= Number(limtMax)){
                                 value.enable = item0.enable;
                              }
                          }
                          if (contionItem.judgeCondition === "[)") {
                             let limtMin = contionItem.judgeValue.split(",")[0].split("[")[1];
                             let limtMax = contionItem.judgeValue.split(",")[1].split(")")[0];
                              if(Number(data) >= Number(limtMin) && Number(data) < Number(limtMax)){
                                 value.enable = item0.enable;
                              }
                          }
                          if (contionItem.judgeCondition === "[]") {
                             let limtMin = contionItem.judgeValue.split(",")[0].split("[")[1];
                             let limtMax = contionItem.judgeValue.split(",")[1].split("]")[0];
                              if(Number(data) >= Number(limtMin) && Number(data) <= Number(limtMax)){
                                 value.enable = item0.enable;
                              }
                          }
                          if (contionItem.judgeCondition === "包含" && data.indexOf(contionItem.judgeValue)>-1 ) { value.enable = item0.enable; }
                          if (contionItem.judgeCondition === "不包含" && data.indexOf(contionItem.judgeValue)<0 ) { value.enable = item0.enable; }
                          if (contionItem.judgeCondition === "包含于" && contionItem.judgeValue.indexOf(data)>-1 && data.length) { 
                            value.enable = item0.enable; }
                          _this.$forceUpdate();
                        }
                      );
                    });
                  }
                }
              );
            }
          } else if (item.EveCode == "CDEE_SetVis") {
            for (let j in item.EveList) {
              const _this = this;
              await this.findCircle(
                this.nursingTreeDataSave[0].eleList,
                item.EveList[j],
                function(res) {
                  let data = res.eleValue;
                  for (let k in item.EveContions) {
                    let contionItem = item.EveContions[k];
                    contionItem.EveTarget.forEach(async (item0, index) => {
                      await _this.findCircle(
                        _this.nursingTreeDataSave[0].eleList,
                        item0.eleId,
                        value => {
                          value.visible =
                            value.commonAttributeDto.checkHidden == "0";
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
                          if (contionItem.judgeCondition === ">=" && Number(data) >= Number(contionItem.judgeValue) ) { value.visible = item0.visible; }
                          if (contionItem.judgeCondition === "<" && Number(data) < Number(contionItem.judgeValue) ) { value.visible = item0.visible; }
                          if (contionItem.judgeCondition === "<=" && Number(data) <= Number(contionItem.judgeValue) ) { value.visible = item0.visible; }
                          if (contionItem.judgeCondition === "()") {
                             let limtMin = contionItem.judgeValue.split(",")[0].split("(")[1];
                             let limtMax = contionItem.judgeValue.split(",")[1].split(")")[0];
                              if(Number(data) > Number(limtMin) && Number(data) < Number(limtMax)){
                                 value.visible = item0.visible;
                              }
                          }
                          if (contionItem.judgeCondition === "(]") {
                             let limtMin = contionItem.judgeValue.split(",")[0].split("(")[1];
                             let limtMax = contionItem.judgeValue.split(",")[1].split("]")[0];
                              if(Number(data) > Number(limtMin) && Number(data) <= Number(limtMax)){
                                 value.visible = item0.visible;
                              }
                          }
                          if (contionItem.judgeCondition === "[)") {
                             let limtMin = contionItem.judgeValue.split(",")[0].split("[")[1];
                             let limtMax = contionItem.judgeValue.split(",")[1].split(")")[0];
                              if(Number(data) >= Number(limtMin) && Number(data) < Number(limtMax)){
                                 value.visible = item0.visible;
                              }
                          }
                          if (contionItem.judgeCondition === "[]") {
                             let limtMin = contionItem.judgeValue.split(",")[0].split("[")[1];
                             let limtMax = contionItem.judgeValue.split(",")[1].split("]")[0];
                              if(Number(data) >= Number(limtMin) && Number(data) <= Number(limtMax)){
                                 value.visible = item0.visible;
                              }
                          }
                          if (contionItem.judgeCondition === "包含" && data.indexOf(contionItem.judgeValue)>-1 ) { value.visible = item0.visible; }
                          if (contionItem.judgeCondition === "不包含" && data.indexOf(contionItem.judgeValue)<0 ) { value.visible = item0.visible; }
                          if (contionItem.judgeCondition === "包含于" && contionItem.judgeValue.indexOf(data)>-1 && data.length) { value.visible = item0.visible; }
                          _this.$forceUpdate();
                        }
                      );
                    });
                  }
                }
              );
            }
          }
        }
      }
    },
    inputEnter(item, index) {
      this.$emit("tableContainClick", {
        item,
        index
      });
    }
  }
};
</script>

<style lang='scss' scoped>
.table-contaion-con {
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
  /deep/ .l-input-wrap {
    height: auto;
  }
  .select-ele {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .label-cont{
    font-size: 14px;
  }
}
</style>
