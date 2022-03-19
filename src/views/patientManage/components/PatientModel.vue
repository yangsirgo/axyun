<template>
  <div class="width100 height100 position-relative container">
    <div class="left-container position-relative">
      <img :src="modelPath" alt="患者模型" class="model-img" />
      <div
        :class="[
          'point',
          'test-point1',
          'cursor-pointer',
          cur == '1' ? 'act-point' : ''
        ]"
        @click="showInfo('1')"
      ></div>
      <div
        :class="[
          'point',
          'test-point2',
          'cursor-pointer',
          cur == '2' ? 'act-point' : ''
        ]"
        @click="showInfo('2')"
      ></div>
    </div>
    <div class="right-container height100 position-relative">
      <div class="base-info width100">
        <span class="base-item">
          身高：
          <span class="item-content">180cm</span>
        </span>
        <span class="base-item">
          体重：
          <span class="item-content">70kg</span>
        </span>
        <span class="base-item">
          BMI：
          <span class="item-content">40.9</span>
        </span>
        <div class="inline-block block-item-container">
          <div
            v-for="(item, index) in bmiValues"
            :key="index"
            :style="{ background: item.color, width: item.width }"
            class="block-item inline-block postion-relative"
          >
            <i class="block-item-text" :style="{ color: item.color }">{{
              item.value
            }}</i>
          </div>
        </div>
      </div>
      <div class="table-info width100">
        <el-table
          ref="tableElem"
          :data="tableData"
          border
          tooltip-effect="dark"
          style="width: 100%;"
          height="117px"
        >
          <el-table-column
            prop="name"
            label="诊断名称"
            min-width="100"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="doctor"
            label="诊断医生"
            min-width="100"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="time"
            label="诊断时间"
            min-width="150"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="organ"
            label="医疗机构"
            min-width="200"
            show-overflow-tooltip
          ></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["pid"],
  data() {
    return {
      cur: "",
      modelPath: require("@/assets/anthropogram.png"),
      tableData: [
        {
          name: "阑尾炎",
          doctor: "王刚",
          time: "2019-1-8",
          organ: "天津市第一人民医院"
        },
        {
          name: "肩周炎",
          doctor: "李宏",
          time: "2018-11-8",
          organ: "北京市武警医院"
        }
      ],
      bmiValues: [
        {
          color: "#67c23a",
          width: "70px",
          value: 18.5
        },
        {
          color: "#6478d3",
          width: "100px",
          value: 24
        },
        {
          color: "#ffb11b",
          width: "140px",
          value: 30.5
        },
        {
          color: "#ff4040",
          width: "50px",
          value: 50
        }
      ]
    };
  },
  watch: {
    pid() {}
  },
  methods: {
    showInfo(number) {
      if (number == "1") {
        this.tableData = [
          {
            name: "阑尾炎",
            doctor: "王刚",
            time: "2019-1-8",
            organ: "天津市第一人民医院"
          }
        ];
      } else if (number == "2") {
        this.tableData = [
          {
            name: "肩周炎",
            doctor: "李宏",
            time: "2018-11-8",
            organ: "北京市武警医院"
          }
        ];
      }
      this.cur = number;
    }
  }
};
</script>
<style lang="scss">
.container {
  border: 1px solid $l-color-bgcolor-11;
}
.left-container {
  width: 150px;
  height: 100%;
  float: left;
  text-align: center;
  border-right: 1px solid $l-color-bgcolor-11;
}
.right-container {
  margin-left: 150px;
}
.base-info {
  height: 40px;
  padding: 10px;
  font-size: 16px;
  color: $l-color-fontcolor-4;
}
.table-info {
  position: absolute;
  top: 40px;
  bottom: 10px;
}
.point {
  width: 8px;
  height: 8px;
  border-radius: 8px;
  background: #e4e4e4;
  border: 1px solid $l-color-border-1;
}
.test-point1 {
  position: absolute;
  left: 48%;
  top: 44%;
}
.test-point2 {
  position: absolute;
  left: 58%;
  top: 20%;
}
.model-img {
  height: 90%;
  margin-top: 5%;
}
.base-item {
  margin-right: 20px;
}
.act-point {
  background: $l-color-bgcolor-5;
}
.item-content {
  font-weight: 500;
  color: $l-color-fontcolor-3;
}

.block-item {
  height: 14px;
}
.block-item-text {
  position: absolute;
  top: 26px;
  font-size: 12px;
}
</style>
