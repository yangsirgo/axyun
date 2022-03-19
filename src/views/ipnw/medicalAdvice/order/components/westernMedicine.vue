<template>
  <el-card class="rightMedicalOrder overflow-hidden height100">
    <div class="position-relative overflow-hidden" style=" height: 70%">
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
          <span class="cursor-pointer" @click="add" v-hotKey="{ func: 'func_add1' }">
            <i class="iconfont iconxinzeng"></i>
            {{ $t("cis.btn.add") }}
          </span>
          <!-- <span class="cursor-pointer" @click="temporarySave">
            <i class="iconfont iconzancun"></i>
            {{$t('cis.btn.shortSave')}}
          </span>-->
          <span class="cursor-pointer" @click="submitSave" v-hotKey="{ func: 'func_submit' }">
            <i class="iconfont icontijiao1"></i>
            {{ $t("cis.btn.submit") }}
          </span>
          <b class="line"></b>
          <span class="cursor-pointer" @click="adviceStop" v-hotKey="{ func: 'func_stop' }">
            <i class="iconfont icontingzhi"></i>
            停止
          </span>
          <span class="cursor-pointer" @click="adviceaAllStop" v-hotKey="{ func: 'func_all_stop' }">
            <i class="iconfont iconquanbutingzhi"></i>
            全部停止
          </span>
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
          <span
            class="cursor-pointer"
            @click="adviceCopyLong"
            v-hotKey="{ func: 'func_copy_long' }"
          >
            <i class="iconfont iconfuzhidaochangqi"></i>
            复制
          </span>
          <!-- <span
            class="cursor-pointer"
            @click="adviceCopyShort"
            v-hotKey="{func: 'func_copy_short'}"
          >
            <i class="iconfont iconfuzhidaoduanqicopy"></i>
            复制到临时
          </span>-->
          <span
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
          <!--   <span
            class="cursor-pointer"
            @click="adviceGonnaOut"
            v-hotKey="{func: 'func_garton_discharged'}"
          >
            <i class="iconfont iconjiadundaochuyuandaiyao"></i>
            加顿到出院带药
          </span>-->
          <span class="cursor-pointer" @click="deleteHandler" v-hotKey="{ func: 'func_delete' }">
            <i class="iconfont iconshanchu"></i>
            {{ $t("cis.btn.del") }}
          </span>
          <span class="cursor-pointer" @click="adviceCancel" v-hotKey="{ func: 'func_obsolete' }">
            <i class="iconfont iconzuofei"></i>
            作废
          </span>
          <b class="line"></b>
          <span class="cursor-pointer" @click="print" v-hotKey="{ func: 'func_print' }">
            <i class="iconfont icondayin"></i>
            {{ $t("cis.btn.print") }}
          </span>
        </div>
        <div
          class="position-absolute"
          :style="{
            top: tableTop + 'px',
            bottom: 30 + 'px',
            width: '100%',
            transition: 'all 0.5s'
          }"
        >
          <el-table
            v-hotKey="{
              func: ['table_row', 'table_checkbox', 'table_choose'],
              deClass: 'el-table__row',
              curClass: 'current-row'
            }"
            :data="tableList"
            ref="multipleTable"
            stripe
            highlight-current-row
            @current-change="handleCurrentChange"
            @selection-change="handleSelectionChange"
            @select="selectRow"
            border
            height="100%"
            style="width: 100%"
          >
            <el-table-column width="45">
              <el-table-column type="selection" :selectable="isCheckDisabled" width="45"></el-table-column>
            </el-table-column>
            <el-table-column :label="$t('cis.medicalOrder.start')">
              <el-table-column
                :label="$t('cis.medicalOrder.status')"
                show-overflow-tooltip
                min-width="90"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.status === '0'">暂存</span>
                  <span v-else-if="scope.row.status === '1'">已提交</span>
                  <!--  <span v-else-if="scope.row.status === '3'" class="disabled">审核通过</span>-->
                  <span v-else-if="scope.row.status === '4'">已停止</span>
                  <span v-else-if="scope.row.status === '5'" class="disabled">已作废</span>
                  <span v-else-if="scope.row.status === '13'">未执行</span>
                  <span v-else-if="scope.row.status === '14'">执行中</span>
                  <span v-else-if="scope.row.status === '15'">执行完毕</span>
                  <spangetHistoryByPatient
                    class="state-info"
                    v-else-if="
                      scope.row.status === '9' || scope.row.status === '12'
                    "
                  >
                    <span v-if="scope.row.status === '9'" class="disabled">审核驳回</span>
                    <span v-else class="disabled">停嘱驳回</span>
                    <el-popover trigger="hover" placement="right-start" popper-class="popper-class">
                      <div class="hoverContent">{{ scope.row.rejectReason }}</div>
                      <i slot="reference" class="el-icon-warning-outline state-info-icon"></i>
                    </el-popover>
                  </spangetHistoryByPatient>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('cis.medicalOrder.adviceTime')"
                prop="adviceTime"
                show-overflow-tooltip
                min-width="100"
              ></el-table-column>
              <el-table-column
                :label="$t('cis.medicalOrder.beginTime')"
                prop="beginTime"
                show-overflow-tooltip
                min-width="60"
              ></el-table-column>
            </el-table-column>
            <el-table-column :label="$t('cis.medicalOrder.medicalOrder')">
              <el-table-column
                :label="$t('cis.medicalOrder.name')"
                prop="name"
                show-overflow-tooltip
                min-width="220"
              ></el-table-column>
              <el-table-column :label="$t('cis.rpTableTitle.bunching')" min-width="40">
                <template slot-scope="scope">
                  <span :class="scope.row.groupNoCls"></span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('cis.rpTableTitle.spec')"
                prop="spec"
                show-overflow-tooltip
                min-width="80"
              ></el-table-column>
              <el-table-column
                :label="$t('cis.medicalOrder.uses')"
                prop="uses"
                show-overflow-tooltip
                min-width="60"
              >
                <template slot-scope="scope">
                  <span :val="scope.row.uses" code="MedicationRouteCode" v-codeTransform></span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('cis.medicalOrder.onceDosage')"
                prop="onceDosage"
                show-overflow-tooltip
                min-width="60"
              ></el-table-column>
              <el-table-column
                :label="$t('cis.rpTableTitle.frequencyCode')"
                prop="frequency"
                show-overflow-tooltip
                min-width="60"
              ></el-table-column>
              <el-table-column
                :label="$t('cis.medicalOrder.normalDate')"
                prop="normalDate"
                show-overflow-tooltip
                min-width="100"
              ></el-table-column>
              <el-table-column
                :label="$t('cis.medicalOrder.doctorName')"
                prop="doctorName"
                show-overflow-tooltip
                min-width="80"
              ></el-table-column>
              <el-table-column
                :label="$t('cis.medicalOrder.deptName')"
                prop="deptName"
                show-overflow-tooltip
                min-width="80"
              ></el-table-column>
            </el-table-column>
            <el-table-column :label="$t('cis.medicalOrder.stop')" min-width="100">
              <el-table-column
                :label="$t('cis.medicalOrder.stopDoctorTime')"
                prop="realityStopDates"
                show-overflow-tooltip
                min-width="100"
              ></el-table-column>
              <el-table-column
                :label="$t('cis.medicalOrder.endTime')"
                prop="realityStopTimes"
                show-overflow-tooltip
                min-width="100"
              ></el-table-column>
              <el-table-column
                :label="$t('cis.medicalOrder.stopDoctorName')"
                prop="stopDoctorName"
                show-overflow-tooltip
                min-width="100"
              ></el-table-column>
              <el-table-column
                :label="$t('cis.medicalOrder.Nurse')"
                prop="stopAuditName"
                show-overflow-tooltip
                min-width="100"
              ></el-table-column>
            </el-table-column>
            <el-table-column :label="$t('cis.medicalOrder.other')" min-width="100">
              <el-table-column
                :label="$t('cis.medicalOrder.ExecutiveRoom')"
                prop="execute_depart"
                show-overflow-tooltip
                min-width="100"
              ></el-table-column>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div
        class="position-absolute detail-table"
        ref="bottomForm"
        :style="{ bottom: bottom + 'px', zIndex: 100 }"
      >
        <div class="title position-relative">
          <!-- <span v-if="itemName && itemSpec"
            >{{ itemName }} ，{{ itemSpec }}，</span
          >-->
          执行明细
          <span class="position-absolute" @click="hiddenBottom">
            <i
              :class="
                bottomHidden
                  ? 'el-icon-arrow-down active'
                  : 'el-icon-arrow-down'
              "
            ></i>
          </span>
        </div>
        <el-table :data="tableData" border style="width: 100%;" height="240px">
          <el-table-column prop="state" :label="$t('cis.medicalOrder.name')">
            <template slot-scope="scope">
              <span>{{ scope.row.performanceName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="state" :label="$t('cis.medicalOrder.status')">
            <template slot-scope="scope">
              <span>{{ scope.row.performanceStatus}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" :label="$t('cis.medicalOrder.eeTime')">
            <template slot-scope="scope">
              <span>{{ scope.row.performanceExpectTime }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="address" :label="$t('cis.medicalOrder.eTime')">
            <template slot-scope="scope">
              <span>{{ scope.row.performanceTime }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="address" :label="$t('cis.medicalOrder.person')">
            <template slot-scope="scope">
              <span>{{ scope.row.execUserName }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="address"
            :label="$t('cis.medicalOrder.room')">
          </el-table-column>-->
        </el-table>
      </div>
    </div>
    <div style="height: 30%;" class="bottom">
      <el-tabs class="height100 tabs" v-model="activeName">
        <el-tab-pane label="药品医嘱录入" name="first">
          <bottom-form
            v-if="activeName === 'first'"
            ref="bottomForm"
            @save="bottomFormSave"
            :radioValue="searchForm.categoryCode"
            :row="currentRow"
          ></bottom-form>
        </el-tab-pane>
        <el-tab-pane label="药品模板" name="second">
          <save-tpl v-if="activeName === 'second'" hosType="3"></save-tpl>
        </el-tab-pane>
        <el-tab-pane label="非药品医嘱录入" name="third">
          <bottom-module v-if="activeName === 'third'"     ref="bottomModule"     :radioValue="searchForm.categoryCode"
                         @save="bottomFormSave"></bottom-module>
        </el-tab-pane>
      </el-tabs>
    </div>
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
    rescind
  } from "@/api/cis/resident/residentAdvice";
  import { leadAdviceFormwork } from "@/api/cis/resident/residentAdviceFormwork";
  import { onPreview, onPrint } from "@/utils/print";
  import saveTpl from "./saveTemplate.vue";

  export default {
    name: "medicalOrderMain",
    props: ["ids"],
    data() {
      return {
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
              prop: "drugName",
              label: "药品名称",
              width: 150
            },
            {
              prop: "spec",
              label: "规格",
              width: 80
            },
            {
              prop: "type",
              label: "类别",
              width: 80
            },
            {
              prop: "reimbursement",
              label: "报销",
              width: 80
            },
            {
              prop: "assembly",
              label: "整装",
              width: 80
            },
            {
              prop: "price",
              label: "单价",
              width: 80
            },
            {
              prop: "stock",
              label: "库存数量",
              width: 80
            },
            {
              prop: "factory",
              label: "生产厂家",
              width: 80
            },
            {
              prop: "pharmacy",
              label: "药房",
              width: 80
            }
          ],
          selectOptions: [
            {
              id: 1,
              drugName: "胃舒平片", // 药品名称
              spec: "100片/瓶", // 规格
              stock: "100", // 库存
              referencePurchasePrice: "6", // 参考进价
              referenceSellPrice: "8", // 参考售价
              remark: "阑尾炎、急腹症患者禁用", // 备注
              packing: "天津制药有限公司 ", // 包装单位
              dosagForm: "天津制药有限公司" // 剂型单位
            }
          ]
        }
      };
    },
    components: {
      BottomForm,
      saveTpl,
      bottomModule
    },
    methods: {
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
      add() {
        // 新增
        // 用户没有选择 患者提示
        if (!this.receivePatientData.patientId) {
          this.$message.error("请选择患者！");
          return;
        }
        this.$refs.bottomForm && this.$refs.bottomForm.hollow();
        document
          .getElementById("bottomFormInputTable")
          .getElementsByClassName("el-input__inner")[0]
          .focus();
      },
      temporarySave() {
        // 暂存
      },
      submitSave() {
        // 提交
        if (this.validate()) {
          this.selectedList.forEach(item => {
            /*  item.beginTime = "";*/
            item.adviceTime = item.adviceTimes;
          });
          let data = this.selectedList;
          adviceSubmit(data)
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
        if (this.selectedList.length > 0) {
          //最少选中一项
          this.$confirm("删除后不可恢复，是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              let serverList = this.selectedList.filter(item => {
                //需要传到后端删除的 数据 通过有无 id 判断
                // 对 tableData 中的 row_id 处理
                if (item.row_id != "" || item.row_id !== undefined) {
                  tableData.splice(
                    tableData.findIndex(
                      innerItem => innerItem.row_id === item.row_id
                    ),
                    1
                  ); // 删除用户新增的数据 通过判断 row_id 进行删除
                }
                return item.adviceId;
              });

              if (serverList.length > 0) {
                adviceDelete(serverList).then(res => {
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
              }
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消删除"
              });
            });
        } else {
          this.$message.warning("请选择后再删除！");
        }
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
      bunchingHandler() {
        if (this.bunchingValidate()) {
          // this.setBunchingSelect ();
          let data = this.selectedList;
          bunching(data)
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
      adviceStop() {
        if (this.validate()) {
          let data = this.selectedList;
          stop(data)
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
      adviceRescind() {
        if (this.validate()) {
          let data = this.selectedList;
          rescind(data)
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
            unbunching(data).then(res => {
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

        getAdvice(cloneData).then(data => {
          //debugger
          /*  alert(data.data.name[0]);
          this.instillationData.instillation = data.data.name;*/
          let list1 = data.data;
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
      selectRow(list, row) {
        // 选择表格 成组全选
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
      },
      async fetchTableList() {
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
        getAdvice(cloneData).then(data => {
          console.log(data);
          //debugger
          this.tableList = data.data;
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
      handleCurrentChange(row) {
        this.currentRow = row;
        // debugger
        this.itemName = row.name;
        this.itemSpec = row.spec;
        let data = {
          categoryCode: row.categoryCode,
          adviceId: row.adviceId
        };
        this.changeDrugName({ drugName: row.name });
        performance(data).then(res => {
          this.tableData = res.data;
        });
      },
      hiddenBottom() {
        // 底边栏显示隐藏
        this.bottomHidden = !this.bottomHidden;
        this.bottom = this.bottomHidden ? -240 : 0;
      },
      isCheckDisabled(row, index) {
        // 多选框是否禁用

        return (
          (row.adviceType == 1 && row.status != 5) ||
          (row.adviceType == 2 && row.status != 5) ||
          (row.adviceType == 3 && row.status != 5) ||
          (row.adviceType == 19 && row.status != 5)
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
        this.tableList = [];
        this.fetchTableList();
        this.$root.eventHub.$emit("radioType", this.searchForm.categoryCode);
      }
    },
    computed: {
      ...mapGetters("base", ["receivePatientData"])
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
      receivePatientData: {
        handler(c) {
          this.searchForm.inpCode = c.inpCode;
          this.searchForm.patientId = c.patientId;
          this.searchForm.bedNo = c.bedCode;
          this.searchForm.patientName = c.patientName;

          this.fetchTableList();
          this.$refs.bottomForm && this.$refs.bottomForm.hollow(); // 重置表单
        },
        immediate: true
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
