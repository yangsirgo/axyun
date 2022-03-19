<template>
  <div class="statistics height100">
    <el-table :data="tableData" width="100%" height="100%" stripe border>
      <el-table-column
        v-for="(item, index) in tableParams"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :min-width="item.width"
        :align="item.align || 'center'"
        :header-align="item.headerAlign || 'center'"
      >
        <template v-for="(value, key) in item.children">
          <el-table-column
            v-if="value.children && value.children.length"
            :key="key"
            :prop="value.prop"
            :label="value.label"
            :min-width="value.width"
            :align="value.align || 'center'"
            :header-align="value.headerAlign || 'center'"
          >
            <template v-for="(v, k) in value.children">
              <el-table-column
                :key="k"
                :prop="v.prop"
                :label="v.label"
                :min-width="v.width"
                :align="v.align || 'center'"
                :header-align="v.headerAlign || 'center'"
              ></el-table-column>
            </template>
          </el-table-column>
          <el-table-column
            v-else
            :key="key"
            :prop="value.prop"
            :label="value.label"
            :min-width="value.width"
            :align="value.align || 'center'"
            :header-align="value.headerAlign || 'center'"
          >
            <template slot-scope="scope">{{
              scope["row"][value.prop]
            }}</template>
          </el-table-column>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import { deepClone } from "@/utils/index";

export default {
  name: "statistics",
  props: {
    docTableData: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      tableData: [
        {
          type: "最大值"
        },
        {
          type: "最小值"
        },
        {
          type: "平均值"
        },
        {
          type: "总和"
        }
      ],
      tableParams: [
        {
          prop: "dataStatistics",
          label: "数据统计",
          children: [
            {
              prop: "type",
              label: "统计类型",
              width: "100"
            }
          ]
        }
      ],
      nursingTreeDataSave: [],
      inListObj: {},
      outListObj: {}
    };
  },
  computed: {
    ...mapGetters("nurseDocument", ["nursingTreeData"])
  },
  watch: {
    nursingTreeData: {
      handler(val) {
        this.nursingTreeDataSave = [];
        if (val && val.length > 0) {
          this.nursingTreeDataSave = [...val];
        }
      },
      immediate: true,
      deep: true
    }
  },
  async created() {
    await this.tableInit();
  },
  methods: {
    // eslint-disable-next-line complexity
    async tableInit() {
      let docTableData = [];
      let data = deepClone(this.docTableData);
      for (let i in data) {
        if (data[i]["recordId"] && !data[i]["isVerify"]) {
          docTableData.push(data[i]);
        }
      }
      // console.log(docTableData);
      let eleEventList = this.nursingTreeDataSave[0].eleEventList;
      for (let i in eleEventList) {
        let items = eleEventList[i];
        if (!items.EveList || !items.EveList.length) {
          continue;
        }
        if (items.EveCode == "CDEE_Quantity") {
          let EveListObj = items.EveListObj;
          let quantityObj = items.allObj.quantity;
          //判断入量名称与入量量、出量
          let inName = quantityObj.inQuantity.eleList[0].nameList;
          let inNum = quantityObj.inQuantity.eleList[0].valueList;
          let outName = quantityObj.outQuantity.eleList[0].nameList;
          let outNum = quantityObj.outQuantity.eleList[0].valueList;
          //出入量录入项目集合
          let arrIn = [];
          let arrOut = [];
          //统计项目最大值、最小值、总值
          let maxIn = {};
          let minIn = {};
          let maxOut = {};
          let minOut = {};
          let allIn = {};
          let allOut = {};
          await this.docTableData.forEach((item, index) => {
            arrIn.push(item.inTableDataProp);
            arrOut.push(item.outTableDataProp);
          });
          // console.log("arrIn", arrIn);
          // console.log("arrOut", arrOut);

          for (let i in arrIn) {
            let item = arrIn[i];
            for (let j in item) {
              let value = item[j];
              maxIn[value[inName.eleId]] =
                !Number(maxIn[value[inName.eleId]]) ||
                Number(maxIn[value[inName.eleId]]) < Number(value[inNum.eleId])
                  ? Number(value[inNum.eleId])
                  : Number(maxIn[value[inName.eleId]]);
              minIn[value[inName.eleId]] =
                !Number(minIn[value[inName.eleId]]) ||
                Number(minIn[value[inName.eleId]]) > Number(value[inNum.eleId])
                  ? Number(value[inNum.eleId])
                  : Number(minIn[value[inName.eleId]]);
              allIn[value[inName.eleId]] =
                (Number(allIn[value[inName.eleId]]) || 0) +
                Number(value[inNum.eleId]);
            }
          }
          // console.log("maxIn", maxIn);
          // console.log("minIn", minIn);
          // console.log("allIn", allIn);
          for (let i in arrOut) {
            let item = arrOut[i];
            for (let j in item) {
              let value = item[j];
              maxOut[value[outName.eleId]] =
                !Number(maxOut[value[outName.eleId]]) ||
                Number(maxOut[value[outName.eleId]]) <
                  Number(value[outNum.eleId])
                  ? Number(value[outNum.eleId])
                  : Number(maxOut[value[outName.eleId]]);
              minOut[value[outName.eleId]] =
                !Number(minOut[value[outName.eleId]]) ||
                Number(minOut[value[outName.eleId]]) >
                  Number(value[outNum.eleId])
                  ? Number(value[outNum.eleId])
                  : Number(minOut[value[outName.eleId]]);
              allOut[value[outName.eleId]] =
                (Number(allOut[value[outName.eleId]]) || 0) +
                Number(value[outNum.eleId]);
            }
          }
          // console.log("maxOut", maxOut);
          // console.log("minOut", minOut);
          // console.log("allOut", allOut);

          //项目最大值
          let maxInAll = 0;
          let minInAll = 0;
          let maxOutAll = 0;
          let minOutAll = 0;
          for (let i in maxIn) {
            maxInAll =
              maxInAll < Number(maxIn[i]) ? Number(maxIn[i]) : maxInAll;
          }
          for (let i in minIn) {
            minInAll =
              !minInAll || minInAll > Number(minIn[i])
                ? Number(minIn[i])
                : minInAll;
          }
          // console.log(maxInAll, minInAll);
          for (let i in maxOut) {
            maxOutAll =
              maxOutAll < Number(maxOut[i]) ? Number(maxOut[i]) : maxOutAll;
          }
          for (let i in minOut) {
            minOutAll =
              !minOutAll || minOutAll > Number(minOut[i])
                ? Number(minOut[i])
                : minOutAll;
          }
          // console.log(maxOutAll, minOutAll);

          //录入项目平均值
          let aveIn = {};
          let aveOut = {};
          for (let i in allIn) {
            aveIn[i] = (allIn[i] / this.docTableData.length).toFixed(2);
          }
          // console.log("aveIn", aveIn);
          for (let i in allOut) {
            aveOut[i] = (allOut[i] / this.docTableData.length).toFixed(2);
          }
          // console.log("aveOut", aveOut);

          /* 渲染表头--start */
          let inParentEle = quantityObj.inQuantity.parent;
          let outParentEle = quantityObj.outQuantity.parent;
          let inList = [];
          let outList = [];
          let ii = 0;
          let jj = 0;
          for (let i in allIn) {
            ii++;
            inList.push({
              label: i,
              prop: "in" + ii,
              width: 100
            });
            //全局映射关系
            this.inListObj[i] = "in" + ii;
          }
          for (let j in allOut) {
            jj++;
            outList.push({
              label: j,
              prop: "out" + jj,
              width: 100
            });
            //全局映射关系
            this.outListObj[j] = "out" + jj;
          }
          this.tableParams[0].children.push({
            ...inParentEle,
            prop: inParentEle.eleId,
            label: inParentEle.placeholderText || inParentEle.elementName,
            children: inList
          });
          this.tableParams[0].children.push({
            ...quantityObj.inQuantity.allEle,
            prop: quantityObj.inQuantity.allEle.eleId,
            label:
              quantityObj.inQuantity.allEle.placeholderText ||
              quantityObj.inQuantity.allEle.elementName
          });
          this.tableParams[0].children.push({
            ...outParentEle,
            prop: outParentEle.eleId,
            label: outParentEle.placeholderText || outParentEle.elementName,
            children: outList
          });
          this.tableParams[0].children.push({
            ...quantityObj.outQuantity.allEle,
            prop: quantityObj.outQuantity.allEle.eleId,
            label:
              quantityObj.outQuantity.allEle.placeholderText ||
              quantityObj.outQuantity.allEle.elementName
          });
          /* 渲染表头--end */

          /* 渲染值 */
          //1。最大值
          for (let i in maxIn) {
            this.$set(this.tableData[0], this.inListObj[i], maxIn[i]);
          }
          this.$set(
            this.tableData[0],
            quantityObj.inQuantity.allEle.eleId,
            maxInAll
          );
          for (let i in maxOut) {
            this.$set(this.tableData[0], this.outListObj[i], maxOut[i]);
          }
          this.$set(
            this.tableData[0],
            quantityObj.outQuantity.allEle.eleId,
            maxOutAll
          );
          //2.最小值
          for (let i in minIn) {
            this.$set(this.tableData[1], this.inListObj[i], minIn[i]);
          }
          this.$set(
            this.tableData[1],
            quantityObj.inQuantity.allEle.eleId,
            minInAll
          );
          for (let i in minOut) {
            this.$set(this.tableData[1], this.outListObj[i], minOut[i]);
          }
          this.$set(
            this.tableData[1],
            quantityObj.outQuantity.allEle.eleId,
            minOutAll
          );
          //4.总和
          let allInNum = 0; //入量总和
          for (let i in allIn) {
            this.$set(this.tableData[3], this.inListObj[i], allIn[i]);
            allInNum += Number(allIn[i]);
          }
          this.$set(
            this.tableData[3],
            quantityObj.inQuantity.allEle.eleId,
            allInNum
          );
          let allOutNum = 0; //出量总和
          for (let i in allOut) {
            this.$set(this.tableData[3], this.outListObj[i], allOut[i]);
            allOutNum += Number(allOut[i]);
          }
          this.$set(
            this.tableData[3],
            quantityObj.outQuantity.allEle.eleId,
            allOutNum
          );
          //3.平均值
          for (let i in aveIn) {
            this.$set(this.tableData[2], this.inListObj[i], aveIn[i]);
          }
          this.$set(
            this.tableData[2],
            quantityObj.inQuantity.allEle.eleId,
            (allInNum / this.docTableData.length).toFixed(2)
          );
          for (let i in aveOut) {
            this.$set(this.tableData[2], this.outListObj[i], aveOut[i]);
          }
          this.$set(
            this.tableData[2],
            quantityObj.outQuantity.allEle.eleId,
            (allOutNum / this.docTableData.length).toFixed(2)
          );
          /* 渲染值 */
        }
      }
    }
  }
};
</script>
<style scoped lang="scss">
.statistics {
}
</style>
