<template>
  <el-card class="rightMedicalOrder overflow-hidden height100">
    <div class="position-relative overflow-hidden" style=" height: 70%">
      <div>
        <div ref="SearchForm" class="search-box">
          <el-radio-group class="radio-group" v-model="searchForm.categoryCode" @change="chChange">
            <el-radio :label="1">{{$t('cis.medicalOrder.long')}}</el-radio>
            <el-radio :label="2">{{$t('cis.medicalOrder.short')}}</el-radio>
            <el-radio :label="3">{{$t('cis.medicalOrder.outWithMedicine')}}</el-radio>
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
          <!-- <el-select class="select-item" v-model="searchForm.value1" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>-->
          <el-select class="select-item" v-model="searchForm.status" placeholder="请选择">
            <el-option label="全部" value="0">全部</el-option>
            <el-option label="已作废" value="5">已作废</el-option>
            <el-option label="待审核" value="1">待审核</el-option>
            <el-option label="已停止" value="4">已停止</el-option>
            <el-option label="已执行" value="12">已执行</el-option>
            <el-option label="未执行" value="11">未执行</el-option>
          </el-select>
          <el-select class="select-item" v-model="searchForm.deptType">
            <el-option label="本科医嘱" value="1">本科医嘱</el-option>
            <el-option label="其他科室医嘱" value="2">其他科室医嘱</el-option>
          </el-select>
          <el-select class="select-item" v-model="searchForm.adviceType" placeholder="请选择">
            <el-option label="全部类型" value="1">全部类型</el-option>
            <el-option label="医嘱单" value="2">医嘱单</el-option>
            <el-option label="护理记录" value="3">护理记录</el-option>
            <el-option label="耗材单" value="4">耗材单</el-option>
          </el-select>
          <el-input
            class="select-item"
            style="width: 193px;"
            placeholder="医嘱关键字"
            suffix-icon="el-icon-search"
            v-model="searchForm.name"
          ></el-input>
          <el-button
            style="margin-left: 10px;float: left;margin-top: 12px;"
            @click="searchAdv"
            type="primary"
          >{{$t('cis.btn.check')}}</el-button>
        </div>
        <div ref="btnGroup" class="edit-btn-box">
          <span class="cursor-pointer" @click="add">
            <i class="iconfont iconxinzeng"></i>
            {{$t('cis.btn.add')}}
          </span>
          <span class="cursor-pointer" @click="temporarySave">
            <i class="iconfont iconzancun"></i>
            {{$t('cis.btn.shortSave')}}
          </span>
          <span class="cursor-pointer">
            <i class="iconfont icontijiao1" @click="submitSave"></i>
            {{$t('cis.btn.submit')}}
          </span>
          <b class="line"></b>
          <!-- <span class="cursor-pointer" @click="backSpace">
            <i class="iconfont iconchexiao" style="font-size: 8px"></i>
            {{$t('cis.btn.return')}}
            <b class="el-icon-arrow-down"></b>
          </span>-->
          <span class="cursor-pointer" @click="adviceStop">
            <i class="iconfont iconshanchu"></i>
            停止
          </span>
          <span class="cursor-pointer" @click="adviceaAllStop">
            <i class="iconfont iconshanchu"></i>
            全部停止
          </span>
          <span class="cursor-pointer" @click="adviceCancel">
            <i class="iconfont iconshanchu"></i>
            作废
          </span>
          <span class="cursor-pointer" @click="bunchingHandler">
            <i class="iconfont iconshanchu"></i>
            成组
          </span>
          <span class="cursor-pointer" @click="cancelBunching">
            <i class="iconfont iconshanchu"></i>
            取消成组
          </span>
          <span class="cursor-pointer" @click="adviceCopyLong">
            <i class="iconfont iconshanchu"></i>
            复制到长期
          </span>
          <span class="cursor-pointer" @click="adviceCopyShort">
            <i class="iconfont iconshanchu"></i>
            复制到短期
          </span>
          <span class="cursor-pointer" @click="cancelBunching">
            <i class="iconfont iconshanchu"></i>
            加顿
          </span>
          <span class="cursor-pointer" @click="deleteHandler">
            <i class="iconfont iconshanchu"></i>
            {{$t('cis.btn.del')}}
          </span>
          <b class="line"></b>
          <span class="cursor-pointer" @click="print">
            <i class="iconfont icondayin"></i>
            {{$t('cis.btn.print')}}
          </span>
        </div>
        <div
          class="position-absolute"
          :style="{top: tableTop + 'px', bottom: 120 + Number(bottom) + 20 + 'px', width: '100%', transition: 'all 0.5s'}"
        >
          <el-table
            :data="tableList"
            ref="multipleTable"
            stripe
            highlight-current-row
            @current-change="handleCurrentChange"
            @select="selectRow"
            border
            height="100%"
            style="width: 100%"
          >
            <el-table-column width="45">
              <el-table-column type="selection" width="45"></el-table-column>
            </el-table-column>
            <el-table-column :label="$t('cis.medicalOrder.start')">
              <el-table-column
                :label="$t('cis.medicalOrder.status')"
                show-overflow-tooltip
                min-width="80"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.status === 0">已审核</span>
                  <span v-else-if="scope.row.status === 1">已提交</span>
                  <span v-else-if="scope.row.status === 2" class="disabled">暂存</span>
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
              ></el-table-column>
              <el-table-column
                :label="$t('cis.medicalOrder.usages')"
                prop="usages"
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
                prop="stopDoctorTime"
                show-overflow-tooltip
                min-width="100"
              ></el-table-column>
              <el-table-column
                :label="$t('cis.medicalOrder.endTime')"
                prop="endTime"
                show-overflow-tooltip
                min-width="100"
              ></el-table-column>
              <el-table-column
                :label="$t('cis.medicalOrder.stopDoctorName')"
                prop="end_doctor"
                show-overflow-tooltip
                min-width="100"
              ></el-table-column>
              <el-table-column
                :label="$t('cis.medicalOrder.Nurse')"
                prop="end_nurse"
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
      <div class="position-absolute detail-table" ref="bottomForm" :style="{bottom: bottom + 'px'}">
        <div class="title position-relative">
          七叶皂苷钠注射液，10mg/支，执行明细
          <span class="position-absolute" @click="hiddenBottom">
            <i :class="bottomHidden?'el-icon-arrow-down active':'el-icon-arrow-down'"></i>
          </span>
        </div>
        <el-table :data="tableData" border style="width: 100%;">
          <el-table-column prop="state" :label="$t('cis.medicalOrder.state')">
            <template slot-scope="scope">
              <span>{{scope.row.state}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" :label="$t('cis.medicalOrder.eeTime')"></el-table-column>
          <el-table-column prop="address" :label="$t('cis.medicalOrder.eTime')"></el-table-column>
          <el-table-column prop="address" :label="$t('cis.medicalOrder.person')"></el-table-column>
          <el-table-column prop="address" :label="$t('cis.medicalOrder.room')"></el-table-column>
        </el-table>
      </div>
    </div>
    <div style="height: 30%;">
      <bottom-form @save="bottomFormSave" :radioValue="searchForm.categoryCode" :row="currentRow"></bottom-form>
    </div>
  </el-card>
</template>

<script>
import BottomForm from "./bottomForm";
import { mapGetters } from "vuex";

import {
  adviceDelete,
  allStop,
  bunching,
  cancel,
  copyLong,
  copyShort,
  getAdvice,
  gonna,
  stop,
  unbunching
} from "@/api/cis/resident/residentAdvice";

export default {
  name: "medicalOrderMain",
  data() {
    return {
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
      tableTop: "", // table定位距离上面距离
      bottom: "0", // 底部详情列表位置
      bottomHidden: false, // 底部详情列表显示隐藏
      //  查询条件
      searchForm: {
        categoryCode: 1,
        inpId: "",
        dateRange: "",
        name: "", // 医嘱查询关键词
        status: "0", //
        deptType: "1", //
        adviceType: "1" //
      },
      tableColumn: [],
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
    BottomForm
  },
  methods: {
    bottomFormSave() {
      // 此处写 table的ajax 方法 刷新页面
      console.log("刷新页面");
    },
    // 查询医嘱按钮

    // 医嘱编辑操作按钮
    add() {
      // 新增
      // let obj = {
      //   _primary_id: + new Date(),
      //   state: '', // 0 已审核 1 已提交 2 暂存
      //   start_date: '', // 开始日期
      //   start_time: '', // 开始时间
      //   name: '', // 名称
      //   spec: '', // 规格
      //   dose: '', // 用量
      //   useage: '', // 用法
      //   frequency: '', // 频次
      //   normal_time: '', // 常规时间
      //   adv_people: '', // 开嘱人
      //   adv_depart: '', // 开嘱科室
      //   end_date: '', // 停止日期
      //   end_time: '', // 结束时间
      //   end_doctor: '', // 结束医生
      //   end_nurse: '', // 结束护士
      //   execute_depart: '', // 执行科室
      //   isEditing: true // 是否为编辑状态
      // }
      // this.tableList.push(obj)
    },
    temporarySave() {
      // 暂存
    },
    submitSave() {
      // 提交
    },
    backSpace() {
      // 撤销
    },
    deleteHandler() {
      let tableData = this.tableData;
      if (this.selectedList.length > 0) {
        //最少选中一项
        this.$confirm("是否要删除", "提示", {
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
    //成组 处理
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
    //停止
    adviceStop() {
      // this.setBunchingSelect ();
      let data = this.selectedList;
      if (this.validate) {
      }
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
    },
    //全部停止
    adviceaAllStop() {
      let inpIds = this.tableList[1].inpId;
      let data = {
        inpId: inpIds
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
        // 成组最少两个成员
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
    //作废
    adviceCancel() {
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
    },
    //复制到长期
    adviceCopyLong() {
      let data = this.selectedList;
      // this.setBunchingSelect ();
      copyLong(data)
        .then(res => {
          if (res.code === 1) {
            this.$message({
              type: "success",
              message: "复制到长期成功!"
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
    },
    //复制到短期
    adviceCopyShort() {
      let data = this.selectedList;
      if (this.validate()) {
        // this.setBunchingSelect ();
        copyShort(data)
          .then(res => {
            if (res.code === 1) {
              this.$message({
                type: "success",
                message: "复制到短期成功!"
              });
              this.fetchTableList();
            } else {
              console.info(res);
              this.$message.error(res.msg || " 接口返回错误");
            }
          })
          .catch(() => {
            this.$message.error("复制到短期失败！");
          });
      } else {
      }
    },
    //加顿
    adviceGonna() {
      let data = this.selectedList;
      // this.setBunchingSelect ();
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
    print() {
      // 打印
    },
    selectRow(list) {
      // 选择表格 成组全选
      console.log(list);
      list.forEach(row => {
        this.tableList.map(item => {
          if (
            row.group_num === item.group_num &&
            item._primary_id !== row._primary_id
          ) {
            setTimeout(() => {
              this.$refs.multipleTable.toggleRowSelection(item);
            }, 0);
          }
        });
      });
      this.selectedList = list;
    },

    searchAdv() {
      this.fetchTableList();
    },
    async fetchTableList() {
      // 请求医嘱方法
      let data = this.searchForm;
      getAdvice(data).then(data => {
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
        console.log(list1);
        groupList = list1.map(item => {
          // 获取所有组
          return item.group_num;
        });

        groupList = Array.from(new Set(groupList));
        groupList = groupList.filter((item, index) => {
          // 数组去undefind
          return item !== undefined;
        });

        groupList.forEach((item, index) => {
          //遍历 成map结构 分组
          // list = [];
          filterList = list1.filter((sonItem, sonIde) => {
            return item === sonItem.group_num;
          });
          list.push({
            key: item,
            value: filterList
          });
        });
        list.forEach(item => {
          // 将有组item添加class
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
        list.forEach(item => {
          // 更改list格式
          item.value.forEach(val => {
            tableList.push(val);
          });
        });
        list1.forEach(item => {
          // 补充未成组项
          if (!item.group_num) {
            tableList.push(item);
          }
        });
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
      // 医嘱单项选中后更改医嘱详情
      console.log(row);
      this.currentRow = row;
      // 请求单项详情
    },
    hiddenBottom() {
      // 底边栏显示隐藏
      this.bottomHidden = !this.bottomHidden;
      this.bottom = this.bottomHidden ? -90 : 0;
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
    }
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"])
  },
  created() {
    this.fetchTableList();
  },
  updated() {
    // this.maxHeight = this.$refs.page1.clientHeight - 120;
    this.tableTop =
      this.$refs.SearchForm.clientHeight + this.$refs.btnGroup.clientHeight;
  },
  watch: {
    receivePatientData: {
      handler(c) {
        this.searchForm.inpId = c.inpCode;
        this.fetchTableList();
      },
      immediate: true
    }
  }
};
</script>

<style scoped lang="scss">
.rightMedicalOrder {
  height: 100%;

  .search-box {
    overflow: hidden;
    line-height: 60px;
    padding-left: 20px;

    .radio-group {
      float: left;
      margin-top: 20px;
    }

    .datePicker {
      margin: 12px 0 0 10px;
    }

    .select-item {
      float: left;
      width: 120px;
      margin-left: 10px;
    }
  }

  .edit-btn-box {
    line-height: 60px;
    padding-left: 20px;

    span {
      margin-right: 23px;

      i {
        font-size: 14px;
        margin-right: 10px;
      }
    }

    .line {
      display: inline-block;
      border-right: 2px solid $l-color-bgcolor-11;
      margin-left: 7px;
      margin-right: 23px;
      height: 18px;
      position: relative;
      top: 5px;
    }
  }

  .disabled {
    color: $l-color-fontcolor-4;
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
}
</style>
