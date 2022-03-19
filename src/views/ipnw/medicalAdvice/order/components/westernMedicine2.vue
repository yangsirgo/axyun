<template>
  <el-card class="rightMedicalOrder overflow-hidden height100">
    <div class="position-relative overflow-hidden" style=" height: 100%">
      <div>
        <div ref="SearchForm" class="search-box">
          <el-radio-group
            class="radio-group"
            v-model="searchForm.categoryCode"
            @change="radioChange"
          >
            <el-radio :label="1">{{ $t("cis.medicalOrder.long") }}</el-radio>
            <el-radio :label="2">{{ $t("cis.medicalOrder.short") }}</el-radio>
            <el-radio :label="3">
              {{
              $t("cis.medicalOrder.outWithMedicine")
              }}
            </el-radio>
          </el-radio-group>
          <el-date-picker
            class="datePicker"
            v-model="searchForm.dateRange"
            style="float: left; width: 230px;"
            type="daterange"
            prefix-icon="iconfont iconriqi"
            :start-placeholder="$t('cis.medicalOrder.startDate')"
            :end-placeholder="$t('cis.medicalOrder.endDate')"
            :default-time="['00:00:00', '23:59:59']"
          ></el-date-picker>
          <el-select class="select-item" v-model="searchForm.status" placeholder="请选择">
            <el-option label="全部" value>全部</el-option>
            <el-option label="暂存" value="0">暂存</el-option>
            <el-option label="已提交" value="1">已提交</el-option>
            <el-option label="已停止" value="4">已停止</el-option>
            <el-option label="已作废" value="5">已作废</el-option>
            <el-option label="审核驳回" value="9">审核驳回</el-option>
            <el-option label="未执行" value="13">未执行</el-option>
            <el-option label="执行中" value="14">执行中</el-option>
            <el-option label="执行完毕" value="15">执行完毕</el-option>
          </el-select>
          <el-select class="select-item" v-model="searchForm.deptType" placeholder="请选择">
            <el-option label="本科医嘱" value="1">本科医嘱</el-option>
            <el-option label="其他科室医嘱" value="2">其他科室医嘱</el-option>
          </el-select>
          <el-select class="select-item" v-model="searchForm.today" placeholder="请选择">
            <el-option label="全部" value>全部</el-option>
            <el-option label="今日" value="1">今日</el-option>
          </el-select>
          <!-- <el-select class="select-item" v-model="searchForm.adviceType" placeholder="请选择">
            <el-option label="全部类型" value="1">全部类型</el-option>
            <el-option label="医嘱单" value="2">医嘱单</el-option>
            <el-option label="护理记录" value="3">护理记录</el-option>
            <el-option label="耗材单" value="4">耗材单</el-option>
          </el-select>-->
          <el-input
            class="select-item"
            style="width: 193px;"
            placeholder="医嘱关键字"
            suffix-icon="el-icon-search"
            v-model="searchForm.name"
          ></el-input>
          <el-button
            style="margin-left: 10px;float: left;margin-top: 15px;"
            @click="searchAdv"
            type="primary"
          >{{ $t("cis.btn.check") }}</el-button>
        </div>
        <div ref="btnGroup" class="edit-btn-box">
          <!-- 新增 -->
          <span class="cursor-pointer" @click="add" v-hotKey="{ func: 'func_add1' }">
            <i class="iconfont iconxinzeng"></i>
            {{ $t("cis.btn.add") }}
          </span>
          <!-- 暂存 -->
          <span class="cursor-pointer" @click="temporarySave">
            <i class="iconfont iconzancun"></i>
            {{$t('cis.btn.shortSave')}}
          </span>
          <!-- 提交 -->
          <span class="cursor-pointer" @click="submitSave" v-hotKey="{ func: 'func_submit' }">
            <i class="iconfont icontijiao1"></i>
            {{ $t("cis.btn.submit") }}
          </span>
          <!-- 撤回 -->
          <span
            class="cursor-pointer chexiaoSpan"
            @click="adviceRecall"
            v-hotKey="{ func: 'func_cancel' }"
          >
            <i class="iconfont" style="text-align: right;margin-right: 5px">
              <svg
                style="width: 14px;vertical-align: -1px;height: 15px;text-align: right;"
                t="1573091979623"
                class="icon"
                viewBox="0 0 2389 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="20286"
                width="200"
                height="200"
              >
                <path
                  d="M409.6 409.6C620.088889 226.417778 893.155556 113.777778 1194.666667 113.777778c529.066667 0 976.213333 344.746667 1133.226666 821.475555L2059.377778 1024a910.449778 910.449778 0 0 0-864.711111-625.777778c-221.866667 0-424.391111 81.92-582.542223 213.902222L1024 1024H0V0l409.6 409.6z"
                  fill="#2E323A"
                  p-id="20287"
                />
              </svg>
            </i>
            撤回
          </span>
          <b class="line"></b>
          <span class="cursor-pointer" @click="adviceStop" v-hotKey="{ func: 'func_stop' }">
            <i class="iconfont icontingzhi"></i>
            停止
          </span>
          <!-- <span class="cursor-pointer" @click="adviceaAllStop" v-hotKey="{ func: 'func_all_stop' }">
            <i class="iconfont iconquanbutingzhi"></i>
            全部停止
          </span> -->
          <!-- 撤销 -->
          <span
            class="cursor-pointer chexiaoSpan"
            @click="adviceRescind"
            v-hotKey="{ func: 'func_cancel' }"
          >
            <i class="iconfont" style="text-align: right;margin-right: 5px">
              <svg
                style="width: 14px;vertical-align: -1px;height: 15px;text-align: right;"
                t="1573091979623"
                class="icon"
                viewBox="0 0 2389 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="20286"
                width="200"
                height="200"
              >
                <path
                  d="M409.6 409.6C620.088889 226.417778 893.155556 113.777778 1194.666667 113.777778c529.066667 0 976.213333 344.746667 1133.226666 821.475555L2059.377778 1024a910.449778 910.449778 0 0 0-864.711111-625.777778c-221.866667 0-424.391111 81.92-582.542223 213.902222L1024 1024H0V0l409.6 409.6z"
                  fill="#2E323A"
                  p-id="20287"
                />
              </svg>
            </i>
            撤销
          </span>
          <!-- 删除 -->
          <span class="cursor-pointer" @click="deleteHandler" v-hotKey="{ func: 'func_delete' }">
            <i class="iconfont iconshanchu"></i>
            {{ $t("cis.btn.del") }}
          </span>
          <b class="line"></b>
          <span
            class="cursor-pointer"
            @click="bunchingHandler"
            v-hotKey="{ func: 'func_grouping' }"
          >
            <i class="iconfont iconchengzu"></i>
            成组
          </span>
          <span
            class="cursor-pointer"
            @click="cancelBunching"
            v-hotKey="{ func: 'cancel_grouping' }"
          >
            <i class="iconfont iconquxiaochengzu"></i>
            取消成组
          </span>
          <b class="line"></b>
          <span
            v-show="showShort"
            class="cursor-pointer"
            @click="adviceGonna"
            v-hotKey="{ func: 'func_garton_short' }"
          >
            <i class="iconfont iconjiadun"></i>
            加顿
          </span>
          <span
            class="cursor-pointer"
            @click="adviceCopyLong"
            v-hotKey="{ func: 'func_copy_long' }"
          >
            <i class="iconfont iconfuzhidaochangqi"></i>
            复制到长期
          </span>
          <!-- <span
            v-show="showShort"
            class="cursor-pointer"
            @click="adviceGonna"
            v-hotKey="{ func: 'func_garton_short' }"
          >
            <i class="iconfont iconjiadun"></i>
            加顿到临时
          </span>
          <span
            v-show="showLeave"
            class="cursor-pointer"
            @click="adviceGonnaLeave"
            v-hotKey="{ func: 'func_garton_short' }"
          >
            <i class="iconfont iconjiadun"></i>
            加顿到出院带药
          </span>
          <span class="cursor-pointer" @click="adviceCancel" v-hotKey="{ func: 'func_obsolete' }">
            <i class="iconfont iconzuofei"></i>
            作废
          </span>
          <b class="line"></b> -->
          <span class="cursor-pointer" @click="print" v-hotKey="{ func: 'func_print' }">
            <i class="iconfont icondayin"></i>
            {{ $t("cis.btn.print") }}
          </span>
        </div>
      </div>
      <div
        class="position-absolute"
        :style="{
            top: tableTop + 'px',
            bottom: '0px',
            width: '100%',
            transition: 'all 0.5s'
        }"
        >
        <el-table
            :data="tableList"
            ref="multipleTable"
            stripe
            highlight-current-row
            @current-change="handleCurrentChange"
            @selection-change="handleSelectionChange"
            @select="selectRow"
            @row-click="selectItem"
            border
            v-loading="mainTableLoading"
            v-hotKey="{
            func: ['table_row', 'table_checkbox'],
            deClass: 'el-table__row',
            curClass: 'current-row'
            }"
            height="100%"
            style="width: 100%"
        >
            <!-- <el-table-column
            type="selection"
            width="45"
            ></el-table-column> -->
            <el-table-column width="45">
              <el-table-column type="selection" :selectable="isCheckDisabled" width="45"></el-table-column>
            </el-table-column>
            <el-table-column
            label="状态"
            show-overflow-tooltip
            min-width="80"
            >
            <template slot-scope="scope">
                <span v-if="scope.row.isNew">新增</span>
                <span v-else>{{ statusArr[scope.row.status] }}</span>
            </template>
            </el-table-column>
            <!-- <el-table-column
            label="日期"
            prop="beginTime"
            show-overflow-tooltip
            min-width="150"
            ></el-table-column> -->
            <el-table-column
            label="医嘱名称"
            
            min-width="220"
            >
            <template slot-scope="scope">
                <l-input-table
                v-if="scope.row.isNew"
                id="bottomFormInputTable"
                :popoverWidth="1200"
                valueKey="orderItemName"
                suffix-icon="el-icon-search"
                style="width:200px;text-align: center;"
                :tableData="selectDrop.selectOptions"
                :tableLoading="searchResLoading"
                @query="searchLike"
                @select="select"
                :tableParams="selectDrop.dropColumn"
                placeholder="请输入项目名称关键字"
                ></l-input-table>
                <div v-else>{{ scope.row.name }}</div>
            </template>
            </el-table-column>
            <el-table-column label="组" min-width="40">
            <template slot-scope="scope">
                <span :class="scope.row.groupNoCls"></span>
            </template>
            </el-table-column>
            <el-table-column
            label="规格"
            prop="spec"
            show-overflow-tooltip
            min-width="220"
            ></el-table-column>
            <el-table-column
            label="单次剂量"
            show-overflow-tooltip
            min-width="120"
            >
            <template slot-scope="scope">
                <div v-if="scope.row.isEditingNum">
                <el-input-number
                    style="width: 100%;"
                    v-model="scope.row.onceDosage"
                    controls-position="right"
                    min='-0.5'
                ></el-input-number>
                </div>
                <div v-else>{{ scope.row.onceDosage }}</div>
            </template>
            </el-table-column>
            <el-table-column
            label="剂量单位"
            prop="uses"
            show-overflow-tooltip
            min-width="150"
            >
                <template slot-scope="scope">
                    <div v-if="scope.row.isNew">
                        <l-value-domain
                          code="DrugDoseUnit"
                          
                          :value.sync="scope.row.basicDosageUnit"
                        />
                    </div>
                    <div v-else>
                        <span
                        :val="scope.row.basicDosageUnit"
                        code="DrugDoseUnit"
                        v-codeTransform
                        ></span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
            label="用法"
            prop="uses"
            show-overflow-tooltip
            min-width="150"
            >
              <template slot-scope="scope">
              <div v-if="scope.row.isEditingNum">
              <l-value-domain
              code="MedicationRouteCode"
              remoteShowKey="name"
              remoteValueKey="code"
              @change="handleUseWay(scope.row, arguments)"
              :value.sync="scope.row.uses"
              placeholder=""
              ></l-value-domain>
              <!-- <l-value-domain
                code="MedicationRouteCode"
                remoteShowKey="name"
                remoteValueKey="code"
                @change="handleUseWay"
                :value.sync="selectDrop.ruleForm.uses"
                placeholder="请选择"
              ></l-value-domain> -->
              </div>
              <div v-else>
                  <span
                  :val="scope.row.uses"
                  code="MedicationRouteCode"
                  v-codeTransform
                  ></span>
              </div>
              </template>
            </el-table-column>
            <el-table-column
            label="滴速"
            prop="dropRate"
            show-overflow-tooltip
            min-width="210"
            >
                <template slot-scope="scope">
                    
                    <el-input-number
                      class="ds-input"
                      size="medium"
                      :disabled="scope.row.showFlowRate||scope.row.isNew!=true"
                      v-model="scope.row.dropRate1"
                      step-strictly
                      :controls="false"
                      min='-0.5'
                    ></el-input-number>～
                    <el-input-number
                      class="ds-input"
                      size="medium"
                      :disabled="scope.row.showFlowRate||scope.row.isNew!=true"
                      v-model="scope.row.dropRate2"
                      step-strictly
                      :controls="false"
                      min='-0.5'
                    ></el-input-number>
                    <span class="ds-unit">滴/分</span>
                </template>
            </el-table-column>
            <el-table-column
            label="频次"
            show-overflow-tooltip
            min-width="150"
            >
              <template slot-scope="scope">
              <div v-if="scope.row.isEditingNum&&searchForm.categoryCode!=2">
                <l-value-domain
                code="dd"
                :disabled="isFrequencyDisabled"
                remoteUrl="/frequency/pageList"
                :value.sync="scope.row.frequency"
                placeholder=""
                @change="handleFreq(scope.row, arguments)"
                remoteShowKey="frequencyName"
                remoteValueKey="frequencyCode"
                clearable
                ></l-value-domain>
              </div>
              <div v-else>
                <span
                columns="FREQUENCY_NAME"
                :conditionMap="{ FREQUENCY_CODE: scope.row.frequency }"
                tableName="hrp_frequency"
                v-tableTransform
                ></span>
              </div>
              </template>
            </el-table-column>
            
            <el-table-column
            label="开始时间"
            prop="adviceTime"
            show-overflow-tooltip
            min-width="200"
            >
              <template slot-scope="scope">
              <div v-if="scope.row.isEditingNum">
              <el-date-picker
              v-model="scope.row.adviceTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder=""
              style="width:100%;"
              @change="adviceTimeChange(scope.row)"
              >
              </el-date-picker>
              </div>
              <div v-else>{{scope.row.adviceTime}}</div>
              </template>
            </el-table-column>
            <el-table-column
            label="首日次数"
            show-overflow-tooltip
            min-width="120"
            >
            <template slot-scope="scope">
                <div v-if="scope.row.isEditingNum">
                <el-input-number
                    style="width: 100%;"
                    v-model="scope.row.firstDayCount"
                    controls-position="right"
                    min='-0.5'
                ></el-input-number>
                </div>
                <div v-else>{{ scope.row.firstDayCount }}</div>
            </template>
            </el-table-column>
            <el-table-column
            label="用药天数"
            prop="useDays"
            show-overflow-tooltip
            min-width="150"
            >
              <template slot-scope="scope">
                  <div v-if="scope.row.isEditingNum">
                    <el-input-number
                        style="width: 100%;"
                        v-model="scope.row.useDays"
                        controls-position="right"
                        min='-0.5'
                    ></el-input-number>
                  </div>
                  <div v-else>{{ scope.row.useDays }}</div>
              </template>
            </el-table-column>
            <el-table-column
            label="单价"
            prop="price"
            show-overflow-tooltip
            min-width="100"
            ></el-table-column>
            <el-table-column
            label="数量"
            prop="basicDosage"
            show-overflow-tooltip
            min-width="120"
            >
              <template slot-scope="scope">
                  <div v-if="scope.row.isEditingNum">
                  <el-input-number
                      style="width: 100%;"
                      v-model="scope.row.basicDosage"
                      controls-position="right"
                      min='-0.5'
                  ></el-input-number>
                  </div>
                  <div v-else>{{ scope.row.basicDosage }}</div>
              </template>
            </el-table-column>
            <el-table-column
            label="数量单位"
            prop="uses"
            
            min-width="150"
            >
                <template slot-scope="scope">
                    <div v-if="scope.row.isEditingNum">
                        <l-value-domain
                          code="DrugDoseUnit"
                          
                          :value.sync="scope.row.basicDosageUnit"
                        />
                    </div>
                    <div v-else>
                        <span
                        :val="scope.row.basicDosageUnit"
                        code="DrugDoseUnit"
                        v-codeTransform
                        ></span>
                    </div>
                </template>
            </el-table-column>
            <!-- <el-table-column
            label="数量单位"
            prop="uses"
            
            min-width="150"
            >
                <template slot-scope="scope">
                    <div v-if="scope.row.isEditingNum">
                        <el-select
                          v-model="scope.row.basicDosageUnit"
                          placeholder="单位"
                          style="width: 66px; vertical-align: top"
                          @change="unitChange(value,scope.row)"
                        >
                          <el-option
                            v-for="item in selectDrop.unitOptions"
                            :label="item.label"
                            :key="item.value"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                    </div>
                    <div v-else>
                        <span
                        :val="scope.row.basicDosageUnit"
                        code="DrugDoseUnit"
                        v-codeTransform
                        ></span>
                    </div>
                </template>
            </el-table-column> -->
            <el-table-column
            label="嘱托"
            
            show-overflow-tooltip
            min-width="150">
            <template slot-scope="scope">
                <!-- <l-input-table
                v-if="scope.row.isNew"
                id="bottomFormInputTable"
                :popoverWidth="1200"
                valueKey="orderItemName"
                suffix-icon="el-icon-search"
                style="width:200px;text-align: center;"
                :tableData="selectDrop.selectOptions"
                :tableLoading="searchResLoading"
                @query="searchLike"
                @select="select"
                :tableParams="selectDrop.dropColumn"
                placeholder="请输入项目名称关键字"
                ></l-input-table> -->
                <el-input v-if="scope.row.isNew" v-model="scope.row.entrust"></el-input>
                <div v-else>{{ scope.row.entrust }}</div>
            </template>
            </el-table-column>
            
                <!--皮试-->
                <!-- <template v-else-if="item.prop === 'skinTest'">
                  <el-form-item label prop="skinTest" class="skinTest">
                  </el-form-item>
                </template> -->
            <el-table-column
            label="皮试"
            prop="skinTest"
            
            min-width="80"
            >
              <template slot-scope="scope">
                <el-checkbox
                  true-label='1'
                  false-label='0'
                  v-model="scope.row.skinTest"
                  @keyup.enter.native="scope.row.skinTest = !scope.row.skinTest"
                  @change="changeSkinTest"
                  :disabled="!scope.row.skinTestDisabled"
                ></el-checkbox>
              </template>
            </el-table-column>
            <!-- <el-table-column
            label="皮试备注"
            prop="skinTest"
            show-overflow-tooltip
            min-width="150"
            >
                <template slot-scope="scope">
                    <div v-if="scope.row.isEditingNum">
                        <l-value-domain
                        code="MedicationRouteCode"
                        remoteShowKey="name"
                        remoteValueKey="code"
                        :value.sync="scope.row.skinTest"
                        placeholder=""
                        ></l-value-domain>
                    </div>
                    <div v-else>
                        <span
                        :val="scope.row.skinTest"
                        code="MedicationRouteCode"
                        v-codeTransform
                        ></span>
                    </div>
                </template>
            </el-table-column> -->
            <el-table-column
            label="紧急"
            prop="isUrgent"
            show-overflow-tooltip
            min-width="80"
            >
              <template slot-scope="scope">
                <el-checkbox
                  true-label='1'
                  false-label='0'
                  v-model="scope.row.isUrgent"
                  @keyup.enter.native="scope.row.isUrgent = !scope.row.isUrgent"
                  @change="changeSkinTest"
                  :disabled="!scope.row.skinTestDisabled"
                ></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column
            label="执行科室"
            prop="execDeptName"
            show-overflow-tooltip
            min-width="150"
            ></el-table-column>
            <el-table-column
            label="自费"
            prop="isOneself"
            show-overflow-tooltip
            min-width="80"
            >
              <template slot-scope="scope">
                <el-checkbox
                  true-label='1'
                  false-label='0'
                  v-model="scope.row.isOneself"
                  @keyup.enter.native="scope.row.isOneself = !scope.row.isOneself"
                  @change="changeSkinTest"
                  :disabled="!scope.row.skinTestDisabled"
                ></el-checkbox>
              </template>
            </el-table-column>
            <!-- <el-table-column
            label="滴速"
            prop="dropRate"
            show-overflow-tooltip
            min-width="80"
            ></el-table-column>
            <el-table-column
            label="滴速单位"
            prop="dropRateUnit"
            show-overflow-tooltip
            min-width="100"
            ></el-table-column> -->
            <!-- <el-table-column
            label="备注"
            prop="remark"
            show-overflow-tooltip
            min-width="150"
            >
                <template slot-scope="scope">
                  
                  <el-input v-if="scope.row.isNew" v-model="scope.row.remark"></el-input>
                  <div v-else>{{ scope.row.remark }}</div>
                </template>
            </el-table-column> -->
            <el-table-column
            label="开嘱科室"
            prop="adv_depart"
            show-overflow-tooltip
            min-width="150"
            >
            <template slot-scope="scope">
                <span
                tableName="sys_org"
                :conditionMap="{
                    org_type: '_DEPT_',
                    id: scope.row.deptCode
                }"
                columns="org_nm"
                v-tableTransform
                ></span>
            </template>
            </el-table-column>
            <el-table-column
            label="开嘱人"
            prop="doctorName"
            show-overflow-tooltip
            min-width="100"
            ></el-table-column>





            <!-- <el-table-column
            label="常规时间"
            prop="normalDate"
            show-overflow-tooltip
            min-width="150"
            >
            </el-table-column>
            <el-table-column
            label="开嘱人"
            prop="doctorName"
            show-overflow-tooltip
            min-width="80"
            ></el-table-column>
            <el-table-column
            label="开嘱科室"
            prop="adv_depart"
            show-overflow-tooltip
            min-width="80"
            >
            <template slot-scope="scope">
                <span
                tableName="sys_org"
                :conditionMap="{
                    org_type: '_DEPT_',
                    id: scope.row.deptCode
                }"
                columns="org_nm"
                v-tableTransform
                ></span>
            </template>
            </el-table-column>
            <el-table-column
            label="停嘱时间"
            prop="stopDoctorTime"
            show-overflow-tooltip
            min-width="150"
            >
            <template slot-scope="scope">
            <div v-if="scope.row.isEditingNum">
            <el-date-picker
            v-model="scope.row.stopDoctorTime"
            type="date"
            placeholder=""
            style="width:100%;"
            >
            </el-date-picker>
            </div>
            <div v-else>{{scope.row.stopDoctorTime}}</div>
            </template>
            </el-table-column>
            <el-table-column
            label="执行科室"
            show-overflow-tooltip
            min-width="100"
            >
            <template slot-scope="scope">
                <span
                tableName="sys_org"
                :conditionMap="{
                    org_type: '_DEPT_',
                    id: scope.row.deptCode
                }"
                columns="org_nm"
                v-tableTransform
                ></span>
            </template>
            </el-table-column> -->
        </el-table>
        </div>
    </div>
    <!-- <el-card class="height-bottom" :style="{ bottom: bottom + 'px' }">
        <div class="overflow-hidden padding20 advDetailBox">
            <el-table
            :data="advDetailList"
            @select="handlerSelectDetail"
            @select-all="handlerSelectDetailAll"
            v-loading="AdvListItemLoading"
            height="100%"
            border
            style="width: 100%"
            >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column
                prop="itemName"
                label="项目名称"
                width="380"
            ></el-table-column>
            <el-table-column
                prop="price"
                label="单价"
                width="180"
            ></el-table-column>
            <el-table-column prop="spec" label="规格"></el-table-column>
            <el-table-column label="数量">
                <template slot-scope="scope">
                <div v-if="!globalStatus">
                    <el-input-number
                    style="width: 100%;"
                    v-model="scope.row.basicDosage"
                    controls-position="right"
                    ></el-input-number>
                </div>
                <div v-else>{{ scope.row.basicDosage }}</div>
                </template>
            </el-table-column>
            </el-table>
        </div>
        <div class="padding20" style="padding-top: 0;">
            <el-button
            type="primary"
            @click="saveAdv"
            v-hotKey="{ func: 'func_add2', flag: 'isLoading' }"
            v-show="!globalStatus"
            class="button"
            >保存</el-button
            >
            <el-button @click="cancelAdv" class="button">取消</el-button>
        </div>
    </el-card> -->
    <el-dialog
      title="使用理由"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <div style="padding: 20px;">
        <div style="margin: 20px;">
          <el-radio v-model="useReasons" @change="uChange" label="1">预防</el-radio>
          <div style="margin-left: 50px;">
            <div style="margin: 20px;">
              <el-radio v-model="preventiveApplication" @change="pChange" label="1">非手术预防性应用</el-radio>
            </div>
            <div style="margin: 20px;">
              <el-radio v-model="preventiveApplication" @change="pChange" label="2">围手术期预防性应用</el-radio>
              <div style="margin-left: 50px;width:300px;display:flex;">
                <div style="width:120px;">
                  <div style="margin: 20px;">
                    <el-radio v-model="incision" @change="iChange" label="1">Ⅰ类切口</el-radio>
                  </div>
                  <div style="margin: 20px;">
                    <el-radio v-model="incision" @change="iChange" label="2">Ⅱ类切口</el-radio>
                  </div>
                  <div style="margin: 20px;">
                    <el-radio v-model="incision" @change="iChange" label="3">Ⅲ类切口</el-radio>
                  </div>
                </div>
                <div style="border-right:1px solid #e4e4e4;height: 70px;margin-top: 30px;margin-left: 13px;">

                </div>
                <div style="width:120px;">
                  <div style="margin: 20px;">
                    <el-radio v-model="operativeUse" @change="iChange" label="1">术前围术期使用</el-radio>
                  </div>
                  <div style="margin: 20px;">
                    <el-radio v-model="operativeUse" @change="iChange" label="2">术中围术期使用</el-radio>
                  </div>
                  <div style="margin: 20px;">
                    <el-radio v-model="operativeUse" @change="iChange" label="3">术后围术期使用</el-radio>
                  </div>
                </div>
              </div>
            </div>
            <div style="margin: 20px;">
              <el-radio v-model="preventiveApplication" @change="pChange" label="3">侵入性诊疗操作预防性应用</el-radio>
            </div>
          </div>
        </div>
        <div style="margin: 20px;">
          <el-radio v-model="useReasons" @change="uChange" label="2">治疗</el-radio>
        </div>
        <div style="margin: 20px;">
          <el-radio v-model="useReasons" @change="uChange" label="3">急诊用药</el-radio>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleGB">取 消</el-button>
        <el-button type="primary" @click="handleOK">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
  import BottomForm from "./bottomForm";
  import bottomModule from "./bottomModule";
  import { mapActions, mapGetters } from "vuex";
  import {
    adviceDelete,
    allStop,
    bunching,
    cancel,
    copyLong,
    copyShort,
    getAdvice,
    gonna,
    gonnaOut,
    gonnaLeave,
    stop,
    unbunching,
    adviceSubmit,
    performance,
    rescind,
    getAdviceItem,
    temporary,
    temporaryList,
    westAdviceGetAdvice,
    westAdviceSubmit,
    westAdviceStop,
    westAdviceDelete,
    westAdviceRescind,
    westAdviceRecall,
    westAdviceBunching,
    westAdviceUnbunching
  } from "@/api/cis/resident/residentAdvice";
  import { leadAdviceFormwork } from "@/api/cis/resident/residentAdviceFormwork";
  import { onPreview, onPrint } from "@/utils/print";
  import saveTpl from "./saveTemplate.vue";
  import { getEffectiveRecord } from "@/api/common/allergy";
import {
  getRecipeNo,
  saveOrders,
  getFirstDayCount,
  getWestAdviceFirstDayCount
} from "@/api/cis/order/order";
  
import {
  fetchAdviceList,
  addAdvice,
  querySelectAdvName,
  fetchAdvDetailItem,
  fetchAdvDetail,
  upDataAdvice
} from "@/api/ipnw/nursing";
import { getArrayList } from "@/api/wconf/wparam";

  export default {
    name: "medicalOrderMain",
    props: ["ids"],
    data() {
      return {
        wardsCode: '',

        useReasons: '0',
        preventiveApplication: '0',
        incision: '0',
        operativeUse: '0',
        // showFlowRate: true, //滴速输入框disable
        searchResLoading: false, // 模糊查询列表 loading
        mainTableLoading: false, // 医嘱列表 loading
        statusArr: {
          0: "暂存",
          1: "提交",
          2: "删除",
          3: "已审核",
          4: "停止",
          5: "作废",
          9: "打回",
          10: "审核停止",
          11: "审核停止通过",
          12: "审核停止打回",
          13: "未执行",
          14: "执行中",
          15: "执行完毕",
          16: "撤销"
        },
        // skinTestDisabled: true, //皮试勾选是否可选标识
        dialogVisible: false, // 抗菌药物 dialog
        isFrequencyDisabled: false, //频率 在 短期的情况下禁用


        activeName: "first",
        //  医嘱列表
        tableList: [],
        options: [
          {
            value: "选项1",
            label: "黄金糕"
          }
        ],
        currentRow: null,
        isAdd: true, // 是否处于新增状态
        bottomFormHeight: "", // 底部form的高度
        tableTop: "140", // table定位距离上面距离
        bottom: "0", // 底部详情列表位置
        bottomHidden: false, // 底部详情列表显示隐藏
        showPrise: true,
        showShort: true,
        showLeave: true,
        //  查询条件
        searchForm: {
          categoryCode: 1,
          inpCode: "",
          dateRange: [],
          patientId: "",
          bedNo: "",
          name: "", // 医嘱查询关键词
          status: "", //
          deptType: "1", //
          adviceType: "1",
          today: "",
          patientName: ""
        },
        instillationList: {
          inpCode: "",
          patientName: "",
          bedCode: "",
          a: []
        },
        tableColumn: [],
        itemName: "",
        itemSpec: "",
        tableData: [],
        // 医嘱列表已选中
        selectedList: [],
        selectDrop: {
          // 输入药品名称显示的下拉table
          dropColumn: [
            {
              prop: "orderItemName",
              label: "医嘱名称",
              width: 150
            },
            {
              prop: "spec",
              label: "规格",
              width: 80
            },
            {
              prop: "stock",
              label: "子类",
              width: 80
            },
            {
              prop: "price",
              label: "价格",
              width: 80
            },
            {
              prop: "defaultDosageUnit",
              label: "计价单位",
              width: 80
            },
            {
              prop: "stockNum",
              label: "库存数",
              width: 80
            },
            {
              prop: "stock",
              label: "可用数量",
              width: 80
            },
            {
              prop: "stock",
              label: "商品名",
              width: 80
            },
            {
              prop: "stock",
              label: "医保类型",
              width: 80
            },
            {
              prop: "stock",
              label: "基本药物",
              width: 80
            },
            {
              prop: "execDeptName",
              label: "执行科室",
              width: 80
            }
          ],
          selectOptions: [],
          unitOptions: [],
        }
      };
    },
    components: {
      BottomForm,
      saveTpl,
      bottomModule
    },
    methods: {
      uChange(label){
        console.log(label)
        if(label == '1'){
          this.preventiveApplication = '1'
          this.incision = '0'
          this.operativeUse = '0'
        } else {
          this.preventiveApplication = '0'
          this.incision = '0'
          this.operativeUse = '0'
        }
      },
      pChange(label){
        console.log(label)
        this.useReasons = '1'
        if (label == '2') {
          // this.preventiveApplication = '1'
          this.incision = '1'
          this.operativeUse = '1'
        } else {
          // this.preventiveApplication = '0'
          this.incision = '0'
          this.operativeUse = '0'
        }
      },
      iChange(label){
        console.log(label)
        this.useReasons = '1'
        this.preventiveApplication = '2'
        if (this.incision == '0') {
          this.incision = '1'
        }
        if (this.operativeUse == '0') {
          this.operativeUse = '1'
        }
      },
      // 抗菌药物dialog
      handleClose(done) {
        this.$confirm('还未选择使用理由，确认关闭？')
          .then(_ => {
            // 关闭时重置所有抗菌药品使用理由
            this.tableList.forEach( it => {
              if (it.isEditingNum ) {
                // it.name = '';
                it.useReasons = '0';
                it.preventiveApplication = '0';
                it.incision = '0';
                it.operativeUse = '0';
                this.useReasons = '0';
                this.preventiveApplication = '0';
                this.incision = '0';
                this.operativeUse = '0';
              }
            })
            done();
          })
          .catch(_ => {});
      },
      handleGB() {
        this.$confirm('还未选择使用理由，确认关闭？')
          .then(_ => {
            // 关闭时重置所有抗菌药品使用理由
            this.tableList.forEach( it => {
              if (it.isEditingNum ) {
                // it.name = '';
                it.useReasons = '0';
                it.preventiveApplication = '0';
                it.incision = '0';
                it.operativeUse = '0';
                this.useReasons = '0';
                this.preventiveApplication = '0';
                this.incision = '0';
                this.operativeUse = '0';
              }
            })
            this.dialogVisible = false
          })
          .catch(_ => {});
      },
      handleOK() {
        // this.useReasons
        // this.preventiveApplication
        // this.incision
        // this.operativeUse

        console.log(this.useReasons + this.preventiveApplication + this.incision + this.operativeUse)
        this.tableList.forEach(it=>{
          if(it.isEditingNum ){
            it.useReasons = this.useReasons;
            it.preventiveApplication = this.preventiveApplication;
            it.incision = this.incision;
            it.operativeUse = this.operativeUse;
          }
        })

        this.dialogVisible = false
        // 给本条信息赋值
      },
        /**
         * 点击单项医嘱查看详情
         */
        selectItem(row, column, event) {
        if (row.isNew) {
            return;
        }
        this.globalStatus = true;
        fetchAdvDetail({
            adviceId: row.adviceId
        })
            .then(res => {
            let { code, data, msg } = res;
            if (code == 1) {
                this.bottom = 0;
                this.advDetailList = data;
            } else {
                this.$message.error(msg);
            }
            })
            .catch(err => {
            this.$message.error("网络错误!");
            });
        },
        selectRow(list, row) {
            // 选择表格 成组全选
            console.log('selectRow-list',list)
            console.log('selectRow',row)
            // list.forEach(row => {
            // this.tableList.map(item => {
            //     if (
            //     row.groupNo === item.groupNo &&
            //     item._primary_id !== row._primary_id
            //     ) {
            //     setTimeout(() => {
            //         this.$refs.multipleTable.toggleRowSelection(item);
            //     }, 10);
            //     }
            // });
            // // });
            // this.selectedList = list;

            this.tableList.map(item => {
              if (row.groupNo === item.groupNo && item.adviceId !== row.adviceId) {
                setTimeout(() => {
                  this.$refs.multipleTable.toggleRowSelection(item);
                }, 0);
              }
            });

            this.selectedList = list;
        },
        handleSelectionChange(val) {
        // 表格发生变化是
        this.selectedList = val;
        this.printList = val;
        },
        handleCurrentChange(row) {
        // 医嘱单项选中后更改医嘱详情
        // 请求单项详情
        // this.changePrescription(row.adviceId);
        },
        /*
        * 新增医嘱时,医嘱名称模糊查询
        */

        searchLike(keyWord) {
            this.searchResLoading = true;
            getAdviceItem({
                name: keyWord
            })
            .then(res => {
            let { code, data, msg } = res;
            if (code == 1) {
                data.map(item => {
                // if(item.type == 'ITEM'){
                //   item.type = '诊疗'
                // }else if(item.type == 'DRUG'){
                //   item.type = '药品'
                // }else{
                //   item.type = '套餐'
                // }
                });
                console.log('this.selectDrop.selectOptions',data)
                this.selectDrop.selectOptions = data;
                //选中项目后，联动规格
                let itemName='';
                let itemSpec='';
                let index=0;
                for(let i=0;i<this.tableList.length;i++){
                if(this.tableList[i].isEditingNum){
                    itemName = this.tableList[i].name;
                    index = i;
                }
                }
                data.forEach(itemData=>{
                  if(itemData.name == itemName){
                      itemSpec=itemData.spec;
                  }
                });
                this.tableList[index].spec= itemSpec;
            } else {
                this.$message.error(msg);
            }
            this.searchResLoading = false;
            })
            .catch(e => {
            this.$message.error(msg);
            this.searchResLoading = false;
            });
        },
        /**
        * 选择医嘱项目
        **/
        select(v) {
          console.log('选择药品遗嘱项select-v',v)
          
          // 抗菌药物 - 弹框
          if(v.manageType == "M"){
            this.dialogVisible = true
          } else {
            
            // 不是抗菌药物时，重置抗菌药物的使用理由
            this.tableList.forEach( it => {
              if (it.isEditingNum ) {
                it.useReasons = '0';
                it.preventiveApplication = '0';
                it.incision = '0';
                it.operativeUse = '0';
                this.useReasons = '0';
                this.preventiveApplication = '0';
                this.incision = '0';
                this.operativeUse = '0';
              }
            })
          }
          if (v.itemType == "GROUP") {
              this.bottom = 0;
              this.AdvListItemLoading = true;
              fetchAdvDetailItem({
              groupId: v.itemId
              })
              .then(res => {
                  let { code, data, msg } = res;
                  if (code == 1) {
                  data.map(item => {
                      item.basicDosage = 1;
                  });
                  this.advDetailList = data;
                  console.log("this.advDetailList:",this.advDetailList);
                  }
                  this.AdvListItemLoading = false;
              })
              .catch(e => {
                  this.AdvListItemLoading = false;
              });
          };
          // 皮试药品勾选皮试
          // if (v.stType == "1" && v.stStatus == '1' && (v.applicationRange == '0' || v.applicationRange == '1')) {
          //   // this.skinTestDisabled = false;
          //   v.skinTestDisabled = true;
          //   // this.currentRow.skinTest = true;skinTest
          //   v.skinTest = v.stType;
          // } else {
          //   // this.skinTestDisabled = true;
          //   v.skinTestDisabled = false;
          //   // this.currentRow.skinTest = false;
          // }
          if(v.stStatus == '0'){
            v.skinTest = '0'
          } else {
            if (v.applicationRange == "0" || v.applicationRange == "1") {
                if (v.stType == "0") {
                  v.skinTestDisabled = false;
                  v.skinTest = "1";

                } else {
                  v.skinTestDisabled = true;
                  v.skinTest = "1";
                }
            } else {
              v.skinTest = '0'
            }
          }

          //adviceType:医嘱类型,默认17
          // let adviceType = '17';
          // if (v.itemType == "DRUG") {
          //     if(v.orderType == '1'){
          //         adviceType = '1'
          //     }else if(v.orderType == '2'){
          //         adviceType = '2'
          //     }else if(v.orderType == '3'){
          //         adviceType = '3'
          //     }

          // };

          this.tableList.map((item, index) => {
              if (item.isNew) {
              item = {
                  ...item,
                  ...v,
                  name: v.orderItemName,
                  price: v.price,
                  adviceType: v.adviceType,
                  basicDosageUnit: v.defaultDosageUnit
              };
              this.tableList.splice(index, 1, item);
              this.$refs.multipleTable.toggleRowSelection(item, true);
              }
          });
          // 查询单位
          this.getDosageUnitAjax(v);
        },
        // 医嘱编辑操作按钮
        add() {
            // 新增
            // this.bottom = 0;
            if (this.isEditing) {
                return;
            }
            if (!this.receivePatientData.hasOwnProperty("patientId")) {
                this.$message.warning("请选择患者!");
                return;
            }
            this.globalStatus = false;
            let currentTime = new Date();
            let obj = {
                // id: 4,
                _primary_id: 3,
                isNew: true,
                // state: 1, // 0 已审核 1 已提交 2 暂存
                // beginTime:
                // new Date().toISOString().split("T")[0] +
                // ` ${currentTime.getHours()}:${
                //     currentTime.getMinutes() < 10
                //     ? "0" + currentTime.getMinutes()
                //     : currentTime.getMinutes()
                // }`, // 开始日期
                name: "", // 名称
                spec: "", // 规格
                onceDosage: 0, // 单次剂量
                basicDosage: 0,
                uses: "", // 用法
                frequency: "", // 频次
                normal_time: "", // 常规时间
                adv_people: "", // 开嘱人
                adv_depart: "", // 开嘱科室
                end_date: "", // 停止日期
                end_time: "", // 结束时间
                end_doctor: "", // 结束医生
                end_nurse: "", // 结束护士
                execute_depart: "", // 执行科室
                group_num: "", // 分组号
                isEditingNum: true
            };
            this.tableList.push(obj);
            this.$refs.multipleTable.toggleRowSelection(obj, true);
            this.setFrequencyState()
        },
        // 医嘱类型 改变
        timeTypeChange(val) {
            this.tableList = [];
            this.fetchTableList(this.receivePatientData);
        },
        // 选中频次处理方法
        handleFreq(row, item) {
            // console.info("====itt", Array.prototype.slice.call(arguments));
            // console.info("====frequency", value, item);
            console.log("dsdsds:",item[1]);
            //this.selectDrop.ruleForm.normalDate = item.cycleTimePoint;
            // this.tableList.forEach(it=>{
            //     if(it.isEditingNum){
            //         console.log("dsdsds:",item);
            //         console.log("dsdsds--it:",it);
                    row.normalDate =item[1].cycleTimePoint;
                    row.cycleTimePoint =item[1].cycleTimePoint;
                    row.cycleUnit =item[1].cycleUnit;
                    item[1].frequency =item[1].frequencyCode;
                    // Object.assign(row, item[1]);
                    this.getFirstDay(item[1],row);
            //     }
            // })
        },
        //取消皮试勾选时
        changeSkinTest() {
          // console.info("=====skinTest", this.selectDrop.ruleForm.skinTest);
          let { patientId } = this.$store.state.base.receivePatientData; //获取患者信息
          let drugItem = this.drugItem;
          // 取消皮试且皮试药品类型为必须皮试
          if (!this.currentRow.skinTest && this.drugItem.stType === "1") {
            // 先判断皮试结果是否有效
            getEffectiveRecord({
              patientId: patientId,
              drugId: drugItem.orderItemId
            }).then(res => {
              if (res.code === 1) {
                if (res.data.length === 0 || res.data[0].registerResult !== "2") {
                  // 无皮试结果要进行皮试
                  this.currentRow.skinTest = true;
                  this.$message.warning("该皮试药品暂无有效结果，必须进行皮试！");
                }
              } else {
                this.$message.error(res.msg ? res.msg : "获取数据失败");
              }
            });
          }
        },
        handleUseWay(row, item) {
          console.log('handleUseWay?{}}}}}}}}}}}}}}}}}}',item)
          console.log('handleUseWay------------------',row)
          if (item[1].name.indexOf("滴注") !== -1 || item[1].code === "404") {
            row.showFlowRate = false;
          } else {
            row.showFlowRate = true;
            
            this.selectedList.forEach(item => {
              if(item.isNew == true){
                // 数据清空
                item.dropRate = "";
                item.dropRate1 = "";
                item.dropRate2 = "";
              }
            });
          }
        },
        // handleUseWay(value, item) {
        //   let form = this.selectDrop.ruleForm;
        //   if (item.name.indexOf("滴注") !== -1 || item.code === "404") {
        //     this.showFlowRate = false;
        //   } else {
        //     this.showFlowRate = true;
            
        //     this.selectedList.forEach(item => {
        //       if(item.isNew == true){
        //         // 数据清空
        //         item.dropRate = "";
        //         item.dropRate1 = "";
        //         item.dropRate2 = "";
        //       }
        //     });
        //   }
        // },
        // 首日次数
        getFirstDay(item,it) {
          console.log('it',it)
          console.log('item',item)
          console.log('it.adviceTime',it.adviceTime)
          if (it && it.adviceTime) {
            getWestAdviceFirstDayCount({
              frequencyCode: item.frequency,
              adviceTime: it.adviceTime,
              cycleUnit: item.cycleUnit,
              cycleTimePoint: item.cycleTimePoint
            })
              .then(res => {
                if (res.code === 1) {
                  console.log(res.data, "res.data");
                  let firstDayCount = res.hasOwnProperty("data") ? res.data : "";

                  it.firstDayCount = firstDayCount;

                  console.log(firstDayCount, "firstDayCount");
                }
              })
              .catch(err => {});
          }
        },
        adviceTimeChange(row) {
          console.log('row---?',row)
          if(row.frequency &&row.frequency !=''){
            console.log('row???',row)
            this.getFirstDay(row,row);
          }
          
        },
        // 频率的状态
        setFrequencyState() {
          if (this.searchForm.categoryCode === 2) {
            //频率 在 短期的情况下禁用
            this.tableList.forEach(it=>{
                if(it.isEditingNum ){
                    it.frequency= "st";
                    it.frequencyCode = "st";
                    it.frequencyId = 17;
                    it.frequencyName = "立即";
                    this.isFrequencyDisabled = true;
                    // this.getFirstDay();
                }
            })
            // this.selectDrop.ruleForm.frequency = "st";
            // this.isFrequencyDisabled = true;
          } else {
            // this.tableList.forEach(it=>{
            //     if(it.isEditingNum ){
            //         it.frequency= "st";
            //         this.isFrequencyDisabled = true;
            //     }
            // })
            // this.selectDrop.ruleForm.frequency = this.row && this.row.frequency;
            this.isFrequencyDisabled = false;
          }
        },
        // 数量单位change
        unitChange(value,row) {
          row.unit = this.getLabel(
            this.selectDrop.unitOptions,
            value
          );
        },
        getLabel(optList, key) {
          let obj = optList.find(item => {
            return item.value === key;
          });
          return obj.label;
        },
        getDosageUnitAjax(data) {
          // if(this.radioValue !== 3) return;// 长期 临时 不需要请求药品单位
          this.selectDrop.unitOptions = [];
          // 获取单位数据
          let param = [];
          let shows = [];
          shows.push(data.packUnit);
          // 判断药品是否可拆零
          if (
            data.unitSaleFlg === "1" ||
            (data.unitSaleFlg === undefined && data.unit)
          ) {
            shows.push(data.unit);
          }
          // debugger
          param.push({ code: "DrugUnit", field: "code", shows: shows });
          getArrayList(param)
            .then(rep => {
              if (rep.code === 1) {
                for (let i = 0; i < rep.data.DrugUnit.length; i++) {
                  if (rep.data.DrugUnit[i].name) {
                    this.selectDrop.unitOptions.push({
                      label: rep.data.DrugUnit[i].name,
                      value: rep.data.DrugUnit[i].code
                    });
                  }
                }
              }
            })
            .catch(_ => {
              this.$message.error(
                error.msg ? error.msg : "获取药品单位有误，请确认无误后再选择！"
              );
            });
        },








        
      ...mapActions({
        changeCurrentRow: "cis/changeCurrentRow",
        changeDrugName: "order/changeDrugName"
      }),
      bottomFormSave() {

        // 此处写 table的ajax 方法 刷新页面
        this.fetchTableList();

        console.log("刷新页面");
      },
      // 查询医嘱按钮
      searchAdv() {
        this.fetchTableList();
      },
      // 医嘱编辑操作按钮
    //   add() {
    //     // 新增
    //     // 用户没有选择 患者提示
    //     if (!this.receivePatientData.patientId) {
    //       this.$message.error("请选择患者！");
    //       return;
    //     }
    //     this.$refs.bottomForm && this.$refs.bottomForm.hollow();
    //     document
    //       .getElementById("bottomFormInputTable")
    //       .getElementsByClassName("el-input__inner")[0]
    //       .focus();
    //   },
      temporarySave() {
        // 暂存
        if (this.validate()) {

          let selectedData = JSON.parse(JSON.stringify(this.selectedList));
          let isNotStatus = false

          let statusflag = false

          selectedData.forEach(item => {
            if(item.status>0){
              isNotStatus = true
            }
            // item.adviceType = item.adviceType;
            item.code = item.itemId;
            // item.status = '1';
            item.receiveDept = item.execDeptCode;
            // item.adviceTime = item.beginTime;
            item.categoryCode = this.searchForm.categoryCode;
            item.bedNo = this.receivePatientData.bedCode;
            item.inpCode = this.receivePatientData.inpCode;
            item.patientId = this.receivePatientData.patientId;
            item.originId = 0;//0:医生,1:护士
            item.dropRate = item.dropRate1 + "~" + item.dropRate2;
            item.wardsCode = this.wardsCode;
            item.packUnit = item.limitUnit;

            // 滴速
            if (item.showFlowRate==false) {
              if (
                typeof item.dropRate1 === "undefined" ||
                typeof item.dropRate2 === "undefined" ||
                item.dropRate2 < item.dropRate1
              ) {
                this.$message.warning("滴速填写错误！");
                statusflag = true
                return false;
              } else {
                // item.dropRate = item.dropRate1 + "~" + item.dropRate2;
              }
            }


            // 判断有医嘱
            if (item.name) {
              console.log('item.name',item.name)
            } else {
              this.$message.warning("医嘱名称不能为空！");
              statusflag = true
              return false;
            }

            // 判断用法
            if (item.uses) {
              console.log('item.uses',item.uses)
            } else {
              this.$message.warning("用法不能为空！");
              statusflag = true
              return false;
            }
            
            // 判断频次
            if (item.frequency) {
              console.log('item.frequency',item.frequency)
            } else {
              this.$message.warning("频次不能为空！");
              statusflag = true
              return false;
            }
            // 判断开始时间
            if (item.adviceTime) {
              console.log('item.adviceTime',item.adviceTime)
            } else {
              this.$message.warning("开始时间不能为空！");
              statusflag = true
              return false;
            }
            
          });

          if(statusflag == true){
            // this.$message.warning("只有新增和暂存状态才可以暂存");
            return false;
          }
          if(isNotStatus == true){
            this.$message.warning("只有新增和暂存状态才可以暂存");
            return false;
          }





          // let data = {}
          // this.selectedList.forEach(item => {
          //   if(item.isNew == true){
          //     /*  item.beginTime = "";*/
          //     data = item
          //     data.adviceType = item.adviceType;
          //     data.code = item.itemId;
          //     data.receiveDept = item.execDeptCode;
          //     // data.adviceTime = item.beginTime;
          //     data.categoryCode = this.searchForm.categoryCode;
          //     data.bedNo = this.receivePatientData.bedCode;
          //     data.inpCode = this.receivePatientData.inpCode;
          //     data.patientId = this.receivePatientData.patientId;
          //     data.originId = 0;//0:医生,1:护士
          //     // item.status = this.receivePatientData.inpCode;
          //     data.dropRate = item.dropRate1 + "~" + item.dropRate2;
          //     data.wardsCode = this.wardsCode;
              
          //     data.packUnit = item.limitUnit;
          //   }
          // });
          // let data = this.selectedList[0];
          console.log('selectedData',selectedData)
          console.log('selectedList',this.selectedList)
          console.log('this.receivePatientData',this.receivePatientData)

          // 已暂存，无需再次暂存
          // if (data.isNew == true) {
          //   console.log('data.name',data.name)
          // } else {
          //   this.$message.warning("该记录无需再次暂存");
          //   return false;
          // }
          // // 滴速
          // if (this.showFlowRate==false) {
          //   if (
          //     typeof data.dropRate1 === "undefined" ||
          //     typeof data.dropRate2 === "undefined" ||
          //     data.dropRate2 < data.dropRate1
          //   ) {
          //     this.$message.warning("滴速填写错误！");
          //     return false;
          //   } else {
          //     // data.dropRate = data.dropRate1 + "~" + data.dropRate2;
          //   }
          // }
          // adviceType

          // // 判断有医嘱
          // if (data.name) {
          //   console.log('data.name',data.name)
          // } else {
          //   this.$message.warning("医嘱名称不能为空！");
          //   return false;
          // }

          // // 判断用法
          // if (data.uses) {
          //   console.log('data.uses',data.uses)
          // } else {
          //   this.$message.warning("用法不能为空！");
          //   return false;
          // }
          
          // // 判断频次
          // if (data.frequency) {
          //   console.log('data.frequency',data.frequency)
          // } else {
          //   this.$message.warning("频次不能为空！");
          //   return false;
          // }
          // // 判断开始时间
          // if (data.adviceTime) {
          //   console.log('data.adviceTime',data.adviceTime)
          // } else {
          //   this.$message.warning("开始时间不能为空！");
          //   return false;
          // }
          
          temporary(selectedData).then(res => {
            if (res.code === 1) {
              this.$message({
                type: "success",
                message: "暂存成功!"
              });
              this.fetchTableList();
            } else {
              console.info(res);
              this.$message.error(res.msg || " 接口返回错误");
            }
          })
          .catch(() => {
            this.$message.error("提交失败！");
          });
        } else {
        }
      },
      submitSave() {
        // 提交
        if (this.validate()) {

          let data = JSON.parse(JSON.stringify(this.selectedList));
          data.forEach(item => {
            // item.adviceType = item.adviceType;
            item.code = item.itemId;
            item.status = '1';
            item.receiveDept = item.execDeptCode;
            // item.adviceTime = item.beginTime;
            item.categoryCode = this.searchForm.categoryCode;
            item.bedNo = this.receivePatientData.bedCode;
            item.inpCode = this.receivePatientData.inpCode;
            item.patientId = this.receivePatientData.patientId;
            item.originId = 0;//0:医生,1:护士
            item.dropRate = item.dropRate1 + "~" + item.dropRate2;
            
          });
          
          
          // // 滴速
          // if (this.showFlowRate==false) {
          //   if (
          //     typeof data.dropRate1 === "undefined" ||
          //     typeof data.dropRate2 === "undefined" ||
          //     data.dropRate2 < data.dropRate1
          //   ) {
          //     this.$message.warning("滴速填写错误！");
          //     return false;
          //   } else {
          //     // data.dropRate = data.dropRate1 + "~" + data.dropRate2;
          //   }
          // }
          // adviceType

          // 判断有医嘱
          // if (data.name) {
          //   console.log('data.name',data.name)
          // } else {
          //   this.$message.warning("医嘱名称不能为空！");
          //   return false;
          // }

          // // 判断用法
          // if (data.uses) {
          //   console.log('data.uses',data.uses)
          // } else {
          //   this.$message.warning("用法不能为空！");
          //   return false;
          // }
          
          // // 判断频次
          // if (data.frequency) {
          //   console.log('data.frequency',data.frequency)
          // } else {
          //   this.$message.warning("频次不能为空！");
          //   return false;
          // }
          // // 判断开始时间
          // if (data.adviceTime) {
          //   console.log('data.adviceTime',data.adviceTime)
          // } else {
          //   this.$message.warning("开始时间不能为空！");
          //   return false;
          // }

          
          westAdviceSubmit(data)
            .then(res => {
              if (res.code === 1) {
                this.$message({
                  type: "success",
                  message: "提交成功!"
                });
                this.fetchTableList();
              } else {
                console.info(res);
                this.$message.error(res.msg || " 接口返回错误");
              }
            })
            .catch(() => {
              this.$message.error("提交失败！");
            });
        } else {
        }
      },
      backSpace() {
        // 撤销
      },
      deleteHandler() {
        let tableData = this.tableData;
        // if (this.selectedList.length > 0) {
        //   //最少选中一项
        //   this.$confirm("删除后不可恢复，是否继续?", "提示", {
        //     confirmButtonText: "确定",
        //     cancelButtonText: "取消",
        //     type: "warning"
        //   })
        //     .then(() => {
              let serverList = this.selectedList.filter(item => {
                console.log('deleteHandler------item',item)
                //需要传到后端删除的 数据 通过有无 id 判断
                // 对 tableData 中的 row_id 处理
                // if (item.row_id != "" || item.row_id !== undefined) {
                //   tableData.splice(
                //     tableData.findIndex(
                //       innerItem => {innerItem.row_id === item.row_id
                //       console.log('deleteHandler1------innerItem',item)}
                //     ),
                //     1
                //   ); // 删除用户新增的数据 通过判断 row_id 进行删除
                // }else{
                //   console.log('deleteHandler2------innerItem',item)
                //   // this.tableData.splice(index, 1)
                // }
                
                console.log('deleteHandler------this.tableList.length',this.tableList.length)
                if(item.isNew == true){ // 删除新增项
                  this.tableList.splice(
                    this.tableList.length-1,
                    1
                  );
                }
                return item.adviceId;
              });
              console.log('deleteHandler------serverList',serverList)
              if (serverList.length > 0) {
                westAdviceDelete(serverList).then(res => {
                  if (res.code === 1) {
                    this.$message({
                      type: "success",
                      message: "删除成功!"
                    });
                    this.fetchTableList();
                  } else {
                    console.info(res);
                    this.$message.error(res.msg || " 接口返回错误");
                  }
                });
              } else{
                this.$message.warning("已删除");
              }
            // })
            // .catch(() => {
            //   this.$message({
            //     type: "info",
            //     message: "已取消删除"
            //   });
            // });
        // } else {
        //   this.$message.warning("请选择后再删除！");
        // }
      },
      rowClick(row, column, event) {
        // if (column.property !== 'skinTest') {
        // 医嘱可编辑状态
        //let status = "0,2,7";
        /*if (status.indexOf(row.orderStatus) === '-1' && row.chargeStatus !== '0') {
            this.$message.warning('未收费的医嘱才可编辑！');
            return false;
          }*/
        //this.clearTypeCurrent();
        /*this.tableData.forEach((item) => {
            if (item.id === row.id) {
              this.$set(item, 'type', 'current');
            }
          });
          this.$store.dispatch('cis/changeRpTableData', this.tableData);*/
        // }
      },
      setBunchingCls() {
        var list = [];
        var filterList = [];
        let groupList = this.tableData.map(item => {
          return item.groupNo;
        });
        groupList = unique(groupList); //数组去重
        groupList = groupList.filter((item, index) => {
          // 数组去undefind
          return item !== undefined;
        });

        function unique(arr) {
          return Array.from(new Set(arr));
        }

        groupList.forEach((item, index) => {
          //遍历 成map结构
          // list = [];
          filterList = this.tableData.filter((sonItem, sonIde) => {
            return item === sonItem.groupNo;
          });
          list.push({
            key: item,
            value: filterList
          });
        });
        this.groupNoList = list;
        list.forEach(item => {
          let itemList = item.value;
          itemList.forEach((sonItem, sonIndex) => {
            if (sonIndex === 0) {
              sonItem.groupNoCls = "bunchingUp";
            } else if (sonIndex === itemList.length - 1) {
              sonItem.groupNoCls = "bunchingDown";
            } else {
              sonItem.groupNoCls = "bunchingCenter";
            }
          });
        });
      },
      //成组 处理
      bunchingHandler() {
        if (this.bunchingValidate()) {
          // this.setBunchingSelect ();
          let data = this.selectedList;
          westAdviceBunching(data)
            .then(res => {
              if (res.code === 1) {
                this.$message({
                  type: "success",
                  message: "成组成功!"
                });
                this.fetchTableList();
              } else {
                console.info(res);
                this.$message.error(res.msg || " 接口返回错误");
              }
            })
            .catch(() => {
              this.$message.error("成组失败！");
            });
        }
      },
      // bunchingHandler() {
      //   if (this.bunchingValidate()) {
      //     // this.setBunchingSelect ();
      //     let data = this.selectedList;
      //     bunching(data)
      //       .then(res => {
      //         if (res.code === 1) {
      //           this.$message({
      //             type: "success",
      //             message: "成组成功!"
      //           });
      //           this.fetchTableList();
      //         } else {
      //           console.info(res);
      //           this.$message.error(res.msg || " 接口返回错误");
      //         }
      //       })
      //       .catch(() => {
      //         this.$message.error("成组失败！");
      //       });
      //   }
      // },
      adviceStop() {
        if (this.validate()) {
          let data = this.selectedList;
          westAdviceStop(data)
            .then(res => {
              if (res.code === 1) {
                this.$message({
                  type: "success",
                  message: "停止成功!"
                });
                this.fetchTableList();
              } else {
                console.info(res);
                this.$message.error(res.msg || " 接口返回错误");
              }
            })
            .catch(() => {
              this.$message.error("停止失败！");
            });
        } else {
        }
      },
      adviceRecall() {
        if (this.validate()) {
          let data = this.selectedList;
          westAdviceRecall(data)
            .then(res => {
              if (res.code === 1) {
                this.$message({
                  type: "success",
                  message: "撤回成功!"
                });
                this.fetchTableList();
              } else {
                console.info(res);
                this.$message.error(res.msg || " 接口返回错误");
              }
            })
            .catch(() => {
              this.$message.error("撤销失败！");
            });
        } else {
        }
      },
      adviceRescind() {
        if (this.validate()) {
          let data = this.selectedList;
          westAdviceRescind(data)
            .then(res => {
              if (res.code === 1) {
                this.$message({
                  type: "success",
                  message: "撤销成功!"
                });
                this.fetchTableList();
              } else {
                console.info(res);
                this.$message.error(res.msg || " 接口返回错误");
              }
            })
            .catch(() => {
              this.$message.error("撤销失败！");
            });
        } else {
        }
      },
      //全部停止
      adviceaAllStop() {
        let inpCodes = this.tableList[0].inpCode;
        let data = {
          inpCode: inpCodes
        };
        // this.setBunchingSelect ();
        allStop(data)
          .then(res => {
            if (res.code === 1) {
              this.$message({
                type: "success",
                message: "停止成功!"
              });
              this.fetchTableList();
            } else {
              console.info(res);
              this.$message.error(res.msg || " 接口返回错误");
            }
          })
          .catch(() => {
            this.$message.error("停止失败！");
          });
      },
      chChange(val) {
        // this.categoryCode = val;
        this.searchForm.categoryCode = val;
      },
      //成组校验
      bunchingValidate() {
        let flag = true;
        if (this.selectedList.length > 1) {
          // 成组最少两个成员
          flag = true;
        } else {
          flag = false;
          this.$message.warning("成组最少两个医嘱");
          return false;
        }
        return flag;
      },
      //普通校验
      validate() {
        let flag = true;
        if (this.selectedList.length > 0) {
          // 成组最少1个成员
          flag = true;
        } else {
          flag = false;
          this.$message.warning("请选择一条数据");
          return false;
        }
        return flag;
      },
      //取消成组
      cancelBunching() {
        let data = this.selectedList;
        if (data.length > 1) {
          // 成组最少两个成员
          // 组号相同
          if (this.isSameGroup) {
            westAdviceUnbunching(data).then(res => {
              if (res.code === 1) {
                this.$message.success(res.msg ? res.msg : "取消成组成功！");
                this.fetchTableList(false);
              } else {
                this.$message.error(res.msg ? res.msg : "取消成组失败");
              }
            });
          } else {
            this.$message.warning("取消成组组号必须相同");
          }
        } else {
          this.$message.warning("取消成组最少两个医嘱");
        }
      },
      isSameGroup() {
        let groupNo = null;
        return this.selectedList.every((item, index) => {
          if (index === 0) {
            groupNo = item.groupNo;
          }
          return item.groupNo === groupNo;
        });
      },
      //作废
      adviceCancel() {
        if (this.validate()) {
          let data = this.selectedList;
          // this.setBunchingSelect ();
          cancel(data)
            .then(res => {
              if (res.code === 1) {
                this.$message({
                  type: "success",
                  message: "作废医嘱成功!"
                });
                this.fetchTableList();
              } else {
                console.info(res);
                this.$message.error(res.msg || " 接口返回错误");
              }
            })
            .catch(() => {
              this.$message.error("作废医嘱失败！");
            });
        } else {
        }
      },
      //复制到长期
      adviceCopyLong() {
        if (this.validate()) {
          let data = this.selectedList;
          // this.setBunchingSelect ();
          copyLong(data)
            .then(res => {
              if (res.code === 1) {
                this.$message({
                  type: "success",
                  message: "复制成功!"
                });
                this.fetchTableList();
              } else {
                console.info(res);
                this.$message.error(res.msg || " 接口返回错误");
              }
            })
            .catch(() => {
              this.$message.error("复制到长期失败！");
            });
        }
      },
      //复制到临时
      adviceCopyShort() {
        let data = this.selectedList;
        if (this.validate()) {
          // this.setBunchingSelect ();
          copyShort(data)
            .then(res => {
              if (res.code === 1) {
                this.$message({
                  type: "success",
                  message: "复制到临时成功!"
                });
                this.fetchTableList();
              } else {
                console.info(res);
                this.$message.error(res.msg || " 接口返回错误");
              }
            })
            .catch(() => {
              this.$message.error("复制到临时失败！");
            });
        } else {
        }
      },
      //加顿到临时
      adviceGonna() {
        let data = this.selectedList;
        // this.setBunchingSelect ();
        if (this.validate()) {
          gonna(data)
            .then(res => {
              if (res.code === 1) {
                this.$message({
                  type: "success",
                  message: "医嘱加顿成功!"
                });
                this.fetchTableList();
              } else {
                console.info(res);
                this.$message.error(res.msg || " 接口返回错误");
              }
            })
            .catch(() => {
              this.$message.error("医嘱加顿失败！");
            });
        } else {
        }
      },
      //加顿到出院带药
      adviceGonnaLeave() {
        let data = this.selectedList;
        // this.setBunchingSelect ();
        if (this.validate()) {
          gonnaLeave(data)
            .then(res => {
              if (res.code === 1) {
                this.$message({
                  type: "success",
                  message: "加顿到出院带药成功!"
                });
                this.fetchTableList();
              } else {
                console.info(res);
                this.$message.error(res.msg || " 接口返回错误");
              }
            })
            .catch(() => {
              this.$message.error("医嘱加顿失败！");
            });
        } else {
        }
      },

      //加顿到出院带药
      adviceGonnaOut() {
        let data = this.selectedList;
        // this.setBunchingSelect ();
        if (this.validate()) {
          gonnaOut(data)
            .then(res => {
              if (res.code === 1) {
                this.$message({
                  type: "success",
                  message: "医嘱加顿成功!"
                });
                this.fetchTableList();
              } else {
                console.info(res);
                this.$message.error(res.msg || " 接口返回错误");
              }
            })
            .catch(() => {
              this.$message.error("医嘱加顿失败！");
            });
        } else {
        }
      },
      print() {
        // 请求医嘱方法
        
        this.searchForm.bedNo = this.receivePatientData.bedCode;
        this.searchForm.inpCode = this.receivePatientData.inpCode;
        this.searchForm.patientId = this.receivePatientData.patientId;
        let data = this.searchForm;
        let cloneData = Object.assign(data);
        /* for (let key in data) {
          if (key === "dateRange" && data[key] && data[key].length != 0) {
            cloneData["startDate"] = data[key][0];
            cloneData["endDate"] = data[key][1];
          }
        } */
        cloneData["startDate"] = (data.dateRange && data.dateRange[0]) || "";
        cloneData["endDate"] = (data.dateRange && data.dateRange[1]) || "";

        // westAdviceGetAdvice(cloneData).then(data => {
        westAdviceGetAdvice(cloneData).then(data => {
          //debugger
          /*  alert(data.data.name[0]);
          this.instillationData.instillation = data.data.name;*/
          console.log('westAdviceGetAdvice',data)
          let list1 = data.data;
          
          // 整理滴速显示
          this.list1.forEach(item => {
            if (item.dropRate && item.dropRate.indexOf("~") > -1) {
              let splitStr = item.dropRate.split("~");
              item.dropRate1 = splitStr[0];
              item.dropRate2 = splitStr[1];
            }else{
              item.dropRate1 = '';
              item.dropRate2 = '';
            }
          });
          return new Promise((resolve, reject) => {
            let list = [];
            let groupList = [];
            let filterList = [];
            let tableList = [];
            groupList = list1.map(item => {
              // 获取所有组
              return item.groupNo;
            });

            groupList = Array.from(new Set(groupList));
            groupList = groupList.filter((item, index) => {
              // 数组去undefind
              return item !== undefined && item != "";
            });
            groupList.forEach((item, index) => {
              //遍历 成map结构 分组
              // list = [];
              filterList = list1.filter((sonItem, sonIde) => {
                return item === sonItem.groupNo;
              });
              list.push({
                key: item,
                value: filterList
              });
            });
            list.forEach(item => {
              // 将有组item添加class
              let itemList = item.value;
              if (itemList.length == 1) {
                return;
              }
              itemList.forEach((sonItem, sonIndex) => {
                if (sonIndex === 0) {
                  sonItem.groupNoCls = "bunchingUp";
                } else if (sonIndex === itemList.length - 1) {
                  sonItem.groupNoCls = "bunchingDown";
                } else {
                  sonItem.groupNoCls = "bunchingCenter";
                }
              });
            });
            list.map(item => {
              // 更改list格式
              item.value.map(val => {
                tableList.push(val);
              });
            });
            list1.map(item => {
              // 补充未成组项
              if (!item.groupNo) {
                tableList.push(item);
              }
            });

            this.instillationList.a = tableList;
            this.instillationList.a.map(item => {
              if (item.groupNoCls == "bunchingUp") {
                item.groupNoCls = "┓";
              }
              if (item.groupNoCls == "bunchingCenter") {
                item.groupNoCls = "┫";
              }
              if (item.groupNoCls == "bunchingDown") {
                item.groupNoCls = "┛";
              }
              if (item.status == "0") {
                item.status = "暂存";
              }
              if (item.status == "1") {
                item.status = "已提交";
              }
              if (item.status == "4") {
                item.status = "已停止";
              }
              if (item.status == "5") {
                item.status = "已作废";
              }
              if (item.status == "9") {
                item.status = "审核驳回";
              }
              if (item.status == "13") {
                item.status = "未执行";
              }
              if (item.status == "14") {
                item.status = "执行中";
              }
              if (item.status == "15") {
                item.status = "执行完毕";
              }
            });

            this.instillationList.inpCode = this.searchForm.inpCode;
            this.instillationList.patientName = this.searchForm.patientName;
            this.instillationList.bedCode = this.searchForm.bedNo;

            onPreview(this.instillationList, "住院医嘱");
            resolve(tableList);
          });
        });
      },
    //   selectRow(list, row) {
    //     // 选择表格 成组全选
    //     this.tableList.map(item => {
    //       if (row.groupNo === item.groupNo && item.adviceId !== row.adviceId) {
    //         setTimeout(() => {
    //           this.$refs.multipleTable.toggleRowSelection(item);
    //         }, 0);
    //       }
    //     });

    //     this.selectedList = list;
    //   },

    //   handleSelectionChange(val) {
    //     // 表格发生变化是
    //     this.selectedList = val;
    //   },
      async fetchTableList() {
        this.searchForm.bedNo = this.receivePatientData.bedCode;
        this.searchForm.inpCode = this.receivePatientData.inpCode;
        this.searchForm.patientId = this.receivePatientData.patientId;
        // 请求医嘱方法
        let data = this.searchForm;
        let cloneData = Object.assign(data);
        /* for (let key in data) {
          if (key === "dateRange" && data[key] && data[key].length != 0) {
            cloneData["startDate"] = data[key][0];
            cloneData["endDate"] = data[key][1];
          }
        } */
        cloneData["startDate"] = (data.dateRange && data.dateRange[0]) || "";
        cloneData["endDate"] = (data.dateRange && data.dateRange[1]) || "";
        console.log(cloneData);
        // westAdviceGetAdvice(cloneData).then(data => {
        westAdviceGetAdvice(cloneData).then(data => {
          console.log(data);
          //debugger
          this.tableList = data.data;
          // 整理滴速显示
          this.tableList.forEach(item => {
            if(item.status == '0'){
              item.isEditingNum = true
            }
            if (item.dropRate && item.dropRate.indexOf("~") > -1) {
              let splitStr = item.dropRate.split("~");
              item.dropRate1 = splitStr[0];
              item.dropRate2 = splitStr[1];
            }else{
              item.dropRate1 = '';
              item.dropRate2 = '';
            }
          });


          this.grouping(data.data);
        });
      },
      grouping(list1) {
        // 将list 分组
        return new Promise((resolve, reject) => {
          let list = [];
          let groupList = [];
          let filterList = [];
          let tableList = [];
          groupList = list1.map(item => {
            // 获取所有组
            return item.groupNo;
          });

          groupList = Array.from(new Set(groupList));
          groupList = groupList.filter((item, index) => {
            // 数组去undefind
            return item !== undefined && item != "";
          });
          groupList.forEach((item, index) => {
            //遍历 成map结构 分组
            // list = [];
            filterList = list1.filter((sonItem, sonIde) => {
              return item === sonItem.groupNo;
            });
            list.push({
              key: item,
              value: filterList
            });
          });
          list.forEach(item => {
            // 将有组item添加class
            let itemList = item.value;
            if (itemList.length == 1) {
              return;
            }
            itemList.forEach((sonItem, sonIndex) => {
              if (sonIndex === 0) {
                sonItem.groupNoCls = "bunchingUp";
              } else if (sonIndex === itemList.length - 1) {
                sonItem.groupNoCls = "bunchingDown";
              } else {
                sonItem.groupNoCls = "bunchingCenter";
              }
            });
          });
          list.map(item => {
            // 更改list格式
            item.value.map(val => {
              tableList.push(val);
            });
          });
          list1.map(item => {
            // 补充未成组项
            if (!item.groupNo) {
              tableList.push(item);
            }
          });

          console.log(tableList);
          resolve(tableList);
        });
      },
      searchDrugName() {
        // 新增状态下 输入药品名称检索请求
      },
      selectDrug(row) {
        // 选择检索出的药品
        console.log(row);
        // 将药品相关信息 放入tableList
      },
    //   handleCurrentChange(row) {
    //     this.currentRow = row;
    //     // debugger
    //     this.itemName = row.name;
    //     this.itemSpec = row.spec;
    //     let data = {
    //       categoryCode: row.categoryCode,
    //       adviceId: row.adviceId
    //     };
    //     this.changeDrugName({ drugName: row.name });
    //     performance(data).then(res => {
    //       this.tableData = res.data;
    //     });
    //   },
      hiddenBottom() {
        // 底边栏显示隐藏
        this.bottomHidden = !this.bottomHidden;
        this.bottom = this.bottomHidden ? -240 : 0;
      },
      isCheckDisabled(row, index) {
        // 多选框是否禁用，true可用，false禁用
console.log("row",row)
        return (
          ((row.adviceType == 1 && row.status != 5) ||
          (row.adviceType == 2 && row.status != 5) ||
          (row.adviceType == 3 && row.status != 5) ||
          (row.adviceType == 19 && row.status != 5))&&row.status != 16
        );
      },
      handleHiddenAside() {
        // 侧边栏显示隐藏
        if (this.asideHidden) {
          this.asideWidth = 287;
          this.asideHidden = false;
        } else {
          this.asideWidth = 0;
          this.asideHidden = true;
        }
      },
      leadFormwork(m) {
        let data = {
          ids: m,
          inpCode: this.searchForm.inpCode,
          categoryCode: this.searchForm.categoryCode,
          patientId: this.searchForm.patientId,
          bedNo: this.searchForm.bedNo
        };
        leadAdviceFormwork(data)
          .then(res => {
            if (res.code === 1) {
              this.$message({
                type: "success",
                message: "引入成功!"
              });
              this.fetchTableList();
            } else {
              console.info(res);
              this.$message.error(res.msg || " 接口返回错误");
            }
          })
          .catch(() => {
            this.$message.error("引入失败！");
          });
      },
      setTableTop() {
        this.tableTop =
          this.$refs.SearchForm.clientHeight +
          this.$refs.btnGroup.clientHeight +
          20;
      },
      radioChange() {
        if (this.searchForm.categoryCode == "1") {
          this.showLeave = true;
          this.showShort = true;
          this.showPrise = true;
        } else if (this.searchForm.categoryCode == "2") {
          this.showPrise = true;
          this.showLeave = true;
          this.showShort = false;
        } else if (this.searchForm.categoryCode == "3") {
          this.showPrise = true;
          this.showLeave = false;
          this.showShort = true;
        }
        // 根据 长期 短期 出院带药 判断 初始的状态
        this.setFrequencyState();
        this.tableList = [];
        this.fetchTableList();
        this.$root.eventHub.$emit("radioType", this.searchForm.categoryCode);
      }
    },
    // computed: {
    //   ...mapGetters("base", ["receivePatientData"])
    // },
    computed: {
      isEditing() {
        // 判断当前是否有正在新增的医嘱
        let status = false;
        this.tableList.map(item => {
          if (item.isNew) {
            status = true;
          }
        });
        return status;
      },
      ...mapGetters("base",["receivePatientData", "role", "name"])
    },
    created() {
      this.changeDrugName({ drugName: ''});
      this.fetchTableList();
    },
    mounted() {
      setTimeout(() => {
        this.setTableTop();
      }, 10);
    },
    updated() {
      // this.maxHeight = this.$refs.page1.clientHeight - 120;
      this.setTableTop();
    },
    watch: {
    //   receivePatientData: {
    //     handler(c) {
    //       this.searchForm.inpCode = c.inpCode;
    //       this.searchForm.patientId = c.patientId;
    //       this.searchForm.bedNo = c.bedCode;
    //       this.searchForm.patientName = c.patientName;

    //       this.fetchTableList();
    //       this.$refs.bottomForm && this.$refs.bottomForm.hollow(); // 重置表单
    //     },
    //     immediate: true
    //   },
        receivePatientData: {
            //深度监听,可监听到对象、数组的变化
            handler(val) {
                this.wardsCode = val.wardId;
                this.fetchTableList(val);
            },
            deep: true
        },
      selectedList: {
        handler(c) {
          this.$store.dispatch("residentStation/setMultipleSelections", c);
        },
        deep: true
      }
    },
    beforeDestroy() {
      this.$root.eventHub.$off("radioType");
    }
  };
</script>

<style scoped lang="scss">
  .rightMedicalOrder {
    height: 100%;
    .ds-input {
      width: 60px;
    }
    .search-box {
      overflow: hidden;
      //line-height: 40px;
      padding-left: 20px;
      margin: 10px 0;

      .radio-group {
        float: left;
        margin-top: 25px;
      }

      .datePicker {
        margin: 15px 0 0 10px;

        // 修复datepicker 的删除按钮位置
        /deep/.el-date-editor .el-range__close-icon {
          position: unset;
        }
      }

      .select-item {
        margin-top: 15px;
        float: left;
        width: 120px;
        margin-left: 10px;
      }
    }

    .edit-btn-box {
      line-height: 40px;
      padding-left: 20px;
      margin: 10px 0;

      span {
        margin-right: 8px;
        line-height: 24px;
        font-size: 14px;
        i {
          display: inline-block;
          width: 24px;
          height: 24px;
          text-align: center;
          font-size: 14px !important;
        }
      }

      // 撤销按钮 比较大 需要 额外的margin-right
      .chexiaoSpan > i {
        margin-right: 10px;
      }

      .line {
        display: inline-block;
        border-right: 2px solid $l-color-bgcolor-11;
        margin-left: 0px;
        margin-right: 16px;
        height: 18px;
        position: relative;
        top: 5px;
      }
    }

    .disabled {
      color: $l-color-fontcolor-4;
    }

    .state-info {
      position: relative;
      font-size: 14px;
      
      font-weight: 400;
      display: inline-block;
      width: 100%;
      .state-info-icon {
        position: absolute;
        right: 0;
        width: 15px;
        height: 15px;
        display: inline-block;
        color: #ffd2c2;
        top: 0;
        cursor: pointer;
        z-index: 100;
      }
    }

    .detail-table {
      left: 0;
      width: 100%;
      transition: all 0.5s;

      .title {
        background-color: $l-color-bgcolor-18;
        padding-left: 10px;
        line-height: 30px;
        color: $l-color-fontcolor-3;
        font-size: 14px;

        span {
          width: 80px;
          height: 20px;
          text-align: center;
          left: 50%;
          top: 1px;
          transform: translateX(-50%);
          background-color: #fff;
          cursor: pointer;
          border: 1px solid $l-color-bgcolor-11;
          border-radius: 0px 2px 2px 0px;

          i {
            position: relative;
            top: -5px;
            transition: all 0.5s;
          }

          i.active {
            transform: rotate(-180deg);
          }
        }
      }
    }

    .bottom {
      //bottom: 0;
      //right: 0;
      //left: 0;
      height: 30%;
      //position: absolute;

      .tabs {
        padding: 10px 20px 20px 20px;

        /deep/ .el-tabs__content {
          height: calc(100% - 50px);
          /*overflow: auto;*/
        }
      }
    }
  }
  .bunchingUp {
    display: inline-block;
    color: $l-color-primary;

    &::after {
      content: "┓";
    }
  }

  .bunchingCenter {
    display: inline-block;
    color: $l-color-primary;

    &::after {
      content: "┫";
    }
  }

  .bunchingDown {
    color: $l-color-primary;
    display: inline-block;

    &::after {
      content: "┛";
    }
  }
</style>
