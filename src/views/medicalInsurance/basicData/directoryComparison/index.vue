<template>
  <div class="width100 height100 directoryComparison">
    <flow-menu>
      <slot name="content">
        <div class="main">
          <div class="center clearfix">
            <split-pane
              v-on:resize="resize"
              :min-percent="10"
              :default-percent="50"
              split="vertical"
            >
              <template slot="paneL">
                <div class="center-item left">
                  <l-card-title class="card-title">
                    <span slot="left" style="width: 150px">医院项目信息</span>
                    <span slot="right"></span>
                  </l-card-title>
                  <div class="search-box">
                    <el-row :gutter="10">
                      <el-col :span="3">
                        <l-formt-title label="类别" required>
                          <el-select
                            v-model="leftSearchParams.itemType"
                            placeholder="请选择类别"
                            @change="itemTypeLeftChange"
                          >
                            <el-option
                              v-for="(item, index) in mediTypeList"
                              :key="index"
                              :label="item.name"
                              :value="item.code"
                            ></el-option>
                          </el-select>
                        </l-formt-title>
                      </el-col>
                      <el-col :span="4">
                        <l-formt-title label="对照标志">
                          <el-select
                            v-model="leftSearchParams.matchingStatus"
                            placeholder="请选择"
                          >
                            <el-option
                              v-for="item in matchLis"
                              :key="item.code"
                              :label="item.name"
                              :value="item.code"
                            ></el-option>
                          </el-select>
                        </l-formt-title>
                      </el-col>
                      <el-col :span="4">
                        <l-formt-title label="项目名称">
                          <el-input
                            v-model="leftSearchParams.hosItemName"
                            placeholder="请输入"
                          ></el-input>
                        </l-formt-title>
                      </el-col>
                      <el-col :span="4">
                        <l-formt-title label="项目代码">
                          <el-input
                            v-model="leftSearchParams.hosItemCode"
                            placeholder="请输入"
                          ></el-input>
                        </l-formt-title>
                      </el-col>
                      <el-col :span="3">
                        <l-formt-title label="本位码">
                          <el-input
                            v-model="leftSearchParams.standardCode"
                            placeholder="请输入"
                          ></el-input>
                        </l-formt-title>
                      </el-col>
                      <el-col
                        :span="6"
                        class="align-right"
                        v-if="resizePercent > 47"
                      >
                        <el-button type="primary" @click="search"
                          >查询</el-button
                        >
                        <el-button type="primary" plain @click="reset"
                          >重置</el-button
                        >
                        <el-button type="primary" plain @click="setOut"
                          >导出</el-button
                        >
                      </el-col>
                    </el-row>
                  </div>
                  <div class="left-table">
                    <el-table
                      ref="leftTable"
                      :data="tableData"
                      v-loading="loading"
                      border
                      stripe
                      width="100%"
                      height="100%"
                      highlight-current-row
                      @current-change="handleCurrentChange"
                      @header-dragend="headerDragend"
                    >
                      <el-table-column
                        v-for="(item, index) in tableHeader"
                        :key="index"
                        :prop="item.prop"
                        :label="item.label"
                        header-align="center"
                        :align="item.align || 'left'"
                        :min-width="item.width || item.label.length * 20 + 20"
                        :fixed="item.fixed"
                        show-overflow-tooltip
                      >
                        <template slot-scope="scope">
                          <!-- <template v-if="item.prop === 'hosDosageType'">
                        <span
                          v-if="leftSearchParams.itemType === '1'"
                          tableName="hrp_form"
                          :conditionMap="{form_code: scope.row[item.prop]}"
                          columns="form_name"
                          v-tableTransform
                        ></span>
                        <span v-else>{{ scope.row[item.prop] }}</span>
                      </template>-->
                          <template v-if="item.prop === 'hosUnit'">
                            <template v-if="!isChinese(scope.row[item.prop])">
                              <span
                                :val="scope.row[item.prop] || ''"
                                code="DrugUnit"
                                v-codeTransform
                                class="units hosUnit"
                              ></span>
                            </template>
                            <template v-else class="units hosUnit">{{
                              scope.row[item.prop]
                            }}</template>
                          </template>
                          <template v-else-if="item.prop === 'hosClassCode'">
                            <template v-if="leftSearchParams.itemType === '1'">
                              <span
                                :val="scope.row[item.prop] || ''"
                                code="DrugTypeCode"
                                v-codeTransform
                                class="units hosClassCode"
                              ></span>
                            </template>
                            <!-- <template v-else>就是</template> -->
                            <template v-else class="units hosClassCode">{{ scope.row[item.prop] }}</template>
                          </template>
                          <template v-else-if="item.prop === 'hosOriginCode'">
                            <template v-if="leftSearchParams.itemType === '1'">
                              <span
                                :val="scope.row[item.prop] || ''"
                                code="Manufacturer"
                                v-codeTransform
                                class="units hosOriginCode"
                              ></span>
                            </template>
                            <template v-else class="units hosOriginCode">{{ scope.row[item.prop] }}</template>
                          </template>
                          <template
                            v-else-if="item.prop === 'hosChargeTypeCode'"
                          >
                            <!-- 非药品 -->
                            <template v-if="leftSearchParams.itemType === '0'">
                              <span
                                tableName="fin_class_code"
                                :conditionMap="{
                                  fin_class_code: scope.row[item.prop] || '',
                                }"
                                columns="class_code_name"
                                v-tableTransform
                                class="units hosChargeTypeCode"
                              ></span>
                            </template>
                            <!-- 药品 -->
                            <!-- <span
                              v-else-if="leftSearchParams.itemType === '1'"
                              tableName="fin_class_code"
                              :conditionMap="{
                                fin_class_code: scope.row['hosCwType'] || '',
                              }"
                              columns="class_code_name"
                              v-tableTransform
                              class="units hosChargeTypeCode"
                            ></span> -->
                            <template v-else-if="leftSearchParams.itemType === '1'">{{hosCwTypeOptions[scope.row['hosCwType']]}}</template>
                            <template v-else>{{ scope.row[item.prop] }}</template>
                          </template>
                          <template
                            v-else-if="
                              item.prop === 'hosPrice'
                            "
                          >
                            <span class="units hosPrice"
                            >{{
                              formatNumber(scope.row[item.prop], 4)
                            }}</span>
                          </template>
                          <template
                            v-else-if="
                              item.prop === 'hosMaxPrice'
                            "
                          >
                            <span class="units hosMaxPrice">{{
                              formatNumber(scope.row[item.prop])
                            }}</span>
                          </template>
                          <template
                            v-else-if="
                              item.prop === 'chronicFlag'
                            "
                          >
                            <span v-if="scope.row[item.prop] == 1" class="units chronicFlag">是</span>
                            <span v-else-if="scope.row[item.prop] == 0" class="units chronicFlag">否</span>
                          </template>
                          <span v-else>{{ scope.row[item.prop] }}</span>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                  <div class="page align-right" v-if="resizePercent > 37">
                    <el-pagination
                      background
                      @size-change="changeSize"
                      @current-change="changePage"
                      :current-page="pageParams.pageNo"
                      :page-sizes="[20, 50, 100, 500, 1000, 5000, 10000, 50000, 100000, 200000]"
                      :page-size="pageParams.pageSize"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="pageParams.total"
                      :pager-count="5"
                    ></el-pagination>
                  </div>
                </div>
              </template>
              <template slot="paneR">
                <div class="center-item right">
                  <l-card-title class="card-title">
                    <span slot="left">医保项目目录</span>
                  </l-card-title>
                  <div class="search-box">
                    <el-row :gutter="10">
                      <el-col :span="5">
                        <l-formt-title required label="类别">
                          <el-select
                            v-model="rightSearchParams.itemType"
                            placeholder="请选择"
                            @change="itemTypeChange"
                          >
                            <el-option
                              v-for="item in controlItemsList"
                              :key="item.code"
                              :label="item.name"
                              :value="item.code"
                            ></el-option>
                          </el-select>
                        </l-formt-title>
                      </el-col>
                      <el-col :span="5">
                        <l-formt-title label="项目名称">
                          <el-input
                            v-model="rightSearchParams.itemName"
                            placeholder="请输入"
                          ></el-input>
                        </l-formt-title>
                      </el-col>
                      <el-col :span="5">
                        <l-formt-title label="项目代码">
                          <el-input
                            v-model="rightSearchParams.itemCode"
                            placeholder="请输入"
                          ></el-input>
                        </l-formt-title>
                      </el-col>
                      <el-col :span="4">
                        <l-formt-title
                          label="厂商"
                          :disabled="rightSearchParams.itemType == 2 || rightSearchParams.itemType == 103 || rightSearchParams.itemType == 105 || rightSearchParams.itemType == 201"
                        >
                          <el-input
                            v-model="rightSearchParams.producer"
                            placeholder="请输入"
                            :disabled="rightSearchParams.itemType == 2 || rightSearchParams.itemType == 103 || rightSearchParams.itemType == 105 || rightSearchParams.itemType == 201"
                          ></el-input>
                        </l-formt-title>
                      </el-col>
                      <el-col
                        :span="5"
                        class="align-right"
                        v-if="resizePercent < 63"
                      >
                        <el-button type="primary" @click="searchRight"
                          >查询</el-button
                        >
                        <el-button type="primary" plain @click="resetRight"
                          >重置</el-button
                        >
                      </el-col>
                    </el-row>
                  </div>
                  <div class="right-table">
                    <el-table
                      ref="rightTable"
                      :data="tableDataRight"
                      v-loading="loadingRight"
                      border
                      stripe
                      width="100%"
                      height="100%"
                      highlight-current-row
                      @current-change="handleCurrentChangeRight"
                      @header-dragend="headerDragendRight"
                    >
                      <el-table-column label="操作" min-width="90">
                        <template slot-scope="scope">
                          <el-button type="text" @click="match(scope.row)"
                            >对照</el-button
                          >
                        </template>
                      </el-table-column>
                      <el-table-column
                        v-for="(item, index) in tableHeaderRight"
                        :key="index"
                        :prop="item.prop"
                        :label="item.label"
                        header-align="center"
                        :align="item.align || 'left'"
                        :min-width="item.width || item.label.length * 20 + 20"
                        :fixed="item.fixed"
                        show-overflow-tooltip
                      >
                        <template slot-scope="scope">
                          <template v-if="medicareType == '02'">
                            <template v-if="item.hasOwnProperty('code') && item.code">{{ transformNew(item.code, scope.row[item.prop]) }}</template>
                            <template v-else-if="item.prop==='xzsybz'">
                              <span v-if="scope.row[item.prop]==1">限制</span>
                              <span v-else>不限制</span>
                            </template>
                            <template v-else-if="item.prop==='gjybypmljylbs'">
                              <span v-if="scope.row[item.prop]==1">甲类</span>
                              <span v-else-if="scope.row[item.prop]==2">乙类</span>
                              <span v-else-if="scope.row[item.prop]==3">丙类</span>
                              <span v-else>{{ scope.row[item.prop] }}</span>
                            </template>
                            <template v-else>{{ scope.row[item.prop] }}</template>
                          </template>
                          <template v-else>
                            <template v-if="item.prop === 'medicareType'">
                              <span>
                                {{
                                  medicareTypeShow[scope.row[item.prop]]
                                }}</span
                              >
                            </template>
                            <template v-else-if="item.prop === 'aka111'">
                              <span>
                                {{ typeCodeList[scope.row[item.prop]] }}</span
                              >
                            </template>
                            <template v-else-if="item.prop === 'aka070'">
                              <span>
                                {{ dosageTypeList[scope.row[item.prop]] }}</span
                              >
                            </template>
                            <template v-else-if="item.prop === 'ake003'">
                              <span>
                                {{
                                  controlItemsLists[scope.row[item.prop]]
                                }}</span
                              >
                            </template>
                            <template v-else-if="item.prop === 'aka031'">
                              <span>
                                {{ drugTypeList[scope.row[item.prop]] }}</span
                              >
                            </template>
                            <template v-else-if="item.prop === 'aka065'">
                              <span>
                                {{
                                  chargeItemLevelList[scope.row[item.prop]]
                                }}</span
                              >
                            </template>
                            <template v-else-if="item.prop === 'ake004'">
                              <span>
                                {{ orginType[scope.row[item.prop]] }}</span
                              >
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
                              <span>{{
                                scope.row[item.prop] == 1 ? "是" : "否"
                              }}</span>
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
                              <span>{{
                                formatNumber(scope.row[item.prop])
                              }}</span>
                            </template>
                            <span v-else>{{ scope.row[item.prop] }}</span>
                          </template>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                  <div class="page align-right" v-if="resizePercent < 63">
                    <el-pagination
                      background
                      @size-change="changeSizeRight"
                      @current-change="changePageRight"
                      :current-page="pageParamsRight.pageNo"
                      :page-sizes="[10, 20, 30, 40]"
                      :page-size="pageParamsRight.pageSize"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="pageParamsRight.total"
                      :pager-count="5"
                    ></el-pagination>
                  </div>
                </div>
              </template>
            </split-pane>
          </div>
          <l-card-title class="card-title">
            <span slot="left">对照结果</span>
            <span slot="right">
              <el-button type="primary" @click="cancelMatch"
                >对照取消</el-button
              >
            </span>
          </l-card-title>
          <div class="contrast-table">
            <el-table
              ref="bottomTable"
              :data="tableDataBottom"
              v-loading="loadingBottom"
              border
              stripe
              width="100%"
              height="100%"
              highlight-current-row
              @current-change="handleCurrentChangeBottom"
              @header-dragend="headerDragendBottom"
            >
              <el-table-column
                v-for="(item, index) in tableHeaderBottom"
                :key="index"
                :prop="item.prop"
                :label="item.label"
                header-align="center"
                :align="item.align || 'left'"
                :min-width="item.width || item.label.length * 20 + 20"
                :fixed="item.fixed"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <template
                    v-if="
                      item.prop == 'uploadFlag' ||
                      item.prop == 'staffApproval' ||
                      item.prop == 'residentApproval'
                    "
                  >
                    <span>{{ isUpload[scope.row[item.prop]] }}</span>
                  </template>
                  <template
                    v-else-if="
                      item.prop === 'hosMaxPrice' || item.prop === 'hosPrice'
                    "
                  >
                    <span>{{ formatNumber(scope.row[item.prop], 4) }}</span>
                  </template>
                  <template
                    v-else-if="item.prop === 'siItemType'"
                  >
                    <span>{{ transControlItemsList(scope.row[item.prop]) }}</span>
                  </template>
                  <span v-else>{{ scope.row[item.prop] }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </slot>
    </flow-menu>
  </div>
</template>

<script>
import FlowMenu from "@/components/FlowMenu";
import {
  getChargeItemLevel,
  getDosageType,
  getDrugType,
  getTypeCode,
  getPagemd,
  getPageHosChargeList,
  getPageItemList,
  getMatchItem,
  getPageItemMatchDTOList,
  cancelMatchById,
  westDrugFind,
  tcmDecFind,
  orgPreparationFind,
  nationalDrugFind,
  serviceItemFind,
  consumableFind,
} from "@/api/medicalInsurance/index.js";
import getDictInfoNew from "@/views/medicalInsuranceNew/common/getDictInfoNew.js";
import { onExcel } from "@/utils/excel/excel";

export default {
  name: "directoryComparison",
  mixins: [getDictInfoNew],
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
        99: "自费",
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
      medicareType: "",
      mediTypeList: [
        {
          code: "1",
          name: "药品",
        },
        {
          code: "0",
          name: "非药品",
        },
      ],
      hosCwTypeOptions: {
        1: "西药",
        2: "中成药",
        3: "草药"
      },
      // 医保集合
      medicareList: [],
      // 大类集合
      typeCodeList: {},
      // 医保类别
      drugTypeList: {},
      // 剂型集合
      dosageTypeList: {},
      // 医保类别
      medicareTypeShow: {},
      // 收费项目登记
      chargeItemLevelList: {},
      itemType: "",
      isTrue: {
        0: "否",
        1: "是",
      },
      orginType: {
        1: "国内",
        2: "国外",
      },
      isUpload: {
        0: "未上传",
        1: "已上传",
        "": "未上传",
      },

      controlItemsList: [],
      matchLis: [
        {
          code: "",
          name: "全部",
        },
        {
          code: "0",
          name: "未对照",
        },
        {
          code: "1",
          name: "已对照",
        },
      ],
      auditList: [
        {
          code: "",
          name: "全部",
        },
        {
          code: "0",
          name: "未审核",
        },
        {
          code: "1",
          name: "已审核",
        },
      ],
      uploadList: [
        {
          code: "",
          name: "全部",
        },
        {
          code: "0",
          name: "未上传",
        },
        {
          code: "1",
          name: "已上传",
        },
      ],
      leftSearchParams: {
        itemType: "",
        hosItemCode: "",
        hosItemName: "",
        uploadFlag: "",
        checkStatus: "",
        recordStatus: "",
        matchingStatus: "",
      },
      loading: false,
      tableHeader: [
        {
          prop: "hosItemCode",
          label: "项目代码",
          // fixed: "left",
          width: 120,
        },
        {
          prop: "hosItemName",
          label: "项目名称",
          // fixed: "left",
          width: 180,
        },
        /* {
          prop: "hosPinyin",
          label: "拼音码"
        },
        {
          prop: "hosWubi",
          label: "五笔码"
        }, */
        {
          prop: "chronicFlag",
          label: "慢病标志"
        },
        {
          prop: "hosUnit",
          label: "单位",
          width: 50,
        },
        {
          prop: "hosPrice",
          label: "价格",
          width: 100,
          align: "right",
        },
        {
          prop: "hosDosageType",
          label: "剂型",
          width: 120,
        },
        {
          prop: "hosDosageValue",
          label: "剂量",
          width: 50,
        },
        {
          prop: "hosSpec",
          label: "规格",
          width: 110,
        },
        {
          prop: "siItemCode",
          label: "医保目录编码",
          width: 120,
        },
        {
          prop: "siItemName",
          label: "医保目录名称",
          width: 180,
        },
        {
          prop: "hosApproveNum",
          label: "国药准字",
          width: 120,
        },
        {
          prop: "hosMaxPrice",
          label: "最高原价",
          align: "right",
        },
        {
          prop: "hosOriginCode",
          label: "生产厂商",
          width: 240,
        },
        {
          prop: "hosChargeTypeCode",
          label: "费用类别",
        },
        {
          prop: "hosClassCode",
          label: "药品分类码",
          width: 120,
        },
        {
          prop: "hosDeletedStatus",
          label: "在用状态",
        },
      ],
      tableData: [],
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
      },
      rightSearchParams: {
        // medicareType: "",
        itemName: "",
        itemCode: "",
      },
      loadingRight: false,
      rightTableHeight: "100%",
      tableHeaderRight: [],
      tableDataRight: [],
      pageParamsRight: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
      },
      loadingBottom: false,
      tableHeaderBottom: [
        {
          prop: "uploadFlag",
          label: "上传标志",
        },
        {
          prop: "staffApproval",
          label: "职工审批标志",
        },
        {
          prop: "residentApproval",
          label: "居民审批标志",
        },
        {
          prop: "siItemCode",
          label: "中心项目编码",
        },
        {
          prop: "siItemName",
          label: "中心项目名称",
        },
        {
          prop: "siItemType",
          label: "中心收费类别",
        },
        /* {
          prop: "s7",
          label: "中心项目种类"
        }, */
        {
          prop: "itemLevel",
          label: "收费项目等级",
        },
        {
          prop: "hosMaxPrice",
          label: "最高限价",
          align: "right",
        },
        {
          prop: "hosPrice",
          label: "医院端价格",
          align: "right",
        },
        {
          prop: "hosItemCode",
          label: "定点医疗机构项目编码",
          width: 180,
        },
        {
          prop: "hosItemName",
          label: "定点医疗机构项目名称",
          width: 300,
        },
        {
          prop: "dosageType",
          label: "中心药品剂型",
        },
        {
          prop: "dosageUnit",
          label: "药品剂量单位",
        },
      ],
      tableHeaderBottom1: [
        {
          prop: "ake001",
          label: "社保目录编码",
        },
        {
          prop: "ake001",
          label: "社保目录名称",
        },
        {
          prop: "bkm017",
          label: "药品本位码",
        },
        {
          prop: "ake003",
          label: "目录类别",
        },
        {
          prop: "ake005",
          label: "协议机构内部目录编码",
        },
        {
          prop: "ake006",
          label: "医药机构内部目录名称",
        },
        {
          prop: "aka074",
          label: "规格",
        },
        {
          prop: "aka070",
          label: "剂型",
        },
        {
          prop: "aka067",
          label: "计价单位",
        },
        {
          prop: "bka053",
          label: "厂家",
        },
        {
          prop: "bka505",
          label: "进货价格",
        },
        {
          prop: "bka506",
          label: "收费价格",
        },
        {
          prop: "aka064",
          label: "处方药标志",
        },
        {
          prop: "bkm062",
          label: "门诊特检项目标志",
        },
        {
          prop: "aae030",
          label: "备案日期",
        },
        {
          prop: "aae127",
          label: "申请日期",
        },
        {
          prop: "baa201",
          label: "目录申请状态",
        },
        {
          prop: "aae015",
          label: "目录申请审批时间",
        },
        {
          prop: "aae016",
          label: "办结状态",
        },
        {
          prop: "aae013",
          label: "备注",
        },
      ],
      tableDataBottom: [],
      currentRow: null,
      currentRowRight: null,
      currentRowBottom: null,
      cacheLeftSearchParams: {},
      cacheRightSearchParams: {},
      controlItemsLists: {},
      resizePercent: 50,
    };
  },
  watch: {
    medicareType: {
      handler(val) {
        if (val == "02") {
          this.controlItemsList = [
            {
              code: 101,
              name: "西药",
            },
            {
              code: 102,
              name: "中成药",
            },
            {
              code: 103,
              name: "中药饮片",
            },
            {
              code: 104,
              name: "自制剂",
            },
            {
              code: 105,
              name: "民族药",
            },
            {
              code: 201,
              name: "服务项目名称",
            },
            {
              code: 301,
              name: "医用材料",
            },
          ];
        } else if (val == "01") {
          this.controlItemsList = [
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
          ];
        }
        this.rightSearchParams.itemType = this.controlItemsList[0].code;
        this.itemTypeChange(this.rightSearchParams.itemType);
      },
    },
  },
  created() {
    this.getTypeCode();
    this.getDrugType();
    this.getChargeItemLevel();
    this.getDosageType();
    this.getControlItemsList();
    this.getMedicareType(() => {
      this.leftSearchParams.itemType = this.mediTypeList[0].code;
      this.itemTypeLeftChange(this.leftSearchParams.itemType);
    });
  },
  methods: {
    transControlItemsList(data) {
      for(let i in this.controlItemsList) {
        let item = this.controlItemsList[i];
        if(item.code == data) {
          return item.name;
        }
      }
      return "";
    },
    resize(aaa) {
      this.resizePercent = aaa;
      console.log("aaa:", aaa);
    },
    itemTypeLeftChange(val) {
      this.search();
    },
    itemTypeChange(val) {
      if (this.medicareType == "01" && val == 2) {
        this.rightSearchParams.producer = "";
      } else if (this.medicareType == "02") {
        if(val == "103" || val == "105" || val == "201") {
          this.rightSearchParams.producer = "";
        }
      }
      this.searchRight();
    },
    isChinese(temp) {
      var re = /[\d]+/;
      if (re.test(temp)) return false;
      return true;
    },
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
    // 获取大类集合
    getTypeCode() {
      getTypeCode().then((res) => {
        if (res.code === 1) {
          res.data.forEach((item) => {
            this.typeCodeList[item.dictCode] = item.dictName;
          });
        }
      });
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
      this.controlItemsList.forEach((i) => {
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
    // 获取医保类别
    getMedicareType(fn) {
      // 判断是新医保还是旧医保
      let path = this.$route.path;
      let isNew = false;
      if (path.indexOf("medicalInsuranceNew") > -1) {
        isNew = true;
      } else {
        isNew = false;
      }
      getPagemd().then((res) => {
        if (res.code === 1) {
          this.medicareList = res.data;
          this.medicareType = isNew
            ? res.data[0]["dictCode"]
            : res.data[1]["dictCode"];
          fn();
          res.data.forEach((item) => {
            this.medicareTypeShow[item.dictCode] = item.dictName;
          });
        }
      });
    },

    search() {
      this.cacheLeftSearchParams = { ...this.leftSearchParams };
      this.pageParams.pageNo = 1;
      this.loadTable();
    },
    reset() {
      this.leftSearchParams = this.$options.data().leftSearchParams;
    },
    setOut() {
      if(!this.tableData.length) {
        return;
      }
      let elTableRow = this.$refs.leftTable.bodyWrapper.querySelectorAll(
        ".el-table__row"
      );
      // console.log(elTableRow)
      let tHeader = this.tableHeader.map(item => {
        return item.label;
      });
      let filterVal = this.tableHeader.map(item => {
        return item.prop;
      });
      let tableData_new = this.tableData.map((item, i) => {
        let obj = {...item};
        let elTableRowItem = elTableRow[i];
        let units = elTableRowItem.querySelectorAll(
        ".units"
      );
        for(let j in units) {
          let items = units[j];
          if(items.className && items.className.indexOf(" ") > -1) {
            obj[items.className.split(" ")[1]] = items.innerText;
          }
        }
        return obj;
      });
      console.log(tableData_new);
      // return;
      let excelData = {
        title: "医院项目信息",
        tHeader,
        filterVal,
        listDate: tableData_new
      };
      onExcel(excelData);
    },
    // 获取医院项目信息
    loadTable() {
      if (
        this.leftSearchParams.itemType !== "1" &&
        this.leftSearchParams.itemType !== "0"
      ) {
        this.$message.warning("请选择类别!");
        return;
      }
      // this.leftSearchParams = { ...this.cacheLeftSearchParams };
      const params = {
        ...this.cacheLeftSearchParams,
        medicareType: this.medicareType,
        pageNo: this.pageParams.pageNo,
        pageSize: this.pageParams.pageSize,
      };
      this.loading = true;
      getPageHosChargeList(params)
        .then((res) => {
          if (res.code === 1) {
            this.currentRow = null;
            this.tableData = res.data;
            this.$refs.leftTable.setCurrentRow();
            this.pageParams.total = res.total;
          }
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    handleCurrentChange(val) {
      this.currentRow = val;
      if (this.currentRow) {
        this.loadTableBottom({});
      }
    },
    changeSize(val) {
      this.pageParams.pageSize = val;
      this.loadTable();
    },
    changePage(val) {
      this.pageParams.pageNo = val;
      this.loadTable();
    },

    searchRight() {
      this.cacheRightSearchParams = { ...this.rightSearchParams };
      this.pageParamsRight.pageNo = 1;
      if (this.medicareType === "02") {
        this.loadTableRightNew();
        return;
      }
      this.loadTableRight();
    },
    resetRight() {
      this.rightSearchParams = this.$options.data().rightSearchParams;
    },
    // 获取医保项目目录
    loadTableRight() {
      if (!this.rightSearchParams.itemType) {
        this.$message.warning("请选择类别!");
        return;
      }
      this.rightSearchParams = { ...this.cacheRightSearchParams };
      const params = {
        ...this.rightSearchParams,
        medicareType: this.medicareType,
        // itemType: this.itemType,
        pageNo: this.pageParamsRight.pageNo,
        pageSize: this.pageParamsRight.pageSize,
      };
      this.loadingRight = true;
      if (this.rightSearchParams.itemType === "1") {
        this.tableHeaderRight = [
          {
            prop: "ake001",
            label: "社保目录编码",
            width: 180,
          },
          {
            prop: "aka061",
            label: "通用名",
            width: 130,
          },
          {
            prop: "ckm113",
            label: "门诊慢病药品标识",
            width: 145,
          },
          {
            prop: "bkm017",
            label: "药品本位码",
            width: 160,
          },
          {
            prop: "aka074",
            label: "规格",
            width: 120,
          },
          {
            prop: "bka053",
            label: "厂家",
            width: 210,
          },
          {
            prop: "bkm007",
            label: "批准文号",
            width: 160,
          },
          {
            prop: "aka070",
            label: "剂型",
            width: 100,
          },
          {
            prop: "ckm099",
            label: "限制性说明",
            width: 120,
          },
          {
            prop: "aka068",
            label: "医保支付上限",
            width: 120,
          },
          {
            prop: "bkm032",
            label: "记账标志",
            width: 100,
          },
          {
            prop: "akc222",
            label: "省药品编码",
            width: 170,
          },
          {
            prop: "ake002",
            label: "社保目录名称",
            width: 120,
          },
          {
            prop: "ake003",
            label: "目录类别",
            width: 140,
          },
          {
            prop: "bke111",
            label: "分类编码",
            width: 120,
          },
          {
            prop: "aka062",
            label: "英文名称",
            width: 260,
          },
          {
            prop: "bkm030",
            label: "别名（简称）",
            width: 120,
          },
          {
            prop: "ckm097",
            label: "炮制方法",
            width: 120,
          },
          {
            prop: "ckm098",
            label: "药用部位",
            width: 120,
          },
          {
            prop: "aka020",
            label: "拼音简码",
            width: 120,
          },
          {
            prop: "aka111",
            label: "大类代码",
            width: 95,
          },
          {
            prop: "aka036",
            label: "限制使用标记",
            width: 120,
          },
          {
            prop: "bkm100",
            label: "限医院级别",
            width: 120,
          },
          {
            prop: "bkm101",
            label: "限协议机构类别",
            width: 120,
          },
          {
            prop: "bkm102",
            label: "限协议机构专科类别",
            width: 180,
          },
          {
            prop: "ckm107",
            label: "记账途径",
            width: 120,
          },
          {
            prop: "bkm008",
            label: "批准文号备注",
            width: 120,
          },
          {
            prop: "bkm009",
            label: "批准日期",
            width: 120,
          },
          {
            prop: "aka067",
            label: "计价单位",
            width: 120,
          },
          {
            prop: "bka640",
            label: "单位时间限量",
            width: 120,
          },
          {
            prop: "aka065",
            label: "收费项目等级",
            width: 120,
          },
          {
            prop: "aka031",
            label: "药品类别",
            width: 120,
          },
          {
            prop: "bkm054",
            label: "医院制剂标志",
            width: 120,
          },
          {
            prop: "akb020",
            label: "制剂所属协议机构编码",
            width: 180,
          },
          {
            prop: "aka064",
            label: "处方药标志",
            width: 120,
          },
          {
            prop: "aka022",
            label: "基本医疗保险启用标志",
            width: 200,
          },
          {
            prop: "bkm033",
            label: "基本医疗保险启用",
            width: 200,
          },
          {
            prop: "bkm034",
            label: "基本医疗保险终止日期",
            width: 200,
          },
          {
            prop: "bkm035",
            label: "家属统筹医疗启用标志",
            width: 200,
          },
          {
            prop: "bkm036",
            label: "家属统筹医疗启用日期",
            width: 200,
          },
          {
            prop: "bkm037",
            label: "家属统筹医疗终止日期",
            width: 200,
          },
          {
            prop: "bkm038",
            label: "地方补充医疗保险启用标志",
            width: 200,
          },
          {
            prop: "bkm039",
            label: "地方补充医疗保险启用日期",
            width: 200,
          },
          {
            prop: "bkm040",
            label: "地方补充医疗保险终止日期",
            width: 200,
          },
          {
            prop: "bkm041",
            label: "预防接种启用标志",
            width: 200,
          },
          {
            prop: "bkm042",
            label: "预防接种启用日期",
            width: 200,
          },
          {
            prop: "bkm043",
            label: "预防接种终止日期",
            width: 200,
          },
          {
            prop: "bkm044",
            label: "打七折启用标志",
            width: 200,
          },
          {
            prop: "bkm045",
            label: "打七折启用日期",
            width: 200,
          },
          {
            prop: "bkm046",
            label: "打七折终止日期",
            width: 200,
          },
          {
            prop: "bkm047",
            label: "少儿医疗启用标志",
            width: 200,
          },
          {
            prop: "bkm048",
            label: "少儿医疗启用日期",
            width: 200,
          },
          {
            prop: "bkm049",
            label: "少儿医疗终止日期",
            width: 200,
          },
          {
            prop: "ama011",
            label: "生育保险启用标志",
            width: 200,
          },
          {
            prop: "bma030",
            label: "生育保险启用日期",
            width: 200,
          },
          {
            prop: "bma031",
            label: "生育保险终止日期",
            width: 200,
          },
          {
            prop: "ala011",
            label: "工伤医疗启用标志",
            width: 200,
          },
          {
            prop: "bla050",
            label: "工伤医疗启用日期",
            width: 200,
          },
          {
            prop: "bla051",
            label: "工伤医疗终止日期",
            width: 200,
          },
          {
            prop: "bla052",
            label: "工伤康复启用标志",
            width: 200,
          },
          {
            prop: "bla053",
            label: "工伤康复启用日期",
            width: 200,
          },
          {
            prop: "bla054",
            label: "工伤康复终止日期",
            width: 200,
          },
          {
            prop: "ckm104",
            label: "大病药标志",
            width: 100,
          },
          {
            prop: "ckm105",
            label: "慈善援助药品标志",
            width: 200,
          },
          {
            prop: "ckm106",
            label: "重疾补充医保药品标志",
            width: 200,
          },
          {
            prop: "bkm080",
            label: "数量限额(支/盒)",
            align: "right",
            width: 200,
          },
          {
            prop: "bkm081",
            label: "医保记帐周期(月)",
            align: "right",
            width: 200,
          },
          {
            prop: "bkm082",
            label: "慈善援助周期(月)",
            align: "right",
            width: 200,
          },
          {
            prop: "bkm083",
            label: "记帐循环周期(月)",
            align: "right",
            width: 200,
          },
          {
            prop: "bkm090",
            label: "医保谈判价格",
            align: "right",
            width: 200,
          },
          {
            prop: "ckm102",
            label: "医保谈判价格所属行政级别",
            width: 220,
          },
          {
            prop: "bkm095",
            label: "医保最高价",
            align: "right",
            width: 100,
          },
          {
            prop: "aae396",
            label: "更新日期",
            width: 100,
          },
          {
            prop: "aae013",
            label: "备注1",
            width: 80,
          },
          {
            prop: "cke900",
            label: "备注2",
            width: 80,
          },
          {
            prop: "cke901",
            label: "备注3",
            width: 80,
          },
          {
            prop: "cke902",
            label: "备注4",
            width: 80,
          },
          {
            prop: "cke903",
            label: "备注5",
            width: 80,
          },
          {
            prop: "cke904",
            label: "备注6",
            width: 80,
          },
        ];
      } else if (this.rightSearchParams.itemType === "2") {
        this.tableHeaderRight = [
          {
            prop: "ake001",
            label: "社保目录编码",
            width: 180,
          },
          {
            prop: "ake002",
            label: "社保目录名称",
            width: 300,
          },
          {
            prop: "akc222",
            label: "省药品编码",
            width: 120,
          },
          {
            prop: "ake003",
            label: "目录类别",
            width: 100,
          },
          {
            prop: "bke111",
            label: "分类编码",
            width: 120,
          },
          {
            prop: "aka111",
            label: "大类代码",
            width: 100,
          },
          {
            prop: "aka036",
            label: "限制使用标记",
            width: 120,
          },
          {
            prop: "ckm099",
            label: "限制性说明",
            width: 180,
          },
          {
            prop: "bkm100",
            label: "限医院级别",
            width: 120,
          },
          {
            prop: "bkm101",
            label: "限协议机构类别",
            width: 120,
          },
          {
            prop: "bkm102",
            label: "限协议机构专科类别",
            width: 200,
          },
          {
            prop: "ckm107",
            label: "记账途径",
            width: 120,
          },
          {
            prop: "ckm108",
            label: "自主定价项目标识",
            width: 200,
          },
          {
            prop: "ckm109",
            label: "加收项目标识",
            width: 180,
          },
          {
            prop: "bkm031",
            label: "诊疗项目类别",
            width: 180,
          },
          {
            prop: "bkm010",
            label: "项目内涵",
            width: 200,
          },
          {
            prop: "bkm011",
            label: "除外内容",
            width: 180,
          },
          {
            prop: "bka956",
            label: "说明",
            width: 200,
          },
          {
            prop: "aka067",
            label: "计价单位",
            width: 80,
          },
          {
            prop: "bka640",
            label: "单位时间限量",
            width: 120,
          },
          {
            prop: "bkm032",
            label: "记账标志",
            width: 80,
          },
          {
            prop: "aka022",
            label: "基本医疗保险启用标志",
            width: 200,
          },
          {
            prop: "bkm033",
            label: "基本医疗保险启用",
            width: 200,
          },
          {
            prop: "bkm034",
            label: "基本医疗保险终止日期",
            width: 200,
          },
          {
            prop: "bkm035",
            label: "家属统筹医疗启用标志",
            width: 200,
          },
          {
            prop: "bkm036",
            label: "家属统筹医疗启用日期",
            width: 200,
          },
          {
            prop: "bkm037",
            label: "家属统筹医疗终止日期",
            width: 200,
          },
          {
            prop: "bkm038",
            label: "地方补充医疗保险启用标志",
            width: 200,
          },
          {
            prop: "bkm039",
            label: "地方补充医疗保险启用日期",
            width: 200,
          },
          {
            prop: "bkm040",
            label: "地方补充医疗保险终止日期",
            width: 200,
          },
          {
            prop: "bkm044",
            label: "打七折启用标志",
            width: 120,
          },
          {
            prop: "bkm045",
            label: "打七折启用日期",
            width: 120,
          },
          {
            prop: "bkm046",
            label: "打七折终止日期",
            width: 120,
          },
          {
            prop: "bkm047",
            label: "少儿医疗启用标志",
            width: 180,
          },
          {
            prop: "bkm048",
            label: "少儿医疗启用日期",
            width: 180,
          },
          {
            prop: "bkm049",
            label: "少儿医疗终止日期",
            width: 180,
          },
          {
            prop: "ama011",
            label: "生育保险启用标志",
            width: 180,
          },
          {
            prop: "bma030",
            label: "生育保险启用日期",
            width: 180,
          },
          {
            prop: "bma031",
            label: "生育保险终止日期",
            width: 200,
          },
          {
            prop: "ala011",
            label: "工伤医疗启用标志",
            width: 200,
          },
          {
            prop: "bla050",
            label: "工伤医疗启用日期",
            width: 200,
          },
          {
            prop: "bla051",
            label: "工伤医疗终止日期",
            width: 200,
          },
          {
            prop: "bla052",
            label: "工伤康复启用标志",
            width: 200,
          },
          {
            prop: "bla053",
            label: "工伤康复启用日期",
            width: 200,
          },
          {
            prop: "bla054",
            label: "工伤康复终止日期",
            width: 200,
          },
          {
            prop: "bkm014",
            label: "政府指导价格（一档）",
            width: 200,
          },
          {
            prop: "bkm015",
            label: "政府指导价格（二档）",
            width: 200,
          },
          {
            prop: "bkm016",
            label: "政府指导价格（三档）",
            width: 200,
          },
          {
            prop: "bkm055",
            label: "政府指导价格（四档）",
            width: 200,
          },
          {
            prop: "bkm091",
            label: "医保谈判价格（一档）",
            width: 200,
          },
          {
            prop: "bkm092",
            label: "医保谈判价格（二档）",
            width: 200,
          },
          {
            prop: "bkm093",
            label: "医保谈判价格（三档）",
            width: 200,
          },
          {
            prop: "bkm094",
            label: "医保谈判价格（四档）",
            width: 200,
          },
          {
            prop: "ckm102",
            label: "医保谈判价格所属行政级别",
            width: 200,
          },
          {
            prop: "bkm096",
            label: "医保最高价（一档）",
            width: 200,
          },
          {
            prop: "bkm097",
            label: "医保最高价（二档）",
            width: 200,
          },
          {
            prop: "bkm098",
            label: "医保最高价（三档）",
            width: 200,
          },
          {
            prop: "bkm099",
            label: "医保最高价（四档）",
            width: 200,
          },
          {
            prop: "bkm056",
            label: "医保支付上限（一档）",
            width: 200,
          },
          {
            prop: "bkm057",
            label: "医保支付上限（二档）",
            width: 200,
          },
          {
            prop: "bkm058",
            label: "医保支付上限（三档）",
            width: 200,
          },
          {
            prop: "bkm059",
            label: "医保支付上限（四档）",
            width: 200,
          },
          {
            prop: "aae396",
            label: "更新日期",
            width: 100,
          },
          {
            prop: "aae013",
            label: "备注1",
            width: 80,
          },
          {
            prop: "cke900",
            label: "备注2",
            width: 80,
          },
          {
            prop: "cke901",
            label: "备注3",
            width: 80,
          },
          {
            prop: "cke902",
            label: "备注4",
            width: 80,
          },
          {
            prop: "cke903",
            label: "备注5",
            width: 80,
          },
          {
            prop: "cke904",
            label: "备注6",
            width: 80,
          },
        ];
      } else {
        this.tableHeaderRight = [
          {
            prop: "ake001",
            label: "社保目录编码",
            width: 120,
          },
          {
            prop: "ake002",
            label: "社保目录名称",
            width: 160,
          },
          {
            prop: "akc222",
            label: "省材料编码",
            width: 100,
          },
          {
            prop: "ake003",
            label: "目录类别",
            width: 100,
          },
          {
            prop: "bke111",
            label: "分类编码",
            width: 100,
          },
          {
            prop: "aka111",
            label: "大类代码",
            width: 100,
          },
          {
            prop: "aka036",
            label: "限制使用标记",
            width: 120,
          },
          {
            prop: "ckm099",
            label: "限制性说明",
            width: 120,
          },
          {
            prop: "bkm100",
            label: "限医院级别",
            width: 120,
          },
          {
            prop: "bkm101",
            label: "限协议机构类别",
            width: 180,
          },
          {
            prop: "bkm102",
            label: "限协议机构专科类别",
            width: 150,
          },
          {
            prop: "ckm107",
            label: "记账途径",
            width: 120,
          },
          {
            prop: "ake004",
            label: "产地标志",
            width: 80,
          },
          {
            prop: "bka053",
            label: "厂家",
            width: 80,
          },
          {
            prop: "ala026",
            label: "产地",
            width: 80,
          },
          {
            prop: "bkm090",
            label: "医保谈判价格",
            width: 120,
          },
          {
            prop: "ckm102",
            label: "医保谈判价格所属行政级别",
            width: 200,
          },
          {
            prop: "bkm095",
            label: "医保最高价",
            width: 120,
          },
          {
            prop: "aka068",
            label: "医保支付上限",
            width: 150,
          },
          {
            prop: "bkm032",
            label: "记账标志",
            width: 120,
          },
          {
            prop: "aka022",
            label: "基本医疗保险启用标志",
            width: 200,
          },
          {
            prop: "bkm033",
            label: "基本医疗保险启用",
            width: 200,
          },
          {
            prop: "bkm034",
            label: "基本医疗保险终止日期",
            width: 200,
          },
          {
            prop: "bkm035",
            label: "家属统筹医疗启用标志",
            width: 200,
          },
          {
            prop: "bkm036",
            label: "家属统筹医疗启用日期",
            width: 200,
          },
          {
            prop: "bkm037",
            label: "家属统筹医疗终止日期",
            width: 200,
          },
          {
            prop: "bkm038",
            label: "地方补充医疗保险启用标志",
            width: 200,
          },
          {
            prop: "bkm039",
            label: "地方补充医疗保险启用日期",
            width: 200,
          },
          {
            prop: "bkm040",
            label: "地方补充医疗保险终止日期",
            width: 200,
          },
          {
            prop: "bkm044",
            label: "打七折启用标志",
            width: 180,
          },
          {
            prop: "bkm045",
            label: "打七折启用日期",
            width: 180,
          },
          {
            prop: "bkm046",
            label: "打七折终止日期",
            width: 180,
          },
          {
            prop: "bkm047",
            label: "少儿医疗启用标志",
            width: 200,
          },
          {
            prop: "bkm048",
            label: "少儿医疗启用日期",
            width: 200,
          },
          {
            prop: "bkm049",
            label: "少儿医疗终止日期",
            width: 200,
          },
          {
            prop: "ama011",
            label: "生育保险启用标志",
            width: 200,
          },
          {
            prop: "bma030",
            label: "生育保险启用日期",
            width: 200,
          },
          {
            prop: "bma031",
            label: "生育保险终止日期",
            width: 200,
          },
          {
            prop: "ala011",
            label: "工伤医疗启用标志",
            width: 200,
          },
          {
            prop: "bla050",
            label: "工伤医疗启用日期",
            width: 200,
          },
          {
            prop: "bla051",
            label: "工伤医疗终止日期",
            width: 200,
          },
          {
            prop: "bla052",
            label: "工伤康复启用标志",
            width: 200,
          },
          {
            prop: "bla053",
            label: "工伤康复启用日期",
            width: 200,
          },
          {
            prop: "bla054",
            label: "工伤康复终止日期",
            width: 200,
          },
          {
            prop: "bla055",
            label: "辅助器具启用标志",
            width: 200,
          },
          {
            prop: "bla056",
            label: "辅助器具启用日期",
            width: 200,
          },
          {
            prop: "bla057",
            label: "辅助器具终止日期",
            width: 200,
          },
          {
            prop: "aae396",
            label: "更新日期",
            width: 200,
          },
          {
            prop: "aae013",
            label: "备注1",
            width: 80,
          },
          {
            prop: "cke900",
            label: "备注2",
            width: 80,
          },
          {
            prop: "cke901",
            label: "备注3",
            width: 80,
          },
          {
            prop: "cke902",
            label: "备注4",
            width: 80,
          },
          {
            prop: "cke903",
            label: "备注5",
            width: 80,
          },
          {
            prop: "cke904",
            label: "备注6",
            width: 80,
          },
        ];
      }
      this.$nextTick(() => {
        this.$refs.rightTable.doLayout();
      });
      getPageItemList(params)
        .then((res) => {
          if (res.code === 1) {
            this.currentRowRight = null;
            this.$refs.rightTable.setCurrentRow();
            this.pageParamsRight.total = res.total;
            this.tableDataRight = res.data;
          }
          this.loadingRight = false;
        })
        .catch((err) => {
          this.loadingRight = false;
        });
    },
    // [新医保]医保项目目录查询
    async loadTableRightNew() {
      if (!this.rightSearchParams.itemType) {
        this.$message.warning("请选择类别!");
        return;
      }
      let params = {
        type: this.rightSearchParams.itemType,
        cateName: this.rightSearchParams.itemName,
        cateNum: this.rightSearchParams.itemCode,
        pageNo: this.pageParamsRight.pageNo,
        pageSize: this.pageParamsRight.pageSize,
        manufacturers: this.rightSearchParams.producer || ""
      };
      this.tableDataRight = [];
      let type =
        this.rightSearchParams.itemType == 102
          ? 101
          : this.rightSearchParams.itemType;
      await this.tableHeaderRightChange(type);
      this.loadingRight = true;
      try {
        let res = {};
        switch (this.rightSearchParams.itemType) {
          case 101:
            res = await westDrugFind(params);
            break;
          case 102:
            res = await westDrugFind(params);
            break;
          case 103:
            res = await tcmDecFind(params);
            break;
          case 104:
            res = await orgPreparationFind(params);
            break;
          case 105:
            res = await nationalDrugFind(params);
            break;
          case 201:
            res = await serviceItemFind(params);
            break;
          case 301:
            res = await consumableFind(params);
            break;
          default:
            return;
        }

        if (res.code == 1) {
          this.currentRowRight = null;
          this.$refs.rightTable.setCurrentRow();
          this.pageParamsRight.total = res.total;
          this.tableDataRight = res.data;
        }
      } catch (error) {
      } finally {
        this.loadingRight = false;
      }
    },
    // 不同的类别改变不同的表头
    tableHeaderRightChange(type) {
      switch (type) {
        case 101:
          this.tableHeaderRight = [
            { prop: "ylmlbm", label: "医疗目录编码", width: 220 },
            { prop: "ypspm", label: "药品商品名", width: 200 },
            { prop: "scqymc", label: "生产企业名称", width: 120 },
            { prop: "yjbwm", label: "药监本位码", width: 100 },
            {
              prop: "xzsybz",
              label: "限制使用标志",
              width: 120,
              code: "lmt_used_flag",
            },
            { prop: "xzsyfw", label: "限制使用范围", width: 120 },
            { prop: "ybzfsx", label: "医保支付上限", width: 120 },
            { prop: "pzwh", label: "批准文号", width: 120 },
            {
              prop: "gjybypmljylbs",
              label: "国家医保药品目录甲乙类标识",
              width: 260,
            },
            { prop: "tymbh", label: "通用名编号", width: 100 },
            { prop: "yptym", label: "药品通用名", width: 200 },
            { prop: "hxmc", label: "化学名称", width: 80 },
            { prop: "bm", label: "别名", width: 200 },
            { prop: "ywmc", label: "英文名称", width: 80 },
            { prop: "zcmc", label: "注册名称", width: 80 },
            { prop: "ypjx", label: "药品剂型", width: 80 },
            { prop: "ypjxmc", label: "药品剂型名称", width: 120 },
            // { prop: "yplb", label: "药品类别", width: 80 },
            // { prop: "yplbmc", label: "药品类别名称", width: 120 },
            { prop: "ypgg", label: "药品规格", width: 80 },
            { prop: "ypggdm", label: "药品规格代码", width: 120 },
            { prop: "zcjx", label: "注册剂型", width: 80 },
            { prop: "zcgg", label: "注册规格", width: 80 },
            { prop: "zcggdm", label: "注册规格代码", width: 120 },
            { prop: "mcyl", label: "每次用量", width: 80 },
            { prop: "sypc", label: "使用频次", width: 80 },
            { prop: "sgyj", label: "酸根盐基", width: 80 },
            { prop: "gjypbh", label: "国家药品编号", width: 120 },
            { prop: "yf", label: "用法", width: 80 },
            {
              prop: "zcybz",
              label: "中成药标志",
              width: 100,
              code: "wm_tcmpat_flag",
            },
            { prop: "scdlb", label: "生产地类别", width: 100 },
            { prop: "scdlbmc", label: "生产地类别名称", width: 140 },
            { prop: "jjdwlx", label: "计价单位类型", width: 120 },
            {
              prop: "fcfybz",
              label: "非处方药标志",
              width: 120,
              code: "otc_flag",
            },
            { prop: "fcfybzmc", label: "非处方药标志名称", width: 160 },
            { prop: "bzcz", label: "包装材质", width: 80 },
            { prop: "bzczmc", label: "包装材质名称", width: 120 },
            { prop: "bzgg", label: "包装规格", width: 80 },
            { prop: "bzsl", label: "包装数量", width: 80 },
            { prop: "gnzz", label: "功能主治", width: 80 },
            { prop: "gytj", label: "给药途径", width: 80 },
            { prop: "sms", label: "说明书", width: 80 },
            { prop: "ksrq", label: "开始日期", width: 80 },
            { prop: "jsrq", label: "结束日期", width: 80 },
            { prop: "zxsydw", label: "最小使用单位", width: 120 },
            { prop: "zxxsdw", label: "最小销售单位", width: 120 },
            { prop: "zxjldw", label: "最小计量单位", width: 120 },
            { prop: "zxbzsl", label: "最小包装数量", width: 120 },
            { prop: "zxbzdw", label: "最小包装单位", width: 120 },
            { prop: "zxzjdw", label: "最小制剂单位", width: 120 },
            { prop: "zxbzdwmc", label: "最小包装单位名称", width: 160 },
            { prop: "zxzjdwmc", label: "最小制剂单位名称", width: 160 },
            { prop: "zhb", label: "转换比", width: 80 },
            { prop: "ypyxq", label: "药品有效期", width: 100 },
            { prop: "zxjjdw", label: "最小计价单位", width: 120 },
            { prop: "wbzjm", label: "五笔助记码", width: 100 },
            { prop: "pyzjm", label: "拼音助记码", width: 100 },
            { prop: "fbzcj", label: "分包装厂家", width: 100 },
            { prop: "scqybh", label: "生产企业编号", width: 120 },
            { prop: "tsxjypbz", label: "特殊限价药品标志", width: 160 },
            { prop: "tsypbz", label: "特殊药品标志", width: 120 },
            { prop: "ypzczh", label: "药品注册证号", width: 120 },
            { prop: "ypzczhksrq", label: "药品注册证号开始日期", width: 200 },
            { prop: "ypzczhjsrq", label: "药品注册证号结束日期", width: 200 },
            { prop: "pzwhksrq", label: "批准文号开始日期", width: 160 },
            { prop: "pzwhjsrq", label: "批准文号结束日期", width: 160 },
            { prop: "sczt", label: "市场状态", width: 80 },
            { prop: "scztmc", label: "市场状态名称", width: 120 },
            { prop: "ypzcpjdzda", label: "药品注册批件电子档案", width: 200 },
            {
              prop: "ypbcsqpjdzda",
              label: "药品补充申请批件电子档案",
              width: 240,
            },
            { prop: "gjybypmlbz", label: "国家医保药品目录备注", width: 200 },
            { prop: "jbywbzmc", label: "基本药物标志名称", width: 160 },
            {
              prop: "jbywbz",
              label: "基本药物标志",
              width: 120,
              code: "bas_medn_flag",
            },
            { prop: "zzsdzypbz", label: "增值税调整药品标志", width: 180 },
            { prop: "zzsdzypmc", label: "增值税调整药品名称", width: 180 },
            { prop: "ssypmljyp", label: "上市药品目录集药品", width: 180 },
            { prop: "ybtpypbz", label: "医保谈判药品标志", width: 160 },
            { prop: "ybtpypmc", label: "医保谈判药品名称", width: 160 },
            { prop: "wjwypbm", label: "卫健委药品编码", width: 140 },
            { prop: "bz", label: "备注", width: 80 },
            { prop: "yxbz", label: "有效标志", width: 80, code: "vali_flag" },
            { prop: "wyjlh", label: "唯一记录号", width: 100 },
            { prop: "sjcjsj", label: "数据创建时间", width: 120 },
            { prop: "sjgxsj", label: "数据更新时间", width: 120 },
            { prop: "bbh", label: "版本号", width: 80 },
            { prop: "bbmc", label: "版本名称", width: 80 },
            {
              prop: "etyy",
              label: "儿童用药",
              width: 80,
              code: "chld_medc_flag",
            },
            { prop: "gsmc", label: "公司名称", width: 80 },
            { prop: "fzyyzxpjyp", label: "仿制药一致性评价药品", width: 200 },
            { prop: "jxqy", label: "经销企业", width: 80 },
            { prop: "jxqylxr", label: "经销企业联系人", width: 140 },
            {
              prop: "jxqysqsdzda",
              label: "经销企业授权书电子档案",
              width: 220,
            },
            { prop: "gjybypmljx", label: "国家医保药品目录剂型", width: 200 },
          ];
          break;
        case 103:
          this.tableHeaderRight = [
            { prop: "ylmlbm", label: "医疗目录编码", width: 220 },
            { prop: "dwymc", label: "单味药名称", width: 200 },
            { prop: "dffbz", label: "单复方标志", width: 100 },
            { prop: "zldj", label: "质量等级", width: 80 },
            { prop: "zcynf", label: "中草药年份", width: 100 },
            { prop: "yybw", label: "药用部位", width: 200 },
            { prop: "aqjl", label: "安全计量", width: 80 },
            { prop: "cgyf", label: "常规用法", width: 200 },
            { prop: "xw", label: "性味", width: 200 },
            { prop: "gj", label: "归经", width: 80 },
            { prop: "pz", label: "品种", width: 80 },
            { prop: "ksrq", label: "开始日期", width: 80 },
            { prop: "jsrq", label: "结束日期", width: 80 },
            { prop: "yxbz", label: "有效标志", width: 80, code: "vali_flag" },
            { prop: "wyjlh", label: "唯一记录号", width: 100 },
            { prop: "sjcjsj", label: "数据创建时间", width: 160 },
            { prop: "sjgxsj", label: "数据更新时间", width: 160 },
            { prop: "bbh", label: "版本号", width: 80 },
            { prop: "bbmc", label: "版本名称", width: 200 },
            { prop: "ycmc", label: "药材名称", width: 160 },
            { prop: "gnzz", label: "功能主治", width: 350 },
            { prop: "pzff", label: "炮制方法", width: 350 },
            { prop: "gxfl", label: "功效分类", width: 80 },
            { prop: "yczly", label: "药材种来源", width: 160 },
            { prop: "gjybzfzc", label: "国家医保支付政策", width: 160 },
            { prop: "sjybzfzc", label: "省级医保支付政策", width: 160 },
            { prop: "bzmc", label: "标准名称", width: 200 },
            { prop: "bzym", label: "标准页码", width: 80 },
            { prop: "bzdzda", label: "标准电子档案", width: 350 },
          ];
          break;
        case 104:
          this.tableHeaderRight = [
            { prop: "ylmlbm", label: "医疗目录编码", width: 220 },
            { prop: "ypspm", label: "药品商品名", width: 200 },
            { prop: "bm", label: "别名", width: 80 },
            { prop: "ywmc", label: "英文名称", width: 80 },
            { prop: "jx", label: "剂型", width: 80 },
            { prop: "jxmc", label: "剂型名称", width: 80 },
            { prop: "zcjx", label: "注册剂型", width: 80 },
            { prop: "cf", label: "成分", width: 80 },
            { prop: "gnzz", label: "功能主治", width: 80 },
            { prop: "xz", label: "性状", width: 80 },
            { prop: "ypgg", label: "药品规格", width: 80 },
            { prop: "ypggdm", label: "药品规格代码", width: 120 },
            { prop: "zcgg", label: "注册规格", width: 80 },
            { prop: "zcggdm", label: "注册规格代码", width: 120 },
            { prop: "gytj", label: "给药途径", width: 80 },
            { prop: "zc", label: "贮藏", width: 80 },
            { prop: "sypc", label: "使用频次", width: 80 },
            { prop: "mcyl", label: "每次用量", width: 200 },
            // { prop: "yplb", label: "药品类别", width: 80 },
            // { prop: "yplbmc", label: "药品类别名称", width: 120 },
            { prop: "fcfybz", label: "非处方药标志", width: 120 },
            { prop: "fcfybzmc", label: "非处方药标志名称", width: 160 },
            { prop: "bzcz", label: "包装材质", width: 200 },
            { prop: "bzczmc", label: "包装材质名称", width: 120 },
            { prop: "bzgg", label: "包装规格", width: 80 },
            { prop: "sms", label: "说明书", width: 250 },
            { prop: "bzsl", label: "包装数量", width: 80 },
            { prop: "zxsydw", label: "最小使用单位", width: 120 },
            { prop: "zxxsdw", label: "最小销售单位", width: 120 },
            { prop: "zxjldw", label: "最小计量单位", width: 120 },
            { prop: "zxbzsl", label: "最小包装数量", width: 120 },
            { prop: "zxbzdw", label: "最小包装单位", width: 120 },
            { prop: "zxzjdw", label: "最小制剂单位", width: 120 },
            { prop: "zxzjdwmc", label: "最小制剂单位名称", width: 160 },
            { prop: "ypyxq", label: "药品有效期", width: 100 },
            { prop: "zxjjdw", label: "最小计价单位", width: 120 },
            { prop: "blfy", label: "不良反应", width: 80 },
            { prop: "zysx", label: "注意事项", width: 80 },
            { prop: "jj", label: "禁忌", width: 80 },
            { prop: "scqybh", label: "生产企业编号", width: 120 },
            { prop: "scqymc", label: "生产企业名称", width: 120 },
            { prop: "scqydz", label: "生产企业地址", width: 120 },
            { prop: "tsxjypbz", label: "特殊限价药品标志", width: 160 },
            { prop: "pzwh", label: "批准文号", width: 150 },
            { prop: "pzwhksrq", label: "批准文号开始日期", width: 160 },
            { prop: "pzwhjsrq", label: "批准文号结束日期", width: 160 },
            { prop: "ypzczh", label: "药品注册证号", width: 120 },
            { prop: "ypzczhksrq", label: "药品注册证号开始日期", width: 200 },
            { prop: "ypzczhjsrq", label: "药品注册证号结束日期", width: 200 },
            { prop: "zhb", label: "转换比", width: 80 },
            { prop: "xzsyfw", label: "限制使用范围", width: 120 },
            { prop: "zxbzdwmc", label: "最小包装单位名称", width: 160 },
            { prop: "zcmc", label: "注册名称", width: 80 },
            { prop: "fbzcj", label: "分包装厂家", width: 100 },
            { prop: "sczt", label: "市场状态", width: 80 },
            { prop: "ypzcpjdzda", label: "药品注册批件电子档案", width: 200 },
            {
              prop: "ypbcsqpjdzda",
              label: "药品补充申请批件电子档案",
              width: 240,
            },
            { prop: "gjybypmlbh", label: "国家医保药品目录编号", width: 200 },
            { prop: "gjybypmlbz", label: "国家医保药品目录备注", width: 200 },
            { prop: "zzsdzypbz", label: "增值税调整药品标志", width: 180 },
            { prop: "zzsdzypmc", label: "增值税调整药品名称", width: 180 },
            { prop: "ssypmljyp", label: "上市药品目录集药品", width: 180 },
            { prop: "wjwypbm", label: "卫健委药品编码", width: 140 },
            { prop: "bz", label: "备注", width: 80 },
            { prop: "yxbz", label: "有效标志", width: 80, code: "vali_flag" },
            { prop: "kssj", label: "开始时间", width: 80 },
            { prop: "jssj", label: "结束时间", width: 80 },
            { prop: "wyjlh", label: "唯一记录号", width: 100 },
            { prop: "sjcjsj", label: "数据创建时间", width: 120 },
            { prop: "sjgxsj", label: "数据更新时间", width: 120 },
            { prop: "bbh", label: "版本号", width: 80 },
            { prop: "bbmc", label: "版本名称", width: 80 },
            { prop: "zzjxkzh", label: "自制剂许可证号", width: 140 },
            { prop: "etyy", label: "儿童用药", width: 80 },
            { prop: "lnhzyy", label: "老年患者用药", width: 120 },
            { prop: "yljglxrxm", label: "医疗机构联系人姓名", width: 180 },
            { prop: "yljglxrdh", label: "医疗机构联系人电话", width: 180 },
            { prop: "zzjxkzdzda", label: "自制剂许可证电子档案", width: 200 },
          ];
          break;
        case 105:
          this.tableHeaderRight = [
            { prop: "ylmlbm", label: "医疗目录编码", width: 220 },
            { prop: "ypspm", label: "药品商品名", width: 200 },
            { prop: "tymbh", label: "通用名编号", width: 100 },
            { prop: "yptym", label: "药品通用名", width: 100 },
            { prop: "mzyzl", label: "民族药种类", width: 100 },
            { prop: "hxmc", label: "化学名称", width: 80 },
            { prop: "bm", label: "别名", width: 80 },
            { prop: "ywmc", label: "英文名称", width: 80 },
            { prop: "jx", label: "剂型", width: 80 },
            { prop: "mcyl", label: "每次用量", width: 80 },
            { prop: "sypc", label: "使用频次", width: 80 },
            { prop: "gjypbh", label: "国家药品编号", width: 120 },
            { prop: "yf", label: "用法", width: 80 },
            { prop: "cf", label: "成分", width: 80 },
            { prop: "xz", label: "性状", width: 80 },
            { prop: "blfy", label: "不良反应", width: 80 },
            { prop: "jj", label: "禁忌", width: 80 },
            { prop: "zysx", label: "注意事项", width: 80 },
            { prop: "zc", label: "贮藏", width: 80 },
            { prop: "ypgg", label: "药品规格", width: 80 },
            { prop: "jjdwlx", label: "计价单位类型", width: 120 },
            { prop: "fcfybz", label: "非处方药标志", width: 120 },
            { prop: "bzcz", label: "包装材质", width: 80 },
            { prop: "bzgg", label: "包装规格", width: 80 },
            { prop: "zxsydw", label: "最小使用单位", width: 120 },
            { prop: "zxxsdw", label: "最小销售单位", width: 120 },
            { prop: "sms", label: "说明书", width: 80 },
            { prop: "gytj", label: "给药途径", width: 80 },
            { prop: "ksrq", label: "开始日期", width: 80 },
            { prop: "jsrq", label: "结束日期", width: 80 },
            { prop: "ylfl", label: "药理分类", width: 80 },
            { prop: "bz", label: "备注", width: 80 },
            { prop: "bzsl", label: "包装数量", width: 80 },
            { prop: "zxjldw", label: "最小计量单位", width: 120 },
            { prop: "zxbzsl", label: "最小包装数量", width: 120 },
            { prop: "zxbzdw", label: "最小包装单位", width: 120 },
            { prop: "zxzjdw", label: "最小制剂单位", width: 120 },
            { prop: "ypyxq", label: "药品有效期", width: 100 },
            { prop: "gnzz", label: "功能主治", width: 80 },
            { prop: "zxjjdw", label: "最小计价单位", width: 120 },
            { prop: "wbzjm", label: "五笔助记码", width: 100 },
            { prop: "pyzjm", label: "拼音助记码", width: 100 },
            { prop: "yxbz", label: "有效标志", width: 80, code: "vali_flag" },
            { prop: "wyjlh", label: "唯一记录号", width: 100 },
            { prop: "sjcjsj", label: "数据创建时间", width: 120 },
            { prop: "sjgxsj", label: "数据更新时间", width: 120 },
            { prop: "cjr", label: "创建人", width: 80 },
            { prop: "cjrxm", label: "创建人姓名", width: 100 },
            { prop: "cjjbjg", label: "创建经办机构", width: 120 },
            { prop: "jbr", label: "经办人", width: 80 },
            { prop: "jbrxm", label: "经办人姓名", width: 100 },
            { prop: "jbsj", label: "经办时间", width: 80 },
            { prop: "jbjg", label: "经办机构", width: 80 },
            { prop: "bbh", label: "版本号", width: 80 },
          ];
          break;
        case 201:
          this.tableHeaderRight = [
            { prop: "ylmlbm", label: "医疗目录编码", width: 220 },
            { prop: "ylfwxmmc", label: "医疗服务项目名称", width: 300 },
            { prop: "jjdw", label: "计价单位", width: 80 },
            { prop: "jjdwmc", label: "计价单位名称", width: 120 },
            { prop: "zlxmsm", label: "诊疗项目说明", width: 120 },
            { prop: "zlcwnr", label: "诊疗除外内容", width: 120 },
            { prop: "zlxmnh", label: "诊疗项目内涵", width: 120 },
            { prop: "yxbz", label: "有效标志", width: 80, code: "vali_flag" },
            { prop: "bz", label: "备注", width: 80 },
            { prop: "fwxmlb", label: "服务项目类别", width: 120 },
            { prop: "xmsm", label: "项目说明", width: 80 },
            { prop: "ksrq", label: "开始日期", width: 150 },
            { prop: "jsrq", label: "结束日期", width: 150 },
            { prop: "wyjlh", label: "唯一记录号", width: 100 },
            { prop: "bbh", label: "版本号", width: 80 },
            { prop: "bbmc", label: "版本名称", width: 80 },
          ];
          break;
        case 301:
          this.tableHeaderRight = [
            { prop: "ylmlbm", label: "医疗目录编码", width: 220 },
            { prop: "hcmc", label: "耗材名称", width: 200 },
            { prop: "scqymc", label: "生产企业名称", width: 200 },
            { prop: "zcbah", label: "注册备案号", width: 120 },
            { prop: "ybzfsx", label: "医保支付上限", width: 120 },
            { prop: "ylqxwybsm", label: "医疗器械唯一标识码", width: 180 },
            { prop: "ybtymdm", label: "医保通用名代码", width: 140 },
            { prop: "ybtym", label: "医保通用名", width: 100 },
            { prop: "cpxh", label: "产品型号", width: 80 },
            { prop: "ggdm", label: "规格代码", width: 80 },
            { prop: "gg", label: "规格", width: 150 },
            { prop: "hcfl", label: "耗材分类", width: 380 },
            { prop: "ggxh", label: "规格型号", width: 80 },
            { prop: "czdm", label: "材质代码", width: 80 },
            { prop: "hccz", label: "耗材材质", width: 150 },
            { prop: "bzgg", label: "包装规格", width: 80 },
            { prop: "bzsl", label: "包装数量", width: 80 },
            { prop: "cpbzcz", label: "产品包装材质", width: 120 },
            { prop: "bzdw", label: "包装单位", width: 80 },
            { prop: "cpzhb", label: "产品转换比", width: 100 },
            { prop: "zxsydw", label: "最小使用单位", width: 120 },
            { prop: "scdlb", label: "生产地类别", width: 100 },
            { prop: "scdlbmc", label: "生产地类别名称", width: 140 },
            { prop: "cpbz", label: "产品标准", width: 80 },
            { prop: "cpyxq", label: "产品有效期", width: 100 },
            { prop: "xnjgyzc", label: "性能结构与组成", width: 140 },
            { prop: "syfw", label: "适用范围", width: 80 },
            { prop: "cpsyff", label: "产品使用方法", width: 120 },
            { prop: "cptpbh", label: "产品图片编号", width: 120 },
            { prop: "cpzlbz", label: "产品质量标准", width: 120 },
            { prop: "sms", label: "说明书", width: 80 },
            { prop: "qtzmcl", label: "其他证明材料", width: 120 },
            { prop: "zjzybz", label: "专机专用标志", width: 120 },
            { prop: "zjmc", label: "专机名称", width: 80 },
            { prop: "ztmc", label: "组套名称", width: 80 },
            { prop: "jtbz", label: "机套标志", width: 80 },
            {
              prop: "xzsybz",
              label: "限制使用标志",
              width: 120,
              code: "lmt_used_flag",
            },
            { prop: "ybxyfw", label: "医保限用范围", width: 120 },
            { prop: "zxxsdw", label: "最小销售单位", width: 120 },
            { prop: "gzhcbz", label: "高值耗材标志", width: 120 },
            { prop: "yyclfldm", label: "医用材料分类代码", width: 160 },
            {
              prop: "zrclhrtqgbz",
              label: "植入材料和人体器官标志",
              width: 220,
            },
            { prop: "mjbz", label: "灭菌标志", width: 80 },
            { prop: "mjbzmc", label: "灭菌标志名称", width: 120 },
            { prop: "zrhjrlbz", label: "植入或介入类标志", width: 160 },
            { prop: "zrhjrlmc", label: "植入或介入类名称", width: 160 },
            { prop: "ycxsybz", label: "一次性使用标志", width: 140 },
            { prop: "ycxsybzmc", label: "一次性使用标志名称", width: 180 },
            { prop: "zcbarmc", label: "注册备案人名称", width: 140 },
            { prop: "ksrq", label: "开始日期", width: 140 },
            { prop: "jsrq", label: "结束日期", width: 140 },
            { prop: "ylqxgllb", label: "医疗器械管理类别", width: 160 },
            { prop: "ylqxgllbmc", label: "医疗器械管理类别名称", width: 200 },
            { prop: "zcbacpmc", label: "注册备案产品名称", width: 160 },
            { prop: "jgjzc", label: "结构及组成", width: 100 },
            { prop: "qtnr", label: "其他内容", width: 80 },
            { prop: "pzrq", label: "批准日期", width: 140 },
            { prop: "zcbarzs", label: "注册备案人住所", width: 140 },
            { prop: "zczyxqkssj", label: "注册证有效期开始时间", width: 200 },
            { prop: "zczyxqjssj", label: "注册证有效期结束时间", width: 200 },
            { prop: "scqybh", label: "生产企业编号", width: 120 },
            { prop: "scdz", label: "生产地址", width: 80 },
            { prop: "dlrqy", label: "代理人企业", width: 100 },
            { prop: "dlrqydz", label: "代理人企业地址", width: 140 },
            { prop: "scghdq", label: "生产国或地区", width: 120 },
            { prop: "shfwjg", label: "售后服务机构", width: 120 },
            { prop: "zchbazdzda", label: "注册或备案证电子档案", width: 200 },
            { prop: "cpyx", label: "产品影像", width: 80 },
            { prop: "yxbz", label: "有效标志", width: 80, code: "vali_flag" },
            { prop: "wyjlh", label: "唯一记录号", width: 300 },
            { prop: "bbh", label: "版本号", width: 80 },
            { prop: "bbmc", label: "版本名称", width: 300 },
          ];
          break;
        default:
          break;
      }
      this.$nextTick(() => {
        this.$refs.rightTable.doLayout();
      });
    },
    handleCurrentChangeRight(val) {
      this.currentRowRight = val;
    },
    changeSizeRight(val) {
      this.pageParamsRight.pageSize = val;
      if (this.medicareType === "02") {
        this.loadTableRightNew();
        return;
      }
      this.loadTableRight();
    },
    changePageRight(val) {
      this.pageParamsRight.pageNo = val;
      if (this.medicareType === "02") {
        this.loadTableRightNew();
        return;
      }
      this.loadTableRight();
    },
    // 对照结果查询
    loadTableBottom(obj) {
      this.tableDataBottom = [];
      this.currentRowBottom = null;
      this.$refs.bottomTable.setCurrentRow();
      if (this.currentRow === null) {
        this.$message.warning("请选择医院项目信息!");
        return;
      }
      const params = {
        medicareType: this.medicareType,
        hosItemCode: this.currentRow.hosItemCode,
      };
      this.loadingBottom = true;
      getPageItemMatchDTOList(params)
        .then((res) => {
          if (
            res.code === 1 &&
            res.data &&
            res.data.hasOwnProperty("matchId")
          ) {
            // this.tableDataBottom = this.tableDataBottom.concat(res.data);
            this.tableDataBottom = [res.data];
            this.currentRowBottom = res.data;
            this.$refs.bottomTable.setCurrentRow(res.data);
          }
          this.loadingBottom = false;
        })
        .catch((err) => {
          this.loadingBottom = false;
        });
    },
    handleCurrentChangeBottom(val) {
      this.currentRowBottom = val;
    },
    // 对照确认
    match(obj) {
      if (this.currentRow === null) {
        this.$message.warning("请选择医院项目信息!");
        return;
      }
      if (obj === null) {
        this.$message.warning("请选择医保项目目录!");
        return;
      }
      let params = {
        medicareType: this.medicareType,
        hosItemId: this.currentRow.hosItemId,
        hosItemCode: this.currentRow.hosItemCode,
        hosItemName: this.currentRow.hosItemName,
        hisItemType: this.leftSearchParams.itemType,
        hosItemType: this.leftSearchParams.itemType,
        siItemId:
          obj.drugDirectoryId ||
          obj.diagnosisDirectoryId ||
          obj.materialDirectoryId,
      };
      if (this.medicareType == "01") {
        params = {
          ...params,
          siItemType: obj.ake003 || "",
          siItemCode: obj.ake001 || "",
          siItemName: obj.ake002 || "",
        };
      } else if (this.medicareType == "02") {
        let siItemCode = obj.ylmlbm;
        let siItemName = "";
        switch (this.rightSearchParams.itemType) {
          case 101:
            siItemName = obj.ypspm;
            break;
          case 102:
            siItemName = obj.ypspm;
            break;
          case 103:
            siItemName = obj.dwymc;
            break;
          case 104:
            siItemName = obj.ypspm;
            break;
          case 105:
            siItemName = obj.ypspm;
            break;
          case 201:
            siItemName = obj.ylfwxmmc;
            break;
          case 301:
            siItemName = obj.hcmc;
            break;
          default:
            break;
        }
        params = {
          ...params,
          siItemType: this.rightSearchParams.itemType || "",
          siItemCode,
          siItemName,
        };
      }

      if (!params) {
        return;
      }
      getMatchItem(params)
        .then((res) => {
          if (res.code === 1) {
            this.loadTableBottom({
              ...params,
            });
            this.$message.success(res.msg || "对照成功!");
          } else {
            this.$message.error(res.msg || "对照失败!");
          }
        })
        .catch((err) => {
          // if(err.data.code == 1010){
          //    this.loadTableBottom({
          //      ...params
          //    });
          // }
          this.$message.error(err.msg);
        });
    },
    // 对照取消
    cancelMatch() {
      if (this.currentRowBottom === null || !this.currentRowBottom.matchId) {
        this.$message.warning("请选择要取消的对照结果!");
        return;
      }
      cancelMatchById({
        medicareType: this.medicareType,
        matchId: this.currentRowBottom.matchId,
      })
        .then((res) => {
          if (res.code === 1) {
            this.loadTableBottom({});
            // 遍历源数据
            // let that = this;
            // that.tableDataBottom.forEach(function(itemI, indexI) {
            //   // 如果选中数据跟元数据某一条标识相等，删除对应的源数据
            //   if (that.currentRowBottom.matchId === itemI.matchId) {
            //     that.tableDataBottom.splice(indexI, 1);
            //   }
            // });
            // 清除选中状态
            // that.$refs.bottomTable.clearSelection();
            this.$message.success(res.msg || "取消对照成功!");
          } else {
            this.$message.error(res.msg || "取消对照失败!");
          }
        })
        .catch((err) => {
          // this.$message.error(err.msg || "取消对照失败!");
        });
    },
    headerDragend() {
      // this.$refs.leftTable.doLayout();
    },
    headerDragendRight(col) {
      // this.$refs.rightTable.doLayout();
      // console.log("column", col);
    },
    headerDragendBottom() {
      // this.$refs.bottomTable.doLayout();
    },
    // 切换最上方查询条件时，清空表格数据
    clearTableData() {
      this.pageParams = this.$options.data().pageParams;
      this.pageParamsRight = this.$options.data().pageParamsRight;
      this.tableData = [];
      this.tableDataRight = [];
    },
  },
};
</script>

<style lang="scss" scoped>
.el-table {
  .el-table__fixed {
    height: auto !important; // 此处的important表示优先于element.style
    bottom: 17px; // 改为自动高度后，设置与父容器的底部距离，则高度会动态改变
  }
}

.wrapper {
  overflow: hidden;
}
.main {
  width: 100%;
  height: 100%;
  padding: 10px;
  background-color: $l-color-white;
}
.top-seatch {
  line-height: 34px;
}

.top-search-item {
  display: inline-block;
  width: 200px;
  vertical-align: top;
  margin-right: 10px;
}

.center {
  height: calc(100% - 251px);
  overflow: hidden;
}

.center-item {
  width: calc(100% - 10px);
  height: 100%;
}
.center-item.right {
  margin-left: 10px;
}

.left-table {
  height: calc(100% - 128px);
  margin: 10px 0;
}

.right-table {
  height: calc(100% - 128px);
  margin: 10px 0;
}

.contrast {
  padding: 10px 0;
}

.align-right {
  text-align: right;
}

.page {
  .el-pagination {
    padding: 0;
    /deep/ .el-pagination__editor.el-input .el-input__inner {
      height: 100% !important;
    }
    /deep/ .el-pager .number {
      width: auto;
    }
    /deep/ .el-pagination__editor.el-input {
      width: auto;
    }
  }
}
.card-title {
  height: 40px;
  line-height: 40px;
  /deep/ .titleleft::before {
    margin-top: 10px;
  }
}
.contrast-table {
  height: 210px;
}
/deep/.directoryComparison .cardtitle .titleleft {
  text-align: left;
}
</style>
