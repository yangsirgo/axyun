<template>
  <el-card class="card">
    <el-tabs v-model="activeName" class="main-tabs" @tab-click="handleClick">
      <el-tab-pane label="未审核" name="first">
        <div
          style="height: 100%; display: flex !important; flex-direction: column"
        >
          <div class="top-search" :key="activeName">
            <!-- <el-row :gutter="10">
            <el-col :span="6" v-if="separate">
              <l-read-card class="read-card" @readCard="getReadCard1"></l-read-card>
            </el-col>
            <el-col :span="5">
              <LFormtTitle label="患者编号" :disabled="!separate">
                <el-input
                  v-model="searchData.patientCode"
                  :disabled="!separate"
                  placeholder="请输入"
                  clearable
                ></el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="4">
              <LFormtTitle label="患者姓名" :disabled="!separate">
                <el-input
                  v-model="searchData.patientName"
                  :disabled="!separate"
                  placeholder="请输入"
                  clearable
                ></el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="5">
              <LFormtTitle label="开单科室" disabled>
                <el-input v-model="searchData.ouptDeptName" disabled placeholder="请输入" clearable></el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="4">
              <LFormtTitle label="开单医生">
                <el-select
                  v-model="searchData.doctorId"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="姓名/拼音/五笔"
                  :remote-method="selectAllUser"
                  :loading="selLoading"
                  clearable
                >
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </LFormtTitle>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="9">
              <LFormtTitle label="收费时间">
                <el-date-picker
                  width="100%"
                  v-model="chargeDate"
                  type="daterange"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :default-time="['00:00:00','23:59:59']"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  clearable
                ></el-date-picker>
              </LFormtTitle>
            </el-col>
            <el-col :span="15">
              <el-button type="primary" class="float-right" @click="search">查询</el-button>
            </el-col>
            </el-row>-->
            <l-common-search rightAreaWidth="100">
              <template slot="leftCon">
                <div class="common-item">
                  <l-read-card
                    class="read-card"
                    @readCard="getReadCard1"
                    v-if="separate"
                  ></l-read-card>
                </div>
                <div class="common-item">
                  <LFormtTitle label="患者编号" :disabled="!separate">
                    <el-input
                      v-model="searchData.patientCode"
                      :disabled="!separate"
                      placeholder="请输入"
                      clearable
                    ></el-input>
                  </LFormtTitle>
                </div>
                <div class="common-item">
                  <LFormtTitle label="患者姓名" :disabled="!separate">
                    <el-input
                      v-model="searchData.patientName"
                      :disabled="!separate"
                      placeholder="请输入"
                      clearable
                    ></el-input>
                  </LFormtTitle>
                </div>
                <div class="common-item">
                  <LFormtTitle label="开单科室" disabled>
                    <el-input
                      v-model="searchData.ouptDeptName"
                      disabled
                      placeholder="请输入"
                      clearable
                    ></el-input>
                  </LFormtTitle>
                </div>
                <div class="common-item">
                  <LFormtTitle label="开单医生">
                    <el-select
                      v-model="searchData.doctorId"
                      filterable
                      remote
                      reserve-keyword
                      placeholder="姓名/拼音/五笔"
                      :remote-method="selectAllUser"
                      :loading="selLoading"
                      clearable
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </LFormtTitle>
                </div>
                <div class="common-item" style="width: 300px">
                  <LFormtTitle label="收费时间">
                    <el-date-picker
                      width="100%"
                      v-model="chargeDate"
                      type="daterange"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      :default-time="['00:00:00', '23:59:59']"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      clearable
                    ></el-date-picker>
                  </LFormtTitle>
                </div>
              </template>
              <template slot="rightCon">
                <el-button type="primary" class="float-right" @click="search"
                  >查询</el-button
                >
              </template>
            </l-common-search>
          </div>

          <div class="main">
            <div class="main-thead">
              <el-row class="over-txt align-center">
                <el-col :span="2">
                  <span title="患者姓名">患者姓名</span>
                </el-col>
                <el-col :span="5">
                  <span title="患者编号">患者编号</span>
                </el-col>
                <el-col :span="5">
                  <span title="收费时间">收费时间</span>
                </el-col>
                <el-col :span="4">
                  <span title="开单医生">开单医生</span>
                </el-col>
                <el-col :span="4">
                  <span title="开单科室">开单科室</span>
                </el-col>
                <el-col :span="4">
                  <span title="状态">状态</span>
                </el-col>
              </el-row>
            </div>
            <div class="main-body" v-loading="unloading">
              <p
                class="no-data align-center"
                v-show="uncheckedList.length === 0"
              >
                暂无数据
              </p>
              <l-collapse class="cols" v-model="activeNames">
                <l-collapse-item
                  v-for="(parentItem, index) in uncheckedList"
                  :name="index"
                  :key="index"
                >
                  <div class="width100" slot="title">
                    <el-row class="over-txt align-center">
                      <el-col :span="2">
                        <el-checkbox v-model="parentItem.checked">
                          <span :title="parentItem.patientName">{{
                            parentItem.patientName
                          }}</span>
                        </el-checkbox>
                      </el-col>
                      <el-col :span="5">
                        <span :title="parentItem.patientCode">{{
                          parentItem.patientCode
                        }}</span>
                      </el-col>
                      <el-col :span="5">
                        <span :title="parentItem.chargeTime">{{
                          parentItem.chargeTime
                        }}</span>
                      </el-col>
                      <el-col :span="4">
                        <span :title="parentItem.doctorName">{{
                          parentItem.doctorName
                        }}</span>
                      </el-col>
                      <el-col :span="4">
                        <span :title="parentItem.ouptDeptName">{{
                          parentItem.ouptDeptName
                        }}</span>
                      </el-col>
                      <el-col :span="4">
                        <span
                          v-codeTransform
                          code="RECHARGE_STATUS"
                          :val="parentItem.recordStatus"
                        ></span>
                      </el-col>
                    </el-row>
                  </div>
                  <div slot="content" class="margin-top-10">
                    <l-collapse v-model="orderActiveNames[index]">
                      <l-collapse-item
                        v-for="(
                          item, index2
                        ) in parentItem.outpRefundApplyOrderChargeDetailVOs"
                        :name="index2"
                        :key="index2"
                      >
                        <div class="width100" slot="title">
                          <el-row>
                            <el-col :span="orderSourceShow[item.orderSource] ? 8 : 16">
                              <div style="text-overflow: ellipsis;overflow-x: hidden;white-space: nowrap;" :title="item.orderName">{{ item.orderName }}</div>
                            </el-col>
                            <el-col
                              :span="6"
                              v-if="orderSourceShow[item.orderSource]"
                            >
                              {{ orderSourceShow[item.orderSource] || "" }}
                              <span>{{ item.orderBillNum }}</span>
                            </el-col>
                            <el-col :span="4"
                              >收费数量：{{ item.orderQuantity }}项</el-col
                            >
                            <el-col :span="4"
                              >总金额：{{
                                formatNumber(item.totalMoney)
                              }}元</el-col
                            >
                          </el-row>
                        </div>
                        <div slot="content">
                          <el-table
                            :data="item.refundApplyDetailNewPOs"
                            v-show="item.refundApplyDetailNewPOs.length > 0"
                            border
                            style="width: 100%"
                          >
                            <el-table-column
                              prop="chargeItemName"
                              label="项目名称"
                              header-align="center"
                              min-width="25%"
                            ></el-table-column>
                            <el-table-column
                              prop="spec"
                              label="规格"
                              header-align="center"
                              min-width="25%"
                            ></el-table-column>
                            <el-table-column
                              prop="chargePrice"
                              label="单价"
                              header-align="center"
                              align="right"
                              min-width="12.5%"
                            >
                              <template slot-scope="scope">{{
                                formatNumber(scope.row.chargePrice, 4)
                              }}</template>
                            </el-table-column>
                            <el-table-column
                              prop="chargeQuantity"
                              label="收费数量"
                              header-align="center"
                              align="right"
                              min-width="12.5%"
                            >
                              <template slot-scope="scope">
                                <span>
                                  {{ scope.row.chargeQuantity }}
                                  <span
                                    v-if="item.orderSource === '1'"
                                    :val="scope.row.chargeUnit"
                                    code="DrugUnit"
                                    v-codeTransform
                                  ></span>
                                  <span v-else>{{ scope.row.chargeUnit }}</span>
                                </span>
                              </template>
                            </el-table-column>
                            <el-table-column
                              prop="totalMoney"
                              label="总金额"
                              header-align="center"
                              align="right"
                              min-width="12.5%"
                            >
                              <template slot-scope="scope">{{
                                formatNumber(scope.row.totalMoney)
                              }}</template>
                            </el-table-column>
                            <el-table-column
                              prop="refundQuantity"
                              label="申请数量"
                              header-align="center"
                              align="right"
                              min-width="12.5%"
                            >
                              <template slot-scope="scope">
                                <span>
                                  {{ scope.row.refundQuantity }}
                                  <span
                                    v-if="item.orderSource === '1'"
                                    :val="scope.row.chargeUnit"
                                    code="DrugUnit"
                                    v-codeTransform
                                  ></span>
                                  <span v-else>{{ scope.row.chargeUnit }}</span>
                                </span>
                              </template>
                            </el-table-column>
                            <el-table-column
                              prop="address"
                              label="备注"
                              header-align="center"
                              min-width="12.5%"
                            ></el-table-column>
                          </el-table>
                        </div>
                      </l-collapse-item>
                    </l-collapse>
                  </div>
                </l-collapse-item>
              </l-collapse>
            </div>
            <div class="page">
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
            <div class="bottom">
              <el-button type="primary" @click="approval('1')">通过</el-button>
              <el-button type="primary" plain @click="approval('2')"
                >不通过</el-button
              >
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="已审核" name="second">
        <div class="top-search" :key="activeName">
          <l-common-search rightAreaWidth="100">
            <template slot="leftCon">
              <div class="common-item">
                <l-read-card
                  v-if="separate"
                  class="read-card"
                  @readCard="getReadCard2"
                ></l-read-card>
              </div>
              <div class="common-item">
                <LFormtTitle label="患者编号" :disabled="!separate">
                  <el-input
                    v-model="searchData2.patientCode"
                    :disabled="!separate"
                    placeholder="请输入"
                    clearable
                  ></el-input>
                </LFormtTitle>
              </div>
              <div class="common-item">
                <LFormtTitle label="患者姓名" :disabled="!separate">
                  <el-input
                    v-model="searchData2.patientName"
                    :disabled="!separate"
                    placeholder="请输入"
                    clearable
                  ></el-input>
                </LFormtTitle>
              </div>
              <div class="common-item">
                <LFormtTitle label="开单科室" disabled>
                  <el-input
                    v-model="searchData2.ouptDeptName"
                    disabled
                    placeholder="请输入"
                    clearable
                  ></el-input>
                </LFormtTitle>
              </div>
              <div class="common-item">
                <LFormtTitle label="开单医生">
                  <el-select
                    v-model="searchData2.doctorId"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="姓名/拼音/五笔"
                    :remote-method="selectAllUser2"
                    :loading="selLoading2"
                    clearable
                  >
                    <el-option
                      v-for="item in options2"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </LFormtTitle>
              </div>
              <div class="common-item" style="width: 300px">
                <LFormtTitle label="申请时间">
                  <el-date-picker
                    width="100%"
                    v-model="applyDate2"
                    type="datetimerange"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :default-time="['00:00:00', '23:59:59']"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    clearable
                  ></el-date-picker>
                </LFormtTitle>
              </div>
              <div class="common-item" style="width: 300px">
                <LFormtTitle label="收费时间">
                  <el-date-picker
                    width="100%"
                    v-model="chargeDate2"
                    type="daterange"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :default-time="['00:00:00', '23:59:59']"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    clearable
                  ></el-date-picker>
                </LFormtTitle>
              </div>
            </template>
            <template slot="rightCon">
              <el-button type="primary" class="float-right" @click="search2"
                >查询</el-button
              >
            </template>
          </l-common-search>
          <!-- <el-row :gutter="10">
            <el-col :span="6" v-if="separate">
              <l-read-card class="read-card" @readCard="getReadCard2"></l-read-card>
            </el-col>
            <el-col :span="5">
              <LFormtTitle label="患者编号" :disabled="!separate">
                <el-input
                  v-model="searchData2.patientCode"
                  :disabled="!separate"
                  placeholder="请输入"
                  clearable
                ></el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="4">
              <LFormtTitle label="患者姓名" :disabled="!separate">
                <el-input
                  v-model="searchData2.patientName"
                  :disabled="!separate"
                  placeholder="请输入"
                  clearable
                ></el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="5">
              <LFormtTitle label="开单科室" disabled>
                <el-input v-model="searchData2.ouptDeptName" disabled placeholder="请输入" clearable></el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="4">
              <LFormtTitle label="开单医生">
                <el-select
                  v-model="searchData2.doctorId"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="姓名/拼音/五笔"
                  :remote-method="selectAllUser2"
                  :loading="selLoading2"
                  clearable
                >
                  <el-option
                    v-for="item in options2"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </LFormtTitle>
            </el-col>
            <el-col></el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="9">
              <LFormtTitle label="申请时间">
                <el-date-picker
                  width="100%"
                  v-model="applyDate2"
                  type="datetimerange"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :default-time="['00:00:00','23:59:59']"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  clearable
                ></el-date-picker>
              </LFormtTitle>
            </el-col>
            <el-col :span="9">
              <LFormtTitle label="收费时间">
                <el-date-picker
                  width="100%"
                  v-model="chargeDate2"
                  type="daterange"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :default-time="['00:00:00','23:59:59']"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  clearable
                ></el-date-picker>
              </LFormtTitle>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" class="float-right" @click="search2">查询</el-button>
            </el-col>
          </el-row>-->
        </div>
        <div class="main right-main">
          <div class="main-thead">
            <div class="add-width over-txt add-width-head">
              <span style="width: 100px">状态</span>
              <span style="width: 110px">患者姓名</span>
              <span style="width: 190px">患者编号</span>
              <span style="width: 190px">收费时间</span>
              <span style="width: 110px">开单医生</span>
              <span style="width: 160px">开单科室</span>
              <span style="width: 110px">申请人</span>
              <span style="width: 190px">申请时间</span>
              <span style="width: 110px">审核人</span>
              <span style="width: 190px">审核时间</span>
            </div>
          </div>
          <div class="main-body right" v-loading="cloading">
            <p class="no-data align-center" v-show="checkedList.length === 0">
              暂无数据
            </p>
            <l-collapse class="cols" v-model="activeNames2">
              <l-collapse-item
                v-for="(parentItem, index) in checkedList"
                :name="index"
                :key="index"
              >
                <div class="height100" slot="title">
                  <div class="bg-width add-width over-txt">
                    <span
                      style="width: 100px"
                      v-codeTransform
                      code="RECHARGE_STATUS"
                      :val="parentItem.recordStatus"
                    ></span>
                    <span
                      style="width: 110px"
                      :title="parentItem.patientName"
                      >{{ parentItem.patientName }}</span
                    >
                    <span
                      style="width: 190px"
                      :title="parentItem.patientCode"
                      >{{ parentItem.patientCode }}</span
                    >
                    <span style="width: 190px" :title="parentItem.chargeTime">{{
                      parentItem.chargeTime
                    }}</span>
                    <span style="width: 110px" :title="parentItem.doctorName">{{
                      parentItem.doctorName
                    }}</span>
                    <span
                      style="width: 160px"
                      :title="parentItem.ouptDeptName"
                      >{{ parentItem.ouptDeptName }}</span
                    >
                    <span
                      style="width: 110px"
                      :title="parentItem.applyUserName"
                      >{{ parentItem.applyUserName }}</span
                    >
                    <span style="width: 190px" :title="parentItem.applyTime">{{
                      parentItem.applyTime
                    }}</span>
                    <span
                      style="width: 110px"
                      :title="parentItem.checkUserName"
                      >{{ parentItem.checkUserName }}</span
                    >
                    <span style="width: 190px" :title="parentItem.checkTime">{{
                      parentItem.checkTime
                    }}</span>
                  </div>
                </div>
                <div slot="content" class="margin-top-10">
                  <l-collapse v-model="orderActiveNames2[index]">
                    <l-collapse-item
                      v-for="(
                        item, index2
                      ) in parentItem.outpRefundApplyOrderChargeDetailVOs"
                      :name="index2"
                      :key="index2"
                    >
                      <div class="width100" slot="title">
                        <el-row>
                          <el-col :span="6">{{ item.orderName }}</el-col>
                          <el-col
                            :span="6"
                            v-if="orderSourceShow[item.orderSource]"
                          >
                            {{ orderSourceShow[item.orderSource] || "" }}
                            <span>{{ item.orderBillNum }}</span>
                          </el-col>
                          <el-col :span="4"
                            >收费数量：{{ item.orderQuantity }}项</el-col
                          >
                          <el-col :span="4"
                            >总金额：{{
                              formatNumber(item.totalMoney)
                            }}元</el-col
                          >
                        </el-row>
                      </div>
                      <div slot="content">
                        <el-table
                          :data="item.refundApplyDetailNewPOs"
                          v-show="item.refundApplyDetailNewPOs.length > 0"
                          border
                          style="width: 100%"
                        >
                          <el-table-column
                            prop="chargeItemName"
                            label="项目名称"
                            min-width="25%"
                          ></el-table-column>
                          <el-table-column
                            prop="spec"
                            label="规格"
                            min-width="25%"
                          ></el-table-column>
                          <el-table-column
                            prop="chargePrice"
                            label="单价"
                            align="right"
                            min-width="12.5%"
                          >
                            <template slot-scope="scope">{{
                              formatNumber(scope.row.chargePrice, 4)
                            }}</template>
                          </el-table-column>
                          <el-table-column
                            prop="chargeQuantity"
                            label="收费数量"
                            min-width="12.5%"
                          >
                            <template slot-scope="scope">
                              <span>
                                {{ scope.row.chargeQuantity }}
                                <span
                                  v-if="item.orderSource === '1'"
                                  :val="scope.row.chargeUnit"
                                  code="DrugUnit"
                                  v-codeTransform
                                ></span>
                                <span v-else>{{ scope.row.chargeUnit }}</span>
                              </span>
                            </template>
                          </el-table-column>
                          <el-table-column
                            prop="totalMoney"
                            label="总金额"
                            align="right"
                            min-width="12.5%"
                          >
                            <template slot-scope="scope">{{
                              formatNumber(scope.row.totalMoney)
                            }}</template>
                          </el-table-column>
                          <el-table-column
                            prop="refundQuantity"
                            label="申请数量"
                            min-width="12.5%"
                          >
                            <template slot-scope="scope">
                              <span>
                                {{ scope.row.refundQuantity }}
                                <span
                                  v-if="item.orderSource === '1'"
                                  :val="scope.row.chargeUnit"
                                  code="DrugUnit"
                                  v-codeTransform
                                ></span>
                                <span v-else>{{ scope.row.chargeUnit }}</span>
                              </span>
                            </template>
                          </el-table-column>
                          <el-table-column
                            prop="address"
                            label="备注"
                            min-width="12.5%"
                          ></el-table-column>
                        </el-table>
                      </div>
                    </l-collapse-item>
                  </l-collapse>
                </div>
              </l-collapse-item>
            </l-collapse>
          </div>
          <div class="page">
            <el-pagination
              background
              @size-change="changeSize2"
              @current-change="changePage2"
              :current-page="pageParams2.pageNo"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="pageParams2.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pageParams2.total"
            ></el-pagination>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import { mapGetters } from "vuex";
import service from "@/api/cis/refund/refund.js";
import baseApi from "@/api/financeManagement/inp.js";
import { getUserId, getPamars } from "@/utils/auth";
import base64 from "@/utils/base64";

export default {
  name: "mainCard",
  props: {
    // 是单独的页面还是嵌入的（嵌入的隐藏读卡，患者编号、患者姓名禁止输入），true：单独页面；false：嵌入
    separate: {
      type: Boolean,
      default: true
    },
    sendData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      // 医嘱来源返显
      orderSourceShow: {
        "1": "处方号：",
        "4": "电子申请单号："
      },
      activeName: "first",
      searchData: {
        doctorId: "",
        patientName: "",
        patientId: "",
        patientCode: "",
        ouptDeptName: ""
      },
      chargeDate: [],
      pageParams: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      activeNames: "",
      orderActiveNames: {},
      unloading: false,
      uncheckedList: [],
      searchData2: {
        doctorId: "",
        patientName: "",
        patientId: "",
        patientCode: "",
        ouptDeptName: "",
        ouptDeptId: ""
      },
      chargeDate2: [],
      applyDate2: [],
      pageParams2: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      activeNames2: "",
      orderActiveNames2: {},
      checkedList: [],
      cloading: false,
      selLoading: false,
      selLoading2: false,
      options: [],
      options2: []
    };
  },
  computed: {
    ...mapGetters("user", ["role", "name"])
  },
  watch: {
    role: {
      immediate: true,
      deep: true,
      handler(val) {
        console.info(val);
        // 获取当前登录人userId
        const uid = base64.decode(getUserId());
        const workType = base64.decode(JSON.parse(getPamars()).workType);
        if (workType == "1") {
          // this.searchData.doctorId = uid;
          // this.searchData2.doctorId = uid;
        }
        if (workType == "1" && val.deptName) {
          this.searchData.ouptDeptName = val.deptName;
          this.searchData.ouptDeptId = val.deptId;
          this.searchData2.ouptDeptName = val.deptName;
          this.searchData2.ouptDeptId = val.deptId;
        }
      }
    },
    name: {
      immediate: true,
      handler(val) {
        // 获取当前登陆人name，查询开单医生列表
        const uname = base64.decode(val);
        this.selectAllUser(uname);
        this.selectAllUser2(uname);
      }
    },
    sendData: {
      //深度监听，可监听到对象、数组的变化
      handler(n) {
        //数据变化 回调
        if (n.patientName) {
          this.searchData.patientName = n.patientName;
          this.searchData.patientCode = n.patientCode;
          this.searchData2.patientName = n.patientName;
          this.searchData2.patientCode = n.patientCode;
        } else {
          this.searchData.patientName = "";
          this.searchData.patientCode = "";
          this.searchData2.patientName = "";
          this.searchData2.patientCode = "";
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.search();
    this.search2();
  },
  methods: {
    // 金额格式化，千位分割，小数点2位
    formatNumber(a, num = 2) {
      if (!a) {
        return "0.0000";
      }
      let res = a
        .toFixed(num)
        .toString()
        .replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
          return $1 + ",";
        });
      return res;
    },
    // 查询用户
    async selectAllUser(val) {
      try {
        this.selLoading = true;
        let res = await baseApi.getAllUser({
          userName: val || ""
        });
        this.options = res.data;
        this.selLoading = false;
      } catch (error) {
        this.selLoading = false;
        this.$message.error(error.msg || "搜索用户失败");
      }
    },
    // 查询用户
    async selectAllUser2(val) {
      try {
        this.selLoading2 = true;
        let res = await baseApi.getAllUser({
          userName: val || ""
        });
        this.options2 = res.data;
        this.selLoading2 = false;
      } catch (error) {
        console.log(error);
        this.selLoading2 = false;
        this.$message.error(error.msg || "搜索用户失败");
      }
    },
    handleClick() {},
    // 获取读卡信息
    getReadCard1(data) {
      this.searchData.patientName = data.patientName;
      this.searchData.patientCode = data.patientCode;
      this.search();
    },
    // 获取读卡信息
    getReadCard2(data) {
      this.searchData2.patientName = data.patientName;
      this.searchData2.patientCode = data.patientCode;
      this.search2();
    },
    // 查询未审核
    search() {
      this.pageParams.pageNo = 1;
      this.activeNames = "";
      this.orderActiveNames = {};
      this.loadUncheckedData();
    },
    // 未审核
    loadUncheckedData() {
      let params = {
        ...this.searchData,
        ...this.pageParams,
        checkFlag: "0",
        chargeStartDate: this.chargeDate && this.chargeDate[0],
        chargeStopDate: this.chargeDate && this.chargeDate[1]
      };
      this.unloading = true;
      service
        .getApplyListByPage(params)
        .then(res => {
          if (res.code === 1) {
            this.pageParams.total = res.pageParams.total;
            this.uncheckedList = res.data.map(item => {
              return {
                ...item,
                checked: false
              };
            });
          }
          this.unloading = false;
        })
        .catch(err => {
          this.unloading = false;
        });
    },
    changePage(obj) {
      this.pageParams.pageNo = obj;
      this.loadUncheckedData();
    },
    changeSize(obj) {
      this.pageParams.pageSize = obj;
      this.loadUncheckedData();
    },
    approval(type) {
      const list = [];
      this.uncheckedList.forEach(item => {
        if (item.checked) {
          list.push({
            refundApplyId: item.refundApplyId,
            recordStatus: type
          });
        }
      });
      if (list.length === 0) {
        this.$message.warning("请选择要审核退费申请单!");
        return;
      }
      this.$showLoading();
      service
        .passRefundApply(list)
        .then(res => {
          this.$hideLoading();
          if (res.code === 1) {
            this.search();
            this.$message.success(res.msg || "审核成功!");
          } else {
            this.$message.error(res.msg || "审核失败!");
          }
        })
        .catch(err => {
          this.$hideLoading();
          this.$message.error(err.msg || "审核失败!");
        });
    },
    // 查询已审核
    search2() {
      this.pageParams2.pageNo = 1;
      this.activeNames2 = "";
      this.orderActiveNames2 = {};
      this.loadCheckedData();
    },
    // 已审核
    loadCheckedData() {
      let params = {
        ...this.searchData2,
        ...this.pageParams2,
        checkFlag: "1",
        chargeStartDate: this.chargeDate2 && this.chargeDate2[0],
        chargeStopDate: this.chargeDate2 && this.chargeDate2[1],
        applyStartDate: this.applyDate2 && this.applyDate2[0],
        applyStopDate: this.applyDate2 && this.applyDate2[1]
      };
      this.cloading = true;
      service
        .getApplyListByPage(params)
        .then(res => {
          if (res.code === 1) {
            this.pageParams2.total = res.pageParams.total;
            this.checkedList = res.data;
          }
          this.cloading = false;
        })
        .catch(err => {
          this.cloading = false;
        });
    },
    changePage2(obj) {
      this.pageParams2.pageNo = obj;
      this.loadCheckedData();
    },
    changeSize2(obj) {
      this.pageParams2.pageSize = obj;
      this.loadCheckedData();
    }
  }
};
</script>

<style lang="scss" scoped>
.card {
  padding: 10px 20px 0;
  height: 100%;

  .main-tabs {
    height: 100%;
    /deep/ .el-tabs__content {
      height: calc(100% - 28px);
      padding-top: 10px;
      overflow: auto;
    }
    .main-content {
      height: calc(100% - 50px);
      position: relative;
      .none-date {
        height: 20px;
        line-height: 20px;
        top: 0;
        bottom: 0;
        margin: auto;
        position: absolute;
        left: 0;
        right: 0;
        width: 120px;
        color: #909399;
      }
    }
  }

  /deep/ .headerCls {
    height: 30px;
    background: rgba(246, 246, 246, 1);
    font-size: 14px;

    font-weight: 400;
    color: rgba(46, 50, 58, 1);
    padding: 0;
  }

  /deep/ .rowStyleCls {
    height: 40px;
    font-size: 14px;

    font-weight: 400;
    color: rgba(46, 50, 58, 1);

    > td {
      padding: 0;
    }
  }
}
.table-wrapper {
  padding-top: 5px;
  padding-bottom: 20px;
}
.charge-bottom {
  padding: 20px;
  text-align: right;
  background: #fff;
  border-top: 1px solid $l-color-border-3;
  border-radius: 0 0 4px 4px;
}
.read-card {
  /deep/ .el-button {
    padding: 0;
  }
}
.mb {
  margin-bottom: 6px;
}
.main {
  // height: calc(100% - 70px);
  flex: 1;
  overflow: hidden;
  overflow-x: auto;
  .main-body {
    position: relative;
    height: calc(100% - 150px);
    margin-bottom: 10px;
    .cols {
      height: 100%;
      overflow: hidden;
      overflow-y: auto;

      /deep/ .collapse-transition {
        -webkit-transition: 0s height, 0s padding-top, 0s padding-bottom;
        transition: 0s height, 0s padding-top, 0s padding-bottom;
      }

      /deep/ .horizontal-collapse-transition {
        -webkit-transition: 0s width, 0s padding-left, 0s padding-right;
        transition: 0s width, 0s padding-left, 0s padding-right;
      }

      /deep/
        .horizontal-collapse-transition
        .el-submenu__title
        .el-submenu__icon-arrow {
        -webkit-transition: 0s;
        transition: 0s;
        opacity: 0;
      }
    }
    &.right {
      height: calc(100% - 105px);
    }
  }
}
.right-main {
  width: 1570px;
}
.main-thead {
  height: 40px;
  padding-left: 55px;
}
.align-center {
  text-align: center;
}
.main-thead {
  line-height: 34px;
  font-size: $l-font-size;
}
.no-data {
  position: absolute;
  text-align: center;
  width: 100%;
  line-height: 34px;
}
.page {
  text-align: right;
  margin-bottom: 10px;
  .el-pagination {
    padding: 0;
    /deep/ .el-pagination__editor.el-input .el-input__inner {
      height: 100% !important;
    }
  }
}
.over-txt {
  .el-col {
    line-height: 40px;
    height: 40px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
.charge-top {
  line-height: 32px;
  font-size: 14px;
  padding: 5px 10px;
  background-color: $l-color-primary1;
  color: #fff;
  /deep/ .el-checkbox__inner {
    border-color: #fff;
  }
  /deep/ .el-checkbox__label {
    color: #fff;
  }
}
.bottom {
  padding: 0 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 63px;
  border-top: 1px solid #e4e4e4;
}
.margin-top-10 {
  margin-top: 10px;
}
.add-width {
  float: left;
  white-space: nowrap;
  height: 100%;
  span {
    display: inline-block;
    height: 100%;
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
.bg-width span {
  background-color: #f1f4f6;
}
.add-width-head {
  overflow: hidden;
  line-height: 40px;
}
.l-input-wrap {
  width: auto;
}
</style>
