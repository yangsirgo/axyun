<template>
  <div class="width100 height100" v-loading="loading">
    <div class="top-container">
      <!-- 类型下拉 -->
      <!-- <l-value-domain
        :code="code"
        :value.sync="typeVal"
        @change="typeChange"
        class="select-container"
        :placeholder="$t('base.placeholder')"
      />-->
      <!-- 时间选择 -->
      <time-tab class="width100" :val.sync="timeVal" @change="timeChanage" />
    </div>
    <div
      class="content overflow-scroll-vertical"
      v-infinite-scroll="loadNextPage"
      infinite-scroll-disabled="listDisabled"
    >
      <el-collapse v-model="activeNames">
        <l-collapse-item
          sty="2"
          v-for="(item, index) in listData"
          :key="'list' + index"
          :name="index"
        >
          <template slot="title">
            <div class="width100">
              <span>{{ item.createdAt }}</span>
              <div
                v-if="activeNames.indexOf(index) != -1"
                @click.stop="quote(item)"
                class="float-right quote-button mini-button"
                type="primary"
              >
                {{ $t("base.quote") }}
              </div>
            </div>
          </template>
          <template slot="content">
            <el-table
              ref="tableElem"
              :data="[item]"
              border
              tooltip-effect="dark"
              style="width: 100%;"
            >
              <el-table-column
                prop="name"
                :label="$t('base.toolBox.projectName')"
                min-width="102"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="spec"
                :label="$t('base.toolBox.spec')"
                min-width="85"
              ></el-table-column>
            </el-table>
          </template>
        </l-collapse-item>
        <p v-if="loading" class="load-list-bottom">{{ $t("base.loading") }}</p>
        <p v-if="noMore" class="load-list-bottom">{{ $t("base.noMore") }}</p>
      </el-collapse>
    </div>
  </div>
</template>
<script>
  import TimeTab from "@/views/public/component/TimeTab";
  import InfiniteList from "@/views/public/component/InfiniteList";
  import { getBhHistoryByPatient } from "@/api/tools/PreviousPrescriptions";
  import { getRecipeCode, saveOrders } from "@/api/cis/order/order";
  import { mapGetters } from "vuex";

  // 历次处方
  export default {
    components: {
      TimeTab,
      InfiniteList
    },
    data() {
      return {
        // 类型数据code
        code: "VisitingCategoryCode",
        // 类型值
        typeVal: "",

        // 时间值
        // [0](半年)
        // [1](一年)
        // [2019-1-1,2019-2-1](自定义)
        timeVal: [0],

        activeNames: [],

        // 列表数据
        listData: [],
        // 分页控制参数
        pageParams: {
          pageNo: 0, // 当前页数
          total: 5, // 总共页数
          pageSize: 20 // 每页数据条数
        },
        // 列表状态控制
        loading: false
      };
    },
    computed: {
      ...mapGetters("base", ["receivePatientData"]),
      listDisabled() {
        return this.loading || this.noMore;
      },
      noMore() {
        return (
          Math.ceil(this.pageParams.total / this.pageParams.pageSize) <=
          this.pageParams.pageNo
        );
      }
    },
    mounted() {
      this.loadTable();
    },
    watch: {
      receivePatientData: {
        handler(n) {
          this.loadTable();
        },
        deep: true
      }
    },
    methods: {
      // 加载列表数据
      async loadTable() {
        // console.log("loadTable");
        // console.info(this.$store.state.cis);
        if (!this.receivePatientData.patientId) {
          this.tableData = [];
          return;
        }
        try {
          this.tlm_isLoading = true;
          // TODO await request

          let params = {
            clinicType: this.typeVal,
            timeVal: this.timeVal[0],
            patientId: this.receivePatientData.patientId,
            ...this.pageParams
          };
          if (this.timeVal.length > 1) {
            params.timeVal = 3;
            params["startTime"] = this.timeVal[0];
            params["endTime"] = this.timeVal[1];
          }

          let response = await getBhHistoryByPatient(params);
          // console.log("aa:",response);
          /* let listData = this.convertData(response.data); */
          this.listData = response.data;
          this.pageParams = { ...response.pageParams };
          // console.log("hh:",this.pageParams);
          this.loading = false;
        } catch (error) {
          this.loading = false;
          this.$message.error(error.msg);
        }
      },
      //后台接收数据后，转化成前台需要的数据类型
      convertData(data) {
        let listData = [];
        let codeData = [];
        let timeData = [];
        // 数据处理
        for (let i in data) {
          if (codeData.indexOf(data[i].recipeCode) === -1) {
            codeData.push(data[i].recipeCode);
          }
        }
        for (let s in codeData) {
          let recipeData = [];
          for (let i = 0; i < data.length; i++) {
            if (data[i].recipeCode === codeData[s]) {
              recipeData.push({
                diagnosisTime: data[i].createdAt || "",
                useWay: data[i].useWay || "", //用法
                quantity: data[i].quantity || "", //数量
                frequencyCode: data[i].frequencyCode || "", //频率
                onceDosage: data[i].onceDosage || "", //单次计量
                skinTest: data[i].skinTest || "", //皮试
                dropRate: data[i].dropRate || "", //滴速
                administrationTimeCode: data[i].administrationTimeCode || "", // 给药时间
                orderItemName: data[i].orderItemName || "",
                spec: data[i].spec || "",
                orderCat: data[i].orderCat,
                price: data[i].price,
                dosage: data[i].dosage,
                packQuantity: data[i].packQuantity,
                dosageUnit: data[i].dosageUnit,
                orderItemId: data[i].orderItemId,
                orderItemCat: data[i].orderItemCat,
                receiveDept: data[i].receiveDept,
                manageType: data[i].manageType,
                formCode: data[i].formCode,
                unitSaleFlg: data[i].unitSaleFlg,
                unit: data[i].limitUnit,
                packUnit: data[i].unit,
                day: data[i].day,
                stClassCode: data[i].stClassCode || "",
                amt: data[i].amt || "",
                remark: data[i].remark || "",
                excessReason: data[i].excessReason || "",
                execDeptId: data[i].execDeptId,
                execDeptName: data[i].execDeptName
              });
            }
          }
          timeData.push(recipeData);
        }

        for (let i = 0; i < timeData.length; i++) {
          listData.push({
            title: timeData[i][0].createdAt,
            tableData: timeData[i]
            /*tableData: [
              {
                useWay: data[i].useWay || "",//用法
                quantity: data[i].quantity || "" ,//数量
                frequencyCode: data[i].frequencyCode || "",//频率
                onceDosage : data[i].onceDosage || "",//单次计量
                skinTest : data[i].skinTest || "",//皮试
                dropRate : data[i].dropRate || "",//滴速
                administrationTimeCode : data[i].administrationTimeCode || "",  // 给药时间
                orderItemName: data[i].orderItemName || "",
                spec: data[i].spec || "",
                orderCat: data[i].orderCat,
                price: data[i].price,
                dosage: data[i].dosage,
                packQuantity: data[i].packQuantity,
                dosageUnit: data[i].dosageUnit,
                orderItemId: data[i].orderItemId,
                orderItemCat: data[i].orderItemCat,
                receiveDept: data[i].receiveDept,
                manageType: data[i].manageType,
                formCode: data[i].formCode,
                unitSaleFlg: data[i].unitSaleFlg,
                unit: data[i].limitUnit,
                packUnit: data[i].unit,
                stClassCode: data[i].stClassCode || "",
                amt: data[i].amt || "",
                remark: data[i].remark || "",
                excessReason : data[i].excessReason || "",
                execDeptId: data[i].execDeptId,
                execDeptName: data[i].execDeptName,
              }
            ]*/
          });
        }
        return listData;
      },
      // 加载下一页
      loadNextPage() {
        if (this.noMore) {
          return;
        }
        this.pageParams.pageNo++;
        this.loadTable();
      },
      // 时间范围切换
      timeChanage() {
        console.log("timeChanage", this.timeVal);
        this.loadTable();
      },
      // 类型切换
      typeChange() {
        console.log("typeChange", this.typeVal);
        this.loadTable();
      },
      // 引用
      async quote(data) {
        // 获取引用历次处方
        let result = [];
        let patient = this.receivePatientData;
        // let rpData = this.$store.state.cis.RpTableData;
        // 获取处方号
        let rep = await getRecipeCode({ visitCode: patient.visitCode });
        // console.info(rep);
        // 处方号
        let rpNo = "";
        if (rep.code === 1) {
          rpNo = rep.data;
          for (let i = 0; i < data.tableData.length; i++) {
            result.push({
              ...data.tableData[i],
              ...{
                recipeCode: rpNo,
                patientId: patient.patientId,
                patientName: patient.patientName,
                visitCode: patient.visitCode
              }
            });
          }
        } else {
          this.$message.error(rep.msg || " 获取处方号失败！");
          return false;
        }

        // 引用到医嘱列表中
        let reps = await saveOrders(result);
        if (reps.code === 1) {
          // 更新医嘱列表
          /* for (let i = 0; i < result.length; i++) {
            // 直接赋值处方号，可解决异步为获取处方号bug
            result[i].recipeCode = rpNo;
            rpData.push(result[i]);
          }
          this.$store.state.cis.RpTableData = rpData;*/
          this.$message.success(reps.msg ? reps.msg : "医嘱引用成功");
          // save btn 存储 数据
          this.$emit("message");
          this.$emit("save");
        } else {
          this.$message.error(reps.msg ? reps.msg : "医嘱引用失败");
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  .top-container {
    height: 60px;
  }
  .select-container {
    width: 80px;
  }
  .content {
    position: absolute;
    top: 51px;
    bottom: 0px;
    left: 10px;
    right: 10px;
  }
  .act-word {
    color: $l-color-fontcolor-2;
  }
  .quote-button {
    margin-top: 10px;
  }
</style>
