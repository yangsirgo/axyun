<template>
  <div class="table-doc width100 height100" :key="randomkey">
    <!--表格类型文书-->
    <div class="table-cont width100 height100">
      <el-table
        ref="multiTable"
        :data="tableData"
        width="100%"
        height="100%"
        stripe
        border
        :cell-class-name="rowClass"
        @header-click="headerClick"
        @header-dragend="headerDragend"
        @selection-change="selectionChange"
        @row-click="rowClickInit"
        :span-method="objectSpanMethod"
      >
        <el-table-column
          :label="treeData.elementName"
          :resizable="false"
          header-align="center"
          align="center"
        >
          <el-table-column
            type="selection"
            width="55"
            fixed="left"
            :resizable="false"
            header-align="center"
            align="center"
          ></el-table-column>
          <!-- <el-table-column
          label="操作"
          prop="operate"
          width="120"
          fixed="left"
          :resizable="false"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-button type="text" @click="resTableItem(scope.row, scope.$index)">清空</el-button>
            <el-button
              type="text"
              v-if="scope.$index == tableData.length - 1"
              @click="addTableItem"
            >新增</el-button>
          </template>
        </el-table-column>-->
          <el-table-column
            label="日期"
            prop="date"
            width="170"
            :resizable="false"
            fixed="left"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <!-- <div @click="valueClick(scope.row, scope.$index, scope.$index)"> -->
              <el-date-picker
                v-model="scope.row['date']"
                type="datetime"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyyMMdd HHmm"
                placeholder="选择日期时间"
                @change="datePickerChange($event, scope.$index)"
              ></el-date-picker>
              <!-- </div> -->
            </template>
          </el-table-column>
          <template
            v-for="(tableItem, index) in treeData.eleList"
          >
          <!-- v-if="showtableItem(tableItem)" -->
            <eleTableColums
              v-if="tableItem.eleList && tableItem.eleList.length > 0"
              :key="index"
              :eleList="tableItem"
              :tableData="tableData"
              @saveFunc="upSaveFunc"
              @updateTableDataProp="updateTableDataProp"
            ></eleTableColums>
            <template v-else>
              <el-table-column
                v-if="
                  tableItem.elementBaseName == '单选元素' &&
                  tableItem.valueLst.length
                "
                :key="index"
                :label="handleNameShow(tableItem)"
                :prop="tableItem.eleId"
                :resizable="tableItem.resizable"
                :min-width="tableItem.width"
                header-align="center"
                align="center"
              >
                <template
                  v-if="tableItem.valueLst.length == 1 && showtableItem(tableItem)"
                  slot-scope="scope"
                >
                  <div @click="valueClick(tableItem, scope.$index, index)">
                    <el-radio
                      v-model="scope.row[tableItem.eleId].eleValue"
                      @click.native="
                        handlerRadioClick(
                          treeData,
                          scope.row,
                          scope.$index,
                          tableItem,
                          index,
                          $event,
                          -1
                        )
                      "
                      :label="tableItem.valueLst[0].vMean"
                      :disabled="
                        tableItem.commonAttributeDto.checkReadonly != '0' ||
                        !tableItem.enable
                      "
                      @change="
                        selectChange(
                          treeData,
                          scope.row,
                          scope.$index,
                          tableItem,
                          index,
                          $event
                        )
                      "
                      @keyup.tab.native="valueClick(tableItem, scope.$index, index)"
                    ></el-radio>
                  </div>
                </template>
                <el-table-column
                  v-if="tableItem.valueLst.length > 1"
                  v-for="(value, key) in tableItem.valueLst"
                  :key="key"
                  :prop="tableItem.eleId"
                  :label="value.vMean"
                  :min-width="value.width"
                  header-align="center"
                  align="center"
                >
                  <template slot-scope="scope">
                    <template v-if="showtableItem(tableItem)">
                      <div @click="valueClick(tableItem, scope.$index, index)">
                        <el-radio
                          @click.native="
                            handlerRadioClick(
                              treeData,
                              scope.row,
                              scope.$index,
                              tableItem,
                              index,
                              $event,
                              key
                            )
                          "
                          v-model="scope.row[tableItem.eleId].eleValue"
                          :label="value.vMean"
                          :disabled="
                            tableItem.commonAttributeDto.checkReadonly != '0' ||
                            !tableItem.enable
                          "
                          @change="
                            selectChange(
                              treeData,
                              scope.row,
                              scope.$index,
                              tableItem,
                              index,
                              $event
                            )
                          "
                          @keyup.tab.native="valueClick(tableItem, scope.$index, index)"
                        ></el-radio>
                      </div>
                    </template>
                    <template v-else></template>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column
                v-else-if="
                  tableItem.elementBaseName == '多选元素' &&
                  tableItem.valueLst.length
                "
                :key="index"
                :label="handleNameShow(tableItem)"
                :prop="tableItem.eleId"
                :resizable="tableItem.resizable"
                :min-width="tableItem.width"
                header-align="center"
                align="center"
              >
                <!-- 一个选项的时候 -->
                <template
                  slot-scope="scope"
                  v-if="tableItem.valueLst.length == 1 && showtableItem(tableItem)"
                >
                  <div @click="valueClick(tableItem, scope.$index, index)">
                    <el-checkbox
                      v-model="scope.row[tableItem.eleId].eleValue"
                      :label="tableItem.valueLst[0].vMean"
                      :disabled="
                        tableItem.commonAttributeDto.checkReadonly != '0' ||
                        !tableItem.enable
                      "
                      @change="
                        selectChange(
                          treeData,
                          scope.row,
                          scope.$index,
                          tableItem,
                          index,
                          $event
                        )
                      "
                      @keyup.tab.native="valueClick(tableItem, scope.$index, index)"
                    ></el-checkbox>
                  </div>
                </template>
                <el-table-column
                  v-if="tableItem.valueLst.length > 1"
                  v-for="(value, key) in tableItem.valueLst"
                  :key="key"
                  :prop="tableItem.eleId"
                  :label="value.vMean"
                  :min-width="value.width"
                  header-align="center"
                  align="center"
                >
                  <template slot-scope="scope">
                    <template v-if="showtableItem(tableItem)">
                      <div @click="valueClick(tableItem, scope.$index, index)">
                        <el-checkbox
                          v-model="scope.row[tableItem.eleId].eleValue"
                          :label="value.vMean"
                          :disabled="
                            tableItem.commonAttributeDto.checkReadonly != '0' ||
                            !tableItem.enable
                          "
                          @change="
                            selectChange(
                              treeData,
                              scope.row,
                              scope.$index,
                              tableItem,
                              index,
                              $event
                            )
                          "
                          @keyup.tab.native="valueClick(tableItem, scope.$index, index)"
                        ></el-checkbox>
                      </div>
                    </template>
                    <template v-else></template>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column
                v-else-if="tableItem.elementBaseName == '有无元素'"
                :key="index"
                :label="handleNameShow(tableItem)"
                :prop="tableItem.eleId"
                :resizable="tableItem.resizable"
                :min-width="tableItem.width"
                header-align="center"
                align="center"
              >
                <el-table-column
                  v-if="
                    tableItem.proprietaryAttributeVoLst.length &&
                    (value.proprietaryCode == '0800' ||
                      value.proprietaryCode == '0801')
                  "
                  v-for="(value, key) in tableItem.proprietaryAttributeVoLst"
                  :key="key"
                  :prop="tableItem.eleId"
                  :label="value.proprietaryContent"
                  :min-width="value.width"
                  header-align="center"
                  align="center"
                >
                  <template slot-scope="scope">
                    <template v-if="showtableItem(tableItem)">
                      <div @click="valueClick(tableItem, scope.$index, index)">
                        <el-radio
                          v-model="scope.row[tableItem.eleId].eleValue"
                          @click.native="
                            handlerRadioClick(
                              treeData,
                              scope.row,
                              scope.$index,
                              tableItem,
                              index,
                              $event,
                              -1
                            )
                          "
                          :label="value.proprietaryContent"
                          :disabled="
                            tableItem.commonAttributeDto.checkReadonly != '0' ||
                            !tableItem.enable
                          "
                          @change="
                            selectChange(
                              treeData,
                              scope.row,
                              scope.$index,
                              tableItem,
                              index,
                              $event
                            )
                          "
                          @keyup.tab.native="valueClick(tableItem, scope.$index, index)"
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
                :label="handleNameShow(tableItem)"
                :prop="tableItem.eleId"
                :resizable="tableItem.resizable"
                :min-width="tableItem.width"
                header-align="center"
                align="center"
              >
                <template slot-scope="scope">
                  <template v-if="showtableItem(tableItem)">
                    <template
                      v-if="
                        tableItem.elementBaseName == '标签元素' &&
                        item.commonAttributeDto.nameStyle !== 'hidden'
                      "
                    >
                      <div @click="valueClick(tableItem, scope.$index, index)">
                        {{ scope.row[tableItem.eleId].eleValue }}
                      </div>
                    </template>
                    <template
                      v-else-if="tableItem.elementBaseName == '数字元素'"
                    >
                      <div @click="valueClick(tableItem, scope.$index, index)" style="display:flex;">
                        <div style="flex: 1;">
                          <el-input-number
                            controls-position="right"
                            v-model="scope.row[tableItem.eleId].eleValue"
                            class="width100"
                            :disabled="
                              tableItem.commonAttributeDto.checkReadonly != '0' ||
                              !tableItem.enable
                            "
                            :max="tableItem.maxLengthText"
                            :min="tableItem.minLengthText"
                            :precision="tableItem.precision || 0"
                            @change="
                              inputChange(
                                treeData,
                                scope.row,
                                scope.$index,
                                tableItem,
                                index,
                                $event
                              )
                            "
                            @focus="inputFocus(tableItem, scope.$index, $event)"
                            @keyup.tab.native="valueClick(tableItem, scope.$index, index)"
                          ></el-input-number>
                        </div>
                        <span style="padding:0 5px" v-if="tableItem.unitShow === '1' && tableItem.unit !== '' && tableItem.unit !== undefined">{{tableItem.unit}}</span>
                      </div>
                    </template>
                    <template
                      v-else-if="
                        tableItem.elementBaseName == '文本元素' ||
                        tableItem.elementBaseName == '基本元素'
                      "
                    >
                      <div @click="valueClick(tableItem, scope.$index, index)">
                        <el-input
                          type="text"
                          v-model="scope.row[tableItem.eleId].eleValue"
                          class="width100"
                          :disabled="
                            tableItem.elementBaseName == '基本元素' ||
                            tableItem.commonAttributeDto.checkReadonly != '0' ||
                            !tableItem.enable
                          "
                          :maxlength="tableItem.maxLengthText"
                          :minlength="tableItem.minLengthText"
                          :show-password="
                            tableItem.elementCode &&
                            tableItem.commonAttributeDto.checkSecret == '1'
                          "
                          @input="
                            inputChange(
                              treeData,
                              scope.row,
                              scope.$index,
                              tableItem,
                              index,
                              $event
                            )
                          "
                          @focus="inputFocus(tableItem, scope.$index, $event)"
                          @keyup.tab.native="valueClick(tableItem, scope.$index, index)"
                        ></el-input>
                      </div>
                    </template>
                    <template
                      v-else-if="tableItem.elementBaseName == '数字元素'"
                    >
                      <div @click="valueClick(tableItem, scope.$index, index)" style="display:flex;">
                        <div style="flex: 1;">
                          <el-input-number
                            controls-position="right"
                            v-model="scope.row[tableItem.eleId].eleValue"
                            class="width100"
                            :disabled="
                              tableItem.commonAttributeDto.checkReadonly != '0' ||
                              !tableItem.enable
                            "
                            :max="tableItem.maxLengthText"
                            :min="tableItem.minLengthText"
                            :precision="tableItem.precision || 0"
                            @change="
                              inputChange(
                                treeData,
                                scope.row,
                                scope.$index,
                                tableItem,
                                index,
                                $event
                              )
                            "
                            @focus="inputFocus(tableItem, scope.$index, $event)"
                            @keyup.tab.native="valueClick(tableItem, scope.$index, index)"
                          ></el-input-number>
                        </div>
                        <span style="padding:0 5px" v-if="tableItem.unitShow === '1' && tableItem.unit !== '' && tableItem.unit !== undefined">{{tableItem.unit}}</span>
                      </div>
                    </template>
                    <template
                      v-else-if="tableItem.elementBaseName == '有无元素'"
                    >
                      <div @click="valueClick(tableItem, scope.$index, index)">
                        <el-radio-group
                          v-model="scope.row[tableItem.eleId].eleValue"
                          :disabled="
                            tableItem.commonAttributeDto.checkReadonly != '0' ||
                            !tableItem.enable
                          "
                          @change="
                            selectChange(
                              treeData,
                              scope.row,
                              scope.$index,
                              tableItem,
                              index,
                              $event
                            )
                          "
                          @keyup.tab.native="valueClick(tableItem, scope.$index, index)"
                        >
                          <el-radio
                            :label="value.proprietaryContent"
                            @click.native="
                              handlerRadioClick(
                                treeData,
                                scope.row,
                                scope.$index,
                                tableItem,
                                index,
                                $event,
                                -1
                              )
                            "
                            v-for="(
                              value, key
                            ) in tableItem.proprietaryAttributeVoLst"
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
                    <template
                      v-else-if="tableItem.elementBaseName == '单选元素'"
                    >
                      <div
                        v-if="!tableItem.valueLst.length"
                        @click="valueClick(tableItem, scope.$index, index)"
                      >
                        <el-radio
                          @click.native="
                            handlerRadioClick(
                              treeData,
                              scope.row,
                              scope.$index,
                              tableItem,
                              index,
                              $event,
                              -1
                            )
                          "
                          v-model="scope.row[tableItem.eleId].eleValue"
                          :label="index + 1"
                          :disabled="
                            tableItem.commonAttributeDto.checkReadonly != '0' ||
                            !tableItem.enable
                          "
                          @change="
                            selectChange(
                              treeData,
                              scope.row,
                              scope.$index,
                              tableItem,
                              index,
                              $event
                            )
                          "
                          @keyup.tab.native="valueClick(tableItem, scope.$index, index)"
                        ></el-radio>
                      </div>
                      <div
                        v-else
                        class="clearfix"
                        @click="valueClick(tableItem, scope.$index, index)"
                      >
                        <div class="float-left" style="margin-right: 20px">
                          {{ tableItem.elementName }}：
                        </div>
                        <div class="float-left">
                          <el-radio-group
                            v-model="scope.row[tableItem.eleId].eleValue"
                            :disabled="
                              tableItem.commonAttributeDto.checkReadonly !=
                                '0' || !tableItem.enable
                            "
                            @change="
                              selectChange(
                                treeData,
                                scope.row,
                                scope.$index,
                                tableItem,
                                index,
                                $event
                              )
                            "
                            @keyup.tab.native="valueClick(tableItem, scope.$index, index)"
                          >
                            <el-radio
                              :label="value.vMean"
                              v-for="(value, key) in tableItem.valueLst"
                              @click.native="
                                handlerRadioClick(
                                  treeData,
                                  scope.row,
                                  scope.$index,
                                  tableItem,
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
                    <template
                      v-else-if="tableItem.elementBaseName == '多选元素'"
                    >
                      <div
                        v-if="!tableItem.valueLst.length"
                        @click="valueClick(tableItem, scope.$index, index)"
                      >
                        <el-checkbox
                          v-model="scope.row[tableItem.eleId].eleValue"
                          :disabled="
                            tableItem.commonAttributeDto.checkReadonly != '0' ||
                            !tableItem.enable
                          "
                          @change="
                            selectChange(
                              treeData,
                              scope.row,
                              scope.$index,
                              tableItem,
                              index,
                              $event
                            )
                          "
                          @keyup.tab.native="valueClick(tableItem, scope.$index, index)"
                        ></el-checkbox>
                      </div>
                      <div
                        v-else
                        class="clearfix"
                        @click="valueClick(tableItem, scope.$index, index)"
                      >
                        <div class="float-left" style="margin-right: 20px">
                          {{ tableItem.elementName }}：
                        </div>
                        <div class="float-left">
                          <el-checkbox-group
                            v-model="scope.row[tableItem.eleId].eleValue"
                            :disabled="
                              tableItem.commonAttributeDto.checkReadonly !=
                                '0' || !tableItem.enable
                            "
                            @change="
                              selectChange(
                                treeData,
                                scope.row,
                                scope.$index,
                                tableItem,
                                index,
                                $event
                              )
                            "
                            @keyup.tab.native="valueClick(tableItem, scope.$index, index)"
                          >
                            <el-checkbox
                              :label="value.vMean"
                              v-for="(value, key) in tableItem.valueLst"
                              :key="key"
                              >{{ value.vMean }}</el-checkbox
                            >
                          </el-checkbox-group>
                        </div>
                      </div>
                    </template>
                    <template
                      v-else-if="tableItem.elementBaseName == '单选下拉元素'"
                    >
                      <div
                        class="width100"
                        @click.capture="
                          valueClick(tableItem, scope.$index, index)
                        "
                      >
                        <el-select
                          v-model="scope.row[tableItem.eleId].eleValue"
                          class="width100"
                          :disabled="
                            tableItem.commonAttributeDto.checkReadonly != '0' ||
                            !tableItem.enable
                          "
                          filterable
                          clearable
                          :allow-create="
                            tableItem.commonAttributeDto.checkEdit === '1'
                          "
                          @change="
                            selectChange(
                              treeData,
                              scope.row,
                              scope.$index,
                              tableItem,
                              index,
                              $event
                            )
                          "
                          @focus="inputFocus(tableItem, scope.$index, $event)"
                          @keyup.tab.native="valueClick(tableItem, scope.$index, index)"
                        >
                          <el-option
                            v-for="(val, key) in tableItem.valueLst"
                            :key="key"
                            :label="val.vMean"
                            :value="val.vMean"
                          ></el-option>
                        </el-select>
                      </div>
                    </template>
                    <template
                      v-else-if="tableItem.elementBaseName == '多选下拉元素'"
                    >
                      <div
                        class="width100"
                        @click.capture="
                          valueClick(tableItem, scope.$index, index)
                        "
                      >
                        <el-select
                          v-model="scope.row[tableItem.eleId].eleValue"
                          class="width100"
                          multiple
                          filterable
                          clearable
                          :allow-create="
                            tableItem.commonAttributeDto.checkEdit === '1'
                          "
                          :disabled="
                            tableItem.commonAttributeDto.checkReadonly != '0' ||
                            !tableItem.enable
                          "
                          @change="
                            selectChange(
                              treeData,
                              scope.row,
                              scope.$index,
                              tableItem,
                              index,
                              $event
                            )
                          "
                          @keyup.tab.native="valueClick(tableItem, scope.$index, index)"
                        >
                          <el-option
                            v-for="(val, key) in tableItem.valueLst"
                            :key="key"
                            :label="val.vMean"
                            :value="val.vMean"
                          ></el-option>
                        </el-select>
                      </div>
                    </template>
                    <template
                      v-else-if="tableItem.elementBaseName == '日期元素'"
                    >
                      <!-- 判断是否只有小时和分钟的展示 分别做处理 -->
                      <!--  tableItem.dateFormat.split(' ').length === 1 &&
                          RegExp(/HH|hh/).test(tableItem.dateFormat) -->
                      <template v-if="tableItem.dateFormatType === '3'">
                        <div
                          class="width100"
                          @click.capture="
                            valueClick(tableItem, scope.$index, index)
                          "
                        >
                          <el-time-picker
                            v-model="scope.row[tableItem.eleId].eleValue"
                            :disabled="
                              tableItem.commonAttributeDto.checkReadonly !=
                                '0' || !tableItem.enable
                            "
                            :format="tableItem.dateFormat"
                            :value-format="tableItem.dateFormat"
                            class="width100"
                            clearable
                            :placeholder="
                              tableItem.commonAttributeDto.placeholderText
                            "
                            @change="datePickerChange($event, scope.$index)"
                            @keyup.tab.native="valueClick(tableItem, scope.$index, index)"
                          ></el-time-picker>
                        </div>
                      </template>
                      <template v-else>
                        <div
                          class="width100"
                          @click="valueClick(tableItem, scope.$index, index)"
                        >
                          <el-date-picker
                            v-model="scope.row[tableItem.eleId].eleValue"
                            :type="
                              tableItem.dateFormatType === '2'
                                ? 'date'
                                : 'datetime'
                            "
                            :disabled="
                              tableItem.commonAttributeDto.checkReadonly !=
                                '0' || !tableItem.enable
                            "
                            :format="tableItem.dateFormat"
                            :value-format="tableItem.dateFormat"
                            class="width100"
                            clearable
                            :placeholder="
                              tableItem.commonAttributeDto.placeholderText
                            "
                            @change="datePickerChange($event, scope.$index)"
                            @keyup.tab.native="valueClick(tableItem, scope.$index, index)"
                          ></el-date-picker>
                        </div>
                      </template>
                    </template>
                    <template
                      v-else-if="tableItem.elementBaseName == '签名元素'"
                    >
                      <div
                        class="width100"
                        @click.capture="
                          valueClick(tableItem, scope.$index, index)
                        "
                      >
                        <retrieve-select
                          :eleValue.sync="scope.row[tableItem.eleId].eleValue"
                          :disabled="
                            tableItem.commonAttributeDto.checkReadonly != '0' ||
                            !tableItem.enable
                          "
                          @change="
                            selectChange(
                              treeData,
                              scope.row,
                              scope.$index,
                              tableItem,
                              index,
                              $event
                            )
                          "
                          @focus="inputFocus(tableItem, scope.$index, $event)"
                          :options="tableItem.nursingList"
                          @keyup.tab.native="valueClick(tableItem, scope.$index, index)"
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
        </el-table-column>
      </el-table>
    </div>
    <!--入量弹框-->
    <el-dialog
      title="入量"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="inQuantityDialog"
      :modal-append-to-body="false"
      width="500px"
    >
      <inQuantity
        :inTableParams="inTableParams"
        :inTableDataProp="inTableDataProp[currentIndex]"
        @confirmIn="confirmIn"
        @cancelIn="cancelIn"
      ></inQuantity>
    </el-dialog>
    <!--出量弹框-->
    <el-dialog
      title="出量"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="outQuantityDialog"
      :modal-append-to-body="false"
      width="500px"
    >
      <outQuantity
        :outTableParams="outTableParams"
        :outTableDataProp="outTableDataProp[currentIndex]"
        @confirmOut="confirmOut"
        @cancelOut="cancelOut"
      ></outQuantity>
    </el-dialog>
    <!--添加小结/总结弹框-->
    <el-dialog
      :title="
        '添加' + conclusionDialogProp.name === 'minConclusion' ? '小结' : '总结'
      "
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="conclusionDialog"
      width="500px"
      @close="conclusionClose"
    >
      <div class="conclusionDialog-content">
        <div class="conclusion-item" v-if="conclusionStyle.timeRadio === 1">
          <LFormtTitle label="选择班次">
            <el-select
              v-model="conclusion.classes"
              class="width100"
              placeholder="请选择班次"
              @change="classesChange"
            >
              <!-- <el-option label="二十四小时" value="0"></el-option> -->
              <el-option label="夜班" value="07:30:00"></el-option>
              <el-option label="中班" value="15:30:00"></el-option>
              <el-option label="白班" value="22:30:00"></el-option>
            </el-select>
          </LFormtTitle>
        </div>
        <div class="conclusion-item">
          <LFormtTitle label="选择时间">
            <el-date-picker
              v-model="conclusion.time"
              class="width100"
              type="datetimerange"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              placeholder="请选择时间"
            >
              <!-- :picker-options="pickerOptions" -->
            </el-date-picker>
          </LFormtTitle>
        </div>
        <div class="conclusion-item">
          <LFormtTitle label="小结标题">
            <el-select
              v-model="conclusion.title"
              filterable
              allow-create
              placeholder="请选择标题内容"
            >
              <el-option
                v-for="summaryTitleItem in conclusionStyle.summaryTitle"
                :key="summaryTitleItem"
                :label="summaryTitleItem"
                :value="summaryTitleItem"
              ></el-option>
            </el-select>
          </LFormtTitle>
        </div>
        <div class="conclusion-item">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4 }"
            placeholder="请输入统计内容"
            v-model="conclusion.content"
          ></el-input>
        </div>
        <div class="conclusion-item">
          <LFormtTitle label="总入量" style="width: calc(50% - 4px)">
            <el-input
              class="width100"
              type="text"
              placeholder="总入量"
              v-model="conclusion.allIn"
            ></el-input>
          </LFormtTitle>

          <LFormtTitle label="总出量" style="width: calc(50% - 4px)">
            <el-input
              class="width100"
              type="text"
              placeholder="总出量"
              v-model="conclusion.allOut"
            ></el-input>
          </LFormtTitle>
        </div>
      </div>
      <div class="button-cont clearfix">
        <el-checkbox
          v-model="conclusion.isStatistics"
          class="float-left"
          @change="autoStatistics"
          >统计出入量</el-checkbox
        >
        <el-checkbox
          v-model="conclusion.isAsyncTemp"
          class="float-left"
          @change="asyncTemp"
          >同步体温单</el-checkbox
        >
        <el-button class="float-right" type="primary" @click="saveConclusion"
          >保存</el-button
        >
        <!-- <el-button
          class="float-right"
          style="margin-right: 10px"
          type="primary"
          @click="autoStatistics"
        >自动统计</el-button>-->
        <el-button
          class="float-right"
          style="margin-right: 10px"
          type="primary"
          plain
          @click="cancelConclusion"
          >取消</el-button
        >
      </div>
    </el-dialog>
    <!-- 统计弹框 -->
    <el-dialog
      title="出入量统计"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="statisticsDialog"
      width="1000px"
    >
      <div class="conclusionDialog-content">
        <statistics
          ref="statisticsCont"
          :docTableData="selections"
          v-if="statisticsDialog"
        ></statistics>
      </div>
      <div class="button-cont clearfix">
        <LFormtTitle label="记录时间" class="float-left" style="width: 350px">
          <el-date-picker
            v-model="statisticsDate"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyyMMdd HHmm"
            placeholder="选择日期时间"
          ></el-date-picker>
        </LFormtTitle>
        <el-button
          class="float-right"
          style="margin-right: 10px"
          type="primary"
          @click="getStatistics"
          >确定</el-button
        >
        <el-button
          class="float-right"
          style="margin-right: 10px"
          type="primary"
          plain
          @click="cancelStatistics"
          >取消</el-button
        >
      </div>
    </el-dialog>
    <ModifyEleAttr
      ref="modifyEleAttr"
      :dialogVisible.sync="dialogVisible"
      :createDialogVisible="false"
      :modifyDialogVisible="true"
      :eleDetailInfoProp="eleDetailInfoProp"
      @dialogClose="dialogClose"
      @updateItemData="updateItemData"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import eleTableColums from "../components/eleTableColums";
import ModifyEleAttr from "@/views/emrRecord/emr/component/modifyEleAttr.vue";
import inQuantity from "../components/inQuantity";
import outQuantity from "../components/outQuantity";
import statistics from "../components/statistics";

import { saveOrUpdateDocClass } from "@/api/emrRecord/nursingRecord/docRecord";
import { getTableData } from "@/api/directive/directiveRequest";

import { getPamars, getUserName } from "@/utils/auth";
import Base64 from "@/utils/base64.js";
import { deepClone } from "@/utils/index";

let conclusion = {
  conclusion: false,
  isAsyncTemp: false,
  time: []
};
export default {
  name: "tableType",
  components: {
    eleTableColums,
    inQuantity,
    outQuantity,
    statistics,
    ModifyEleAttr
  },
  props: {
    treeData: {
      type: Object,
      default() {
        return {};
      }
    },
    conclusionDialogProp: {
      type: Object,
      default() {
        return { flag: false };
      }
    },
    statisticsDialogProp: {
      type: Object,
      default() {
        return { flag: false };
      }
    },
    isQuote: {
      type: Object,
      default() {
        return {
          flag: false,
          quoteValue: []
        };
      }
    },
    isBasicEleValue: {
      type: Object,
      default() {
        return {
          flag: false,
          basicEleValue: []
        };
      }
    },
    toolsQuote: {
      type: Object,
      default() {
        return {
          current: "",
          data: {}
        };
      }
    },
    nursingList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      eleDetailInfoProp: {},
      modifyEleAttrProps: {},
      //文书类型为表格类型的数据
      tableData: [
        {
          date: new Date().format("yyyyMMdd HHmm")
        }
      ],
      randomkey: 0,
      //表格选中的集合
      selections: [],
      //表格单条数据模板
      tableDataItem: {},
      nursingTreeDataSave: [],
      //当前元素
      currentControl: {},
      currentIndex: 0,
      //添加小结弹框
      conclusionDialog: false,
      //统计弹框
      statisticsDialog: false,
      conclusion: deepClone(conclusion),
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
      outTableParams: [],
      scoreEventObj: {},
      pickerOptions: {
        disabledDate: time => {
          return time.getTime() > Date.now();
        }
      },
      //统计弹框时间
      statisticsDate: "",
      //小结/总结弹框设置
      conclusionStyle: {}
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
    },
    inData: {
      handler(val) {
        this.inTableParams = val.inTableParams || [];
        this.inQuantityDataObj = val.inQuantityDataObj || {};
        this.inQuantityData = val.inQuantityData || [];
        this.inQuantityDialog = val.inQuantityDialog || false;
      },
      immediate: true,
      deep: true
    },
    outData: {
      handler(val) {
        this.outTableParams = val.outTableParams || [];
        this.outQuantityDataObj = val.outQuantityDataObj || {};
        this.outQuantityData = val.outQuantityData || [];
        this.outQuantityDialog = val.outQuantityDialog || false;
      },
      immediate: true,
      deep: true
    },
    currentIndexInit: {
      handler(val) {
        this.currentIndex = val;
      },
      immediate: true,
      deep: true
    },
    currentCtr: {
      handler(val) {
        if (
          // this.currentControl.eleId &&
          (val.currentControl.eleId &&
            this.currentControl.eleId !== val.currentControl.eleId) ||
          this.currentIndex !== val.currentIndex
        ) {
          this.currentControl = val.currentControl;
          this.currentIndex = val.currentIndex;
        }
      },
      immediate: true,
      deep: true
    },
    conclusionDialogProp: {
      handler(val) {
        this.conclusionDialog = val.flag;
      },
      immediate: true,
      deep: true
    },
    statisticsDialogProp: {
      handler(val) {
        if (!this.selections.length && val.flag) {
          this.$message("请先选择记录再进行统计");
          return;
        }
        this.getStatisticsDialog(val);
      },
      immediate: true,
      deep: true
    },
    toolsQuote: {
      handler(val) {
        if (this.currentControl.eleId) {
          this.findCircle(this.currentControl.eleId, res => {
            if (val.current === "phrase") {
              if (val.data[val.current].actionType === 0) {
                res.eleValue += val.data[val.current]["templates"];
                return;
              }
              res.eleValue = val.data[val.current]["templates"];
              return;
            }
            res.eleValue += val.data[val.current];
          });
        }
      },
      immediate: true,
      deep: true
    }
  },
  inject: {
    toolValue: {
      default: () => {
        return {};
      }
    },
    checkedElement: {
      default: () => {
        return false;
      }
    }
  },
  computed: {
    ...mapGetters("user", ["role"]),
    ...mapGetters("homeSickbeds", ["receivePatientData"]),
    ...mapGetters("nurseDocument", [
      "nursingTreeData",
      "inData",
      "outData",
      "currentIndexInit",
      "currentCtr"
    ])
  },
  async created() {
    this.tableData = this.treeData.recordValueJson || [{}];
    // console.log(this.tableData, "this.tableData123");
    await this.forCircleTable(this.treeData);
    if (this.isQuote.flag) {
      this.setQuoteValue(this.isQuote.quoteValue);
    }
    // console.log(this.isBasicEleValue, "this.isBasicEleValue");
    if (this.isBasicEleValue.flag) {
      this.setBasicEle(this.isBasicEleValue.basicEleValue);
    }
    this.changeInData({});
    this.changeOutData({});
    this.changeCurrentIndex("");
    this.getConclusionStyle();
  },
  methods: {
    //触发统计弹框
    getStatisticsDialog(val) {
      if (val.flag) {
        let eleEventList = this.nursingTreeDataSave[0].eleEventList;
        for (let i in eleEventList) {
          let item = eleEventList[i];
          if (item.EveCode == "CDEE_Quantity") {
            let quantityObj = item.allObj.quantity;
            //判断入量名称与入量量、出量
            let inName = quantityObj.inQuantity.eleList[0].nameList;
            let inNum = quantityObj.inQuantity.eleList[0].valueList;
            let outName = quantityObj.outQuantity.eleList[0].nameList;
            let outNum = quantityObj.outQuantity.eleList[0].valueList;
            let data = this.tableData;
            for (let j in data) {
              if (data[j][inName.eleId]["eleValue"]) {
                if (data[j][inName.eleId].elementBaseName === "多选下拉元素") {
                  let inArr = data[j][inName.eleId]["eleValue"];
                  let inArrNew = [];
                  for (let k in inArr) {
                    let obj = {};
                    obj[inName.eleId] = inArr[k];
                    obj[inNum.eleId] = data[j][inNum.eleId]["eleValue"].split(
                      "/"
                    )[k];
                    inArrNew.push(obj);
                  }
                  data[j]["inTableDataProp"] = inArrNew;
                  this.inTableDataProp[this.currentIndex] = inArrNew;
                } else if (
                  data[j][inName.eleId]["eleValue"].indexOf("/") > -1
                ) {
                  let inArr = data[j][inName.eleId]["eleValue"].split("/");
                  let inArrNew = [];
                  for (let k in inArr) {
                    let obj = {};
                    obj[inName.eleId] = inArr[k];
                    obj[inNum.eleId] = data[j][inNum.eleId]["eleValue"].split(
                      "/"
                    )[k];
                    inArrNew.push(obj);
                  }
                  data[j]["inTableDataProp"] = inArrNew;
                  this.inTableDataProp[this.currentIndex] = inArrNew;
                } else {
                  let obj = {};
                  obj[inName.eleId] = data[j][inName.eleId]["eleValue"];
                  obj[inNum.eleId] = data[j][inNum.eleId]["eleValue"];
                  data[j]["inTableDataProp"] = [obj];
                  this.inTableDataProp[this.currentIndex] = [obj];
                }
              }
              if (data[j][outName.eleId]["eleValue"]) {
                if (
                  data[j][outName.eleId].elementBaseName === "多选下拉元素" &&
                  data[j][outName.eleId]["eleValue"].length
                ) {
                  let outArr = data[j][outName.eleId]["eleValue"];
                  let outArrNew = [];
                  for (let k in outArr) {
                    let obj = {};
                    obj[outName.eleId] = outArr[k];
                    obj[outNum.eleId] = data[j][outNum.eleId]["eleValue"].split(
                      "/"
                    )[k];
                    outArrNew.push(obj);
                  }
                  data[j]["outTableDataProp"] = outArrNew;
                  this.outTableDataProp[this.currentIndex] = outArrNew;
                } else if (
                  data[j][outName.eleId]["eleValue"].indexOf("/") > -1
                ) {
                  let outArr = data[j][outName.eleId]["eleValue"].split("/");
                  let outArrNew = [];
                  for (let k in outArr) {
                    let obj = {};
                    obj[outName.eleId] = outArr[k];
                    obj[outNum.eleId] = data[j][outNum.eleId]["eleValue"].split(
                      "/"
                    )[k];
                    outArrNew.push(obj);
                  }
                  data[j]["outTableDataProp"] = outArrNew;
                  this.outTableDataProp[this.currentIndex] = outArrNew;
                } else {
                  let obj = {};
                  obj[outName.eleId] = data[j][outName.eleId]["eleValue"];
                  obj[outNum.eleId] = data[j][outNum.eleId]["eleValue"];
                  data[j]["outTableDataProp"] = [obj];
                  this.outTableDataProp[this.currentIndex] = [obj];
                }
              }
            }
          }
        }
      }
      this.statisticsDialog = val.flag;
    },
    //获取小结弹框样式
    getConclusionStyle() {
      this.conclusionStyle = {};
      let eleEventList = this.nursingTreeDataSave[0].eleEventList;
      for (let i in eleEventList) {
        let item = eleEventList[i];
        if (item.EveCode == "CDEE_Quantity") {
          this.conclusionStyle = item.allObj.summary;
        }
      }
    },
    //同步体温单
    asyncTemp(value) {
      if (!value) {
        return;
      }
      //同步体温单接口
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      /* if (columnIndex === 0) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      } */
      return {
        rowspan: 1,
        colspan: 1
      };
    },
    updateTableDataProp(data) {
      this.inTableDataProp = data.inTableDataProp;
      this.outTableDataProp = data.outTableDataProp;
    },
    ...mapActions({
      changeNursingTreeData: "nurseDocument/changeNursingTreeData",
      changeInData: "nurseDocument/changeInData",
      changeOutData: "nurseDocument/changeOutData",
      changeCurrentIndex: "nurseDocument/changeCurrentIndex"
    }),
    headerClick(column) {
      // console.log(column);
      if (column.level !== 1) {
        this.findCircle1(this.treeData.eleList, column.property, (item, i) => {
          // console.log(item);
          // console.log(i);
          /* this.itemValueClick({
            item: item,
            itemIndex: -1,
            index: i,
            level: column.level
          }); */
          console.log(item);
          if (this.checkedElement()) {
            this.dialogVisible = true;
            this.eleDetailInfoProp = {};
            let obj = item;
            this.eleDetailInfoProp = obj;
            this.modifyEleAttrProps = {
              itemIndex: -1,
              index: i,
              level: column.level,
              eleId: column.property
            };
          }
        });
      }
    },
    dialogClose() {
      this.eleDetailInfoProp = {};
      this.dialogVisible = false;
    },
    itemValueClick(data) {
      if (this.checkedElement()) {
        this.dialogVisible = true;
        this.eleDetailInfoProp = {};
        // 传入的值是  默认的属性列表 不是可以编辑修改的
        // 把对应的 recordValueJson 下面的数据传入
        let obj = deepClone(data.item);

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
      // console.log(this.treeData,this.modifyEleAttrProps.index,"this.treeData.");
      // 修改eleList对应的数据
      if (this.modifyEleAttrProps.level) {
        if (this.modifyEleAttrProps.level > 1) {
          this.findCircle1(this.treeData.eleList, this.eleId, (item, i) => {
            item = data;
          });
        }
      } else {
        if (this.modifyEleAttrProps.index > -1) {
          this.$set(this.treeData.eleList, this.modifyEleAttrProps.index, data);
          console.log(this.treeData, "this.treeData===");
          this.randomkey = Math.random() * 1000000000;
        } else if (this.modifyEleAttrProps.index === -1) {
          this.treeData = deepClone(data);
        }
      }
      this.$forceUpdate();
      // 执行保存操作
      this.dialogVisible = false;
      this.$emit("saveFunc");
    },
    upSaveFunc() {
      // 执行保存操作
      this.$emit("saveFunc");
    },
    //表数据反显 （科室用）
    async transformTable(columns, conditionMap, tableName) {
      try {
        let data = {
          tableName: tableName || "",
          columns: columns || "",
          conditionMap: conditionMap || {}
        };
        let resData = await getTableData(data);
        if (resData.code === 1 && resData.data != []) {
          return Promise.resolve(resData.data[0][columns]);
        }
        return "未知";
      } catch (error) {
        return "未知";
      }
    },
    // 为每个单元格设置样式
    rowClass({ row, column, rowIndex, columnIndex }) {
      return "row-column";
    },
    datePickerChange(e, index) {
      this.rowClick(index);
    },
    handleNameShow(list) {
      return list.elementBaseName == "基本元素" ||
        list.commonAttributeDto.nameStyle !== "hidden"
        ? (list.elementName || list.commonAttributeDto.placeholderText)
        : "";
    },
    initCurrentDate() {
      /* let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hour = date.getHours();
      let minute = date.getMinutes();
      if (month < 10) {
        month = "0" + month;
      }
      let sj = `${year}${month}${day} ${hour}${minute}`;
      return sj; */
      return this.dayjs(new Date()).format("YYYYMMDD HHmm");
    },
    showtableItem(tableItem) {
      return (
        tableItem.commonAttributeDto.checkHidden === "0" && tableItem.visible
      );
    },
    //单表格文书数据引用
    async setQuoteValue(data) {
      for (let i in data) {
        for (let j in data[i].nodes) {
          await this.findCircle0(data[i].nodes[j].eleId, function(item) {
            item.eleValue = data[i].nodes[j].eleValue;
          });
        }
      }
    },
    //单表格文书基本元素赋值
    async setBasicEle(data) {
      let _this = this;
      for (let i in data) {
        await this.findCircle2(data[i].elementCode, function(item) {
          if (data[i].elementName === "科室") {
            _this
              .transformTable(
                "org_nm",
                {
                  org_type: "_DEPT_",
                  id: data[i].elementValue
                },
                "sys_org"
              )
              .then(res => {
                // console.log(res, "res");
                item.eleValue = res;
              });
          } else {
            item.eleValue = data[i].elementValue;
          }
        });
      }
    },
    findCircle0(value, fn) {
      let data = this.tableData;
      for (let i in data) {
        for (let j in data[i]) {
          if (j == value) {
            fn(data[i][j]);
          }
        }
      }
    },
    findCircle2(value, fn) {
      let data = this.tableData;
      for (let i in data) {
        for (let j in data[i]) {
          if (data[i][j].elementCode == value) {
            fn(data[i][j]);
          }
        }
      }
    },
    //递归循环表数据
    // eslint-disable-next-line complexity
    forCircleTable(tableItem) {
      let list = tableItem.eleList;
      for (let i in list) {
        list[i].eleValue = "";
        // list[i].level = list[i].level || Number(level) + 1;
        list[i].level = list[i].level || 1;
        list[i].eleId =
          list[i].eleId ||
          list[i].elementCode +
            Math.random()
              .toString()
              .substr(3, 7);

        if (list[i].eleList && list[i].eleList.length > 0) {
          this.forCircleTable(list[i]);
        } else {
          for (let k in this.tableData) {
            /*  */
            let obj = {
              ...list[i],
              parentId: tableItem.eleId || "first"
            };
            //默认值
            let defaultValues = list[i]["commonAttributeDto"]["defaultValues"];
            if (list[i].elementBaseName == "多选下拉元素") {
              obj.eleValue = [];
            } else if (list[i].elementBaseName == "多选元素") {
              if (list[i].eleValue === undefined || list[i].eleValue == "") {
                if (list[i].valueLst.length) {
                  let eleValues = [];
                  for (let j in list[i].valueLst) {
                    if (list[i].valueLst[j].defaultSelection === "1") {
                      eleValues.push(list[i].valueLst[j].vMean);
                    }
                  }
                  obj.eleValue = eleValues;
                } else {
                  obj.eleValue = false;
                }
              }
            } else if (list[i].elementBaseName == "单选元素") {
              if (list[i].eleValue === undefined || list[i].eleValue == "") {
                if (list[i].valueLst.length) {
                  for (let j in list[i].valueLst) {
                    if (list[i].valueLst[j].defaultSelection === "1") {
                      obj.eleValue = list[i].valueLst[j].vMean;
                    }
                  }
                } else {
                  obj.eleValue = "";
                }
              }
            } else if (list[i].elementBaseName == "数字元素") {
              let attr = list[i].proprietaryAttributeVoLst;
              for (let j in attr) {
                if (attr[j].proprietaryCode == "0304") {
                  list[i].maxLengthText =
                    attr[j].proprietaryContent === ""
                      ? Infinity
                      : Number(attr[j].proprietaryContent);
                }
                if (attr[j].proprietaryCode == "0303") {
                  list[i].minLengthText =
                    attr[j].proprietaryContent === ""
                      ? -Infinity
                      : Number(attr[j].proprietaryContent);
                }
                if (attr[j].proprietaryCode == "0302") {
                  list[i].precision =
                    attr[j].proprietaryContent === ""
                      ? ""
                      : Number(attr[j].proprietaryContent);
                }
                if (attr[j].proprietaryCode == "0300") {
                  list[i].unit = attr[j].proprietaryContent;
                }
                if (attr[j].proprietaryCode == "0301") {
                  list[i].unitShow = attr[j].proprietaryContent;
                }
              }
              obj.eleValue = defaultValues || undefined;
            } else if (list[i].elementBaseName == "文本元素") {
              let attr = list[i].proprietaryAttributeVoLst;
              for (let j in attr) {
                if (attr[j].proprietaryCode == "0100") {
                  list[i].maxLengthText = attr[j].proprietaryContent;
                }
                if (attr[j].proprietaryCode == "0101") {
                  list[i].minLengthText = attr[j].proprietaryContent;
                }
              }
              obj.eleValue = defaultValues || "";
            } else if (list[i].elementBaseName == "日期元素") {
              let attr = list[i].proprietaryAttributeVoLst;
              let flag = 0;
              for (let j in attr) {
                if (attr[j].proprietaryCode == "0700") {
                  if (attr[j].proprietaryContent === "1") {
                    flag = 1;
                  }
                }
                if (attr[j].proprietaryCode == "0701") {
                  list[i].dateFormat = attr[j].proprietaryContent;
                }
              }
              obj.eleValue =
                flag === 1
                  ? new Date().format(list[i].dateFormat)
                  : defaultValues || "";
            } else if (list[i].elementBaseName == "签名元素") {
              list[i].nursingList = this.nursingList;
              obj.eleValue = defaultValues || "";
              let attr = list[i].proprietaryAttributeVoLst;
              for (let j in attr) {
                if (attr[j].proprietaryCode == "1101") {
                  if (attr[j].proprietaryContent == "1") {
                    obj.eleValue = Base64.decode(getUserName());
                  }
                }
              }
            } else {
              obj.eleValue = defaultValues || "";
            }
            this.$set(this.tableDataItem, list[i].eleId, deepClone(obj));
            /*  */
            if (!this.tableData[k][list[i].eleId]) {
              //无数据
              this.$set(this.tableData[k], list[i].eleId, deepClone(obj));
              this.$set(this.tableData[k], "recordId", "");
              this.$set(this.tableData[k], "dataVersion", "");
              this.$set(this.tableData[k], "deletedStatus", "");
              this.$set(this.tableData[k], "index", k);
              // this.$set(this.tableData[k], "date", this.initCurrentDate());
            } else {
              //有数据
              let value = this.tableData[k][list[i].eleId].eleValue;
              this.$set(this.tableData[k], list[i].eleId, {
                ...list[i],
                parentId: tableItem.eleId || "first",
                eleValue: value
              });
              this.$set(
                this.tableData[k],
                "recordId",
                this.treeData.recordId[k] || ""
              );
              this.$set(
                this.tableData[k],
                "dataVersion",
                this.treeData.dataVersion[k]
              );
              this.$set(
                this.tableData[k],
                "deletedStatus",
                this.treeData.deletedStatus[k]
              );
              this.$set(this.tableData[k], "index", k);
              // this.$set(this.tableData[k], "date", this.initCurrentDate());
              /*  this.$set(this.tableDataItem, list[i].eleId, {
                ...list[i],
                parentId: tableItem.eleId || "first",
                eleValue: ""
              }); */
            }
          }
        }
      }
    },
    valueClick(item, $index, index) {
      this.$forceUpdate();
      console.log(item);
      console.log(this.treeData);
      // 默认选中
      this.rowClick($index);
      this.currentControl = item;
      this.currentIndex = $index;
      // this.itemValueClick({ item, itemIndex: $index, index });
      if (this.checkedElement()) {
        this.dialogVisible = true;
        this.eleDetailInfoProp = {};
        // 传入的值是  默认的属性列表 不是可以编辑修改的
        // 把对应的 recordValueJson 下面的数据传入
        let obj = deepClone(item);
        this.eleDetailInfoProp = obj;
        this.modifyEleAttrProps = {
          itemIndex: $index,
          index: index
        };
      }
    },
    handlerRadioClick(treeData, row, index, item, itemIndex, e, key) {
      if (e.target.tagName !== "INPUT") {
        return;
      }

      try {
        let tableDataItem = this.tableData[index];
        let value = tableDataItem[item.eleId].eleValue;
        if (key >= 0) {
          let vMean = item.valueLst[key].vMean;
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
      } catch (error) {}
    },
    //控制单选框
    // eslint-disable-next-line complexity
    selectChange(treeData, row, index, item, itemIndex, e) {
      this.$forceUpdate();
      //数值改变加标识
      this.$set(this.tableData[this.currentIndex], "isModify", true);
      this.rowClick(index);
      let tableDataItem = this.tableData[index];
      let obj = tableDataItem[item.eleId];
      if (
        item.elementBaseName == "单选元素" ||
        item.elementBaseName == "多选元素"
      ) {
        if (!item.valueLst.length) {
          for (let i in tableDataItem) {
            // 单选设置互斥效果
            if (
              item.elementBaseName == "单选元素" &&
              tableDataItem[i].parentId == obj.parentId &&
              i != item.eleId
            ) {
              this.$set(tableDataItem[i], "eleValue", "");
            }
          }
        }
      }
      this.commonChange(treeData, row, index, item, itemIndex, e);
    },
    inputChange(treeData, row, index, item, itemIndex, e) {
      this.$forceUpdate();
      //数值改变加标识
      this.$set(this.tableData[this.currentIndex], "isModify", true);
      this.commonChange(treeData, row, index, item, itemIndex, e);
    },
    //交互
    commonChange(treeData, row, index, items, itemIndex, e) {
      let value = row[items.eleId].eleValue;
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
            this.findCircle(item.EveTarget, function(eveTargetItem) {
              eveTargetItem.eleValue = total;
            });
          } else if (item.EveCode == "CDEE_SetVal") {
            for (let j in item.EveList) {
              const _this = this;
              this.findCircle(item.EveList[j], res => {
                let data = res.eleValue;
                for (let k in item.EveContions) {
                  let contionItem = item.EveContions[k];
                  contionItem.EveTarget.forEach(async (item0, index) => {
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
                        debugger;
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
                    });
                  });
                }
              });
            }
          } else if (item.EveCode == "CDEE_SetEna") {
            for (let j in item.EveList) {
              const _this = this;
              _this.findCircle(item.EveList[j], function(res) {
                let data = Number(res.eleValue);
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
                          debugger;
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
                let data = Number(res.eleValue);
                for (let k in item.EveContions) {
                  let contionItem = item.EveContions[k];
                  contionItem.EveTarget.forEach(async (item0, index) => {
                    await _this.findCircle1(
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
    //寻找要计算的元素的值
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
          fn(eleList[i], i);
        } else if (eleList[i].eleList && eleList[i].eleList.length) {
          this.findCircle1(eleList[i].eleList, eleId, fn);
        }
      }
    },
    inputFocus(tableItem, index, e) {
      this.currentControl = tableItem;
      this.currentIndex = index;
      this.inTableParams = [];
      this.outTableParams = [];
      let eleEventList = this.nursingTreeDataSave[0].eleEventList;
      for (let i in eleEventList) {
        let item = eleEventList[i];
        if (!item.EveList || !item.EveList.length) {
          continue;
        }
        let indexof = item.EveList.indexOf(this.currentControl.eleId);
        if (indexof > -1) {
          // 出入量处理
          if (item.EveCode == "CDEE_Quantity") {
            if (item.allObj.quantity.editStyle === 2) {
              return;
            }
            this.inTableDataProp[this.currentIndex] =
              this.tableData[this.currentIndex]["inTableDataProp"] || [];
            this.outTableDataProp[this.currentIndex] =
              this.tableData[this.currentIndex]["outTableDataProp"] || [];
            for (let j in item.EveListObj) {
              for (let k in item.EveListObj[j]) {
                if (this.currentControl.eleId == item.EveListObj[j][k].eleId) {
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
                      this.inQuantityDataObj[item.EveListObj[0][v].eleId] = "";
                    }
                    this.inQuantityData = [...item.EveListInit[0]];
                    this.inQuantityDialog = true;
                  } else if (j == 1) {
                    for (let v in item.EveListObj[1]) {
                      this.outTableParams.push({
                        label:
                          item.EveListObj[1][v].commonAttributeDto
                            .placeholderText ||
                          item.EveListObj[1][v].elementName,
                        prop: item.EveListObj[1][v].eleId,
                        ...item.EveListObj[1][v]
                      });
                      this.outQuantityDataObj[item.EveListObj[1][v].eleId] = "";
                    }
                    this.outQuantityData = [...item.EveListInit[1]];
                    this.outQuantityDialog = true;
                  }
                }
              }
            }
          }
        }
      }
    },
    //清空
    resTableItem(row, index) {
      this.$confirm("是否清空?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        for (let i in this.tableData[index]) {
          if (this.tableData[index][i].eleValue) {
            this.$set(this.tableData[index][i], "eleValue", "");
          } else if (i === "date") {
            this.$set(this.tableData[index], i, "");
          }
        }
      });
    },
    //新增数据
    addTableItem(date, data = {}) {
      this.tableDataItem.date = date || this.initCurrentDate();
      let rowData = deepClone(this.tableDataItem);
      // console.log(rowData, "rowDatarowDatarowData");
      this.$set(this.tableData, this.tableData.length, {
        ...rowData,
        index: this.tableData.length,
        ...deepClone(data)
      });
      this.rowClick(this.tableData.length - 1);
    },
    //copy数据
    tableCopy() {
      let selections = this.selections;
      for (let i in selections) {
        let rowData = deepClone(selections[i]);
        this.$set(this.tableData, this.tableData.length, {
          ...rowData,
          date: "",
          dataVersion: "",
          deletedStatus: "",
          recordId: "",
          index: this.tableData.length
        });
      }
    },
    //表格border拖拽
    headerDragend(newWidth, oldWidth, column, event) {
      this.changeTableWidth(this.nursingTreeDataSave[0], column);
    },
    //改变表头宽度
    changeTableWidth(item, column) {
      let list = item.eleList;
      for (let i in list) {
        if (list[i].eleId == column.property) {
          if (
            (list[i].elementBaseName == "多选元素" &&
              list[i].valueLst.length > 1) ||
            (list[i].elementBaseName == "单选元素" &&
              list[i].valueLst.length > 1)
          ) {
            for (let j in list[i].valueLst) {
              if (list[i].valueLst[j]["vMean"] === column["label"]) {
                list[i].valueLst[j]["width"] = column.width.toString();
              }
            }
          } else if (list[i].elementBaseName == "有无元素") {
            let proList = list[i].proprietaryAttributeVoLst;
            for (let j in proList) {
              if (
                (proList[j].proprietaryCode === "0800" ||
                  proList[j].proprietaryCode === "0801") &&
                proList[j]["proprietaryContent"] === column["label"]
              ) {
                proList[j]["width"] = column.width.toString();
              }
            }
          } else {
            list[i].width = column.width.toString();
          }
          return;
        }
        if (list[i].eleList && list[i].eleList.length > 0) {
          this.changeTableWidth(list[i], column);
        }
      }
    },
    //点击某一行
    rowClick(index) {
      this.$refs.multiTable.toggleRowSelection(this.tableData[index], true);
    },
    rowClickInit(row) {
      this.$refs.multiTable.toggleRowSelection(row, true);
    },
    //选中项改变
    selectionChange(selections) {
      this.selections = [...selections];
    },
    //处理要保存或删除的数据
    handleData(isSave) {
      let treeData = deepClone(this.treeData);
      let params = {
        dataVersion: treeData.dataVersion,
        recordId: "",
        docCode: treeData.docCode || "",
        docVersion: treeData.docVersion,
        docType: "2",
        deptCode: this.role.deptCode,
        inpCode: this.receivePatientData.treatNo,
        recordDate: "",
        recordTime: "",
        deletedStatus: isSave === 0 ? treeData.deletedStatus : "1",
        recordValueJson: [],
        recordContent: {
          docCode: treeData.docCode || "",
          docVersion: treeData.docVersion,
          eleList: treeData.eleList,
          eleEventList: treeData.eleEventList,
          docStyles: treeData.docStyles || {}
        }
      };
      return params;
    },
    async handleTableData(isSave) {
      let selection = deepClone(this.selections);
      let selections = [];
      let data = []; //最终集合
      let treeData = this.handleData(isSave);
      if (isSave === 1) {
        for (let i in selection) {
          if (selection[i].recordId) {
            selections.push(selection[i]);
          } else {
            for (let j in this.tableData) {
              if (selection[i]["index"] === this.tableData[j]["index"]) {
                this.$delete(this.tableData, j);
              }
            }
          }
        }
      } else {
        selections = selection;
      }
      for (let i in selections) {
        if (isSave !== 1 && !selections[i].date) {
          this.$message.error("更新失败，请填写日期时间");
          return false;
        }

        let recordDate = selections[i].date.split(" ")[0] || "";
        let recordTime = selections[i].date.split(" ")[1] || "";
        this.$set(data, i, {
          ...treeData,
          recordId: selections[i].recordId || "",
          dataVersion: selections[i].dataVersion,
          deletedStatus: isSave === 0 ? selections[i].deletedStatus : "1",
          recordDate: recordDate,
          recordTime: recordTime,
          recordValueJson: [{ ...selections[i] }]
        });
      }

      for (let i in data) {
        let eleList = data[i].recordContent.eleList;
        let recordValueJson = data[i].recordValueJson;
        let flag = await this.firCicleData(eleList, recordValueJson, isSave);
        if (!flag) {
          return false;
        }
      }

      if (isSave === 1 && !selections.length && this.selections.length) {
        this.$message.success("删除成功");
        return false;
      }
      if (!this.selections.length) {
        this.$message("请先选中记录再进行操作!");
        return false;
      }

      return data;
    },
    async firCicleData(list, value, isSave) {
      for (let i in list) {
        for (let j in value) {
          for (let k in value[j]) {
            //isVerify:如果记录为统计数据，不需要校验
            if (!value[j]["isVerify"]) {
              if (
                value[j][k].elementCode &&
                (value[j][k].elementBaseName == "文本元素" ||
                  value[j][k].elementBaseName == "数字元素" ||
                  value[j][k].elementBaseName == "签名元素" ||
                  value[j][k].elementBaseName == "日期元素") &&
                value[j][k].commonAttributeDto.checkEmpty === "0" &&
                (value[j][k].eleValue === "" ||
                  value[j][k].eleValue === undefined) &&
                isSave === 0
              ) {
                this.$message.error(
                  "【" + value[j][k].elementName + "】不可为空"
                );
                return false;
              }
              if (
                value[j][k].elementCode &&
                (value[j][k].elementBaseName == "多选元素" ||
                  value[j][k].elementBaseName == "多选下拉元素") &&
                value[j][k].commonAttributeDto.checkEmpty === "0" &&
                (!value[j][k].eleValue || !value[j][k].eleValue.length) &&
                isSave === 0
              ) {
                this.$message.error(
                  "【" + value[j][k].elementName + "】不可为空"
                );
                return false;
              }
              if (
                value[j][k].elementCode &&
                (value[j][k].elementBaseName == "单选元素" ||
                  value[j][k].elementBaseName == "单选下拉元素") &&
                value[j][k].commonAttributeDto.checkEmpty === "0" &&
                (value[j][k].eleValue === "" ||
                  value[j][k].eleValue === undefined) &&
                isSave === 0
              ) {
                this.$message.error(
                  "【" + value[j][k].elementName + "】不可为空"
                );
                return false;
              }
              if (
                value[j][k].elementCode &&
                value[j][k].elementBaseName == "文本元素" &&
                value[j][k].minLengthText !== undefined &&
                value[j][k].minLengthText !== "" &&
                value[j][k].eleValue !== undefined &&
                value[j][k].eleValue.length < value[j][k].minLengthText &&
                isSave === 0 &&
                value[j][k].commonAttributeDto.checkEmpty !== "1"
              ) {
                this.$message.error(
                  "【" +
                    value[j][k].elementName +
                    "】值的长度不可小于" +
                    value[j][k].minLengthText
                );
                return false;
              }
              if (
                value[j][k].elementCode &&
                value[j][k].elementBaseName == "数字元素" &&
                value[j][k].minLengthText !== undefined &&
                value[j][k].minLengthText !== "" &&
                // value[j][k].eleValue !== undefined &&
                Number(value[j][k].eleValue) <
                  Number(value[j][k].minLengthText) &&
                isSave === 0 &&
                value[j][k].commonAttributeDto.checkEmpty !== "1"
              ) {
                this.$message.error(
                  "【" +
                    value[j][k].elementName +
                    "】值不可小于" +
                    value[j][k].minLengthText
                );
                return false;
              }
              if (
                value[j][k].elementCode &&
                value[j][k].elementBaseName == "数字元素" &&
                value[j][k].maxLengthText !== undefined &&
                value[j][k].maxLengthText !== "" &&
                // value[j][k].eleValue !== undefined &&
                Number(value[j][k].eleValue) >
                  Number(value[j][k].maxLengthText) &&
                isSave === 0 &&
                value[j][k].commonAttributeDto.checkEmpty !== "1"
              ) {
                this.$message.error(
                  "【" +
                    value[j][k].elementName +
                    "】值不可大于" +
                    value[j][k].maxLengthText
                );
                return false;
              }
            }
            if (list[i].eleId == k) {
              list[i].eleValue = value[j][k].eleValue;
            }
          }
        }
        if (list[i].eleList && list[i].eleList.length) {
          if (!(await this.firCicleData(list[i].eleList, value, isSave))) {
            return false;
          }
        }
      }
      return true;
    },
    updateRecord(isSave) {
      if (isSave === 1) {
        this.$confirm("是否删除选中记录?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            await this.updateRecords(isSave);
          })
          .catch(() => {
            this.$message("已取消删除");
            return;
          });
      } else {
        this.updateRecords(isSave);
      }
    },
    //保存记录
    async updateRecords(isSave) {
      this.$refs.multiTable.doLayout();

      /* 判断删除的是否都是新增的 */
      let count = 0;
      let isDelete = false;
      for (let i in this.selections) {
        if (!this.selections[i]["recordId"]) {
          count++;
        }
      }
      if (isSave === 1 && count === this.selections.length) {
        isDelete = true;
      }
      /* 判断删除的是否都是新增的 */
      //判断是否有改动
      let flag = false;
      let selectsNo = [];
      for (let i in this.tableData) {
        let num = 0;
        for (let j in this.selections) {
          if (this.selections[j]["index"] === this.tableData[i]["index"]) {
            num++;
          }
        }
        if (num === 0) {
          selectsNo.push(this.tableData[i]);
        }
      }
      for (let i in selectsNo) {
        if (
          (selectsNo[i]["isModify"] || !selectsNo[i]["recordId"]) &&
          !isDelete
        ) {
          flag = true;
          break;
        }
      }
      if (flag) {
        await this.$confirm(
          "表格中有未保存的数据，更新之后将整体刷新表格，是否确认更新?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(async () => {
            await this.saveRecord(isSave);
          })
          .catch(() => {
            this.$message("已取消更新");
            return;
          });
      } else {
        await this.saveRecord(isSave);
      }
    },
    async saveRecord(isSave) {
      let params = await this.handleTableData(isSave);
      if (params === false || params === undefined) {
        return;
      }
      this.$showLoading();
      try {
        let treeData = deepClone(this.treeData);
        await this.forCircle(treeData.eleList);
        let data = await saveOrUpdateDocClass(params);
        if (data.code == "1") {
          this.$message.success("更新成功");
          this.changeInData({});
          this.changeOutData({});
          this.changeCurrentIndex("");
          await this.$emit("updateRecordList", false, 2, isSave);
        } else {
          this.$message.error(data.msg || "更新失败");
        }
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "更新失败");
      }
    },
    forCircle(list) {
      for (let i in list) {
        this.$delete(list[i], "idNew");
        this.$delete(list[i], "level");
        // this.$delete(list[i], "width");
        // this.$delete(list[i], "colNum");
        // this.$delete(list[i], "col");
        this.$delete(list[i], "resizable");
        this.$delete(list[i], "index");
        this.$delete(list[i], "enable");
        this.$delete(list[i], "visible");
        this.$delete(list[i], "basicEleValue");
        if (list[i].eleList && list[i].eleList.length) {
          this.forCircle(list[i].eleList);
        }
      }
    },
    //确定入量
    confirmIn(inTableData) {
      // console.log("inTableData", inTableData);
      this.inTableDataProp[this.currentIndex] = [...inTableData];
      this.tableData[this.currentIndex]["inTableDataProp"] = [...inTableData];
      this.inQuantityDialog = false;
      const _this = this;
      let ii = 0;
      inTableData.forEach((item, index) => {
        ii++;
        for (let i in item) {
          for (let j in _this.inQuantityDataObj) {
            if (i == j) {
              if (ii <= 1) {
                _this.inQuantityDataObj[j] += item[i];
              } else {
                _this.inQuantityDataObj[j] += "/" + item[i];
              }
            }
          }
        }
      });
      for (let j in _this.inQuantityDataObj) {
        _this.findCircle(j, function(item) {
          if (item.elementBaseName == "多选下拉元素") {
            item.eleValue = _this.inQuantityDataObj[j].split("/");
          } else {
            item.eleValue = _this.inQuantityDataObj[j];
          }
        });
      }
    },
    //取消入量
    cancelIn() {
      this.inQuantityDialog = false;
    },
    //确定出量
    confirmOut(outTableData) {
      // console.log("outTableData", outTableData);
      this.outTableDataProp[this.currentIndex] = [...outTableData];
      this.tableData[this.currentIndex]["outTableDataProp"] = [...outTableData];
      this.outQuantityDialog = false;
      const _this = this;
      let ii = 0;
      outTableData.forEach((item, index) => {
        ii++;
        for (let i in item) {
          for (let j in _this.outQuantityDataObj) {
            if (i == j) {
              if (ii <= 1) {
                _this.outQuantityDataObj[j] += item[i];
              } else {
                _this.outQuantityDataObj[j] += "/" + item[i];
              }
            }
          }
        }
      });
      for (let j in _this.outQuantityDataObj) {
        _this.findCircle(j, function(item) {
          if (item.elementBaseName == "多选下拉元素") {
            item.eleValue = _this.outQuantityDataObj[j].split("/");
          } else {
            item.eleValue = _this.outQuantityDataObj[j];
          }
        });
      }
    },
    //取消出量
    cancelOut() {
      this.outQuantityDialog = false;
    },
    //添加小结
    /*addConclusion() {
        this.conclusionDialog = true;
      },*/
    classesChange(value) {
      let endTime = new Date().format("yyyy-MM-dd");
      let num = this.conclusionDialogProp.name === "minConclusion" ? 8 : 24;
      this.conclusion.time = [
        new Date(endTime + " " + value).format("yyyy-MM-dd HH:mm:ss"),
        new Date(
          new Date(endTime + " " + value).getTime() - num * 60 * 60 * 1000
        ).format("yyyy-MM-dd HH:mm:ss")
      ];
    },
    //自动统计
    async autoStatistics(value) {
      // console.log(this.conclusion);
      if (!value) {
        return;
      }
      if (!this.conclusion.time.length) {
        this.$message.error("请先选择时间!");
        return;
      }
      let startDate = new Date(this.conclusion.time[0]).getTime();
      let endDate = new Date(this.conclusion.time[1]).getTime();

      let eleEventList = this.nursingTreeDataSave[0].eleEventList;
      for (let i in eleEventList) {
        let items = eleEventList[i];
        if (items.EveCode == "CDEE_Quantity") {
          let EveListObj = items.EveListObj;
          let quantityObj = items.allObj.quantity;
          let dateFormat = items.allObj.summary.dateFormat;
          //判断入量名称与入量量、出量
          let inName = quantityObj.inQuantity.eleList[0].nameList;
          let inNum = quantityObj.inQuantity.eleList[0].valueList;
          let outName = quantityObj.outQuantity.eleList[0].nameList;
          let outNum = quantityObj.outQuantity.eleList[0].valueList;
          //出入量录入项目集合
          let arrIn = [];
          let arrOut = [];
          //统计项目最总值

          let allIn = {};
          let allOut = {};

          await this.tableData.forEach((item, index) => {
            let dateStr = item.date;
            let date =
              dateStr.slice(0, 4) +
              "/" +
              dateStr.slice(4, 6) +
              "/" +
              dateStr.slice(6, 8) +
              dateStr.slice(8, 11) +
              ":" +
              dateStr.slice(11, 13) +
              ":00";
            let dateTime = new Date(date).getTime();
            if (dateTime >= startDate && dateTime <= endDate) {
              arrIn.push(item.inTableDataProp);
              arrOut.push(item.outTableDataProp);
            }
          });
          // console.log(arrIn);
          // console.log(arrOut);

          for (let i in arrIn) {
            let item = arrIn[i];
            for (let j in item) {
              let value = item[j];
              allIn[value[inName.eleId]] =
                (Number(allIn[value[inName.eleId]]) || 0) +
                Number(value[inNum.eleId]);
            }
          }
          // console.log("allIn", allIn);
          for (let i in arrOut) {
            let item = arrOut[i];
            for (let j in item) {
              let value = item[j];
              allOut[value[outName.eleId]] =
                (Number(allOut[value[outName.eleId]]) || 0) +
                Number(value[outNum.eleId]);
            }
          }
          // console.log("allOut", allOut);

          let allInNum = 0; //入量总和
          for (let i in allIn) {
            allInNum += Number(allIn[i]);
          }
          let allOutNum = 0; //出量总和
          for (let i in allOut) {
            allOutNum += Number(allOut[i]);
          }

          //入量标题
          let contentTitle =
            this.conclusionStyle.titleAttr.indexOf("显示标题") > -1
              ? this.conclusion.title
              : "";
          //时间区间
          let startTime = "";
          let endTime = "";
          if (this.conclusionStyle.dateAttr.indexOf("开始时间") > -1) {
            //TODO时间格式
            startTime =
              new Date(this.conclusion.time[0]).format(dateFormat) + " -- ";
          }
          if (this.conclusionStyle.dateAttr.indexOf("结束时间") > -1) {
            endTime = new Date(this.conclusion.time[1]).format(dateFormat);
          }
          //出入量分类
          let inTitle = "";
          let outTitle = "";
          if (this.conclusionStyle.dateAttr.indexOf("分类统计") > -1) {
            for (let i in allIn) {
              inTitle += i + ":" + allIn[i] + "ml;";
            }
            for (let i in allOut) {
              outTitle += i + ":" + allOut[i] + "ml;";
            }
          }

          let contAll =
            contentTitle +
            " " +
            startTime +
            endTime +
            " 总入量: " +
            allInNum +
            "ml " +
            inTitle +
            "总出量: " +
            allOutNum +
            "ml " +
            outTitle;
          // console.log(contAll);
          this.$set(
            this.conclusion,
            "content",
            this.conclusion.content || "" + contAll
          );
          this.$set(this.conclusion, "allIn", allInNum);
          this.$set(this.conclusion, "allOut", allOutNum);
        }
      }
    },
    //保存小结
    saveConclusion() {
      // summaryEle
      let eleEventList = this.nursingTreeDataSave[0].eleEventList;
      let EveTarget;
      let obj = deepClone(this.tableDataItem);
      for (let i in eleEventList) {
        let item = eleEventList[i];
        if (item.EveCode == "CDEE_Quantity") {
          EveTarget = item.allObj.summary.summaryEle.eleId;
          obj[EveTarget].eleValue = this.conclusion.content;
          // obj.date = new Date().format("yyyyMMdd HHmm");
          obj.date = this.initCurrentDate();
          obj.isVerify = true; //统计不需要校验
        }
      }
      this.$set(this.tableData, this.tableData.length, obj);
      this.conclusionDialog = false;
    },
    //取消保存小结
    cancelConclusion() {
      this.conclusion = deepClone(conclusion);
      this.conclusionDialog = false;
    },
    //小结弹框关闭函数
    conclusionClose() {
      this.conclusion = deepClone(conclusion);
    },
    //统计
    async getStatistics() {
      if (!this.statisticsDate) {
        this.$message.error("请先选择时间再进行操作");
        return;
      }
      let statisticsCont = this.$refs.statisticsCont;
      let statisticsData = statisticsCont.tableData;

      let allInNum = 0; //总入量
      let allOutNum = 0; //总出量
      let eleEventList = this.nursingTreeDataSave[0].eleEventList;
      for (let i in eleEventList) {
        let items = eleEventList[i];
        if (!items.EveList || !items.EveList.length) {
          continue;
        }
        if (items.EveCode == "CDEE_Quantity") {
          let EveListObj = items.EveListObj;
          let quantityObj = items.allObj.quantity;
          allInNum = statisticsData[3][quantityObj.inQuantity.allEle.eleId];
          allOutNum = statisticsData[3][quantityObj.outQuantity.allEle.eleId];
          // console.log(allInNum, allOutNum);
          let obj = {
            isVerify: true //统计不需要校验
          };
          obj[quantityObj.inQuantity.allEle.eleId] = {
            ...deepClone(quantityObj.inQuantity.allEle),
            eleValue: allInNum
          };
          obj[quantityObj.outQuantity.allEle.eleId] = {
            ...deepClone(quantityObj.outQuantity.allEle),
            eleValue: allOutNum
          };
          this.addTableItem(this.statisticsDate, obj);
          this.selections = [this.tableData[this.tableData.length - 1]];
          this.statisticsDialog = false;
          await this.updateRecord(0);
        }
      }
    },
    //取消统计
    cancelStatistics() {
      this.statisticsDialog = false;
    }
  }
};
</script>

<style scoped lang="scss">
.table-doc {
  .table-cont {
    /deep/.el-input-number.is-controls-right[class*="medium"]
      [class*="increase"] {
      display: none;
    }
    /deep/.el-input-number.is-controls-right[class*="medium"]
      [class*="decrease"] {
      display: none;
    }
    /deep/.el-input-number.is-controls-right .el-input__inner {
      padding-left: 15px;
      padding-right: 0;
    }
    /deep/ .row-column {
      /deep/ .el-checkbox__label {
        display: none;
      }
    }
    /deep/ .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 100%;
    }

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

    /deep/ .l-input-wrap .l-input-body .l-input-body-left .l-input-title {
      padding: 0 5px;
    }

    /deep/ .l-input-wrap .l-input-body .l-input-body-main {
      padding-left: 0;
    }
  }

  .conclusionDialog-content {
    padding: 20px 20px 10px 20px;

    .conclusion-item {
      margin-bottom: 8px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
  }

  .button-cont {
    padding: 20px;
  }
}
</style>
