<template>
  <div class="container">
    <span
      :class="['item', 'cursor-pointer', val == '0' ? 'item-act' : '']"
      @click="change(['0'])"
    >半年</span>
    <span
      :class="['item', 'cursor-pointer', val == '1' ? 'item-act' : '']"
      @click="change(['1'])"
    >一年</span>
    <span
      :class="['item', 'cursor-pointer', (val != '0' && val != '1') ? 'item-act' : '']"
      @click="dialogVisible = true"
    >自定义</span>
    <el-dialog title="自定义时间选择" :visible.sync="dialogVisible" width="433px"  :append-to-body="true">
      <div class="date-choose padding10" v-if="dialogVisible">
        <el-date-picker
          v-model="customVal"
          type="datetimerange"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          :default-time="['00:00:00','23:59:59']"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmTime">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {mapActions, mapGetters} from "vuex";
export default {
  props: ["val"],
  data() {
    return {
      dialogVisible: false,
      customVal: [
        new Date().format("yyyy-MM-dd") + " 00:00:00",
        new Date().format("yyyy-MM-dd") + " 23:59:59"
      ]
    };
  },
  methods: {
    change(val) {
      this.$emit("update:val", val);
      this.$emit("change", val);
    },
    confirmTime() {
      this.dialogVisible = false;
      this.change(this.customVal);
    }
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"]),
    ...mapGetters("cis", ["commonWestDrugData"])
  },
  watch: {
    receivePatientData: {
      immediate: true,
      deep: true,
      handler(val) {
        this.customVal = [
          new Date().format("yyyy-MM-dd") + " 00:00:00",
          new Date().format("yyyy-MM-dd") + " 23:59:59"
        ]
      }
    }
  },
};
</script>
<style scoped lang="scss">
.container {
  width: 135px;
  height: 36px;
  line-height: 36px;
  border: 1px solid $l-color-bgcolor-11;
  padding: 0px 5px;
  color: $l-color-fontcolor-4;
}
.item {
  margin: 0px 5px;
}
.item-act {
  color: $l-color-fontcolor-3;
}
.date-choose {
  text-align: center;
}
</style>