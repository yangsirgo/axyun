<template>
  <div class="page height100">
    <p
      class="no-data"
      v-if="data.length === 0"
    >暂无数据</p>
    <!-- 有数据 -->
    <div class="height100" v-else >
      <!-- 治疗医嘱  START -->
      <el-table
        :data="data"
        border
        max-height="100%"
        v-if="adviceType == 'treat'"
        @selection-change="handleSlcChange_treat"
        style="width: 100%"
        :header-cell-style="headerCellStyle" 
      >
        <!-- 选中列 -->
        <el-table-column
          align="center"
          type="selection"
          width="32"
          :selectable="isCheckDisabled"
        ></el-table-column>
        <!-- 业务列 -->
        <el-table-column
          v-for="(item,index) in treatPatams"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          :align="item.align || 'center'"
          :fixed="item.fixed"
        >
          <template slot-scope="scope">
            <template v-if="item.prop === 'frequencyCode'">
              <span
                columns="FREQUENCY_NAME"
                :conditionMap="{FREQUENCY_CODE: scope.row.frequencyCode}"
                tableName="hrp_frequency"
                v-tableTransform
              ></span>
            </template>
             <!--单位-->
            <template v-else-if="item.prop === 'unit'">
              <span
                v-if="!isNaN(scope.row.unit)"
                :val="scope.row.unit"
                code="DrugUnit"
                v-codeTransform
              ></span>
              <span v-else> {{ scope.row.unit }} </span>
            </template>
            <template v-else>
              <!-- 可自定义内容 -->
              <span>{{ scope.row[item.prop] || '--'}}</span>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <!-- 治疗医嘱  END -->
        <!-- :min="0"
        :max="1" -->
      <el-checkbox-group
        v-model="checkList"

        @change="checkBoxChange"
        v-else
      >
        <l-collapse
          :accordion="isAccordion"
          v-model="activeNames2"
          class="cols"
        >
          <l-collapse-item
            v-for="(tradeItem, index) in data"
            :name="index"
            :key="index"
          >
            <div
              class="width100"
              slot="title"
            >
              <el-row
                class="over-txt"
                :gutter="20"
              >
                <el-col
                  :span="11"
                  @click.native.stop
                >
                  <!-- 不同机构的处方 不得引用 -->
                  <el-checkbox
                    :label="tradeItem.recipeCode"
                    v-if="tradeItem.hosId && hosId !== tradeItem.hosId"
                    disabled
                  >
                    <!-- v-if="tradeItem.freeRecipe == '0'" -->
                    处方号：<span>{{ tradeItem.recipeCode }}</span>
                    <span v-if="tradeItem.freeRecipe == '1'" class="freeRecipeCls">（免费处方）</span>
                  </el-checkbox>
                  <el-checkbox
                    :label="tradeItem.recipeCode"
                    v-else
                  >
                    处方号：<span>{{ tradeItem.recipeCode }}</span>
                    <!-- v-if="tradeItem.freeRecipe == '0'" -->
                    <span v-if="tradeItem.freeRecipe == '1'" class="freeRecipeCls">（免费处方）</span>
                  </el-checkbox>
                  <!-- 收费状态 -->
                  <span  v-if="tradeItem.adviceList && tradeItem.adviceList.length > 0">
                    
                    <span
                      :val="tradeItem.adviceList[0].chargeStatus"
                      code="ChargeStatus"
                      v-codeTransform
                    ></span>
                  </span>
                </el-col>
                <el-col
                  :span="6"
                  v-if="adviceType == 'chm'"
                >
                  <span class="margin-right20">剂数：{{tradeItem.useQty}}剂</span>
                </el-col>
                <el-col
                  :span="7"
                  v-if="adviceType == 'chm'"
                >
                  发药方式：
                  <span class="margin-right20">{{
                    tradeItem.dispendingMethod == "1" ? "本院自发" : "第三方配送"
                  }}</span>
                </el-col>
              </el-row>
            </div>
            <div
              slot="content"
              style="max-height:300px; overflow:auto"
            >
              <!-- 中草药列  START -->
              <el-table
                :data="tradeItem.adviceList"
                border
                max-height="100%"
                v-if="adviceType == 'chm'"
                style="width: 100%"
              >
                <el-table-column
                  v-for="(item, index) in tableParams"
                  :key="index"
                  :label="item.label"
                  :prop="item.prop"
                  :width="item.width"
                >
                  <template slot-scope="scope">
                    <template v-if="item.prop == 'unitKey'">
                      <div
                        :val="scope.row.unitKey"
                        code="DrugUnit"
                        v-codeTransform
                      ></div>
                    </template>
                    <template v-else>
                      <div>
                        {{ scope.row[item.prop] }}
                      </div>
                    </template>
                  </template>
                </el-table-column>
              </el-table>
              <!-- 中草药列  END -->
              <!-- 西药列  START -->
              <el-table
                :data="tradeItem.adviceList"
                border
                max-height="100%"
                v-if="adviceType == 'west'"
                style="width: 100%"
              >
                <!-- 业务列 -->
                <el-table-column
                  v-for="(item,index) in westTableParams"
                  :key="index"
                  :prop="item.prop"
                  :label="item.label"
                  :min-width="item.width"
                  :align="item.align || 'center'"
                  :fixed="item.fixed"
                >
                  <template slot-scope="scope">
                    <template v-if="item.prop === 'dosageUnit'">
                      <span
                        :val="scope.row.dosageUnit"
                        code="DrugDoseUnit"
                        v-codeTransform
                      ></span>
                    </template>
                    <template v-else-if="item.prop === 'frequencyCode'">
                      <span
                        columns="FREQUENCY_NAME"
                        :conditionMap="{FREQUENCY_CODE: scope.row.frequencyCode}"
                        tableName="hrp_frequency"
                        v-tableTransform
                      ></span>
                    </template>
                    <template v-else-if="item.prop === 'useWay'">
                      <span
                        :val="scope.row.useWay"
                        code="MedicationRouteCode"
                        v-codeTransform
                      ></span>
                    </template>
                    <template v-else-if="item.prop === 'packUnit'">

                      <span
                        :val="scope.row.unitFlag == '0'?scope.row.unit : scope.row.packUnit"
                        code="DrugUnit"
                        v-codeTransform
                      ></span>
                    </template>
                    <template v-else>
                      <!-- 可自定义内容 -->
                      <span>{{ scope.row[item.prop] || '--'}}</span>
                    </template>
                  </template>
                </el-table-column>
              </el-table>
              <!-- 西药列  END -->
            </div>
          </l-collapse-item>
        </l-collapse>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { deepClone } from "@/utils/index.js";
import { getPamars } from "@/utils/auth";
import { mapActions, mapGetters } from "vuex";

export default {
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    adviceType: {
      type: String,
      default() {
        return "chm";
      }
    }
  },
  data() {
    return {
      hosId: "", // 当前机构 hosId
      isAccordion: true,
      checkList: [],
      activeNames2: 0,
      treatPatams: [
        {
          prop: "orderItemName",
          label: "医嘱名称",
          width: 200
        },
        {
          prop: "frequencyCode",
          label: "频次",
          width: 130
        },
        {
          prop: "onceDosage",
          label: "单次数量"
        },
        {
          prop: "unit",
          label: "单位"
        },
        {
          prop: "quantity",
          label: "总数"
        }
      ],
      tableParams: [
        {
          prop: "orderItemName",
          label: "医嘱名称",
          width: 120
        },
        {
          prop: "spec",
          label: "规格",
          width: 130
        },
        {
          prop: "quantity",
          label: "单剂用量"
        },
        {
          prop: "unitKey",
          label: "单位"
        },
        {
          prop: "remarks",
          label: "备注"
        }
      ],
      westTableParams: [
        {
          prop: "orderItemName",
          label: "医嘱名称",
          width: 150
        },
        {
          prop: "spec",
          label: "规格",
          width: 110
        },
        {
          prop: "onceDosage",
          label: "一次用量"
        },
        {
          prop: "dosageUnit",
          label: "剂量单位"
        },
        {
          prop: "frequencyCode",
          label: "频率"
        },
        {
          prop: "useWay",
          label: "用法"
        },
        {
          prop: "quantity",
          label: "数量"
        },
        {
          prop: "packUnit",
          label: "单位"
        }
      ],
      multSle_treat: []
    };
  },
  created() {
    // if (this.adviceType == 'west') {
    //   this.tableParams = this.westTableParams;
    // }
    // this.hosId = JSON.parse(getPamars()).hosId;
    // console.log("this.hosId", this.hosId);
    // console.log("this.hosId", Base64.decode(this.hosId));
    // console.log("this.hosId", JSON.parse(getPamars()));
  },
  // mounted (){
  //   this.lCollapseShow();
  // },
  components: {},
  methods: {
    // 治疗医嘱全选
    headerCellStyle (rowObj) { // 设置样式，其他机构 隐藏头部checkbox全选框
      let sty = "";
      let { columnIndex } = rowObj;
      // let { hosId } = row;
      let isDisabled = this.data.every (item => item.hosId && item.hosId !== this.hosId);
      // let isDisabled = hosId && this.hosId !== hosId;
      console.log("isDisabled", isDisabled);
      if (columnIndex === 0 && isDisabled) {
        sty += 'text-indent: 1000px';
        // console.log("sty", sty);
      }
      return sty
    },
    // 治疗医嘱获取选中row
    handleSlcChange_treat (val){
      console.log(val);
      this.multSle_treat = val;
    },
    // 治疗医嘱获取选中id 外部调用
    getTreatCheckedIds (mapKey = "id"){
      console.log(this.multSle_treat);
      return this.multSle_treat.map((item) => { return { id: item[mapKey] } });
    },
    // 治疗医嘱禁用方法
    isCheckDisabled(row, index) {
      // 多选框是否禁用
      // return row.orderStatus !== "4";
      let { hosId } = row;
      return hosId && this.hosId === hosId;
    },
    //向外暴露的方法
    getCheckedIds(mapKey = "id") {
      let rpList = this.getRpList();
      let checkedIds = [];
      rpList.map(element => {
        let { adviceList } = element;
        let ids = adviceList.map(item => {
          return { id: item[mapKey] };
        });
        checkedIds = [...checkedIds, ...ids];
      });
      console.log(checkedIds);
      return checkedIds;
    },
    // 获取选中的处方列表
    getRpList() {
      let ajaxList = this.data.filter(item => {
        return this.checkList.indexOf(item.recipeCode) > -1;
      });
      return deepClone(ajaxList);
    },
    checkBoxChange() {
      this.$emit("checkBoxChange", this.checkList);
    },
    // 根据不同的医嘱 显示方式不一样。
    // 西药全部展开
    // 中药 手风琴
    lCollapseShow() {
      if (this.adviceType === "west") {
        this.activeNames2 = this.data.map((item, index) => {
          return index;
        });
        this.isAccordion = false;
      }
    }
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"])
  },
  watch: {
    data: {
      deep: true,
      immediate: true,
      handler() {
        this.$nextTick(() => {
          this.lCollapseShow();
          //console.log("checkList", this.checkList);
          this.checkList = [];
          this.multSle_treat = [];
        });
      }
    },
    receivePatientData: {
      immediate: true,
      deep: true,
      handler(val) {
        // console.log("val::::::::", val);
        let { hosId } = val;
        this.hosId = hosId;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.no-data {
  text-align: center;
  margin-top: 15%;
}

.page {
  overflow: auto;
}

.freeRecipeCls {
  color: blue;
}
</style>
