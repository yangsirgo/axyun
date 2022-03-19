<template>
  <el-card class="card">
    <el-tabs v-model="activeName" class="height100 main-tabs" @tab-click="handleClick">
      <el-tab-pane label="待审核" name="first">
        <div class="main-content" v-if="applyList.length === 0">
          <div class="none-date">暂无待审核数据</div>
        </div>
        <div v-else>
          <el-collapse v-model="activeNames" @change="handleChange">
            <l-collapse-item v-for="(parentItem, $index) in applyList" :name="$index" :key="$index">
              <div slot="title">
                <el-checkbox v-model="parentItem.checked"></el-checkbox>
                申请时间：{{parentItem.applyTime}}
              </div>
              <div slot="content">
                <div class="table-wrapper">
                  <el-table
                    header-cell-class-name="headerCls"
                    row-class-name="rowStyleCls"
                    ref="singleTable"
                    :data="parentItem.list"
                    highlight-current-row
                    style="width: 100%"
                    stripe
                    border
                    element-loading-text="加载中..."
                  >
                    <el-table-column
                      v-for="item in collapseTableColumn"
                      :key="item.label"
                      :label="item.label"
                      :prop="item.prop"
                      :align="item.align || 'left'"
                      show-overflow-tooltip
                      header-align="center"
                      :min-width="item.width"
                    >
                      <template slot-scope="scope">
                        <!--操作部分自定义-->
                        <template v-if="item.prop == 'executeQuantity'">
                          <!-- 药品 -->
                          <span class="overflow-point" v-if="scope.row['orderSource'] != '4'">
                            {{
                            scope.row[item.prop] > 0 ? "已发药" : "未发药"
                            }}
                          </span>
                          <!-- 如果是申请单 -->
                          <span class="overflow-point" v-if="scope.row['orderSource'] == '4'">
                            {{
                            scope.row[item.prop] > 0 ? "已执行" : "未执行"
                            }}
                          </span>
                        </template>
                        <template v-else-if="item.prop === 'useWay'">
                          <span
                            :val="scope.row[item.prop]"
                            code="MedicationRouteCode"
                            v-codeTransform
                          ></span>
                        </template>
                        <!-- 申请数量 -->
                        <template
                          v-else-if="item.prop === 'refundQuantity' && scope.row['orderSource'] != '4'"
                        >
                          <span>{{scope.row["bigUnitNuma"]}}</span>
                          <span
                            :val="scope.row['packUnit']"
                            code="DrugUnit"
                            v-codeTransform
                            class="special-color"
                          ></span>
                          <span>{{scope.row["minUnitNuma"]}}</span>
                          <span
                            :val="scope.row['chargeUnit']"
                            code="DrugUnit"
                            v-codeTransform
                            class="special-color"
                          ></span>
                        </template>
                        <template
                          v-else-if="item.prop === 'refundQuantity' && scope.row['orderSource'] == '4'"
                        >
                          <span>{{scope.row["refundQuantity"]}}</span>
                          <span>{{scope.row['chargeUnit']}}</span>
                        </template>
                        <!-- 收费数量 -->
                        <template
                          v-else-if="item.prop === 'itemQuantity' && scope.row['orderSource'] != '4'"
                        >
                          <span>{{scope.row["bigUnitNum"]}}</span>
                          <span
                            :val="scope.row['packUnit']"
                            code="DrugUnit"
                            v-codeTransform
                            class="special-color"
                          ></span>
                          <span>{{scope.row["minUnitNum"]}}</span>
                          <span
                            :val="scope.row['chargeUnit']"
                            code="DrugUnit"
                            v-codeTransform
                            class="special-color"
                          ></span>
                        </template>
                        <template
                          v-else-if="item.prop === 'itemQuantity' && scope.row['orderSource'] == '4'"
                        >
                          <span>{{scope.row["itemQuantity"]}}</span>
                          <span>{{scope.row["chargeUnit"]}}</span>
                        </template>

                        <template v-else-if="item.prop === 'totalMoney'">
                          <span>{{scope.row['totalMoney'].toFixed(2)}}</span>
                        </template>
                        <template v-else-if="item.prop === 'ouptDeptId'">
                          <span
                            tableName="sys_org"
                            :conditionMap="{org_type: '_DEPT_', id: scope.row['ouptDeptId']}"
                            columns="org_nm"
                            v-tableTransform
                          ></span>
                        </template>
                        <template v-else>
                          <span class="overflow-point">{{ scope.row[item.prop]}}</span>
                        </template>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </l-collapse-item>
          </el-collapse>
          <div style="text-align: right;margin-right: 10px; margin-top: 10px">
            <el-button type="primary" class="btn" @click="pass(1)">通过</el-button>
            <el-button type="primary" class="btn-not" @click="pass(2)">不通过</el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="已审核" name="second">
        <div class="main-content" v-if="checkedList.length === 0">
          <div class="none-date">暂无已审核数据</div>
        </div>
        <div v-else>
          <el-collapse v-model="activeNames" @change="handleChange">
            <l-collapse-item
              v-for="(applyItem, $index) in checkedList"
              :name="$index"
              :key="$index"
            >
              <div slot="title">
                <el-checkbox v-model="applyItem.checked"></el-checkbox>
                审核时间：{{applyItem.checkTime}}
              </div>
              <div slot="content">
                <div class="table-wrapper">
                  <div>
                    <el-table
                      header-cell-class-name="headerCls"
                      row-class-name="rowStyleCls"
                      ref="singleTable"
                      :data="applyItem.list"
                      highlight-current-row
                      style="width: 100%"
                      height="100%"
                      v-loadmore="load"
                      stripe
                      border
                      v-loading="tlm_isLoading1"
                      element-loading-text="加载中..."
                    >
                      <el-table-column
                        v-for="item in tableColumn"
                        :key="item.label"
                        :label="item.label"
                        :prop="item.prop"
                        :align="item.align || 'left'"
                        show-overflow-tooltip
                        header-align="center"
                        :min-width="item.width"
                      >
                        <template slot-scope="scope">
                          <template v-if="item.prop === 'state'">
                            <span v-if="scope.row[item.prop] === 0">待配</span>
                            <span v-if="scope.row[item.prop] === 1" class="activeCell">已执行</span>
                          </template>
                          <template v-if="item.prop === 'ouptDeptId'">
                            <span
                              tableName="sys_org"
                              :conditionMap="{org_type: '_DEPT_', id: scope.row['ouptDeptId']}"
                              columns="org_nm"
                              v-tableTransform
                            ></span>
                          </template>
                          <template v-else-if="item.prop === 'useWay'">
                            <span
                              :val="scope.row[item.prop]"
                              code="MedicationRouteCode"
                              v-codeTransform
                            ></span>
                          </template>
                          <!-- 申请数量 -->
                          <template
                            v-else-if="item.prop === 'refundQuantity' && scope.row['orderSource'] != '4'"
                          >
                            <span>{{scope.row["bigUnitNuma"]}}</span>
                            <span
                              :val="scope.row['packUnit']"
                              code="DrugUnit"
                              v-codeTransform
                              class="special-color"
                            ></span>
                            <span>{{scope.row["minUnitNuma"]}}</span>
                            <span
                              :val="scope.row['chargeUnit']"
                              code="DrugUnit"
                              v-codeTransform
                              class="special-color"
                            ></span>
                          </template>
                          <template
                            v-else-if="item.prop === 'refundQuantity' && scope.row['orderSource'] == '4'"
                          >
                            <span>{{scope.row["refundQuantity"]}}</span>
                            <span>{{scope.row['chargeUnit']}}</span>
                          </template>
                          <!-- 收费数量 -->
                          <template
                            v-else-if="item.prop === 'itemQuantity' && scope.row['orderSource'] != '4'"
                          >
                            <span>{{scope.row["bigUnitNum"]}}</span>
                            <span
                              :val="scope.row['packUnit']"
                              code="DrugUnit"
                              v-codeTransform
                              class="special-color"
                            ></span>
                            <span>{{scope.row["minUnitNum"]}}</span>
                            <span
                              :val="scope.row['chargeUnit']"
                              code="DrugUnit"
                              v-codeTransform
                              class="special-color"
                            ></span>
                          </template>
                          <template
                            v-else-if="item.prop === 'itemQuantity' && scope.row['orderSource'] == '4'"
                          >
                            <span>{{scope.row["itemQuantity"]}}</span>
                            <span>{{scope.row["chargeUnit"]}}</span>
                          </template>
                          <template v-else-if="item.prop === 'applyRecordStatus'">
                            <span>{{scope.row[item.prop] == '2'?'审批不通过':'审批通过'}}</span>
                          </template>
                          <template v-else-if="item.prop === 'totalMoney'">
                            <span>{{scope.row['totalMoney'].toFixed(2)}}</span>
                          </template>
                          <template v-else>
                            <span>{{scope.row[item.prop]}}</span>
                          </template>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </div>
            </l-collapse-item>
          </el-collapse>
          <div class="charge-bottom height-button-bottom">
            <el-row>
              <el-button type="primary" class="btn" @click="revocationApply">撤回申请</el-button>
            </el-row>
          </div>
        </div>
      </el-tab-pane>
      <!-- <el-tab-pane label="处方信息" name="third">
        <el-table
          header-cell-class-name="headerCls"
          row-class-name="rowStyleCls"
          ref="singleTable"
          :data="tabsList"
          highlight-current-row
          style="width: 100%"
          height="100%"
          v-loadmore="load"
          stripe
          border
          v-loading="tlm_isLoading"
          element-loading-text="加载中..."
        >
          <el-table-column
            v-for="item in tableColumn"
            :key="item.label"
            :label="item.label"
            :prop="item.prop"
            :align="item.align || 'left'"
            show-overflow-tooltip
            header-align="center"
            :min-width="item.width"
          >
            <template slot-scope="scope">
              <template v-if="item.prop === 'state'">
                <span v-if="scope.row[item.prop] === 0">待配</span>
                <span v-if="scope.row[item.prop] === 1" class="activeCell">已执行</span>
              </template>
              <template v-else>
                <span>{{scope.row[item.prop]}}</span>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>-->
    </el-tabs>
  </el-card>
</template>

<script>
import LCollapseItem from "@/components/LCollapseItem.vue";
import { mapActions, mapGetters } from "vuex";
import service from "@/api/cis/refund/refund.js";
import { blukToOutfit } from "@/utils/drugManagement";

export default {
  name: "mainCard",
  data() {
    return {
      activeNames: [0],
      page: 1,
      tlm_isLoading: false,
      tlm_isLoading1: false,
      activeName: "first",
      collapseTableColumn: [
        {
          prop: "executeQuantity",
          label: "执行状态",
          width: "20"
        },
        {
          prop: "itemName",
          label: "项目名称",
          width: "20"
        },
        {
          prop: "spec",
          label: "规格",
          width: "20"
        },
        {
          prop: "onceDosage",
          label: "单次用量",
          width: "20"
        },
        {
          prop: "useWay",
          label: "途径",
          width: "20"
        },
        // {
        //   prop: "chargeUnit",
        //   label: "单位",
        //   width: "20"
        // },
        {
          prop: "itemQuantity",
          label: "数量",
          width: "20"
        },
        {
          prop: "totalMoney",
          label: "金额（元）",
          width: "20",
          align: "right"
        },

        {
          prop: "refundQuantity",
          label: "申请数量",
          width: "20"
        },
        {
          prop: "ouptDeptId",
          label: "执行科室",
          width: "20"
        }
      ],
      collapseData: [
        {
          checked: 0,
          applicationDate: "2018-02-03 12:00",
          itemData: [
            {
              status: "执行中",
              proItem: "阿莫西林", //项目名称
              spec: "1g/1支", //规格
              tuiNo: "1", //实退数量
              singleUse: "2", //单次用量
              unit: "支", //单位
              money: "222222", //票据单号
              userWay: "途径", //途径
              No: "20", //数量
              room: "皮肤科", //执行科室
              id: 1111 //id
            },
            {
              status: "执行中",
              proItem: "阿莫西林", //项目名称
              spec: "1g/1支", //规格
              tuiNo: "1", //实退数量
              singleUse: "2", //单次用量
              unit: "支", //单位
              money: "222222", //票据单号
              userWay: "途径", //途径
              No: "20", //数量
              room: "皮肤科", //执行科室
              id: 0 //id
            }
          ]
        },
        {
          checked: 1,
          applicationDate: "2019-03-03 12:00",
          itemData: [
            {
              status: "执行中",
              proItem: "阿莫西林", //项目名称
              spec: "1g/1支", //规格
              tuiNo: "1", //实退数量
              singleUse: "2", //单次用量
              unit: "支", //单位
              money: "222222", //票据单号
              userWay: "途径", //途径
              No: "20", //数量
              room: "皮肤科", //执行科室
              id: 1111 //id
            },
            {
              status: "已执行",
              proItem: "阿莫西林", //项目名称
              spec: "1g/1支", //规格
              tuiNo: "1", //实退数量
              singleUse: "2", //单次用量
              unit: "支", //单位
              money: "222222", //票据单号
              userWay: "途径", //途径
              No: "20", //数量
              room: "皮肤科", //执行科室
              id: 0 //id
            }
          ]
        }
      ],
      tabsList: [],
      tableColumn: [
        {
          prop: "itemName",
          label: "项目名称",
          width: "20"
        },
        {
          prop: "spec",
          label: "规格",
          width: "20"
        },
        {
          prop: "onceDosage",
          label: "单次用量",
          width: "20"
        },
        {
          prop: "useWay",
          label: "途径",
          width: "20"
        },
        // {
        //   prop: "chargeUnit",
        //   label: "单位",
        //   width: "20"
        // },
        {
          prop: "itemQuantity",
          label: "数量",
          width: "20"
        },
        {
          prop: "totalMoney",
          label: "金额(元)",
          width: "20",
          align: "rigth"
        },
        {
          prop: "refundQuantity",
          label: "申请数量",
          width: "20"
        },
        {
          prop: "ouptDeptId",
          label: "执行科室",
          width: "20"
        },
        {
          prop: "applyRecordStatus",
          label: "审批状态",
          width: "20"
        }
      ],
      // 待审批集合
      applyList: [],
      // 退费申请分组集合
      groupApply: [],
      // 患者数据
      apptInfo: {},
      // 已审批
      checkedList: []
    };
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"])
  },
  watch: {
    receivePatientData: {
      //深度监听，可监听到对象、数组的变化
      handler(n) {
        //数据变化 回调
        this.getApply(n);
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {},
  methods: {
    handleChange(val) {},
    handleClick() {},
    load() {
      const _this = this;
      this.page++;
      setTimeout(function() {
        let list = _this.tabsList;
        let arr = [
          //后台返回数据
          {
            bedNum: 1111,
            name: "en",
            gender: "男",
            age: "1"
          }
        ];
        if (_this.page >= 6) {
          // 最后一页的状态
          _this.tlm_noMore = true;
        }
        _this.tabsList = list.concat(arr); //新返回的数据 与 原来数据叠加
        _this.tlm_isLoading = false;
      }, 2000);
    },
    //  退费申请分组
    groupBy(list) {
      let obj = {};
      // 根据refundApplyId 分组
      this.groupApply = [];
      for (let i = 0; i < list.length; i++) {
        let data = list[i];
        if (!obj[data.refundApplyId]) {
          this.groupApply.push({
            ...data,
            list: []
          });
          obj[data.refundApplyId] = true;
        }
      }
      // push 明细
      for (let i = 0; i < list.length; i++) {
        let a = list[i];
        // 收费数量
        if (a.orderSource == "1") {
          let unitInfo = blukToOutfit(a.itemQuantity, a.packQuantity);
          this.$set(a, "bigUnitNum", unitInfo.out); // bigUnitNum  大单位数量
          this.$set(a, "minUnitNum", unitInfo.bl); // minUnitNum  小单位数量
          // 退费申请数量
          let unitInfoa = blukToOutfit(a.refundQuantity, a.packQuantity);
          this.$set(a, "bigUnitNuma", unitInfoa.out); // bigUnitNuma 大单位数量
          this.$set(a, "minUnitNuma", unitInfoa.bl); // minUnitNuma  小单位数量
        }

        for (let j = 0; j < this.groupApply.length; j++) {
          let g = this.groupApply[j];
          if (a.refundApplyId == g.refundApplyId) {
            g.list.push(a);
          }
        }
      }
    },
    // 审批  拼装对象
    pass(flag) {
      let arr = [];
      this.groupApply.forEach(val => {
        if (val.checked && val.checked == true) {
          arr.push({
            refundApplyId: val.refundApplyId,
            dataVersion: val.applyDataVersion,
            recordStatus: flag
          });
        }
      });
      if (arr.length <= 0) {
        this.$message("请勾选申请单");
        return;
      }
      // this.$emit('pass',arr)
      this.passApply(arr);
    },
    async getApply(obj) {
      if (!obj) {
        return;
      }
      this.apptInfo = { ...obj };
      // 拿到申请列表
      try {
        this.$showLoading();
        const { data } = await service.getApplyList({
          patientId: obj.patientId
        });
        // 执行分组
        this.groupBy(data);
        let a = [];
        let b = [];
        // 分类
        if (this.groupApply) {
          for (let i = 0; i < this.groupApply.length; i++) {
            if (this.groupApply[i].applyRecordStatus == 0) {
              a.push(this.groupApply[i]);
            } else {
              b.push(this.groupApply[i]);
            }
          }
        }
        // 待审核
        this.applyList = a;
        // 已审核
        this.checkedList = b;
        this.$hideLoading();
      } catch (error) {
        console.info(error);
        this.$hideLoading();
        this.$message.error(error.msg || "标准错误提示");
      }
    },
    // 审批
    async passApply(obj) {
      try {
        this.$showLoading();
        const res = await service.passApply(obj);
        this.getApply(this.apptInfo);
        this.$hideLoading();
        this.$message({ message: "审批成功", type: "success" });
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "标准错误提示");
      }
    },
    // 撤回审批
    async revocationApply() {
      try {
        this.$showLoading();
        let arr = [];
        this.checkedList.forEach(val => {
          if (val.checked && val.checked == true) {
            arr.push({
              refundApplyId: val.refundApplyId,
              dataVersion: val.applyDataVersion,
              recordStatus: "0"
            });
          }
        });
        if (arr.length <= 0) {
          this.$message("请勾选申请单");
          this.$hideLoading();
          return;
        }
        const res = await service.revocationApply(arr);
        this.$message({ message: "撤回成功", type: "success" });
        this.$hideLoading();
        this.getApply(this.apptInfo);
      } catch (error) {
        console.log(error);
        this.$hideLoading();
        this.$message.error(error.msg || "标准错误提示");
      }
    }
  },
  components: {
    LCollapseItem
  }
};
</script>

<style scoped lang="scss">
.card {
  padding: 20px;
  height: 100%;

  .main-tabs {
    /deep/ .el-tabs__content {
      height: calc(100% - 56px);
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

  .btn {
    /*width:80px;*/
    height: 36px;
    background: $l-color-primary;
    border-radius: 2px;
    margin-bottom: 14px;
  }

  .btn-not {
    /*width:80px;*/
    height: 36px;
    border-radius: 2px;
    background: #fff;
    border: 1px solid $l-color-primary;
    font-weight: 400;
    color: $l-color-primary;
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
</style>
