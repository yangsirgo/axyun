<template>
  <div class="allocatStyle height100">
    <el-card class="left-cont float-left height100">
      <div class="left-cont-top">
        <l-card-title>
          <template #left>体温单类型</template>
        </l-card-title>
        <LFormtTitle label="类型">
          <l-value-domain
            clearable
            :remoteUrl="'/vitalStyle/getVitalStyleList'"
            :remoteParams="vitalStyleParams"
            type="select"
            :value.sync="tempStyle"
            remoteShowKey="styleName"
            remoteValueKey="styleCode"
            placeholder
            class="width100"
            @change="tempStyleChange"
          ></l-value-domain>
        </LFormtTitle>
        <el-input v-model="searchValue" class="width100"
                  style="margin-top: 10px"
                  placeholder="输入关键字搜索"
        ></el-input>
        <div class="left-cont-title">配置说明</div>
        <div class="left-cont-content">
          <div class="item-cont clearfix">
            <div class="float-left left-arrow" @click="arrowClick(1)">
              <i class="el-icon-arrow-right" :class="{'is-active':isActive1}"></i>
            </div>
            <div class="float-left right-arrow">
              <el-tabs v-model="activeName1" @tab-click="tabClick(1)">
                <el-tab-pane name="header" label="表头">
                  <LFormtTitle label="医院名称">
                    <el-input v-model="form.Title0001.configurationValue" class="width100" placeholder="请输入"></el-input>
                  </LFormtTitle>
                  <LFormtTitle style="margin-bottom: 10px" label="字体配置">
                    <l-value-domain
                      clearable
                      remoteUrl="/vitalConfigurationOption/params"
                      :remoteParams="{configurationCode: 'Title0002'}"
                      type="select"
                      :value.sync="form.Title0002.configurationValue"
                      remoteShowKey="optionName"
                      remoteValueKey="optionValue"
                      placeholder="请选择"
                      style="width:50%"
                    ></l-value-domain>
                    <l-value-domain
                      clearable
                      remoteUrl="/vitalConfigurationOption/params"
                      :remoteParams="{configurationCode: 'Title0003'}"
                      type="select"
                      :value.sync="form.Title0003.configurationValue"
                      remoteShowKey="optionName"
                      remoteValueKey="optionValue"
                      placeholder="请选择"
                      style="width:50%"
                    ></l-value-domain>
                  </LFormtTitle>
                  <LFormtTitle label="体温表名称">
                    <el-input v-model="form.Title0004.configurationValue" class="width100" placeholder="请输入"></el-input>
                  </LFormtTitle>
                  <LFormtTitle style="margin-bottom: 10px" label="字体配置">
                    <l-value-domain
                      clearable
                      remoteUrl="/vitalConfigurationOption/params"
                      :remoteParams="{configurationCode: 'Title0005'}"
                      type="select"
                      :value.sync="form.Title0005.configurationValue"
                      remoteShowKey="optionName"
                      remoteValueKey="optionValue"
                      placeholder="请选择"
                      style="width:50%"
                    ></l-value-domain>
                    <l-value-domain
                      clearable
                      remoteUrl="/vitalConfigurationOption/params"
                      :remoteParams="{configurationCode: 'Title0006'}"
                      type="select"
                      :value.sync="form.Title0006.configurationValue"
                      remoteShowKey="optionName"
                      remoteValueKey="optionValue"
                      placeholder="请选择"
                      style="width:50%"
                    ></l-value-domain>
                  </LFormtTitle>
                  <LFormtTitle style="margin-bottom: 10px" label="全局文字">
                    <l-value-domain
                      clearable
                      remoteUrl="/vitalConfigurationOption/params"
                      :remoteParams="{configurationCode: 'Title0007'}"
                      type="select"
                      :value.sync="form.Title0007.configurationValue"
                      remoteShowKey="optionName"
                      remoteValueKey="optionValue"
                      placeholder="请选择"
                      style="width:50%"
                    ></l-value-domain>
                    <l-value-domain
                      clearable
                      remoteUrl="/vitalConfigurationOption/params"
                      :remoteParams="{configurationCode: 'Title0008'}"
                      type="select"
                      :value.sync="form.Title0008.configurationValue"
                      remoteShowKey="optionName"
                      remoteValueKey="optionValue"
                      placeholder="请选择"
                      style="width:50%"
                    ></l-value-domain>
                  </LFormtTitle>
                  <LFormtTitle style="margin-bottom: 10px" label="全局数字">
                    <l-value-domain
                      clearable
                      remoteUrl="/vitalConfigurationOption/params"
                      :remoteParams="{configurationCode: 'Title0009'}"
                      type="select"
                      :value.sync="form.Title0009.configurationValue"
                      remoteShowKey="optionName"
                      remoteValueKey="optionValue"
                      placeholder="请选择"
                      style="width:50%"
                    ></l-value-domain>
                    <l-value-domain
                      clearable
                      remoteUrl="/vitalConfigurationOption/params"
                      :remoteParams="{configurationCode: 'Title0010'}"
                      type="select"
                      :value.sync="form.Title0010.configurationValue"
                      remoteShowKey="optionName"
                      remoteValueKey="optionValue"
                      placeholder="请选择"
                      style="width:50%"
                    ></l-value-domain>
                  </LFormtTitle>
                  <LFormtTitle style="margin-bottom: 10px" label="全局连线粗细">
                    <el-input v-model="form.Line0001.configurationValue" class="width100"
                              placeholder="请输入"
                    ></el-input>
                  </LFormtTitle>
                  <LFormtTitle label="全局文字颜色">
                    <l-value-domain
                      clearable
                      remoteUrl="/vitalConfigurationOption/params"
                      :remoteParams="{configurationCode: 'Color0001'}"
                      type="select"
                      :value.sync="form.Color0001.configurationValue"
                      remoteShowKey="optionName"
                      remoteValueKey="optionValue"
                      placeholder="请选择"
                      style="width:100%"
                    ></l-value-domain>
                  </LFormtTitle>
                </el-tab-pane>
                <el-tab-pane name="layout" label="布局">
                  <el-table
                    :data="tableData12"
                    width="100%"
                    stripe
                    border
                  >
                    <el-table-column
                      v-for="(item, index) in tableParams"
                      :key="index"
                      :prop="item.prop"
                      :label="item.label"
                      :min-width="item.width"
                      :align="item.align || 'left'"
                      :header-align="item.headerAlign || 'left'"
                      :fixed="item.fixed"
                    >
                      <template slot-scope="scope">
                        <template v-if="item.prop=='configurationValue'">
                          <el-input v-model="scope.row['configurationValue']" class="width100"></el-input>
                        </template>
                        <template v-else>{{scope.row[item.prop]}}</template>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
                <el-tab-pane name="exhibitPro" label="展示项">
                  <el-table
                    :data="tableData13"
                    width="100%"
                    stripe
                    border
                  >
                    <el-table-column
                      v-for="(item, index) in tableParams"
                      :key="index"
                      :prop="item.prop"
                      :label="item.label"
                      :min-width="item.width"
                      :align="item.align || 'left'"
                      :header-align="item.headerAlign || 'left'"
                      :fixed="item.fixed"
                    >
                      <template slot-scope="scope">
                        <template v-if="item.prop=='configurationValue'">
                          <template v-if="scope.row['configurationCode'] == 'ShowItem0003'">
                            <el-input v-model="scope.row['configurationValue'].optionNames" class="width100"
                                      @focus="inputFocus(scope.row,scope.$index,'13')"
                            ></el-input>
                          </template>
                          <template v-else>
                            <el-input v-model="scope.row['configurationValue'].showNames" class="width100"
                                      @focus="inputFocus(scope.row,scope.$index,'13')"
                            ></el-input>
                          </template>
                        </template>
                        <template v-else>{{scope.row[item.prop]}}</template>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
          <div class="item-cont clearfix">
            <div class="float-left left-arrow" @click="arrowClick(2)">
              <i class="el-icon-arrow-right" :class="{'is-active':isActive2}"></i>
            </div>
            <div class="float-left right-arrow">
              <el-tabs v-model="activeName2" @tab-click="tabClick(2)">
                <el-tab-pane name="header" label="温度">
                  <el-table
                    :data="tableData21"
                    width="100%"
                    stripe
                    border
                  >
                    <el-table-column
                      v-for="(item, index) in tableParams"
                      :key="index"
                      :prop="item.prop"
                      :label="item.label"
                      :min-width="item.width"
                      :align="item.align || 'left'"
                      :header-align="item.headerAlign || 'left'"
                      :fixed="item.fixed"
                    >
                      <template slot-scope="scope">
                        <template v-if="item.prop=='configurationValue'">
                          <el-input v-model="scope.row['configurationValue']" class="width100"></el-input>
                        </template>
                        <template v-else>{{scope.row[item.prop]}}</template>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
                <el-tab-pane name="layout" label="脉搏">
                  <el-table
                    :data="tableData22"
                    width="100%"
                    stripe
                    border
                  >
                    <el-table-column
                      v-for="(item, index) in tableParams"
                      :key="index"
                      :prop="item.prop"
                      :label="item.label"
                      :min-width="item.width"
                      :align="item.align || 'left'"
                      :header-align="item.headerAlign || 'left'"
                      :fixed="item.fixed"
                    >
                      <template slot-scope="scope">
                        <template v-if="item.prop=='configurationValue'">
                          <el-input v-model="scope.row['configurationValue']" class="width100"></el-input>
                        </template>
                        <template v-else>{{scope.row[item.prop]}}</template>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
                <el-tab-pane name="breath" label="呼吸">
                  <el-table
                    :data="tableData23"
                    width="100%"
                    stripe
                    border
                  >
                    <el-table-column
                      v-for="(item, index) in tableParams"
                      :key="index"
                      :prop="item.prop"
                      :label="item.label"
                      :min-width="item.width"
                      :align="item.align || 'left'"
                      :header-align="item.headerAlign || 'left'"
                      :fixed="item.fixed"
                    >
                      <template slot-scope="scope">
                        <template v-if="item.prop=='configurationValue'">
                          <el-input v-model="scope.row['configurationValue']" class="width100"></el-input>
                        </template>
                        <template v-else>{{scope.row[item.prop]}}</template>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
                <el-tab-pane name="exhibitPro" label="疼痛">
                  <el-table
                    :data="tableData24"
                    width="100%"
                    stripe
                    border
                  >
                    <el-table-column
                      v-for="(item, index) in tableParams"
                      :key="index"
                      :prop="item.prop"
                      :label="item.label"
                      :min-width="item.width"
                      :align="item.align || 'left'"
                      :header-align="item.headerAlign || 'left'"
                      :fixed="item.fixed"
                    >
                      <template slot-scope="scope">
                        <template v-if="item.prop=='configurationValue'">
                          <el-input v-model="scope.row['configurationValue']" class="width100"></el-input>
                        </template>
                        <template v-else>{{scope.row[item.prop]}}</template>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
          <div class="item-cont clearfix">
            <div class="float-left left-arrow" @click="arrowClick(3)">
              <i class="el-icon-arrow-right" :class="{'is-active':isActive3}"></i>
            </div>
            <div class="float-left right-arrow">
              <el-tabs v-model="activeName3" @tab-click="tabClick(3)">
                <el-tab-pane name="header" label="图标">
                  <el-table
                    :data="tableData31"
                    width="100%"
                    stripe
                    border
                  >
                    <el-table-column
                      v-for="(item, index) in tableParams"
                      :key="index"
                      :prop="item.prop"
                      :label="item.label"
                      :min-width="item.width"
                      :align="item.align || 'left'"
                      :header-align="item.headerAlign || 'left'"
                      :fixed="item.fixed"
                    >
                      <template slot-scope="scope">
                        <template v-if="item.prop=='configurationValue'">
                          <l-value-domain
                            clearable
                            remoteUrl="/vitalConfigurationOption/params"
                            :remoteParams="{configurationCode: scope.row['configurationCode']}"
                            type="select"
                            :value.sync="scope.row['configurationValue']"
                            remoteShowKey="optionValue"
                            remoteValueKey="optionValue"
                            placeholder="请选择"
                            style="width:100%"
                          ></l-value-domain>
                        </template>
                        <template v-else>{{scope.row[item.prop]}}</template>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
                <el-tab-pane name="layout" label="图章">
                  <el-table
                    :data="tableData32"
                    width="100%"
                    stripe
                    border
                  >
                    <el-table-column
                      v-for="(item, index) in tableParams"
                      :key="index"
                      :prop="item.prop"
                      :label="item.label"
                      :min-width="item.width"
                      :align="item.align || 'left'"
                      :header-align="item.headerAlign || 'left'"
                      :fixed="item.fixed"
                    >
                      <template slot-scope="scope">
                        <template v-if="item.prop=='configurationValue'">
                          <!--<el-select v-model="scope.row['configurationValue']" placeholder="请选择" style="width:100%">
                            <el-option
                              v-for="item in stampOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>-->
                          <l-value-domain
                            clearable
                            remoteUrl="/vitalConfigurationOption/params"
                            :remoteParams="{configurationCode: scope.row['configurationCode']}"
                            type="select"
                            :value.sync="scope.row['configurationValue']"
                            remoteShowKey="optionName"
                            remoteValueKey="optionValue"
                            placeholder="请选择"
                            style="width:100%"
                          ></l-value-domain>
                        </template>
                        <template v-else>{{scope.row[item.prop]}}</template>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
          <div class="item-cont clearfix">
            <div class="float-left left-arrow" @click="arrowClick(4)">
              <i class="el-icon-arrow-right" :class="{'is-active':isActive4}"></i>
            </div>
            <div class="float-left right-arrow">
              <el-tabs v-model="activeName4" @tab-click="tabClick(4)">
                <el-tab-pane name="header" label="底部项目">
                  <el-table
                    :data="tableData4"
                    width="100%"
                    stripe
                    border
                  >
                    <el-table-column
                      v-for="(item, index) in tableParams"
                      :key="index"
                      :prop="item.prop"
                      :label="item.label"
                      :min-width="item.width"
                      :align="item.align || 'left'"
                      :header-align="item.headerAlign || 'left'"
                      :fixed="item.fixed"
                    >
                      <template slot-scope="scope">
                        <template v-if="item.prop=='configurationValue'">
                          <el-input v-model="scope.row['configurationValue']" class="width100"></el-input>
                        </template>
                        <template v-else>{{scope.row[item.prop]}}</template>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
      </div>
      <div class="left-cont-button clearfix">
        <el-button class="button-save float-right" type="primary" @click="saveStyle">保存</el-button>
        <el-button class="button-save float-right" type="primary" plain style="margin-right: 10px">预览</el-button>
      </div>
    </el-card>
    <el-card class="right-cont float-right height100"></el-card>
    <el-dialog
      :title="tableData13[currentIndex].configurationName"
      :visible.sync="dialogVisible"
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div style="padding:20px">
        <el-table
          ref="dialogTable1"
          v-if="this.currentIndex == 0"
          :data="dialogData1"
          width="100%"
          stripe
          border
          @selection-change="selectChange"
        >
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            v-for="(item, index) in tableParams1"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            :align="item.align || 'left'"
            :header-align="item.headerAlign || 'left'"
            :fixed="item.fixed"
          >
            <template slot-scope="scope">
              <template v-if="item.prop=='showName'">
                <el-input v-model="scope.row['showName']" class="width100"></el-input>
              </template>
              <template v-else-if="item.prop=='optionSort'">
                <el-input-number v-model="scope.row['optionSort']" controls-position="right" :min="1"
                                 class="width100"></el-input-number>
              </template>
              <template v-else>{{scope.row[item.prop]}}</template>
            </template>
          </el-table-column>
        </el-table>
        <el-table
          ref="dialogTable2"
          v-else-if="this.currentIndex == 1"
          :data="dialogData2"
          width="100%"
          stripe
          border
          @selection-change="selectChange"
        >
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            v-for="(item, index) in tableParams1"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            :align="item.align || 'left'"
            :header-align="item.headerAlign || 'left'"
            :fixed="item.fixed"
          >
            <template slot-scope="scope">
              <template v-if="item.prop=='showName'">
                <el-input v-model="scope.row['showName']" class="width100"></el-input>
              </template>
              <template v-else-if="item.prop=='optionSort'">
                <el-input-number v-model="scope.row['optionSort']" controls-position="right" :min="1"
                                 class="width100"></el-input-number>
              </template>
              <template v-else>{{scope.row[item.prop]}}</template>
            </template>
          </el-table-column>
        </el-table>
        <el-table
          ref="dialogTable3"
          v-else-if="this.currentIndex == 2"
          :data="dialogData3"
          width="100%"
          stripe
          border
          @selection-change="selectChange"
        >
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            v-for="(item, index) in tableParams3"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            :align="item.align || 'left'"
            :header-align="item.headerAlign || 'left'"
            :fixed="item.fixed"
          >
            <template slot-scope="scope">
              <template v-if="item.prop=='showColor'">
                <el-color-picker v-model="scope.row['showColor']" size="mini"></el-color-picker>
              </template>
              <template v-else>{{scope.row[item.prop]}}</template>
            </template>
          </el-table-column>
        </el-table>
        <el-table
          ref="dialogTable4"
          v-if="this.currentIndex == 3"
          :data="dialogData4"
          width="100%"
          stripe
          border
          @selection-change="selectChange"
        >
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            v-for="(item, index) in tableParams4"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            :align="item.align || 'left'"
            :header-align="item.headerAlign || 'left'"
            :fixed="item.fixed"
          >
            <template slot-scope="scope">
              <template v-if="item.prop=='showName'">
                <el-input v-model="scope.row['showName']" class="width100"></el-input>
              </template>
              <template v-else-if="item.prop=='optionPosition'">
                <el-select v-model="scope.row['optionPosition']" placeholder="请选择" class="width100">
                  <el-option v-for="(item,index) in positionOptions"
                             :key="index"
                             :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </template>
              <template v-else-if="item.prop=='optionSort'">
                <el-input-number v-model="scope.row['optionSort']" class="width100"
                                 controls-position="right" :min="1"></el-input-number>
              </template>
              <template v-else>{{scope.row[item.prop]}}</template>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getConfiguration,
    getConfigOptiontion,
    getVitalStyleConfig,
    saveVitalStyleConfig
  } from "@/api/public/temperature";

  const corresData = {
    '布局': 'tableData12',
    '展示项': 'tableData13',
    '温度': 'tableData21',
    '脉搏': 'tableData22',
    '呼吸': 'tableData23',
    '疼痛': 'tableData24',
    '图标': 'tableData31',
    '图章': 'tableData32',
    '底部项目': 'tableData4',
  };
  let tableList = ['tableData12', 'tableData13', 'tableData21', 'tableData22', 'tableData23', 'tableData24', 'tableData31', 'tableData32']

  export default {
    name: "allocatStyle",
    data() {
      return {
        tempStyle: '',
        vitalStyleParams: {
          pageNo: 1,
          pageSize: 1000000
        },
        searchValue: '',
        activeName1: '',
        isActive1: false,
        activeName2: '',
        isActive2: false,
        activeName3: '',
        isActive3: false,
        activeName4: '',
        isActive4: false,
        positionOptions: [
          {
            label: '左侧',
            value: '1'
          }, {
            label: '右侧',
            value: '2'
          }
        ],
        tableParams: [
          {
            prop: "configurationName",
            label: "配置名称",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "70"
          }, {
            prop: "configurationValue",
            label: "配置值",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "70"
          }, {
            prop: "configurationDefault",
            label: "默认值",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "70"
          }
        ],
        form: {},//表头
        tableData12: [], //布局
        tableData13: [], //展示项
        tableData21: [],//温度
        tableData22: [],//脉搏
        tableData23: [], //呼吸
        tableData24: [],//疼痛
        tableData31: [], //图标
        tableData32: [], //图章
        tableData4: [],//底部项目
        dialogVisible: false,
        tableParams1: [
          {
            prop: "optionName",
            label: "选项名称",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "70"
          }, {
            prop: "showName",
            label: "显示名称",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "70"
          }, {
            prop: "optionSort",
            label: "排序",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "70"
          }
        ],
        tableParams2: [],
        tableParams3: [
          {
            prop: "optionValue",
            label: "选项名称",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "70"
          }, {
            prop: "showColor",
            label: "颜色",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "70"
          }
        ],
        tableParams4: [
          {
            prop: "optionName",
            label: "选项名称",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "70"
          }, {
            prop: "showName",
            label: "显示名称",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "70"
          }, {
            prop: "optionUnit",
            label: "单位",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "60"
          }, {
            prop: "optionPosition",
            label: "显示位置",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "70"
          }, {
            prop: "optionSort",
            label: "排序",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "90"
          }
        ],
        dialogData1: [],
        dialogData2: [],
        dialogData3: [],
        dialogData4: [],
        //展示项当前index
        currentIndex: 0,
        selections1: [],
        selections2: [],
        selections3: [],
        selections4: [],
      }
    },
    created() {
      this.reset();
      this.getDialogTable(1, 'ShowItem0001');
      this.getDialogTable(2, 'ShowItem0002');
      this.getDialogTable(3, 'ShowItem0003');
      this.getDialogTable(4, 'ShowItem0005');
    },
    methods: {
      //获取展示项选项列表
      async getDialogTable(num, configurationCode) {
        let params = {
          configurationCode: configurationCode
        };
        let res = await getConfigOptiontion(params);
        if (res.code == 1) {
          await this.handleDialogData(num, res.data);
        }
      },
      handleDialogData(num, data) {
        let arr = [];
        for (let i in data) {
          arr.push({
            optionCode: data[i].optionCode,
            optionName: data[i].optionName,
            optionValue: data[i].optionValue,
            showName: '',
            optionSort: 1,
            optionUnit: data[i].optionUnit || '',
            optionPosition: '1',
            showColor: num == 3 ? '#000' : ''
          });
        }
        this['dialogData' + num] = arr;
        // console.log(dialogTable);
      },
      arrowClick(num) {
        let isActive = 'isActive' + num;
        let activeName = 'activeName' + num;
        this[isActive] = this[isActive] ? false : true;
        this[activeName] = this[isActive] ? 'header' : '';
      },
      tabClick(num) {
        let isActive = 'isActive' + num;
        if (this[isActive] === false) {
          this[isActive] = true;
        }
      },
      tempStyleChange() {
        this.getStyle();
      },
      reset() {
        //表头
        this.form = {
          Title0001: {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '医院名称',
            configurationValue: '空港医院',
            configurationDefault: '空港医院',
            configurationCode: 'Title0001'
          },
          Title0002: {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '医院名称字体',
            configurationValue: '1',
            configurationDefault: '1',
            configurationCode: 'Title0002'
          },
          Title0003: {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '医院名称字号',
            configurationValue: '9',
            configurationDefault: '9',
            configurationCode: 'Title0003'
          },
          Title0004: {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '体温表名称',
            configurationValue: '体温单',
            configurationDefault: '体温单',
            configurationCode: 'Title0004'
          },
          Title0005: {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '体温表名称字体',
            configurationValue: '1',
            configurationDefault: '1',
            configurationCode: 'Title0005'
          },
          Title0006: {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '体温表名称字号字号',
            configurationValue: '9',
            configurationDefault: '9',
            configurationCode: 'Title0006'
          },
          Title0007: {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '全局文字字体',
            configurationValue: '1',
            configurationDefault: '1',
            configurationCode: 'Title0007'
          },
          Title0008: {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '全局文字字号',
            configurationValue: '9',
            configurationDefault: '9',
            configurationCode: 'Title0008'
          },
          Title0009: {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '全局数字字体',
            configurationValue: '1',
            configurationDefault: '1',
            configurationCode: 'Title0009'
          },
          Title0010: {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '全局数字字号',
            configurationValue: '9',
            configurationDefault: '9',
            configurationCode: 'Title0010'
          },
          Line0001: {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '全局连线粗细',
            configurationValue: '1',
            configurationDefault: '1',
            configurationCode: 'Line0001'
          },
          Color0001: {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '全局文字颜色',
            configurationValue: '1',
            configurationDefault: '1',
            configurationCode: 'Color0001'
          },
        };
        //布局
        this.tableData12 = [
          {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '总宽度',
            configurationValue: '700',
            configurationDefault: '700',
            configurationCode: 'Layout0001'
          }, {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '总高度',
            configurationValue: '1000',
            configurationDefault: '1000',
            configurationCode: 'Layout0002'
          }, {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '上部标题行高',
            configurationValue: '20',
            configurationDefault: '20',
            configurationCode: 'Layout0003'
          }, {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '标题列宽',
            configurationValue: '120',
            configurationDefault: '120',
            configurationCode: 'Layout0004'
          }, {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '显示天数',
            configurationValue: '7',
            configurationDefault: '7',
            configurationCode: 'Layout0005'
          },/*, {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '单元格宽度',
            configurationValue: '',
            configurationDefault: '10',
            configurationCode: ''
          }*/ {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '刻度线数',
            configurationValue: '9',
            configurationDefault: '9',
            configurationCode: 'Layout0006'
          }, {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '单元格高度',
            configurationValue: '10',
            configurationDefault: '10',
            configurationCode: 'Layout0007'
          }, {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '特殊项目行高',
            configurationValue: '20',
            configurationDefault: '20',
            configurationCode: 'Layout0008'
          }
        ];
        //展示项？
        this.tableData13 = [
          {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '病人信息',
            configurationValue: {
              optionName: ['科室', '姓名', '住院号', '床位号', '入院日期'],
              optionNames: '科室/姓名/住院号/床位号/入院日期',
              optionValue: ['1', '2', '3', '4', '5'],
              showName: ['科室', '姓名', '住院号', '床位号', '入院日期'],
              showNames: '科室/姓名/住院号/床位号/入院日期'
            },
            configurationDefault: '科室/姓名/住院号/床位号/入院日期',
            configurationCode: 'ShowItem0001'
          }, {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '标题内容顺序',
            configurationValue: {
              optionName: ['日期', '住院天数', '术后天数', '产后天数', '时刻'],
              optionNames: '日期/住院天数/术后天数/产后天数/时刻',
              optionValue: ['1', '2', '3', '4', '5'],
              showName: ['日期', '住院天数', '术后天数', '产后天数', '时刻'],
              showNames: '日期/住院天数/术后天数/产后天数/时刻'
            },
            configurationDefault: '日期/住院天数/术后天数/产后天数/时刻',
            configurationCode: 'ShowItem0002'
          }, {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '显示时刻值',
            configurationValue: {
              optionName: ['2', '6', '10', '14', '18', '22'],
              optionNames: '2/6/10/14/18/22',
              optionValue: ['2', '6', '10', '14', '18', '22'],
              showColor: ['#000', '#000', '#000', '#000', '#000', '#000']
            },
            configurationDefault: '2/6/10/14/18/22',
            configurationCode: 'ShowItem0003'
          },
          {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '体征标题顺序',
            configurationValue: {
              optionName: ['呼吸', '脉搏', '体温', '疼痛'],
              optionNames: '呼吸/脉搏/体温/疼痛',
              optionValue: ['1', '2', '3', '4'],
              showName: ['呼吸', '脉搏', '体温', '疼痛'],
              showNames: '呼吸/脉搏/体温/疼痛',
              optionUnit: ['次/分', '次/分', '℃', ''],
              optionPosition: ['1', '1', '1', '1']
            },
            configurationDefault: '呼吸/脉搏/体温/疼痛',
            configurationCode: 'ShowItem0005'
          }
        ];
        //温度
        this.tableData21 = [
          {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '体温显示范围',
            configurationValue: '35-42',
            configurationDefault: '35-42',
            configurationCode: 'T0001'
          }, {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '整刻度线对应的体温范围',
            configurationValue: '1',
            configurationDefault: '1',
            configurationCode: 'T0003'
          }, {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '最高体温对应的整刻度线',
            configurationValue: '1',
            configurationDefault: '1',
            configurationCode: 'T0002'
          }, {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '体温刻度位置',
            configurationValue: '1',
            configurationDefault: '1',
            configurationCode: 'T0005'
          }, {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '体温刻度显示间隔',
            configurationValue: '1',
            configurationDefault: '1',
            configurationCode: 'T0004'
          }, {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '基准体温',
            configurationValue: '37',
            configurationDefault: '37',
            configurationCode: 'T0006'
          }, {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '温度不升显示模式',
            configurationValue: '1',
            configurationDefault: '1',
            configurationCode: 'T0007'
          }, {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '温度不升文字颜色',
            configurationValue: '1',
            configurationDefault: '1',
            configurationCode: 'T0008'
          }
        ];
        //脉搏
        this.tableData22 = [
          {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '脉搏次数显示范围',
            configurationValue: '60-200',
            configurationDefault: '60-200',
            configurationCode: 'P0001'
          }, {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '整刻度线对应的脉搏范围',
            configurationValue: '20',
            configurationDefault: '20',
            configurationCode: 'P0003'
          }, {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '最高脉搏次数对应的整刻度线',
            configurationValue: '1',
            configurationDefault: '1',
            configurationCode: 'P0002'
          }, {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '脉搏刻度位置',
            configurationValue: '1',
            configurationDefault: '1',
            configurationCode: 'P0005'
          }, {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '脉搏刻度显示间隔',
            configurationValue: '20',
            configurationDefault: '20',
            configurationCode: 'P0004'
          }, {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '基准脉搏',
            configurationValue: '80',
            configurationDefault: '80',
            configurationCode: 'P0006'
          }, {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '脉搏心率画线方式',
            configurationValue: '1',
            configurationDefault: '1',
            configurationCode: 'P0007'
          }/*, {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '单位刻度脉搏值',
            configurationValue: '20',
            configurationDefault: '20',
            configurationCode: 'P0003'
          }*/
        ];
        //呼吸
        this.tableData23 = [
          {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '呼吸次数显示范围',
            configurationValue: '10-40',
            configurationDefault: '10-40',
            configurationCode: 'R0001'
          }, {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '整刻度线对应的呼吸范围',
            configurationValue: '10',
            configurationDefault: '10',
            configurationCode: 'R0003'
          }, {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '最高呼吸次数对应的整刻度线',
            configurationValue: '6',
            configurationDefault: '6',
            configurationCode: 'R0002'
          }, {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '呼吸刻度位置',
            configurationValue: '1',
            configurationDefault: '1',
            configurationCode: 'R0005'
          }, {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '呼吸刻度显示间隔',
            configurationValue: '10',
            configurationDefault: '10',
            configurationCode: 'R0004'
          }
        ];
        //疼痛
        this.tableData24 = [
          {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '疼痛显示范围',
            configurationValue: '1-10',
            configurationDefault: '1-10',
            configurationCode: 'Pain0001'
          }, {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '整刻度线对应的疼痛范围',
            configurationValue: '5',
            configurationDefault: '5',
            configurationCode: 'Pain0003'
          }, {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '最高疼痛对应的整刻度线',
            configurationValue: '7',
            configurationDefault: '7',
            configurationCode: 'Pain0002'
          }, {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '疼痛刻度位置',
            configurationValue: '1',
            configurationDefault: '1',
            configurationCode: 'Pain0005'
          }, {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '疼痛刻度显示间隔',
            configurationValue: '2',
            configurationDefault: '2',
            configurationCode: 'Pain0004'
          }, {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '基准疼痛',
            configurationValue: '5',
            configurationDefault: '5',
            configurationCode: 'Pain0006'
          }
        ];
        //图标
        this.tableData31 = [
          {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '口表图标',
            configurationValue: '1',
            configurationDefault: '1',
            configurationCode: 'Icon0001'
          }, {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '腋表图标',
            configurationValue: '1',
            configurationDefault: '1',
            configurationCode: 'Icon0002'
          }, {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '肛表图标',
            configurationValue: '1',
            configurationDefault: '1',
            configurationCode: 'Icon0003'
          }, {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '耳表图标',
            configurationValue: '1',
            configurationDefault: '1',
            configurationCode: 'Icon0004'
          }, {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '呼吸图标',
            configurationValue: '1',
            configurationDefault: '1',
            configurationCode: 'Icon0005'
          }, {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '呼吸机图标',
            configurationValue: '1',
            configurationDefault: '1',
            configurationCode: 'Icon0006'
          }, {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '脉搏图标',
            configurationValue: '1',
            configurationDefault: '1',
            configurationCode: 'Icon0007'
          }, {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '起搏器图标',
            configurationValue: '1',
            configurationDefault: '1',
            configurationCode: 'Icon0008'
          }, {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '心率图标',
            configurationValue: '1',
            configurationDefault: '1',
            configurationCode: 'Icon0009'
          }, {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '疼痛图标',
            configurationValue: '1',
            configurationDefault: '1',
            configurationCode: 'Icon0010'
          }, {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '升温图标',
            configurationValue: '1',
            configurationDefault: '1',
            configurationCode: 'Icon0011'
          }, {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '复测疼痛图标',
            configurationValue: '1',
            configurationDefault: '1',
            configurationCode: 'Icon0012'
          }, {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '体温脉搏重合图标',
            configurationValue: '1',
            configurationDefault: '1',
            configurationCode: 'Icon0013'
          }
        ];
        //图章
        this.tableData32 = [
          {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '图章显示模式',
            configurationValue: '1',
            configurationDefault: '显示边框',
            configurationCode: 'Stamp0001'
          }, {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '图章排列方式',
            configurationValue: '1',
            configurationDefault: '横向顺序展示',
            configurationCode: 'Stamp0002'
          }, /*{
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '上图章显示位置',
            configurationValue: '',
            configurationDefault: '1',
            configurationCode: 'Stamp000'
          }, */{
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '上图章大小',
            configurationValue: '1',
            configurationDefault: '一个大刻度高度',
            configurationCode: 'Stamp0003'
          }, /*{
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '下图章大小',
            configurationValue: '',
            configurationDefault: '1',
            configurationCode: 'Stamp0001'
          }, {
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '下图章显示方向',
            configurationValue: '',
            configurationDefault: '0',
            configurationCode: 'Stamp0001'
          }, */{
            id: '',
            dataVersion: '',
            deletedStatus: '',
            hosCode: '',
            hosId: '',
            orgCode: '',
            orgId: '',
            configurationName: '图章时间样式',
            configurationValue: '1',
            configurationDefault: '不显示',
            configurationCode: 'Stamp0007'
          }
        ];
        //底部项目
        this.tableData4 = [];
      },
      //获取体温单配置
      async getStyle() {
        if (!this.tempStyle) {
          return;
        }
        await this.reset();
        this.$showLoading();
        try {
          let params = {
            styleCode: this.tempStyle
          };
          let res = await getVitalStyleConfig(params);
          if (res.code == 1) {
            let resData = res.data;
            let obj = {};
            for (let i in resData) {
              obj[resData[i].configurationCode] = resData[i];
            }
            console.log('体温单配置', JSON.stringify(obj));
            await this.handleStyleConfigB(res.data);
          } else {
            this.$message.error(res.msg || "获取体温单配置失败");
          }
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "获取体温单配置失败");
        }
      },
      //获取体温单配置处理
      handleStyleConfigB(data) {
        for (let i in data) {
          if (data[i]['configurationCategory'] == '表头') {
            for (let j in this.form) {
              if (data[i]['configurationCode'] == j) {
                this.$set(this.form, j, {
                  ...this.form[j],
                  ...data[i]
                })
              }
            }
          } else {
            let name = corresData[data[i]['configurationCategory']];
            let tableData = this[name];
            for (let j in tableData) {
              if (data[i]['configurationCode'] == tableData[j]['configurationCode']) {
                let obj = {
                  ...tableData[j],
                  ...data[i]
                };
                if (data[i]['configurationCategory'] && data[i]['configurationCategory'] == "展示项") {
                  obj.configurationValue = JSON.parse(data[i].configurationValue);
                } else {
                  obj.configurationValue = data[i].configurationValue;
                }
                this.$set(tableData, j, obj);
              }
            }
          }
        }
      },
      //保存体温单配置数据处理
      handleStyleConfig() {
        let arr = [];
        //表头
        for (let i in this.form) {
          if (this.form[i].configurationValue) {
            arr.push({
              configurationCode: this.form[i]['configurationCode'],
              configurationName: this.form[i]['configurationName'],
              configurationValue: this.form[i]['configurationValue'],
              id: this.form[i]['id'],
              dataVersion: this.form[i]['dataVersion'],
              deletedStatus: this.form[i]['deletedStatus'],
              hosCode: this.form[i]['hosCode'],
              hosId: this.form[i]['hosId'],
              orgCode: this.form[i]['orgCode'],
              orgId: this.form[i]['orgId'],
              styleCode: this.tempStyle
            });
          }
        }
        //除了表头项
        for (let j in tableList) {
          let tableData = tableList[j];
          for (let i in this[tableData]) {
            if (this[tableData][i].configurationValue) {
              arr.push({
                configurationCode: this[tableData][i]['configurationCode'],
                configurationName: this[tableData][i]['configurationName'],
                configurationValue: this[tableData][i]['configurationValue'],
                id: this[tableData][i]['id'],
                dataVersion: this[tableData][i]['dataVersion'],
                deletedStatus: this[tableData][i]['deletedStatus'],
                hosCode: this[tableData][i]['hosCode'],
                hosId: this[tableData][i]['hosId'],
                orgCode: this[tableData][i]['orgCode'],
                orgId: this[tableData][i]['orgId'],
                styleCode: this.tempStyle
              });
            }
          }
        }
        // console.log(arr);
        return arr;
      },
      //保存体温单配置
      async saveStyle() {
        // this.handleStyleConfig();
        this.$showLoading();
        try {
          let params = await this.handleStyleConfig();
          let res = await saveVitalStyleConfig(params);
          if (res.code == 1) {
            this.$message.info("体温单配置保存成功");
          } else {
            this.getStyle();
            this.$message.error(res.msg || "体温单配置保存失败");
          }
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "体温单配置保存失败");
        }
      },
      //展示项聚焦弹框
      inputFocus(row, index, tableIndex) {
        this.currentIndex = index;
        const _this = this;
        let tableData = _this['tableData' + Number(tableIndex)];
        let tableRow = tableData[index];
        let dialogData = _this['dialogData' + Number(index + 1)];
        let selectName = _this['selections' + Number(index + 1)];
        let dialogTable = 'dialogTable' + Number(index + 1);
        selectName = [];
        for (let i in dialogData) {
          for (let j in tableRow.configurationValue.optionValue) {
            if (dialogData[i].optionValue == tableRow.configurationValue.optionValue[j]) {
              if (index != 2) {
                _this.$set(dialogData[i], 'showName', tableRow.configurationValue.showName[j]);
              } else {
                _this.$set(dialogData[i], 'showColor', tableRow.configurationValue.showColor[j]);
              }
              selectName.push(dialogData[i]);
            }
          }
        }
        _this.dialogVisible = true;
        _this.$nextTick(() => {
          _this.$refs[dialogTable].clearSelection();
          if (selectName.length) {
            for (let i in selectName) {
              _this.$refs[dialogTable].toggleRowSelection(selectName[i]);
            }
          }
        });
      },
      //展示项选择项改变
      selectChange(selection) {
        let selectName = 'selections' + Number(this.currentIndex + 1);
        this[selectName] = selection;
        for (let i in selection) {
          let obj = {};
          for (let j in selection[i]) {
            obj[j] = selection[i][j];
          }
          this.$set(this[selectName], i, {...obj});
        }
        // console.log(this[selectName]);
      },
      cancel() {
        let dialogTable = 'dialogTable' + Number(this.currentIndex + 1);
        this.$refs[dialogTable].clearSelection();
        this.dialogVisible = false;
      },
      confirm() {
        let selectName = 'selections' + Number(this.currentIndex + 1);
        let arr = [];
        for (let i in this[selectName]) {
          let obj = {...this[selectName][i]};
          arr.push(obj);
        }
        arr.sort((a, b) => {
          return a['optionSort'] > b['optionSort'] ? 1 : -1
        });
        let showNames = '';
        let optionNames = '';
        let optionName = [];
        let optionValue = [];
        let showName = [];
        let showColor = [];
        let optionUnit = [];
        let optionPosition = [];
        let configurationValue = {};
        // console.log(arr);
        if (arr.length) {
          for (let i in arr) {
            if (this.currentIndex != 2) {
              optionName[i] = arr[i]['optionName'];
              optionValue[i] = arr[i]['optionValue'];
              showName[i] = arr[i]['showName'];
              if (this.currentIndex == 3) {
                optionUnit[i] = arr[i]['optionUnit'];
                optionPosition[i] = arr[i]['optionPosition'];
              }
              if (i == 0) {
                showNames += arr[i]['showName'];
                optionNames += arr[i]['optionName'];
              } else {
                showNames += '/' + arr[i]['showName'];
                optionNames += '/' + arr[i]['optionName'];
              }
            } else {
              optionName[i] = arr[i]['optionValue'];
              optionValue[i] = arr[i]['optionValue'];
              showColor[i] = arr[i]['showColor'];
              if (i == 0) {
                optionNames += arr[i]['optionValue'];
              } else {
                optionNames += '/' + arr[i]['optionValue'];
              }
            }
          }
          if (this.currentIndex != 2) {
            configurationValue = {
              ...this.tableData13[this.currentIndex],
              configurationValue: {
                optionName: optionName,
                optionNames: optionNames,
                optionValue: optionValue,
                showName: showName,
                showNames: showNames,
                optionUnit: optionUnit,
                optionPosition: optionPosition
              }
            };
          } else {
            configurationValue = {
              ...this.tableData13[this.currentIndex],
              configurationValue: {
                optionName: optionName,
                optionNames: optionNames,
                optionValue: optionValue,
                showColor: showColor
              }
            };
          }
          this.$set(this.tableData13, this.currentIndex, configurationValue);
        } else {
          if (this.currentIndex != 2) {
            configurationValue = {
              ...this.tableData13[this.currentIndex],
              configurationValue: {
                optionName: [],
                optionNames: '',
                optionValue: [],
                showName: [],
                showNames: '',
                showColor: []
              }
            }
          } else {
            configurationValue = {
              ...this.tableData13[this.currentIndex],
              configurationValue: {
                optionName: [],
                optionNames: '',
                optionValue: [],
                showColor: [],
                optionUnit: [],
                optionPosition: []
              }
            }
          }
          this.$set(this.tableData13, this.currentIndex, configurationValue);
        }
        console.log(configurationValue);
        this.dialogVisible = false;
      }
      //获取配置code
      /*async getConfig() {
        this.$showLoading();
        try {
          let res = await getConfiguration();
          if (res.code == 1) {
            console.log('项目', res.data);
          } else {
            this.$message.error(res.msg || "获取配置失败");
          }
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "获取配置失败");
        }
      },*/
    }
  }
</script>

<style lang="scss" scoped>
  .allocatStyle {
    .left-cont {
      /*width: 287px;*/
      width: 387px;
      margin-right: 10px;
      color: black;

      .left-cont-top {
        height: calc(100% - 76px);
        padding: 0 20px 20px 20px;

        .left-cont-title {
          margin: 20px 0 10px 0;
          font-size: $l-font-size;
          
          font-weight: 400;
          color: $l-color-fontcolor-3;
        }

        .left-cont-content {
          height: calc(100% - 191px);
          overflow: auto;

          .item-cont {
            padding-bottom: 10px;
            margin-bottom: 10px;
            background: $l-color-bgcolor-18;
            border-radius: 2px;

            /deep/ .el-tabs__item {
              padding: 0 5px;
              font-size: $l-font-size !important;
              font-weight: 400 !important;
              color: $l-color-fontcolor-3;
            }

            /deep/ .el-tabs__active-bar {
              height: 0;
            }

            /deep/ .el-tabs__content {
              width: calc(100% - 10px);
            }

            /deep/ .el-tabs__header {
              margin: 0;
            }

            .left-arrow {
              width: 20px;
              padding: 10px 5px 10px 5px;

              i {
                transition: transform .3s, -webkit-transform .3s;
              }
            }

            .right-arrow {
              width: calc(100% - 20px);
            }

            .is-active {
              -webkit-transform: rotate(90deg);
              transform: rotate(90deg);
            }
          }
        }
      }

      .left-cont-button {
        padding: 20px;
        border-top: 1px solid $l-color-bgcolor-11;

        .button-save {
          width: 60px !important;
        }
      }
    }

    .right-cont {
      width: calc(100% - 397px);
    }
  }
</style>
