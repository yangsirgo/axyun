<template>
  <div class="page infectionLeftWrap">
    <el-collapse v-model="activeNames" @change="handleChange">
      <l-collapse-item name="1">
        <template slot="title">
          <div class="title title-style">
            <span class="templetName"
              >传染性疾病<span v-if="dataWrap.infectiousDiseaseCardCount"
                >({{ dataWrap.infectiousDiseaseCardCount }})</span
              ></span
            >
            <el-button
              class="titleStyle"
              type=""
              @click.stop.prevent="addFun('a')"
              icon="el-icon-circle-plus-outline"
            ></el-button>
          </div>
        </template>
        <template slot="content">
          <div
            class="content-list"
            v-for="(item, index) in dataWrap.infectiousDiseaseCardList"
            :key="index"
            :class="{
              'content-list-style':
                currentObj.contentListindex === index &&
                currentObj.activeName === 'a',
            }"
            @click.stop="contentListFun('a', item, index)"
          >
            <div class="contentStyle">
              <span>{{ item.diagName || "无" }}</span>
              <span class="contentStyle-right" v-if="item.state == '1'"
                >暂存</span
              >
              <span class="contentStyle-right" v-else-if="item.state == '2'"
                >待审</span
              >
              <span class="contentStyle-right" v-else-if="item.state == '3'"
                >已审</span
              >
              <span class="contentStyle-right" v-else-if="item.state == '4'"
                >已审</span
              >
            </div>
            <div class="contentStyle">
              <span>{{ item.keshi || "无" }}</span>
              <span>{{ item.contrastDoctor || "无" }}</span>
            </div>
            <div class="contentStyle">
              {{ item.outfitPlace || "无" }}
            </div>
            <div class="contentStyle">
              <span>{{ item.jiuzhenDate || "无" }}</span>
              <span
                ><el-button
                  @click="deleteHandler(item)"
                  class="filter-item"
                  type="text"
                  icon="iconfont iconshanchu"
                  :disabled="item.state == '2'"
                ></el-button
              ></span>
            </div>
          </div>

          <div
            v-if="!dataWrap.infectiousDiseaseCardList"
            style="
              width: 100%;
              height: 200px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #c0c4cc;
            "
          >
            暂无数据
          </div>
        </template>
      </l-collapse-item>

      <l-collapse-item name="2">
        <template slot="title">
          <div class="title title-style">
            <span class="templetName"
              >食源性疾病
              <span v-if="dataWrap.foodBorneCardCount"
                >({{ dataWrap.foodBorneCardCount }})</span
              ></span
            >
            <el-button
              class="titleStyle"
              type=""
              @click.stop.prevent="addFun('b')"
              icon="el-icon-circle-plus-outline"
            ></el-button>
          </div>
        </template>
        <template slot="content">
          <div
            class="content-list"
            v-for="(item, index) in dataWrap.foodBorneCardVOList"
            :key="index"
            :class="{
              'content-list-style':
                currentObj.contentListindex === index &&
                currentObj.activeName === 'b',
            }"
            @click="contentListFun('b', item, index)"
          >
            <div class="contentStyle">
              <span>{{ item.diagName }}</span>
              <span class="contentStyle-right" v-if="item.state == '1'"
                >暂存</span
              >
              <span class="contentStyle-right" v-else-if="item.state == '2'"
                >待审</span
              >
              <span class="contentStyle-right" v-else-if="item.state == '3'"
                >已审</span
              >
              <span class="contentStyle-right" v-else-if="item.state == '4'"
                >已审</span
              >
            </div>
            <div class="contentStyle">
              <span>{{ item.keshi || "无" }}</span>
              <span>{{ item.contrastDoctor || "无" }}</span>
            </div>
            <div class="contentStyle">
              {{ item.outfitPlace || "无" }}
            </div>
            <div class="contentStyle">
              {{ item.visDate || "无" }}
            </div>
          </div>

          <div
            v-if="!dataWrap.foodBorneCardVOList"
            style="
              width: 100%;
              height: 200px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #c0c4cc;
            "
          >
            暂无数据
          </div>
        </template>
      </l-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { deepClone } from "@/utils/index.js";
import { reportCardInfoByPId } from "@/api/common/report.js";
import { deleteInfectiousDiseaseCard } from "@/api/common/report.js";
export default {
  components: {},
  computed: {
    ...mapGetters(["name", "receivePatientData"]),
  },
  data() {
    return {
      activeNames: ["1"],
      currentObj: {
        activeName: "",
        contentListindex: "",
      },
      tableData: [
        {
          name: "传染性疾病",
        },
        {
          name: "食源性疾病",
        },
      ],
      dataWrap: {},
      pageParams: {
        pId: "",
        inpNo: "",
      },
    };
  },

  created() {
    // console.log(this.receivePatientData, "左侧的数据传输")
  },
  methods: {
    handleChange() {
      // this.reportCardInfoByPId(this.pageParams);
    },
    contentListFun(activeName, item, index) {
      this.currentObj = {
        activeName,
        contentListindex: index,
      };
      this.$emit("contentListFunRightData", activeName, deepClone(item));
    },
    // 添加
    addFun(a) {
      if (!this.receivePatientData.patientId) {
        this.$message.error("请在左侧列表里选择患者！");
      } else {
        this.$emit("addFun", a);
      }
    },
    // 刷新
    reportCardInfoByPIdRefresh(data) {
      this.reportCardInfoByPId(this.pageParams, data);
    },

    // 回去左边的列表的数据
    async reportCardInfoByPId(data, currentData) {
      this.currentObj = {
        activeName: "",
        contentListindex: "",
      };
      if (!data.inpNo) {
        this.$message.error("请选择患者");
        return false;
      }
      let res = await reportCardInfoByPId(data);
      if (res.code == "1") {
        this.dataWrap = res.data;
        let infectiousDiseaseCardList = res.data.infectiousDiseaseCardList;
        let foodBorneCardVOList = res.data.foodBorneCardVOList;
        if (currentData && currentData.cardId) {
          if (
            currentData.activeName === "a" &&
            infectiousDiseaseCardList &&
            infectiousDiseaseCardList.length
          ) {
            let obj = {};
            let indexed = "";
            for (let i in infectiousDiseaseCardList) {
              let item = infectiousDiseaseCardList[i];
              if (item.cardId === currentData.cardId) {
                obj = item;
                indexed = i;
                break;
              }
            }
            if (indexed !== "") {
              this.contentListFun(currentData.activeName, obj, Number(indexed));
            }
          } else if (
            currentData.activeName === "b" &&
            foodBorneCardVOList &&
            foodBorneCardVOList.length
          ) {
            let obj = {};
            let indexed = "";
            for (let i in foodBorneCardVOList) {
              let item = foodBorneCardVOList[i];
              if (item.cardId === currentData.cardId) {
                obj = item;
                indexed = i;
                break;
              }
            }
            if (indexed !== "") {
              this.contentListFun(currentData.activeName, obj, Number(indexed));
            }
          }
        } else if (
          infectiousDiseaseCardList &&
          infectiousDiseaseCardList.length
        ) {
          this.contentListFun("a", infectiousDiseaseCardList[0], 0);
        } else {
          this.contentListFun("", {}, "");
        }
      } else {
        this.$message.error(res.msg || "请添加报卡数据");
      }
    },
    // 删除传染病报卡
    deleteHandler(row) {
      this.$confirm("是否确认删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        try {
          let res = await deleteInfectiousDiseaseCard(row);
          if (res.code === 1) {
            this.$message.success("删除成功！");
            await this.reportCardInfoByPId(this.pageParams);
          } else {
            this.$message.error(res.msg || "删除失败！");
          }
        } catch (error) {}
      });
    },
  },
  watch: {
    receivePatientData: {
      immediate: true,
      deep: true,
      //深度监听,可监听到对象、数组的变化
      handler(val) {
        this.pageParams.pId = this.receivePatientData.patientId;
        this.pageParams.inpNo = this.receivePatientData.visitCode;
        this.reportCardInfoByPId(this.pageParams);
      },
    },
  },
};
</script>

<style scoped lang="scss">
.infectionLeftWrap {
  height: 100%;
  overflow: auto;
  background-color: #f3f4f5;
  /deep/ .el-collapse-item__content {
    height: 350px;
    max-width: 350px;
    overflow: auto;
  }
  .title-style {
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    // justify-content: center;
    position: relative;
  }
  /deep/ .el-collapse-item .el-collapse-item__content {
    padding-left: 0px;
  }
  .titleStyle {
    position: absolute;
    right: 15px;
    top: 5px;
  }

  //下面列表的内容
  .contentStyle {
    // border-bottom: 1px solid #C2CCD1;
    padding: 5px 8px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .contentStyle-right {
      color: red;
    }
  }
  .content-list {
    border-bottom: 1px solid #c1c5cd;
  }
  .content-list-style {
    background-color: #c0c4cc;
  }
}
</style>
