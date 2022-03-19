<template>
  <div class="doc-cont clearfix height100 width100">
    <div
      class="row clearfix"
      :style="rowStyle(item, index)"
      v-for="(item, index) in treeData.eleList"
      :key="index"
    >
      <!--解析区域-->
      <!--1.表格-->
      <div
        v-if="item.elementBaseName == '表格元素' && item.level == '2'"
        class="width100 table-content"
        :style="rowDivStyle(item, index)"
      >
        <el-table
          :data="tableData(item)"
          width="100%"
          stripe
          border
          @header-click="headerClick"
          @header-dragend="headerDragend"
        >
          <el-table-column
            :label="handleNameShow(item)"
            :prop="item.eleId"
            :resizable="false"
            header-align="center"
            align="center"
          >
            <el-table-column
              label="操作"
              prop="operate"
              width="150"
              fixed="left"
              :resizable="false"
              header-align="center"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="resTableItem(scope.row, scope.$index, item)"
                  >清空</el-button
                >
                <el-button
                  type="text"
                  v-if="tableData(item).length != 1"
                  @click="delTableItem(scope.row, scope.$index, item)"
                  >删除</el-button
                >
                <el-button
                  type="text"
                  v-if="scope.$index == tableData(item).length - 1"
                  @click="addTableItem(scope.row, scope.$index, item)"
                  >新增</el-button
                >
              </template>
            </el-table-column>
            <!-- -->
            <template
              v-for="(tableItem, idx) in item.eleList"
            >
            <!-- v-if="showtableItem(tableItem)" -->
              <eleTableColums
                v-if="tableItem.eleList && tableItem.eleList.length > 0"
                :key="idx"
                :eleList="tableItem"
                :tableData="tableData(item)"
                @saveFunc="saveFuncUpate"
                @changeCurrentModeFlag="changeCurrentModeFlag"
              ></eleTableColums>
              <!--  -->
              <template v-else>
                <el-table-column
                  v-if="
                    tableItem.elementBaseName == '单选元素' &&
                    tableItem.valueLst.length
                  "
                  :key="idx"
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
                            index,
                            tableItem,
                            scope.$index,
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
                            idx,
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
                        <div
                          @click="
                            valueClick1(tableItem, scope.$index, index, idx)
                          "
                        >
                          <el-radio
                            v-model="scope.row[tableItem.eleId].eleValue"
                            @click.native="
                              handlerRadioClick(
                                treeData,
                                scope.row,
                                index,
                                tableItem,
                                scope.$index,
                                $event,
                                key
                              )
                            "
                            :label="value.vMean"
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
                                idx,
                                $event
                              )
                            "
                            @keyup.tab.native="valueClick1(tableItem, scope.$index, index, idx)"
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
                  :key="idx"
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
                            idx,
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
                        <div
                          @click="
                            valueClick1(tableItem, scope.$index, index, idx)
                          "
                        >
                          <el-checkbox
                            v-model="scope.row[tableItem.eleId].eleValue"
                            :label="value.vMean"
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
                                idx,
                                $event
                              )
                            "
                            @keyup.tab.native="valueClick1(tableItem, scope.$index, index, idx)"
                          ></el-checkbox>
                        </div>
                      </template>
                      <template v-else></template>
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column
                  v-else-if="tableItem.elementBaseName == '有无元素'"
                  :key="idx"
                  :label="handleNameShow(tableItem)"
                  :prop="tableItem.eleId"
                  :resizable="tableItem.resizable"
                  :min-width="tableItem.width"
                  header-align="center"
                  align="center"
                >
                  <el-table-column
                    v-for="(value, key) in tableItem.proprietaryAttributeVoLst"
                    :key="key"
                    v-if="
                      tableItem.proprietaryAttributeVoLst.length &&
                      (value.proprietaryCode == '0800' ||
                        value.proprietaryCode == '0801')
                    "
                    :prop="tableItem.eleId"
                    :label="value.proprietaryContent"
                    :min-width="value.width"
                    header-align="center"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <template v-if="showtableItem(tableItem)">
                        <div
                          @click="
                            valueClick1(tableItem, scope.$index, index, idx)
                          "
                        >
                          <el-radio
                            v-model="scope.row[tableItem.eleId].eleValue"
                            :label="value.proprietaryContent"
                            @click.native="
                              handlerRadioClick(
                                treeData,
                                scope.row,
                                index,
                                tableItem,
                                scope.$index,
                                $event,
                                -1
                              )
                            "
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
                                idx,
                                $event
                              )
                            "
                            @keyup.tab.native="valueClick1(tableItem, scope.$index, index, idx)"
                          ></el-radio>
                        </div>
                      </template>
                      <template v-else></template>
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column
                  v-else
                  :key="idx"
                  :label="handleNameShow(tableItem)"
                  :prop="tableItem.eleId"
                  :min-width="tableItem.width"
                  :resizable="tableItem.resizable"
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
                        >{{ scope.row[tableItem.eleId].eleValue }}</template
                      >
                      <template
                        v-else-if="tableItem.elementBaseName == '数字元素'"
                      >
                        <div
                          @click="
                            valueClick1(tableItem, scope.$index, index, idx)
                          "
                          style="display:flex;"
                        >
                          <div style="flex: 1;">
                            <el-input-number
                              v-model="scope.row[tableItem.eleId].eleValue"
                              controls-position="right"
                              class="width100"
                              :disabled="
                                tableItem.commonAttributeDto.checkReadonly !=
                                  '0' || !tableItem.enable
                              "
                              :max="tableItem.maxLengthText"
                              :min="tableItem.minLengthText"
                              :precision="tableItem.precision || 0"
                              @change="inputChange($event)"
                              @focus="inputFocus($event)"
                              @keyup.tab.native="valueClick1(tableItem, scope.$index, index, idx)"
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
                        <div
                          @click="
                            valueClick1(tableItem, scope.$index, index, idx)
                          "
                        >
                          <el-input
                            v-model="scope.row[tableItem.eleId].eleValue"
                            type="text"
                            class="width100"
                            :disabled="
                            tableItem.elementBaseName == '基本元素' ||
                              (tableItem.commonAttributeDto.checkReadonly !=
                                '0' || !tableItem.enable)
                            "
                            :maxlength="tableItem.maxLengthText"
                            :minlength="tableItem.minLengthText"
                            :show-password="
                              tableItem.elementCode &&
                              tableItem.commonAttributeDto.checkSecret == '1'
                            "
                            @input="inputChange($event)"
                            @focus="inputFocus($event)"
                            @keyup.tab.native="valueClick1(tableItem, scope.$index, index, idx)"
                          ></el-input>
                        </div>
                      </template>
                      <template
                        v-else-if="tableItem.elementBaseName == '有无元素'"
                      >
                        <div
                          @click="
                            valueClick1(tableItem, scope.$index, index, idx)
                          "
                        >
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
                                idx,
                                $event
                              )
                            "
                          >
                            <el-radio
                              :label="value.proprietaryContent"
                              @click.native="
                                handlerRadioClick(
                                  treeData,
                                  scope.row,
                                  index,
                                  tableItem,
                                  scope.$index,
                                  $event,
                                  -1
                                )
                              "
                              v-for="(value,
                              key) in tableItem.proprietaryAttributeVoLst"
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
                          @click="
                            valueClick1(tableItem, scope.$index, index, idx)
                          "
                        >
                          <el-radio
                            v-model="scope.row[tableItem.eleId].eleValue"
                            @click.native="
                              handlerRadioClick(
                                treeData,
                                scope.row,
                                index,
                                tableItem,
                                scope.$index,
                                $event,
                                -1
                              )
                            "
                            :label="idx"
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
                                idx,
                                $event
                              )
                            "
                            @keyup.tab.native="valueClick1(tableItem, scope.$index, index, idx)"
                          ></el-radio>
                        </div>
                        <div
                          v-else
                          class="clearfix"
                          @click="
                            valueClick1(tableItem, scope.$index, index, idx)
                          "
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
                                  idx,
                                  $event
                                )
                              "
                              @keyup.tab.native="valueClick1(tableItem, scope.$index, index, idx)"
                            >
                              <el-radio
                                :label="value.vMean"
                                v-for="(value, key) in tableItem.valueLst"
                                @click.native="
                                  handlerRadioClick(
                                    treeData,
                                    scope.row,
                                    index,
                                    tableItem,
                                    scope.$index,
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
                          @click="
                            valueClick1(tableItem, scope.$index, index, idx)
                          "
                        >
                          <el-checkbox
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
                                idx,
                                $event
                              )
                            "
                            @keyup.tab.native="valueClick1(tableItem, scope.$index, index, idx)"
                          ></el-checkbox>
                        </div>
                        <div
                          v-else
                          class="clearfix"
                          @click="
                            valueClick1(tableItem, scope.$index, index, idx)
                          "
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
                                  idx,
                                  $event
                                )
                              "
                              @keyup.tab.native="valueClick1(tableItem, scope.$index, index, idx)"
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
                          @click.capture="
                            valueClick1(tableItem, scope.$index, index, idx)
                          "
                        >
                          <el-select
                            v-model="scope.row[tableItem.eleId].eleValue"
                            class="width100"
                            :disabled="
                              tableItem.commonAttributeDto.checkReadonly !=
                                '0' || !tableItem.enable
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
                                idx,
                                $event
                              )
                            "
                            @keyup.tab.native="valueClick1(tableItem, scope.$index, index, idx)"
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
                          @click.capture="
                            valueClick1(tableItem, scope.$index, index, idx)
                          "
                        >
                          <el-select
                            v-model="scope.row[tableItem.eleId].eleValue"
                            class="width100"
                            :disabled="
                              tableItem.commonAttributeDto.checkReadonly !=
                                '0' || !tableItem.enable
                            "
                            multiple
                            filterable
                            clearable
                            :allow-create="
                              tableItem.commonAttributeDto.checkEdit === '1'
                            "
                            :placeholder="
                              tableItem.commonAttributeDto.placeholderText
                            "
                            @change="
                              selectChange(
                                treeData,
                                scope.row,
                                scope.$index,
                                tableItem,
                                idx,
                                $event
                              )
                            "
                            @keyup.tab.native="valueClick1(tableItem, scope.$index, index, idx)"
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
                        <div
                          @click.capture="
                            valueClick1(tableItem, scope.$index, index, idx)
                          "
                        >
                          <template v-if="tableItem.dateFormatType === '3'">
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
                              @keyup.tab.native="valueClick1(tableItem, scope.$index, index, idx)"
                            ></el-time-picker>
                          </template>
                          <template v-else>
                            <el-date-picker
                              :type="
                                tableItem.dateFormatType === '2'
                                  ? 'date'
                                  : 'datetime'
                              "
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
                              @keyup.tab.native="valueClick1(tableItem, scope.$index, index, idx)"
                            ></el-date-picker>
                          </template>
                        </div>
                      </template>
                      <template
                        v-else-if="tableItem.elementBaseName == '签名元素'"
                      >
                        <div
                          @click.capture="
                            valueClick1(tableItem, scope.$index, index, idx)
                          "
                        >
                          <retrieve-select
                            :eleValue.sync="scope.row[tableItem.eleId].eleValue"
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
                                idx,
                                $event
                              )
                            "
                            :options="tableItem.nursingList"
                            :key="forceUpdateData"
                            @keyup.tab.native="valueClick1(tableItem, scope.$index, index, idx)"
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
      <!--2.除了表格有子元素的-->
      <div
        v-else-if="!item.eleList || item.eleList.length == 0"
        class="float-left width100 row-item"
        style="width: 100%"
        :class="{
          border:
            (item.elementCode && item.commonAttributeDto.checkDisplay == '1') ||
            !item.elementCode,
        }"
        :style="{ padding: '0', height: item.lineHeight + 'px' }"
        @click="valueClick(item, index)"
      >
        <div :style="rowDivStyle(item, index)" class="width100">
          <tableContain
            :item="item"
            :index="index"
            :currentControl="currentControl"
            :treeData="treeData"
            :nursingTreeDataSave="nursingTreeDataSave"
            @tableContainClick="tableContainClick"
            :tableDataInit="tableDataInit"
            :currentIndex="currentIndex"
          />
        </div>
      </div>
      <!-- v-else-if="checkHiddenHandle(item)" -->
      <div
        v-else
        ref="label"
        class="label border isBackGround float-left"
        :style="{
          'text-align':
            item.commonAttributeDto.nameStyle === 'hidden'
              ? 'center'
              : item.commonAttributeDto.nameStyle,
        }"
      >
        <div v-if="item.elementBaseName !== '标签元素'">
          <tableContain
            :item="item"
            :index="index"
            :treeData="treeData"
            :nursingTreeDataSave="nursingTreeDataSave"
            @tableContainClick="itemValueClick"
            :tableDataInit="tableDataInit"
            :currentIndex="currentIndex"
          />
        </div>
        <!-- <el-tooltip v-else :content="item.elementName" placement="right"> -->
        <!-- <div> -->
        <div
          v-else
          class="label-cont width100 height100"
          :title="
            item.eleId
              ? item.commonAttributeDto.placeholderText || item.elementName
              : ''
          "
          @click="tableContainClick({ item, index })"
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
      <!--解析区域-->
      <!-- &&checkHiddenHandle(item) -->
      <div
        v-if="
          item.eleList &&
          item.eleList.length > 0 &&
          item.elementBaseName != '表格元素'
        "
        class="value float-left"
        ref="value"
      >
        <tableCol
          :treeData="item"
          :styleEle="styleEle"
          @saveFunc="saveFuncUpate"
          :toolsQuote="toolsQuoteCopy"
        ></tableCol>
        <!-- @updateCurrentCtr="updateCurrentCtr"
        :currentItem="{'currentControl':currentControl,'currentIndex':currentIndex}"-->
      </div>
    </div>
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

import tableCol from "../components/tableCol.vue";
import tableContain from "../components/tableContain";
import eleTableColums from "../components/eleTableColums";
import ModifyEleAttr from "@/views/emrRecord/emr/component/modifyEleAttr.vue";

import Base64 from "@/utils/base64";
import { getPamars, getUserName } from "@/utils/auth";
import { deepClone } from "@/utils/index";

export default {
  name: "tableCol",
  components: {
    tableCol,
    tableContain,
    eleTableColums,
    ModifyEleAttr
  },
  props: {
    treeData: {
      type: Object,
      default() {
        return {};
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
    styleEle: {
      type: Object,
      default() {
        return { attr: "", flag: false };
      }
    }
  },
  data() {
    return {
      // 修改元素属性所需要的变量
      dialogVisible: false,
      eleDetailInfoProp: {},
      modifyEleAttrProps: {},
      modifyEleTableAttrProps: {},
      currentModeFlag: true,
      //表格元素的数据
      tableDataInit: [],
      //当前选中元素
      currentControl: { eleId: "" },
      //当前选中元素为表格元素的index值
      currentIndex: -1,
      nursingTreeDataSave: [],
      toolsQuoteCopy: {},
      forceUpdateData: 0
    };
  },
  watch: {
    nursingTreeData: {
      handler(val) {
        if (val && val.length > 0) {
          // this.nursingTreeDataSave[0] = deepClone(val[0]);
          this.nursingTreeDataSave = val;
        }
      },
      immediate: true,
      deep: true
    },
    toolsQuote: {
      handler(val) {
        this.toolsQuoteCopy = val;
        if (this.currentControl.eleId && !val.isFind) {
          if (this.currentModeFlag) {
            this.findCircle(
              this.treeData.eleList,
              this.currentControl.eleId,
              item => {
                // console.log("找到的item",item);
                this.toolsQuoteCopy.isFind = true;
                if (val.current === "phrase") {
                  if (val.data[val.current].actionType === 0) {
                    item.eleValue += val.data[val.current]["templates"];
                    return;
                  }
                  item.eleValue = val.data[val.current]["templates"];
                  return;
                }
                item.eleValue += val.data[val.current];
              }
            );
          } else {
            this.findCircle1(this.currentControl.eleId, res => {
              this.toolsQuoteCopy.isFind = true;
              if (val.current === "phrase") {
                if (val.data[val.current].actionType === 0) {
                  res.eleValue += val.data[val.current]["templates"];
                  return;
                }
                res.eleValue = val.data[val.current]["templates"];
                return;
              }
              if (val.current === "symbol") {
                /* if((res.elementBaseName == '单选下拉元素' || res.elementBaseName == '多选下拉元素') && res.commonAttributeDto.checkEdit == "0"){
                  return;
                } */
              }
              res.eleValue += val.data[val.current];
            });
          }
        }
      },
      // immediate: true,
      deep: true
    },
    currentCtr: {
      handler(val) {
        if (
          // this.currentControl.eleId &&
          (val.currentControl.eleId &&
          this.currentControl.eleId !== val.currentControl.eleId) ||
          (this.currentIndex !== val.currentIndex)
        ) {
          this.currentControl = val.currentControl;
          this.currentIndex = val.currentIndex;
        }
      },
      immediate: true,
      deep: true
    },
    styleEle: {
      async handler(val) {
        if (val.flag && val.attr !== "") {
          if (val.attr === "lineHeight") {
            //全局行高
            await this.forCircleInit(this.treeData.eleList);
            await this.forCircle(this.treeData);
            this.$nextTick(async () => {
              await this.initLayout();
            });
            return;
          }
          if (this.currentControl.eleId) {
            await this.findCircle(
              this.treeData.eleList,
              this.currentControl.eleId,
              async item => {
                if (val.attr === "width") {
                  if (item.colNum !== this.toolValue().widthEle) {
                    item.colNum = this.toolValue().widthEle
                      ? this.toolValue().widthEle
                      : item.colNum;
                    item.currentControl = true;
                  }
                }
                if (val.attr === "height") {
                  if (item.lineHeight !== this.toolValue().heightEle) {
                    item.lineHeight = this.toolValue().heightEle
                      ? this.toolValue().heightEle
                      : item.lineHeight;
                    item.currentControl = true;
                  }
                }
              }
            );
          }

          await this.forCircleInit(this.treeData.eleList);
          await this.forCircle(this.treeData);
          this.$nextTick(async () => {
            await this.initLayout();
          });
        }
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    ...mapGetters("nurseDocument", ["nursingTreeData", "currentCtr"])
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
  async created() {
    await this.forCircle(this.treeData);
  },
  async mounted() {
    await this.$nextTick(async () => {
      await this.initLayout();
    });
  },
  methods: {
    ...mapActions({
      changeNursingTreeData: "nurseDocument/changeNursingTreeData",
      changeCurrentCtr: "nurseDocument/changeCurrentCtr"
    }),
    changeCurrentModeFlag(flag) {
      this.currentModeFlag = flag;
    },
    dialogClose() {
      this.dialogVisible = false;
    },
    //初始化布局
    async initLayout() {
      await this.$nextTick(() => {
        if (this.$refs["label"] != undefined) {
          for (let i in this.$refs["label"]) {
            let item = this.$refs["label"][i];
            let height = item.nextElementSibling.offsetHeight;
            item.style.width = "130px";
            item.style.height = height + "px";
            // item.style.lineHeight = height - 22 + 'px';
            let width = item.offsetWidth;
            item.nextElementSibling.style.width =
              "calc(100% - " + width + "px)";
          }
        }
      });
    },
    //点击表头
    headerClick(column, event) {
      // console.log(column);
      // console.log(this.treeData);
      if (column.level === 1) {
        //表格名称
        this.findCircle(this.treeData.eleList, column.property, (item, i) => {
          // console.log(item);
          // console.log(i);
          this.currentModeFlag = false;
          if (this.checkedElement()) {
            this.dialogVisible = true;
            this.eleDetailInfoProp = {};
            let obj = deepClone(item);
            this.eleDetailInfoProp = obj;
            this.modifyEleTableAttrProps = {
              itemIndex: -1,
              index: i,
              level: column.level
            };
          }
        });
      }
      if (column.level !== 1) {
        this.findTableCircle(
          this.treeData.eleList,
          column.property,
          -1,
          (item, i) => {
            // console.log(item);
            // console.log(i);
            this.currentModeFlag = false;
            if (this.checkedElement()) {
              this.dialogVisible = true;
              this.eleDetailInfoProp = {};
              let obj = item;
              this.eleDetailInfoProp = obj;
              this.modifyEleTableAttrProps = {
                itemIndex: -1,
                idx: i,
                level: column.level
              };
            }
          }
        );
      }
    },
    //TODO  寻找要改变的表格内的的元素以及序号
    findTableCircle(eleList, eleId, idx, fn) {
      for (let i in eleList) {
        if (eleList[i].eleId == eleId && idx !== -1) {
          fn(eleList[i], i);
        } else if (eleList[i].elementBaseName === "表格元素" || idx !== -1) {
          if (eleList[i].eleList && eleList[i].eleList.length) {
            this.findTableCircle(eleList[i].eleList, eleId, i, fn);
          }
        }
      }
    },
    tableContainClick(data) {
      this.currentModeFlag = true;
      this.itemValueClick(data);
    },
    itemValueClick(data) {
      // console.log(data);
      if (!data.item.eleId) {
        return;
      }
      this.currentControl = data.item;
      this.changeCurrentCtr({ currentControl: data.item, currentIndex: -1 });
      if (this.checkedElement()) {
        this.dialogVisible = true;
        this.eleDetailInfoProp = {};
        let obj = deepClone(data.item);
        this.eleDetailInfoProp = obj;
        this.modifyEleAttrProps = {
          index: data.index
        };
      }
    },
    // 执行更新操作
    updateItemData(data) {
      this.nursingTreeDataSave[0].isModify = true;
      this.changeNursingTreeData(this.nursingTreeDataSave);
      // 替换数据
      // 非表格元素被点击修改
      if (this.currentModeFlag) {
        // debugger
        this.$set(this.treeData.eleList, this.modifyEleAttrProps.index, data);
      } else {
        if (this.modifyEleTableAttrProps.level === 1) {
          //表格名称
          this.$set(
            this.treeData.eleList,
            this.modifyEleTableAttrProps.index,
            data
          );
        } else if (this.modifyEleTableAttrProps.level > 1) {
          //二级以及以下的表头属性
          this.findTableCircle(
            this.treeData.eleList,
            this.eleDetailInfoProp.eleId,
            -1,
            (item, i) => {
              item = data;
            }
          );
        }
      }

      // 执行保存操作
      this.dialogVisible = false;
      this.$emit("saveFunc");
    },
    saveFuncUpate() {
      // 执行保存操作
      this.$emit("saveFunc");
    },
    showtableItem(tableItem) {
      return (
        tableItem.commonAttributeDto.checkHidden === "0" && tableItem.visible
      );
    },
    handleNameShow(list) {
      return list.elementBaseName == "基本元素" ||
        list.commonAttributeDto.nameStyle !== "hidden"
        ? (list.elementName || list.commonAttributeDto.placeholderText)
        : "";
    },
    checkHiddenHandle(item) {
      let flag = item.hasOwnProperty("commonAttributeDto");
      if (!flag) {
        return true;
      } else if (flag && item.commonAttributeDto.checkHidden === "0") {
        return true;
      }
      return false;
    },
    //表格元素data
    tableData(item) {
      let tableData = item.eleValue;
      this.tableDataInit = tableData;
      return tableData;
    },
    //列数控制(宽度计算)
    async forCircle(data) {
      let list = data.eleList;
      let arr = [];
      for (let i in list) {
        if (list[i].eleList && list[i].eleList.length > 0) {
          arr.push(list[i]);
        }
      }
      let col = 0;
      let colNumAll = 0;
      if (arr.length > 0) {
        col = 1;
      } else {
        col =
          this.toolValue()["col"] ||
          this.nursingTreeData[0]["docStyles"]["col"];
      }

      for (var i = 0; i < list.length; i++) {
        if (list[i].elementBaseName == "表格元素") {
          await this.forCircleTable1(list[i]);
        } else {
          list[i].lineHeight = !this.toolValue()["isChanged"]
            ? list[i].lineHeight || this.toolValue()["lineHeight"]
            : this.toolValue()["lineHeight"];
          list[i].col = !this.toolValue()["isChanged"]
            ? list[i].col || col
            : this.styleEle.attr === "lineHeight"
            ? list[i].col || col
            : col;
          list[i].colNum = !this.toolValue()["isChanged"]
            ? list[i].colNum || 100 / Number(col) + "%"
            : this.styleEle.attr === "lineHeight"
            ? list[i].colNum || 100 / Number(col) + "%"
            : 100 / Number(col) + "%";
          colNumAll += Number(list[i].colNum.split("%")[0]);
          if (colNumAll == 100) {
            colNumAll = 0;
          } else if (colNumAll > 100) {
            if (
              (arr.length <= 0 && data.col && data.col === 1) ||
              this.toolValue()["layoutStyle"]
            ) {
              let cols =
                col === 1
                  ? this.toolValue()["col"] ||
                    this.nursingTreeData[0]["docStyles"]["col"]
                  : col;
              let num = 0;
              num =
                (100 - colNumAll + Number(list[i].colNum.split("%")[0])) /
                (100 / Number(cols));
              if (num > 0) {
                for (let j = 0; j < num; j++) {
                  //每一行没占满，补齐
                  data.eleList.splice(Number(i) + Number(j), 0, {
                    elementCode: "",
                    enable: true,
                    visible: true,
                    col: cols,
                    colNum: 100 / Number(cols) + "%",
                    lineHeight:
                      list[Number(i) - 1]["lineHeight"] ||
                      this.toolValue()["lineHeight"]
                  });
                }
                colNumAll = Number(list[Number(i) + num].colNum.split("%")[0]);
                i = Number(i) + num;
              }
              colNumAll = colNumAll > 100 ? colNumAll - 100 : colNumAll;
            } else {
              colNumAll = Number(list[i].colNum.split("%")[0]);
            }
          }
        }
      }

      if (
        colNumAll !== 0 &&
        ((arr.length <= 0 && data.col && data.col === 1) ||
          this.toolValue()["layoutStyle"])
      ) {
        let cols =
          col === 1
            ? this.toolValue()["col"] ||
              this.nursingTreeData[0]["docStyles"]["col"]
            : col;
        let num = (100 - colNumAll) / (100 / Number(cols));
        if (num > 0) {
          for (let j = 0; j < num; j++) {
            //每一行没占满，补齐
            data.eleList.push({
              elementCode: "",
              enable: true,
              visible: true,
              col: cols,
              colNum: 100 / Number(cols) + "%",
              lineHeight:
                data.eleList[data.eleList.length - 1]["lineHeight"] ||
                this.toolValue()["lineHeight"]
            });
          }
        }
      }

      let columns = 0;
      let allNums = 0;
      let flagColumns;
      for (let i in list) {
        allNums += Number(list[i].colNum.split("%")[0]);
        list[i]["columns"] = columns;
        if (allNums == 100) {
          columns++;
          allNums = 0;
        }
        if (list[i].currentControl) {
          flagColumns = list[i];
        }
      }
      let columnsItem = list[0];
      for (let j in list) {
        if (
          flagColumns !== undefined &&
          list[j].columns == flagColumns.columns
        ) {
          list[j].lineHeight = flagColumns.lineHeight;
        } else if (list[j]["columns"] === columnsItem["columns"]) {
          list[j].lineHeight = columnsItem["lineHeight"];
        } else if (list[j]["columns"] !== columnsItem["columns"]) {
          list[j].lineHeight = !this.toolValue()["isChanged"]
            ? list[j].lineHeight
            : this.toolValue()["lineHeight"];
          columnsItem = list[j];
        }
        if (list[j].eleList && list[j].eleList.length > 0) {
          await this.forCircle(list[j]);
        }
      }
      flagColumns && (flagColumns["currentControl"] = false);
    },
    async forCircleInit(list) {
      for (let i in list) {
        if (!list[i].eleId) {
          this.$delete(list, i);
          await this.forCircleInit(list);
        } else if (list[i].eleList && list[i].eleList.length > 0) {
          await this.forCircleInit(list[i].eleList);
        }
      }
    },
    //基本元素赋值
    forCircleTable1(item) {
      let basicEleValue = item.basicEleValue;
      let eleValue = item.eleValue;
      for (let i in eleValue) {
        for (let j in eleValue[i]) {
          for (let k in basicEleValue) {
            if (eleValue[i][j].elementCode == basicEleValue[k].elementCode) {
              eleValue[i][j].eleValue = basicEleValue[k].elementValue;
            }
          }
        }
      }
    },
    //row的css样式
    rowStyle(item, index) {
      return {
        width:
          item.elementBaseName === "表格元素" ? "100%" : item.colNum || "100%",
        float:
          item.col === 1 && !this.toolValue()["layoutStyle"] ? "none" : "left",
        background: item.enable ? "transparent" : "#F5F7FA"
        // display: item.visible ? 'block' : 'none'
      };
    },
    rowDivStyle(item, index) {
      return {
        display:
          item.elementCode &&
          item.commonAttributeDto.checkHidden === "0" &&
          item.visible
            ? "block"
            : "none"
      };
    },
    valueClick(item, index) {
      // console.log("点击某一个元素0", item);
      if (!item.eleId) {
        return;
      }
      this.currentControl = item;
      this.changeCurrentCtr({ currentControl: item, currentIndex: -1 });
    },
    valueClick1(item, $index, index, idx) {
      // console.log("点击某一个元素1", item);
      if (!item.eleId) {
        return;
      }
      this.currentModeFlag = false;
      this.currentControl = item;
      this.currentIndex = $index;
      this.changeCurrentCtr({ currentControl: item, currentIndex: $index });
      if (this.checkedElement()) {
        this.dialogVisible = true;
        this.eleDetailInfoProp = {};
        // 传入的值是  默认的属性列表 不是可以编辑修改的
        // let obj = deepClone(item);
        let obj = item;
        this.eleDetailInfoProp = obj;
        this.modifyEleTableAttrProps = {
          level: item.level,
          itemIndex: $index,
          idx: idx,
          index: index
        };
      }
    },
    // 单选按钮实现反选效果
    handlerRadioClick(treeData, row, index, item, itemIndex, e, key) {
      if (e.target.tagName !== "INPUT") {
        return;
      }
      let value = row[item.eleId].eleValue;
      if (key >= 0) {
        let vMean = item.valueLst[key].vMean;
        if (value && value === vMean) {
          // 当前选项被选中的情况下把
          this.$set(row[item.eleId], "eleValue", "");
          this.selectChange(treeData, row, itemIndex, item, index, e);
        }
      } else {
        // 处理单选元素 无子选项的情况
        if (value) {
          this.$set(row[item.eleId], "eleValue", false);
          this.selectChange(treeData, row, itemIndex, item, index, e);
        }
      }
    },
    //控制单选框
    selectChange(treeData, row, index, item, idx, e) {
      this.$forceUpdate();
      /* if (item.elementBaseName == "单选元素") {
        if (!item.valueLst.length) {
          if (item.eleValue == index) {
            for (let i in treeData.eleList) {
              if (i != index) {
                if (treeData.eleList[i].eleId) {
                  treeData.eleList[i].eleValue = "";
                }
              }
            }
          }
        } else if (item.valueLst.length === 1) {
          let vCode = item.valueLst[0].vCode;
          if (item.eleValue == vCode) {
            for (let i in treeData.eleList) {
              if (i != index) {
                if (treeData.eleList[i].eleId) {
                  treeData.eleList[i].eleValue = "";
                }
              }
            }
          }
        }
      } else if (item.elementBaseName == "日期元素") {
      } */
      /* if (item.elementBaseName == "单选下拉元素") {
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
      } else if (item.elementBaseName == "多选下拉元素") {
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
      this.commonChange(row[item.eleId].eleValue);
    },
    async inputChange(value, e) {
      this.$forceUpdate();
      this.commonChange(value);
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
        if (indexof < 0) {
          continue;
        }
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
                      BMIVal = (weight / Math.pow(height, 2)).toFixed(2);
                    } else if (indexof == 1) {
                      let weight =
                        item.EveListObj[0].unit === "kg"
                          ? Number(data)
                          : Number(data) * 0.001;
                      let height =
                        item.EveListObj[1].unit === "m"
                          ? Number(value)
                          : Number(value) * 0.01;
                      BMIVal = (weight / Math.pow(height, 2)).toFixed(2);
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
          for (let j in item.EveListInit) {
            let EveInitItem = item.EveListInit[j];
            for (let k in EveInitItem) {
              this.findCircle1(EveInitItem[k], findItem => {
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
          this.findCircle1(item.EveTarget, function(eveTargetItem) {
            eveTargetItem.eleValue = total;
          });
          this.findCircle(
            this.nursingTreeDataSave[0].eleList,
            item.EveTarget,
            function(eveTargetItem) {
              eveTargetItem.eleValue = total;
            }
          );
        } else if (item.EveCode == "CDEE_SetVal") {
          for (let j in item.EveList) {
            const _this = this;
            await this.findCircle1(item.EveList[j], res => {
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
                  await _this.findCircle1(item0.eleId, value => {
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
                  });
                });
              }
            });
          }
        } else if (item.EveCode == "CDEE_SetEna") {
          for (let j in item.EveList) {
            const _this = this;
            await this.findCircle1(
              // this.nursingTreeDataSave[0].eleList,
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
              }
            );
          }
        } else if (item.EveCode == "CDEE_SetVis") {
          for (let j in item.EveList) {
            const _this = this;
            await this.findCircle1(
              // this.nursingTreeDataSave[0].eleList,
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
              }
            );
          }
        }
      }
    },
    //寻找要计算的元素的值
    findCircle(eleList, eleId, fn) {
      for (let i in eleList) {
        if (eleList[i].eleId == eleId) {
          fn(eleList[i], i);
        } else if (eleList[i].eleList && eleList[i].eleList.length) {
          this.findCircle(eleList[i].eleList, eleId, fn);
        }
      }
    },
    inputFocus(value, e) {},
    //表格类型交互
    /* async inputChange1(value, e) {
      this.$forceUpdate();
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
                await this.findCircle1(item.EveList[j], function(item) {
                  let data = item.eleValue;
                  if (data) {
                    if (indexof == 0) {
                      BMIVal = (
                        Number(value) / Math.pow(Number(data), 2)
                      ).toFixed(2);
                    } else if (indexof == 1) {
                      BMIVal = (
                        Number(data) / Math.pow(Number(value), 2)
                      ).toFixed(2);
                    }
                  }
                });
                await this.findCircle1(item.EveTarget, function(item) {
                  item.eleValue = BMIVal;
                });
              }
            }
          } else if (item.EveCode == "CDEE_SCORE") {
            if (!item.EveMulti) {
              let totalVal = 0;
              for (let j in item.EveList) {
                await this.findCircle(item.EveList[j], function(item) {
                  let data = item.eleValue;
                  if (!isNaN(data)) {
                    totalVal += Number(data);
                  }
                });
                await this.findCircle(item.EveTarget, function(item) {
                  item.eleValue = totalVal;
                });
              }
            } else {
              let totalVal = 0;
              for (let j in item.EveListInit) {
                for (let k in item.EveListInit[j]) {
                  let number = 0;
                  await this.findCircle(item.EveListInit[j][k], function(item) {
                    let data = item.eleValue;
                    if (!isNaN(data)) {
                      number = Number(data);
                    }
                  });
                  if (number > 0) {
                    totalVal += number;
                    break;
                  }
                }
              }
              await this.findCircle(item.EveTarget, function(item) {
                item.eleValue = totalVal;
              });
            }
          } else if (item.EveCode == "CDEE_SetVal") {
            for (let j in item.EveList) {
              const _this = this;
              await this.findCircle1(item.EveList[j], function(res) {
                let data = res.eleValue;
                for (let k in item.EveContions) {
                  let contionItem = item.EveContions[k];
                  if (data > Number(contionItem.judgeValue)) {
                    if (contionItem.judgeCondition == ">") {
                      contionItem.EveTarget.forEach(async (item0, index) => {
                        await _this.findCircle1(item0.eleId, function(value) {
                          value.eleValue = item0.eleValue;
                        });
                      });
                    }
                  } else if (data < Number(contionItem.judgeValue)) {
                    if (contionItem.judgeCondition == "<") {
                      contionItem.EveTarget.forEach(async (item0, index) => {
                        await _this.findCircle1(item0.eleId, function(value) {
                          value.eleValue = item0.eleValue;
                        });
                      });
                    }
                  } else if (data == Number(contionItem.judgeValue)) {
                    if (contionItem.judgeCondition == "=") {
                      contionItem.EveTarget.forEach(async (item0, index) => {
                        await _this.findCircle1(item0.eleId, function(value) {
                          value.eleValue = item0.eleValue;
                        });
                      });
                    }
                  }
                }
              });
            }
          } else if (item.EveCode == "CDEE_SetEna") {
            for (let j in item.EveList) {
              const _this = this;
              await this.findCircle1(item.EveList[j], function(res) {
                let data = res.eleValue;
                for (let k in item.EveContions) {
                  let contionItem = item.EveContions[k];
                  if (data > Number(contionItem.judgeValue)) {
                    if (contionItem.judgeCondition == ">") {
                      contionItem.EveTarget.forEach(async (item0, index) => {
                        await _this.findCircle(
                          _this.nursingTreeDataSave[0].eleList,
                          item0.eleId,
                          function(value) {
                            value.enable = item0.enable;
                          }
                        );
                      });
                    } else {
                      contionItem.EveTarget.forEach(async (item0, index) => {
                        await _this.findCircle(
                          _this.nursingTreeDataSave[0].eleList,
                          item0.eleId,
                          function(value) {
                            value.enable = true;
                          }
                        );
                      });
                    }
                  } else if (data < Number(contionItem.judgeValue)) {
                    if (contionItem.judgeCondition == "<") {
                      contionItem.EveTarget.forEach(async (item0, index) => {
                        await _this.findCircle(
                          _this.nursingTreeDataSave[0].eleList,
                          item0.eleId,
                          function(value) {
                            value.enable = item0.enable;
                          }
                        );
                      });
                    } else {
                      contionItem.EveTarget.forEach(async (item0, index) => {
                        await _this.findCircle(
                          _this.nursingTreeDataSave[0].eleList,
                          item0.eleId,
                          function(value) {
                            value.enable = true;
                          }
                        );
                      });
                    }
                  } else if (data == contionItem.judgeValue) {
                    if (contionItem.judgeCondition == "=") {
                      contionItem.EveTarget.forEach(async (item0, index) => {
                        await _this.findCircle(
                          _this.nursingTreeDataSave[0].eleList,
                          item0.eleId,
                          function(value) {
                            value.enable = item0.enable;
                          }
                        );
                      });
                    } else {
                      contionItem.EveTarget.forEach(async (item0, index) => {
                        await _this.findCircle(
                          _this.nursingTreeDataSave[0].eleList,
                          item0.eleId,
                          function(value) {
                            value.enable = true;
                          }
                        );
                      });
                    }
                  }
                }
              });
            }
          } else if (item.EveCode == "CDEE_SetVis") {
            for (let j in item.EveList) {
              const _this = this;
              await this.findCircle1(item.EveList[j], function(res) {
                let data = res.eleValue;
                for (let k in item.EveContions) {
                  let contionItem = item.EveContions[k];
                  if (data > Number(contionItem.judgeValue)) {
                    if (contionItem.judgeCondition == ">") {
                      contionItem.EveTarget.forEach(async (item0, index) => {
                        await _this.findCircle(
                          _this.nursingTreeDataSave[0].eleList,
                          item0.eleId,
                          function(value) {
                            value.visible = item0.visible;
                          }
                        );
                      });
                    } else {
                      contionItem.EveTarget.forEach(async (item0, index) => {
                        await _this.findCircle(
                          _this.nursingTreeDataSave[0].eleList,
                          item0.eleId,
                          function(value) {
                            value.visible = true;
                          }
                        );
                      });
                    }
                  } else if (data < Number(contionItem.judgeValue)) {
                    if (contionItem.judgeCondition == "<") {
                      contionItem.EveTarget.forEach(async (item0, index) => {
                        await _this.findCircle(
                          _this.nursingTreeDataSave[0].eleList,
                          item0.eleId,
                          function(value) {
                            value.visible = item0.visible;
                          }
                        );
                      });
                    } else {
                      contionItem.EveTarget.forEach(async (item0, index) => {
                        await _this.findCircle(
                          _this.nursingTreeDataSave[0].eleList,
                          item0.eleId,
                          function(value) {
                            value.visible = true;
                          }
                        );
                      });
                    }
                  } else if (data == contionItem.judgeValue) {
                    if (contionItem.judgeCondition == "=") {
                      contionItem.EveTarget.forEach(async (item0, index) => {
                        await _this.findCircle(
                          _this.nursingTreeDataSave[0].eleList,
                          item0.eleId,
                          function(value) {
                            value.visible = item0.visible;
                          }
                        );
                      });
                    } else {
                      contionItem.EveTarget.forEach(async (item0, index) => {
                        await _this.findCircle(
                          _this.nursingTreeDataSave[0].eleList,
                          item0.eleId,
                          function(value) {
                            value.visible = true;
                          }
                        );
                      });
                    }
                  }
                }
              });
            }
          }
        }
      }
    }, */
    //寻找要计算的元素的值
    findCircle1(value, fn) {
      let data = this.tableDataInit;
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
    //删除
    delTableItem(row, index, item) {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        if (item.eleValue.length > 1) {
          this.$delete(item.eleValue, index);
        } else if (item.eleValue.length == 1) {
          for (let i in item.eleValue[0]) {
            this.$set(item.eleValue[0][i], "eleValue", "");
          }
        }
      });
    },
    //清空
    resTableItem(row, index, item) {
      this.$confirm("是否清空?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        for (let i in item.eleValue[index]) {
          if(item.eleValue[index][i].hasOwnProperty("eleId")) {
            if(item.eleValue[index][i].elementBaseName === "数字元素") {
              this.$set(item.eleValue[index][i], "eleValue", undefined);
            } else {
              this.$set(item.eleValue[index][i], "eleValue", "");
            }
            //强制刷新签名元素
            this.forceUpdateData = Math.random() * 1000000000;;
          }
        }
      });
    },
    //新增数据
    addTableItem(row, index, item) {
      //新增数据如果为日期控件且刷入当前时间，则需要做当前时间处理
      let data = deepClone(item.tableDataItem);
      for (let i in data) {
        if (data[i].elementBaseName === "日期元素") {
          let attr = data[i].proprietaryAttributeVoLst;
          let flag = 0;
          for (let j in attr) {
            if (attr[j].proprietaryCode == "0700") {
              if (attr[j].proprietaryContent === "1") {
                flag = 1;
              }
            } else if (attr[j].proprietaryCode == "0701") {
              data[i].dateFormat = attr[j].proprietaryContent;
            }
          }
          if (flag === 1) {
            data[i].eleValue = new Date().format(data[i].dateFormat);
          }
        }
      }
      this.$set(item.eleValue, Number(index) + 1, deepClone(data));
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
    }
  }
};
</script>

<style lang="scss" scoped>
.doc-cont {
  overflow: auto;
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
  .row-item {
    display: flex;
    align-items: center;
  }
  .label {
    padding: 5px;
    /* -webkit-writing-mode: tb-rl;
       -ms-writing-mode: tb-rl;
       writing-mode: tb-rl;*/
    // text-align: center;
    font-size: 14px;
    font-family: $l-font-familySC-regular;
    font-weight: 400;
    color: $l-color-fontcolor-4;
  }

  .label-cont {
    /*text-overflow: ellipsis;*/
    overflow: hidden;
    /*white-space: nowrap;*/
    word-wrap: break-word;
    font-size: 14px;
  }

  .value {
    /*width: 80%;*/
  }

  .border {
    border: 1px solid $l-color-bgcolor-11;
  }

  .isBackGround {
    background-color: $l-color-bgcolor-18;
  }

  .width20 {
    width: 20%;
  }

  /deep/ .el-tooltip {
    width: 100%;
  }

  /deep/ .el-table th > .cell,
  /deep/ .el-table td > .cell {
    width: auto;
    padding-left: 2px;
    padding-right: 2px;
  }
  /deep/ .l-input-wrap .l-input-body .l-input-body-main {
    line-height: 32px;
  }
  /deep/ div::-webkit-scrollbar {
    height: 5px;
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

  .table-content {
    /deep/ .el-radio__label {
      display: none;
    }
    /deep/ .el-checkbox__label {
      display: none;
    }
  }
}
</style>
