<template>
  <div class="common">
    <div class="utils">
      <el-radio-group
        v-model="category"
        class="align-center"
        @change="typeChange"
      >
        <el-radio
          :label="item.code"
          v-for="item in classification"
          :key="item.code"
        >{{item.name}}</el-radio>
      </el-radio-group>
    </div>
    <div>
      <ul v-if="drugList.length>0">
        <li
          class="commonItem"
          v-for="(item, index) in drugList"
          :key="index"
          @click="setRpDrug(item)"
        >
          <el-card class="drugItem">
            <div class="drugName">{{ item.orderItemName || '-'}}</div>
            <div class="spec">{{ item.spec || '-'}}</div>
            <el-row class="spec">
              <el-col :span="4">
                <div>类别:</div>
              </el-col>
              <el-col :span="8">
                <!-- <span :val="item.orderItemCat" code="order_type" v-codeTransform></span> -->
                <span
                  columns="doctors_advice_name"
                  :conditionMap="{ doctors_advice_code: item.orderItemCat }"
                  tableName="cnf_doctors_advice"
                  v-tableTransform
                ></span>
              </el-col>
              <el-col :span="4">
                <div>基药:</div>
              </el-col>
              <el-col :span="8">
                <span
                  v-if="item.basicType"
                  :val="item.basicType"
                  code="BasicDrugType"
                  v-codeTransform
                ></span>
                <span v-else>--</span>
              </el-col>
            </el-row>
            <el-row class="spec">
              <el-col :span="4">
                <div>单价:</div>
              </el-col>
              <el-col :span="8">
                <span>{{ item.price | rounding }}元</span>
              </el-col>
            </el-row>
          </el-card>
          <div class="itemMask">
            <span class="itemMaskText">引 用</span>
          </div>
        </li>
      </ul>
      <div
        v-else
        style="padding:10px;text-align:center"
      >暂无常用药</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    drugList: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      loading: false,
      category: "doctor",
      classification: [
        {
          name: "医生常用药",
          code: "doctor"
        },
        {
          name: "科室常用药",
          code: "dept"
        }
      ]
    };
  },
  filters: {
    rounding(value) {
      value = value !== "" ? new Number(value) : 0;
      return value.toFixed(4);
    }
  },
  created() {
    this.typeChange();
  },
  components: {},
  methods: {
    setRpDrug(item) {
      this.$emit("itemClick", item);
    },
    typeChange() {
      this.$emit("typeChange", this.category);
    }
  }
};
</script>

<style scoped lang="scss">
.common {
  .utils {
    padding: 10px 0;
  }
}

.commonItem {
  position: relative;
  .itemMask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0);
    transition: 0.3s;
    z-index: 10;
    margin: auto;
    line-height: 96px;
    text-align: center;
    .itemMaskText {
      color: #2b4583;
      font-weight: bold;
      font-size: 20px;
      opacity: 0;
      transition: 0.5s;
    }
  }
}

.commonItem:hover > .itemMask {
  background: rgba(0, 0, 0, 0.3);
  cursor: pointer;
  .itemMaskText {
    opacity: 1;
  }
}

.commonItem:hover > .itemMask > .itemMaskText {
  opacity: 1;
}

.drugItem {
  background-color: #f1f4f6;
  padding: 5px;
  margin-bottom: 10px;
  box-shadow: unset;

  .drugName {
    font-size: 14px;

    font-weight: bold;
    color: rgba(46, 50, 58, 1);
    margin-bottom: 5px;
  }

  .spec {
    font-size: 14px;

    font-weight: 400;
    color: rgba(46, 50, 58, 1);
    margin-bottom: 5px;
  }
}
</style>
