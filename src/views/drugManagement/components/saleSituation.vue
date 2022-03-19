<template>
  <div class="sale-situation width100">
    <tools-head></tools-head>
    <div class="price">
      <el-row>
        <el-col :span="10">
          <div>当前库房进价</div>
        </el-col>
        <el-col :span="14">
          <div class="row-data">{{ formatNum(info.purchasePrice) }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <div>当前库房售价</div>
        </el-col>
        <el-col :span="14">
          <div class="row-data">{{ formatNum(info.price) }}</div>
        </el-col>
      </el-row>
    </div>
    <div style="padding-top:20px;margin-bottom:25px">
      <el-row>
        <el-col :span="10">
          <el-input-number
            v-model="num"
            controls-position="right"
            @change="handleChange"
            :min="0"
            :max="50"
            style="width:90%"
          ></el-input-number>
        </el-col>
        <el-col :span="14">
          <el-select v-model="value" @change="handleChange" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="date" header-align="center" align="center" label="时间"></el-table-column>
      <el-table-column prop="qty" header-align="center" align="center" label="详情">
        <template slot-scope="scope">
          <span>{{ parseInt(scope.row.qty / scope.row.packQuantity) }}</span>
          <span :val="scope.row.drugUnit" code="DrugUnit" v-codeTransform></span>
          <span v-show="scope.row.qty % scope.row.packQuantity !== 0">
            {{ isFlow(scope.row.qty % scope.row.packQuantity)
            }}
            <span
              :val="scope.row.packUnit"
              code="DrugUnit"
              v-codeTransform
            ></span>
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label>
        <template slot-scope="scope">
          <i
            class="iconfont"
            :class="[
              { up: scope.row.direction == 'up' },
              { down: scope.row.direction == 'down' },
              scope.row.icon
            ]"
          ></i>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import toolsHead from "@/views/drugManagement/components/toolsHead.vue";
import { mapGetters } from "vuex";
import stockApi from "@/api/hmm/stock.js";
import formatNum from "@/utils/formatPrice.js";

export default {
  components: { toolsHead },
  data() {
    return {
      num: 1,
      options: [
        {
          value: "Y",
          label: "年"
        },
        {
          value: "M",
          label: "月"
        },
        /* {
          value: "W",
          label: "周"
        }, */
        {
          value: "D",
          label: "日"
        }
      ],
      value: "M",
      tableData: [],
      info: {
        purchasePrice: 0,
        price: 0
      }
    };
  },
  computed: {
    ...mapGetters("drugManagement", ["currentDrug"]),

  },
  watch: {
    currentDrug: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val && val.drugId) {
          this.loadData(val.drugId);
        } else {
          this.info = this.$options.data().info;
          this.tableData = [];
        }
      }
    }
  },
  methods: {
   isFlow(num){
   	if(!isNaN(num)){
         return ( (num + '').indexOf('.') != -1 ) ? num.toFixed(2): num;
       }
   },
    formatNum(num) {
      return formatNum(num);
    },
    handleChange(value) {
      let reg = /^[0-9]+$/
      if(reg.test(this.num)){
        this.currentDrug.drugId && this.loadData(this.currentDrug.drugId);
      }else{
       this.$message.error("请输入0-50的正整数");
      }
    },
    loadData(id) {
      this.loading = true;
      // 获取表格数据
      this.tableData = [];
      stockApi
        .getDrugSalesAmount({
          drugId: id,
          num: this.num,
          unit: this.value
        }) // 2c9180886e451b90016e45408760001f
        .then(res => {
          if (res.code === 1) {
            // 每条数据跟上一条数据比较，大于显示上升箭头，小于显示下降箭头，第一条不显示箭头
            let list = res.data.reduce((item, next) => {
              let len = item.length;
              let obj = {};
              if (len !== 0) {
                // 第一条不作处理
                if (next.qty > item[len - 1].qty) {
                  // 大于
                  obj = {
                    direction: "up",
                    icon: "iconshangsheng"
                  };
                } else if (next.qty < item[len - 1].qty) {
                  // 小于
                  obj = {
                    direction: "down",
                    icon: "iconxiajiang"
                  };
                }
              }

              // 等于也不作处理
              item.push({
                ...next,
                ...obj
              });
              return item;
            }, []);
            this.tableData = list;
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });

      // 获取当前库房进价，当前库房售价
      this.info = this.$options.data().info;
      stockApi
        .getAllDrugList({ currDrugStorage : 1, drugId: id })
        .then(res => {
          if (res.code === 1) {
            this.info = res.data && res.data[0] || this.$options.data().info;
          }
        })
        .catch();
    }
  }
};
</script>
<style lang="scss" scoped>
.sale-situation {
  padding: 10px;
  .head {
    padding-bottom: 10px;
    font-size: 14px;

    font-weight: 400;
    color: $l-color-fontcolor-3;
    border-bottom: 1px solid $l-color-bgcolor-11;
    margin-bottom: 10px;
  }
  .drugName {
    font-size: 16px;

    font-weight: bold;
    color: $l-color-fontcolor-3;
    margin-bottom: 10px;
  }
  .spec {
    font-size: 14px;

    font-weight: 400;
    color: $l-color-fontcolor-3;
    margin-bottom: 20px;
  }
  .price {
    .el-row {
      margin-bottom: 5px;
      div {
        font-size: 14px;

        font-weight: 400;
        color: $l-color-fontcolor-4;
      }
      .row-data {

        color: $l-color-primary;
      }
    }
  }
  .el-table {
    /deep/ .cell {
      i {
        &.up {
          color: $l-color-fontcolor-5;
        }
        &.down {
          color: $l-color-fontcolor-2;
        }
      }
    }
  }
}
</style>
