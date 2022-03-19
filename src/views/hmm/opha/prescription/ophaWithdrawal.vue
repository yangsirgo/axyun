<template>
  <div class="height100 three-column">
    <!--center-->
    <div id="center" class="column">
      <div class="box">
        <el-card class="height100">
          <el-row :gutter="20" class="rightinput">
            <el-col :offset="12" :span="12" style="text-align: right">
              <el-button
                class="filter-item"
                type="text"
                icon="el-icon-printer"
                @click="delivery"
              >确认退药</el-button>
              <el-button class="filter-item" type="text" icon="el-icon-printer">打印</el-button>
            </el-col>
          </el-row>
          <el-form label-width="90px" :model="recipeForm">
            <el-row class="cftitle">
              <el-col :span="8" :offset="8">
                <span class="title">门诊处方</span>
              </el-col>
              <el-col :span="4" class="bfcolor">
                <el-form-item label="费别:" class="float-left">
                  <span>{{recipeForm.feeType}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="4" class="bfcolor">
                <el-form-item label="处方号:" class="float-left">
                  <span>{{recipeForm.recipeCode}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="padding:5px 10px;" :gutter="20">
              <el-col :span="8">
                <LFormtTitle label="姓名" class="disabled">
                  <el-input v-model="recipeForm.patientNamee" disabled style="line-height: 34px;">
                    <template slot="append"></template>
                  </el-input>
                </LFormtTitle>
              </el-col>

              <el-col :span="8">
                <LFormtTitle label="性别" class="disabled">
                  <el-input v-model="recipeForm.patientGender" disabled style="line-height: 34px;">
                    <template slot="append"></template>
                  </el-input>
                </LFormtTitle>
              </el-col>

              <el-col :span="8">
                <LFormtTitle label="年龄" class="disabled">
                  <el-input v-model="recipeForm.patientAge" disabled style="line-height: 34px;">
                    <template slot="append"></template>
                  </el-input>
                </LFormtTitle>
              </el-col>
            </el-row>
            <el-row style="padding:5px 10px;" :gutter="20">
              <el-col :span="12">
                <LFormtTitle label="病人编号" labelWidth="64" class="disabled">
                  <el-input v-model="recipeForm.patientCode" disabled style="line-height: 34px;">
                    <template slot="append"></template>
                  </el-input>
                </LFormtTitle>
              </el-col>
              <el-col :span="12">
                <LFormtTitle label="科室" class="disabled">
                  <el-input v-model="recipeForm.doctorDeptName" disabled style="line-height: 34px;">
                    <template slot="append"></template>
                  </el-input>
                </LFormtTitle>
              </el-col>
            </el-row>
            <el-row style="padding:5px 10px;" :gutter="20">
              <el-col :span="12">
                <LFormtTitle label="地址" class="disabled">
                  <el-input v-model="recipeForm.patientAddr" disabled style="line-height: 34px;">
                    <template slot="append"></template>
                  </el-input>
                </LFormtTitle>
              </el-col>

              <el-col :span="12">
                <LFormtTitle label="联系电话" labelWidth="64" class="disabled">
                  <el-input v-model="recipeForm.phoneNum" disabled style="line-height: 34px;">
                    <template slot="append"></template>
                  </el-input>
                </LFormtTitle>
              </el-col>
            </el-row>
            <el-row style="padding:5px 10px;" :gutter="20">
              <el-col :span="12">
                <LFormtTitle label="临床医嘱" labelWidth="64" class="disabled">
                  <el-input v-model="recipeForm.clinicDiag" disabled style="line-height: 34px;">
                    <template slot="append"></template>
                  </el-input>
                </LFormtTitle>
              </el-col>
              <el-col :span="12">
                <LFormtTitle label="医嘱时间" labelWidth="64" class="disabled">
                  <el-input v-model="recipeForm.orderTime" disabled style="line-height: 34px;">
                    <template slot="append"></template>
                  </el-input>
                </LFormtTitle>
              </el-col>
            </el-row>
            <el-row style="padding:5px 10px;" :gutter="20">
              <el-col :span="8">
                <LFormtTitle label="开单医生" labelWidth="64" class="disabled">
                  <el-input v-model="recipeForm.doctorUserName" disabled style="line-height: 34px;">
                    <template slot="append"></template>
                  </el-input>
                </LFormtTitle>
              </el-col>
              <el-col :span="8">
                <LFormtTitle label="收费人员" labelWidth="64" class="disabled">
                  <el-input v-model="recipeForm.chargeUserName" disabled style="line-height: 34px;">
                    <template slot="append"></template>
                  </el-input>
                </LFormtTitle>
              </el-col>
              <el-col :span="8">
                <LFormtTitle label="总金额" labelWidth="64" class="disabled">
                  <el-input
                    v-model="recipeForm.prescriptionAmt"
                    disabled
                    style="line-height: 34px;"
                  >
                    <template slot="append"></template>
                  </el-input>
                </LFormtTitle>
              </el-col>
            </el-row>
            <el-row style="padding:5px 10px;" :gutter="20">
              <el-col :span="12">
                <LFormtTitle label="配方人员" labelWidth="64" class="disabled">
                  <el-input
                    v-model="recipeForm.dispenseUserName"
                    disabled
                    style="line-height: 34px;"
                  >
                    <template slot="append"></template>
                  </el-input>
                </LFormtTitle>
              </el-col>
              <el-col :span="12">
                <LFormtTitle label="发药人员" labelWidth="64" class="disabled">
                  <el-input
                    v-model="recipeForm.deliveryUserName"
                    disabled
                    style="line-height: 34px;"
                  >
                    <template slot="append"></template>
                  </el-input>
                </LFormtTitle>
              </el-col>
            </el-row>
            <el-row style="padding:5px 10px;" :gutter="20">
              <el-col :span="24">
                <LFormtTitle label="退费原因" labelWidth="64" class="disabled">
                  <el-input
                    v-model="recipeForm.dispenseUserName"
                    disabled
                    style="line-height: 34px;"
                  >
                    <template slot="append"></template>
                  </el-input>
                </LFormtTitle>
              </el-col>
            </el-row>

            <el-row style="padding:5px 10px;height:300px;">
              <!-- 详细药品表格 -->
              <el-table :data="orderTable" border height="300">
                <el-table-column prop="drugName" label="药品名称" min-width="100"></el-table-column>
                <el-table-column prop="spec" label="规格" min-width="150"></el-table-column>
                <el-table-column prop="price" label="进价" min-width="80" show-overflow-tooltip></el-table-column>
                <el-table-column prop="price" label="售价" min-width="80" show-overflow-tooltip></el-table-column>
                <el-table-column prop="price" label="产地" min-width="80" show-overflow-tooltip></el-table-column>
                <el-table-column prop="price" label="发药数量" min-width="80" show-overflow-tooltip></el-table-column>
                <el-table-column prop="price" label="申请数量" min-width="80" show-overflow-tooltip></el-table-column>
                <el-table-column label="审核数量" min-width="80">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.price"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="备注" min-width="80">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.price"></el-input>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </el-form>
        </el-card>
      </div>
    </div>

    <!--left-->
    <div id="left" class="column" ref="left">
      <div class="box">
        <el-card class="height100">
          <div class="table-top padding20">
            <el-row>
              <el-radio-group
                v-model="searchparam.searchType"
                @change="radioChange"
                style="width: 100%"
              >
                <el-col :span="6">
                  <el-radio label="0">收费日期</el-radio>
                </el-col>
                <el-col :span="6">
                  <el-radio label="1">读卡</el-radio>
                </el-col>
                <el-col :span="6">
                  <el-radio label="2">收据号</el-radio>
                </el-col>
                <el-col :span="6">
                  <el-radio label="3">处方号</el-radio>
                </el-col>
              </el-radio-group>
            </el-row>
            <el-row>
              <el-col :span="16">
                <el-date-picker
                  v-model="searchparam.date"
                  v-show="searchparam.dateShow"
                  style="width:100%"
                  type="datetimerange"
                  align="right"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['12:00:00', '08:00:00']"
                ></el-date-picker>
                <el-input
                  v-model="searchparam.queryValue"
                  v-show="searchparam.inputShow"
                  :class="{cardInput: searchparam.searchType === '1'}"
                ></el-input>
                <el-button v-show="searchparam.icShow" class type="success">IC</el-button>
              </el-col>
              <el-col :span="8">
                <el-select
                  v-model="searchparam.deliveryState"
                  clearable
                  placeholder="请选择"
                  class="deliveryState"
                >
                  <el-option value="0" label="未发药"></el-option>
                  <el-option value="1" label="已发药"></el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row style="margin-top:10px;">
              <el-col :span="9">
                <el-button @click="search(2)" class type="primary" plain>往日处方查询</el-button>
              </el-col>
              <el-col :span="9">
                <el-button @click="search(1)" class type="primary" plain>本日处方查询</el-button>
              </el-col>
              <el-col :span="6">
                <el-button @click="search(0)" class type="primary">查询</el-button>
              </el-col>
            </el-row>
          </div>

          <!--排序-->
          <div class="sorttitle">
            <l-sort-label class="inline-block" label="处方号" state="2" @click="listsort('key1')"></l-sort-label>
            <l-sort-label class="inline-block" label="科室" state="2" @click="listsort('key2')"></l-sort-label>
            <l-sort-label class="inline-block" label="总金额" state="2" @click="listsort('key3')"></l-sort-label>
            <l-sort-label class="inline-block" label="收费时间" state="2" @click="listsort('key4')"></l-sort-label>
          </div>
          <!--表单-->
          <div class="infinite-list-wrapper" style="height:500px;">
            <div
              class="list-container overflow-scroll-vertical"
              v-infinite-scroll="load"
              infinite-scroll-disabled="disabled"
            >
              <div
                :class="curSelectedIndex == i?'list-item active':'list-item'"
                v-for="(item, i) in purchaseList"
                :key="i"
                @click="curSelectedIndex = i"
              >
                <div class="item-label">
                  <span class="label margin-right-6">处方号</span>
                  <span>{{item.recipeCode}}</span>
                  <span class="label margin-right-6">病人姓名:</span>
                  <span>{{item.patientName}}</span>
                </div>
                <div class="item-label">
                  <span class="label margin-right-6">性别:</span>
                  <span>{{item.patientGender}}</span>
                  <span class="label margin-right-6">年龄:</span>
                  <span>{{item.patientAge}}</span>
                  <span class="label margin-right-6">总金额:</span>
                  <span>{{item.totalprice}}</span>
                </div>
                <div class="item-label">
                  <span class="label margin-right-6">科室:</span>
                  <span class="margin-right-10">{{item.doctorDeptName}}</span>
                  <span class="label margin-right-6">开单医生:</span>
                  <span>{{item.doctorUserName}}</span>
                </div>
                <div class="item-label">
                  <span class="label margin-right-6">收费人:</span>
                  <span class="margin-right-10">{{item.dispenseUserName}}</span>
                  <span class="label margin-right-6">提交时间:</span>
                  <span>{{item.submitTime}}</span>
                </div>
              </div>
              <p v-if="loading" class="bottom-container">加载中...</p>
              <p v-if="noMore" class="bottom-container">没有更多了</p>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <!--right工具箱-->
    <div id="right" class="column" ref="right">
      <div class="box">我是right</div>
    </div>
  </div>
</template>

<script>
import LFormtTitle from "@/components/LFormtTitle.vue";
import adHeight from "@/mixins/adHeight";
import opha from "@/api/hmm/opha";
import base from "@/api/hmm/base";
export default {
  mixins: [adHeight],
  data() {
    return {
      //左侧搜索
      //定义搜索条件
      searchparam: {
        searchType: "",
        dispenseUserId: "",
        windowCode: "",
        date: "",
        queryValue: "",
        dateShow: false,
        inputShow: true,
        icShow: true
      },

      deliveryState: "",

      //左侧表格数据源
      purchaseList: [
        {
          recipeCode: "", //处方号
          patientName: "lisa", // 病人姓名
          patientGender: "女", //性别
          patientAge: "15", // patientAge
          totalprice: "200,000.00", //总进价金额：
          doctorDeptName: "科室", // 科室
          doctorUserName: "李医生", // 开单医生
          dispenseUserName: "刘星1", // 收费人
          submitTime: "2019-01-01 01:01:01" // 提交时间
        },
        {
          recipeCode: "", //处方号
          patientName: "lisa", // 病人姓名
          patientGender: "女", //性别
          patientAge: "15", // patientAge
          totalprice: "200,000.00", //总进价金额：
          doctorDeptName: "科室", // 科室
          doctorUserName: "李医生", // 开单医生
          dispenseUserName: "刘星1", // 收费人
          submitTime: "2019-01-01 01:01:01" // 提交时间
        },
        {
          recipeCode: "", //处方号
          patientName: "lisa", // 病人姓名
          patientGender: "女", //性别
          patientAge: "15", // patientAge
          totalprice: "200,000.00", //总进价金额：
          doctorDeptName: "科室", // 科室
          doctorUserName: "李医生", // 开单医生
          dispenseUserName: "刘星1", // 收费人
          submitTime: "2019-01-01 01:01:01" // 提交时间
        },
        {
          recipeCode: "", //处方号
          patientName: "lisa", // 病人姓名
          patientGender: "女", //性别
          patientAge: "15", // patientAge
          totalprice: "200,000.00", //总进价金额：
          doctorDeptName: "科室", // 科室
          doctorUserName: "李医生", // 开单医生
          dispenseUserName: "刘星1", // 收费人
          submitTime: "2019-01-01 01:01:01" // 提交时间
        },
        {
          recipeCode: "", //处方号
          patientName: "lisa", // 病人姓名
          patientGender: "女", //性别
          patientAge: "15", // patientAge
          totalprice: "200,000.00", //总进价金额：
          doctorDeptName: "科室", // 科室
          doctorUserName: "李医生", // 开单医生
          dispenseUserName: "刘星1", // 收费人
          submitTime: "2019-01-01 01:01:01" // 提交时间
        },
        {
          recipeCode: "", //处方号
          patientName: "lisa", // 病人姓名
          patientGender: "女", //性别
          patientAge: "15", // patientAge
          totalprice: "200,000.00", //总进价金额：
          doctorDeptName: "科室", // 科室
          doctorUserName: "李医生", // 开单医生
          dispenseUserName: "刘星1", // 收费人
          submitTime: "2019-01-01 01:01:01" // 提交时间
        },
        {
          recipeCode: "", //处方号
          patientName: "lisa", // 病人姓名
          patientGender: "女", //性别
          patientAge: "15", // patientAge
          totalprice: "200,000.00", //总进价金额：
          doctorDeptName: "科室", // 科室
          doctorUserName: "李医生", // 开单医生
          dispenseUserName: "刘星1", // 收费人
          submitTime: "2019-01-01 01:01:01" // 提交时间
        },
        {
          recipeCode: "", //处方号
          patientName: "lisa", // 病人姓名
          patientGender: "女", //性别
          patientAge: "15", // patientAge
          totalprice: "200,000.00", //总进价金额：
          doctorDeptName: "科室", // 科室
          doctorUserName: "李医生", // 开单医生
          dispenseUserName: "刘星1", // 收费人
          submitTime: "2019-01-01 01:01:01" // 提交时间
        }
      ], // 申请列表
      loading: false, //左侧申请列表滑动加载状态
      noMore: false, // 左侧申请列表没有更多数据
      curSelectedIndex: 0, // 当前选择单号下标
      //
      //右侧表单数据源
      recipeForm: {
        feeType: "123",
        recipeCode: "2548945+6168",
        patientNamee: "张三",
        patientGender: "男",
        patientAge: "18",
        patientCode: "1215485",
        doctorDeptName: "脑外",
        patientAddr: "天津市空港经济区空港商务园E8",
        phoneNum: "1355555555",
        clinicDiag: "心悸",
        orderTime: "2019-1-23 9:20:23",
        doctorUserName: "张医生",
        chargeUserName: "李护士",
        prescriptionAmt: "123",
        dispenseUserName: "张医生",
        deliveryUserName: "李护士"
      },

      recipeTable: [],
      //右侧列表数据源
      orderTable: [
        {
          drugName: "辅酶Q10软胶囊",
          spec: "10mg*24粒/盒",
          price: "80",
          originCode: "浙江梅力生制药有限公司",
          drugQuantity: "1",
          dosageUnit: "盒",
          medicationCode: "每次10mg,2/日，口服"
        },
        {
          drugName: "辅酶Q10软胶囊",
          spec: "10mg*24粒/盒",
          price: "80",
          originCode: "浙江梅力生制药有限公司",
          drugQuantity: "1",
          dosageUnit: "盒",
          medicationCode: "每次10mg,2/日，口服"
        },
        {
          drugName: "辅酶Q10软胶囊",
          spec: "10mg*24粒/盒",
          price: "80",
          originCode: "浙江梅力生制药有限公司",
          drugQuantity: "1",
          dosageUnit: "盒",
          medicationCode: "每次10mg,2/日，口服"
        },
        {
          drugName: "辅酶Q10软胶囊",
          spec: "10mg*24粒/盒",
          price: "80",
          originCode: "浙江梅力生制药有限公司",
          drugQuantity: "1",
          dosageUnit: "盒",
          medicationCode: "每次10mg,2/日，口服"
        },
        {
          drugName: "辅酶Q10软胶囊",
          spec: "10mg*24粒/盒",
          price: "80",
          originCode: "浙江梅力生制药有限公司",
          drugQuantity: "1",
          dosageUnit: "盒",
          medicationCode: "每次10mg,2/日，口服"
        }
      ],

      curSelectTableList: [] // 当前已经选中的item
    };
  },
  mounted() {
    this.searchparam.searchType = "1";
  },
  computed: {
    disabled() {
      // 滑动加载组件禁用状态
      return this.loading || this.noMore;
    }
  },
  methods: {
    // 左侧边栏操作
    radioChange(val) {
      if (val == 0) {
        this.searchparam.dateShow = true;
        this.searchparam.inputShow = false;
        this.searchparam.icShow = false;
      } else if (val == 1) {
        this.searchparam.dateShow = false;
        this.searchparam.inputShow = true;
        this.searchparam.icShow = true;
      } else {
        this.searchparam.dateShow = false;
        this.searchparam.inputShow = true;
        this.searchparam.icShow = false;
      }
    },

    async search(val) {},

    //排序
    listsort(val) {
      console.log(val);
    },

    async load() {
      // 滑动加载
      try {
        this.page++;
        this.loading = true;
        const _this = this;
        setTimeout(function() {
          _this.purchaseList.push({
            recipeCode: "", //处方号
            patientName: "lisa", // 病人姓名
            patientGender: "女", //性别
            patientAge: "15", // patientAge
            totalprice: "200,000.00", //总进价金额：
            doctorDeptName: "科室", // 科室
            doctorUserName: "李医生", // 开单医生
            dispenseUserName: "刘星1", // 收费人
            submitTime: "2019-01-01 01:01:01" // 提交时间
          });
          // 加载完成后需要将loading置成fale, try catch中错误处理也要考虑
          _this.loading = false;
          // 通常异步操作完成后会根据返回值设定noMore
          _this.noMore = this.count >= 20;
        }, 5000);
      } catch (e) {
        console.log("报错了");
      }
    },

    print() {
      // 打印
    },

    delivery() {
      // 保存
      this.$confirm("", "", {
        showClose: "false",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: "true",
        message: "是否保存当前入库单",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "保存成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    }
    // tablast() {
    //   // 键盘Tab 到最后一个 触发回调事件
    //   this.tableData.map(item => {
    //     item.isEditing = false;
    //   });
    //   this.tableData.push({
    //     id: 1,
    //     drugName: "", // 药品名称
    //     spec: "", // 规格
    //     stock: "", // 库存
    //     referencePurchasePrice: "", // 进价
    //     referenceSellPrice: "", // 售价
    //     remark: "", // 备注
    //     packing: "", // 剂量
    //     dosagForm: "", // 剂型单位
    //     rkNumber: "", //数量
    //     batch: "", //生产批号
    //     validity: "", //有效期
    //     supplier: "", //生产厂商
    //     Identification: "", //生产标识
    //     habitat: "", //原产地
    //     isEditing: true // 是否为编辑状态
    //   });
    // }
  }
};
</script>

<style lang="scss" scoped>
$leftWidth: 440px;
$rightWidth: 287px;
.three-column {
  min-width: 1024px;
  padding-left: $leftWidth;
  padding-right: $rightWidth;
  .column {
    float: left;
    height: 100%;
    .box {
      height: 100%;
      box-sizing: border-box;
      border-radius: 4px;
      .top {
        padding: 10px;
      }
      .bottom {
        padding: 10px;
      }
    }
  }
  #left {
    width: $leftWidth;
    margin-left: -100%;
    position: relative;
    right: $leftWidth;
    padding-left: 0;
  }
  #center {
    width: 100%;
  }
  #right {
    margin-right: -$rightWidth;
    width: $rightWidth;
    padding-right: 0;
  }
}
#left {
  position: relative;
  .el-card {
    .padding20 {
      padding: 10px 20px;
    }
    .table-top {
      width: 100%;
      /deep/ .el-row {
        height: 36px;
      }
      .cardInput {
        width: 75%;
      }
      .deliveryState {
        margin-left: 3px;
      }
    }
    .sorttitle {
      background: $l-color-bgcolor-18;
      padding: 0 16px;
      .inline-block {
        margin-right: 5px;
      }
    }
    .list-container {
      position: absolute;
      top: 173px;
      left: 0;
      width: 100%;
      bottom: 0;
      .list-item {
        padding: 6px 14px;
        position: relative;
        .state {
          position: absolute;
          right: 10px;
          top: 10px;
        }
        .item-label {
          line-height: 28px;
          .label {
            color: $l-color-fontcolor-3;
            font-size: $l-font-size;
          }
        }
      }
      .list-item:nth-child(even) {
        background: $l-color-bgcolor-18;
      }
      .active {
        background-color: $l-color-bgcolor-12 !important;
      }
    }
  }
}
#center {
  padding: 0 20px;
  .rightinput {
    padding-right: 20px;
    border-bottom: 1px solid $l-color-bgcolor-18;
  }
  .el-row {
    .disabled {
      background: $l-color-bgcolor-18;
    }
  }
  .cftitle {
    padding: 10px;
    .bfcolor {
      color: #949da3;
      font-size: 12px;
    }
    .title {
      font-size: 20px;
      color: #2e323a;
      display: block;
      text-align: center;
    }
    .el-form-item {
      margin-bottom: 0;
    }
  }
}
.bottom-container {
  text-align: center;
  padding: 20px 0px;
}
</style>
